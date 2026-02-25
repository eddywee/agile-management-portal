// © Edmund Wallner - Mercedes-Benz AG
import { invoke } from '@tauri-apps/api/core';
import type {
  ProgramIncrement, Person, Solution, Art, ProductTeam,
  MembershipWithPerson, LeadershipWithPerson, PersonAllocation,
  ConflictPerson, RoleDistribution, SolutionFTEBreakdown,
  CostRate, SearchResults, CsvParseResult, ImportMapping, ImportResult,
} from '../types';

// Program Increments
export const getAllPIs = () => invoke<ProgramIncrement[]>('get_all_pis');
export const getActivePI = () => invoke<ProgramIncrement | null>('get_active_pi');
export const createPI = (pi_name: string, start_date: string, end_date: string) =>
  invoke<void>('create_pi', { piName: pi_name, startDate: start_date, endDate: end_date });
export const updatePI = (id: number, pi_name: string, start_date: string, end_date: string, status?: string) =>
  invoke<void>('update_pi', { id, piName: pi_name, startDate: start_date, endDate: end_date, status: status ?? null });
export const deletePI = (id: number) => invoke<void>('delete_pi', { id });
export const activatePI = (id: number) => invoke<void>('activate_pi', { id });
export const completePI = (id: number) => invoke<void>('complete_pi', { id });
export const clonePI = (from_pi_id: number, to_pi_id: number) =>
  invoke<void>('clone_pi', { fromPiId: from_pi_id, toPiId: to_pi_id });

// Solutions
export const getSolutions = () => invoke<Solution[]>('get_solutions');
export const createSolution = (name: string, description?: string) =>
  invoke<number>('create_solution', { name, description: description ?? null });
export const updateSolution = (id: number, name: string, description?: string) =>
  invoke<void>('update_solution', { id, name, description: description ?? null });
export const deleteSolution = (id: number) => invoke<void>('delete_solution', { id });
export const getSolutionFTE = (solution_id: number, pi_id: number) =>
  invoke<number>('get_solution_fte', { solutionId: solution_id, piId: pi_id });

// ARTs
export const getArts = (solution_id?: number) =>
  invoke<Art[]>('get_arts', { solutionId: solution_id ?? null });
export const createArt = (solution_id: number | null, name: string) =>
  invoke<number>('create_art', { solutionId: solution_id, name });
export const updateArt = (id: number, name: string, solution_id: number | null) =>
  invoke<void>('update_art', { id, name, solutionId: solution_id });
export const deleteArt = (id: number) => invoke<void>('delete_art', { id });
export const getArtFTE = (art_id: number, pi_id: number) =>
  invoke<number>('get_art_fte', { artId: art_id, piId: pi_id });

// Teams
export const getTeams = (art_id?: number) =>
  invoke<ProductTeam[]>('get_teams', { artId: art_id ?? null });
export const createTeam = (art_id: number | null, name: string) =>
  invoke<number>('create_team', { artId: art_id, name });
export const updateTeam = (id: number, name: string, art_id: number | null) =>
  invoke<void>('update_team', { id, name, artId: art_id });
export const deleteTeam = (id: number) => invoke<void>('delete_team', { id });
export const getTeamFTE = (team_id: number, pi_id: number) =>
  invoke<number>('get_team_fte', { teamId: team_id, piId: pi_id });

// People
export const getPeople = (active_only?: boolean) =>
  invoke<Person[]>('get_people', { activeOnly: active_only ?? null });
export const getPersonById = (id: number) =>
  invoke<Person | null>('get_person_by_id', { id });
export const createPerson = (full_name: string, email?: string, department?: string, cost_center?: string, hub?: string, company?: string) =>
  invoke<number>('create_person', {
    fullName: full_name, email: email ?? null, department: department ?? null,
    costCenter: cost_center ?? null, hub: hub ?? null, company: company ?? null,
  });
export const updatePerson = (id: number, full_name: string, email?: string, department?: string, cost_center?: string, hub?: string, company?: string) =>
  invoke<void>('update_person', {
    id, fullName: full_name, email: email ?? null, department: department ?? null,
    costCenter: cost_center ?? null, hub: hub ?? null, company: company ?? null,
  });
export const deactivatePerson = (id: number) => invoke<void>('deactivate_person', { id });
export const reactivatePerson = (id: number) => invoke<void>('reactivate_person', { id });
export const deactivatePersonRemoveAssignments = (personId: number) =>
  invoke<void>('deactivate_person_remove_assignments', { personId });
export const getPersonTotalFTE = (person_id: number, pi_id: number) =>
  invoke<number>('get_person_total_fte', { personId: person_id, piId: pi_id });
export const getPersonAllocations = (person_id: number, pi_id: number) =>
  invoke<PersonAllocation[]>('get_person_allocations', { personId: person_id, piId: pi_id });

// Memberships
export const getTeamMembers = (team_id: number, pi_id: number) =>
  invoke<MembershipWithPerson[]>('get_team_members', { teamId: team_id, piId: pi_id });
export const createMembership = (team_id: number, person_id: number, role: string, fte_percent: number, pi_id: number) =>
  invoke<number>('create_membership', { teamId: team_id, personId: person_id, role, ftePercent: fte_percent, piId: pi_id });
export const deleteMembership = (id: number) => invoke<void>('delete_membership', { id });
export const updateMembership = (id: number, role: string, ftePercent: number) =>
  invoke<void>('update_membership', { id, role, ftePercent });

// Leadership
export const getSolutionLeadership = (solution_id: number, pi_id: number) =>
  invoke<LeadershipWithPerson[]>('get_solution_leadership', { solutionId: solution_id, piId: pi_id });
export const getArtLeadership = (art_id: number, pi_id: number) =>
  invoke<LeadershipWithPerson[]>('get_art_leadership', { artId: art_id, piId: pi_id });
export const createLeadership = (level: string, entity_id: number, person_id: number, role: string, fte_percent: number, pi_id: number) =>
  invoke<number>('create_leadership', { level, entityId: entity_id, personId: person_id, role, ftePercent: fte_percent, piId: pi_id });
export const deleteLeadership = (level: string, id: number) =>
  invoke<void>('delete_leadership', { level, id });
export const updateLeadership = (level: string, id: number, role: string, ftePercent: number) =>
  invoke<void>('update_leadership', { level, id, role, ftePercent });

// Dashboard
export const getConflicts = (pi_id: number) =>
  invoke<ConflictPerson[]>('get_conflicts', { piId: pi_id });
export const getSolutionFTEBreakdown = (pi_id: number) =>
  invoke<SolutionFTEBreakdown[]>('get_solution_fte_breakdown', { piId: pi_id });
export const getRoleDistribution = (pi_id: number) =>
  invoke<RoleDistribution>('get_role_distribution', { piId: pi_id });

// Cost Rates
export const getCostRates = (hub_filter?: string, dept_filter?: string) =>
  invoke<CostRate[]>('get_cost_rates', { hubFilter: hub_filter ?? null, deptFilter: dept_filter ?? null });
export const getCostRateHubs = () => invoke<string[]>('get_cost_rate_hubs');
export const getCostRateDepts = () => invoke<string[]>('get_cost_rate_depts');

// Search
export const searchAll = (term: string) => invoke<SearchResults>('search_all', { term });

// Import / Export
export const parseCsvFile = (path: string) => invoke<CsvParseResult>('parse_csv_file', { path });
export const executeCsvImport = (rows: string[][], headers: string[], mappings: ImportMapping[], pi_id: number, euro_decimal: boolean) =>
  invoke<ImportResult>('execute_csv_import', { rows, headers, mappings, piId: pi_id, euroDecimal: euro_decimal });
export const exportPIAsCSV = (pi_id: number) => invoke<string>('export_pi_as_csv', { piId: pi_id });
export const resetDatabase = () => invoke<void>('reset_database');
