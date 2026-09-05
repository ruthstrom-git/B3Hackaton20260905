# B3 Hackathon Demo — Conversations App

A minimal full-stack CRUD demo: Express API + PostgreSQL + plain HTML/CSS/JS frontend, served from a single Node process. A **conversation** logs a person's mode (Bright, Content, Calm, Tired, Tense) along with when and where it was recorded.

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

The `conversations` table is created automatically on startup — no manual migration step.

## Deploying to Render

`docker-compose.yml` is for local development only — Render does not use it. On Render, Postgres runs as a separate managed database, and `render.yaml` wires it to the web service automatically.

1. Push this repo to GitHub (already connected to `origin`).
2. In the [Render dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**, and connect this GitHub repo.
3. Render reads `render.yaml` and provisions both the web service and the Postgres database, linking `DATABASE_URL` between them automatically.
4. Render runs `npm install` then `npm start`, and the app (API + frontend) is live at the generated `https://<name>.onrender.com` URL.
5. Every subsequent push to `main` triggers an automatic redeploy.

The deployed API requires **no authentication** — it's fully public at that URL, reachable by any client (e.g. a mobile app posting conversations directly).

## Data model

Each conversation has:

| Field        | Type      | Notes                                                             |
|--------------|-----------|--------------------------------------------------------------------|
| `id`         | integer   | Auto-generated                                                     |
| `mode`       | text      | Required. One of: `Bright`, `Content`, `Calm`, `Tired`, `Tense`     |
| `location`   | text      | Optional. `"lat,lng"` string, e.g. from a mobile app                |
| `content`    | text      | Optional free-text context                                          |
| `created_at` | timestamp | Server-assigned when the conversation is created                    |

## API

| Method | Path                     | Description               |
|--------|--------------------------|----------------------------|
| GET    | `/api/conversations`     | List all conversations      |
| POST   | `/api/conversations`     | Create a conversation        |
| PUT    | `/api/conversations/:id` | Update a conversation        |
| DELETE | `/api/conversations/:id` | Delete a conversation        |
| GET    | `/healthz`               | Health check                 |

Interactive API docs (Swagger UI) are served at `/api-docs`, generated from `src/openapi.yaml`. Each endpoint has a **Try it out** button — fill in the fields and click **Execute** to send a real request against the live API and see the actual response.
