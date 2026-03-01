const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const getPool = (req) => req.app.locals.pool;

// POST /api/applications
router.post(
  '/',
  [
    body('job_id').notEmpty().withMessage('Job ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('resume_link').isURL().withMessage('Please enter a valid URL for resume'),
    body('cover_note').notEmpty().withMessage('Cover note is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const pool = getPool(req);
    try {
      const { job_id, name, email, resume_link, cover_note } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO applications (job_id, name, email, resume_link, cover_note)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [job_id, name, email, resume_link, cover_note]
      );
      res.status(201).json({ success: true, data: rows[0], message: 'Application submitted successfully!' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/applications
router.get('/', async (req, res) => {
  const pool = getPool(req);
  try {
    const { rows } = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
