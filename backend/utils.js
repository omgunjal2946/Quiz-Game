const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(data);
}

function writeJson(filePath, content) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
}

function getNextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

module.exports = { readJson, writeJson, getNextId };
