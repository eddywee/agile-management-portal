// © Edmund Wallner
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProgramIncrement {
    pub id: i64,
    pub pi_name: String,
    pub start_date: String,
    pub end_date: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Person {
    pub id: i64,
    pub full_name: String,
    pub email: Option<String>,
    pub department: Option<String>,
    pub cost_center: Option<String>,
    pub hub: Option<String>,
    pub company: Option<String>,
    pub active: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Solution {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Art {
    pub id: i64,
    pub solution_id: Option<i64>,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ArtWithSolution {
    pub id: i64,
    pub solution_id: Option<i64>,
    pub name: String,
    pub sol_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductTeam {
    pub id: i64,
    pub art_id: Option<i64>,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TeamWithArt {
    pub id: i64,
    pub art_id: Option<i64>,
    pub name: String,
    pub art_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TeamWithHierarchy {
    pub id: i64,
    pub art_id: Option<i64>,
    pub name: String,
    pub art_name: Option<String>,
    pub sol_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Membership {
    pub id: i64,
    pub team_id: i64,
    pub person_id: i64,
    pub role: String,
    pub fte_percent: i64,
    pub pi_id: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MembershipWithPerson {
    pub id: i64,
    pub team_id: i64,
    pub person_id: i64,
    pub role: String,
    pub fte_percent: i64,
    pub pi_id: i64,
    pub full_name: String,
    pub email: Option<String>,
    pub active: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeadershipWithPerson {
    pub id: i64,
    pub entity_id: i64,
    pub person_id: i64,
    pub role: String,
    pub fte_percent: i64,
    pub pi_id: i64,
    pub full_name: String,
    pub email: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PersonAllocation {
    pub allocation_id: i64,
    pub entity_id: i64,
    pub role: String,
    pub fte_percent: i64,
    pub entity: String,
    pub level: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConflictPerson {
    pub id: i64,
    pub full_name: String,
    pub email: Option<String>,
    pub department: Option<String>,
    pub total_fte: i64,
    pub assignments: usize,
    pub allocations: Vec<PersonAllocation>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RoleDistribution {
    pub delivery: f64,
    pub art_leadership: f64,
    pub solution_leadership: f64,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SolutionFTEBreakdown {
    pub name: String,
    pub delivery: f64,
    pub art_overhead: f64,
    pub sol_overhead: f64,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CostRate {
    pub id: i64,
    pub hub_code: String,
    pub department: String,
    pub role_level: String,
    pub daily_rate: f64,
    pub effective_pi: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SearchResults {
    pub people: Vec<Person>,
    pub teams: Vec<TeamWithArt>,
    pub arts: Vec<ArtWithSolution>,
    pub solutions: Vec<Solution>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CsvParseResult {
    pub headers: Vec<String>,
    pub rows: Vec<Vec<String>>,
    pub row_count: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImportMapping {
    pub csv_column: String,
    pub field: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImportResult {
    pub created: usize,
    pub updated: usize,
    pub teams_created: usize,
    pub total: usize,
}
