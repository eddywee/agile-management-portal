# HELIX Agile Portal

**SAFe Investment Tracker** — A cross-platform desktop application for tracking FTE allocation across Scaled Agile Framework (SAFe) organizational hierarchies.

Built with **Tauri 2.x** (Rust) and **React + TypeScript**.

> Copyright © 2025 Edmund Wallner. All rights reserved. See [LICENSE](LICENSE).

---

## Overview

HELIX Agile Portal gives portfolio planners, RTEs, and auditors a single pane of glass for investment allocation within SAFe structures. It answers questions like *"How many FTEs are allocated to this ART?"* and *"Who is over-allocated this PI?"* — all from a fast, local-first desktop app.

**Design principles:**

- **Local-first** — data lives in an embedded SQLite database on your machine
- **PI-scoped** — every allocation view is scoped to the active Program Increment
- **Hierarchy-as-navigation** — the organization tree (Solution → ART → Team) is both the data model and the primary navigation

## Features

- **Dashboard** — KPI cards, solution bar chart, role donut chart, and conflict detection table
- **Organization tree** — full Solution → ART → Team hierarchy with inline CRUD editing
- **People registry** — allocation tracking per person with over-allocation warnings
- **CSV import wizard** — 4-step flow: upload → column mapping → preview → execute
- **Settings** — PI management, cost rate tables, database export
- **Global search** — `Cmd/Ctrl+K` overlay with keyboard navigation
- **Dark theme** — purpose-built design system using CSS custom properties

## Screenshots

> _Screenshots will be added in a future release._

## Tech Stack

| Layer | Technology |
|----------|-----------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Zustand 5, Recharts 3.7 |
| Backend | Rust (edition 2021), Tauri 2.10, rusqlite 0.31, serde |
| Database | SQLite with WAL mode (bundled, zero-config) |

## Architecture

### Data Flow

```
React UI  →  invoke()  →  Rust command  →  SQLite  →  JSON response
```

The frontend calls Rust functions via Tauri's `invoke()` IPC. Each command locks a `Mutex<Connection>`, executes SQL, and returns typed JSON. All API wrappers live in `src/api/index.ts` with camelCase parameters (Tauri auto-converts to snake_case on the Rust side).

### Project Structure

```
src/                              # React + TypeScript frontend
├── api/index.ts                  # Typed invoke() wrappers for all Rust commands
├── components/
│   ├── layout/                   # Header, Sidebar, Footer, PageRouter
│   ├── dashboard/                # KpiCards, SolutionBarChart, RoleDonutChart, ConflictTable
│   ├── organization/             # OrgTree, OrgDetail (Solution/ART/Team detail)
│   ├── people/                   # PeoplePage, PersonDetailPanel
│   ├── import/                   # UploadStep, MappingStep, PreviewStep, ResultStep
│   ├── settings/                 # PiManagementTab, DataManagementTab, CostRatesTab
│   └── common/                   # ModalContainer, SearchOverlay, ModalForms
├── hooks/                        # useKeyboardShortcuts
├── store/                        # Zustand stores (6 stores)
├── types/index.ts                # All TypeScript interfaces
└── styles/global.css             # Dark theme design system

src-tauri/                        # Rust backend
├── src/
│   ├── lib.rs                    # Tauri app builder, command registration
│   ├── db/mod.rs                 # Database init (WAL mode), Mutex<Connection>
│   ├── db/schema.rs              # 9 CREATE TABLE statements
│   ├── db/seed.rs                # Demo seed data
│   ├── models/mod.rs             # Serde structs
│   └── commands/mod.rs           # ~40 Tauri commands
├── Cargo.toml
└── tauri.conf.json
```

### Data Model

The SQLite schema consists of 9 tables. All allocation tables are scoped to a `pi_id` (Program Increment):

```
program_increments
people
cost_rates

solutions ──→ arts ──→ product_teams ──→ memberships (per PI)
    │            │
    │            └──→ art_leadership (per PI)
    └──→ solution_leadership (per PI)
```

A person is **over-allocated** when their total `fte_percent` across all memberships and leadership roles in a PI exceeds 100%.

### State Management

| Store | Purpose |
|-------|---------|
| `piStore` | Active PI, all PIs, loadPIs(), setActivePI() |
| `navigationStore` | Current page routing |
| `orgStore` | Selected org tree node (solution/art/team) |
| `peopleStore` | Selected person ID |
| `importStore` | CSV import wizard state |
| `modalStore` | Modal open/close with ReactNode content |

## Prerequisites

- **Node.js** 20+
- **Rust** stable (≥ 1.77)
- **macOS:** Xcode Command Line Tools (`xcode-select --install`)
- **Windows:** Visual Studio Build Tools with C++ desktop workload

## Getting Started

```bash
npm install
npm run tauri:dev
```

This starts the Vite dev server with HMR and opens the Tauri window. The database is created automatically on first launch with optional demo seed data.

## Build

```bash
npm run tauri:build
```

Produces platform-specific installers:

| Platform | Output |
|----------|--------|
| macOS | `.dmg` in `src-tauri/target/release/bundle/dmg/` |
| Windows | `.msi` + `.exe` in `src-tauri/target/release/bundle/msi/` and `nsis/` |

## CI/CD

The GitLab CI/CD pipeline (`.gitlab-ci.yml`) has three stages:

| Stage | Job | Trigger | What it does |
|-------|-----|---------|-------------|
| **check** | `typecheck` | Merge request | Runs `npx tsc --noEmit` as a fast gate |
| **build** | `build:macos`, `build:windows` | Tag `v*` | Full `npm run tauri:build` on each platform |
| **release** | `release` | Tag `v*` | Creates a GitLab Release with artifact links |

**Runner requirements:** Runners need `macos` and `windows` tags, with Node.js 20+, Rust stable, and platform-specific build tools installed.

**Version sync:** When you push a git tag (e.g., `v0.1.0`), the `sync-version.mjs` script automatically updates the version in `package.json`, `Cargo.toml`, and `tauri.conf.json` before building.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Cmd/Ctrl + 1` | Go to Dashboard |
| `Cmd/Ctrl + 2` | Go to Organization |
| `Cmd/Ctrl + 3` | Go to People |
| `Cmd/Ctrl + I` | Go to Import |
| `Escape` | Close search overlay / modal |

## License

This is proprietary software. See [LICENSE](LICENSE) for details.
