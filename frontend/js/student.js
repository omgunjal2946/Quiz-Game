const API_BASE = '/api';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'student') {
  window.location.href = '/index.html';
}

const studentName = document.getElementById('studentName');
const totalScore = document.getElementById('totalScore');
const completedCount = document.getElementById('completedCount');
const levelsContainer = document.getElementById('levelsContainer');
const levelLabel = document.getElementById('levelLabel');
const codeInput = document.getElementById('codeInput');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const resultMessage = document.getElementById('resultMessage');
const logoutBtn = document.getElementById('logoutBtn');

let selectedLevelId = null;
let levels = [];

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function updateProgress(progress) {
  totalScore.textContent = progress.totalScore || 0;
  completedCount.textContent = (progress.completedLevels || []).length;
}

async function loadProfileAndLevels() {
  try {
    const [meResponse, levelsResponse] = await Promise.all([
      fetch(`${API_BASE}/auth/me`, { headers: authHeaders() }),
      fetch(`${API_BASE}/levels`, { headers: authHeaders() })
    ]);

    if (!meResponse.ok || !levelsResponse.ok) {
      throw new Error('Unauthorized');
    }

    const me = await meResponse.json();
    levels = await levelsResponse.json();

    studentName.textContent = me.name;
    updateProgress(me.progress);
    renderLevels(me.progress.completedLevels || []);
  } catch (error) {
    localStorage.clear();
    window.location.href = '/index.html';
  }
}

function renderLevels(completedLevels) {
  levelsContainer.innerHTML = '';

  levels.forEach((level) => {
    const card = document.createElement('article');
    card.className = 'level-card';

    if (completedLevels.includes(level.id)) {
      card.classList.add('completed');
    }

    card.innerHTML = `
      <h3>${level.title}</h3>
      <p>${level.description}</p>
      <small>Hint: ${level.instruction}</small>
    `;

    card.addEventListener('click', () => {
      selectedLevelId = level.id;
      document.querySelectorAll('.level-card').forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
      levelLabel.textContent = `Selected: ${level.title}`;
      resultMessage.textContent = '';
    });

    levelsContainer.appendChild(card);
  });
}

submitCodeBtn.addEventListener('click', async () => {
  if (!selectedLevelId) {
    resultMessage.className = 'message fail';
    resultMessage.textContent = 'Please select a level before submitting code.';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/levels/submit/${selectedLevelId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ code: codeInput.value })
    });

    const data = await response.json();

    if (!response.ok) {
      resultMessage.className = 'message fail';
      resultMessage.textContent = data.message || 'Submission failed.';
      return;
    }

    resultMessage.className = data.passed ? 'message pass' : 'message fail';
    resultMessage.textContent = `${data.passed ? 'PASS' : 'FAIL'}: ${data.feedback.join(' ')}`;

    updateProgress(data.progress);
    renderLevels(data.progress.completedLevels || []);
  } catch (error) {
    resultMessage.className = 'message fail';
    resultMessage.textContent = 'Server error while validating code.';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/index.html';
});

loadProfileAndLevels();
