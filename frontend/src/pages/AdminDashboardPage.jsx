import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle, TrendingUp, Users, BookOpen, DollarSign, Lock, ShieldCheck, LogOut, BarChart3, CreditCard, Menu, X, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── inline style objects (kept out of JSX for readability) ── */

const NAV_HEIGHT = 64;

const navbarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: `${NAV_HEIGHT}px`,
  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 28px',
  zIndex: 200,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
};

const navLinkBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
  background: 'transparent',
  position: 'relative',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
};

const navLinkActive = {
  ...navLinkBase,
  color: '#FFFFFF',
  backgroundColor: 'rgba(37, 99, 235, 0.25)',
};

const navLinkHoverBg = 'rgba(255,255,255,0.08)';

const mobileDrawerOverlay = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 300,
  display: 'flex',
};

const mobileDrawerPanel = {
  width: '300px',
  maxWidth: '85vw',
  height: '100%',
  background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  overflowY: 'auto',
  boxShadow: '8px 0 32px rgba(0,0,0,0.4)',
};

const mobileNavItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.65)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
  background: 'transparent',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const mobileNavItemActive = {
  ...mobileNavItem,
  color: '#FFFFFF',
  backgroundColor: 'rgba(37, 99, 235, 0.3)',
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, usersDb, loginUser, logoutUser } = useAuth();

  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin@123');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('quizzes');
  const [stats, setStats] = useState({ totalStudents: 1420, totalQuizzes: 48, revenueLKR: 1245000, completedAttempts: 3410, averageScore: 76.4 });
  const [quizzesList, setQuizzesList] = useState([]);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizFilterStatus, setQuizFilterStatus] = useState('all');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const [dbUsers, setDbUsers] = useState([]);

  const mockStudentsList = [
    { id: 'usr-01', name: 'Kasun Perera', email: 'kasun.perera@student.lk', phone: '+94 77 123 4567', examLevel: 'G.C.E. O/L', purchased: 3, completed: 2, joined: '2026-08-10', status: 'Active' },
    { id: 'usr-02', name: 'Dilani Fernando', email: 'dilani.f@gmail.com', phone: '+94 71 888 2211', examLevel: 'G.C.E. A/L (Physical)', purchased: 5, completed: 4, joined: '2026-08-12', status: 'Active' },
    { id: 'usr-03', name: 'Nisal Jayasinghe', email: 'nisal.j@yahoo.com', phone: '+94 75 444 3399', examLevel: 'Grade 5 Scholarship', purchased: 2, completed: 2, joined: '2026-08-15', status: 'Active' },
    { id: 'usr-04', name: 'Amaya Senanayake', email: 'amaya.s@outlook.com', phone: '+94 72 333 1100', examLevel: 'G.C.E. A/L (Bio)', purchased: 4, completed: 1, joined: '2026-08-18', status: 'Active' }
  ];

  // Derive real registered student accounts dynamically from dbUsers / usersDb
  const combinedUsers = (dbUsers || []).length > 0 ? dbUsers : (usersDb || []).filter(u => u?.role !== 'admin');
  const displayStudentsList = combinedUsers.length > 0
    ? combinedUsers.map((st, idx) => ({
        id: st.id || `usr-reg-${idx}`,
        name: st.name || st.email?.split('@')[0] || 'Student',
        email: st.email,
        phone: st.phone || '+94 77 123 4567',
        examLevel: st.examLevel || st.exam_level || 'Not Selected',
        purchased: st.purchased || st.purchasesCount || 0,
        completed: st.completed || st.attemptsCount || 0,
        joined: st.createdAt ? new Date(st.createdAt).toISOString().split('T')[0] : (st.joinedDate || new Date().toISOString().split('T')[0]),
        status: st.status || 'Active'
      }))
    : mockStudentsList;

  const [paymentsList] = useState([
    { id: 'TXN-90214', student: 'Kasun Perera', quizTitle: 'Algebra & Quadratic Equations Paper 01', amount: 300, gateway: 'Card Payment', date: '2026-08-28', status: 'Successful' },
    { id: 'TXN-90213', student: 'Dilani Fernando', quizTitle: 'Physics Mechanics & Gravitational Test', amount: 450, gateway: 'PayHere', date: '2026-08-28', status: 'Successful' },
    { id: 'TXN-90212', student: 'Nisal Jayasinghe', quizTitle: 'Scholarship Intelligence Model Paper 01', amount: 250, gateway: 'Card Payment', date: '2026-08-27', status: 'Successful' },
    { id: 'TXN-90211', student: 'Amaya Senanayake', quizTitle: 'Organic Chemistry Reaction Paper', amount: 500, gateway: 'Bank Transfer', date: '2026-08-26', status: 'Pending' }
  ]);

  useEffect(() => {
    async function loadData() {
      const statsRes = await api.getAdminStats();
      if (statsRes.stats) setStats(statsRes.stats);

      const quizRes = await api.getQuizzes();
      if (quizRes.quizzes) setQuizzesList(quizRes.quizzes);

      const usersRes = await api.getAdminUsers();
      if (usersRes.users) setDbUsers(usersRes.users);
    }
    loadData();
  }, []);

  const handleAdminGateSubmit = async (e) => {
    if (e) e.preventDefault();
    const u = adminUser.trim().toLowerCase();
    const p = adminPass.trim();

    if ((u === 'admin' || u === 'admin@eduquiz.lk') && (p === 'admin@123' || p === 'admin')) {
      await loginUser({
        email: u,
        password: p
      });
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials! Use admin & admin@123');
    }
  };

  const handleAdminLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Tab definitions with icons and counts
  const navTabs = [
    { key: 'quizzes', label: 'Quiz Management', icon: BookOpen, count: quizzesList?.length || 0 },
    { key: 'students', label: 'Students', icon: Users, count: displayStudentsList?.length || 0 },
    { key: 'payments', label: 'Payments', icon: CreditCard, count: paymentsList?.length || 0 },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, count: null },
  ];

  // IF NOT LOGGED IN AS ADMIN, SHOW STANDALONE ADMIN LOGIN WINDOW GATE
  if (user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0F172A', padding: '24px' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)' }}>
              <Lock size={30} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)' }}>Standalone Admin Portal</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Isolated Administrator Control Window
            </p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminGateSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Username / Email</label>
              <input
                type="text"
                className="form-input"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="admin"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '12px' }}>
              <ShieldCheck size={18} /> Unlock Admin Portal Now
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '10px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            Username: <code style={{ fontWeight: 700, color: 'var(--color-primary)' }}>admin</code> | Password: <code style={{ fontWeight: 700, color: 'var(--color-primary)' }}>admin@123</code>
          </div>
        </div>
      </div>
    );
  }

  const filteredQuizzes = quizzesList.filter(q => {
    const titleMatch = (q.title || '').toLowerCase().includes(quizSearch.toLowerCase());
    const subjectMatch = (q.subjectName || '').toLowerCase().includes(quizSearch.toLowerCase());
    const matchesSearch = titleMatch || subjectMatch;
    if (quizFilterStatus === 'published') return matchesSearch && (q.is_published !== false);
    if (quizFilterStatus === 'draft') return matchesSearch && (q.is_published === false);
    return matchesSearch;
  });

  const handleTogglePublish = async (quizId) => {
    const updated = quizzesList.map(q => q.id === quizId ? { ...q, is_published: (q.is_published === false) } : q);
    setQuizzesList(updated);
    await api.updateQuizzesList(updated);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz paper permanently?")) {
      const updated = quizzesList.filter(q => q.id !== quizId);
      setQuizzesList(updated);
      await api.updateQuizzesList(updated);
    }
  };

  const currentTabLabel = navTabs.find(t => t.key === activeTab)?.label || 'Dashboard';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>

      {/* ═══════════════════════════════════════════════════════════
          FIXED TOP NAVIGATION BAR
          ═══════════════════════════════════════════════════════════ */}
      <nav style={navbarStyle}>

        {/* ── Left: Logo + Brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', flexShrink: 0 }}
            className="admin-nav-hamburger"
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
            <div className="logo-badge" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', width: '36px', height: '36px', fontSize: '15px', borderRadius: '10px', flexShrink: 0 }}>EQ</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'white', letterSpacing: '-0.3px' }}>EduQuiz Pro</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Admin Console</span>
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 4px' }} className="admin-nav-divider" />

          {/* ── Center: Nav Tabs (desktop) ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="admin-nav-tabs-desktop">
            {navTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  style={{
                    ...(isActive ? navLinkActive : navLinkBase),
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.25)' : (isHovered ? navLinkHoverBg : 'transparent'),
                  }}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(96, 165, 250, 0.3)' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#93C5FD' : 'rgba(255,255,255,0.5)',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      lineHeight: '18px',
                      transition: 'all 0.2s ease',
                    }}>
                      {tab.count}
                    </span>
                  )}
                  {/* Active indicator bar */}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '24px',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Admin info + Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: 700 }}
            onClick={() => navigate('/admin/create-quiz')}
          >
            <Plus size={14} /> New Quiz
          </button>

          {/* Admin avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 12px 5px 5px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.12)', cursor: 'default' }} className="admin-nav-user-pill">
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0,
            }}>A</div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>admin@eduquiz.lk</span>
          </div>

          <button
            onClick={handleAdminLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#FCA5A5'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE NAV DRAWER (slides in from left)
          ═══════════════════════════════════════════════════════════ */}
      {mobileNavOpen && (
        <div style={mobileDrawerOverlay} onClick={() => setMobileNavOpen(false)}>
          <div style={mobileDrawerPanel} onClick={(e) => e.stopPropagation()}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="logo-badge" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', width: '34px', height: '34px', fontSize: '14px' }}>EQ</div>
                <span style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>Admin Console</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            {navTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setMobileNavOpen(false); }}
                  style={isActive ? mobileNavItemActive : mobileNavItem}
                >
                  <TabIcon size={18} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.count !== null && (
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(96, 165, 250, 0.3)' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#93C5FD' : 'rgba(255,255,255,0.4)',
                      padding: '2px 8px', borderRadius: '9999px',
                    }}>{tab.count}</span>
                  )}
                </button>
              );
            })}

            {/* Drawer footer actions */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => { setMobileNavOpen(false); navigate('/admin/create-quiz'); }}
                style={{ ...mobileNavItem, color: '#60A5FA' }}
              >
                <Plus size={18} />
                <span>Create New Quiz</span>
              </button>
              <button
                onClick={() => { setMobileNavOpen(false); handleAdminLogout(); }}
                style={{ ...mobileNavItem, color: '#FCA5A5' }}
              >
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SUB-HEADER BREADCRUMB BAR
          ═══════════════════════════════════════════════════════════ */}
      <div style={{
        marginTop: `${NAV_HEIGHT}px`,
        backgroundColor: 'var(--color-card-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <span style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => setActiveTab('quizzes')}>Admin</span>
          <ChevronRight size={14} />
          <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{currentTabLabel}</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
          Connected to MongoDB &middot; edu_pulse_lk_db
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 24px 48px 24px' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Students</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{displayStudentsList?.length || 0}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Quizzes</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{quizzesList?.length || 0}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>LKR {(Number(stats?.revenueLKR || 0) / 1000).toFixed(0)}k</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-warning-light)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Completed Attempts</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{stats?.completedAttempts || 0}</div>
            </div>
          </div>
        </div>

        {/* ── Tab Content Panels ── */}
        {activeTab === 'quizzes' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={`btn btn-sm ${quizFilterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuizFilterStatus('all')}>All</button>
                <button className={`btn btn-sm ${quizFilterStatus === 'published' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuizFilterStatus('published')}>Published</button>
                <button className={`btn btn-sm ${quizFilterStatus === 'draft' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuizFilterStatus('draft')}>Drafts</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px', backgroundColor: 'var(--color-bg)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <Search size={16} color="var(--color-text-muted)" />
                <input
                  type="text"
                  placeholder="Search quiz title or subject..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Quiz Title</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Subject</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Level</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Questions</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Price</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Status</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz, i) => {
                    if (!quiz) return null;
                    const isPublished = quiz.is_published !== false;
                    return (
                      <tr key={quiz.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>{quiz.title || 'Untitled Paper'}</td>
                        <td style={{ padding: '14px 16px' }}>{quiz.subjectName || quiz.subject_name || 'General'}</td>
                        <td style={{ padding: '14px 16px' }}><span className="badge badge-neutral">{String(quiz.examLevel || quiz.exam_level || 'OL').toUpperCase()}</span></td>
                        <td style={{ padding: '14px 16px' }}>{quiz.questionCount || quiz.question_count || 0} Qs</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>LKR {quiz.price || 0}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${isPublished ? 'badge-success' : 'badge-warning'}`}>
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-outline btn-sm" title="Toggle Status" onClick={() => handleTogglePublish(quiz.id)}>
                              {isPublished ? <XCircle size={14} color="var(--color-warning)" /> : <CheckCircle size={14} color="var(--color-success)" />}
                            </button>
                            <button className="btn btn-outline btn-sm" title="Edit Quiz" onClick={() => navigate(`/admin/edit-quiz/${quiz.id}`)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn btn-outline btn-sm" title="Delete Paper" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteQuiz(quiz.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Registered Student Roster</h3>
              <span className="badge badge-primary">{displayStudentsList?.length || 0} Active Students</span>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '750px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Student Name</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Email / Phone</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Exam Level</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Purchases</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Joined Date</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStudentsList.map((st, i) => (
                    <tr key={st.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{st.name || 'Student'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{st.email || ''}<br />{st.phone || ''}</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-neutral">{st.examLevel || 'O/L'}</span></td>
                      <td style={{ padding: '14px 16px' }}>{st.purchased || 0} Quizzes</td>
                      <td style={{ padding: '14px 16px' }}>{st.joined || ''}</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-success">{st.status || 'Active'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Payment Gateway Transactions</h3>
              <span className="badge badge-success">Success Rate 98.2%</span>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '750px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Transaction ID</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Student Name</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Quiz Paper</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Amount</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Gateway</th>
                    <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((pay, i) => (
                    <tr key={pay.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{pay.id}</td>
                      <td style={{ padding: '14px 16px' }}>{pay.student || 'Student'}</td>
                      <td style={{ padding: '14px 16px' }}>{pay.quizTitle || 'Quiz Paper'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>LKR {pay.amount || 0}</td>
                      <td style={{ padding: '14px 16px' }}>{pay.gateway || 'Card Payment'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${pay.status === 'Successful' ? 'badge-success' : 'badge-warning'}`}>{pay.status || 'Successful'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Monthly Revenue Growth (LKR)</h3>
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              {[{ month: 'Apr', val: 180 }, { month: 'May', val: 240 }, { month: 'Jun', val: 320 }, { month: 'Jul', val: 410 }, { month: 'Aug', val: 580 }].map(item => (
                <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', height: `${item.val / 6}px`, backgroundColor: 'var(--color-primary)', borderRadius: '6px 6px 0 0' }}></div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════
          RESPONSIVE CSS (injected via style tag)
          ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* Always show admin tabs — scrollable on all sizes */
        .admin-nav-hamburger { display: none !important; }
        .admin-nav-tabs-desktop {
          display: flex !important;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .admin-nav-tabs-desktop::-webkit-scrollbar {
          display: none;
        }
        .admin-nav-divider { display: block !important; }
        .admin-nav-user-pill { display: flex !important; }

        /* Tablet / small desktop */
        @media (max-width: 1100px) {
          .admin-nav-user-pill { display: none !important; }
        }

        /* Smaller screens: shrink tab padding */
        @media (max-width: 860px) {
          .admin-nav-divider { display: none !important; }
          .admin-nav-tabs-desktop button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
