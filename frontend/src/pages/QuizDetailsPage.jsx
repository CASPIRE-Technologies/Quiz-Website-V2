import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function QuizDetailsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { purchases, attempts } = useAuth();

  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizById(quizId);
      if (res.quiz) setQuiz(res.quiz);
    }
    load();
  }, [quizId]);

  const isPurchased = purchases.includes(quizId);
  const isCompleted = attempts[quizId] !== undefined;

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
          {quiz ? quiz.title : 'Loading Examination Paper...'}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          {quiz ? (quiz.about || quiz.description || 'Comprehensive timed practice examination paper.') : 'Loading paper details...'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Exam Rules & Instructions</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '10px' }}><Check size={16} color="var(--color-primary)" /> Questions Count: <strong>{quiz?.questions?.length || quiz?.questionCount || 30} Questions</strong></li>
            <li style={{ display: 'flex', gap: '10px' }}><Check size={16} color="var(--color-primary)" /> Exam Duration: <strong>{quiz?.durationMinutes || 45} Minutes</strong></li>
            <li style={{ display: 'flex', gap: '10px' }}><Check size={16} color="var(--color-primary)" /> Timer cannot be paused after starting the attempt.</li>
            <li style={{ display: 'flex', gap: '10px' }}><Check size={16} color="var(--color-primary)" /> Selected answers automatically save instantly to server.</li>
            <li style={{ display: 'flex', gap: '10px' }}><Check size={16} color="var(--color-primary)" /> Quiz automatically submits when time expires.</li>
          </ul>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Price</div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary)' }}>LKR {quiz?.price || 300}</div>
          </div>

          {isCompleted ? (
            <button className="btn btn-secondary btn-block btn-lg" onClick={() => navigate(`/quiz/${quizId}/result`)}>View Result</button>
          ) : isPurchased ? (
            <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate(`/quiz/${quizId}/instructions`)}>Start Quiz Now</button>
          ) : (
            <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate(`/checkout/${quizId}`)}>Buy Quiz – LKR {quiz?.price || 300}</button>
          )}
        </div>
      </div>
    </div>
  );
}
