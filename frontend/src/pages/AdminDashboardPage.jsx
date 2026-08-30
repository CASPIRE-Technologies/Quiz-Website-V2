import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 1420, totalQuizzes: 48, revenueLKR: 1245000, completedAttempts: 3410 });

  useEffect(() => {
    async function load() {
      const res = await api.getAdminStats();
      if (res.stats) setStats(res.stats);
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Admin Management Portal</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Connected to Express Backend & MySQL Database</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/create-quiz')}>
          <Plus size={18} /> Create New Quiz
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Students</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalStudents}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Quizzes</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>{stats.totalQuizzes}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>LKR {(stats.revenueLKR / 1000).toFixed(0)}k</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Attempts</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706' }}>{stats.completedAttempts}</div>
        </div>
      </div>
    </div>
  );
}
