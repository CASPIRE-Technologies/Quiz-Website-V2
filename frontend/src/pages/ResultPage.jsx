import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResultPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { attempts } = useAuth();
  const result = attempts[quizId] || { score: 24, total: 30, percentage: 80, timeTaken: '32:45' };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Congratulations! 🎉</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>You have completed Algebra & Quadratic Equations Paper 01</p>

        <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--color-primary)' }}>{result.score} / {result.total}</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>Score: {result.percentage}%</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Correct</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{result.score}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Incorrect</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-error)' }}>{result.total - result.score}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accuracy</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{result.percentage}%</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Time Taken</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>32:45</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate(`/quiz/${quizId}/review`)}>
          <FileText size={18} /> Review Answers & Explanations
        </button>
        <button className="btn btn-outline btn-lg" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </div>
    </div>
  );
}
