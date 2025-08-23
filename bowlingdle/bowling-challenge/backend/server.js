const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get today's challenge
app.get('/api/challenge/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const result = await db.query(
      'SELECT date, video_id, start_time, end_time, freeze_time, answer, standing_pins FROM daily_challenges WHERE date = $1',
      [today]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No challenge found for today',
        date: today
      });
    }

    const challenge = result.rows[0];

    // Don't send the answer to the frontend initially
    // Change this part:
    res.json({
      date: challenge.date,
      videoId: challenge.video_id,
      startTime: challenge.start_time,     // New
      freezeTime: challenge.freeze_time,   // New  
      endTime: challenge.end_time,         // New
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify guess and get result
app.post('/api/challenge/verify', async (req, res) => {
  try {
    const { guess, date } = req.body;

    if (!guess || !date) {
      return res.status(400).json({ error: 'Guess and date are required' });
    }

    const result = await db.query(
      'SELECT answer, standing_pins FROM daily_challenges WHERE date = $1',
      [date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = result.rows[0];
    const isCorrect = guess.toLowerCase() === challenge.answer.toLowerCase();

    res.json({
      correct: isCorrect,
      answer: challenge.answer,
      standingPins: challenge.standing_pins
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});