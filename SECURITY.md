# Security policy

This project must not store secrets, tokens, API keys, or credentials in source control.

## Required safeguards

- Keep `.env` files local and ignored.
- Never commit Supabase service-role keys.
- Avoid production credentials in defaults or examples.
- Protect generated test data from being mistaken for real records.
