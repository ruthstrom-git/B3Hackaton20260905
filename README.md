# B3 Hackathon Demo — Notes App

A minimal full-stack CRUD demo: Express API + PostgreSQL + plain HTML/CSS/JS frontend, served from a single Node process.

## Stack

- **Backend**: Node.js + Express (`src/`)
- **Database**: PostgreSQL
- **Frontend**: plain HTML/CSS/JS (`public/`), served as static files by the same Express app
- **Deployment**: Render (Blueprint via `render.yaml`)

## Local development

Requires Node.js and Docker.

1. Start a local Postgres:
   ```bash
   docker compose up -d
   ```
2. Copy the env template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start the app:
   ```bash
   npm install
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000).

The `notes` table is created automatically on startup — no manual migration step.

## Deploying to Render

`docker-compose.yml` is for local development only — Render does not use it. On Render, Postgres runs as a separate managed database, and `render.yaml` wires it to the web service automatically.

1. Push this repo to GitHub (already connected to `origin`).
2. In the [Render dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**, and connect this GitHub repo.
3. Render reads `render.yaml` and provisions both the web service and the Postgres database, linking `DATABASE_URL` between them automatically.
4. Render runs `npm install` then `npm start`, and the app (API + frontend) is live at the generated `https://<name>.onrender.com` URL.
5. Every subsequent push to `main` triggers an automatic redeploy.

## API

| Method | Path              | Description       |
|--------|-------------------|--------------------|
| GET    | `/api/notes`      | List all notes     |
| POST   | `/api/notes`      | Create a note       |
| PUT    | `/api/notes/:id`  | Update a note       |
| DELETE | `/api/notes/:id`  | Delete a note       |
| GET    | `/healthz`        | Health check        |

Interactive API docs (Swagger UI) are served at `/api-docs`, generated from `src/openapi.yaml`. Each endpoint has a **Try it out** button — fill in the fields and click **Execute** to send a real request against the live API and see the actual response.
