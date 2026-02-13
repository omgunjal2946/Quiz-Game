const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJson, writeJson, getNextId } = require('../utils');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const users = readJson('data/users.json');
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: getNextId(users),
      name,
      email,
      password: hashedPassword,
      role: 'student',
      progress: {
        completedLevels: [],
        scores: {},
        totalScore: 0
      }
    };

    users.push(newUser);
    writeJson('data/users.json', users);

    res.status(201).json({ message: 'Student registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Registration error.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const users = readJson('data/users.json');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, progress: user.progress }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error.', error: error.message });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  const users = readJson('data/users.json');
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    progress: user.progress
  });
});

module.exports = router;
