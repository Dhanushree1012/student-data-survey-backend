# Student Health Hub — Project Architecture

## Application layers
1. Presentation layer: React + Vite + TypeScript UI and route-driven pages.
2. Business logic layer: service modules, validation, and permission checks.
3. Data layer: Supabase PostgreSQL with row-level security and offline synchronization patterns.
4. Infrastructure layer: GitHub Actions, environment management, and deployment guidance.

## Role model
- Organization Administrator: full platform access and governance.
- District Manager: district-bound access.
- Enumerator: school and session-scoped access for student screening and submission.

## Security notes
- Use Supabase auth and server-side enforcement for privileged actions.
- Keep secrets in environment variables only.
- Keep all privileged operations on the backend.

## Offline strategy
- Use IndexedDB for queued records.
- Store idempotency keys, sync backlog metadata, and retry state locally.
- Resolve conflicts with a last-write-wins or explicit review policy, never silently overwriting server records.
