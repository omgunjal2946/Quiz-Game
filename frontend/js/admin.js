const API_BASE = '/api';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
  window.location.href = '/index.html';
}

const overviewPanel = document.getElementById('overviewPanel');
const studentsTableBody = document.getElementById('studentsTableBody');
const logoutBtn = document.getElementById('logoutBtn');

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`
  };
}

async function loadAdminData() {
  try {
    const [overviewResponse, studentsResponse] = await Promise.all([
      fetch(`${API_BASE}/admin/overview`, { headers: authHeaders() }),
      fetch(`${API_BASE}/admin/students`, { headers: authHeaders() })
    ]);

    if (!overviewResponse.ok || !studentsResponse.ok) {
      throw new Error('Unauthorized');
    }

    const overview = await overviewResponse.json();
    const students = await studentsResponse.json();

    overviewPanel.innerHTML = `
      <h2>Class Overview</h2>
      <p>Total Students: <strong>${overview.totalStudents}</strong></p>
      <p>Average Score: <strong>${overview.averageScore}</strong></p>
      <p>Top Students: <strong>${overview.topStudents.map((s) => `${s.name} (${s.score})`).join(', ') || 'None yet'}</strong></p>
    `;

    studentsTableBody.innerHTML = students
      .map((student) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${(student.progress.completedLevels || []).join(', ') || 'None'}</td>
          <td>${student.progress.totalScore || 0}</td>
        </tr>
      `)
      .join('');
  } catch (error) {
    localStorage.clear();
    window.location.href = '/index.html';
  }
}

logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/index.html';
});

loadAdminData();
