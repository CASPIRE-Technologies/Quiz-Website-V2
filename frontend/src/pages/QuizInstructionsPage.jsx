import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function QuizInstructionsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizById(quizId);
      if (res.quiz) setQuiz(res.quiz);
    }
    load();
  }, [quizId]);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
          {quiz ? quiz.title : 'Loading Examination Paper...'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          {quiz ? `${quiz.subjectName || 'General'} • ${quiz.questions?.length || quiz.questionCount || 30} Questions • ${quiz.durationMinutes || 45} Minutes` : 'Loading...'}
        </p>
      </div>

      <div className="card" style={{ backgroundColor: 'var(--color-warning-light)', borderColor: '#FCD34D', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AlertTriangle size={24} color="#D97706" />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#92400E' }}>Important Notice</h4>
            <p style={{ fontSize: '13px', color: '#B45309' }}>Once you click "Start Quiz", the countdown timer begins immediately and cannot be paused.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          I have read and agree to all exam instructions.
        </label>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => navigate('/my-quizzes')}>Cancel</button>
        <button className="btn btn-primary btn-lg" disabled={!agreed} onClick={() => navigate(`/quiz/${quizId}/attempt`)}>Start Quiz</button>
      </div>
    </div>
  );
}
