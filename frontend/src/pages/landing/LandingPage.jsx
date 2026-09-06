import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Star, 
  Users, 
  PlayCircle,
  BarChart3,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Platform stats summary
  const platformStats = [
    { label: 'Active Students', value: '15,000+', icon: Users, color: '#38BDF8' },
    { label: 'Quizzes Completed', value: '120,000+', icon: Trophy, color: '#F59E0B' },
    { label: 'Success Rate', value: '94.8%', icon: Zap, color: '#10B981' },
    { label: 'Expert Model Papers', value: '500+', icon: BookOpen, color: '#8B5CF6' },
  ];

  // Primary Exam Target Tracks
  const examTracks = [
    {
      id: 'g5',
      title: 'Grade 5 Scholarship',
      badge: 'Primary Level',
      icon: '🎒',
      desc: 'Master IQ, mathematical logic, and general knowledge with timed practice sets.',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      shadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)'
    },
    {
      id: 'ol',
      title: 'G.C.E. Ordinary Level (O/L)',
      badge: 'Secondary Level',
      icon: '📘',
      desc: 'Comprehensive coverage of core subjects, model papers, and real-time marking.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      shadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)'
    },
    {
      id: 'al',
      title: 'G.C.E. Advanced Level (A/L)',
      badge: 'Senior Level',
      icon: '🎓',
      desc: 'Stream-specific past papers and high-yield questions for Science, Commerce & Arts.',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      shadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)'
    }
  ];

  // Core Features list
  const features = [
    {
      title: 'Instant Scoring & Analytics',
      desc: 'Get immediate feedback with detailed breakdown of correct answers and performance metrics.',
      icon: BarChart3,
      badge: 'Real-time'
    },
    {
      title: 'Curated by Experts',
      desc: 'Questions crafted according to the latest official syllabus standards and exam structures.',
      icon: ShieldCheck,
      badge: 'Verified'
    },
    {
      title: 'Adaptive Learning Path',
      desc: 'Track your daily streaks, review past attempts, and focus on areas needing improvement.',
      icon: Sparkles,
      badge: 'AI Powered'
    }
  ];

  return (
    <div 
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg, #0F172A)',
        color: 'var(--color-text-main, #F8FAFC)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* ── HERO SECTION ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 60px' }}>
        {/* Background Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }} />

        <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38BDF8',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Sparkles size={14} />
            <span>The Next Generation Exam Preparation Platform</span>
          </div>

          {/* Hero Main Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Master Your Exams with <br />
            <span style={{
              background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Edu Pulse Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px',
            color: '#94A3B8',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Access high-yield model papers, interactive practice sets, and real-time performance analytics tailored for Grade 5, O/L, and A/L students.
          </p>

          {/* CTA Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/quizzes')}
              className="btn-interactive"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <span>Explore All Quizzes</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#F8FAFC',
                fontWeight: 600,
                fontSize: '15px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s ease'
              }}
            >
              <PlayCircle size={18} color="#38BDF8" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── METRICS & STATS BAR ── */}
      <section style={{ maxWidth: '1140px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          padding: '28px',
          borderRadius: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)'
        }}>
          {platformStats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComp size={24} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── EXAM TRACK SELECTION ── */}
      <section style={{ maxWidth: '1140px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '10px' }}>Targeted Exam Programs</h2>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>Select your academic stream to jump straight into specialized quizzes.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {examTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => navigate('/quizzes')}
              className="quiz-paper-card"
              style={{
                borderRadius: '20px',
                background: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '30px 24px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ fontSize: '36px' }}>{track.icon}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#38BDF8',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {track.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {track.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '24px' }}>
                {track.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#38BDF8' }}>
                <span>Start Practice</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE FEATURES ── */}
      <section style={{ maxWidth: '1140px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '48px 36px',
          border: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '10px' }}>Designed for Academic Excellence</h2>
            <p style={{ color: '#94A3B8', fontSize: '15px' }}>Everything you need to boost confidence and secure top results.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={20} color="#38BDF8" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                      {feat.badge}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>{feat.title}</h4>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          © {new Date().getFullYear()} Edu Pulse. All rights reserved.
        </p>
      </footer>

      {/* Inline styles for hover effects */}
      <style>{`
        .quiz-paper-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.4);
          border-color: rgba(56, 189, 248, 0.3) !important;
        }
        .btn-interactive:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.5) !important;
        }
      `}</style>
    </div>
  );
}