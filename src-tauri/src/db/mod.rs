// © Edmund Wallner - Mercedes-Benz AG
pub mod schema;
pub mod seed;

use rusqlite::Connection;
use std::sync::Mutex;

pub struct Database(pub Mutex<Connection>);

fn migrate(conn: &Connection) {
    let version: i64 = conn
        .query_row("PRAGMA user_version", [], |row| row.get(0))
        .unwrap_or(0);

    if version < 1 {
        // Migration: make arts.solution_id and product_teams.art_id nullable with ON DELETE SET NULL
        // Check if arts table still lacks ON DELETE SET NULL (old schema)
        let needs_migration = conn
            .query_row(
                "SELECT sql FROM sqlite_master WHERE type='table' AND name='arts'",
                [],
                |row| row.get::<_, String>(0),
            )
            .map(|sql| !sql.contains("ON DELETE SET NULL"))
            .unwrap_or(false);

        if needs_migration {
            conn.execute_batch("PRAGMA foreign_keys=OFF;").ok();
            conn.execute_batch(
                "
                CREATE TABLE arts_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    solution_id INTEGER,
                    name TEXT NOT NULL,
                    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE SET NULL
                );
                INSERT INTO arts_new (id, solution_id, name) SELECT id, solution_id, name FROM arts;
                DROP TABLE arts;
                ALTER TABLE arts_new RENAME TO arts;

                CREATE TABLE product_teams_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    art_id INTEGER,
                    name TEXT NOT NULL,
                    FOREIGN KEY (art_id) REFERENCES arts(id) ON DELETE SET NULL
                );
                INSERT INTO product_teams_new (id, art_id, name) SELECT id, art_id, name FROM product_teams;
                DROP TABLE product_teams;
                ALTER TABLE product_teams_new RENAME TO product_teams;
                "
            ).expect("Migration v1 failed");
            conn.execute_batch("PRAGMA foreign_keys=ON;").ok();
        }

        conn.execute_batch("PRAGMA user_version = 1;").ok();
    }
}

pub fn init_database(db_path: &str) -> Database {
    let conn = Connection::open(db_path).expect("Failed to open database");
    conn.execute_batch("PRAGMA journal_mode=WAL;").ok();
    conn.execute_batch("PRAGMA foreign_keys=ON;").ok();

    schema::create_schema(&conn);
    migrate(&conn);

    // Seed only if DB is empty
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM program_increments", [], |row| row.get(0))
        .unwrap_or(0);
    if count == 0 {
        seed::seed_data(&conn);
    }

    Database(Mutex::new(conn))
}
