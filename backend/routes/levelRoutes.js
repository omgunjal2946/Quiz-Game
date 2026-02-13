const express = require('express');
const { readJson, writeJson } = require('../utils');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

function normalizeCode(code = '') {
  return code.replace(/\s+/g, ' ').trim();
}

function validateLevel(level, userCode) {
  const cleanedCode = normalizeCode(userCode);
  let passed = true;
  const feedback = [];

  if (!cleanedCode) {
    return { passed: false, feedback: ['Code submission is empty.'] };
  }

  if (level.requiredKeywords) {
    level.requiredKeywords.forEach((keyword) => {
      if (!cleanedCode.includes(keyword)) {
        passed = false;
        feedback.push(`Missing required keyword: ${keyword}`);
      }
    });
  }

  if (level.requiredPattern) {
    const pattern = new RegExp(level.requiredPattern, 'i');
    if (!pattern.test(cleanedCode)) {
      passed = false;
      feedback.push('Expected code pattern was not found.');
    }
  }

  if (passed) {
    feedback.push('Great work! Your code meets this level requirement.');
  }

  return { passed, feedback };
}

router.get('/', authenticateToken, authorizeRole('student'), (req, res) => {
  const levels = readJson('data/levels.json');
  res.json(levels);
});

router.post('/submit/:levelId', authenticateToken, authorizeRole('student'), (req, res) => {
  const levelId = Number(req.params.levelId);
  const { code } = req.body;

  const levels = readJson('data/levels.json');
  const users = readJson('data/users.json');

  const level = levels.find((l) => l.id === levelId);
  const user = users.find((u) => u.id === req.user.id);

  if (!level) {
    return res.status(404).json({ message: 'Level not found.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const result = validateLevel(level, code);

  if (result.passed && !user.progress.completedLevels.includes(levelId)) {
    user.progress.completedLevels.push(levelId);
    user.progress.scores[levelId] = level.score;
    user.progress.totalScore = Object.values(user.progress.scores).reduce((sum, value) => sum + value, 0);
    writeJson('data/users.json', users);
  }

  return res.json({
    levelId,
    passed: result.passed,
    feedback: result.feedback,
    progress: user.progress
  });
});

module.exports = router;
