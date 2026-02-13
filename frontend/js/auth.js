const API_BASE = '/api';

const tabButtons = document.querySelectorAll('.tab-btn');
const formTitle = document.getElementById('formTitle');
const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');

let mode = 'student';

function setMode(newMode) {
  mode = newMode;
  tabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.role === newMode));

  if (mode === 'register') {
    formTitle.textContent = 'Student Registration';
    nameInput.classList.remove('hidden');
    nameInput.required = true;
    submitBtn.textContent = 'Register';
  } else if (mode === 'admin') {
    formTitle.textContent = 'Admin Login';
    nameInput.classList.add('hidden');
    nameInput.required = false;
    submitBtn.textContent = 'Login';
  } else {
    formTitle.textContent = 'Student Login';
    nameInput.classList.add('hidden');
    nameInput.required = false;
    submitBtn.textContent = 'Login';
  }

  message.textContent = '';
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => setMode(btn.dataset.role));
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  if (mode === 'register') {
    payload.name = nameInput.value.trim();
  } else {
    payload.role = mode;
  }

  const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      message.className = 'message fail';
      message.textContent = data.message || 'Request failed.';
      return;
    }

    if (mode === 'register') {
      message.className = 'message pass';
      message.textContent = 'Registration complete! Please login as student.';
      setMode('student');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);

    window.location.href = data.user.role === 'admin' ? '/admin.html' : '/student.html';
  } catch (error) {
    message.className = 'message fail';
    message.textContent = 'Server error. Please try again.';
  }
});
