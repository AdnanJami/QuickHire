# 🚀 QuickHire — Job Board Application

A full-stack job board application built with **React.js** (frontend) and **Node.js/Express** (backend), featuring a clean UI based on the QuickHire design.

![QuickHire Preview](preview.png)

---

## 📋 Features

### Frontend (React.js)
- ✅ **Landing Page** — Hero, category explore, featured jobs, latest jobs open
- ✅ **Job Listings Page** — Search, filter by category/type/location, pagination
- ✅ **Job Detail Page** — Full description, "Apply Now" form with validation
- ✅ **Admin Panel** — Post & delete job listings, view applications
- ✅ **Fully Responsive** — Mobile, tablet, desktop
- ✅ **Beautiful UI** — Matches QuickHire Figma design (Syne + DM Sans fonts, blue color scheme)

### Backend (Node.js/Express)
- ✅ RESTful API with in-memory fallback (works without MongoDB)
- ✅ Input validation on all endpoints
- ✅ CORS-enabled for React frontend

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs (supports search, category, location, type, featured, page, limit) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create job (Admin) |
| DELETE | `/api/jobs/:id` | Delete job (Admin) |
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Submit application |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| Styling | Tailwind CSS + custom CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (with in-memory fallback) |
| Validation | express-validator |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm or yarn
- MongoDB (optional — app works without it using in-memory data)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quickhire.git
cd quickhire
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickhire
NODE_ENV=development
```

Start the backend:

```bash
npm run dev   # with nodemon (auto-reload)
# or
npm start     # production
```

The API will run at `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

Start the frontend:

```bash
npm start
```

The app will run at `http://localhost:3000`

---

## 📁 Project Structure

```
quickhire/
├── backend/
│   ├── models/
│   │   ├── Job.js           # Job mongoose model
│   │   └── Application.js   # Application mongoose model
│   ├── routes/
│   │   ├── jobs.js          # Jobs CRUD routes
│   │   └── applications.js  # Applications routes
│   ├── server.js            # Express app entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js    # Navigation bar
│       │   ├── Footer.js    # Footer with newsletter
│       │   ├── JobCard.js   # Reusable job card
│       │   └── SearchBar.js # Search input component
│       ├── pages/
│       │   ├── HomePage.js     # Landing page
│       │   ├── JobsPage.js     # Job listings + filters
│       │   ├── JobDetailPage.js # Job detail + apply form
│       │   └── AdminPage.js    # Admin dashboard
│       ├── utils/
│       │   └── api.js       # Axios API helpers
│       ├── App.js           # Router + layout
│       ├── index.js         # React entry point
│       └── index.css        # Global styles
│
└── README.md
```

---

## 🗄️ Database Models

### Job
```js
{
  _id: ObjectId,
  title: String,         // required
  company: String,       // required
  location: String,      // required
  category: String,      // required (enum)
  type: String,          // 'Full Time' | 'Part Time' | 'Remote' | 'Contract'
  description: String,   // required
  salary: String,
  logo: String,
  featured: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Application
```js
{
  _id: ObjectId,
  job_id: ObjectId,     // ref: Job
  name: String,         // required
  email: String,        // required, validated
  resume_link: String,  // required, must be valid URL
  cover_note: String,   // required
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Environment Variables

### Backend `.env`
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/quickhire` | MongoDB connection string |
| `NODE_ENV` | `development` | Environment |

### Frontend `.env`
| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API URL |

---

## 📝 Notes

- **No MongoDB needed** to run the app. The backend automatically falls back to in-memory data if MongoDB is unavailable.
- The app comes pre-seeded with 9 sample jobs when running without MongoDB.
- Admin panel has no authentication (as per the task scope) — for production, JWT auth should be added.

---

## 🎨 Design

UI implemented based on the QuickHire Figma template:
- **Colors**: Primary blue `#2B4EFF`, dark `#1A1A2E`
- **Fonts**: Syne (headings) + DM Sans (body)
- **Design**: Clean, modern, card-based layout with smooth hover effects

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy /build folder to Vercel
```

### Backend (Railway / Render)
```bash
# Push to GitHub and connect to Railway or Render
# Set environment variables in the platform dashboard
```

---

## 🤝 Author

Built as a technical assessment for QuickHire.
