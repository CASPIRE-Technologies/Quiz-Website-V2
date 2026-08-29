/* ==========================================================================
   MAIN APPLICATION LOGIC & ROUTER
   Paid Quiz & Examination Platform
   ========================================================================== */

import { examLevels, alStreams, subjects, quizzes as seedQuizzes, initialStudentProfile, initialAdminStats } from './data/mockData.js';

// --- Global Application State ---
const state = {
  currentUser: initialStudentProfile, // Authenticated user
  adminStats: initialAdminStats,
  quizzes: JSON.parse(localStorage.getItem('eduquiz_quizzes')) || seedQuizzes,
  userPurchases: JSON.parse(localStorage.getItem('eduquiz_purchases')) || ["quiz-math-01", "quiz-g5-01"],
  userAttempts: JSON.parse(localStorage.getItem('eduquiz_attempts')) || {
    "quiz-g5-01": { score: 22, total: 25, percentage: 88, timeTaken: "21:40", answers: { 1: 1 }, date: "2026-08-22" }
  },
  currentView: 'dashboard',
  viewParams: {},
  // Active Quiz State
  activeAttempt: null, // { quizId, answers: {}, marked: {}, currentQ: 0, timeRemaining: 2700, timerId: null, autosave: 'Saved ✓', isOffline: false },
  // Quiz Wizard State for Admin
  wizard: {
    step: 1,
    title: '',
    examLevel: 'ol',
    streamId: '',
    subjectId: 'math',
    subjectName: 'Mathematics',
    description: '',
    difficulty: 'Medium',
    duration: 45,
    price: 300,
    attempts: 1,
    passingScore: 70,
    randomizeQuestions: true,
    questions: [
      { id: 1, text: "Sample Question 1 text...", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 0, explanation: "Detailed solution explanation..." }
    ]
  }
};

// --- SVG Icons Helper Utility ---
function getIcon(name, size = 20, className = '') {
  const icons = {
    home: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    book: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
    award: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    user: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    search: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    bell: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    logout: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
    check: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    clock: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chevronRight: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    arrowLeft: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    lock: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    play: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    alert: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    shield: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    card: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    admin: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    plus: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    trash: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    edit: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    flag: `<svg width="${size}" height="${size}" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`
  };
  return icons[name] || '';
}

// --- Toast Notification System ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Modal System ---
function showModal({ title, bodyHTML, primaryText, secondaryText, onPrimary, onSecondary }) {
  const overlay = document.getElementById('modal-overlay');
  const card = document.getElementById('modal-card');
  if (!overlay || !card) return;

  card.innerHTML = `
    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--color-text-main);">${title}</h3>
    <div style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px;">${bodyHTML}</div>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      ${secondaryText ? `<button id="modal-sec-btn" class="btn btn-outline">${secondaryText}</button>` : ''}
      ${primaryText ? `<button id="modal-pri-btn" class="btn btn-primary">${primaryText}</button>` : ''}
    </div>
  `;

  overlay.classList.add('open');

  if (secondaryText) {
    document.getElementById('modal-sec-btn')?.addEventListener('click', () => {
      closeModal();
      if (onSecondary) onSecondary();
    });
  }

  if (primaryText) {
    document.getElementById('modal-pri-btn')?.addEventListener('click', () => {
      closeModal();
      if (onPrimary) onPrimary();
    });
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

// --- Bottom Sheet Modal for Mobile ---
function showBottomSheet({ title, bodyHTML }) {
  const overlay = document.getElementById('bottom-sheet-overlay');
  const sheet = document.getElementById('bottom-sheet');
  if (!overlay || !sheet) return;

  sheet.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 700;">${title}</h3>
      <button id="sheet-close-btn" class="icon-btn" style="width:32px; height:32px;">✕</button>
    </div>
    <div>${bodyHTML}</div>
  `;

  overlay.classList.add('open');
  sheet.classList.add('open');

  const close = () => {
    overlay.classList.remove('open');
    sheet.classList.remove('open');
  };

  overlay.onclick = close;
  document.getElementById('sheet-close-btn')?.addEventListener('click', close);
}

// --- Router & Navigation Controller ---
function navigateTo(viewName, params = {}) {
  // If leaving quiz attempt, prompt confirmation
  if (state.currentView === 'quiz-taking' && viewName !== 'quiz-taking' && state.activeAttempt) {
    if (!confirm("Your quiz progress is running. Are you sure you want to exit?")) {
      return;
    } else {
      if (state.activeAttempt.timerId) clearInterval(state.activeAttempt.timerId);
      state.activeAttempt = null;
    }
  }

  state.currentView = viewName;
  state.viewParams = params;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// --- Main App Render Dispatcher ---
function renderApp() {
  const appEl = document.getElementById('app');
  const sidebarEl = document.getElementById('desktop-sidebar');
  const headerEl = document.getElementById('top-header');
  const stageEl = document.getElementById('page-stage');
  const mobileNavEl = document.getElementById('mobile-bottom-nav');

  // Hide headers/navs on quiz-taking or login view for full focus
  const isQuizTaking = state.currentView === 'quiz-taking';
  const isAuthView = state.currentView === 'login';

  if (sidebarEl) sidebarEl.style.display = (isQuizTaking || isAuthView) ? 'none' : '';
  if (headerEl) headerEl.style.display = (isQuizTaking || isAuthView) ? 'none' : 'flex';
  if (mobileNavEl) mobileNavEl.style.display = (isQuizTaking || isAuthView) ? 'none' : 'flex';

  if (!isQuizTaking && !isAuthView) {
    renderDesktopSidebar();
    renderTopHeader();
    renderMobileBottomNav();
  }

  // Render Page Stage
  switch (state.currentView) {
    case 'login':
      renderAuthView(stageEl);
      break;
    case 'dashboard':
      renderDashboardView(stageEl);
      break;
    case 'exams':
      renderExamsView(stageEl, state.viewParams.levelId);
      break;
    case 'quizzes':
      renderQuizListView(stageEl, state.viewParams);
      break;
    case 'quiz-details':
      renderQuizDetailsView(stageEl, state.viewParams.quizId);
      break;
    case 'checkout':
      renderCheckoutView(stageEl, state.viewParams.quizId);
      break;
    case 'my-quizzes':
      renderMyQuizzesView(stageEl);
      break;
    case 'instructions':
      renderInstructionsView(stageEl, state.viewParams.quizId);
      break;
    case 'quiz-taking':
      renderQuizTakingView(stageEl, state.viewParams.quizId);
      break;
    case 'result':
      renderResultView(stageEl, state.viewParams);
      break;
    case 'answer-review':
      renderAnswerReviewView(stageEl, state.viewParams);
      break;
    case 'profile':
      renderProfileView(stageEl);
      break;
    case 'results-history':
      renderResultsHistoryView(stageEl);
      break;
    case 'admin-dashboard':
      renderAdminDashboardView(stageEl);
      break;
    case 'admin-quiz-wizard':
      renderAdminQuizWizardView(stageEl);
      break;
    default:
      renderDashboardView(stageEl);
  }
}

// --- Navigation Renderers ---
function renderDesktopSidebar() {
  const el = document.getElementById('desktop-sidebar');
  if (!el) return;

  const current = state.currentView;
  el.innerHTML = `
    <div class="sidebar-header">
      <div class="logo-badge">EQ</div>
      <div>
        <div class="logo-title">EduQuiz Pro</div>
        <div class="logo-subtitle">Paid Examination Platform</div>
      </div>
    </div>
    
    <div class="sidebar-nav">
      <div class="nav-label">Main Menu</div>
      <a class="nav-item ${current === 'dashboard' ? 'active' : ''}" data-route="dashboard">
        ${getIcon('home', 18)} <span>Dashboard</span>
      </a>
      <a class="nav-item ${current === 'quizzes' ? 'active' : ''}" data-route="quizzes">
        ${getIcon('search', 18)} <span>Browse Quizzes</span>
      </a>
      <a class="nav-item ${current === 'my-quizzes' ? 'active' : ''}" data-route="my-quizzes">
        ${getIcon('book', 18)} <span>My Quizzes</span>
      </a>
      <a class="nav-item ${current === 'results-history' ? 'active' : ''}" data-route="results-history">
        ${getIcon('award', 18)} <span>Results & Performance</span>
      </a>
      <a class="nav-item ${current === 'profile' ? 'active' : ''}" data-route="profile">
        ${getIcon('user', 18)} <span>Student Profile</span>
      </a>

      <div class="nav-label" style="margin-top: 16px;">Management</div>
      <a class="nav-item ${current.startsWith('admin') ? 'active' : ''}" data-route="admin-dashboard">
        ${getIcon('admin', 18)} <span>Admin Portal</span>
      </a>
    </div>

    <div class="sidebar-footer">
      <a class="nav-item" id="logout-btn" style="color: var(--color-error);">
        ${getIcon('logout', 18)} <span>Logout</span>
      </a>
    </div>
  `;

  el.querySelectorAll('[data-route]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.route);
    });
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    state.currentUser = null;
    showToast('Logged out successfully', 'info');
    navigateTo('login');
  });
}

function renderTopHeader() {
  const el = document.getElementById('top-header');
  if (!el) return;

  const user = state.currentUser || { name: "Guest Student" };

  el.innerHTML = `
    <div class="header-left">
      <div class="mobile-logo-wrap" style="cursor: pointer;" id="mobile-home-logo">
        <div class="logo-badge" style="width:32px; height:32px; font-size:16px;">EQ</div>
        <span style="font-weight:700; font-size:16px; color: var(--color-text-main);">EduQuiz Pro</span>
      </div>

      <div class="header-search">
        ${getIcon('search', 16, 'text-muted')}
        <input type="text" id="global-search-input" placeholder="Search quizzes, subjects or exams...">
      </div>
    </div>

    <div class="header-right">
      <button class="icon-btn" title="Notifications" id="notif-btn">
        ${getIcon('bell', 20)}
        <span class="badge-dot"></span>
      </button>

      <div class="user-profile-chip" id="profile-chip-btn">
        <div class="avatar">${user.name ? user.name.charAt(0) : 'G'}</div>
        <span class="user-name">${user.name || 'Guest'}</span>
      </div>
    </div>
  `;

  document.getElementById('mobile-home-logo')?.addEventListener('click', () => navigateTo('dashboard'));
  document.getElementById('profile-chip-btn')?.addEventListener('click', () => navigateTo('profile'));
  document.getElementById('notif-btn')?.addEventListener('click', () => showToast('You have 2 new quiz recommendations!', 'info'));

  const searchInput = document.getElementById('global-search-input');
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      navigateTo('quizzes', { query: searchInput.value.trim() });
    }
  });
}

function renderMobileBottomNav() {
  const el = document.getElementById('mobile-bottom-nav');
  if (!el) return;

  const current = state.currentView;
  el.innerHTML = `
    <a class="mobile-nav-item ${current === 'dashboard' ? 'active' : ''}" data-route="dashboard">
      ${getIcon('home', 20)} <span>Home</span>
    </a>
    <a class="mobile-nav-item ${current === 'my-quizzes' ? 'active' : ''}" data-route="my-quizzes">
      ${getIcon('book', 20)} <span>My Quizzes</span>
    </a>
    <a class="mobile-nav-item ${current === 'results-history' ? 'active' : ''}" data-route="results-history">
      ${getIcon('award', 20)} <span>Results</span>
    </a>
    <a class="mobile-nav-item ${current === 'profile' ? 'active' : ''}" data-route="profile">
      ${getIcon('user', 20)} <span>Profile</span>
    </a>
  `;

  el.querySelectorAll('[data-route]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.route);
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 1: AUTHENTICATION (SPLIT-SCREEN DESKTOP / CENTERED MOBILE)
// --------------------------------------------------------------------------
function renderAuthView(stageEl) {
  stageEl.innerHTML = `
    <div class="auth-container" style="margin:-24px; min-height:100vh;">
      <!-- Desktop Left Hero Banner -->
      <div class="auth-hero-side">
        <div class="auth-hero-bg-pattern"></div>
        <div class="mobile-logo-wrap" style="color: white; gap: 12px;">
          <div class="logo-badge" style="background: white; color: var(--color-primary);">EQ</div>
          <span style="font-size: 22px; font-weight: 800; color: white;">EduQuiz Pro</span>
        </div>
        <div class="auth-hero-content">
          <h1 class="auth-hero-title">Learn. Practice.<br>Succeed.</h1>
          <p class="auth-hero-desc">Prepare smarter for Sri Lankan Grade 5, O/L, and A/L examinations with timed quizzes, instant results, and detailed step-by-step explanations.</p>
        </div>
        <div style="font-size: 13px; opacity: 0.8; position:relative; z-index:10;">
          © 2026 EduQuiz Pro Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Auth Card -->
      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo-badge" style="margin: 0 auto 16px auto; width: 48px; height: 48px; font-size: 24px;">EQ</div>
            <h2 class="auth-title">Welcome Back</h2>
            <p class="auth-subtitle">Enter your details to access your account</p>
          </div>

          <div class="social-login-grid">
            <button class="btn-social" id="demo-google-login">
              <span>Google</span>
            </button>
            <button class="btn-social" id="demo-fb-login">
              <span>Facebook</span>
            </button>
          </div>

          <div class="divider">or sign in with email</div>

          <form id="auth-form">
            <div class="form-group">
              <label class="form-label">Email or Phone Number</label>
              <input type="text" class="form-input" placeholder="e.g. kasun@student.lk" value="kasun.perera@student.lk" required>
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label">Password</label>
                <a style="font-size:12px; color: var(--color-primary); font-weight:600; cursor:pointer;" id="forgot-pass-btn">Forgot Password?</a>
              </div>
              <input type="password" class="form-input" value="password123" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 12px;">Sign In</button>
          </form>

          <div style="text-align: center; margin-top: 24px; font-size: 14px; color: var(--color-text-muted);">
            Don't have an account? <a style="color: var(--color-primary); font-weight:700; cursor:pointer;" id="toggle-auth-btn">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('auth-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.currentUser = initialStudentProfile;
    showToast('Signed in successfully! Welcome back Kasun.', 'success');
    navigateTo('dashboard');
  });

  document.getElementById('demo-google-login')?.addEventListener('click', () => {
    state.currentUser = initialStudentProfile;
    showToast('Signed in via Google account!', 'success');
    navigateTo('dashboard');
  });

  document.getElementById('toggle-auth-btn')?.addEventListener('click', () => {
    showToast('Registration is open! Fill out the form to proceed.', 'info');
  });
}

// --------------------------------------------------------------------------
// VIEW 2: STUDENT DASHBOARD
// --------------------------------------------------------------------------
function renderDashboardView(stageEl) {
  const user = state.currentUser || { name: "Kasun" };

  stageEl.innerHTML = `
    <div class="dashboard-welcome">
      <h1 class="welcome-title">Welcome back, ${user.name} 👋</h1>
      <p class="welcome-subtitle">What are you preparing for today?</p>
    </div>

    <!-- Exam Levels Horizontal Grid (Desktop) / Stacked (Mobile) -->
    <div class="exam-levels-grid">
      ${examLevels.map(exam => `
        <div class="exam-card" data-exam="${exam.id}">
          <div>
            <div class="exam-icon-wrap ${exam.iconClass}">
              <span style="font-size:22px;">${exam.id === 'g5' ? '🎒' : exam.id === 'ol' ? '📘' : '🎓'}</span>
            </div>
            <div class="badge badge-primary" style="margin-bottom:10px;">${exam.badge}</div>
            <h3 class="exam-title">${exam.title}</h3>
            <p class="exam-desc">${exam.description}</p>
          </div>
          <div class="exam-arrow">
            <span>Choose Subject</span>
            ${getIcon('chevronRight', 16)}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Dashboard Widget Layout -->
    <div class="dashboard-grid">
      <div>
        <!-- Continue Learning / In Progress -->
        <div class="section-header">
          <h2 class="section-title">Continue Learning</h2>
          <a class="section-link" id="view-all-my-quizzes">View All My Quizzes</a>
        </div>
        
        <div class="card" style="margin-bottom: 28px; background: linear-gradient(135deg, #EFF6FF, #F5F3FF); border-color: var(--color-primary-border);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <span class="badge badge-warning">In Progress</span>
            <span style="font-size:13px; font-weight:600; color:var(--color-primary);">45 Mins</span>
          </div>
          <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">Algebra & Quadratic Equations Paper 01</h3>
          <p style="font-size:13px; color:var(--color-text-muted); margin-bottom:16px;">G.C.E. O/L • Mathematics • 30 Questions</p>
          <div style="display:flex; align-items:center; gap:12px;">
            <button class="btn btn-primary btn-sm" id="continue-active-quiz-btn">
              ${getIcon('play', 14)} Continue Quiz
            </button>
          </div>
        </div>

        <!-- Recommended Quizzes -->
        <div class="section-header">
          <h2 class="section-title">Recommended Quizzes</h2>
          <a class="section-link" id="browse-all-quizzes-link">Browse All</a>
        </div>

        <div class="quizzes-grid" style="grid-template-columns: repeat(2, 1fr);">
          ${state.quizzes.slice(0, 2).map(quiz => `
            <div class="quiz-card">
              <div>
                <div class="quiz-card-header">
                  <span class="badge badge-primary">${quiz.examLevel.toUpperCase()}</span>
                  <span class="badge badge-neutral">${quiz.difficulty}</span>
                </div>
                <h4 class="quiz-card-title">${quiz.title}</h4>
                <div class="quiz-stats-row">
                  <span class="quiz-stat">${getIcon('fileText', 14)} ${quiz.questionCount} Questions</span>
                  <span class="quiz-stat">${getIcon('clock', 14)} ${quiz.durationMinutes} Mins</span>
                </div>
              </div>
              <div class="quiz-card-footer">
                <span class="quiz-price">LKR ${quiz.price}</span>
                <button class="btn btn-outline btn-sm open-quiz-details" data-id="${quiz.id}">Details</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Performance Summary Sidebar -->
      <div>
        <div class="section-header">
          <h2 class="section-title">Performance Summary</h2>
        </div>

        <div class="card">
          <div style="text-align:center; padding:12px 0; border-bottom:1px solid var(--color-border); margin-bottom:16px;">
            <div style="font-size:36px; font-weight:900; color:var(--color-primary); line-height:1;">88%</div>
            <div style="font-size:12px; color:var(--color-text-muted); font-weight:600; margin-top:4px;">Average Accuracy Score</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; justify-content:space-between; font-size:14px;">
              <span style="color:var(--color-text-muted);">Quizzes Purchased:</span>
              <span style="font-weight:700;">${state.userPurchases.length}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px;">
              <span style="color:var(--color-text-muted);">Quizzes Completed:</span>
              <span style="font-weight:700;">${Object.keys(state.userAttempts).length}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px;">
              <span style="color:var(--color-text-muted);">Study Time:</span>
              <span style="font-weight:700;">${user.studyHours} Hours</span>
            </div>
          </div>

          <button class="btn btn-secondary btn-block" style="margin-top:20px;" id="view-full-perf-btn">
            View Performance History
          </button>
        </div>
      </div>
    </div>
  `;

  // Bind Exam level clicks
  stageEl.querySelectorAll('.exam-card').forEach(card => {
    card.addEventListener('click', () => {
      const examId = card.dataset.exam;
      navigateTo('exams', { levelId: examId });
    });
  });

  document.getElementById('continue-active-quiz-btn')?.addEventListener('click', () => {
    navigateTo('instructions', { quizId: 'quiz-math-01' });
  });

  document.getElementById('view-all-my-quizzes')?.addEventListener('click', () => navigateTo('my-quizzes'));
  document.getElementById('browse-all-quizzes-link')?.addEventListener('click', () => navigateTo('quizzes'));
  document.getElementById('view-full-perf-btn')?.addEventListener('click', () => navigateTo('results-history'));

  stageEl.querySelectorAll('.open-quiz-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('quiz-details', { quizId: btn.dataset.id });
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 3: EXAM LEVEL & SUBJECT / STREAM SELECTION
// --------------------------------------------------------------------------
function renderExamsView(stageEl, levelId = 'ol') {
  const exam = examLevels.find(e => e.id === levelId) || examLevels[1];

  // If A/L is selected, user must choose stream first or view streams
  if (exam.hasStreams && !state.viewParams.streamId) {
    stageEl.innerHTML = `
      <div class="breadcrumbs">
        <span class="breadcrumb-item" id="crumb-home">Home</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item active">${exam.title}</span>
      </div>

      <div style="margin-bottom:28px;">
        <h1 class="welcome-title">Choose Your Stream</h1>
        <p class="welcome-subtitle">Select your Advanced Level study stream to view relevant subjects</p>
      </div>

      <div class="streams-grid">
        ${alStreams.map(stream => `
          <div class="stream-card" data-stream="${stream.id}">
            <div style="font-size:36px; margin-bottom:12px;">${stream.icon}</div>
            <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">${stream.title}</h3>
            <p style="font-size:13px; color:var(--color-text-muted); margin-bottom:16px;">
              ${stream.subjects.length} Compulsory & Elective Subjects
            </p>
            <div style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--color-secondary);">
              Explore Stream ${getIcon('chevronRight', 16)}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('crumb-home')?.addEventListener('click', () => navigateTo('dashboard'));

    stageEl.querySelectorAll('.stream-card').forEach(card => {
      card.addEventListener('click', () => {
        navigateTo('exams', { levelId: 'al', streamId: card.dataset.stream });
      });
    });
    return;
  }

  // Render Subject List for the Level/Stream
  let filteredSubjects = subjects.filter(s => s.examLevel === levelId);
  let streamTitle = "";
  if (state.viewParams.streamId) {
    const st = alStreams.find(s => s.id === state.viewParams.streamId);
    if (st) {
      streamTitle = st.title;
      filteredSubjects = subjects.filter(s => s.examLevel === 'al' && st.subjects.includes(s.id));
    }
  }

  stageEl.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item" id="crumb-home">Home</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item" id="crumb-level">${exam.shortTitle}</span>
      ${streamTitle ? `<span class="breadcrumb-sep">/</span><span class="breadcrumb-item active">${streamTitle}</span>` : ''}
    </div>

    <div style="margin-bottom:28px;">
      <h1 class="welcome-title">Choose a Subject</h1>
      <p class="welcome-subtitle">Select a subject to browse model papers, past papers & topic quizzes</p>
    </div>

    <div class="subjects-grid">
      ${filteredSubjects.map(sub => `
        <div class="subject-card" data-subject="${sub.id}">
          <div class="subject-icon" style="background-color: ${sub.color}; color: ${sub.iconColor}; font-size: 22px;">
            ${sub.icon}
          </div>
          <div>
            <div class="subject-name">${sub.name}</div>
            <div style="font-size:12px; color:var(--color-text-muted);">Available Quizzes</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('crumb-home')?.addEventListener('click', () => navigateTo('dashboard'));
  document.getElementById('crumb-level')?.addEventListener('click', () => navigateTo('exams', { levelId }));

  stageEl.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo('quizzes', { subjectId: card.dataset.subject, levelId });
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 4: QUIZ CATALOG / LIST PAGE
// --------------------------------------------------------------------------
function renderQuizListView(stageEl, params = {}) {
  let list = [...state.quizzes];

  if (params.subjectId) {
    list = list.filter(q => q.subjectId === params.subjectId);
  }
  if (params.query) {
    const q = params.query.toLowerCase();
    list = list.filter(item => item.title.toLowerCase().includes(q) || item.subjectName.toLowerCase().includes(q));
  }

  stageEl.innerHTML = `
    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Browse Quizzes</h1>
      <p class="welcome-subtitle">Explore paid timed practice papers and full mock examinations</p>
    </div>

    <div class="filter-bar">
      <div class="filter-chips">
        <button class="chip active">All Quizzes</button>
        <button class="chip">Purchased</button>
        <button class="chip">Not Purchased</button>
        <button class="chip">Completed</button>
      </div>

      <div style="display:flex; gap:10px; width: 100%; max-width: 320px;">
        <input type="text" id="quiz-list-search" class="form-input" placeholder="Filter by quiz title..." value="${params.query || ''}">
      </div>
    </div>

    ${list.length === 0 ? `
      <div class="card" style="text-align:center; padding:48px 24px;">
        <div style="font-size:40px; margin-bottom:12px;">🔍</div>
        <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">No quizzes found</h3>
        <p style="font-size:14px; color:var(--color-text-muted); margin-bottom:20px;">Try clearing search filters or browse other subjects.</p>
        <button class="btn btn-primary" id="reset-filter-btn">Reset Filters</button>
      </div>
    ` : `
      <div class="quizzes-grid">
        ${list.map(quiz => {
          const isPurchased = state.userPurchases.includes(quiz.id);
          const isCompleted = state.userAttempts[quiz.id] !== undefined;

          let btnHtml = `<button class="btn btn-primary btn-sm open-quiz-details" data-id="${quiz.id}">Buy Quiz – LKR ${quiz.price}</button>`;
          if (isCompleted) {
            btnHtml = `<button class="btn btn-secondary btn-sm open-quiz-details" data-id="${quiz.id}">View Results</button>`;
          } else if (isPurchased) {
            btnHtml = `<button class="btn btn-success btn-sm open-quiz-details" style="background:var(--color-success); color:white;" data-id="${quiz.id}">Start Quiz</button>`;
          }

          return `
            <div class="quiz-card">
              <div>
                <div class="quiz-card-header">
                  <span class="badge badge-primary">${quiz.examLevel.toUpperCase()}</span>
                  <span class="badge badge-warning">${quiz.difficulty}</span>
                </div>
                <h4 class="quiz-card-title">${quiz.title}</h4>
                <p style="font-size:12px; color:var(--color-text-muted); margin-top:4px;">${quiz.subjectName}</p>

                <div class="quiz-stats-row">
                  <span class="quiz-stat">${getIcon('fileText', 14)} ${quiz.questionCount} Questions</span>
                  <span class="quiz-stat">${getIcon('clock', 14)} ${quiz.durationMinutes} Mins</span>
                </div>
              </div>

              <div class="quiz-card-footer">
                <span class="quiz-price">LKR ${quiz.price}</span>
                ${btnHtml}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  document.getElementById('reset-filter-btn')?.addEventListener('click', () => navigateTo('quizzes'));

  stageEl.querySelectorAll('.open-quiz-details').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('quiz-details', { quizId: btn.dataset.id });
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 5: QUIZ DETAILS PAGE (2-COLUMN DESKTOP / STICKY MOBILE)
// --------------------------------------------------------------------------
function renderQuizDetailsView(stageEl, quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];
  const isPurchased = state.userPurchases.includes(quiz.id);
  const isCompleted = state.userAttempts[quiz.id] !== undefined;

  stageEl.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item" id="crumb-browse">Browse Quizzes</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">${quiz.title}</span>
    </div>

    <div class="quiz-details-layout">
      <!-- Left Column: Details & Rules -->
      <div>
        <div class="card" style="margin-bottom:24px;">
          <div style="display:flex; gap:10px; align-items:center; margin-bottom:12px;">
            <span class="badge badge-primary">${quiz.examLevel.toUpperCase()}</span>
            <span class="badge badge-neutral">${quiz.subjectName}</span>
            <span class="badge badge-warning">${quiz.difficulty}</span>
          </div>
          <h1 style="font-size:26px; font-weight:800; margin-bottom:12px; color:var(--color-text-main);">${quiz.title}</h1>
          <p style="font-size:15px; color:var(--color-text-muted); line-height:1.6;">${quiz.about}</p>
        </div>

        <!-- Topics Covered -->
        <div class="card" style="margin-bottom:24px;">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:12px;">Topics Covered</h3>
          <div class="topics-tags">
            ${quiz.topics ? quiz.topics.map(t => `<span class="topic-tag">${t}</span>`).join('') : '<span class="topic-tag">General Exam Units</span>'}
          </div>
        </div>

        <!-- Exam Instructions & Rules -->
        <div class="card">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:12px;">Exam Rules & Instructions</h3>
          <ul class="rules-list">
            <li>${getIcon('check', 16)} Timer cannot be paused after starting the attempt.</li>
            <li>${getIcon('check', 16)} Your selected answers automatically save instantly.</li>
            <li>${getIcon('check', 16)} The quiz automatically submits when time expires.</li>
            <li>${getIcon('check', 16)} Only ${quiz.attemptsAllowed} attempt allowed per purchase.</li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Purchase Summary Card (Desktop) -->
      <div>
        <div class="card sticky-buy-card">
          <div style="text-align:center; padding-bottom:16px; border-bottom:1px solid var(--color-border); margin-bottom:16px;">
            <div style="font-size:12px; color:var(--color-text-muted); font-weight:600; text-transform:uppercase;">Price</div>
            <div style="font-size:32px; font-weight:900; color:var(--color-primary);">LKR ${quiz.price}</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; font-size:14px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--color-text-muted);">Questions:</span>
              <span style="font-weight:700;">${quiz.questionCount} Questions</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--color-text-muted);">Duration:</span>
              <span style="font-weight:700;">${quiz.durationMinutes} Minutes</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--color-text-muted);">Attempts Allowed:</span>
              <span style="font-weight:700;">${quiz.attemptsAllowed} Attempt</span>
            </div>
          </div>

          ${isCompleted ? `
            <button class="btn btn-secondary btn-block btn-lg" id="view-result-cta-btn">View Quiz Results</button>
          ` : isPurchased ? `
            <button class="btn btn-primary btn-block btn-lg" id="start-quiz-cta-btn">Start Quiz Now</button>
          ` : `
            <button class="btn btn-primary btn-block btn-lg" id="buy-quiz-cta-btn">Buy Quiz – LKR ${quiz.price}</button>
          `}
        </div>
      </div>
    </div>

    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="mobile-sticky-action">
      <div>
        <div style="font-size:11px; color:var(--color-text-muted);">Total Price</div>
        <div style="font-size:20px; font-weight:800; color:var(--color-primary);">LKR ${quiz.price}</div>
      </div>
      ${isCompleted ? `
        <button class="btn btn-secondary btn-sm" id="mob-view-res-btn">Results</button>
      ` : isPurchased ? `
        <button class="btn btn-primary btn-sm" id="mob-start-btn">Start Quiz</button>
      ` : `
        <button class="btn btn-primary btn-sm" id="mob-buy-btn">Buy Now</button>
      `}
    </div>
  `;

  document.getElementById('crumb-browse')?.addEventListener('click', () => navigateTo('quizzes'));

  const handleBuy = () => navigateTo('checkout', { quizId: quiz.id });
  const handleStart = () => navigateTo('instructions', { quizId: quiz.id });
  const handleResults = () => navigateTo('result', { quizId: quiz.id });

  document.getElementById('buy-quiz-cta-btn')?.addEventListener('click', handleBuy);
  document.getElementById('mob-buy-btn')?.addEventListener('click', handleBuy);

  document.getElementById('start-quiz-cta-btn')?.addEventListener('click', handleStart);
  document.getElementById('mob-start-btn')?.addEventListener('click', handleStart);

  document.getElementById('view-result-cta-btn')?.addEventListener('click', handleResults);
  document.getElementById('mob-view-res-btn')?.addEventListener('click', handleResults);
}

// --------------------------------------------------------------------------
// VIEW 6: CHECKOUT & PAYMENT PAGE
// --------------------------------------------------------------------------
function renderCheckoutView(stageEl, quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];

  stageEl.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item" id="crumb-details">Quiz Details</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">Checkout</span>
    </div>

    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Payment Checkout</h1>
      <p class="welcome-subtitle">Complete payment to instantly unlock lifetime quiz access</p>
    </div>

    <div class="checkout-grid">
      <!-- Left Column: Payment Methods -->
      <div class="card">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Select Payment Gateway</h3>
        
        <div class="payment-options">
          <div class="payment-option-card selected" data-method="card">
            <div style="display:flex; align-items:center; gap:12px;">
              ${getIcon('card', 22, 'text-primary')}
              <div>
                <div style="font-weight:700; font-size:15px;">Credit / Debit Card</div>
                <div style="font-size:12px; color:var(--color-text-muted);">Visa, MasterCard, Amex</div>
              </div>
            </div>
            <div class="radio-circle"></div>
          </div>

          <div class="payment-option-card" data-method="payhere">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="font-weight:800; color:var(--color-secondary);">PayHere</div>
              <div>
                <div style="font-weight:700; font-size:15px;">PayHere Sri Lanka</div>
                <div style="font-size:12px; color:var(--color-text-muted);">Mobile Wallet & Internet Banking</div>
              </div>
            </div>
            <div class="radio-circle"></div>
          </div>

          <div class="payment-option-card" data-method="bank">
            <div style="display:flex; align-items:center; gap:12px;">
              ${getIcon('shield', 22, 'text-muted')}
              <div>
                <div style="font-weight:700; font-size:15px;">Direct Bank Transfer</div>
                <div style="font-size:12px; color:var(--color-text-muted);">BOC, Commercial Bank, Sampath</div>
              </div>
            </div>
            <div class="radio-circle"></div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:var(--color-success); margin-top:20px;">
          ${getIcon('shield', 16)} <span>256-Bit SSL Encrypted & Secure Payment Guarantee</span>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <div>
        <div class="card">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Order Summary</h3>
          <div style="padding-bottom:16px; border-bottom:1px solid var(--color-border); margin-bottom:16px;">
            <div style="font-weight:700; font-size:15px; margin-bottom:4px;">${quiz.title}</div>
            <div style="font-size:13px; color:var(--color-text-muted);">${quiz.subjectName} • ${quiz.questionCount} Qs</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:14px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; color:var(--color-text-muted);">
              <span>Subtotal:</span>
              <span>LKR ${quiz.price}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--color-success);">
              <span>Student Discount:</span>
              <span>LKR 0</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:18px; color:var(--color-text-main); padding-top:10px; border-top:1px dashed var(--color-border);">
              <span>Total Pay:</span>
              <span style="color:var(--color-primary);">LKR ${quiz.price}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" id="pay-now-btn">Pay LKR ${quiz.price}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('crumb-details')?.addEventListener('click', () => navigateTo('quiz-details', { quizId: quiz.id }));

  // Gateway Selector
  stageEl.querySelectorAll('.payment-option-card').forEach(card => {
    card.addEventListener('click', () => {
      stageEl.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Handle Mock Payment Success
  document.getElementById('pay-now-btn')?.addEventListener('click', () => {
    const payBtn = document.getElementById('pay-now-btn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerText = "Processing Payment...";
    }

    setTimeout(() => {
      // Add to purchased quizzes list
      if (!state.userPurchases.includes(quiz.id)) {
        state.userPurchases.push(quiz.id);
        localStorage.setItem('eduquiz_purchases', JSON.stringify(state.userPurchases));
      }

      showModal({
        title: "🎉 Payment Successful!",
        bodyHTML: `
          <div style="text-align:center; padding:16px 0;">
            <div style="font-size:48px; margin-bottom:12px;">✅</div>
            <p style="font-size:16px; font-weight:700; color:var(--color-text-main);">Quiz Unlocked</p>
            <p style="font-size:14px; color:var(--color-text-muted); margin-top:4px;">You have successfully enrolled in <strong>${quiz.title}</strong>.</p>
          </div>
        `,
        primaryText: "Start Quiz Now",
        secondaryText: "Go to My Quizzes",
        onPrimary: () => navigateTo('instructions', { quizId: quiz.id }),
        onSecondary: () => navigateTo('my-quizzes')
      });
    }, 1200);
  });
}

// --------------------------------------------------------------------------
// VIEW 7: MY QUIZZES PAGE
// --------------------------------------------------------------------------
function renderMyQuizzesView(stageEl) {
  const purchasedQuizzes = state.quizzes.filter(q => state.userPurchases.includes(q.id));

  stageEl.innerHTML = `
    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">My Enrolled Quizzes</h1>
      <p class="welcome-subtitle">Manage your purchased papers, continue active attempts, or review results</p>
    </div>

    <div class="filter-bar">
      <div class="filter-chips">
        <button class="chip active">All (${purchasedQuizzes.length})</button>
        <button class="chip">Available</button>
        <button class="chip">Completed</button>
      </div>
    </div>

    ${purchasedQuizzes.length === 0 ? `
      <div class="card" style="text-align:center; padding:48px 24px;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">No Enrolled Quizzes Yet</h3>
        <p style="font-size:14px; color:var(--color-text-muted); margin-bottom:20px;">Explore our catalog to enroll in model papers and timed exams.</p>
        <button class="btn btn-primary" id="browse-catalog-btn">Browse Quizzes</button>
      </div>
    ` : `
      <div class="quizzes-grid">
        ${purchasedQuizzes.map(quiz => {
          const isCompleted = state.userAttempts[quiz.id] !== undefined;

          return `
            <div class="quiz-card">
              <div>
                <div class="quiz-card-header">
                  <span class="badge ${isCompleted ? 'badge-success' : 'badge-primary'}">${isCompleted ? 'Completed' : 'Available'}</span>
                  <span class="badge badge-neutral">${quiz.subjectName}</span>
                </div>
                <h4 class="quiz-card-title">${quiz.title}</h4>
                <div class="quiz-stats-row">
                  <span class="quiz-stat">${getIcon('fileText', 14)} ${quiz.questionCount} Questions</span>
                  <span class="quiz-stat">${getIcon('clock', 14)} ${quiz.durationMinutes} Mins</span>
                </div>
              </div>

              <div class="quiz-card-footer">
                ${isCompleted ? `
                  <span style="font-size:14px; font-weight:700; color:var(--color-success);">Score: ${state.userAttempts[quiz.id].percentage}%</span>
                  <button class="btn btn-secondary btn-sm open-res-btn" data-id="${quiz.id}">View Result</button>
                ` : `
                  <span style="font-size:13px; color:var(--color-text-muted);">1 Attempt Left</span>
                  <button class="btn btn-primary btn-sm start-quiz-btn" data-id="${quiz.id}">Start Quiz</button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  document.getElementById('browse-catalog-btn')?.addEventListener('click', () => navigateTo('quizzes'));

  stageEl.querySelectorAll('.start-quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('instructions', { quizId: btn.dataset.id }));
  });

  stageEl.querySelectorAll('.open-res-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('result', { quizId: btn.dataset.id }));
  });
}

// --------------------------------------------------------------------------
// VIEW 8: PRE-QUIZ INSTRUCTION SCREEN & CHECKLIST
// --------------------------------------------------------------------------
function renderInstructionsView(stageEl, quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];

  stageEl.innerHTML = `
    <div style="max-width: 680px; margin: 0 auto;">
      <div class="card" style="margin-bottom: 24px;">
        <h1 style="font-size:24px; font-weight:800; margin-bottom:8px;">${quiz.title}</h1>
        <p style="font-size:14px; color:var(--color-text-muted);">${quiz.subjectName} • ${quiz.questionCount} Questions • ${quiz.durationMinutes} Minutes</p>
      </div>

      <!-- Warning Card -->
      <div class="card" style="background-color: var(--color-warning-light); border-color: #FCD34D; margin-bottom: 24px;">
        <div style="display:flex; gap:12px; align-items:flex-start;">
          ${getIcon('alert', 24, 'text-warning')}
          <div>
            <h4 style="font-size:15px; font-weight:700; color:#92400E; margin-bottom:4px;">Important Notice</h4>
            <p style="font-size:13px; color:#B45309; line-height:1.5;">
              Once you click "Start Quiz", the countdown timer begins immediately and cannot be paused or restarted. Please ensure you are ready before proceeding.
            </p>
          </div>
        </div>
      </div>

      <!-- Readiness Checklist -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Pre-Exam Readiness Checklist</h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:14px;">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" checked disabled> Stable high-speed internet connection verified
          </label>
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" checked disabled> Device has sufficient battery or connected to power
          </label>
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" checked disabled> Quiet exam environment without interruptions
          </label>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--color-border);">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:600; color:var(--color-text-main);">
            <input type="checkbox" id="understand-check"> I have read and agree to all exam instructions.
          </label>
        </div>
      </div>

      <div style="display:flex; gap:16px; justify-content:flex-end;">
        <button class="btn btn-outline" id="cancel-inst-btn">Cancel</button>
        <button class="btn btn-primary btn-lg" id="begin-quiz-btn" disabled>Start Quiz</button>
      </div>
    </div>
  `;

  document.getElementById('cancel-inst-btn')?.addEventListener('click', () => navigateTo('my-quizzes'));

  const check = document.getElementById('understand-check');
  const beginBtn = document.getElementById('begin-quiz-btn');

  check?.addEventListener('change', () => {
    if (beginBtn) beginBtn.disabled = !check.checked;
  });

  beginBtn?.addEventListener('click', () => {
    showModal({
      title: "Are you ready to begin?",
      bodyHTML: `The timer of <strong>${quiz.durationMinutes} minutes</strong> will start immediately.`,
      primaryText: "Yes, Start Quiz",
      secondaryText: "Cancel",
      onPrimary: () => navigateTo('quiz-taking', { quizId: quiz.id })
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 9: QUIZ TAKING ENGINE (DESKTOP 70/30 & MOBILE BOTTOM SHEET)
// --------------------------------------------------------------------------
function renderQuizTakingView(stageEl, quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];
  const questions = quiz.questions.length > 0 ? quiz.questions : [
    { id: 1, text: "Sample Question 1: What is the derivative of x²?", options: ["2x", "x", "x² / 2", "2"], correctIndex: 0, explanation: "Using power rule: d/dx(xⁿ) = n*x^(n-1)." }
  ];

  // Initialize or restore active attempt state
  if (!state.activeAttempt || state.activeAttempt.quizId !== quiz.id) {
    state.activeAttempt = {
      quizId: quiz.id,
      questions,
      currentIndex: 0,
      answers: {},
      marked: {},
      timeRemaining: quiz.durationMinutes * 60,
      autosave: 'Saved ✓',
      isOffline: false
    };

    // Start Live Timer
    if (state.activeAttempt.timerId) clearInterval(state.activeAttempt.timerId);
    state.activeAttempt.timerId = setInterval(() => {
      if (state.activeAttempt.timeRemaining > 0) {
        state.activeAttempt.timeRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(state.activeAttempt.timerId);
        showToast('Time expired! Automatically submitting quiz...', 'warning');
        submitQuizAttempt();
      }
    }, 1000);
  }

  const attempt = state.activeAttempt;
  const currentQ = questions[attempt.currentIndex];

  stageEl.innerHTML = `
    <!-- Top Quiz Header Bar -->
    <div class="quiz-header-bar" style="margin:-24px -24px 24px -24px;">
      <div>
        <div style="font-size:14px; font-weight:700; color:var(--color-text-main);">${quiz.title}</div>
        <div style="font-size:12px; color:var(--color-text-muted);" id="q-progress-text">Question ${attempt.currentIndex + 1} of ${questions.length}</div>
      </div>

      <div class="timer-box" id="timer-box-el">
        ${getIcon('clock', 18)} <span id="timer-text">--:--</span>
      </div>

      <div style="display:flex; align-items:center; gap:16px;">
        <span class="autosave-tag">${getIcon('check', 14)} <span id="autosave-text">${attempt.autosave}</span></span>
        <button class="btn btn-danger btn-sm" id="submit-quiz-top-btn">Submit Quiz</button>
      </div>
    </div>

    <!-- Quiz Stage Layout (70% Question / 30% Palette) -->
    <div class="quiz-stage-desktop" style="padding:0;">
      <!-- Left Question Card -->
      <div>
        <div class="question-card-main">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="question-number-badge">Question ${attempt.currentIndex + 1}</div>
            <button class="btn btn-outline btn-sm" id="mark-review-btn">
              ${getIcon('flag', 14)} ${attempt.marked[attempt.currentIndex] ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          <div class="question-text">${currentQ.text}</div>

          <!-- Options List -->
          <div class="options-list">
            ${currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = attempt.answers[attempt.currentIndex] === idx;
              return `
                <div class="option-card ${isSelected ? 'selected' : ''}" data-opt="${idx}">
                  <div class="option-key">${letter}</div>
                  <div>${opt}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Prev / Next Controls -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid var(--color-border);">
            <button class="btn btn-outline" id="prev-q-btn" ${attempt.currentIndex === 0 ? 'disabled' : ''}>
              ${getIcon('arrowLeft', 16)} Previous
            </button>
            <button class="btn btn-primary" id="next-q-btn">
              ${attempt.currentIndex === questions.length - 1 ? 'Finish' : 'Next'} ${getIcon('chevronRight', 16)}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Question Palette (Desktop Sticky) -->
      <div class="palette-sidebar">
        <h4 style="font-size:15px; font-weight:700; margin-bottom:12px;">Question Palette</h4>
        <div class="palette-grid">
          ${questions.map((q, idx) => {
            const isAns = attempt.answers[idx] !== undefined;
            const isMarked = attempt.marked[idx];
            const isCurr = attempt.currentIndex === idx;
            let cls = 'unanswered';
            if (isMarked) cls = 'marked';
            else if (isAns) cls = 'answered';
            if (isCurr) cls += ' current';

            return `<div class="palette-num ${cls}" data-qindex="${idx}">${idx + 1}</div>`;
          }).join('')}
        </div>

        <div class="palette-legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--color-success-light); border:1px solid var(--color-success);"></div> Answered</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--color-bg); border:1px solid var(--color-border);"></div> Unanswered</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--color-warning-light); border:1px solid var(--color-warning);"></div> Marked for Review</div>
        </div>
      </div>
    </div>

    <!-- Mobile Sticky Footer Controls -->
    <div class="mobile-quiz-footer">
      <button class="btn btn-outline btn-sm" id="mob-prev-btn" ${attempt.currentIndex === 0 ? 'disabled' : ''}>Prev</button>
      <button class="btn btn-secondary btn-sm" id="mob-palette-btn">Palette Grid</button>
      <button class="btn btn-primary btn-sm" id="mob-next-btn">${attempt.currentIndex === questions.length - 1 ? 'Submit' : 'Next'}</button>
    </div>
  `;

  updateTimerDisplay();

  // Option selection
  stageEl.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const optIdx = parseInt(card.dataset.opt);
      attempt.answers[attempt.currentIndex] = optIdx;

      // Show Autosave
      const textEl = document.getElementById('autosave-text');
      if (textEl) textEl.innerText = 'Saving...';

      setTimeout(() => {
        if (textEl) textEl.innerText = 'Saved ✓';
        renderQuizTakingView(stageEl, quizId);
      }, 200);
    });
  });

  // Mark for review toggle
  document.getElementById('mark-review-btn')?.addEventListener('click', () => {
    attempt.marked[attempt.currentIndex] = !attempt.marked[attempt.currentIndex];
    renderQuizTakingView(stageEl, quizId);
  });

  // Prev / Next bindings
  document.getElementById('prev-q-btn')?.addEventListener('click', () => {
    if (attempt.currentIndex > 0) {
      attempt.currentIndex--;
      renderQuizTakingView(stageEl, quizId);
    }
  });

  document.getElementById('mob-prev-btn')?.addEventListener('click', () => {
    if (attempt.currentIndex > 0) {
      attempt.currentIndex--;
      renderQuizTakingView(stageEl, quizId);
    }
  });

  document.getElementById('next-q-btn')?.addEventListener('click', () => {
    if (attempt.currentIndex < questions.length - 1) {
      attempt.currentIndex++;
      renderQuizTakingView(stageEl, quizId);
    } else {
      promptSubmitModal();
    }
  });

  document.getElementById('mob-next-btn')?.addEventListener('click', () => {
    if (attempt.currentIndex < questions.length - 1) {
      attempt.currentIndex++;
      renderQuizTakingView(stageEl, quizId);
    } else {
      promptSubmitModal();
    }
  });

  // Palette Jump
  stageEl.querySelectorAll('.palette-num').forEach(num => {
    num.addEventListener('click', () => {
      attempt.currentIndex = parseInt(num.dataset.qindex);
      renderQuizTakingView(stageEl, quizId);
    });
  });

  // Mobile Bottom Sheet Palette
  document.getElementById('mob-palette-btn')?.addEventListener('click', () => {
    showBottomSheet({
      title: "Question Palette Grid",
      bodyHTML: `
        <div class="palette-grid" style="grid-template-columns: repeat(5, 1fr);">
          ${questions.map((q, idx) => {
            const isAns = attempt.answers[idx] !== undefined;
            const isMarked = attempt.marked[idx];
            const isCurr = attempt.currentIndex === idx;
            let cls = 'unanswered';
            if (isMarked) cls = 'marked';
            else if (isAns) cls = 'answered';
            if (isCurr) cls += ' current';
            return `<div class="palette-num ${cls} mob-sheet-num" data-qindex="${idx}">${idx + 1}</div>`;
          }).join('')}
        </div>
      `
    });

    document.querySelectorAll('.mob-sheet-num').forEach(n => {
      n.addEventListener('click', () => {
        attempt.currentIndex = parseInt(n.dataset.qindex);
        document.getElementById('bottom-sheet-overlay')?.classList.remove('open');
        document.getElementById('bottom-sheet')?.classList.remove('open');
        renderQuizTakingView(stageEl, quizId);
      });
    });
  });

  // Submit Modal prompt
  document.getElementById('submit-quiz-top-btn')?.addEventListener('click', promptSubmitModal);

  function promptSubmitModal() {
    const answeredCount = Object.keys(attempt.answers).length;
    const unansweredCount = questions.length - answeredCount;
    const markedCount = Object.keys(attempt.marked).filter(k => attempt.marked[k]).length;

    showModal({
      title: "Are you sure you want to submit?",
      bodyHTML: `
        <div style="font-size:14px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--color-border);">
            <span>Answered Questions:</span><strong style="color:var(--color-success);">${answeredCount}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--color-border);">
            <span>Unanswered Questions:</span><strong style="color:var(--color-error);">${unansweredCount}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0;">
            <span>Marked for Review:</span><strong style="color:var(--color-warning);">${markedCount}</strong>
          </div>
        </div>
        ${unansweredCount > 0 ? `<p style="font-size:13px; color:var(--color-error); font-weight:600;">Warning: You have ${unansweredCount} unanswered questions.</p>` : ''}
      `,
      primaryText: "Yes, Submit Quiz",
      secondaryText: "Cancel",
      onPrimary: () => submitQuizAttempt()
    });
  }

  function submitQuizAttempt() {
    if (attempt.timerId) clearInterval(attempt.timerId);

    // Calculate Score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (attempt.answers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const resultObj = {
      score: correct,
      total: questions.length,
      percentage,
      timeTaken: formatTime(quiz.durationMinutes * 60 - attempt.timeRemaining),
      answers: attempt.answers,
      date: new Date().toISOString().split('T')[0]
    };

    state.userAttempts[quiz.id] = resultObj;
    localStorage.setItem('eduquiz_attempts', JSON.stringify(state.userAttempts));

    state.activeAttempt = null;
    navigateTo('result', { quizId: quiz.id });
  }
}

function updateTimerDisplay() {
  const attempt = state.activeAttempt;
  if (!attempt) return;

  const timerTextEl = document.getElementById('timer-text');
  const timerBoxEl = document.getElementById('timer-box-el');

  if (timerTextEl) timerTextEl.innerText = formatTime(attempt.timeRemaining);

  if (timerBoxEl) {
    timerBoxEl.className = 'timer-box';
    if (attempt.timeRemaining <= 60) timerBoxEl.classList.add('warning-1');
    else if (attempt.timeRemaining <= 300) timerBoxEl.classList.add('warning-5');
    else if (attempt.timeRemaining <= 600) timerBoxEl.classList.add('warning-10');
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --------------------------------------------------------------------------
// VIEW 10: RESULT PAGE (CIRCULAR SCORE METER)
// --------------------------------------------------------------------------
function renderResultView(stageEl, params = {}) {
  const quizId = params.quizId || 'quiz-math-01';
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];
  const result = state.userAttempts[quizId] || { score: 24, total: 30, percentage: 80, timeTaken: "32:45" };

  let statusBadge = `<span class="badge badge-success" style="font-size:14px; padding:6px 14px;">Excellent Performance! 🎉</span>`;
  if (result.percentage < 50) {
    statusBadge = `<span class="badge badge-error" style="font-size:14px; padding:6px 14px;">Needs Improvement</span>`;
  } else if (result.percentage < 75) {
    statusBadge = `<span class="badge badge-warning" style="font-size:14px; padding:6px 14px;">Good Effort</span>`;
  }

  // Stroke Dashoffset for 160px SVG Circle
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.percentage / 100) * circumference;

  stageEl.innerHTML = `
    <div style="max-width:760px; margin:0 auto;">
      <!-- Hero Banner -->
      <div class="result-hero">
        <h1 style="font-size:26px; font-weight:800; margin-bottom:6px;">Congratulations!</h1>
        <p style="font-size:14px; color:var(--color-text-muted); margin-bottom:20px;">You have completed ${quiz.title}</p>
        
        ${statusBadge}

        <!-- Circular Score SVG -->
        <div class="score-circle-wrap">
          <svg class="score-circle-svg" viewBox="0 0 160 160">
            <circle class="score-circle-bg" cx="80" cy="80" r="${radius}" fill="none"/>
            <circle class="score-circle-progress" cx="80" cy="80" r="${radius}" fill="none"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="score-center-text">
            <div class="score-val">${result.score} / ${result.total}</div>
            <div class="score-pct">${result.percentage}%</div>
          </div>
        </div>
      </div>

      <!-- Performance Stats Grid -->
      <div class="stats-cards-grid">
        <div class="stat-card">
          <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Correct</div>
          <div class="stat-card-val" style="color:var(--color-success);">${result.score}</div>
        </div>

        <div class="stat-card">
          <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Incorrect</div>
          <div class="stat-card-val" style="color:var(--color-error);">${result.total - result.score}</div>
        </div>

        <div class="stat-card">
          <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Percentage</div>
          <div class="stat-card-val" style="color:var(--color-primary);">${result.percentage}%</div>
        </div>

        <div class="stat-card">
          <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Time Taken</div>
          <div class="stat-card-val" style="color:var(--color-secondary);">${result.timeTaken}</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
        <button class="btn btn-primary btn-lg" id="review-answers-btn">${getIcon('fileText', 18)} Review Detailed Answers</button>
        <button class="btn btn-outline btn-lg" id="back-dash-btn">Dashboard</button>
      </div>
    </div>
  `;

  document.getElementById('review-answers-btn')?.addEventListener('click', () => navigateTo('answer-review', { quizId }));
  document.getElementById('back-dash-btn')?.addEventListener('click', () => navigateTo('dashboard'));
}

// --------------------------------------------------------------------------
// VIEW 11: ANSWER REVIEW PAGE
// --------------------------------------------------------------------------
function renderAnswerReviewView(stageEl, params = {}) {
  const quizId = params.quizId || 'quiz-math-01';
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];
  const result = state.userAttempts[quizId] || { answers: { 0: 0, 1: 2, 2: 0, 3: 0, 4: 0, 5: 0 } };
  const questions = quiz.questions;

  stageEl.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item" id="crumb-res">Quiz Results</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">Answer Solutions Review</span>
    </div>

    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Solutions & Explanations</h1>
      <p class="welcome-subtitle">${quiz.title} • Itemized Answer Breakdown</p>
    </div>

    <div style="max-width:840px;">
      ${questions.map((q, idx) => {
        const studentChoice = result.answers ? result.answers[idx] : undefined;
        const isCorrect = studentChoice === q.correctIndex;

        return `
          <div class="review-card ${isCorrect ? 'correct-border' : 'incorrect-border'}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span class="question-number-badge">Question ${idx + 1}</span>
              <span class="badge ${isCorrect ? 'badge-success' : 'badge-error'}">${isCorrect ? 'Correct ✓' : 'Incorrect ✕'}</span>
            </div>

            <h4 style="font-size:16px; font-weight:700; margin-bottom:16px;">${q.text}</h4>

            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; font-size:14px;">
              ${q.options.map((opt, oIdx) => {
                let bg = 'var(--color-bg)';
                let border = 'var(--color-border)';
                let textWeight = '500';

                if (oIdx === q.correctIndex) {
                  bg = 'var(--color-success-light)';
                  border = 'var(--color-success)';
                  textWeight = '700';
                } else if (oIdx === studentChoice && !isCorrect) {
                  bg = 'var(--color-error-light)';
                  border = 'var(--color-error)';
                }

                return `
                  <div style="padding:12px 16px; border-radius:var(--radius-sm); background:${bg}; border:1px solid ${border}; font-weight:${textWeight};">
                    ${String.fromCharCode(65 + oIdx)}. ${opt} ${oIdx === q.correctIndex ? '✓ (Correct Key)' : oIdx === studentChoice ? '✕ (Your Answer)' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Explanation Box -->
            <div class="explanation-box">
              <strong>Solution Explanation:</strong><br>
              ${q.explanation}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('crumb-res')?.addEventListener('click', () => navigateTo('result', { quizId }));
}

// --------------------------------------------------------------------------
// VIEW 12: STUDENT PROFILE
// --------------------------------------------------------------------------
function renderProfileView(stageEl) {
  const user = state.currentUser || initialStudentProfile;

  stageEl.innerHTML = `
    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Student Profile</h1>
      <p class="welcome-subtitle">Manage account details, view subscription status, and payment receipts</p>
    </div>

    <div style="display:grid; grid-template-columns: 1fr; gap:24px;">
      <!-- Profile Header Card -->
      <div class="card" style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
        <div class="avatar" style="width:72px; height:72px; font-size:28px;">${user.name.charAt(0)}</div>
        <div style="flex:1;">
          <h2 style="font-size:22px; font-weight:800; margin-bottom:4px;">${user.name}</h2>
          <p style="font-size:14px; color:var(--color-text-muted);">${user.email} • ${user.phone}</p>
          <div style="display:flex; gap:10px; margin-top:8px;">
            <span class="badge badge-primary">${user.examLevel}</span>
            <span class="badge badge-neutral">${user.school}</span>
          </div>
        </div>
      </div>

      <!-- Payment History Receipts Table -->
      <div class="card">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Payment History & Invoices</h3>
        
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Quiz Paper Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Gateway</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${user.paymentHistory.map(item => `
                <tr>
                  <td style="font-weight:700;">${item.id}</td>
                  <td>${item.quizTitle}</td>
                  <td>${item.date}</td>
                  <td>${item.amount}</td>
                  <td>${item.gateway}</td>
                  <td><span class="badge badge-success">${item.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// VIEW 13: RESULTS HISTORY PAGE
// --------------------------------------------------------------------------
function renderResultsHistoryView(stageEl) {
  const attemptsKeys = Object.keys(state.userAttempts);

  stageEl.innerHTML = `
    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Results & Performance History</h1>
      <p class="welcome-subtitle">Comprehensive archive of all completed examinations and score cards</p>
    </div>

    ${attemptsKeys.length === 0 ? `
      <div class="card" style="text-align:center; padding:48px 24px;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">No Exam Attempts Recorded</h3>
        <p style="font-size:14px; color:var(--color-text-muted);">Complete your first quiz to generate performance analytics.</p>
      </div>
    ` : `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Date Completed</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Time Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${attemptsKeys.map(key => {
              const att = state.userAttempts[key];
              const q = state.quizzes.find(item => item.id === key) || { title: "Algebra & Quadratic Equations" };

              return `
                <tr>
                  <td style="font-weight:700;">${q.title}</td>
                  <td>${att.date}</td>
                  <td>${att.score} / ${att.total}</td>
                  <td><span class="badge badge-success" style="font-size:13px;">${att.percentage}%</span></td>
                  <td>${att.timeTaken}</td>
                  <td>
                    <button class="btn btn-outline btn-sm view-res-row-btn" data-id="${key}">View Result</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;

  stageEl.querySelectorAll('.view-res-row-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('result', { quizId: btn.dataset.id }));
  });
}

// --------------------------------------------------------------------------
// VIEW 14: ADMIN DASHBOARD (ANALYTICS & MANAGEMENT)
// --------------------------------------------------------------------------
function renderAdminDashboardView(stageEl) {
  const stats = state.adminStats;

  stageEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
      <div>
        <h1 class="welcome-title">Admin Management Portal</h1>
        <p class="welcome-subtitle">Platform overview, student analytics & quiz publication CMS</p>
      </div>
      <button class="btn btn-primary" id="create-new-quiz-btn">${getIcon('plus', 18)} Create New Quiz</button>
    </div>

    <!-- Admin Metrics Grid -->
    <div class="admin-metrics-grid">
      <div class="stat-card">
        <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Total Registered Students</div>
        <div class="stat-card-val" style="color:var(--color-primary);">${stats.totalStudents}</div>
      </div>
      <div class="stat-card">
        <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Published Quizzes</div>
        <div class="stat-card-val" style="color:var(--color-secondary);">${state.quizzes.length}</div>
      </div>
      <div class="stat-card">
        <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Total Revenue (LKR)</div>
        <div class="stat-card-val" style="color:var(--color-success);">LKR ${(stats.revenueLKR / 1000).toFixed(0)}k</div>
      </div>
      <div class="stat-card">
        <div style="font-size:12px; color:var(--color-text-muted); font-weight:600;">Completed Attempts</div>
        <div class="stat-card-val" style="color:#D97706;">${stats.completedAttempts}</div>
      </div>
    </div>

    <!-- Quiz CMS Management Table -->
    <div class="card" style="margin-bottom:28px;">
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Quiz Publication Inventory</h3>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Subject</th>
              <th>Level</th>
              <th>Questions</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.quizzes.map(quiz => `
              <tr>
                <td style="font-weight:700;">${quiz.title}</td>
                <td>${quiz.subjectName}</td>
                <td><span class="badge badge-neutral">${quiz.examLevel.toUpperCase()}</span></td>
                <td>${quiz.questionCount}</td>
                <td>${quiz.durationMinutes} mins</td>
                <td>LKR ${quiz.price}</td>
                <td>
                  <div style="display:flex; gap:8px;">
                    <button class="icon-btn edit-quiz-btn" style="width:32px; height:32px;" title="Edit">${getIcon('edit', 16)}</button>
                    <button class="icon-btn delete-quiz-btn" style="width:32px; height:32px; color:var(--color-error);" title="Delete" data-id="${quiz.id}">${getIcon('trash', 16)}</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('create-new-quiz-btn')?.addEventListener('click', () => navigateTo('admin-quiz-wizard'));

  stageEl.querySelectorAll('.delete-quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.id;
      if (confirm("Are you sure you want to delete this quiz paper?")) {
        state.quizzes = state.quizzes.filter(q => q.id !== qId);
        localStorage.setItem('eduquiz_quizzes', JSON.stringify(state.quizzes));
        showToast('Quiz deleted successfully', 'info');
        renderAdminDashboardView(stageEl);
      }
    });
  });
}

// --------------------------------------------------------------------------
// VIEW 15: 5-STEP ADMIN QUIZ CREATION WIZARD
// --------------------------------------------------------------------------
function renderAdminQuizWizardView(stageEl) {
  const wiz = state.wizard;

  stageEl.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item" id="crumb-admin">Admin Portal</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">Create Quiz Wizard</span>
    </div>

    <div style="margin-bottom:24px;">
      <h1 class="welcome-title">Create New Examination Paper</h1>
      <p class="welcome-subtitle">Step-by-step quiz creation wizard</p>
    </div>

    <!-- Wizard Steps Bar -->
    <div class="wizard-steps">
      <div class="wizard-step ${wiz.step === 1 ? 'active' : wiz.step > 1 ? 'completed' : ''}">
        <div class="wizard-step-num">1</div>
        <div class="wizard-step-label">Basic Info</div>
      </div>
      <div class="wizard-step ${wiz.step === 2 ? 'active' : wiz.step > 2 ? 'completed' : ''}">
        <div class="wizard-step-num">2</div>
        <div class="wizard-step-label">Settings</div>
      </div>
      <div class="wizard-step ${wiz.step === 3 ? 'active' : wiz.step > 3 ? 'completed' : ''}">
        <div class="wizard-step-num">3</div>
        <div class="wizard-step-label">Add Questions</div>
      </div>
      <div class="wizard-step ${wiz.step === 4 ? 'active' : wiz.step > 4 ? 'completed' : ''}">
        <div class="wizard-step-num">4</div>
        <div class="wizard-step-label">Preview</div>
      </div>
      <div class="wizard-step ${wiz.step === 5 ? 'active' : ''}">
        <div class="wizard-step-num">5</div>
        <div class="wizard-step-label">Publish</div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="card" style="max-width:720px; margin:0 auto;">
      ${renderWizardStepContent(wiz)}
    </div>
  `;

  document.getElementById('crumb-admin')?.addEventListener('click', () => navigateTo('admin-dashboard'));

  // Step 1 Save
  document.getElementById('wiz-next-1')?.addEventListener('click', () => {
    wiz.title = document.getElementById('wiz-title').value || 'New Model Paper';
    wiz.examLevel = document.getElementById('wiz-level').value;
    wiz.subjectName = document.getElementById('wiz-subject').value;
    wiz.step = 2;
    renderAdminQuizWizardView(stageEl);
  });

  // Step 2 Save
  document.getElementById('wiz-next-2')?.addEventListener('click', () => {
    wiz.duration = parseInt(document.getElementById('wiz-duration').value) || 45;
    wiz.price = parseInt(document.getElementById('wiz-price').value) || 300;
    wiz.step = 3;
    renderAdminQuizWizardView(stageEl);
  });

  // Step 3 Add Question
  document.getElementById('wiz-add-q-btn')?.addEventListener('click', () => {
    wiz.questions.push({
      id: wiz.questions.length + 1,
      text: "New Question Text...",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      explanation: "Step-by-step explanation..."
    });
    renderAdminQuizWizardView(stageEl);
  });

  document.getElementById('wiz-next-3')?.addEventListener('click', () => {
    wiz.step = 4;
    renderAdminQuizWizardView(stageEl);
  });

  // Step 4 Next
  document.getElementById('wiz-next-4')?.addEventListener('click', () => {
    wiz.step = 5;
    renderAdminQuizWizardView(stageEl);
  });

  // Step 5 Publish
  document.getElementById('wiz-publish-btn')?.addEventListener('click', () => {
    const newQuiz = {
      id: `quiz-custom-${Date.now()}`,
      title: wiz.title || "Custom Model Paper",
      examLevel: wiz.examLevel,
      subjectId: 'math',
      subjectName: wiz.subjectName || "Mathematics",
      questionCount: wiz.questions.length,
      durationMinutes: wiz.duration,
      difficulty: "Medium",
      price: wiz.price,
      currency: "LKR",
      attemptsAllowed: 1,
      rating: 5.0,
      reviewsCount: 1,
      purchased: false,
      completed: false,
      about: "Newly created examination paper.",
      questions: wiz.questions
    };

    state.quizzes.unshift(newQuiz);
    localStorage.setItem('eduquiz_quizzes', JSON.stringify(state.quizzes));
    showToast('Quiz published successfully!', 'success');
    navigateTo('admin-dashboard');
  });

  document.getElementById('wiz-prev-btn')?.addEventListener('click', () => {
    if (wiz.step > 1) {
      wiz.step--;
      renderAdminQuizWizardView(stageEl);
    }
  });
}

function renderWizardStepContent(wiz) {
  if (wiz.step === 1) {
    return `
      <h3 style="font-size:18px; font-weight:700; margin-bottom:16px;">Step 1: Basic Information</h3>
      <div class="form-group">
        <label class="form-label">Quiz Paper Title</label>
        <input type="text" id="wiz-title" class="form-input" value="${wiz.title}" placeholder="e.g. Combined Mathematics Model Paper 01">
      </div>
      <div class="form-group">
        <label class="form-label">Exam Level</label>
        <select id="wiz-level" class="form-select">
          <option value="g5">Grade 5 Scholarship</option>
          <option value="ol" ${wiz.examLevel === 'ol' ? 'selected' : ''}>G.C.E. O/L</option>
          <option value="al" ${wiz.examLevel === 'al' ? 'selected' : ''}>G.C.E. A/L</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Subject</label>
        <input type="text" id="wiz-subject" class="form-input" value="${wiz.subjectName}">
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:24px;">
        <button class="btn btn-primary" id="wiz-next-1">Next: Settings ${getIcon('chevronRight', 16)}</button>
      </div>
    `;
  }

  if (wiz.step === 2) {
    return `
      <h3 style="font-size:18px; font-weight:700; margin-bottom:16px;">Step 2: Quiz Settings</h3>
      <div class="form-group">
        <label class="form-label">Duration (Minutes)</label>
        <input type="number" id="wiz-duration" class="form-input" value="${wiz.duration}">
      </div>
      <div class="form-group">
        <label class="form-label">Price (LKR)</label>
        <input type="number" id="wiz-price" class="form-input" value="${wiz.price}">
      </div>
      <div style="display:flex; justify-content:space-between; margin-top:24px;">
        <button class="btn btn-outline" id="wiz-prev-btn">Back</button>
        <button class="btn btn-primary" id="wiz-next-2">Next: Add Questions ${getIcon('chevronRight', 16)}</button>
      </div>
    `;
  }

  if (wiz.step === 3) {
    return `
      <h3 style="font-size:18px; font-weight:700; margin-bottom:16px;">Step 3: Add Questions (${wiz.questions.length})</h3>
      <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:20px;">
        ${wiz.questions.map((q, idx) => `
          <div style="padding:16px; border:1px solid var(--color-border); border-radius:var(--radius-md);">
            <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Question ${idx + 1}</div>
            <input type="text" class="form-input" value="${q.text}" style="margin-bottom:8px;">
            <div style="font-size:12px; color:var(--color-text-muted);">4 Multiple Choice Options (A-D)</div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-block" id="wiz-add-q-btn" style="margin-bottom:20px;">+ Add Question</button>
      <div style="display:flex; justify-content:space-between;">
        <button class="btn btn-outline" id="wiz-prev-btn">Back</button>
        <button class="btn btn-primary" id="wiz-next-3">Next: Preview ${getIcon('chevronRight', 16)}</button>
      </div>
    `;
  }

  if (wiz.step === 4) {
    return `
      <h3 style="font-size:18px; font-weight:700; margin-bottom:16px;">Step 4: Quiz Preview</h3>
      <div style="padding:16px; background:var(--color-bg); border-radius:var(--radius-md); margin-bottom:20px;">
        <h4 style="font-size:18px; font-weight:800;">${wiz.title}</h4>
        <p style="font-size:14px; color:var(--color-text-muted);">${wiz.subjectName} • ${wiz.duration} Minutes • LKR ${wiz.price}</p>
        <p style="font-size:14px; margin-top:8px;">Total Questions: ${wiz.questions.length}</p>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <button class="btn btn-outline" id="wiz-prev-btn">Back</button>
        <button class="btn btn-primary" id="wiz-next-4">Next: Publish ${getIcon('chevronRight', 16)}</button>
      </div>
    `;
  }

  return `
    <h3 style="font-size:18px; font-weight:700; margin-bottom:16px;">Step 5: Publish Paper</h3>
    <p style="font-size:14px; color:var(--color-text-muted); margin-bottom:20px;">Your paper is ready to be published live to the platform catalog.</p>
    <div style="display:flex; justify-content:space-between;">
      <button class="btn btn-outline" id="wiz-prev-btn">Back</button>
      <button class="btn btn-primary btn-lg" id="wiz-publish-btn">Publish Quiz Live 🎉</button>
    </div>
  `;
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
