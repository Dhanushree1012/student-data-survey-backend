# File directory guide

## Root overview

- `public`: static assets and web metadata.
- `src`: application source code and feature modules.
- `supabase`: schema, seed script, and edge functions.
- `tests`: automated verification by type.
- `scripts`: operational and generation scripts.
- `infrastructure`: hosting and observability configuration.
- `docs`: architecture and developer guidance.

## Feature placement

- Authentication logic belongs under `src/features/authentication`.
- Student and screening workflows belong under `src/features/students` and `src/features/screening`.
- Offline sync logic belongs under `src/features/offline-sync`.
- Reporting and export code belongs under `src/features/reports`.
