# Getting Started

## Installation

### macOS

1. Download the `.dmg` installer from the [latest release](https://github.com/eddywee/agile-management-portal/releases/latest).
2. Open the DMG and drag **Agile Management Portal** into your Applications folder.
3. On first launch, macOS may show a security prompt — click **Open** to allow the app.

### Windows

1. Download the `.exe` installer from the [latest release](https://github.com/eddywee/agile-management-portal/releases/latest).
2. Run the installer and follow the on-screen prompts.
3. Launch **Agile Management Portal** from the Start menu.

## First Launch

When you start the app for the first time, a **Setup Wizard** guides you through three steps:

1. **Welcome** — Introduction to the application.
2. **Location** — Choose where to store your database file (or accept the default location).
3. **Data** — Optionally load demo data to explore the app, or start with an empty database.

After completing the wizard, you can always change your data setup later:

- **Load Demo Data** — Go to **Settings > Data Management** and click **Load Demo Data** to populate the app with sample solutions, ARTs, teams, and people.
- **Start From Scratch** — Begin by creating a Program Increment in **Settings > PI Management**, then add your organizational structure under **Organization**.

## App Layout

The application has four main areas:

### Header

The top bar shows the application title and a version indicator.

### Sidebar

The left sidebar contains:

- **PI Selector** — A dropdown at the top that controls which Program Increment is active. All data in the app (memberships, leadership, KPIs) is scoped to the selected PI.
- **Views** — Navigation links to Dashboard, Organization, and People.
- **Admin** — Navigation links to Import and Settings.

### Main Content

The central area displays the active page. Content changes based on your sidebar selection.

### Footer

The bottom bar shows the database file path and application version.

## Core Concept: PI Scoping

The most important concept to understand is that **all allocation data is scoped to the active Program Increment**. When you switch the PI selector in the sidebar:

- Dashboard KPIs recalculate for that PI
- Organization leadership and membership tables show assignments for that PI
- People allocation details reflect that PI
- The conflict table shows over-allocations for that PI

This means you can plan future PIs without affecting your current PI data. Each PI maintains its own independent set of memberships and leadership assignments.
