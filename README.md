# CodeHero Academy (CodeCombat-Inspired College Project)

CodeHero Academy is a beginner-friendly full-stack web app where students solve simple coding missions and admins monitor progress. It uses:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** JSON files (no SQL required)
- **Security:** bcrypt password hashing + JWT tokens

---

## 1) Features Implemented

### User System
- Student registration and login
- Admin login (separate role)
- Password hashing with bcrypt
- Role-based access control (student/admin)

### Database (JSON)
- `users.json` stores users, role, hashed password, progress
- `levels.json` stores game levels, expected validation patterns, and score

### Frontend Pages
- Login/Register page
- Student dashboard (levels, code submission, score)
- Admin panel (student list + class overview)

### Game Levels
- Two coding levels (Python-style puzzles)
- PASS / FAIL via safe text pattern checks (no code execution)

### Backend APIs
- REST APIs for auth, levels, and admin reporting
- JWT token auth middleware

---

## 2) Project Folder Structure

```txt
Quiz-Game/
├─ backend/
│  ├─ data/
│  │  ├─ users.json
│  │  └─ levels.json
│  ├─ middleware/
│  │  └─ authMiddleware.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ levelRoutes.js
│  │  └─ adminRoutes.js
│  ├─ utils.js
│  ├─ server.js
│  └─ package.json
├─ frontend/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  ├─ auth.js
│  │  ├─ student.js
│  │  └─ admin.js
│  ├─ index.html
│  ├─ student.html
│  └─ admin.html
└─ README.md
```

---

## 3) JSON Database Schema

### `backend/data/users.json`

```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@quizgame.edu",
    "password": "<bcrypt_hash>",
    "role": "admin",
    "progress": {
      "completedLevels": [],
      "scores": {},
      "totalScore": 0
    }
  }
]
```

### `backend/data/levels.json`

```json
[
  {
    "id": 1,
    "title": "Level 1: First Print",
    "description": "Write Python code that prints exactly Hello, CodeHero!",
    "instruction": "Use print('Hello, CodeHero!')",
    "requiredPattern": "print\\s*\\(\\s*['\"`]Hello, CodeHero!['\"`]\\s*\\)",
    "score": 50
  }
]
```

---

## 4) Setup and Run Instructions

1. Open terminal and go to project folder:
   ```bash
   cd Quiz-Game
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Start server:
   ```bash
   npm start
   ```

4. Open browser:
   - `http://localhost:4000`

### Default Admin Credentials
- Email: `admin@quizgame.edu`
- Password: `Admin@123`

---

## 5) API Endpoints (REST)

### Auth
- `POST /api/auth/register` → register student
- `POST /api/auth/login` → login student/admin
- `GET /api/auth/me` → current user profile

### Student Levels
- `GET /api/levels` → list levels
- `POST /api/levels/submit/:levelId` → submit code for validation

### Admin
- `GET /api/admin/students` → list student progress
- `GET /api/admin/overview` → summary metrics

---

## 6) Stepwise Algorithms (Academic-Friendly)

### A) Authentication Algorithm
1. User enters email/password (+ role for login).
2. Server reads `users.json`.
3. For registration: check duplicate email, hash password with bcrypt, store user.
4. For login: find matching email + role.
5. Compare entered password with hashed password using bcrypt compare.
6. If valid, generate JWT token and return it.
7. Protected routes verify JWT before allowing access.

### B) Code Validation Algorithm (Safe, No Execution)
1. Student chooses level and submits code text.
2. Server loads level rules from `levels.json`.
3. Server normalizes text (remove extra spaces).
4. Server checks required keywords.
5. Server checks regex pattern for level target logic.
6. If all checks pass → PASS and add score/progress.
7. Else → FAIL with helpful feedback.

### C) Level Progression Algorithm
1. Start with `completedLevels = []` and `totalScore = 0`.
2. On successful level submission:
   - Add level id to `completedLevels` if not already present.
   - Save level score in `scores[levelId]`.
3. Recalculate `totalScore` as sum of all saved level scores.
4. Save updated user progress back to `users.json`.
5. Student dashboard displays latest progress.

---

## 7) Notes for Second-Year Students

- This project demonstrates full-stack basics without complex databases.
- JSON file storage is easy to understand but not ideal for high-scale production.
- Pattern matching is used instead of running code for safety.
- Next improvements can include:
  - More levels
  - Better editor UI
  - Leaderboard
  - Docker deployment
  - Stronger validation rules

