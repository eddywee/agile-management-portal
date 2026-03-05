# Data Management

Data Management tools are found in the second tab of the **Settings** page. Use them to export, import, seed, or reset your data.

## Export Current PI

Download a structured CSV file containing all allocation data for the active PI. The export includes people, their team assignments, roles, and FTE percentages. Use this for reporting or as a template for the [CSV Import](import.md) wizard.

## Import Wizard

A shortcut that navigates you to the [Import](import.md) page.

## Load Demo Data

Populates the database with sample Solutions, ARTs, Teams, and People to help you explore the app's features. This button only works when the database is empty.

!!! tip "Exploring the app"
    Use demo data to explore all features before importing your real
    team structure. Demo data only loads when the database is empty.

## Reset / Clear All Data

Permanently deletes all data in the database, including all PIs, organizational structure, people, and assignments. This action cannot be undone. You'll be asked to confirm before proceeding.

!!! danger "Irreversible action"
    Resetting the database permanently deletes **all** data — PIs,
    organizational structure, people, and assignments. Export your
    data first if you need a backup.

## Application Info

Displays the current app version and technical details (SQLite engine, Tauri framework).
