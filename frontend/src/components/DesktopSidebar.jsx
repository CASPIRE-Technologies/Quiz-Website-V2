import React from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { t } = useLanguage();

  const isCurrent = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className="desktop-sidebar"
      style={{
        position: "fixed",
        zIndex: 999,
        background: "#ffff",
        top: 0,
        bottom: 0,
        margin: "auto",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0)",
        borderRadius: "16px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        // border: "1px solid rgba(255, 255, 255, 1)",
      }}
    >
      <div className="sidebar-header">
        <div className="logo-badge">EQ</div>
        <div>
          <div
            className="logo-title"
            style={{ fontSize: "18px", fontWeight: 700 }}
          >
            {t("app.name")}
          </div>
          <div
            className="logo-subtitle"
            style={{
              fontSize: "11px",
              color: "var(--color-secondary)",
              fontWeight: 600,
            }}
          >
            {t("app.subtitle")}
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
            padding: "8px 12px",
          }}
        >
          {t("nav.navigation")}
        </div>

        <Link
          to="/dashboard"
          className={`nav-item ${isCurrent("/dashboard") ? "active" : ""}`}
        >
          <Home size={18} /> <span>{t("nav.dashboard")}</span>
        </Link>
        <Link
          to="/quizzes"
          className={`nav-item ${isCurrent("/quizzes") ? "active" : ""}`}
        >
          <Search size={18} /> <span>{t("nav.quizzes")}</span>
        </Link>
        <Link
          to="/resources"
          className={`nav-item ${isCurrent("/resources") ? "active" : ""}`}
        >
          <BookOpen size={18} /> <span>{t("nav.resources")}</span>
        </Link>
        <Link
          to="/my-quizzes"
          className={`nav-item ${isCurrent("/my-quizzes") ? "active" : ""}`}
        >
          <BookOpen size={18} /> <span>{t("nav.myQuizzes")}</span>
        </Link>
        <Link
          to="/results-history"
          className={`nav-item ${isCurrent("/results") || isCurrent("/my-performance") ? "active" : ""}`}
        >
          <Award size={18} /> <span>{t("nav.performance")}</span>
        </Link>
        <Link
          to="/profile"
          className={`nav-item ${isCurrent("/profile") ? "active" : ""}`}
        >
          <User size={18} /> <span>{t("nav.profile")}</span>
        </Link>
        <Link
          to="/admin"
          className={`nav-item ${isCurrent("/admin") ? "active" : ""}`}
          style={{
            marginTop: "8px",
            color: user?.role === "admin" ? "var(--color-primary)" : undefined,
          }}
        >
          <ShieldCheck size={18} /> <span>{t("nav.admin")}</span>
        </Link>
      </div>

      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {user ? (
          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
            className="nav-item"
            style={{
              color: "var(--color-error)",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} /> <span>{t("nav.signOut")}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary btn-block"
          >
            <LogIn size={18} /> <span>{t("nav.signIn")}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
