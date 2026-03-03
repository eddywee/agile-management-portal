// © Edmund Wallner
import type { ProgramIncrement, Solution, Art, ConflictPerson, RoleDistribution, PersonAllocation } from '@/types';

export const mockPIs: ProgramIncrement[] = [
  { id: 1, pi_name: 'PI 24.3', start_date: '2024-10-01', end_date: '2024-12-31', status: 'Completed' },
  { id: 2, pi_name: 'PI 24.4', start_date: '2025-01-01', end_date: '2025-03-31', status: 'Completed' },
  { id: 3, pi_name: 'PI 25.1', start_date: '2025-04-01', end_date: '2025-06-30', status: 'Active' },
  { id: 4, pi_name: 'PI 25.2', start_date: '2025-07-01', end_date: '2025-09-30', status: 'Planned' },
];

export const mockSolutions: Solution[] = [
  { id: 1, name: 'Cloud Platform', description: 'Enterprise cloud infrastructure' },
  { id: 2, name: 'Analytics Solution', description: 'Business intelligence platform' },
];

export const mockArts: Art[] = [
  { id: 1, solution_id: 1, name: 'Platform ART' },
  { id: 2, solution_id: 1, name: 'Customer ART' },
  { id: 3, solution_id: 2, name: 'Data ART' },
];

export const mockRoleDist: RoleDistribution = {
  delivery: 12.5,
  art_leadership: 3.0,
  solution_leadership: 1.5,
  total: 17.0,
};

export const mockConflictAllocation: PersonAllocation = {
  allocation_id: 1,
  entity_id: 1,
  role: 'Dev',
  fte_percent: 100,
  entity: 'Team Alpha',
  level: 'team',
};

export const mockConflicts: ConflictPerson[] = [
  {
    id: 3,
    full_name: 'James Smith',
    email: 'j.smith@example.com',
    department: 'ENG-CUS',
    total_fte: 110,
    assignments: 3,
    allocations: [
      mockConflictAllocation,
      { allocation_id: 2, entity_id: 2, role: 'Dev', fte_percent: 40, entity: 'Team Beta', level: 'team' },
    ],
  },
];
