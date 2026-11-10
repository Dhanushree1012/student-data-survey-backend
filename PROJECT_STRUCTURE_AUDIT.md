# Project Structure Audit

## Executive summary

The repository was empty when inspected. There were no existing application files, no framework configuration, no source tree, and no build artifacts. Because the repository does not contain an implementation, the audit focuses on creating a production-ready scaffolding that matches the intended Student Health Hub architecture while preserving a realistic path for future development.

## Current state

- Repository root: `student-health-hub`
- Git branch: `main` before restructuring
- Working tree: clean
- Frontend framework: not present
- Build system: not present
- Auth implementation: not present
- Supabase setup: not present
- Offline sync logic: not present
- Tests: not present

## Proposed architecture

The project should evolve with a modular, feature-first layout:

- `src/app` manages application bootstrapping, routing, and config.
- `src/components` holds reusable UI building blocks.
- `src/features` groups business modules by domain (authentication, students, screening, reports, sync, settings).
- `src/services` isolates Supabase, API, export, and storage concerns.
- `src/core` contains shared validation, permissions, utilities, and domain calculations.
- `src/styles` centralizes styling files.
- `supabase` stores schema, migrations, functions, and seed data.
- `tests` organizes unit, integration, e2e, security, offline, and performance checks.
- `docs` contains architecture and project guides.

## Key decisions

1. Preserve modularity without forcing a framework migration.
2. Keep a minimal JavaScript structure instead of inventing a React app that does not exist.
3. Keep edge functions in `supabase/functions` and database schema in migrations.
4. Leave room for PWA and offline synchronization modules without coupling them to UI code.
5. Create developer ownership boundaries for parallel work.

## Recommended next steps

- Add the actual implementation in the feature modules once requirements are confirmed.
- Introduce Supabase migrations as the real schema source of truth.
- Add a PWA or static web build once the app runtime is chosen.
- Keep test fixtures synthetic and avoid real student data in the repo.
