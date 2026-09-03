import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, Award, User, LogOut, LogIn, ShieldCheck, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_HEIGHT = 64;

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/quizzes', label: 'Browse Quizzes', icon: Search },
  { path: '/my-quizzes', label: 'My Quizzes', icon: BookOpen },
  { path: '/results-history', label: 'Results & Performance', icon: Award },
  { path: '/profile', label: 'Student Profile', icon: User },
  { path: '/admin', label: 'Admin Portal', icon: ShieldCheck },
];

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isCurrent = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    logoutUser();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          FIXED TOP NAVIGATION BAR
          ═══════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${NAV_HEIGHT}px`,
        backgroundColor: 'var(--color-card-bg)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 200,
        boxShadow: '0 1px 8px rgba(15, 23, 42, 0.06)',
      }}>

        {/* ── Left section: Hamburger + Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile hamburger */}
          <button
            className="topnav-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div className="logo-badge" style={{ width: '36px', height: '36px', fontSize: '15px', flexShrink: 0 }}>EQ</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-text-main)', letterSpacing: '-0.3px' }}>EduQuiz Pro</div>
              <div style={{ fontSize: '10px', color: 'var(--color-secondary)', fontWeight: 600, letterSpacing: '0.3px' }}>Paid Examination Platform</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="topnav-divider" style={{ width: '1px', height: '28px', backgroundColor: 'var(--color-border)', margin: '0 6px' }} />

          {/* ── Center: Nav Links (desktop) ── */}
          <div className="topnav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`topnav-link ${active ? 'topnav-link-active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {/* Active indicator bar */}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '24px',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right section: User controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              {/* User pill button */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="topnav-user-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="topnav-user-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {user.name || 'User'}
                </span>
                <ChevronDown
                  size={14}
                  color="var(--color-text-muted)"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Dropdown menu */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  backgroundColor: 'var(--color-card-bg)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08)',
                  border: '1px solid var(--color-border)',
                  width: '220px',
                  padding: '6px',
                  zIndex: 300,
                  animation: 'dropdownFadeIn 0.15s ease-out',
                }}>
                  {/* User info header */}
                  <div style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '4px',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{user.email}</div>
                  </div>

                  {/* Profile link */}
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                    className="topnav-dropdown-item"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-text-main)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                      transition: 'background-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <User size={15} /> Student Profile
                  </button>

                  {/* Admin link */}
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate('/admin'); }}
                    className="topnav-dropdown-item"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-text-main)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                      transition: 'background-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <ShieldCheck size={15} /> Admin Portal
                  </button>

                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

                  {/* Sign out */}
                  <button
                    onClick={handleSignOut}
                    className="topnav-dropdown-item"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-error)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                      transition: 'background-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          MOBILE SLIDE-IN DRAWER
          ═══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 250,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '300px',
              maxWidth: '85vw',
              height: '100%',
              backgroundColor: 'var(--color-card-bg)',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflowY: 'auto',
              boxShadow: '8px 0 32px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div className="logo-badge" style={{ width: '34px', height: '34px', fontSize: '14px' }}>EQ</div>
                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-text-main)' }}>EduQuiz Pro</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* User info in drawer */}
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>{user.name || 'User'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
              </div>
            )}

            {/* Nav section label */}
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '8px 12px', letterSpacing: '0.5px' }}>
              Navigation
            </div>

            {/* Nav items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Sign out at bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              {user ? (
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-error)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="btn btn-primary btn-block">
                  <LogIn size={18} /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SCOPED STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* Nav link hover effect */
        .topnav-link:hover {
          background-color: var(--color-bg) !important;
          color: var(--color-primary) !important;
        }

        /* User pill hover */
        .topnav-user-pill:hover {
          border-color: var(--color-primary-border) !important;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }

        /* Dropdown item hover */
        .topnav-dropdown-item:hover {
          background-color: var(--color-bg) !important;
        }

        /* Dropdown animation */
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Always show nav links — scrollable on all sizes */
        .topnav-hamburger { display: none !important; }
        .topnav-links-desktop {
          display: flex !important;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }
        .topnav-links-desktop::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .topnav-divider { display: block !important; }

        /* Tablet: hide username text from pill */
        @media (max-width: 1200px) {
          .topnav-user-name { display: none !important; }
        }

        /* Smaller screens: shrink padding on nav links */
        @media (max-width: 900px) {
          .topnav-divider { display: none !important; }
          .topnav-links-desktop .topnav-link {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
