// © Edmund Wallner
use rusqlite::Connection;

pub fn create_schema(conn: &Connection) {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS program_increments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pi_name TEXT NOT NULL UNIQUE,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status TEXT CHECK(status IN ('Planned','Active','Completed')) DEFAULT 'Planned'
        );

        CREATE TABLE IF NOT EXISTS people (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE,
            department TEXT,
            cost_center TEXT,
            hub TEXT,
            company TEXT,
            active BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS solutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS arts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            solution_id INTEGER,
            name TEXT NOT NULL,
            FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS product_teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            art_id INTEGER,
            name TEXT NOT NULL,
            FOREIGN KEY (art_id) REFERENCES arts(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS solution_leadership (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            solution_id INTEGER NOT NULL,
            person_id INTEGER NOT NULL,
            role TEXT CHECK(role IN ('Solution Manager','Solution Architect','STE','Solution Business Owner')),
            fte_percent INTEGER DEFAULT 100,
            pi_id INTEGER NOT NULL,
            FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
            FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
            FOREIGN KEY (pi_id) REFERENCES program_increments(id)
        );

        CREATE TABLE IF NOT EXISTS art_leadership (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            art_id INTEGER NOT NULL,
            person_id INTEGER NOT NULL,
            role TEXT CHECK(role IN ('Product Manager','System Architect','RTE','Business Owner')),
            fte_percent INTEGER DEFAULT 100,
            pi_id INTEGER NOT NULL,
            FOREIGN KEY (art_id) REFERENCES arts(id) ON DELETE CASCADE,
            FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
            FOREIGN KEY (pi_id) REFERENCES program_increments(id)
        );

        CREATE TABLE IF NOT EXISTS memberships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            person_id INTEGER NOT NULL,
            role TEXT CHECK(role IN ('PO','SM','Dev')),
            fte_percent INTEGER DEFAULT 100,
            pi_id INTEGER NOT NULL,
            FOREIGN KEY (team_id) REFERENCES product_teams(id) ON DELETE CASCADE,
            FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
            FOREIGN KEY (pi_id) REFERENCES program_increments(id)
        );

        CREATE TABLE IF NOT EXISTS cost_rates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hub_code TEXT NOT NULL,
            department TEXT NOT NULL,
            role_level TEXT NOT NULL,
            daily_rate REAL NOT NULL,
            effective_pi TEXT NOT NULL
        );
        ",
    )
    .expect("Failed to create schema");
}
