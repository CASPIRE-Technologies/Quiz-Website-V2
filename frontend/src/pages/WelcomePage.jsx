import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Zap, TrendingUp, Trophy, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Only allow view if the user just completed a new account registration
    const isNewRegistration = sessionStorage.getItem('eduquiz_new_registration');
    if (!isNewRegistration) {
      navigate('/dashboard', { replace: true });
      return;
    }

    requestAnimationFrame(() => setMounted(true));
  }, [user, navigate]);

  const handleGetStarted = () => {
    // Clear registration session flag so user won't be redirected back to welcome on future logins
    sessionStorage.removeItem('eduquiz_new_registration');
    navigate('/dashboard');
  };

  const featureCards = [
    {
      id: 'card-feature-learn',
      title: 'Learn',
      description: 'Access lessons and study materials.',
      icon: <BookOpen size={28} color="#2563EB" />,
      tag: 'Study Materials',
      accentColor: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
    {
      id: 'card-feature-practice',
      title: 'Practice',
      description: 'Improve your knowledge with quizzes.',
      icon: <Zap size={28} color="#7C3AED" />,
      tag: 'Interactive Quizzes',
      accentColor: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
    {
      id: 'card-feature-track',
      title: 'Track Your Progress',
      description: 'Monitor your performance.',
      icon: <TrendingUp size={28} color="#059669" />,
      tag: 'Real-time Analytics',
      accentColor: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    {
      id: 'card-feature-achieve',
      title: 'Achieve Your Goals',
      description: 'Work towards your academic goals.',
      icon: <Trophy size={28} color="#D97706" />,
      tag: 'Exam Readiness',
      accentColor: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.07) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.07) 0px, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          padding: '52px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #F59E0B 100%)',
          }}
        />

        {/* Header section */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          {/* Logo badge & Welcome pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              className="logo-badge"
              style={{
                width: '44px',
                height: '44px',
                fontSize: '18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              EQ
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid #BFDBFE',
              }}
            >
              <Sparkles size={14} /> Account Created Successfully
            </div>
          </div>

          <h1
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '14px',
              lineHeight: 1.25,
              letterSpacing: '-0.5px',
            }}
          >
            Welcome to Your Learning Journey
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.6,
              margin: '0 auto',
            }}
          >
            Start your learning journey with us. Explore lessons, practice with quizzes, track your progress, and improve your knowledge at your own pace. Everything you need to learn and grow is just a few clicks away.
          </p>
        </div>

        {/* Feature cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '44px',
          }}
        >
          {featureCards.map((card, idx) => (
            <div
              key={card.id}
              id={card.id}
              className="welcome-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px 20px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                {/* Icon box */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    border: `1px solid ${card.borderColor}`,
                  }}
                >
                  {card.icon}
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    color: card.accentColor,
                    marginBottom: '8px',
                  }}
                >
                  <CheckCircle2 size={12} /> {card.tag}
                </div>

                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action button CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            id="btn-welcome-get-started"
            onClick={handleGetStarted}
            className="btn btn-primary"
            style={{
              padding: '16px 44px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Get Started <ArrowRight size={18} />
          </button>
          
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#94A3B8' }}>
            Clicking Get Started takes you directly to your personalized Student Dashboard
          </div>
        </div>
      </div>

      <style>{`
        .welcome-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px -6px rgba(15, 23, 42, 0.1) !important;
          border-color: #CBD5E1 !important;
        }

        #btn-welcome-get-started:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(37, 99, 235, 0.6) !important;
        }

        @media (max-width: 640px) {
          .welcome-card {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
