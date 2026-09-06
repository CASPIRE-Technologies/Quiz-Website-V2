import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, BookOpen, Award, CheckCircle2, ArrowRight, Sparkles, Sun, Moon, Globe } from 'lucide-react';

export default function SelectExamLevelPage() {
  const navigate = useNavigate();
  const { user, updateUserExamLevel } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState('G.C.E. Ordinary Level (O/L)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = [
    {
      id: 'G.C.E. Ordinary Level (O/L)',
      title: t('exam.ol'),
      badge: t('exam.olBadge'),
      icon: <BookOpen size={32} color="#2563EB" />,
      color: '#2563EB',
      bgColor: 'var(--color-primary-light)',
      description: t('exam.olDesc')
    },
    {
      id: 'G.C.E. Advanced Level (A/L)',
      title: t('exam.al'),
      badge: t('exam.alBadge'),
      icon: <GraduationCap size={32} color="#7C3AED" />,
      color: '#7C3AED',
      bgColor: 'var(--color-secondary-light)',
      description: t('exam.alDesc')
    },
    {
      id: 'Grade 5 Scholarship',
      title: t('exam.grade5'),
      badge: t('exam.grade5Badge'),
      icon: <Award size={32} color="#D97706" />,
      color: '#D97706',
      bgColor: 'var(--color-warning-light)',
      description: t('exam.grade5Desc')
    }
  ];

  const handleSave = async () => {
    if (!selectedLevel) return;
    setIsSubmitting(true);
    try {
      await updateUserExamLevel(selectedLevel);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
    }}>
      {/* Floating Theme and Language Switcher */}
      <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 110 }}>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? t('theme.light') : t('theme.dark')}
          style={{ width: '38px', padding: 0 }}
        >
          {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#64748B" />}
        </button>
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
          className="lang-toggle-btn"
          title={t('language.select')}
        >
          <Globe size={15} color="var(--color-text-muted)" />
          <span className="lang-badge">{language === 'si' ? 'සිං' : 'EN'}</span>
        </button>
      </div>

      <div style={{
        maxWidth: '820px',
        width: '100%',
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        padding: '40px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-badge" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '20px' }}>EQ</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
            <Sparkles size={14} /> Step 1 of 1 • Account Setup
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            {t('exam.selectPrompt')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto' }}>
            {user?.name ? `${t('dashboard.welcomeBack')}, ${user.name}! ` : ''}{t('dashboard.selectExamStreamDesc')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {levels.map(level => {
            const isSelected = selectedLevel === level.id;
            return (
              <div
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                style={{
                  position: 'relative',
                  border: isSelected ? `2.5px solid ${level.color}` : '2px solid var(--color-border)',
                  borderRadius: '18px',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? level.bgColor : 'var(--color-card-bg)',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  boxShadow: isSelected ? '0 10px 25px -5px rgba(37, 99, 235, 0.15)' : 'none'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', color: level.color }}>
                    <CheckCircle2 size={22} />
                  </div>
                )}
                <div style={{ marginBottom: '16px' }}>{level.icon}</div>
                <span className="badge" style={{ backgroundColor: 'var(--color-card-bg)', color: level.color, border: `1px solid ${level.color}`, marginBottom: '10px' }}>
                  {level.badge}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)', lineHeight: 1.3 }}>
                  {level.title || level.id}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {level.description}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={isSubmitting}
            style={{ padding: '14px 40px', fontSize: '16px', gap: '10px', borderRadius: '12px' }}
          >
            {isSubmitting ? t('common.saving') : t('exam.confirmLevel')} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
