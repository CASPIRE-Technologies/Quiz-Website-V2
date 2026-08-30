import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/quizzes?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div className="logo-badge" style={{ width: '32px', height: '32px', fontSize: '16px' }}>EQ</div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-text-main)' }}>EduQuiz Pro</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '8px 16px', borderRadius: '9999px', width: '320px' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search quizzes, subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Bell size={20} color="var(--color-text-muted)" />
          <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: 'var(--color-error)', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px 4px 4px', borderRadius: '9999px', border: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.name ? user.name.charAt(0) : 'G'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>{user?.name || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
}
