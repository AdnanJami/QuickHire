const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const getPool = (req) => req.app.locals.pool;

// GET /api/jobs
router.get('/', async (req, res) => {
  const pool = getPool(req);
  try {
    const { search, category, location, type, featured, page = 1, limit = 10 } = req.query;
    const conditions = [];
    const params = [];
    let i = 1;

    if (search) {
      conditions.push(`(title ILIKE $${i} OR company ILIKE $${i} OR description ILIKE $${i})`);
      params.push(`%${search}%`);
      i++;
    }
    if (category) {
      conditions.push(`category = $${i}`);
      params.push(category);
      i++;
    }
    if (location) {
      conditions.push(`location ILIKE $${i}`);
      params.push(`%${location}%`);
      i++;
    }
    if (type) {
      conditions.push(`type = $${i}`);
      params.push(type);
      i++;
    }
    if (featured === 'true') {
      conditions.push(`featured = true`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await pool.query(`SELECT COUNT(*) FROM jobs ${where}`, params);
    const total = parseInt(countRes.rows[0].count);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);
    const dataRes = await pool.query(
      `SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    res.json({
      success: true,
      data: dataRes.rows,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  const pool = getPool(req);
  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const pool = getPool(req);
    try {
      const { title, company, location, category, type = 'Full Time', description, salary = 'Competitive', logo = '', featured = false, tags = [] } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO jobs (title, company, location, category, type, description, salary, logo, featured, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [title, company, location, category, type, description, salary, logo, featured, tags]
      );
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  const pool = getPool(req);
  try {
    const { rowCount } = await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
