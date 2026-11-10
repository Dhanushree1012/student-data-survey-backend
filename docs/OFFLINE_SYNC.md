# Offline synchronization design

This project is designed around an offline-first flow for enumerators working in schools with unreliable connectivity. Records are stored locally and synchronized when connectivity is restored. The workflow includes:

- local queueing of student submissions
- idempotency keys for safe replays
- retry backoff policy
- conflict visibility for server-side changes
- secure session expiry and local cache cleanup policies

The application does not silently overwrite newer server state. When the Supabase environment is configured, the sync layer can use authenticated API calls to push queued records and reconcile conflicts.
