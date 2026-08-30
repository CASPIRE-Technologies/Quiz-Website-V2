# EduQuiz Pro - Full-Stack React + Node.js/Express + MySQL Platform

EduQuiz Pro is a premium commercial-grade online examination and quiz platform for students across Grade 5 Scholarship, G.C.E. O/L, and G.C.E. A/L streams.

---

## 📁 Full-Stack Project Structure

```
quiz-platform/
├── frontend/                     # React 18 + Vite Single Page Application
│   ├── public/
│   ├── src/
│   │   ├── components/           # TopHeader, DesktopSidebar, MobileBottomNav
│   │   ├── context/              # AuthContext.jsx
│   │   ├── pages/                # Auth, Dashboard, Exams, Quizzes, QuizDetails, Checkout,
│   │   │                         # MyQuizzes, Instructions, QuizTaking, Result, AnswerReview,
│   │   │                         # Profile, ResultsHistory, AdminDashboard, AdminQuizWizard
│   │   ├── services/             # api.js (REST API client connected to Express on port 5001)
│   │   ├── index.css             # Design Tokens & Responsive Utilities
│   │   ├── App.jsx               # React Router DOM Configuration
│   │   └── main.jsx              # React Entrypoint
│   ├── index.html                # Vite HTML Root
│   ├── vite.config.js            # Vite Config
│   └── package.json
│
└── backend/                      # Node.js + Express REST API Server & MySQL DB
    ├── config/db.js              # MySQL Pool Connection (`mysql2/promise`)
    ├── controllers/              # Auth, Quiz, Attempt, Payment, Admin controllers
    ├── routes/                   # REST API Router endpoints
    ├── schema.sql                # MySQL Database Relational Tables Schema
    ├── seed.sql                  # Seed Data SQL script
    ├── server.js                 # Express REST API Server (Port 5001)
    └── package.json
```

---

## ⚡ Quick Start Instructions

### 1. MySQL Database Setup
Import the database schema and seed data into MySQL:
```bash
mysql -u root -p < backend/schema.sql
mysql -u root -p < backend/seed.sql
```

### 2. Start Express Backend API Server
```bash
cd backend
npm install
npm run dev
# Express API server running on http://localhost:5001/api
```

### 3. Start React Frontend Application
```bash
cd frontend
npm install
npm run dev
# Vite React app running on http://localhost:5173
```
