import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, Award, User, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const isCurrent = (path) => location.pathname.startsWith(path);

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">EQ</div>
        <div>
          <div className="logo-title" style={{ fontSize: '18px', fontWeight: 700 }}>EduQuiz Pro</div>
          <div className="logo-subtitle" style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600 }}>Paid Examination Platform</div>
        </div>
      </div>

      <div className="sidebar-nav">
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '8px 12px' }}>Main Menu</div>
        
        <Link to="/dashboard" className={`nav-item ${isCurrent('/dashboard') ? 'active' : ''}`}>
          <Home size={18} /> <span>Dashboard</span>
        </Link>
        <Link to="/quizzes" className={`nav-item ${isCurrent('/quizzes') ? 'active' : ''}`}>
          <Search size={18} /> <span>Browse Quizzes</span>
        </Link>
        <Link to="/my-quizzes" className={`nav-item ${isCurrent('/my-quizzes') ? 'active' : ''}`}>
          <BookOpen size={18} /> <span>My Quizzes</span>
        </Link>
        <Link to="/results-history" className={`nav-item ${isCurrent('/results-history') ? 'active' : ''}`}>
          <Award size={18} /> <span>Results & Performance</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isCurrent('/profile') ? 'active' : ''}`}>
          <User size={18} /> <span>Student Profile</span>
        </Link>
        <Link to="/admin" className={`nav-item ${isCurrent('/admin') ? 'active' : ''}`} style={{ marginTop: '8px', color: user?.role === 'admin' ? 'var(--color-primary)' : undefined }}>
          <ShieldCheck size={18} /> <span>Admin Portal</span>
        </Link>
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)' }}>
        {user ? (
          <button onClick={() => { logoutUser(); navigate('/login'); }} className="nav-item" style={{ color: 'var(--color-error)', width: '100%', cursor: 'pointer' }}>
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-block">
            <LogIn size={18} /> <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
}
