import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import TopHeader from './components/TopHeader';

import AuthPage from './pages/AuthPage';
import SelectExamLevelPage from './pages/SelectExamLevelPage';
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import QuizListPage from './pages/QuizListPage';
import QuizDetailsPage from './pages/QuizDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import QuizInstructionsPage from './pages/QuizInstructionsPage';
import QuizTakingPage from './pages/QuizTakingPage';
import ResultPage from './pages/ResultPage';
import AnswerReviewPage from './pages/AnswerReviewPage';
import ProfilePage from './pages/ProfilePage';
import ResultsHistoryPage from './pages/ResultsHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminQuizWizardPage from './pages/AdminQuizWizardPage';
import EducationResourcesPage from './pages/EducationResourcesPage';
import WelcomePage from './pages/WelcomePage';

function RouteGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // If trying to access admin sub-routes without admin role, redirect to /admin login gate
  if (location.pathname.startsWith('/admin/create-quiz') || location.pathname.startsWith('/admin/edit-quiz')) {
    if (user?.role !== 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If student is logged in but hasn't picked examination level yet, force redirect to onboarding page
  if (user && user.role !== 'admin' && !user.examLevel && location.pathname !== '/welcome' && location.pathname !== '/select-exam-level' && location.pathname !== '/login' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/select-exam-level" replace />;
  }

  return children;
}

function LayoutShell({ children }) {
  const location = useLocation();
  // Exclude Login, Welcome, Select Exam Level, Quiz Taking Attempt, AND Admin routes from Student Layout
  const isStandalonePage = location.pathname === '/login' || location.pathname === '/welcome' || location.pathname === '/select-exam-level' || location.pathname.includes('/attempt') || location.pathname.startsWith('/admin');

  if (isStandalonePage) {
    return <main>{children}</main>;
  }

  return (
    <>
      <TopHeader />
      <main className="page-stage" style={{ paddingTop: 'calc(64px + 28px)' }}>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteGuard>
          <LayoutShell>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/select-exam-level" element={<SelectExamLevelPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/resources" element={<EducationResourcesPage />} />
              <Route path="/education-resources" element={<EducationResourcesPage />} />
              <Route path="/exams/:levelId" element={<ExamsPage />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:quizId/details" element={<QuizDetailsPage />} />
              <Route path="/checkout/:quizId" element={<CheckoutPage />} />
              <Route path="/my-quizzes" element={<MyQuizzesPage />} />
              <Route path="/quiz/:quizId/instructions" element={<QuizInstructionsPage />} />
              <Route path="/quiz/:quizId/attempt" element={<QuizTakingPage />} />
              <Route path="/quiz/:quizId/result" element={<ResultPage />} />
              <Route path="/quiz/:quizId/review" element={<AnswerReviewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/results-history" element={<ResultsHistoryPage />} />
              <Route path="/results" element={<ResultsHistoryPage />} />
              <Route path="/my-performance" element={<ResultsHistoryPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/create-quiz" element={<AdminQuizWizardPage />} />
              <Route path="/admin/edit-quiz/:quizId" element={<AdminQuizWizardPage />} />
            </Routes>
          </LayoutShell>
        </RouteGuard>
      </BrowserRouter>
    </AuthProvider>
  );
}

