import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Award, FileText } from 'lucide-react';

export default function ResultsHistoryPage() {
  const navigate = useNavigate();
  const { attempts } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const attemptKeys = Object.keys(attempts);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizzes();
      if (res.quizzes) setQuizzes(res.quizzes);
    }
    load();
  }, []);

  const getQuizTitle = (quizId) => {
    const found = quizzes.find(q => q.id === quizId);
    if (found) return found.title;
    if (quizId === 'quiz-math-01') return 'Algebra & Quadratic Equations Paper 01';
    if (quizId === 'quiz-physics-01') return 'Mechanics & Gravitational Fields Test';
    if (quizId === 'quiz-g5-01') return 'Scholarship Intelligence & Logic Model Paper 01';
    return 'Examination Model Paper';
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Results History</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Comprehensive archive of all completed examinations and score cards</p>
      </div>

      <div className="card">
        {attemptKeys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Award size={48} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Completed Quizzes Yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Start an examination paper to track your score history and performance here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>Browse Quizzes</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px' }}>Quiz Title</th>
                  <th style={{ padding: '12px 16px' }}>Date Completed</th>
                  <th style={{ padding: '12px 16px' }}>Score</th>
                  <th style={{ padding: '12px 16px' }}>Percentage</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attemptKeys.map(key => {
                  const att = attempts[key];
                  return (
                    <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>{getQuizTitle(key)}</td>
                      <td style={{ padding: '12px 16px' }}>{att.date || 'Today'}</td>
                      <td style={{ padding: '12px 16px' }}>{att.score} / {att.total}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-success">{att.percentage}%</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/quiz/${key}/result`)}>View Result</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
