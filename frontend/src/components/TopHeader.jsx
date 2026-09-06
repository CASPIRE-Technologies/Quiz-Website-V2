import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, Award, User, LogOut, LogIn, ShieldCheck, Menu, X, ChevronDown, BookMarked, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const NAV_HEIGHT = 64;

const navItemDefs = [
  { path: '/dashboard', labelKey: 'nav.dashboard', fallback: 'Dashboard', icon: Home },
  { path: '/quizzes', labelKey: 'nav.quizzes', fallback: 'Browse Quizzes', icon: Search },
  { path: '/resources', labelKey: 'nav.resources', fallback: 'Resources', icon: BookMarked },
  { path: '/my-quizzes', labelKey: 'nav.myQuizzes', fallback: 'My Quizzes', icon: BookOpen },
  { path: '/results-history', labelKey: 'nav.performance', fallback: 'My Performance', icon: Award },
  { path: '/profile', labelKey: 'nav.profile', fallback: 'Student Profile', icon: User },
  { path: '/admin', labelKey: 'nav.admin', fallback: 'Admin Portal', icon: ShieldCheck },
];

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const isCurrent = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/resources') {
      return location.pathname.startsWith('/resources') || location.pathname.startsWith('/education-resources');
    }
    if (path === '/results-history') {
      return location.pathname.startsWith('/results') || location.pathname.startsWith('/my-performance');
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    logoutUser();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
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
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-text-main)', letterSpacing: '-0.3px' }}>{t('app.name')}</div>
              <div style={{ fontSize: '10px', color: 'var(--color-secondary)', fontWeight: 600, letterSpacing: '0.3px' }}>{t('app.subtitle')}</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="topnav-divider" style={{ width: '1px', height: '28px', backgroundColor: 'var(--color-border)', margin: '0 6px' }} />

          {/* ── Center: Nav Links (desktop) ── */}
          <div className="topnav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navItemDefs.map((item) => {
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
                  <span>{t(item.labelKey, item.fallback)}</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? t('theme.light') : t('theme.dark')}
            aria-label={t('theme.toggle')}
            style={{ width: '38px', padding: 0 }}
          >
            <span className="theme-toggle-icon">
              {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#64748B" />}
            </span>
          </button>

          {/* Language selector */}
          <div ref={langDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="lang-toggle-btn"
              title={t('language.select')}
              aria-label={t('language.select')}
            >
              <Globe size={15} color="var(--color-text-muted)" />
              <span className="lang-badge">{language === 'si' ? 'සිං' : 'EN'}</span>
              <ChevronDown size={13} color="var(--color-text-muted)" />
            </button>
            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                backgroundColor: 'var(--color-card-bg)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                minWidth: '130px',
                padding: '4px',
                zIndex: 350,
                animation: 'dropdownFadeIn 0.15s ease-out',
              }}>
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: language === 'en' ? 700 : 500,
                    color: language === 'en' ? 'var(--color-primary)' : 'var(--color-text-main)',
                    backgroundColor: language === 'en' ? 'var(--color-primary-light)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>English</span>
                  {language === 'en' && <span style={{ fontSize: '11px', fontWeight: 700 }}>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('si'); setLangDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: language === 'si' ? 700 : 500,
                    color: language === 'si' ? 'var(--color-primary)' : 'var(--color-text-main)',
                    backgroundColor: language === 'si' ? 'var(--color-primary-light)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>සිංහල</span>
                  {language === 'si' && <span style={{ fontSize: '11px', fontWeight: 700 }}>✓</span>}
                </button>
              </div>
            )}
          </div>

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
                    <User size={15} /> {t('nav.profile')}
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
                    <ShieldCheck size={15} /> {t('nav.admin')}
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
                    <LogOut size={15} /> {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              <LogIn size={16} /> {t('nav.signIn')}
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
              {t('nav.navigation')}
            </div>

            {/* Nav items */}
            {navItemDefs.map((item) => {
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
                  <span>{t(item.labelKey, item.fallback)}</span>
                </Link>
              );
            })}

            {/* Theme & Language Drawer Controls */}
            <div style={{ padding: '14px 12px', marginTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('theme.toggle')}</span>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}
                >
                  {isDark ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#64748B" />}
                  <span>{isDark ? t('theme.light') : t('theme.dark')}</span>
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('language.select')}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('si')}
                    className={`btn btn-sm ${language === 'si' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    සිංහල
                  </button>
                </div>
              </div>
            </div>

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
                  <LogOut size={18} /> {t('nav.signOut')}
                </button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="btn btn-primary btn-block">
                  <LogIn size={18} /> {t('nav.signIn')}
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
