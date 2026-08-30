import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Award, User } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/dashboard" className={`mobile-nav-item ${isCurrent('/dashboard') ? 'active' : ''}`}>
        <Home size={20} /> <span>Home</span>
      </Link>
      <Link to="/my-quizzes" className={`mobile-nav-item ${isCurrent('/my-quizzes') ? 'active' : ''}`}>
        <BookOpen size={20} /> <span>My Quizzes</span>
      </Link>
      <Link to="/results-history" className={`mobile-nav-item ${isCurrent('/results-history') ? 'active' : ''}`}>
        <Award size={20} /> <span>Results</span>
      </Link>
      <Link to="/profile" className={`mobile-nav-item ${isCurrent('/profile') ? 'active' : ''}`}>
        <User size={20} /> <span>Profile</span>
      </Link>
    </nav>
  );
}
