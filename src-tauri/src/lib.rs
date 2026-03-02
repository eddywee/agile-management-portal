// © Edmund Wallner
// Agile Management Portal — Tauri Backend

mod commands;
mod config;
mod db;
mod models;

use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let handle = app.handle().clone();
            let db_path = match config::load_config(&handle) {
                Some(cfg) => cfg.db_path,
                None => config::default_db_path(&handle),
            };

            let conn = db::open_database(&db_path);
            let database = db::Database(Mutex::new(conn));

            app.manage(database);
            app.manage(commands::DatabasePath(Mutex::new(db_path)));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Program Increments
            commands::get_all_pis,
            commands::get_active_pi,
            commands::create_pi,
            commands::update_pi,
            commands::delete_pi,
            commands::activate_pi,
            commands::complete_pi,
            commands::clone_pi,
            // Solutions
            commands::get_solutions,
            commands::create_solution,
            commands::update_solution,
            commands::delete_solution,
            commands::get_solution_fte,
            // ARTs
            commands::get_arts,
            commands::create_art,
            commands::update_art,
            commands::delete_art,
            commands::get_art_fte,
            // Teams
            commands::get_teams,
            commands::create_team,
            commands::update_team,
            commands::delete_team,
            commands::get_team_fte,
            // People
            commands::get_people,
            commands::get_person_by_id,
            commands::create_person,
            commands::update_person,
            commands::deactivate_person,
            commands::reactivate_person,
            commands::deactivate_person_remove_assignments,
            commands::get_person_total_fte,
            commands::get_person_allocations,
            // Memberships
            commands::get_team_members,
            commands::create_membership,
            commands::delete_membership,
            commands::update_membership,
            // Leadership
            commands::get_solution_leadership,
            commands::get_art_leadership,
            commands::create_leadership,
            commands::delete_leadership,
            commands::update_leadership,
            // Dashboard
            commands::get_conflicts,
            commands::get_solution_fte_breakdown,
            commands::get_role_distribution,
            // Cost Rates
            commands::get_cost_rates,
            commands::get_cost_rate_hubs,
            commands::get_cost_rate_depts,
            // Search
            commands::search_all,
            // Import / Export
            commands::parse_csv_file,
            commands::execute_csv_import,
            commands::export_pi_as_csv,
            commands::reset_database,
            // Database Configuration
            commands::get_app_state,
            commands::initialize_database,
            commands::switch_database,
            commands::seed_demo_data,
            commands::get_database_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Agile Management Portal");
}
