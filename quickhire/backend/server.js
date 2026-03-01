require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL pool
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'quickhire',
  user: process.env.PGUSER || 'quickhire',
  password: process.env.PGPASSWORD || 'password',
});

// Make pool available to routes
app.locals.pool = pool;

// Test DB connection and run migrations
async function initDB() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
    await runMigrations();
    await seedData();
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  }
}

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'Full Time',
      description TEXT NOT NULL,
      salary VARCHAR(100) DEFAULT 'Competitive',
      logo VARCHAR(10) DEFAULT '',
      featured BOOLEAN DEFAULT false,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      resume_link TEXT NOT NULL,
      cover_note TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ Database migrations complete');
}

async function seedData() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM jobs');
  if (parseInt(rows[0].count) > 0) return; // already seeded

  const jobs = [
    ['Email Marketing', 'Revolut', 'Madrid, Spain', 'Marketing', 'Full Time', 'Revolut is looking for an Email Marketing specialist to help team members grow our digital presence through targeted campaigns. You will create and manage email marketing strategies, analyze campaign performance, and collaborate with cross-functional teams to drive user engagement.', '$60,000 - $80,000', 'R', true, ['Marketing', 'Design']],
    ['Brand Designer', 'Dropbox', 'San Francisco, USA', 'Design', 'Full Time', 'Dropbox is looking for a Brand Designer to help the team create beautiful, on-brand visual assets. You will develop and maintain brand guidelines, create marketing materials, and collaborate with product and marketing teams.', '$90,000 - $120,000', 'D', true, ['Design', 'Business']],
    ['Social Media Assistant', 'Nomad', 'Paris, France', 'Marketing', 'Full Time', 'We are looking for a Social Media Assistant who will support the marketing team in managing social media accounts across all platforms. Responsibilities include content creation, community management, and performance reporting.', '$40,000 - $55,000', 'N', false, ['Marketing', 'Design']],
    ['Interactive Developer', 'Terraform', 'Hamburg, Germany', 'Technology', 'Full Time', 'Terraform is looking for an Interactive Developer to join our growing team. You will build interactive web experiences using modern JavaScript frameworks and collaborate with designers to bring creative concepts to life.', '$80,000 - $110,000', 'T', false, ['Marketing', 'Design']],
    ['HR Manager', 'Packer', 'Lucern, Switzerland', 'Human Resources', 'Full Time', 'Packer is looking for a HR Manager to join our team and help grow our talent acquisition and employee experience programs. You will oversee recruitment, onboarding, performance management, and employee relations.', '$70,000 - $95,000', 'P', false, ['Marketing', 'Management']],
    ['Product Designer', 'ClassPass', 'Manchester, UK', 'Design', 'Full Time', 'ClassPass is looking for a Product Designer to help us design beautiful, user-centric interfaces for our fitness platform. You will conduct user research, create wireframes, and ship polished UI designs.', '$75,000 - $100,000', 'C', true, ['Marketing', 'Design']],
    ['Lead Engineer', 'Canva', 'Ontario, Canada', 'Engineering', 'Full Time', 'Canva is looking for a Lead Engineer to build scalable systems and mentor junior engineers. You will define technical architecture, conduct code reviews, and partner with product to deliver high-quality features.', '$120,000 - $160,000', 'C', true, ['Design', 'Business']],
    ['Brand Strategist', 'GoDaddy', 'Marseille, France', 'Marketing', 'Full Time', 'GoDaddy is looking for a Brand Strategist to develop and execute comprehensive brand strategies. You will work across teams to ensure consistent brand messaging and drive awareness campaigns.', '$65,000 - $85,000', 'G', true, ['Marketing', 'Business']],
    ['Data Analyst', 'Twitter', 'San Diego, US', 'Technology', 'Full Time', 'Twitter is looking for a Data Analyst to help the team document and analyze large data sets for actionable insights. You will build dashboards, conduct A/B tests, and present findings to stakeholders.', '$95,000 - $130,000', 'T', true, ['Technology']],
  ];

  for (const j of jobs) {
    await pool.query(
      `INSERT INTO jobs (title, company, location, category, type, description, salary, logo, featured, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      j
    );
  }
  console.log('✅ Seeded 9 sample jobs');
}

// Routes
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'postgres', message: 'QuickHire API is running' });
  } catch {
    res.status(500).json({ status: 'error', message: 'DB unreachable' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

module.exports = app;
