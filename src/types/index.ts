// © Edmund Wallner
export interface ProgramIncrement {
  id: number;
  pi_name: string;
  start_date: string;
  end_date: string;
  status: 'Planned' | 'Active' | 'Completed';
}

export interface Person {
  id: number;
  full_name: string;
  email: string | null;
  department: string | null;
  cost_center: string | null;
  hub: string | null;
  company: string | null;
  active: boolean;
}

export interface Solution {
  id: number;
  name: string;
  description: string | null;
}

export interface Art {
  id: number;
  solution_id: number | null;
  name: string;
}

export interface ArtWithSolution {
  id: number;
  solution_id: number | null;
  name: string;
  sol_name: string | null;
}

export interface ProductTeam {
  id: number;
  art_id: number | null;
  name: string;
}

export interface TeamWithArt {
  id: number;
  art_id: number | null;
  name: string;
  art_name: string | null;
}

export interface MembershipWithPerson {
  id: number;
  team_id: number;
  person_id: number;
  role: string;
  fte_percent: number;
  pi_id: number;
  full_name: string;
  email: string | null;
  active: boolean;
}

export interface LeadershipWithPerson {
  id: number;
  entity_id: number;
  person_id: number;
  role: string;
  fte_percent: number;
  pi_id: number;
  full_name: string;
  email: string | null;
}

export interface PersonAllocation {
  allocation_id: number;
  entity_id: number;
  role: string;
  fte_percent: number;
  entity: string;
  level: string;
}

export interface ConflictPerson {
  id: number;
  full_name: string;
  email: string | null;
  department: string | null;
  total_fte: number;
  assignments: number;
  allocations: PersonAllocation[];
}

export interface RoleDistribution {
  delivery: number;
  art_leadership: number;
  solution_leadership: number;
  total: number;
}

export interface SolutionFTEBreakdown {
  name: string;
  delivery: number;
  art_overhead: number;
  sol_overhead: number;
  total: number;
}

export interface CostRate {
  id: number;
  hub_code: string;
  department: string;
  role_level: string;
  daily_rate: number;
  effective_pi: string;
}

export interface SearchResults {
  people: Person[];
  teams: TeamWithArt[];
  arts: ArtWithSolution[];
  solutions: Solution[];
}

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
  row_count: number;
}

export interface ImportMapping {
  csv_column: string;
  field: string;
}

export interface ImportResult {
  created: number;
  updated: number;
  teams_created: number;
  total: number;
}

export type OrgNodeType = 'solution' | 'art' | 'team';
export interface OrgNode {
  type: OrgNodeType;
  id: number;
}

export type PageName = 'dashboard' | 'organization' | 'people' | 'import' | 'settings';
