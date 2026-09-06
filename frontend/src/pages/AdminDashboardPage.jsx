import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle, TrendingUp, Users, BookOpen, DollarSign, Lock, ShieldCheck, LogOut, BarChart3, CreditCard, Menu, X, ChevronRight, HelpCircle, Image as ImageIcon, Upload, Check, AlertCircle, Eye, Sparkles, FileText, Layers } from 'lucide-react';
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

  // Question Management State
  const [questionsList, setQuestionsList] = useState([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all');
  const [showQuestionForm, setShowQuestionForm] = useState(true);

  // Question Form Fields State
  const [qText, setQText] = useState('');
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [options, setOptions] = useState([
    { letter: 'A', text: '' },
    { letter: 'B', text: '' },
    { letter: 'C', text: '' },
    { letter: 'D', text: '' }
  ]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [correctIndices, setCorrectIndices] = useState([]);
  const [hasImage, setHasImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [qSubject, setQSubject] = useState('Mathematics');
  const [qExamLevel, setQExamLevel] = useState('ol');
  const [qExplanation, setQExplanation] = useState('');
  const [qFormError, setQFormError] = useState('');
  const [qFormSuccess, setQFormSuccess] = useState('');
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const fileInputRef = useRef(null);

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

      const qRes = await api.getQuestions();
      if (qRes.questions) setQuestionsList(qRes.questions);
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
    { key: 'questions', label: 'Questions', icon: HelpCircle, count: questionsList?.length || 0 },
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

  // Question Management Handlers
  const handleOptionChange = (idx, val) => {
    const updated = [...options];
    updated[idx].text = val;
    setOptions(updated);
    setQFormError('');
  };

  const handleAddOption = () => {
    if (options.length >= 8) return;
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions([...options, { letter: nextLetter, text: '' }]);
  };

  const handleRemoveOption = (idx) => {
    if (options.length <= 2) {
      setQFormError('A Multiple Choice question must have at least 2 options.');
      return;
    }
    const filtered = options.filter((_, i) => i !== idx);
    const reindexed = filtered.map((opt, i) => ({
      ...opt,
      letter: String.fromCharCode(65 + i)
    }));
    setOptions(reindexed);
    const nextCorrect = correctIndices
      .filter(i => i !== idx)
      .map(i => (i > idx ? i - 1 : i));
    setCorrectIndices(nextCorrect);
    setCorrectIndex(nextCorrect.length > 0 ? nextCorrect[0] : null);
    setQFormError('');
  };

  const handleToggleCorrectOption = (idx) => {
    let next;
    if (correctIndices.includes(idx)) {
      next = correctIndices.filter(i => i !== idx);
    } else {
      next = [...correctIndices, idx].sort((a, b) => a - b);
    }
    setCorrectIndices(next);
    setCorrectIndex(next.length > 0 ? next[0] : null);
    setQFormError('');
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setQFormError('Please select a valid image file (PNG, JPG, JPEG, WEBP, etc.).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setQFormError('Image size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setImageFileName(file.name);
    setQFormError('');

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetForm = () => {
    setQText('');
    setIsMultipleChoice(false);
    setOptions([
      { letter: 'A', text: '' },
      { letter: 'B', text: '' },
      { letter: 'C', text: '' },
      { letter: 'D', text: '' }
    ]);
    setCorrectIndex(null);
    setCorrectIndices([]);
    setHasImage(false);
    setImagePreview(null);
    setImageFileName('');
    setQSubject('Mathematics');
    setQExamLevel('ol');
    setQExplanation('');
    setQFormError('');
    setQFormSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveQuestion = async (e) => {
    if (e) e.preventDefault();
    setQFormError('');
    setQFormSuccess('');

    const cleanText = qText.trim();
    if (!cleanText) {
      setQFormError('Please enter the question text before saving.');
      return;
    }

    if (isMultipleChoice) {
      if (options.length < 2) {
        setQFormError('Multiple Choice questions must include at least 2 options.');
        return;
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].text.trim()) {
          setQFormError(`Please enter text for Option ${options[i].letter}.`);
          return;
        }
      }
      if (correctIndices.length === 0) {
        setQFormError('Please select at least one correct answer using the checkboxes.');
        return;
      }
    }

    setIsSavingQuestion(true);

    try {
      const correctOptText = (isMultipleChoice && correctIndices.length > 0)
        ? correctIndices.map(i => `Option ${options[i].letter}`).join(', ')
        : null;

      const payload = {
        questionText: cleanText,
        isMultipleChoice,
        options: isMultipleChoice ? options.map((opt, i) => ({
          letter: opt.letter,
          text: opt.text.trim(),
          isCorrect: correctIndices.includes(i)
        })) : [],
        correctIndex: isMultipleChoice && correctIndices.length > 0 ? correctIndices[0] : null,
        correctIndices: isMultipleChoice ? correctIndices : [],
        correctOption: correctOptText,
        correctOptions: isMultipleChoice ? correctIndices.map(i => `Option ${options[i].letter}`) : [],
        hasImage: Boolean(hasImage && imagePreview),
        imageUrl: hasImage ? imagePreview : null,
        subject: qSubject,
        examLevel: qExamLevel,
        explanation: qExplanation.trim()
      };

      const res = await api.createQuestion(payload);
      if (res.success) {
        setQFormSuccess('Question created and saved successfully to the question bank!');
        if (res.questions) {
          setQuestionsList(res.questions);
        } else if (res.question) {
          setQuestionsList([res.question, ...questionsList]);
        }
        handleResetForm();
        setTimeout(() => setQFormSuccess(''), 4000);
      } else {
        setQFormError(res.message || 'Failed to save question.');
      }
    } catch (err) {
      setQFormError(err.message || 'An error occurred while saving the question.');
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm("Are you sure you want to delete this question permanently?")) {
      const res = await api.deleteQuestion(qId);
      if (res.questions) {
        setQuestionsList(res.questions);
      } else {
        setQuestionsList(questionsList.filter(q => q.id !== qId));
      }
    }
  };

  const filteredQuestions = questionsList.filter(q => {
    const textMatch = (q.questionText || '').toLowerCase().includes(questionSearch.toLowerCase()) ||
                      (q.subject || '').toLowerCase().includes(questionSearch.toLowerCase());
    if (!textMatch) return false;
    if (questionTypeFilter === 'mc') return q.isMultipleChoice;
    if (questionTypeFilter === 'text') return !q.isMultipleChoice && !q.hasImage;
    if (questionTypeFilter === 'image') return q.hasImage;
    return true;
  });

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

        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Top Toolbar */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <HelpCircle size={22} color="var(--color-primary)" /> Question Bank & Creation
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  Create and manage questions with optional multiple-choice options and question image uploads.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className={`btn ${showQuestionForm ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowQuestionForm(!showQuestionForm)}
                  style={{ gap: '6px' }}
                >
                  <Plus size={16} /> {showQuestionForm ? 'Hide Form' : 'New Question'}
                </button>
              </div>
            </div>

            {/* Question Creation Form Container */}
            {showQuestionForm && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '24px' }}>
                
                {/* ── Left Column: Creation Form ── */}
                <div className="card" style={{ borderLeft: '6px solid var(--color-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>Create Question</h3>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Configure question text, optional choices, and optional image</span>
                    </div>
                    <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} /> Question Builder
                    </span>
                  </div>

                  <form onSubmit={handleSaveQuestion}>
                    {/* 1. Question Text Area */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                        Question *
                      </label>
                      <textarea
                        id="input-question-text"
                        className="form-input"
                        rows={4}
                        placeholder="Enter your question here..."
                        value={qText}
                        onChange={(e) => { setQText(e.target.value); setQFormError(''); }}
                        style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontSize: '14px', fontFamily: 'inherit' }}
                        required
                      />
                    </div>

                    {/* 2. Multiple Choice Options — OPTIONAL */}
                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: isMultipleChoice ? 'var(--color-primary-light)' : 'var(--color-bg)',
                      border: isMultipleChoice ? '1.5px solid var(--color-primary-border)' : '1px solid var(--color-border)',
                      marginBottom: '20px',
                      transition: 'all 0.2s ease'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          id="checkbox-add-multiple-choice"
                          type="checkbox"
                          checked={isMultipleChoice}
                          onChange={(e) => {
                            setIsMultipleChoice(e.target.checked);
                            setQFormError('');
                          }}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>
                          Add Multiple Choice
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(Optional)</span>
                      </label>

                      {isMultipleChoice && (
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            <span>Enter answer options and select one or more correct answers using the checkboxes:</span>
                            {correctIndices.length > 0 && (
                              <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={12} /> {correctIndices.length} correct {correctIndices.length === 1 ? 'answer' : 'answers'} marked
                              </span>
                            )}
                          </div>

                          {options.map((opt, idx) => {
                            const isCorrect = correctIndices.includes(idx);
                            return (
                              <div
                                key={opt.letter}
                                id={`option-row-${opt.letter}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  backgroundColor: isCorrect ? '#DCFCE7' : '#FFFFFF',
                                  border: isCorrect ? '2px solid #16A34A' : '1px solid var(--color-border)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span style={{
                                  fontWeight: 800,
                                  fontSize: '13px',
                                  width: '74px',
                                  color: isCorrect ? '#16A34A' : 'var(--color-text-main)',
                                  flexShrink: 0
                                }}>
                                  Option {opt.letter}
                                </span>

                                <input
                                  type="text"
                                  className="form-input"
                                  value={opt.text}
                                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                                  placeholder={`Enter option ${opt.letter} text...`}
                                  style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    backgroundColor: isCorrect ? '#FFFFFF' : undefined
                                  }}
                                />

                                <label
                                  title="Mark as correct answer (supports multiple correct)"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: isCorrect ? '#16A34A' : 'var(--color-bg)',
                                    color: isCorrect ? '#FFFFFF' : 'var(--color-text-muted)',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                    border: '1px solid var(--color-border)'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    name={`correct_selector_${idx}`}
                                    checked={isCorrect}
                                    onChange={() => handleToggleCorrectOption(idx)}
                                    style={{ accentColor: '#16A34A', cursor: 'pointer', width: '15px', height: '15px' }}
                                  />
                                  Correct
                                </label>

                                {options.length > 2 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    title={`Remove Option ${opt.letter}`}
                                    onClick={() => handleRemoveOption(idx)}
                                    style={{ color: 'var(--color-error)', padding: '6px 8px', flexShrink: 0 }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}

                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={handleAddOption}
                              disabled={options.length >= 8}
                              style={{ fontSize: '12px', gap: '6px' }}
                            >
                              <Plus size={14} /> Add Option {String.fromCharCode(65 + options.length)}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Question Image — OPTIONAL */}
                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: hasImage ? '#F5F3FF' : 'var(--color-bg)',
                      border: hasImage ? '1.5px solid #DDD6FE' : '1px solid var(--color-border)',
                      marginBottom: '20px',
                      transition: 'all 0.2s ease'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          id="checkbox-add-question-image"
                          type="checkbox"
                          checked={hasImage}
                          onChange={(e) => {
                            setHasImage(e.target.checked);
                            if (!e.target.checked) {
                              setImagePreview(null);
                              setImageFileName('');
                            }
                            setQFormError('');
                          }}
                          style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>
                          Add Question Image
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(Optional)</span>
                      </label>

                      {hasImage && (
                        <div style={{ marginTop: '16px' }}>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageFileSelect}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />

                          {!imagePreview ? (
                            <div
                              id="btn-upload-question-image"
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                border: '2px dashed #C4B5FD',
                                borderRadius: '12px',
                                padding: '24px',
                                textAlign: 'center',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.backgroundColor = '#FAF5FF'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                            >
                              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                                <Upload size={22} />
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                                Click to Upload Question Image
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                PNG, JPG, JPEG, WEBP or GIF (Max 5MB)
                              </div>
                            </div>
                          ) : (
                            <div id="box-image-preview" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid var(--color-border)' }}>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ImageIcon size={14} color="#7C3AED" /> Image Preview
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', maxWidth: '280px', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' }}>
                                  <img
                                    src={imagePreview}
                                    alt="Question attachment preview"
                                    style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', display: 'block' }}
                                  />
                                </div>
                                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
                                    {imageFileName || 'Selected question image'}
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    <button
                                      type="button"
                                      className="btn btn-outline btn-sm"
                                      onClick={() => fileInputRef.current?.click()}
                                      style={{ fontSize: '12px' }}
                                    >
                                      Change Image
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline btn-sm"
                                      onClick={handleRemoveImage}
                                      style={{ color: 'var(--color-error)', fontSize: '12px' }}
                                    >
                                      <Trash2 size={13} /> Remove Image
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Additional Metadata: Subject & Exam Level */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>Subject</label>
                        <select className="form-input" value={qSubject} onChange={(e) => setQSubject(e.target.value)}>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="History">History</option>
                          <option value="English">English</option>
                          <option value="Scholarship & IQ">Scholarship & IQ</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>Exam Level</label>
                        <select className="form-input" value={qExamLevel} onChange={(e) => setQExamLevel(e.target.value)}>
                          <option value="ol">G.C.E. Ordinary Level (O/L)</option>
                          <option value="al">G.C.E. Advanced Level (A/L)</option>
                          <option value="g5">Grade 5 Scholarship</option>
                        </select>
                      </div>
                    </div>

                    {/* Alerts */}
                    {qFormError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                        <AlertCircle size={16} flexShrink={0} /> {qFormError}
                      </div>
                    )}

                    {qFormSuccess && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                        <CheckCircle size={16} flexShrink={0} /> {qFormSuccess}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        id="btn-save-question"
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSavingQuestion}
                        style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 700, gap: '8px' }}
                      >
                        <Check size={18} /> {isSavingQuestion ? 'Saving Question...' : 'Save Question'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleResetForm}
                        disabled={isSavingQuestion}
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>

                {/* ── Right Column: Live Interactive Preview ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card" style={{ position: 'sticky', top: '80px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Eye size={16} color="var(--color-primary)" />
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>Live Student Preview</span>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        {isMultipleChoice ? (hasImage ? 'Image + MC' : 'Multiple Choice') : (hasImage ? 'Image Only' : 'Text Only')}
                      </span>
                    </div>

                    {/* Simulated question badge */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{qSubject}</span>
                      <span className="badge badge-neutral">{qExamLevel.toUpperCase()}</span>
                    </div>

                    {/* Question text */}
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {qText.trim() || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Question text will appear here...</span>}
                    </h4>

                    {/* Image Preview if present */}
                    {hasImage && imagePreview && (
                      <div style={{ marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', maxHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={imagePreview}
                          alt="Question Preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Multiple Choice Preview if enabled */}
                    {isMultipleChoice && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {options.map((opt, idx) => {
                          const isCorrect = correctIndices.includes(idx);
                          return (
                            <div
                              key={opt.letter}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                backgroundColor: isCorrect ? '#DCFCE7' : 'var(--color-bg)',
                                border: isCorrect ? '1.5px solid #16A34A' : '1px solid var(--color-border)',
                                fontSize: '13px',
                                color: isCorrect ? '#15803D' : 'var(--color-text-main)',
                                fontWeight: isCorrect ? 700 : 500
                              }}
                            >
                              <span style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                backgroundColor: isCorrect ? '#16A34A' : 'white',
                                color: isCorrect ? 'white' : 'var(--color-text-muted)',
                                border: isCorrect ? 'none' : '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800
                              }}>
                                {opt.letter}
                              </span>
                              <span style={{ flex: 1 }}>
                                {opt.text.trim() || <em style={{ color: 'var(--color-text-muted)' }}>Option {opt.letter} text...</em>}
                              </span>
                              {isCorrect && (
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <Check size={12} /> Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!isMultipleChoice && (
                      <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-bg)', border: '1px dashed var(--color-border)', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        Normal descriptive question (No multiple choice options attached)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Questions Table Card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className={`btn btn-sm ${questionTypeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuestionTypeFilter('all')}>
                    All ({questionsList.length})
                  </button>
                  <button className={`btn btn-sm ${questionTypeFilter === 'mc' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuestionTypeFilter('mc')}>
                    Multiple Choice ({questionsList.filter(q => q.isMultipleChoice).length})
                  </button>
                  <button className={`btn btn-sm ${questionTypeFilter === 'text' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuestionTypeFilter('text')}>
                    Text Only ({questionsList.filter(q => !q.isMultipleChoice && !q.hasImage).length})
                  </button>
                  <button className={`btn btn-sm ${questionTypeFilter === 'image' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setQuestionTypeFilter('image')}>
                    With Image ({questionsList.filter(q => q.hasImage).length})
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px', backgroundColor: 'var(--color-bg)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <Search size={16} color="var(--color-text-muted)" />
                  <input
                    type="text"
                    placeholder="Search question or subject..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)', width: '38%' }}>Question</th>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Type</th>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Options & Key</th>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Subject</th>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Date</th>
                      <th style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No questions found matching the selected filter. Create a new question above!
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q, i) => (
                        <tr key={q.id || i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              {q.hasImage && q.imageUrl ? (
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0, backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={q.imageUrl} alt="Thumb" style={{ maxWidth: '100%', maxHeight: '48px', objectFit: 'cover' }} />
                                </div>
                              ) : null}
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.4, marginBottom: '4px' }}>
                                  {q.questionText}
                                </div>
                                {q.explanation && (
                                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                    💡 {q.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <span className={`badge ${q.isMultipleChoice ? 'badge-primary' : 'badge-neutral'}`}>
                                {q.isMultipleChoice
                                  ? (Array.isArray(q.correctIndices) && q.correctIndices.length > 1 ? 'MC (Multi-Correct)' : 'Multiple Choice')
                                  : 'Normal Text'}
                              </span>
                              {q.hasImage && (
                                <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <ImageIcon size={10} /> Image Attached
                                </span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {q.isMultipleChoice && Array.isArray(q.options) && q.options.length > 0 ? (
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                  <Check size={12} /> Correct: {
                                    (Array.isArray(q.correctOptions) && q.correctOptions.length > 0)
                                      ? q.correctOptions.join(', ')
                                      : (q.correctOption || (q.correctIndex !== null && q.correctIndex !== undefined ? `Option ${String.fromCharCode(65 + q.correctIndex)}` : 'None'))
                                  }
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                  {q.options.length} options ({q.options.map(o => o.letter || o.option_letter).join(', ')})
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Descriptive</span>
                            )}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{q.subject || 'General'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{q.examLevel || 'OL'}</div>
                          </td>

                          <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {q.createdAt ? new Date(q.createdAt).toISOString().split('T')[0] : 'Today'}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Delete Question"
                              style={{ color: 'var(--color-error)' }}
                              onClick={() => handleDeleteQuestion(q.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
