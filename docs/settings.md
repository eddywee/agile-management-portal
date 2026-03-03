# Settings

The Settings page is divided into three tabs: **PI Management**, **Data Management**, and **Cost Rates**.

## PI Management

Program Increments (PIs) are the time-boxed planning periods that scope all allocation data. Every membership and leadership assignment belongs to a specific PI.

### PI Table

The table lists all PIs with their name, start date, end date, and status. Each PI has one of three statuses:

| Status | Meaning |
|--------|---------|
| **Planned** | A future PI being prepared. Can be edited, activated, or deleted. |
| **Active** | The current working PI. Can be edited, completed, or deleted. |
| **Completed** | A past PI that is locked and read-only. Can only be deleted. |

### Creating a PI

Click **New PI** to open the creation form. Provide:

- **Name** — A descriptive label (e.g., "PI 24.1", "Q1 2025")
- **Start Date** — When the PI begins
- **End Date** — When the PI ends

New PIs are created with **Planned** status.

### PI Lifecycle

A PI follows this lifecycle: **Planned > Active > Completed**.

- **Activate** — Moves a Planned PI to Active status. Multiple PIs can be Active simultaneously.
- **Complete** — Locks an Active PI. Completed PIs cannot be modified.
- **Delete** — Permanently removes a PI and all its associated memberships and leadership assignments.

### Clone PI

The Clone feature copies all structure and assignments from one PI to another. This is useful when planning a new PI that is similar to an existing one.

1. Select a **source PI** (the PI to copy from).
2. Select a **target PI** (the PI to copy to). Only non-completed PIs are available as targets.
3. Click **Clone**.

All team memberships and leadership assignments from the source are duplicated into the target PI. The organizational structure (Solutions, ARTs, Teams) is shared — only the per-PI assignments are copied.

## Data Management

### Export Current PI

Download a structured CSV file containing all allocation data for the active PI. The export includes people, their team assignments, roles, and FTE percentages. Use this for reporting or as a template for the [CSV Import](import.md) wizard.

### Import Wizard

A shortcut that navigates you to the [Import](import.md) page.

### Load Demo Data

Populates the database with sample Solutions, ARTs, Teams, and People to help you explore the app's features. This button only works when the database is empty.

### Reset / Clear All Data

Permanently deletes all data in the database, including all PIs, organizational structure, people, and assignments. This action cannot be undone. You'll be asked to confirm before proceeding.

### Application Info

Displays the current app version and technical details (SQLite engine, Tauri framework).

## Cost Rates

The Cost Rates tab shows role-based daily cost rates. These rates are organized by:

- **Hub Code** — Geographic location identifier
- **Department** — Organizational department
- **Role / Level** — Job role or seniority level
- **Daily Rate** — Cost in euros per day
- **Effective PI** — Which PI the rate applies from

Use the dropdown filters at the top to narrow results by hub and department. Cost rates are imported via CSV and provide visibility into the cost impact of FTE allocation decisions.
