import React, { useState } from 'react';
import { Search, Bell, Menu, X, Home, BookOpen, Award, User, LogOut, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopHeader() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/quizzes?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="icon-btn"
            style={{ display: 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div className="logo-badge" style={{ width: '32px', height: '32px', fontSize: '16px' }}>EQ</div>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-text-main)' }}>EduQuiz Pro</span>
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '10px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '8px 16px', borderRadius: '9999px', width: '320px' }} className="header-search-wrap">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search quizzes, subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Bell size={20} color="var(--color-text-muted)" />
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: 'var(--color-error)', borderRadius: '50%', border: '2px solid white' }}></span>
              </button>

              <div style={{ position: 'relative' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px 4px 4px', borderRadius: '9999px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>{user.name}</span>
                </div>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      backgroundColor: 'white',
                      borderRadius: '14px',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-border)',
                      width: '200px',
                      padding: '8px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                      style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--color-text-main)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <User size={16} /> Student Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--color-error)', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile Slide Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 100,
            display: 'flex'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '280px',
              backgroundColor: 'white',
              height: '100%',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div className="logo-badge" style={{ width: '32px', height: '32px', fontSize: '16px' }}>EQ</div>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>EduQuiz Pro</span>
            </div>

            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-item">
              <Home size={18} /> <span>Dashboard</span>
            </Link>
            <Link to="/quizzes" onClick={() => setMobileMenuOpen(false)} className="nav-item">
              <Search size={18} /> <span>Browse Quizzes</span>
            </Link>
            <Link to="/my-quizzes" onClick={() => setMobileMenuOpen(false)} className="nav-item">
              <BookOpen size={18} /> <span>My Quizzes</span>
            </Link>
            <Link to="/results-history" onClick={() => setMobileMenuOpen(false)} className="nav-item">
              <Award size={18} /> <span>Results & Performance</span>
            </Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-item">
              <User size={18} /> <span>Student Profile</span>
            </Link>

            {user ? (
              <button onClick={() => { logoutUser(); setMobileMenuOpen(false); navigate('/login'); }} className="nav-item" style={{ color: 'var(--color-error)', marginTop: 'auto', width: '100%' }}>
                <LogOut size={18} /> <span>Sign Out</span>
              </button>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="btn btn-primary btn-block" style={{ marginTop: 'auto' }}>
                <LogIn size={18} /> <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
