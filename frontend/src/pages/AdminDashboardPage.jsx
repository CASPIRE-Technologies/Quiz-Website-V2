import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Copy, Eye, Trash2, CheckCircle, XCircle, TrendingUp, Users, BookOpen, DollarSign, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('quizzes'); // 'analytics', 'quizzes', 'students', 'payments'
  const [stats, setStats] = useState({ totalStudents: 1420, totalQuizzes: 48, revenueLKR: 1245000, completedAttempts: 3410, averageScore: 76.4 });
  const [quizzesList, setQuizzesList] = useState([]);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizFilterStatus, setQuizFilterStatus] = useState('all');

  // Student mock data for Admin management
  const [studentsList, setStudentsList] = useState([
    { id: 'usr-01', name: 'Kasun Perera', email: 'kasun.perera@student.lk', phone: '+94 77 123 4567', examLevel: 'G.C.E. O/L', purchased: 3, completed: 2, joined: '2026-08-10', status: 'Active' },
    { id: 'usr-02', name: 'Dilani Fernando', email: 'dilani.f@gmail.com', phone: '+94 71 888 2211', examLevel: 'G.C.E. A/L (Physical)', purchased: 5, completed: 4, joined: '2026-08-12', status: 'Active' },
    { id: 'usr-03', name: 'Nisal Jayasinghe', email: 'nisal.j@yahoo.com', phone: '+94 75 444 3399', examLevel: 'Grade 5 Scholarship', purchased: 2, completed: 2, joined: '2026-08-15', status: 'Active' },
    { id: 'usr-04', name: 'Amaya Senanayake', email: 'amaya.s@outlook.com', phone: '+94 72 333 1100', examLevel: 'G.C.E. A/L (Bio)', purchased: 4, completed: 1, joined: '2026-08-18', status: 'Active' }
  ]);

  // Payment mock data
  const [paymentsList, setPaymentsList] = useState([
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
    }
    loadData();
  }, []);

  // Filter quizzes
  const filteredQuizzes = quizzesList.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(quizSearch.toLowerCase()) || q.subjectName.toLowerCase().includes(quizSearch.toLowerCase());
    if (quizFilterStatus === 'published') return matchesSearch && (q.is_published !== false);
    if (quizFilterStatus === 'draft') return matchesSearch && (q.is_published === false);
    return matchesSearch;
  });

  // Action handlers
  const handleTogglePublish = (quizId) => {
    setQuizzesList(prev => prev.map(q => q.id === quizId ? { ...q, is_published: !q.is_published } : q));
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz paper permanently?")) {
      setQuizzesList(prev => prev.filter(q => q.id !== quizId));
    }
  };

  const handleDuplicateQuiz = (quiz) => {
    const duplicated = {
      ...quiz,
      id: `quiz-dup-${Date.now()}`,
      title: `${quiz.title} (Copy)`
    };
    setQuizzesList([duplicated, ...quizzesList]);
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-main)' }}>Admin Management Portal</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Connected to Express REST Backend & MySQL Database</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/admin/create-quiz')}>
          <Plus size={18} /> Create New Quiz Paper
        </button>
      </div>

      {/* Overview Metric Cards (Responsive Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Students</div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{stats.totalStudents}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Quizzes</div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{quizzesList.length || stats.totalQuizzes}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>LKR {(stats.revenueLKR / 1000).toFixed(0)}k</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--color-warning-light)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Completed Attempts</div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{stats.completedAttempts}</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button className={`chip ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
          Quiz Management ({quizzesList.length})
        </button>
        <button className={`chip ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
          Student Management ({studentsList.length})
        </button>
        <button className={`chip ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
          Payment Dashboard ({paymentsList.length})
        </button>
        <button className={`chip ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          Overview & Analytics
        </button>
      </div>

      {/* TAB 1: QUIZ MANAGEMENT */}
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
                {filteredQuizzes.map(quiz => {
                  const isPublished = quiz.is_published !== false;
                  return (
                    <tr key={quiz.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{quiz.title}</td>
                      <td style={{ padding: '14px 16px' }}>{quiz.subjectName}</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-neutral">{quiz.examLevel ? quiz.examLevel.toUpperCase() : 'OL'}</span></td>
                      <td style={{ padding: '14px 16px' }}>{quiz.questionCount || 30} Qs</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>LKR {quiz.price}</td>
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
                          <button className="btn btn-outline btn-sm" title="Duplicate" onClick={() => handleDuplicateQuiz(quiz)}>
                            <Copy size={14} />
                          </button>
                          <button className="btn btn-outline btn-sm" title="Delete" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteQuiz(quiz.id)}>
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

      {/* TAB 2: STUDENT MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Registered Student Roster</h3>
            <span className="badge badge-primary">{studentsList.length} Active Students</span>
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
                {studentsList.map(st => (
                  <tr key={st.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{st.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{st.email}<br />{st.phone}</td>
                    <td style={{ padding: '14px 16px' }}><span className="badge badge-neutral">{st.examLevel}</span></td>
                    <td style={{ padding: '14px 16px' }}>{st.purchased} Quizzes</td>
                    <td style={{ padding: '14px 16px' }}>{st.joined}</td>
                    <td style={{ padding: '14px 16px' }}><span className="badge badge-success">{st.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT DASHBOARD */}
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
                {paymentsList.map(pay => (
                  <tr key={pay.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{pay.id}</td>
                    <td style={{ padding: '14px 16px' }}>{pay.student}</td>
                    <td style={{ padding: '14px 16px' }}>{pay.quizTitle}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>LKR {pay.amount}</td>
                    <td style={{ padding: '14px 16px' }}>{pay.gateway}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${pay.status === 'Successful' ? 'badge-success' : 'badge-warning'}`}>{pay.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OVERVIEW & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
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
        </div>
      )}
    </div>
  );
}
