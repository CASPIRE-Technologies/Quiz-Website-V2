import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Play, CheckCircle2, Sparkles, Trophy, Flame,
  Target, TrendingUp, BookOpen, Clock, Zap, Star, ArrowRight,
  BarChart3, Award, GraduationCap, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ───── Helpers ───── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  return { text: 'Good Evening', emoji: '🌙' };
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function AnimatedNumber({ value, suffix = '' }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) { setDisplayed(0); return; }
    const duration = 800;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      setDisplayed(current);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{displayed}{suffix}</>;
}

/* ───── Main Component ───── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, purchases, attempts } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const totalQuizzes = Object.keys(attempts).length;
    const totalPurchased = purchases.length;
    const scores = Object.values(attempts).map(a => a?.score ?? a?.percentage ?? 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    // Simulate a streak from completed quizzes count (min 1 if any completed)
    const streak = totalQuizzes > 0 ? Math.min(totalQuizzes, 30) : 0;
    return { totalQuizzes, totalPurchased, avgScore, streak };
  }, [attempts, purchases]);

  const examLevels = [
    { id: 'g5', title: 'Grade 5 Scholarship', badge: 'Primary Level', icon: '🎒', desc: 'IQ & General Knowledge', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', shadowColor: 'rgba(251, 191, 36, 0.3)' },
    { id: 'ol', title: 'G.C.E. Ordinary Level', badge: 'Secondary Level', icon: '📘', desc: 'Core subjects & model papers', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadowColor: 'rgba(59, 130, 246, 0.3)' },
    { id: 'al', title: 'G.C.E. Advanced Level', badge: 'Senior Level', icon: '🎓', desc: 'Stream-specific past papers', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', shadowColor: 'rgba(139, 92, 246, 0.3)' }
  ];

  const isMatchingLevel = (examId, userExamLevel) => {
    if (!userExamLevel) return false;
    const lower = userExamLevel.toLowerCase();
    if (examId === 'g5' && (lower.includes('grade 5') || lower.includes('g5') || lower.includes('scholarship'))) return true;
    if (examId === 'ol' && (lower.includes('ordinary') || lower.includes('o/l') || lower.includes('o-level'))) return true;
    if (examId === 'al' && (lower.includes('advanced') || lower.includes('a/l') || lower.includes('a-level'))) return true;
    return false;
  };

  /* Recent attempts for activity feed */
  const recentAttempts = useMemo(() => {
    return Object.entries(attempts).slice(-3).reverse().map(([quizId, data]) => ({
      quizId,
      score: data?.score ?? data?.percentage ?? 0,
      total: data?.totalQuestions ?? data?.total ?? 0,
      correct: data?.correctAnswers ?? data?.correct ?? 0,
    }));
  }, [attempts]);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>

      {/* ═══ HERO GREETING SECTION ═══ */}
      <div className="dash-hero" style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)',
        borderRadius: '20px',
        padding: '36px 40px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '30%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20px', left: '60%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {formattedDate}
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, lineHeight: 1.25, margin: 0 }}>
              {greeting.text}, {user?.name?.split(' ')[0] || 'Student'} {greeting.emoji}
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', maxWidth: '420px', lineHeight: 1.5, fontWeight: 400 }}>
              Stay consistent. Every quiz brings you closer to your goal. Let's make today count!
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                className="btn"
                onClick={() => navigate('/quizzes')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white',
                  border: 'none',
                  padding: '11px 22px',
                  fontWeight: 700,
                  fontSize: '13px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                  transition: 'all 0.25s ease',
                }}
              >
                <Zap size={15} /> Start a Quiz
              </button>
              <button
                className="btn"
                onClick={() => navigate(`/exams/${user?.examLevel?.includes('5') ? 'g5' : user?.examLevel?.toLowerCase().includes('a') ? 'al' : 'ol'}`)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '11px 22px',
                  fontWeight: 600,
                  fontSize: '13px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                <BookOpen size={15} /> Browse Papers
              </button>
            </div>
          </div>

          {/* Quick streak / level indicator */}
          {stats.streak > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              minWidth: '140px',
            }}>
              <Flame size={28} color="#f97316" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1 }}>
                <AnimatedNumber value={stats.streak} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '4px' }}>Day Streak 🔥</div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ STAT CARDS ROW ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'Quizzes Taken', value: stats.totalQuizzes, icon: Target, color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
          { label: 'Average Score', value: stats.avgScore, suffix: '%', icon: TrendingUp, color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
          { label: 'Papers Purchased', value: stats.totalPurchased, icon: BookOpen, color: '#8b5cf6', bgColor: '#f5f3ff', borderColor: '#ddd6fe' },
          { label: 'Current Streak', value: stats.streak, icon: Flame, color: '#f97316', bgColor: '#fff7ed', borderColor: '#fed7aa' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="dash-stat-card"
              style={{
                background: 'var(--color-card-bg)',
                borderRadius: '16px',
                padding: '22px 20px',
                border: `1px solid ${stat.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Subtle accent stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${stat.color}, transparent)` }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  backgroundColor: stat.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-text-main)', lineHeight: 1, letterSpacing: '-0.5px' }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '6px' }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ MAIN CONTENT GRID ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '28px' }}>

        {/* ── Left: Exam Levels ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} color="var(--color-primary)" /> Choose Your Exam
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {examLevels.map((exam, i) => {
              const isSelected = isMatchingLevel(exam.id, user?.examLevel);
              return (
                <div
                  key={exam.id}
                  className="dash-exam-card"
                  onClick={() => navigate(`/exams/${exam.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    padding: '20px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? '#EFF6FF' : 'var(--color-card-bg)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 8px 24px -4px rgba(37, 99, 235, 0.2)' : 'var(--shadow-sm)',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
                    transitionDelay: `${(i + 4) * 80}ms`,
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: exam.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                    boxShadow: `0 6px 16px ${exam.shadowColor}`,
                  }}>
                    {exam.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>{exam.title}</h3>
                      {isSelected && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '3px',
                          backgroundColor: 'var(--color-primary)', color: 'white',
                          padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700,
                        }}>
                          <CheckCircle2 size={10} /> Your Stream
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, fontWeight: 400 }}>{exam.desc}</p>
                  </div>

                  <ChevronRight size={18} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Performance + Activity ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Performance Card */}
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: '18px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={17} color="var(--color-primary)" /> Performance
            </h3>

            {/* Circular progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="3"
                    strokeDasharray={`${stats.avgScore}, 100`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-text-main)', lineHeight: 1 }}>
                    <AnimatedNumber value={stats.avgScore} suffix="%" />
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', fontWeight: 600 }}>AVG</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Quizzes Taken</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)' }}>{stats.totalQuizzes}</span>
                </div>
                <div style={{ height: '1px', background: 'var(--color-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Purchased</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)' }}>{stats.totalPurchased}</span>
                </div>
                <div style={{ height: '1px', background: 'var(--color-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Streak</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#f97316' }}>{stats.streak} 🔥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '18px',
            padding: '22px 24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
            className="dash-daily-card"
            onClick={() => navigate('/quizzes')}
          >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', right: '40px', bottom: '-30px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Daily Challenge</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.3 }}>Ready for Today's Quiz?</h3>
              <p style={{ fontSize: '13px', opacity: 0.7, margin: '0 0 16px 0', fontWeight: 400 }}>Test your knowledge with curated questions</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '8px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}>
                Start Challenge <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          {recentAttempts.length > 0 && (
            <div style={{
              background: 'var(--color-card-bg)',
              borderRadius: '18px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--color-text-muted)" /> Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentAttempts.map((attempt, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '12px',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: attempt.score >= 70 ? '#ecfdf5' : attempt.score >= 40 ? '#fef3c7' : '#fee2e2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {attempt.score >= 70 ? <Trophy size={15} color="#10b981" /> :
                          attempt.score >= 40 ? <Star size={15} color="#f59e0b" /> :
                            <Target size={15} color="#ef4444" />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {attempt.quizId.replace(/-/g, ' ').replace(/^quiz /, '').replace(/\b\w/g, c => c.toUpperCase())}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {attempt.correct}/{attempt.total} correct
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '14px', fontWeight: 800,
                      color: attempt.score >= 70 ? '#10b981' : attempt.score >= 40 ? '#d97706' : '#ef4444',
                    }}>
                      {attempt.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ CONTINUE LEARNING BANNER ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ede9fe 100%)',
        borderRadius: '18px',
        padding: '24px 28px',
        border: '1px solid var(--color-primary-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '260px' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
          }}>
            <Play size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              Continue Learning
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>Pick up where you left off</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0 0 0', fontWeight: 400 }}>Resume your recent quizzes and keep improving</p>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => navigate('/my-quizzes')}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
          }}
        >
          My Quizzes <ArrowRight size={14} />
        </button>
      </div>

      {/* ═══ SCOPED STYLES ═══ */}
      <style>{`
        .dash-stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1) !important;
        }

        .dash-exam-card:hover {
          transform: translateX(6px) !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1) !important;
        }

        .dash-daily-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 16px 40px rgba(124, 58, 237, 0.35) !important;
        }

        .dash-daily-card:hover button {
          background: rgba(255,255,255,0.3) !important;
        }

        @media (max-width: 900px) {
          .dash-hero {
            padding: 28px 24px !important;
            border-radius: 16px !important;
          }
          .dash-hero h1 {
            font-size: 24px !important;
          }
        }

        @media (max-width: 768px) {
          /* Stack the main 2-col grid */
          div[style*="gridTemplateColumns: '1.6fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
