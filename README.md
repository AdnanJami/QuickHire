# 🚀 QuickHire — Job Board Application

A full-stack job board built with **React.js**, **Node.js/Express**, and **PostgreSQL**, containerized with **Docker & Docker Compose**.

---

## 🐳 Quick Start with Docker

**Prerequisites:** [Docker Desktop](https://docs.docker.com/get-docker/)

```bash
git clone https://github.com/AdnanJami/QuickHire.git
cd quickhire

cp .env.example .env      # uses defaults — works out of the box

docker compose up --build
```

| Service     | URL                       |
|-------------|---------------------------|
| 🌐 Frontend | http://localhost:3000     |
| ⚙️ Backend  | http://localhost:5000/api |
| 🐘 Postgres | localhost:5432            |

**Stop:**
```bash
docker compose down        # keep data
docker compose down -v     # wipe DB volume
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
cp .env.example .env      # edit DB credentials
npm run dev               # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start                 # http://localhost:3000
```

---

## 📋 Features

### Public Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, category grid, featured jobs, latest jobs |
| Jobs | `/jobs` | Search + filter by category, type, location with pagination |
| Job Detail | `/jobs/:id` | Full job description + Apply Now form |

### Admin Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin` | Stats overview, post/delete jobs, view all applications |
| Job Detail | `/admin/jobs/:id` | Full job info + list of all applicants for that job |

### Admin Dashboard Tabs

**Jobs Tab**
- Post a new job listing (title, company, location, category, type, salary, tags, description, featured)
- View all jobs with company logo, location, type
- **View Applicants** button → navigates to the admin job detail page
- **Delete** button per job

**Applications Tab**
- Shows only jobs that have received at least one application
- Click a job row to **expand inline** and see all applicants
- Each applicant shows: name, email, date applied, cover note, resume link
- **Details** button → navigates to the full admin job detail page
- **Delete** button to remove the job listing

### Admin Job Detail Page (`/admin/jobs/:id`)
- Full job info (title, company, location, salary, tags, description)
- Right panel lists all applicants for that specific job
- Each applicant card is collapsible — click to see resume link + cover note
- **Delete Job** button in the top bar

---

## 🗺️ Page Flow

```
Home (/)
 └─ Browse Jobs → /jobs
     └─ Click job card → /jobs/:id  (apply form)

Admin (/admin)
 ├─ Jobs Tab
 │   └─ View Applicants → /admin/jobs/:id  (applicants panel)
 └─ Applications Tab
     ├─ Click job row → expand applicants inline
     └─ Details button → /admin/jobs/:id
```

---

## 🗄️ Database Schema (PostgreSQL)

```sql
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

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (`search`, `category`, `location`, `type`, `featured`, `page`, `limit`) |
| GET | `/api/jobs/:id` | Single job |
| POST | `/api/jobs` | Create job |
| DELETE | `/api/jobs/:id` | Delete job (cascades to applications) |
| GET | `/api/applications` | All applications (supports `?job_id=` filter) |
| POST | `/api/applications` | Submit application |
| GET | `/api/health` | Health check |

---

## 📦 Docker Architecture

```
docker-compose.yml
├── postgres    → PostgreSQL 16 (port 5432)
│                 Tables + seed data auto-created on first start
├── backend     → Node/Express API (port 5000)
│                 Waits for postgres healthcheck before starting
└── frontend    → React app, multi-stage build → nginx (port 3000)
                  nginx proxies /api/* → backend:5000
```

---

## 📁 Project Structure

```
quickhire/
├── docker-compose.yml          # Production (3 services)
├── docker-compose.dev.yml      # Dev with hot reload
├── .env.example
│
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── server.js               # Express app + DB init + seed
│   └── routes/
│       ├── jobs.js
│       └── applications.js
│
└── frontend/
    ├── Dockerfile              # Multi-stage build → nginx
    ├── Dockerfile.dev
    ├── nginx.conf              # SPA routing + /api proxy
    └── src/
        ├── components/         # Navbar, Footer, JobCard, SearchBar
        ├── pages/
        │   ├── HomePage.js
        │   ├── JobsPage.js
        │   ├── JobDetailPage.js
        │   ├── AdminPage.js
        │   └── AdminJobDetailPage.js
        └── utils/api.js
```

---

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PGUSER` | `quickhire` | PostgreSQL username |
| `PGPASSWORD` | `password` | PostgreSQL password |
| `PORT` | `5000` | Backend port |

---

## 🎨 Design

- **Primary color:** `#2B4EFF`
- **Fonts:** Syne (headings) · DM Sans (body)
- UI based on the QuickHire Figma template