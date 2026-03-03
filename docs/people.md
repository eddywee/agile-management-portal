# People

The People page provides a directory of all individuals in the system, along with their allocation details.

## People Table

The main view shows a table of all people with the following columns:

- **Name** — The person's full name
- **Email** — Contact email (if provided)
- **Department** — Organizational department
- **Hub** — Location or hub code
- **Company** — Company affiliation
- **Status** — Active or inactive

Click any row to open the person's detail panel on the right.

### Adding People

Click the **New Person** button above the table. Fill in the required fields:

- **Full Name** (required)
- **Email** (optional)
- **Department** (optional)
- **Cost Center** (optional)
- **Hub** (optional)
- **Company** (optional)

People can also be bulk-imported using the [CSV Import](import.md) wizard.

### Editing People

Select a person from the table, then click **Edit** in the detail panel. Modify any fields and save.

### Deleting People

Select a person and click **Delete** in the detail panel. This permanently removes the person and all their memberships and leadership assignments across every PI.

## Person Detail Panel

When a person is selected, the right panel shows their allocation details for the active PI.

### Current Allocations

A summary of all the person's assignments in the active PI, including:

- **Team memberships** — Which teams they belong to, their role, and FTE percentage
- **Leadership roles** — Any ART or Solution leadership positions and their FTE percentage
- **Total FTE** — The sum of all allocations. If this exceeds 100%, an over-allocation warning is displayed.

### Over-Allocation

A person is considered **over-allocated** when their total FTE percentage across all memberships and leadership roles in a single PI exceeds 100%. For example:

- 80% on Team Alpha + 30% on Team Beta = 110% total (over-allocated)
- 50% on Team Alpha + 20% ART Leadership = 70% total (within bounds)

Over-allocated people appear in the [Dashboard](dashboard.md) conflict table and are flagged with warning indicators throughout the app.

## Global Search

Use **Cmd/Ctrl+K** to open the global search overlay. Search results include people, teams, ARTs, and solutions. Selecting a person from search results navigates to the People page with that person selected.
