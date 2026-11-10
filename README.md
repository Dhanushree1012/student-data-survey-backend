# Student Health Hub

Student Health Hub is a production-oriented school health screening and management system for districts, schools, enumerators, and administrators.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Supabase client abstraction
- Local role-based application flow and admin dashboard shell

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
```

## Validate

```bash
npm run validate
npm run build
```

## Current status

This repository now includes a functioning frontend shell, role-based navigation, health screening modules, reporting exports, and a prepared architecture for Supabase integration. External cloud services are not connected until valid credentials are supplied.
