# Organization

The Organization page provides a tree-based view of your SAFe hierarchy: **Solutions > ARTs > Teams**. Use this page to build and manage your organizational structure and assign people to leadership and team membership roles.

## Org Tree

The left panel shows a collapsible tree with three levels:

1. **Solutions** — Top-level organizational containers
2. **ARTs (Agile Release Trains)** — Nested under Solutions
3. **Teams (Product Teams)** — Nested under ARTs

Click any node in the tree to view its details in the right panel. Standalone ARTs (not assigned to a Solution) and standalone Teams (not assigned to an ART) appear under their own sections.

You can add new Solutions, ARTs, or Teams using the **+** buttons at each level of the tree.

## Solution Detail

When you select a Solution, the detail panel shows:

- **Name and description** with edit and delete actions
- **Total FTE** — Sum of all FTE allocations under this Solution for the active PI
- **Solution Leadership** — A table of people assigned as Solution-level leaders (e.g., Solution Train Engineer, Solution Architect). Each entry shows the person's name, role, and FTE percentage. You can add or remove leaders here.
- **ARTs list** — A summary table of the Solution's ARTs showing each ART's FTE total and team count. Click an ART row to navigate to its detail view.

### Managing Solutions

- **Create** — Click the **+** button next to "Solutions" in the tree header. Provide a name and optional description.
- **Edit** — Click the pencil icon next to the Solution name. Update name or description.
- **Delete** — Click the trash icon. The Solution is removed but its ARTs become standalone (they are not deleted).

## ART Detail

When you select an ART, the detail panel shows:

- **Name** and breadcrumb path (e.g., "Solution Name > ART Name") with edit and delete actions
- **Total FTE** for the active PI
- **ART Leadership** — Table of ART-level leaders (e.g., RTE, System Architect). Add or remove leaders per PI.
- **Teams list** — Summary of teams under this ART, showing each team's FTE, member count, and health status. A team marked with a conflict indicator has at least one over-allocated member.

### Managing ARTs

- **Create** — Click the **+** button at the ART level in the tree. Select which Solution (if any) the ART belongs to and provide a name.
- **Edit** — Click the pencil icon next to the ART name.
- **Delete** — Click the trash icon. The ART is removed but its teams become standalone.

## Team Detail

When you select a Team, the detail panel shows:

- **Name** and full breadcrumb path (e.g., "Solution > ART > Team") with edit and delete actions
- **Total FTE** for the active PI
- **Members** — A table of all team members for the active PI. Each row shows the person's name, role (e.g., Developer, Tester, Scrum Master), and their FTE percentage for this team. If a member's total FTE across all assignments exceeds 100%, a warning indicator shows their total percentage.

### Managing Teams

- **Create** — Click the **+** button at the Team level or use **Add Team** from within an ART detail. Select the parent ART and provide a name.
- **Edit** — Click the pencil icon next to the Team name.
- **Delete** — Click the trash icon. The team and all its memberships for every PI are permanently removed.

### Managing Team Members

- **Add Member** — Click **Add Member** in the Team detail. Select a person from the dropdown, assign a role, and set their FTE percentage for the active PI.
- **Remove Member** — Click the trash icon next to a member row. This removes only their membership in this team for the active PI.

## Leadership Assignments

Leadership assignments (both Solution and ART level) are **scoped to the active PI**. This means:

- You can plan leadership changes for an upcoming PI without affecting the current one.
- When you switch PIs in the sidebar, the leadership tables update to show assignments for that PI.
- To assign the same leaders across PIs, use the **Clone PI** feature in [Settings](settings.md).

### Adding a Leader

1. Navigate to the Solution or ART in the tree.
2. Click **Add** in the leadership section.
3. Select a person, choose their role, and set their FTE percentage.
4. Click **Save**. The leader is assigned for the currently active PI.

### Removing a Leader

Click the trash icon next to any leadership row. This removes the assignment for the active PI only.
