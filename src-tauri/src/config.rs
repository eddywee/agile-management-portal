// © Edmund Wallner
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub db_path: String,
}

pub fn config_path(app: &AppHandle) -> PathBuf {
    app.path()
        .app_config_dir()
        .expect("Failed to resolve app config dir")
        .join("config.json")
}

pub fn default_db_path(app: &AppHandle) -> String {
    let dir = app
        .path()
        .app_data_dir()
        .expect("Failed to resolve app data dir");
    fs::create_dir_all(&dir).ok();
    dir.join("agile_management_portal.apdb")
        .to_string_lossy()
        .to_string()
}

pub fn load_config(app: &AppHandle) -> Option<AppConfig> {
    let path = config_path(app);
    let data = fs::read_to_string(path).ok()?;
    serde_json::from_str(&data).ok()
}

pub fn save_config(app: &AppHandle, config: &AppConfig) -> Result<(), String> {
    let path = config_path(app);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}
