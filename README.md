# Plumbing Availability Finder AI Task

A small fullstack starter for a coding interview. See [task.md](./task.md) for the brief.

## Prerequisites

- Node 22 (`nvm use` in this directory will pick it up from `.nvmrc`)

## Install

```
npm install
```

This installs dependencies for both workspaces (`frontend/` and `backend/`).

## Run

```
npm run dev
```

This starts:

- the backend on http://localhost:3001
- the frontend on http://localhost:5173

Open http://localhost:5173 in your browser.

The Vite dev server proxies `/api/*` to the backend, so the frontend can call `fetch('/api/companies')` directly.

## Run individually

```
npm run dev:frontend
npm run dev:backend
```

## Tests

```
npm test -w backend
npm test -w frontend
```

## Layout

```
frontend/   Vite + React + TypeScript (react-router-dom)
backend/    Express + TypeScript (run via tsx watch)
```

## API surface

- `GET /api/companies` — returns companies with their employees nested

## Frontend routes

- `/`        — main page: "Find closest booking" button + list of company cards
- `/results` — results page: proposed booking + Accept button
