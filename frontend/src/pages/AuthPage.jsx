import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('kasun.perera@student.lk');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({
      name: 'Kasun Perera',
      email,
      phone: '+94 77 123 4567',
      role: 'student',
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      school: 'Ananda College, Colombo'
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-bg)' }}>
      {/* Desktop Left Hero Banner */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #7C3AED 100%)',
        color: 'white',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)' }}>EQ</div>
          <span style={{ fontSize: '22px', fontWeight: 800 }}>EduQuiz Pro</span>
        </div>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>Learn. Practice.<br />Succeed.</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, maxWidth: '520px' }}>Prepare smarter for Sri Lankan Grade 5, O/L, and A/L examinations with timed quizzes, instant results, and detailed step-by-step explanations.</p>
        </div>
        <div style={{ fontSize: '13px', opacity: 0.8 }}>© 2026 EduQuiz Pro Inc. All rights reserved.</div>
      </div>

      {/* Right Login Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="logo-badge" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '24px' }}>EQ</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '12px' }}>Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
