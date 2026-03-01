# 🚀 QuickHire — Job Board Application

A full-stack job board built with **React.js**, **Node.js/Express**, and **PostgreSQL**, containerized with **Docker & Docker Compose**.

---

## 🐳 Quick Start with Docker

**Prerequisites:** [Docker Desktop](https://docs.docker.com/get-docker/)

```bash
git clone https://github.com/your-username/quickhire.git
cd quickhire

cp .env.example .env      # uses defaults — works out of the box

docker compose up --build
```

| Service     | URL                          |
|-------------|------------------------------|
| 🌐 Frontend | http://localhost:3000        |
| ⚙️ Backend  | http://localhost:5000/api    |
| 🐘 Postgres | localhost:5432               |

**Stop:**
```bash
docker compose down          # keep data
docker compose down -v       # wipe DB volume
```

---

## 🔥 Dev Mode (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```
Backend reloads via **nodemon**, frontend via **CRA dev server**.

---

## 🖥️ Run Locally (no Docker)

**Prereqs:** Node.js ≥ 16, PostgreSQL running locally

```bash
# Backend
cd backend
npm install
cp .env.example .env        # edit DB credentials
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start                   # http://localhost:3000
```

---

## 📦 Architecture

```
docker-compose.yml
├── postgres    → PostgreSQL 16 (port 5432)
│                 Tables & seed data created automatically on first start
├── backend     → Node/Express API (port 5000)
│                 Waits for postgres healthcheck before starting
└── frontend    → React app, multi-stage build → served by nginx (port 3000)
                  nginx proxies /api/* → backend:5000
```

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (`search`, `category`, `location`, `type`, `featured`, `page`, `limit`) |
| GET | `/api/jobs/:id` | Single job |
| POST | `/api/jobs` | Create job |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Submit application |
| GET | `/api/health` | Health check |

---

## 🗄️ Database Schema (PostgreSQL)

```sql
-- Jobs
CREATE TABLE jobs (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  company     VARCHAR(255) NOT NULL,
  location    VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  type        VARCHAR(50)  DEFAULT 'Full Time',
  description TEXT         NOT NULL,
  salary      VARCHAR(100) DEFAULT 'Competitive',
  logo        VARCHAR(10),
  featured    BOOLEAN      DEFAULT false,
  tags        TEXT[],
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
  id          SERIAL PRIMARY KEY,
  job_id      INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  resume_link TEXT         NOT NULL,
  cover_note  TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);
```

---

## 📁 Project Structure

```
quickhire/
├── docker-compose.yml         # Production (3 services)
├── docker-compose.dev.yml     # Dev with hot reload
├── .env.example
│
├── backend/
│   ├── Dockerfile             # Production image
│   ├── Dockerfile.dev         # Dev image (nodemon)
│   ├── server.js              # Express app + DB init + seed
│   └── routes/
│       ├── jobs.js            # CRUD with raw pg queries
│       └── applications.js
│
└── frontend/
    ├── Dockerfile             # Multi-stage → nginx
    ├── Dockerfile.dev
    ├── nginx.conf             # SPA routing + /api proxy
    └── src/
        ├── components/        # Navbar, Footer, JobCard, SearchBar
        ├── pages/             # Home, Jobs, JobDetail, Admin
        └── utils/api.js
```

---

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PGUSER` | `quickhire` | PostgreSQL username |
| `PGPASSWORD` | `password` | PostgreSQL password |
| `PORT` | `5000` | Backend port |
