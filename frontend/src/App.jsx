import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DesktopSidebar from './components/DesktopSidebar';
import TopHeader from './components/TopHeader';
import MobileBottomNav from './components/MobileBottomNav';

import AuthPage from './pages/AuthPage';
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

function LayoutShell({ children }) {
  const location = useLocation();
  // Exclude Login, Quiz Taking Attempt, AND Admin routes from Student Layout
  const isStandalonePage = location.pathname === '/login' || location.pathname.includes('/attempt') || location.pathname.startsWith('/admin');

  if (isStandalonePage) {
    return <main>{children}</main>;
  }

  return (
    <div className="app-container">
      <DesktopSidebar />
      <div className="main-wrapper">
        <TopHeader />
        <main className="page-stage">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/create-quiz" element={<AdminQuizWizardPage />} />
            <Route path="/admin/edit-quiz/:quizId" element={<AdminQuizWizardPage />} />
          </Routes>
        </LayoutShell>
      </BrowserRouter>
    </AuthProvider>
  );
}
