import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('kasun.perera@student.lk');
  const [password, setPassword] = useState('password123');
  const [isSplashing, setIsSplashing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSplashing(true);

    // Trigger color splash animation for 900ms before navigating into dashboard
    setTimeout(() => {
      loginUser({
        name: 'Kasun Perera',
        email,
        phone: '+94 77 123 4567',
        role: 'student',
        examLevel: 'G.C.E. Ordinary Level (O/L)',
        school: 'Ananda College, Colombo'
      });
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Color Splash Expanding Ripple Overlay */}
      {isSplashing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Radial Color Splash Bubble */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #7C3AED 0%, #2563EB 40%, #10B981 70%, #EC4899 100%)',
            animation: 'circleSplashExpand 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            boxShadow: '0 0 100px rgba(124, 58, 237, 0.8)'
          }} />

          {/* Success Splash Card */}
          <div style={{
            position: 'relative',
            zIndex: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '32px 48px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            animation: 'splashPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            border: '2px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 16px rgba(22, 163, 74, 0.2)'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Welcome Back! <Sparkles size={22} color="#F59E0B" />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Authenticating Kasun Perera...
            </p>
          </div>
        </div>
      )}

      {/* Desktop Left Hero Banner with Shifting Liquid Color Wave */}
      <div style={{
        flex: 1,
        background: isSplashing
          ? 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #2563EB 100%)'
          : 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #7C3AED 100%)',
        animation: isSplashing ? 'splashColorWave 0.8s ease-in-out infinite alternate' : 'none',
        transition: 'background 0.5s ease',
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
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px', opacity: isSplashing ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="logo-badge" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '24px' }}>EQ</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSplashing} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSplashing} />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '12px', overflow: 'hidden', position: 'relative' }}
              disabled={isSplashing}
            >
              {isSplashing ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
