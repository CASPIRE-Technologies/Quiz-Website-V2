import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, Award, User, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const isCurrent = (path) => location.pathname === path;

  return (
    <aside class="desktop-sidebar">
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

        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '8px 12px', marginTop: '16px' }}>Management</div>
        <Link to="/admin" className={`nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
          <ShieldAlert size={18} /> <span>Admin Portal</span>
        </Link>
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)' }}>
        <button onClick={() => { logoutUser(); navigate('/login'); }} className="nav-item" style={{ color: 'var(--color-error)', width: '100%' }}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
