import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ResultPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { attempts } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [attemptData, setAttemptData] = useState(null);

  useEffect(() => {
    async function load() {
      const qRes = await api.getQuizById(quizId);
      if (qRes.quiz) setQuiz(qRes.quiz);

      if (attempts && attempts[quizId]) {
        setAttemptData(attempts[quizId]);
      } else {
        const aRes = await api.getAttemptResult(quizId);
        if (aRes.result) setAttemptData(aRes.result);
      }
    }
    load();
  }, [quizId, attempts]);

  const result = attemptData || attempts[quizId] || { score: 0, total: 0, percentage: 0, timeTaken: '0 mins' };
  const quizTitle = quiz?.title ? quiz.title.trim() : 'Examination Model Paper';

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Congratulations! 🎉</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px', wordBreak: 'break-word' }}>
          You have completed <strong>{quizTitle}</strong>
        </p>

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
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-error)' }}>{Math.max(0, result.total - result.score)}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accuracy</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{result.percentage}%</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Time Taken</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>{result.timeTaken || '0 mins'}</div>
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
