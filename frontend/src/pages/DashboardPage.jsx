import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play, FileText, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, purchases, attempts } = useAuth();

  const examLevels = [
    { id: "g5", title: "Grade 5 Scholarship", badge: "Primary Level", icon: "🎒", desc: "IQ & General Knowledge" },
    { id: "ol", title: "G.C.E. Ordinary Level", badge: "Secondary Level", icon: "📘", desc: "Core subjects & model papers" },
    { id: "al", title: "G.C.E. Advanced Level", badge: "Senior Level", icon: "🎓", desc: "Stream-specific past papers" }
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Welcome back, {user?.name || 'Student'} 👋</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>What are you preparing for today?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {examLevels.map(exam => (
          <div key={exam.id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(`/exams/${exam.id}`)}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{exam.icon}</div>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>{exam.badge}</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{exam.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{exam.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
              <span>Choose Subject</span> <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Continue Learning</h2>
          <div className="card" style={{ background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)', borderColor: 'var(--color-primary-border)', marginBottom: '24px' }}>
            <span className="badge badge-warning" style={{ marginBottom: '10px' }}>In Progress</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Algebra & Quadratic Equations Paper 01</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>O/L • Mathematics • 30 Questions</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/quiz/quiz-math-01/instructions')}>
              <Play size={14} /> Continue Quiz
            </button>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Performance Summary</h2>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-primary)' }}>88%</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '4px' }}>Average Accuracy Score</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '14px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Quizzes Purchased:</span>
                <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{purchases.length}</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Quizzes Completed:</span>
                <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{Object.keys(attempts).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
