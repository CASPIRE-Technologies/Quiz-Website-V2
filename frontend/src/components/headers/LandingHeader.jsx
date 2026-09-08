import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ArrowRight,
  LogIn,
  User,
  CheckCircle2,
  ChevronDown,
  Layers,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t, isSinhala } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const navLinks = [
    { id: "home", label: "Home", labelSi: "මුල් පිටුව" },
    { id: "features", label: "Features", labelSi: "විශේෂාංග" },
    { id: "plans", label: "Plans", labelSi: "මිල ගණන්" },
    { id: "about", label: "About", labelSi: "අප ගැන" },
    { id: "previews", label: "Previews", labelSi: "පෙරදසුන" },
    { id: "contact", label: "Contact", labelSi: "සම්බන්ධ වන්න" },
  ];

  // Detect scroll for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // IntersectionObserver to detect active section in viewport
  useEffect(() => {
    const sectionIds = ["home", "features", "plans", "about", "previews", "contact"];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { rootMargin: "-30% 0px -50% 0px" }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Smooth scroll handler
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(sectionId);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const headerHeight = 76;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`landing-header ${isScrolled ? "is-scrolled" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 9999,
          transition: "background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          backgroundColor: isDark
            ? isScrolled
              ? "rgba(11, 15, 25, 0.95)"
              : "rgba(11, 15, 25, 0.85)"
            : isScrolled
              ? "rgba(255, 255, 255, 0.96)"
              : "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isDark
            ? isScrolled
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.06)"
            : isScrolled
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: isDark
            ? isScrolled
              ? "0 10px 30px -10px rgba(0, 0, 0, 0.7)"
              : "0 4px 20px rgba(0, 0, 0, 0.3)"
            : isScrolled
              ? "0 10px 30px -10px rgba(15, 23, 42, 0.1)"
              : "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "76px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* ── Brand Logo ── */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "home")}
            className="brand-logo-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "inherit",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "17px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              className="logo-icon-box"
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                  animation: "shineLight 3s infinite",
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>EQ</span>
            </div>

            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: isDark ? "#F8FAFC" : "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Edu Pulse</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "rgba(56, 189, 248, 0.15)",
                    color: "#0284C7",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sri Lanka
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: isDark ? "#94A3B8" : "#64748B",
                  letterSpacing: "0.2px",
                }}
              >
                Smart Exam Preparation
              </div>
            </div>
          </a>

          {/* ── Desktop Navigation Menu Pills ── */}
          <nav
            className="landing-nav-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              borderRadius: "999px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`nav-pill-item ${isActive ? "active" : ""}`}
                  style={{
                    position: "relative",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? isDark
                        ? "#38BDF8"
                        : "#0284C7"
                      : isDark
                        ? "#94A3B8"
                        : "#64748B",
                    backgroundColor: isActive
                      ? isDark
                        ? "rgba(56, 189, 248, 0.12)"
                        : "rgba(2, 132, 199, 0.1)"
                      : "transparent",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{isSinhala ? item.labelSi : item.label}</span>
                  {isActive && (
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: "#0284C7",
                        boxShadow: "0 0 8px #38BDF8",
                        display: "inline-block",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ── Right Actions: Language, Theme & Auth ── */}
          <div
            className="landing-header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Language Switcher Dropdown */}
            <div style={{ position: "relative" }} ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.03)",
                  color: isDark ? "#F1F5F9" : "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="action-btn-hover"
                title="Change Language"
              >
                <Globe size={16} color={isDark ? "#38BDF8" : "#0284C7"} />
                <span>{language === "si" ? "සිං" : "EN"}</span>
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
              </button>

              {langDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "140px",
                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                    borderRadius: "12px",
                    padding: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                    zIndex: 100,
                    animation: "dropdownFadeIn 0.2s ease",
                  }}
                >
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: language === "en" ? (isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 132, 199, 0.1)") : "transparent",
                      color: language === "en" ? (isDark ? "#38BDF8" : "#0284C7") : isDark ? "#E2E8F0" : "#334155",
                      fontWeight: language === "en" ? 700 : 500,
                      fontSize: "13px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>English (EN)</span>
                    {language === "en" && <CheckCircle2 size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("si");
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: language === "si" ? (isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 132, 199, 0.1)") : "transparent",
                      color: language === "si" ? (isDark ? "#38BDF8" : "#0284C7") : isDark ? "#E2E8F0" : "#334155",
                      fontWeight: language === "si" ? 700 : 500,
                      fontSize: "13px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>සිංහල (SI)</span>
                    {language === "si" && <CheckCircle2 size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.03)",
                color: isDark ? "#F59E0B" : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              className="action-btn-hover"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Auth CTAs */}
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary-shimmer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <User size={16} />
                <span>Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isDark ? "#E2E8F0" : "#334155",
                    background: "transparent",
                    transition: "color 0.2s ease",
                  }}
                  className="login-nav-link"
                >
                  <LogIn size={16} />
                  <span>{isSinhala ? "ඇතුල් වන්න" : "Sign In"}</span>
                </Link>

                <Link
                  to="/login"
                  state={{ isSignUp: true }}
                  className="btn-primary-shimmer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "40px",
                    padding: "0 18px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "14px",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <Sparkles size={15} />
                  <span>{isSinhala ? "ලියාපදිංචි වන්න" : "Get Started"}</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              className="landing-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.03)",
                color: isDark ? "#F8FAFC" : "#0F172A",
                cursor: "pointer",
              }}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div
            className="landing-mobile-drawer"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              padding: "20px 24px 28px",
              animation: "drawerSlideDown 0.25s ease-out",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? "#0284C7" : isDark ? "#E2E8F0" : "#334155",
                      backgroundColor: isActive
                        ? isDark
                          ? "rgba(56, 189, 248, 0.12)"
                          : "rgba(2, 132, 199, 0.08)"
                        : "transparent",
                    }}
                  >
                    <span>{isSinhala ? item.labelSi : item.label}</span>
                    {isActive ? (
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#0284C7",
                        }}
                      />
                    ) : (
                      <ArrowRight size={14} style={{ opacity: 0.4 }} />
                    )}
                  </a>
                );
              })}
            </div>

            <div
              style={{
                paddingTop: "16px",
                borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  style={{
                    width: "100%",
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  <User size={18} />
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      width: "100%",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.15)",
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    <LogIn size={16} />
                    <span>{isSinhala ? "ඇතුල් වන්න" : "Sign In to Account"}</span>
                  </Link>

                  <Link
                    to="/login"
                    state={{ isSignUp: true }}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      width: "100%",
                      height: "46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "15px",
                      boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{isSinhala ? "නොමිලේ ලියාපදිංචි වන්න" : "Get Started Free"}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Embedded Animations and Responsive Styles */}
      <style>{`
        @keyframes shineLight {
          0% { transform: translateX(-100%) rotate(45deg); }
          20% { transform: translateX(100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .action-btn-hover:hover {
          transform: translateY(-1px);
          border-color: rgba(56, 189, 248, 0.4) !important;
        }

        .brand-logo-link:hover .logo-icon-box {
          transform: scale(1.05);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5) !important;
        }

        .btn-primary-shimmer:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.55) !important;
        }

        .nav-pill-item:not(.active):hover {
          color: #0284C7 !important;
          background-color: rgba(2, 132, 199, 0.06) !important;
        }

        .login-nav-link:hover {
          color: #0284C7 !important;
        }

        @media (max-width: 960px) {
          .landing-nav-desktop {
            display: none !important;
          }
          .landing-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
