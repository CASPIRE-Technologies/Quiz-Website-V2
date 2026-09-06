import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  Award,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  BookMarked,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const NAV_HEIGHT = 70;

const navItemDefs = [
  {
    path: "/dashboard",
    labelKey: "nav.dashboard",
    fallback: "Dashboard",
    icon: Home,
  },
  {
    path: "/quizzes",
    labelKey: "nav.quizzes",
    fallback: "Browse Quizzes",
    icon: Search,
  },
  {
    path: "/resources",
    labelKey: "nav.resources",
    fallback: "Resources",
    icon: BookMarked,
  },
  {
    path: "/my-quizzes",
    labelKey: "nav.myQuizzes",
    fallback: "My Quizzes",
    icon: BookOpen,
  },
  {
    path: "/results-history",
    labelKey: "nav.performance",
    fallback: "My Performance",
    icon: Award,
  },
  {
    path: "/profile",
    labelKey: "nav.profile",
    fallback: "Student Profile",
    icon: User,
  },
  {
    path: "/admin",
    labelKey: "nav.admin",
    fallback: "Admin Portal",
    icon: ShieldCheck,
  },
];

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const isCurrent = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/resources") {
      return (
        location.pathname.startsWith("/resources") ||
        location.pathname.startsWith("/education-resources")
      );
    }
    if (path === "/results-history") {
      return (
        location.pathname.startsWith("/results") ||
        location.pathname.startsWith("/my-performance")
      );
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    logoutUser();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          FIXED TOP NAVIGATION BAR
          ═══════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${NAV_HEIGHT}px`,
          backgroundColor: "var(--color-card-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 200,
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* ── Left Section: Hamburger + Brand ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexShrink: 0,
          }}
        >
          <button
            className="topnav-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              color: "var(--color-text-main)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              className="logo-badge"
              style={{
                width: "38px",
                height: "38px",
                fontSize: "15px",
                fontWeight: 800,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              EQ
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "var(--color-text-main)",
                  letterSpacing: "-0.3px",
                }}
              >
                {t("app.name")}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--color-secondary)",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                }}
              >
                {t("app.subtitle")}
              </div>
            </div>
          </Link>

          <div
            className="topnav-divider"
            style={{
              width: "1px",
              height: "28px",
              backgroundColor: "var(--color-border)",
              margin: "0 4px",
            }}
          />
        </div>

        {/* ── Center Section: Desktop Links ── */}
        <div
          className="topnav-links-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "100%",
          }}
        >
          {navItemDefs.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`topnav-link ${active ? "topnav-link-active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  textDecoration: "none",
                  position: "relative",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  backgroundColor: active
                    ? "var(--color-primary-light)"
                    : "transparent",
                }}
              >
                <Icon size={16} />
                <span>{t(item.labelKey, item.fallback)}</span>
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "18px",
                      height: "3px",
                      borderRadius: "3px",
                      background: "var(--color-primary)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right Section: Controls ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? t("theme.light") : t("theme.dark")}
            aria-label={t("theme.toggle")}
            style={{
              width: "38px",
              height: "38px",
              padding: 0,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              cursor: "pointer",
            }}
          >
            {isDark ? (
              <Sun size={18} color="#FBBF24" />
            ) : (
              <Moon size={18} color="#64748B" />
            )}
          </button>

          {/* Language selector */}
          <div ref={langDropdownRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="lang-toggle-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text-main)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Globe size={15} color="var(--color-text-muted)" />
              <span>{language === "si" ? "සිං" : "EN"}</span>
              <ChevronDown size={13} color="var(--color-text-muted)" />
            </button>

            {langDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  backgroundColor: "var(--color-card-bg)",
                  borderRadius: "14px",
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--color-border)",
                  minWidth: "130px",
                  padding: "6px",
                  zIndex: 350,
                  animation: "dropdownFadeIn 0.15s ease-out",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("en");
                    setLangDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    fontWeight: language === "en" ? 700 : 500,
                    color:
                      language === "en"
                        ? "var(--color-primary)"
                        : "var(--color-text-main)",
                    backgroundColor:
                      language === "en"
                        ? "var(--color-primary-light)"
                        : "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <span>English</span>
                  {language === "en" && <span>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("si");
                    setLangDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    fontWeight: language === "si" ? 700 : 500,
                    color:
                      language === "si"
                        ? "var(--color-primary)"
                        : "var(--color-text-main)",
                    backgroundColor:
                      language === "si"
                        ? "var(--color-primary-light)"
                        : "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <span>සිංහල</span>
                  {language === "si" && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Account Menu */}
          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="topnav-user-pill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 12px 4px 4px",
                  borderRadius: "9999px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card-bg)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span
                  className="topnav-user-name"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text-main)",
                  }}
                >
                  {user.name || "User"}
                </span>
                <ChevronDown
                  size={14}
                  color="var(--color-text-muted)"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: userDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    backgroundColor: "var(--color-card-bg)",
                    borderRadius: "16px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    border: "1px solid var(--color-border)",
                    width: "220px",
                    padding: "6px",
                    zIndex: 300,
                    animation: "dropdownFadeIn 0.15s ease-out",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--color-border)",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "var(--color-text-main)",
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="topnav-dropdown-item"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--color-text-main)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <User size={15} /> {t("nav.profile")}
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate("/admin");
                    }}
                    className="topnav-dropdown-item"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--color-text-main)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <ShieldCheck size={15} /> {t("nav.admin")}
                  </button>

                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "var(--color-border)",
                      margin: "4px 0",
                    }}
                  />

                  <button
                    onClick={handleSignOut}
                    className="topnav-dropdown-item"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-error)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <LogOut size={15} /> {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/login")}
            >
              <LogIn size={16} /> {t("nav.signIn")}
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
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 250,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "300px",
              maxWidth: "85vw",
              height: "100%",
              backgroundColor: "var(--color-card-bg)",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              overflowY: "auto",
              boxShadow: "8px 0 32px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                paddingBottom: "14px",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <Link
                to="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                }}
              >
                <div
                  className="logo-badge"
                  style={{ width: "34px", height: "34px", fontSize: "14px" }}
                >
                  EQ
                </div>
                <span
                  className="logo-text"
                  style={{
                    fontWeight: 800,
                    fontSize: "16px",
                    color: "var(--color-text-main)",
                  }}
                >
                  EduQuiz Pro
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-main)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {navItemDefs.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: active ? 700 : 500,
                    color: active
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                    backgroundColor: active
                      ? "var(--color-primary-light)"
                      : "transparent",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={18} />
                  <span>{t(item.labelKey, item.fallback)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SCOPED STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        .topnav-link:hover {
          background-color: var(--color-primary-extra-light) !important;
          color: var(--color-primary) !important;
        }

        .topnav-user-pill:hover {
          border-color: var(--color-primary-border) !important;
        }

        .topnav-dropdown-item:hover {
          background-color: var(--color-bg) !important;
        }

        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .topnav-hamburger { display: none !important; }
        .topnav-links-desktop {
          display: flex !important;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .topnav-links-desktop::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 1200px) {
          .topnav-user-name { display: none !important; }
        }

        @media (max-width: 900px) {
          .topnav-divider { display: none !important; }
          .topnav-links-desktop .topnav-link {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 600px) {
          .topnav-hamburger { display: flex !important; }
          .topnav-links-desktop { display: none !important; }
          .topnav-divider { display: none !important; }
          .logo-badge {
            display: none !important;
          }
          .logo-text {
            display: nones !important;
          }
        }
      `}</style>
    </>
  );
}
