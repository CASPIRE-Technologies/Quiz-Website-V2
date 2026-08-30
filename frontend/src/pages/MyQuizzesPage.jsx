import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const { purchases, attempts } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>My Enrolled Quizzes</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Manage your purchased papers, continue active attempts, or review results</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {purchases.map(id => {
          const isCompleted = attempts[id] !== undefined;

          return (
            <div key={id} className="card">
              <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`} style={{ marginBottom: '10px' }}>
                {isCompleted ? 'Completed' : 'Available'}
              </span>
              <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>
                {id === 'quiz-math-01' ? 'Algebra & Quadratic Equations Paper 01' : 'Scholarship Logic Paper 01'}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                {isCompleted ? (
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/quiz/${id}/result`)}>View Result</button>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/quiz/${id}/instructions`)}>Start Quiz</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
