import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResultsHistoryPage() {
  const navigate = useNavigate();
  const { attempts } = useAuth();
  const attemptKeys = Object.keys(attempts);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Results History</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Comprehensive archive of all completed examinations and score cards</p>
      </div>

      <div className="card">
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
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>Algebra & Quadratic Equations Paper 01</td>
                  <td style={{ padding: '12px 16px' }}>{att.date}</td>
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
    </div>
  );
}
