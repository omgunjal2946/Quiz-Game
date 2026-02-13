const express = require('express');
const { readJson } = require('../utils');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/students', authenticateToken, authorizeRole('admin'), (req, res) => {
  const users = readJson('data/users.json');
  const students = users
    .filter((u) => u.role === 'student')
    .map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      progress: student.progress
    }));

  res.json(students);
});

router.get('/overview', authenticateToken, authorizeRole('admin'), (req, res) => {
  const users = readJson('data/users.json');
  const students = users.filter((u) => u.role === 'student');

  const totalStudents = students.length;
  const averageScore = totalStudents
    ? students.reduce((sum, s) => sum + (s.progress.totalScore || 0), 0) / totalStudents
    : 0;

  res.json({
    totalStudents,
    averageScore: Number(averageScore.toFixed(2)),
    topStudents: students
      .sort((a, b) => (b.progress.totalScore || 0) - (a.progress.totalScore || 0))
      .slice(0, 5)
      .map((s) => ({ name: s.name, score: s.progress.totalScore || 0 }))
  });
});

module.exports = router;
