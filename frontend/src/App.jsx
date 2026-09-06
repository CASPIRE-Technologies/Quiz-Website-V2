import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import TopHeader from "./components/headers/TopHeader";

import AuthPage from "./pages/auth/AuthPage";
import SelectExamLevelPage from "./pages/SelectExamLevelPage";
import DashboardPage from "./pages/DashboardPage";
import ExamsPage from "./pages/ExamsPage";
import QuizListPage from "./pages/QuizListPage";
import QuizDetailsPage from "./pages/QuizDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyQuizzesPage from "./pages/MyQuizzesPage";
import QuizInstructionsPage from "./pages/QuizInstructionsPage";
import QuizTakingPage from "./pages/QuizTakingPage";
import ResultPage from "./pages/ResultPage";
import AnswerReviewPage from "./pages/AnswerReviewPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsHistoryPage from "./pages/ResultsHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminQuizWizardPage from "./pages/AdminQuizWizardPage";
import EducationResourcesPage from "./pages/EducationResourcesPage";
import WelcomePage from "./pages/WelcomePage";
import LandingPage from "./pages/landing/LandingPage";

// Guard for protected routes requiring authentication & onboarding checks
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force student onboarding if exam level is missing
  if (
    user.role !== "admin" &&
    !user.examLevel &&
    location.pathname !== "/welcome" &&
    location.pathname !== "/select-exam-level"
  ) {
    return <Navigate to="/select-exam-level" replace />;
  }

  return children;
}

// Guard specifically for Admin views
function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Layout wrapper for consistent header and layout spacing
function LayoutShell({ children }) {
  const location = useLocation();
  const isStandalonePage =
    location.pathname === "/login" ||
    location.pathname === "/welcome" ||
    location.pathname === "/select-exam-level" ||
    location.pathname.includes("/attempt") ||
    location.pathname.startsWith("/admin");

  if (isStandalonePage) {
    return <main>{children}</main>;
  }

  return (
    <>
      <TopHeader />

      <main className="page-stage" style={{ paddingTop: "calc(64px + 28px)" }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <LayoutShell>
              <Routes>
                {/* Public / Unprotected Route */}
                <Route path="/login" element={<AuthPage />} />

                {/* Student Protected Routes */}
                <Route
                  path="/"
                  element={<LandingPage />}
                />
                <Route
                  path="/welcome"
                  element={
                    <ProtectedRoute>
                      <WelcomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/select-exam-level"
                  element={
                    <ProtectedRoute>
                      <SelectExamLevelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <EducationResourcesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/education-resources"
                  element={
                    <ProtectedRoute>
                      <EducationResourcesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/:levelId"
                  element={
                    <ProtectedRoute>
                      <ExamsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quizzes"
                  element={
                    <ProtectedRoute>
                      <QuizListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/details"
                  element={
                    <ProtectedRoute>
                      <QuizDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/:quizId"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-quizzes"
                  element={
                    <ProtectedRoute>
                      <MyQuizzesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/instructions"
                  element={
                    <ProtectedRoute>
                      <QuizInstructionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/attempt"
                  element={
                    <ProtectedRoute>
                      <QuizTakingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/result"
                  element={
                    <ProtectedRoute>
                      <ResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/review"
                  element={
                    <ProtectedRoute>
                      <AnswerReviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results-history"
                  element={
                    <ProtectedRoute>
                      <ResultsHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <ResultsHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-performance"
                  element={
                    <ProtectedRoute>
                      <ResultsHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Restricted Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/create-quiz"
                  element={
                    <AdminRoute>
                      <AdminQuizWizardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/edit-quiz/:quizId"
                  element={
                    <AdminRoute>
                      <AdminQuizWizardPage />
                    </AdminRoute>
                  }
                />

                {/* Fallback Catch-All */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </LayoutShell>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
