# Contributing to Agile Management Portal

> **This is proprietary software.** Contributions are by invitation only.
> Please read the [LICENSE](LICENSE) before proceeding.

## Before You Start

- All contributions require prior written agreement with the copyright holder.
- All contributions become the property of the copyright holder (Edmund Wallner).
- Do not submit unsolicited pull requests or patches.

## Development Setup

### Prerequisites

- Node.js 20+
- Rust stable (≥ 1.77)
- macOS: Xcode Command Line Tools — `xcode-select --install`
- Windows: Visual Studio Build Tools with C++ desktop workload

### Quick Start

```bash
npm install
npm run tauri:dev
```

### Useful Commands

```bash
npx tsc --noEmit           # TypeScript type check
cargo check                # Rust compilation check (run from src-tauri/)
npm run tauri:build        # Production build
```

## Development Workflow

### Branch Naming

- `feature/<description>` — new features
- `fix/<description>` — bug fixes
- `chore/<description>` — maintenance, refactoring, dependencies
- `docs/<description>` — documentation changes

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add cost rate import from CSV
fix: Correct over-allocation calculation for shared PIs
chore: Update rusqlite to 0.32
docs: Add architecture diagram to README
```

### Pull Request Process

1. Create a branch from `main`
2. Push and open a PR against `main`
3. The CI pipeline runs `npx tsc --noEmit` as a merge gate — this must pass before merging.
4. Request review from the project owner.

## Code Style & Conventions

### Frontend (TypeScript / React)

- TypeScript strict mode
- React functional components only — no class components
- State management via Zustand stores (not React Context or Redux)
- All Tauri commands are called through typed wrappers in `src/api/index.ts`
- Naming: camelCase for JS/TS — Tauri auto-converts to snake_case for Rust

### Backend (Rust)

- Rust stable edition 2021
- Tauri command pattern: each command receives `State<Mutex<Connection>>`
- All database access through `Mutex<Connection>` — no raw connection sharing
- Models use serde `Serialize` / `Deserialize` derives

### Styling

- Use CSS custom properties defined in `src/styles/global.css`
- No Tailwind, no CSS-in-JS — project uses a purpose-built dark theme design system
- Color tokens: `--accent`, `--green`, `--amber`, `--red`, `--purple` (with `-lo`, `-bd` variants)
- Fonts: `--font-display` (Playfair Display), `--font-body` (DM Sans)

## Project Structure

```
src/                          # React + TypeScript frontend
├── api/index.ts              # Typed invoke() wrappers
├── components/               # UI components by domain
├── hooks/                    # Custom React hooks
├── store/                    # Zustand stores
├── types/index.ts            # TypeScript interfaces
└── styles/global.css         # Design system

src-tauri/                    # Rust backend
├── src/
│   ├── lib.rs                # App builder + command registration
│   ├── db/                   # Schema, migrations, seed data
│   ├── models/mod.rs         # Serde structs
│   └── commands/mod.rs       # Tauri commands (~40)
├── Cargo.toml
└── tauri.conf.json
```

## Releasing

Releases are triggered by git tags:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The CI pipeline:
1. Runs `sync-version.mjs` to update version in `package.json`, `Cargo.toml`, and `tauri.conf.json`
2. Builds macOS (`.dmg`) and Windows (`.exe`) installers
3. Creates a GitHub Release with download links and updater manifest

Use [semantic versioning](https://semver.org/) for all tags.
