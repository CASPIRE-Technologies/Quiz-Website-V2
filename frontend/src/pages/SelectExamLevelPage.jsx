import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, Award, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function SelectExamLevelPage() {
  const navigate = useNavigate();
  const { user, updateUserExamLevel } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('G.C.E. Ordinary Level (O/L)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = [
    {
      id: 'G.C.E. Ordinary Level (O/L)',
      badge: 'Secondary Level',
      icon: <BookOpen size={32} color="#2563EB" />,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      description: 'Covers core O/L subjects including Mathematics, Science, English, Sinhala/Tamil, and History model papers.'
    },
    {
      id: 'G.C.E. Advanced Level (A/L)',
      badge: 'Senior Secondary',
      icon: <GraduationCap size={32} color="#7C3AED" />,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      description: 'Stream-specific past papers & mocks for Physical Science, Bio Science, Commerce, Arts, and Technology.'
    },
    {
      id: 'Grade 5 Scholarship',
      badge: 'Primary Level',
      icon: <Award size={32} color="#D97706" />,
      color: '#D97706',
      bgColor: '#FEF3C7',
      description: 'Specially crafted IQ logic, visual reasoning, pattern recognition, and general knowledge mock papers.'
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
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '820px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.1)',
        border: '1px solid var(--color-border)',
        padding: '40px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-badge" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '20px' }}>EQ</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
            <Sparkles size={14} /> Step 1 of 1 • Account Setup
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            Choose Your Examination Level
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto' }}>
            {user?.name ? `Welcome ${user.name}! ` : ''}Select the target examination level to personalize model papers, subjects, and study progress in your student portal.
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
                  backgroundColor: isSelected ? level.bgColor : 'white',
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
                <span className="badge" style={{ backgroundColor: 'white', color: level.color, border: `1px solid ${level.color}`, marginBottom: '10px' }}>
                  {level.badge}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)', lineHeight: 1.3 }}>
                  {level.id}
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
            {isSubmitting ? 'Saving Preference...' : 'Continue to Student Portal'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
