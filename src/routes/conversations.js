const express = require('express');
const { pool } = require('../db');

const VALID_MODES = ['Bright', 'Content', 'Calm', 'Tired', 'Tense'];

const router = express.Router();

function validateMode(mode, res) {
  if (!mode || !VALID_MODES.includes(mode)) {
    res.status(400).json({ error: `mode is required and must be one of: ${VALID_MODES.join(', ')}` });
    return false;
  }
  return true;
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM conversations ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { mode, location, content } = req.body;
    if (!validateMode(mode, res)) return;
    const { rows } = await pool.query(
      'INSERT INTO conversations (mode, location, content) VALUES ($1, $2, $3) RETURNING *',
      [mode, location || null, content || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { mode, location, content } = req.body;
    if (!validateMode(mode, res)) return;
    const { rows } = await pool.query(
      'UPDATE conversations SET mode = $1, location = $2, content = $3 WHERE id = $4 RETURNING *',
      [mode, location || null, content || null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'conversation not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM conversations WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'conversation not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
