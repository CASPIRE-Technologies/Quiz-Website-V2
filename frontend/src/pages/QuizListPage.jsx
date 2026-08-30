import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuizListPage() {
  const navigate = useNavigate();
  const { purchases, attempts } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizzes();
      if (res.quizzes) setQuizzes(res.quizzes);
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Browse Quizzes</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Explore paid timed practice papers and full mock examinations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {quizzes.map(quiz => {
          const isPurchased = purchases.includes(quiz.id);
          const isCompleted = attempts[quiz.id] !== undefined;

          return (
            <div key={quiz.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{quiz.examLevel ? quiz.examLevel.toUpperCase() : 'EXAM'}</span>
                  <span className="badge badge-warning">{quiz.difficulty}</span>
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.3 }}>{quiz.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{quiz.subjectName}</p>

                <div style={{ display: 'flex', gap: '14px', margin: '14px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> {quiz.questionCount} Questions</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {quiz.durationMinutes} Mins</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)', marginTop: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>LKR {quiz.price}</span>
                {isCompleted ? (
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/quiz/${quiz.id}/details`)}>View Results</button>
                ) : isPurchased ? (
                  <button className="btn btn-primary btn-sm" style={{ background: 'var(--color-success)', color: 'white' }} onClick={() => navigate(`/quiz/${quiz.id}/details`)}>Start Quiz</button>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/quiz/${quiz.id}/details`)}>Buy Quiz</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
