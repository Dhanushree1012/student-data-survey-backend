# Backend security tests

The pgTAP database tests are in
[`supabase/tests/database/`](../../supabase/tests/database/). They cover
district and organization scope, profile update privileges, and invitation
security. The tests use synthetic users and records and roll back their
transactions when they finish.

## Coverage

The suite checks that:

- Organization admins can read and use the permitted records in their
  organization, but cannot read or modify another organization's records.
- District managers can read and update their district's sessions and
  screenings, manage assignments only within their district, and cannot read
  or update another district's records.
- Enumerators can read their own profile and assignments, use their own
  district's locations and locations belonging to assigned sessions, and
  read/create screenings only in assigned sessions.
  The current policies do not permit enumerators to update profiles or
  screenings, create sessions, or insert/delete assignments.
- Cross-organization assignment references are rejected by composite foreign
  keys, while authenticated cross-organization operations are rejected by
  RLS.
- Invitation tests cover role and scope authorization, idempotency, duplicate
  email protection, exact Auth-user matching, cancellation, acceptance, and
  history preservation. Profile privilege tests verify that authenticated
  users can update only the permitted display-name column.

Assertions that represent an allowed update also check the resulting value:
RLS can silently filter an unauthorized `UPDATE` without raising an error.
Policy-denied `INSERT` checks use `throws_ok` and SQLSTATE `42501`; the
cross-organization composite foreign-key check expects SQLSTATE `23503`.

## Prerequisites and commands

Install the Supabase CLI and Docker Desktop, and make sure Docker is running.
Run from the repository root. These commands operate on the **local** Supabase
stack only; do not add `--linked` or a project reference. `supabase db reset`
recreates the local database, applies all migrations, and can erase local
database data.

```powershell
supabase start
supabase db reset
supabase test db
supabase stop
```

The test enables `pgTAP` in its transaction and uses authenticated role
simulation with local JWT claims. Setup and verification queries use the
database test owner; RLS assertions are explicitly run after `SET LOCAL ROLE
authenticated`.

## Limitations

- The latest local run of `npx supabase test db .\supabase\tests\database`
  completed with 172 assertions, 172 passed, and 0 failed against the local
  Supabase database. This result is not from the hosted project and does not
  verify all production security behavior.
- The local Supabase CLI configuration was used to run migrations and tests
  against the local stack. Hosted project settings remain separate and
  unverified.
- Fixtures insert rows directly into `auth.users`. The repository migrations
  do not create an `auth.users` profile trigger; a project-specific trigger or
  customized Auth schema could affect fixture setup.
- The suite verifies the policies and schema in the local migrations, not
  hosted-project configuration, dashboard-added policies, or frontend route
  guards.
- The suite asserts that client-side profile insertion is denied; initial
  account provisioning is documented as a manual Supabase operation.
