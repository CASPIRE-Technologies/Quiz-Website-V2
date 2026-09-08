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
  GraduationCap,
  Home,
  PlayCircle,
  Phone,
  Check
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, isSinhala } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const navLinks = [
    { id: "home", label: "Home", labelSi: "මුල් පිටුව", icon: Home },
    { id: "features", label: "Features", labelSi: "විශේෂාංග", icon: Sparkles },
    { id: "plans", label: "Plans", labelSi: "මිල ගණන්", icon: Layers },
    { id: "about", label: "About", labelSi: "අප ගැන", icon: GraduationCap },
    { id: "previews", label: "Previews", labelSi: "පෙරදසුන", icon: PlayCircle },
    { id: "contact", label: "Contact", labelSi: "සම්බන්ධ වන්න", icon: Phone },
  ];

  // Detect scroll for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  // Smooth scroll handler with mobile drawer closure
  const scrollToSection = (e, sectionId) => {
    if (e && e.preventDefault) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(sectionId);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      // Dynamic header offset depending on screen size
      const headerOffset = window.innerWidth <= 640 ? 66 : window.innerWidth <= 1024 ? 72 : 78;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      navigate(`/#${sectionId}`);
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
          transition: "all 0.25s ease",
          backgroundColor: isDark
            ? isScrolled
              ? "rgba(11, 15, 25, 0.96)"
              : "rgba(11, 15, 25, 0.88)"
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
        <div className="landing-header-inner">
          {/* ── Brand Logo ── */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "home")}
            className="brand-logo-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "inherit",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            <div
              className="logo-icon-box"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "11px",
                background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "16px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
                transition: "transform 0.25s ease",
              }}
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
                  fontSize: "18px",
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
                  className="brand-pill"
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: "5px",
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
                className="brand-subtitle"
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

          {/* ── Desktop Navigation Menu Pills (Hidden on Tablet & Mobile) ── */}
          <nav
            className="landing-nav-desktop"
            style={{
              alignItems: "center",
              gap: "2px",
              padding: "4px 6px",
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
                    padding: "7px 14px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontSize: "13.5px",
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
                    gap: "5px",
                    whiteSpace: "nowrap",
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
              gap: "8px",
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
                  gap: "4px",
                  height: "36px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.03)",
                  color: isDark ? "#F1F5F9" : "#334155",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="action-btn-hover"
                title="Change Language"
              >
                <Globe size={15} color={isDark ? "#38BDF8" : "#0284C7"} />
                <span>{language === "si" ? "සිං" : "EN"}</span>
                <ChevronDown size={13} style={{ opacity: 0.6 }} />
              </button>

              {langDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    width: "140px",
                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                    borderRadius: "12px",
                    padding: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                    zIndex: 10001,
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
                    {language === "en" && <Check size={14} />}
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
                    {language === "si" && <Check size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
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
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Desktop Auth CTAs (Hidden on Mobile, simplified on Tablet) */}
            <div className="landing-header-auth-desktop">
              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary-shimmer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    height: "38px",
                    padding: "0 16px",
                    borderRadius: "11px",
                    border: "none",
                    background: "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <User size={15} />
                  <span>Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Link
                    to="/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      height: "38px",
                      padding: "0 14px",
                      borderRadius: "9px",
                      textDecoration: "none",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: isDark ? "#E2E8F0" : "#334155",
                      background: "transparent",
                      transition: "color 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    className="login-nav-link"
                  >
                    <LogIn size={15} />
                    <span>{isSinhala ? "ඇතුල් වන්න" : "Sign In"}</span>
                  </Link>

                  <Link
                    to="/login"
                    state={{ isSignUp: true }}
                    className="btn-primary-shimmer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      height: "38px",
                      padding: "0 16px",
                      borderRadius: "11px",
                      textDecoration: "none",
                      background: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{isSinhala ? "ලියාපදිංචි වන්න" : "Get Started"}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Tablet/Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="landing-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.1)",
                background: mobileMenuOpen 
                  ? (isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 132, 199, 0.1)")
                  : (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)"),
                color: mobileMenuOpen ? "#0284C7" : (isDark ? "#F8FAFC" : "#0F172A"),
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile/Tablet Backdrop Overlay ── */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              top: "100%",
              left: 0,
              right: 0,
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
              animation: "overlayFadeIn 0.25s ease",
            }}
          />
        )}

        {/* ── Mobile & Tablet Slide-Down Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div
            className="landing-mobile-drawer"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
              borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 25px 40px -10px rgba(0, 0, 0, 0.45)",
              padding: "18px 20px 24px",
              maxHeight: "calc(100vh - 76px)",
              overflowY: "auto",
              zIndex: 9999,
              animation: "drawerSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Quick Section Links Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "18px" }}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                const IconComp = item.icon;
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
                      border: isActive
                        ? isDark ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid rgba(2, 132, 199, 0.15)"
                        : "1px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: isActive
                            ? "rgba(2, 132, 199, 0.15)"
                            : isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isActive ? "#0284C7" : isDark ? "#94A3B8" : "#64748B",
                        }}
                      >
                        <IconComp size={16} />
                      </div>
                      <span>{isSinhala ? item.labelSi : item.label}</span>
                    </div>

                    {isActive ? (
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          backgroundColor: "#0284C7",
                          boxShadow: "0 0 8px #38BDF8",
                        }}
                      />
                    ) : (
                      <ArrowRight size={15} style={{ opacity: 0.35 }} />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile/Tablet Controls: Language & Theme quick toggle bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "14px",
                background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.03)",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.05)",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#94A3B8" : "#64748B" }}>
                  {isSinhala ? "භාෂාව:" : "Language:"}
                </span>
                <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    style={{
                      padding: "4px 10px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      backgroundColor: language === "en" ? "#0284C7" : "transparent",
                      color: language === "en" ? "#FFFFFF" : isDark ? "#CBD5E1" : "#475569",
                    }}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("si")}
                    style={{
                      padding: "4px 10px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      backgroundColor: language === "si" ? "#0284C7" : "transparent",
                      color: language === "si" ? "#FFFFFF" : isDark ? "#CBD5E1" : "#475569",
                    }}
                  >
                    සිංහල
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#94A3B8" : "#64748B" }}>
                  {isDark ? (isSinhala ? "අඳුරු" : "Dark") : (isSinhala ? "දීප්තිමත්" : "Light")}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                    background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.05)",
                    color: isDark ? "#F59E0B" : "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Toggle Theme"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Auth Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
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
                    boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
                  }}
                >
                  <User size={18} />
                  <span>Go to Student Dashboard</span>
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
                      fontSize: "14.5px",
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
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
        .landing-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 76px;
          padding: 0 24px;
          display: flex;
          alignItems: center;
          justifyContent: space-between;
          gap: 16px;
          transition: height 0.2s ease, padding 0.2s ease;
        }

        .landing-nav-desktop {
          display: flex;
        }

        .landing-header-auth-desktop {
          display: flex;
        }

        .landing-hamburger-btn {
          display: none;
        }

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

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes drawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
          transform: translateY(-1.5px);
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.55) !important;
        }

        .nav-pill-item:not(.active):hover {
          color: #0284C7 !important;
          background-color: rgba(2, 132, 199, 0.06) !important;
        }

        .login-nav-link:hover {
          color: #0284C7 !important;
        }

        /* Tablet Responsive Breakpoint (768px - 1080px) */
        @media (max-width: 1080px) {
          .landing-header-inner {
            height: 70px;
            padding: 0 20px;
          }
          .landing-nav-desktop {
            display: none !important;
          }
          .landing-hamburger-btn {
            display: flex !important;
          }
        }

        /* Mobile Responsive Breakpoint (<= 640px) */
        @media (max-width: 640px) {
          .landing-header-inner {
            height: 64px;
            padding: 0 14px;
            gap: 8px;
          }
          .landing-header-auth-desktop {
            display: none !important;
          }
          .brand-subtitle {
            display: none !important;
          }
          .brand-pill {
            display: none !important;
          }
          .landing-hamburger-btn {
            display: flex !important;
          }
        }

        /* Extra small devices (<= 380px) */
        @media (max-width: 380px) {
          .landing-header-inner {
            padding: 0 10px;
          }
          .logo-icon-box {
            width: 34px !important;
            height: 34px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </>
  );
}
