import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Award, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/dashboard" className={`mobile-nav-item ${isCurrent('/dashboard') ? 'active' : ''}`}>
        <Home size={20} /> <span>{t('nav.dashboard')}</span>
      </Link>
      <Link to="/my-quizzes" className={`mobile-nav-item ${isCurrent('/my-quizzes') ? 'active' : ''}`}>
        <BookOpen size={20} /> <span>{t('nav.myQuizzes')}</span>
      </Link>
      <Link to="/results-history" className={`mobile-nav-item ${location.pathname.startsWith('/results') || location.pathname.startsWith('/my-performance') ? 'active' : ''}`}>
        <Award size={20} /> <span>{t('nav.performance')}</span>
      </Link>
      <Link to="/profile" className={`mobile-nav-item ${isCurrent('/profile') ? 'active' : ''}`}>
        <User size={20} /> <span>{t('nav.profile')}</span>
      </Link>
    </nav>
  );
}
