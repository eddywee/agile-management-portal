// © Edmund Wallner
use rusqlite::Connection;

pub fn seed_data(conn: &Connection) {
    // PIs
    conn.execute_batch(
        "
        INSERT INTO program_increments (pi_name, start_date, end_date, status) VALUES ('PI 24.3','2024-10-01','2024-12-31','Completed');
        INSERT INTO program_increments (pi_name, start_date, end_date, status) VALUES ('PI 24.4','2025-01-01','2025-03-31','Completed');
        INSERT INTO program_increments (pi_name, start_date, end_date, status) VALUES ('PI 25.1','2025-04-01','2025-06-30','Active');
        INSERT INTO program_increments (pi_name, start_date, end_date, status) VALUES ('PI 25.2','2025-07-01','2025-09-30','Planned');
        "
    ).expect("Failed to seed PIs");

    // Solutions
    conn.execute_batch(
        "
        INSERT INTO solutions (name, description) VALUES ('Cloud Platform','Enterprise cloud infrastructure and data management platform');
        INSERT INTO solutions (name, description) VALUES ('Analytics Solution','Business intelligence and advanced analytics platform');
        "
    ).expect("Failed to seed solutions");

    // ARTs
    conn.execute_batch(
        "
        INSERT INTO arts (solution_id, name) VALUES (1,'Platform ART');
        INSERT INTO arts (solution_id, name) VALUES (1,'Customer ART');
        INSERT INTO arts (solution_id, name) VALUES (2,'Data ART');
        INSERT INTO arts (solution_id, name) VALUES (2,'Insights ART');
        "
    ).expect("Failed to seed ARTs");

    // Teams
    conn.execute_batch(
        "
        INSERT INTO product_teams (art_id, name) VALUES (1,'Team Alpha');
        INSERT INTO product_teams (art_id, name) VALUES (1,'Team Beta');
        INSERT INTO product_teams (art_id, name) VALUES (1,'Team Gamma');
        INSERT INTO product_teams (art_id, name) VALUES (2,'Team Delta');
        INSERT INTO product_teams (art_id, name) VALUES (2,'Team Epsilon');
        INSERT INTO product_teams (art_id, name) VALUES (3,'Pipeline Team');
        INSERT INTO product_teams (art_id, name) VALUES (3,'Reporting Team');
        INSERT INTO product_teams (art_id, name) VALUES (4,'Insights Core');
        "
    ).expect("Failed to seed teams");

    // People
    let people = [
        ("Anna Miller", "a.miller@example.com", "ENG-PLT", "CC-1010", "New York", "Acme Corp"),
        ("Boris Chen", "b.chen@example.com", "ENG-PLT", "CC-1010", "Bangalore", "Acme R&D India"),
        ("James Smith", "j.smith@example.com", "ENG-CUS", "CC-1020", "New York", "Acme Corp"),
        ("Maria Weber", "m.weber@example.com", "ENG-DEV", "CC-1030", "Singapore", "Acme Asia Pacific"),
        ("Carlos Diaz", "c.diaz@example.com", "RD-DAT", "CC-2100", "New York", "Acme Corp"),
        ("Lisa Park", "l.park@example.com", "ENG-PLT", "CC-1010", "New York", "Acme Corp"),
        ("David Kim", "d.kim@example.com", "RD-DAT", "CC-2100", "Bangalore", "Acme R&D India"),
        ("Sophie Taylor", "s.taylor@example.com", "ENG-CUS", "CC-1020", "New York", "Acme Corp"),
        ("Marco Rossi", "m.rossi@example.com", "ENG-DEV", "CC-1030", "New York", "Acme Corp"),
        ("Yuki Tanaka", "y.tanaka@example.com", "RD-ANL", "CC-2200", "New York", "Acme Corp"),
        ("Priya Sharma", "p.sharma@example.com", "ENG-PLT", "CC-1010", "Bangalore", "Acme R&D India"),
        ("Thomas Brown", "t.brown@example.com", "ENG-PLT", "CC-1010", "New York", "Acme Corp"),
        ("Elena Voss", "e.voss@example.com", "RD-DAT", "CC-2100", "New York", "Acme Corp"),
        ("Raj Patel", "r.patel@example.com", "ENG-CUS", "CC-1020", "Bangalore", "Acme R&D India"),
        ("Olga Novak", "o.novak@example.com", "RD-ANL", "CC-2200", "New York", "Acme Corp"),
        ("Felix Wagner", "f.wagner@example.com", "ENG-DEV", "CC-1030", "New York", "Acme Corp"),
        ("Aisha Khan", "a.khan@example.com", "RD-DAT", "CC-2100", "Bangalore", "Acme R&D India"),
        ("Max Hoffman", "m.hoffman@example.com", "ENG-PLT", "CC-1010", "New York", "Acme Corp"),
        ("Nina Costa", "n.costa@example.com", "ENG-CUS", "CC-1020", "Singapore", "Acme Asia Pacific"),
        ("Peter Scott", "p.scott@example.com", "RD-ANL", "CC-2200", "New York", "Acme Corp"),
    ];

    for (name, email, dept, cc, hub, company) in &people {
        conn.execute(
            "INSERT INTO people (full_name,email,department,cost_center,hub,company) VALUES (?1,?2,?3,?4,?5,?6)",
            rusqlite::params![name, email, dept, cc, hub, company],
        ).expect("Failed to seed person");
    }

    let pi_id = 3; // PI 25.1 (Active)

    // Solution Leadership
    conn.execute_batch(&format!(
        "
        INSERT INTO solution_leadership (solution_id,person_id,role,fte_percent,pi_id) VALUES (1,1,'Solution Manager',100,{pi_id});
        INSERT INTO solution_leadership (solution_id,person_id,role,fte_percent,pi_id) VALUES (1,2,'Solution Architect',50,{pi_id});
        INSERT INTO solution_leadership (solution_id,person_id,role,fte_percent,pi_id) VALUES (2,5,'Solution Manager',100,{pi_id});
        "
    )).expect("Failed to seed solution leadership");

    // ART Leadership
    conn.execute_batch(&format!(
        "
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (1,6,'Product Manager',100,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (1,2,'System Architect',50,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (1,8,'RTE',100,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (2,14,'Product Manager',100,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (3,13,'RTE',100,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (4,10,'Product Manager',80,{pi_id});
        INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) VALUES (1,3,'Business Owner',20,{pi_id});
        "
    )).expect("Failed to seed ART leadership");

    // Team Memberships
    let memberships: Vec<(i64, i64, &str, i64)> = vec![
        (1, 9, "PO", 100), (1, 11, "SM", 100), (1, 12, "Dev", 100), (1, 3, "Dev", 50), (1, 18, "Dev", 100),
        (2, 16, "PO", 100), (2, 17, "SM", 100), (2, 3, "Dev", 40), (2, 4, "Dev", 80),
        (3, 15, "PO", 80), (3, 20, "SM", 100), (3, 7, "Dev", 100),
        (4, 19, "PO", 100), (4, 9, "SM", 50),
        (5, 4, "Dev", 40),
        (6, 7, "Dev", 50),
        (7, 17, "Dev", 50),
        (8, 10, "Dev", 20), (8, 20, "Dev", 50),
    ];
    for (tid, pid, role, fte) in &memberships {
        conn.execute(
            "INSERT INTO memberships (team_id,person_id,role,fte_percent,pi_id) VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![tid, pid, role, fte, pi_id],
        ).expect("Failed to seed membership");
    }

    // Cost Rates
    let cost_rates: Vec<(&str, &str, &str, f64, &str)> = vec![
        ("NYC", "Engineering", "Senior Developer (L3)", 650.0, "PI 24.3"),
        ("NYC", "Engineering", "Developer (L2)", 520.0, "PI 24.3"),
        ("NYC", "Engineering", "Junior Developer (L1)", 380.0, "PI 24.3"),
        ("NYC", "Product", "Product Owner", 700.0, "PI 24.3"),
        ("NYC", "Product", "Business Analyst", 550.0, "PI 24.3"),
        ("BLR", "Engineering", "Senior Developer (L3)", 320.0, "PI 24.3"),
        ("BLR", "Engineering", "Developer (L2)", 260.0, "PI 24.3"),
        ("BLR", "Product", "Product Owner", 380.0, "PI 24.3"),
        ("SIN", "Engineering", "Senior Developer (L3)", 580.0, "PI 25.1"),
        ("SIN", "Product", "Product Owner", 640.0, "PI 25.1"),
        ("NYC", "Design", "UX Designer", 600.0, "PI 25.1"),
        ("NYC", "Design", "UI Designer", 520.0, "PI 25.1"),
    ];
    for (hub, dept, role, rate, pi) in &cost_rates {
        conn.execute(
            "INSERT INTO cost_rates (hub_code,department,role_level,daily_rate,effective_pi) VALUES (?1,?2,?3,?4,?5)",
            rusqlite::params![hub, dept, role, rate, pi],
        ).expect("Failed to seed cost rate");
    }
}
