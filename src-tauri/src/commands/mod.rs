// © Edmund Wallner
// Tauri commands organized by domain

use crate::db::Database;
use crate::models::*;
use rusqlite::params;
use tauri::State;

// ═══ PROGRAM INCREMENTS ═══

#[tauri::command]
pub fn get_all_pis(db: State<Database>) -> Result<Vec<ProgramIncrement>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, pi_name, start_date, end_date, status FROM program_increments ORDER BY start_date DESC")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(ProgramIncrement {
                id: row.get(0)?,
                pi_name: row.get(1)?,
                start_date: row.get(2)?,
                end_date: row.get(3)?,
                status: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_active_pi(db: State<Database>) -> Result<Option<ProgramIncrement>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let result = conn.query_row(
        "SELECT id, pi_name, start_date, end_date, status FROM program_increments WHERE status='Active' LIMIT 1",
        [],
        |row| {
            Ok(ProgramIncrement {
                id: row.get(0)?,
                pi_name: row.get(1)?,
                start_date: row.get(2)?,
                end_date: row.get(3)?,
                status: row.get(4)?,
            })
        },
    );
    match result {
        Ok(pi) => Ok(Some(pi)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn create_pi(db: State<Database>, pi_name: String, start_date: String, end_date: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO program_increments (pi_name,start_date,end_date,status) VALUES (?1,?2,?3,'Planned')",
        params![pi_name, start_date, end_date],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_pi(db: State<Database>, id: i64, pi_name: String, start_date: String, end_date: String, status: Option<String>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    match status {
        Some(s) => conn.execute(
            "UPDATE program_increments SET pi_name=?1,start_date=?2,end_date=?3,status=?4 WHERE id=?5",
            params![pi_name, start_date, end_date, s, id],
        ),
        None => conn.execute(
            "UPDATE program_increments SET pi_name=?1,start_date=?2,end_date=?3 WHERE id=?4",
            params![pi_name, start_date, end_date, id],
        ),
    }.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_pi(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM memberships WHERE pi_id=?1", params![id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM art_leadership WHERE pi_id=?1", params![id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM solution_leadership WHERE pi_id=?1", params![id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM program_increments WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn activate_pi(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE program_increments SET status='Planned' WHERE status='Active'", [])
        .map_err(|e| e.to_string())?;
    conn.execute("UPDATE program_increments SET status='Active' WHERE id=?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn complete_pi(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE program_increments SET status='Completed' WHERE id=?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn clone_pi(db: State<Database>, from_pi_id: i64, to_pi_id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO solution_leadership (solution_id,person_id,role,fte_percent,pi_id) SELECT solution_id,person_id,role,fte_percent,?2 FROM solution_leadership WHERE pi_id=?1",
        params![from_pi_id, to_pi_id],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO art_leadership (art_id,person_id,role,fte_percent,pi_id) SELECT art_id,person_id,role,fte_percent,?2 FROM art_leadership WHERE pi_id=?1",
        params![from_pi_id, to_pi_id],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO memberships (team_id,person_id,role,fte_percent,pi_id) SELECT team_id,person_id,role,fte_percent,?2 FROM memberships WHERE pi_id=?1",
        params![from_pi_id, to_pi_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ SOLUTIONS ═══

#[tauri::command]
pub fn get_solutions(db: State<Database>) -> Result<Vec<Solution>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name, description FROM solutions ORDER BY name")
        .map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| {
        Ok(Solution { id: row.get(0)?, name: row.get(1)?, description: row.get(2)? })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_solution(db: State<Database>, name: String, description: Option<String>) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO solutions (name,description) VALUES (?1,?2)", params![name, description])
        .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_solution_fte(db: State<Database>, solution_id: i64, pi_id: i64) -> Result<f64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let delivery: i64 = conn.query_row(
        "SELECT COALESCE(SUM(m.fte_percent),0) FROM memberships m JOIN product_teams t ON m.team_id=t.id JOIN arts a ON t.art_id=a.id WHERE a.solution_id=?1 AND m.pi_id=?2",
        params![solution_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    let art_oh: i64 = conn.query_row(
        "SELECT COALESCE(SUM(al.fte_percent),0) FROM art_leadership al JOIN arts a ON al.art_id=a.id WHERE a.solution_id=?1 AND al.pi_id=?2",
        params![solution_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    let sol_oh: i64 = conn.query_row(
        "SELECT COALESCE(SUM(sl.fte_percent),0) FROM solution_leadership sl WHERE sl.solution_id=?1 AND sl.pi_id=?2",
        params![solution_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    Ok((delivery + art_oh + sol_oh) as f64 / 100.0)
}

#[tauri::command]
pub fn update_solution(db: State<Database>, id: i64, name: String, description: Option<String>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE solutions SET name=?1, description=?2 WHERE id=?3",
        params![name, description, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_solution(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM solutions WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ ARTS ═══

#[tauri::command]
pub fn get_arts(db: State<Database>, solution_id: Option<i64>) -> Result<Vec<Art>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let (sql, p): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = match solution_id {
        Some(sid) => ("SELECT id, solution_id, name FROM arts WHERE solution_id=?1 ORDER BY name".into(), vec![Box::new(sid)]),
        None => ("SELECT id, solution_id, name FROM arts ORDER BY name".into(), vec![]),
    };
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let params_ref: Vec<&dyn rusqlite::types::ToSql> = p.iter().map(|b| b.as_ref()).collect();
    let rows = stmt.query_map(params_ref.as_slice(), |row| {
        Ok(Art { id: row.get(0)?, solution_id: row.get(1)?, name: row.get(2)? })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_art(db: State<Database>, solution_id: Option<i64>, name: String) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO arts (solution_id,name) VALUES (?1,?2)", params![solution_id, name])
        .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_art_fte(db: State<Database>, art_id: i64, pi_id: i64) -> Result<f64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let team_fte: i64 = conn.query_row(
        "SELECT COALESCE(SUM(m.fte_percent),0) FROM memberships m JOIN product_teams t ON m.team_id=t.id WHERE t.art_id=?1 AND m.pi_id=?2",
        params![art_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    let leadership: i64 = conn.query_row(
        "SELECT COALESCE(SUM(fte_percent),0) FROM art_leadership WHERE art_id=?1 AND pi_id=?2",
        params![art_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    Ok((team_fte + leadership) as f64 / 100.0)
}

#[tauri::command]
pub fn update_art(db: State<Database>, id: i64, name: String, solution_id: Option<i64>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE arts SET name=?1, solution_id=?2 WHERE id=?3",
        params![name, solution_id, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_art(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM arts WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ TEAMS ═══

#[tauri::command]
pub fn get_teams(db: State<Database>, art_id: Option<i64>) -> Result<Vec<ProductTeam>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let (sql, p): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = match art_id {
        Some(aid) => ("SELECT id, art_id, name FROM product_teams WHERE art_id=?1 ORDER BY name".into(), vec![Box::new(aid)]),
        None => ("SELECT id, art_id, name FROM product_teams ORDER BY name".into(), vec![]),
    };
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let params_ref: Vec<&dyn rusqlite::types::ToSql> = p.iter().map(|b| b.as_ref()).collect();
    let rows = stmt.query_map(params_ref.as_slice(), |row| {
        Ok(ProductTeam { id: row.get(0)?, art_id: row.get(1)?, name: row.get(2)? })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_team(db: State<Database>, art_id: Option<i64>, name: String) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO product_teams (art_id,name) VALUES (?1,?2)", params![art_id, name])
        .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_team_fte(db: State<Database>, team_id: i64, pi_id: i64) -> Result<f64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let total: i64 = conn.query_row(
        "SELECT COALESCE(SUM(fte_percent),0) FROM memberships WHERE team_id=?1 AND pi_id=?2",
        params![team_id, pi_id], |r| r.get(0),
    ).unwrap_or(0);
    Ok(total as f64 / 100.0)
}

#[tauri::command]
pub fn update_team(db: State<Database>, id: i64, name: String, art_id: Option<i64>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE product_teams SET name=?1, art_id=?2 WHERE id=?3",
        params![name, art_id, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_team(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM product_teams WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ PEOPLE ═══

#[tauri::command]
pub fn get_people(db: State<Database>, active_only: Option<bool>) -> Result<Vec<Person>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let sql = if active_only.unwrap_or(false) {
        "SELECT id,full_name,email,department,cost_center,hub,company,active FROM people WHERE active=1 ORDER BY full_name"
    } else {
        "SELECT id,full_name,email,department,cost_center,hub,company,active FROM people ORDER BY full_name"
    };
    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| {
        Ok(Person {
            id: row.get(0)?, full_name: row.get(1)?, email: row.get(2)?,
            department: row.get(3)?, cost_center: row.get(4)?, hub: row.get(5)?,
            company: row.get(6)?, active: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_person_by_id(db: State<Database>, id: i64) -> Result<Option<Person>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let result = conn.query_row(
        "SELECT id,full_name,email,department,cost_center,hub,company,active FROM people WHERE id=?1",
        params![id],
        |row| Ok(Person {
            id: row.get(0)?, full_name: row.get(1)?, email: row.get(2)?,
            department: row.get(3)?, cost_center: row.get(4)?, hub: row.get(5)?,
            company: row.get(6)?, active: row.get(7)?,
        }),
    );
    match result {
        Ok(p) => Ok(Some(p)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn create_person(db: State<Database>, full_name: String, email: Option<String>, department: Option<String>, cost_center: Option<String>, hub: Option<String>, company: Option<String>) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO people (full_name,email,department,cost_center,hub,company) VALUES (?1,?2,?3,?4,?5,?6)",
        params![full_name, email, department, cost_center, hub, company],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn update_person(db: State<Database>, id: i64, full_name: String, email: Option<String>, department: Option<String>, cost_center: Option<String>, hub: Option<String>, company: Option<String>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE people SET full_name=?1,email=?2,department=?3,cost_center=?4,hub=?5,company=?6 WHERE id=?7",
        params![full_name, email, department, cost_center, hub, company, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn deactivate_person(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE people SET active=0 WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn reactivate_person(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE people SET active=1 WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn deactivate_person_remove_assignments(db: State<Database>, person_id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE people SET active=0 WHERE id=?1", params![person_id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM memberships WHERE person_id=?1", params![person_id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM art_leadership WHERE person_id=?1", params![person_id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM solution_leadership WHERE person_id=?1", params![person_id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_person_total_fte(db: State<Database>, person_id: i64, pi_id: i64) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let m: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM memberships WHERE person_id=?1 AND pi_id=?2", params![person_id, pi_id], |r| r.get(0)).unwrap_or(0);
    let a: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM art_leadership WHERE person_id=?1 AND pi_id=?2", params![person_id, pi_id], |r| r.get(0)).unwrap_or(0);
    let s: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM solution_leadership WHERE person_id=?1 AND pi_id=?2", params![person_id, pi_id], |r| r.get(0)).unwrap_or(0);
    Ok(m + a + s)
}

#[tauri::command]
pub fn get_person_allocations(db: State<Database>, person_id: i64, pi_id: i64) -> Result<Vec<PersonAllocation>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut allocs = Vec::new();

    let mut stmt = conn.prepare("SELECT m.id, m.team_id, m.role, m.fte_percent, t.name, 'Team' FROM memberships m JOIN product_teams t ON m.team_id=t.id WHERE m.person_id=?1 AND m.pi_id=?2").map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![person_id, pi_id], |row| {
        Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
    }).map_err(|e| e.to_string())?;
    for r in rows { allocs.push(r.map_err(|e| e.to_string())?); }

    let mut stmt = conn.prepare("SELECT al.id, al.art_id, al.role, al.fte_percent, a.name, 'ART Leadership' FROM art_leadership al JOIN arts a ON al.art_id=a.id WHERE al.person_id=?1 AND al.pi_id=?2").map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![person_id, pi_id], |row| {
        Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
    }).map_err(|e| e.to_string())?;
    for r in rows { allocs.push(r.map_err(|e| e.to_string())?); }

    let mut stmt = conn.prepare("SELECT sl.id, sl.solution_id, sl.role, sl.fte_percent, s.name, 'Solution Leadership' FROM solution_leadership sl JOIN solutions s ON sl.solution_id=s.id WHERE sl.person_id=?1 AND sl.pi_id=?2").map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![person_id, pi_id], |row| {
        Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
    }).map_err(|e| e.to_string())?;
    for r in rows { allocs.push(r.map_err(|e| e.to_string())?); }

    Ok(allocs)
}

// ═══ MEMBERSHIPS ═══

#[tauri::command]
pub fn get_team_members(db: State<Database>, team_id: i64, pi_id: i64) -> Result<Vec<MembershipWithPerson>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT m.id, m.team_id, m.person_id, m.role, m.fte_percent, m.pi_id, p.full_name, p.email, p.active FROM memberships m JOIN people p ON m.person_id=p.id WHERE m.team_id=?1 AND m.pi_id=?2"
    ).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![team_id, pi_id], |row| {
        Ok(MembershipWithPerson {
            id: row.get(0)?, team_id: row.get(1)?, person_id: row.get(2)?,
            role: row.get(3)?, fte_percent: row.get(4)?, pi_id: row.get(5)?,
            full_name: row.get(6)?, email: row.get(7)?, active: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_membership(db: State<Database>, team_id: i64, person_id: i64, role: String, fte_percent: i64, pi_id: i64) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO memberships (team_id,person_id,role,fte_percent,pi_id) VALUES (?1,?2,?3,?4,?5)",
        params![team_id, person_id, role, fte_percent, pi_id],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn delete_membership(db: State<Database>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM memberships WHERE id=?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_membership(db: State<Database>, id: i64, role: String, fte_percent: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE memberships SET role=?1, fte_percent=?2 WHERE id=?3",
        params![role, fte_percent, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ LEADERSHIP ═══

#[tauri::command]
pub fn get_solution_leadership(db: State<Database>, solution_id: i64, pi_id: i64) -> Result<Vec<LeadershipWithPerson>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT sl.id, sl.solution_id, sl.person_id, sl.role, sl.fte_percent, sl.pi_id, p.full_name, p.email FROM solution_leadership sl JOIN people p ON sl.person_id=p.id WHERE sl.solution_id=?1 AND sl.pi_id=?2"
    ).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![solution_id, pi_id], |row| {
        Ok(LeadershipWithPerson {
            id: row.get(0)?, entity_id: row.get(1)?, person_id: row.get(2)?,
            role: row.get(3)?, fte_percent: row.get(4)?, pi_id: row.get(5)?,
            full_name: row.get(6)?, email: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_art_leadership(db: State<Database>, art_id: i64, pi_id: i64) -> Result<Vec<LeadershipWithPerson>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT al.id, al.art_id, al.person_id, al.role, al.fte_percent, al.pi_id, p.full_name, p.email FROM art_leadership al JOIN people p ON al.person_id=p.id WHERE al.art_id=?1 AND al.pi_id=?2"
    ).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(params![art_id, pi_id], |row| {
        Ok(LeadershipWithPerson {
            id: row.get(0)?, entity_id: row.get(1)?, person_id: row.get(2)?,
            role: row.get(3)?, fte_percent: row.get(4)?, pi_id: row.get(5)?,
            full_name: row.get(6)?, email: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_leadership(db: State<Database>, level: String, entity_id: i64, person_id: i64, role: String, fte_percent: i64, pi_id: i64) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let (table, fk_col) = match level.as_str() {
        "solution" => ("solution_leadership", "solution_id"),
        "art" => ("art_leadership", "art_id"),
        _ => return Err("Invalid level".into()),
    };
    conn.execute(
        &format!("INSERT INTO {table} ({fk_col},person_id,role,fte_percent,pi_id) VALUES (?1,?2,?3,?4,?5)"),
        params![entity_id, person_id, role, fte_percent, pi_id],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn delete_leadership(db: State<Database>, level: String, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let table = match level.as_str() {
        "solution" => "solution_leadership",
        "art" => "art_leadership",
        _ => return Err("Invalid level".into()),
    };
    conn.execute(&format!("DELETE FROM {table} WHERE id=?1"), params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_leadership(db: State<Database>, level: String, id: i64, role: String, fte_percent: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let table = match level.as_str() {
        "solution" => "solution_leadership",
        "art" => "art_leadership",
        _ => return Err("Invalid level".into()),
    };
    conn.execute(
        &format!("UPDATE {table} SET role=?1, fte_percent=?2 WHERE id=?3"),
        params![role, fte_percent, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ═══ DASHBOARD ═══

#[tauri::command]
pub fn get_conflicts(db: State<Database>, pi_id: i64) -> Result<Vec<ConflictPerson>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id,full_name,email,department FROM people WHERE active=1 ORDER BY full_name")
        .map_err(|e| e.to_string())?;
    let people: Vec<(i64, String, Option<String>, Option<String>)> = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?))
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    let mut conflicts = Vec::new();
    for (pid, name, email, dept) in people {
        let m: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM memberships WHERE person_id=?1 AND pi_id=?2", params![pid, pi_id], |r| r.get(0)).unwrap_or(0);
        let a: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM art_leadership WHERE person_id=?1 AND pi_id=?2", params![pid, pi_id], |r| r.get(0)).unwrap_or(0);
        let s: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM solution_leadership WHERE person_id=?1 AND pi_id=?2", params![pid, pi_id], |r| r.get(0)).unwrap_or(0);
        let total = m + a + s;
        if total > 100 {
            // Get allocations
            let mut allocs = Vec::new();
            let mut astmt = conn.prepare("SELECT m.id, m.team_id, m.role, m.fte_percent, t.name, 'Team' FROM memberships m JOIN product_teams t ON m.team_id=t.id WHERE m.person_id=?1 AND m.pi_id=?2").map_err(|e| e.to_string())?;
            let rows = astmt.query_map(params![pid, pi_id], |row| {
                Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
            }).map_err(|e| e.to_string())?;
            for r in rows { if let Ok(a) = r { allocs.push(a); } }

            let mut astmt = conn.prepare("SELECT al.id, al.art_id, al.role, al.fte_percent, a.name, 'ART Leadership' FROM art_leadership al JOIN arts a ON al.art_id=a.id WHERE al.person_id=?1 AND al.pi_id=?2").map_err(|e| e.to_string())?;
            let rows = astmt.query_map(params![pid, pi_id], |row| {
                Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
            }).map_err(|e| e.to_string())?;
            for r in rows { if let Ok(a) = r { allocs.push(a); } }

            let mut astmt = conn.prepare("SELECT sl.id, sl.solution_id, sl.role, sl.fte_percent, s.name, 'Solution Leadership' FROM solution_leadership sl JOIN solutions s ON sl.solution_id=s.id WHERE sl.person_id=?1 AND sl.pi_id=?2").map_err(|e| e.to_string())?;
            let rows = astmt.query_map(params![pid, pi_id], |row| {
                Ok(PersonAllocation { allocation_id: row.get(0)?, entity_id: row.get(1)?, role: row.get(2)?, fte_percent: row.get(3)?, entity: row.get(4)?, level: row.get(5)? })
            }).map_err(|e| e.to_string())?;
            for r in rows { if let Ok(a) = r { allocs.push(a); } }

            let assignment_count = allocs.len();
            conflicts.push(ConflictPerson {
                id: pid, full_name: name, email, department: dept,
                total_fte: total, assignments: assignment_count, allocations: allocs,
            });
        }
    }
    Ok(conflicts)
}

#[tauri::command]
pub fn get_solution_fte_breakdown(db: State<Database>, pi_id: i64) -> Result<Vec<SolutionFTEBreakdown>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, name FROM solutions ORDER BY name").map_err(|e| e.to_string())?;
    let solutions: Vec<(i64, String)> = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?))
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    let mut results = Vec::new();
    for (sol_id, sol_name) in solutions {
        let delivery: i64 = conn.query_row(
            "SELECT COALESCE(SUM(m.fte_percent),0) FROM memberships m JOIN product_teams t ON m.team_id=t.id JOIN arts a ON t.art_id=a.id WHERE a.solution_id=?1 AND m.pi_id=?2",
            params![sol_id, pi_id], |r| r.get(0),
        ).unwrap_or(0);
        let art_oh: i64 = conn.query_row(
            "SELECT COALESCE(SUM(al.fte_percent),0) FROM art_leadership al JOIN arts a ON al.art_id=a.id WHERE a.solution_id=?1 AND al.pi_id=?2",
            params![sol_id, pi_id], |r| r.get(0),
        ).unwrap_or(0);
        let sol_oh: i64 = conn.query_row(
            "SELECT COALESCE(SUM(sl.fte_percent),0) FROM solution_leadership sl WHERE sl.solution_id=?1 AND sl.pi_id=?2",
            params![sol_id, pi_id], |r| r.get(0),
        ).unwrap_or(0);
        results.push(SolutionFTEBreakdown {
            name: sol_name,
            delivery: delivery as f64 / 100.0,
            art_overhead: art_oh as f64 / 100.0,
            sol_overhead: sol_oh as f64 / 100.0,
            total: (delivery + art_oh + sol_oh) as f64 / 100.0,
        });
    }
    Ok(results)
}

#[tauri::command]
pub fn get_role_distribution(db: State<Database>, pi_id: i64) -> Result<RoleDistribution, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let team: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM memberships WHERE pi_id=?1", params![pi_id], |r| r.get(0)).unwrap_or(0);
    let art: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM art_leadership WHERE pi_id=?1", params![pi_id], |r| r.get(0)).unwrap_or(0);
    let sol: i64 = conn.query_row("SELECT COALESCE(SUM(fte_percent),0) FROM solution_leadership WHERE pi_id=?1", params![pi_id], |r| r.get(0)).unwrap_or(0);
    Ok(RoleDistribution {
        delivery: team as f64 / 100.0,
        art_leadership: art as f64 / 100.0,
        solution_leadership: sol as f64 / 100.0,
        total: (team + art + sol) as f64 / 100.0,
    })
}

// ═══ COST RATES ═══

#[tauri::command]
pub fn get_cost_rates(db: State<Database>, hub_filter: Option<String>, dept_filter: Option<String>) -> Result<Vec<CostRate>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut sql = "SELECT id,hub_code,department,role_level,daily_rate,effective_pi FROM cost_rates WHERE 1=1".to_string();
    let mut p: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;
    if let Some(ref hub) = hub_filter {
        if hub != "All Hubs" {
            sql.push_str(&format!(" AND hub_code=?{idx}"));
            p.push(Box::new(hub.clone()));
            idx += 1;
        }
    }
    if let Some(ref dept) = dept_filter {
        if dept != "All Departments" {
            sql.push_str(&format!(" AND department=?{idx}"));
            p.push(Box::new(dept.clone()));
        }
    }
    sql.push_str(" ORDER BY hub_code, department, role_level");
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let params_ref: Vec<&dyn rusqlite::types::ToSql> = p.iter().map(|b| b.as_ref()).collect();
    let rows = stmt.query_map(params_ref.as_slice(), |row| {
        Ok(CostRate {
            id: row.get(0)?, hub_code: row.get(1)?, department: row.get(2)?,
            role_level: row.get(3)?, daily_rate: row.get(4)?, effective_pi: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_cost_rate_hubs(db: State<Database>) -> Result<Vec<String>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT DISTINCT hub_code FROM cost_rates ORDER BY hub_code").map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| row.get(0)).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_cost_rate_depts(db: State<Database>) -> Result<Vec<String>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT DISTINCT department FROM cost_rates ORDER BY department").map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| row.get(0)).map_err(|e| e.to_string())?;
    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ═══ SEARCH ═══

#[tauri::command]
pub fn search_all(db: State<Database>, term: String) -> Result<SearchResults, String> {
    if term.is_empty() {
        return Ok(SearchResults { people: vec![], teams: vec![], arts: vec![], solutions: vec![] });
    }
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let like = format!("%{term}%");

    let mut stmt = conn.prepare("SELECT id,full_name,email,department,cost_center,hub,company,active FROM people WHERE full_name LIKE ?1 OR email LIKE ?1 OR department LIKE ?1 LIMIT 10").map_err(|e| e.to_string())?;
    let people: Vec<Person> = stmt.query_map(params![like], |row| {
        Ok(Person {
            id: row.get(0)?, full_name: row.get(1)?, email: row.get(2)?,
            department: row.get(3)?, cost_center: row.get(4)?, hub: row.get(5)?,
            company: row.get(6)?, active: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    let mut stmt = conn.prepare("SELECT t.id, t.art_id, t.name, a.name FROM product_teams t LEFT JOIN arts a ON t.art_id=a.id WHERE t.name LIKE ?1 LIMIT 5").map_err(|e| e.to_string())?;
    let teams: Vec<TeamWithArt> = stmt.query_map(params![like], |row| {
        Ok(TeamWithArt { id: row.get(0)?, art_id: row.get(1)?, name: row.get(2)?, art_name: row.get(3)? })
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    let mut stmt = conn.prepare("SELECT a.id, a.solution_id, a.name, s.name FROM arts a LEFT JOIN solutions s ON a.solution_id=s.id WHERE a.name LIKE ?1 LIMIT 5").map_err(|e| e.to_string())?;
    let arts: Vec<ArtWithSolution> = stmt.query_map(params![like], |row| {
        Ok(ArtWithSolution { id: row.get(0)?, solution_id: row.get(1)?, name: row.get(2)?, sol_name: row.get(3)? })
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    let mut stmt = conn.prepare("SELECT id, name, description FROM solutions WHERE name LIKE ?1 LIMIT 5").map_err(|e| e.to_string())?;
    let solutions: Vec<Solution> = stmt.query_map(params![like], |row| {
        Ok(Solution { id: row.get(0)?, name: row.get(1)?, description: row.get(2)? })
    }).map_err(|e| e.to_string())?.filter_map(|r| r.ok()).collect();

    Ok(SearchResults { people, teams, arts, solutions })
}

// ═══ IMPORT / EXPORT ═══

#[tauri::command]
pub fn parse_csv_file(path: String) -> Result<CsvParseResult, String> {
    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(true)
        .flexible(true)
        .from_path(&path)
        .map_err(|e| e.to_string())?;

    let headers: Vec<String> = rdr.headers().map_err(|e| e.to_string())?.iter().map(|h| h.to_string()).collect();
    let mut rows = Vec::new();
    for result in rdr.records() {
        let record = result.map_err(|e| e.to_string())?;
        rows.push(record.iter().map(|f| f.to_string()).collect());
    }
    let row_count = rows.len();
    Ok(CsvParseResult { headers, rows, row_count })
}

#[tauri::command]
pub fn execute_csv_import(db: State<Database>, rows: Vec<Vec<String>>, headers: Vec<String>, mappings: Vec<ImportMapping>, pi_id: i64, euro_decimal: bool) -> Result<ImportResult, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut created = 0usize;
    let mut updated = 0usize;
    let mut teams_created = 0usize;

    // Build field->column_index map
    let mut field_to_idx: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    for m in &mappings {
        if m.field != "— skip —" {
            if let Some(idx) = headers.iter().position(|h| h == &m.csv_column) {
                field_to_idx.insert(m.field.clone(), idx);
            }
        }
    }

    let get_field = |row: &[String], field: &str| -> String {
        field_to_idx.get(field).and_then(|&idx| row.get(idx)).cloned().unwrap_or_default()
    };

    for row in &rows {
        let full_name = get_field(row, "full_name");
        let email = get_field(row, "email");
        let department = get_field(row, "department");
        let hub = get_field(row, "hub");
        let cost_center = get_field(row, "cost_center");
        let company = get_field(row, "company");
        let team_name = get_field(row, "team_name");
        let art_name = get_field(row, "art_name");
        let solution_name = get_field(row, "solution_name");
        let role_str = get_field(row, "role");
        let fte_str = get_field(row, "fte_percent");

        // Process FTE
        let mut fte: i64 = 100;
        if !fte_str.is_empty() {
            let cleaned = if euro_decimal { fte_str.replace(',', ".") } else { fte_str.clone() };
            if let Ok(v) = cleaned.parse::<f64>() {
                fte = (if v <= 1.5 { v * 100.0 } else { v }).round() as i64;
            }
        }

        // Find or create person
        let mut person_id: Option<i64> = None;
        if !email.is_empty() {
            if let Ok(id) = conn.query_row("SELECT id FROM people WHERE email=?1", params![email], |r| r.get::<_, i64>(0)) {
                person_id = Some(id);
                updated += 1;
            }
        }
        if person_id.is_none() && !full_name.is_empty() {
            if let Ok(id) = conn.query_row("SELECT id FROM people WHERE full_name=?1", params![full_name], |r| r.get::<_, i64>(0)) {
                person_id = Some(id);
                updated += 1;
            }
        }
        if person_id.is_none() && !full_name.is_empty() {
            let email_opt = if email.is_empty() { None } else { Some(email.as_str()) };
            let dept_opt = if department.is_empty() { None } else { Some(department.as_str()) };
            let cc_opt = if cost_center.is_empty() { None } else { Some(cost_center.as_str()) };
            let hub_opt = if hub.is_empty() { None } else { Some(hub.as_str()) };
            let co_opt = if company.is_empty() { None } else { Some(company.as_str()) };
            conn.execute(
                "INSERT INTO people (full_name,email,department,cost_center,hub,company) VALUES (?1,?2,?3,?4,?5,?6)",
                params![full_name, email_opt, dept_opt, cc_opt, hub_opt, co_opt],
            ).map_err(|e| e.to_string())?;
            person_id = Some(conn.last_insert_rowid());
            created += 1;
        }
        let pid = match person_id {
            Some(id) => id,
            None => continue,
        };

        // Update fields
        if !department.is_empty() { conn.execute("UPDATE people SET department=?1 WHERE id=?2", params![department, pid]).ok(); }
        if !hub.is_empty() { conn.execute("UPDATE people SET hub=?1 WHERE id=?2", params![hub, pid]).ok(); }
        if !company.is_empty() { conn.execute("UPDATE people SET company=?1 WHERE id=?2", params![company, pid]).ok(); }

        // Team assignment
        if !team_name.is_empty() && !art_name.is_empty() {
            let sol_id: i64 = if !solution_name.is_empty() {
                match conn.query_row("SELECT id FROM solutions WHERE name=?1", params![solution_name], |r| r.get::<_, i64>(0)) {
                    Ok(id) => id,
                    Err(_) => {
                        conn.execute("INSERT INTO solutions (name) VALUES (?1)", params![solution_name]).map_err(|e| e.to_string())?;
                        conn.last_insert_rowid()
                    }
                }
            } else {
                match conn.query_row("SELECT id FROM solutions LIMIT 1", [], |r| r.get::<_, i64>(0)) {
                    Ok(id) => id,
                    Err(_) => continue,
                }
            };

            let art_id: i64 = match conn.query_row("SELECT id FROM arts WHERE name=?1 AND solution_id=?2", params![art_name, sol_id], |r| r.get::<_, i64>(0)) {
                Ok(id) => id,
                Err(_) => {
                    conn.execute("INSERT INTO arts (solution_id,name) VALUES (?1,?2)", params![sol_id, art_name]).map_err(|e| e.to_string())?;
                    conn.last_insert_rowid()
                }
            };

            let team_id: i64 = match conn.query_row("SELECT id FROM product_teams WHERE name=?1 AND art_id=?2", params![team_name, art_id], |r| r.get::<_, i64>(0)) {
                Ok(id) => id,
                Err(_) => {
                    conn.execute("INSERT INTO product_teams (art_id,name) VALUES (?1,?2)", params![art_id, team_name]).map_err(|e| e.to_string())?;
                    teams_created += 1;
                    conn.last_insert_rowid()
                }
            };

            let role = if role_str.is_empty() { "Dev".to_string() } else { role_str };
            let exists: bool = conn.query_row(
                "SELECT COUNT(*)>0 FROM memberships WHERE team_id=?1 AND person_id=?2 AND pi_id=?3",
                params![team_id, pid, pi_id], |r| r.get(0),
            ).unwrap_or(false);
            if !exists {
                conn.execute(
                    "INSERT INTO memberships (team_id,person_id,role,fte_percent,pi_id) VALUES (?1,?2,?3,?4,?5)",
                    params![team_id, pid, role, fte, pi_id],
                ).map_err(|e| e.to_string())?;
            }
        }
    }

    Ok(ImportResult { created, updated, teams_created, total: rows.len() })
}

#[tauri::command]
pub fn export_pi_as_csv(db: State<Database>, pi_id: i64) -> Result<String, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT p.full_name, p.email, p.department, p.hub, p.cost_center, p.company, t.name, a.name, s.name, m.role, m.fte_percent FROM memberships m JOIN people p ON m.person_id=p.id JOIN product_teams t ON m.team_id=t.id LEFT JOIN arts a ON t.art_id=a.id LEFT JOIN solutions s ON a.solution_id=s.id WHERE m.pi_id=?1"
    ).map_err(|e| e.to_string())?;

    let mut csv_out = "Name,Email,Department,Hub,Cost Center,Company,Team,ART,Solution,Role,FTE%\n".to_string();
    let rows = stmt.query_map(params![pi_id], |row| {
        Ok((
            row.get::<_, String>(0)?, row.get::<_, Option<String>>(1)?,
            row.get::<_, Option<String>>(2)?, row.get::<_, Option<String>>(3)?,
            row.get::<_, Option<String>>(4)?, row.get::<_, Option<String>>(5)?,
            row.get::<_, String>(6)?, row.get::<_, Option<String>>(7)?,
            row.get::<_, Option<String>>(8)?, row.get::<_, String>(9)?,
            row.get::<_, i64>(10)?,
        ))
    }).map_err(|e| e.to_string())?;

    for result in rows {
        let (name, email, dept, hub, cc, company, team, art, sol, role, fte) = result.map_err(|e| e.to_string())?;
        let fields = [
            name, email.unwrap_or_default(), dept.unwrap_or_default(),
            hub.unwrap_or_default(), cc.unwrap_or_default(), company.unwrap_or_default(),
            team, art.unwrap_or_default(), sol.unwrap_or_default(), role, fte.to_string(),
        ];
        let line: Vec<String> = fields.iter().map(|f| format!("\"{}\"", f.replace('"', "\"\""))).collect();
        csv_out.push_str(&line.join(","));
        csv_out.push('\n');
    }
    Ok(csv_out)
}

#[tauri::command]
pub fn reset_database(db: State<Database>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute_batch(
        "DELETE FROM memberships; DELETE FROM art_leadership; DELETE FROM solution_leadership;
         DELETE FROM cost_rates; DELETE FROM product_teams; DELETE FROM arts; DELETE FROM solutions;
         DELETE FROM people; DELETE FROM program_increments;
         DELETE FROM sqlite_sequence;"
    ).map_err(|e| e.to_string())?;
    crate::db::seed::seed_data(&conn);
    Ok(())
}
