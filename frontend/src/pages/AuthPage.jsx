import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Kasun Perera');
  const [email, setEmail] = useState('kasun.perera@student.lk');
  const [password, setPassword] = useState('password123');
  const [examLevel, setExamLevel] = useState('G.C.E. Ordinary Level (O/L)');
  const [isSplashing, setIsSplashing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSplashing(true);

    setTimeout(() => {
      loginUser({
        name: isSignUp ? name : 'Kasun Perera',
        email,
        phone: '+94 77 123 4567',
        role: 'student',
        examLevel,
        school: 'Ananda College, Colombo'
      });
      navigate('/dashboard');
    }, 950);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Full-Screen Expanding Liquid Color Splash Overlay */}
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
          {/* Expanding Radial Gradient Circle Ripple */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #7C3AED 0%, #2563EB 40%, #10B981 70%, #EC4899 100%)',
            animation: 'circleSplashExpand 0.95s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            boxShadow: '0 0 120px rgba(124, 58, 237, 0.9)'
          }} />

          {/* Success Glassmorphic Popup */}
          <div style={{
            position: 'relative',
            zIndex: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '36px 52px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            textAlign: 'center',
            animation: 'splashPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            border: '2px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 20px rgba(22, 163, 74, 0.25)'
            }}>
              <CheckCircle2 size={38} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isSignUp ? 'Account Created!' : 'Welcome Back!'} <Sparkles size={24} color="#F59E0B" />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Authenticating {isSignUp ? name : 'Kasun Perera'}...
            </p>
          </div>
        </div>
      )}

      {/* Sliding Colored Hero Panel (Swaps positions left <-> right) */}
      <div className={`auth-hero-panel ${isSignUp ? 'active-signup' : ''} ${isSplashing ? 'splashing-login' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)' }}>EQ</div>
          <span style={{ fontSize: '22px', fontWeight: 800 }}>EduQuiz Pro</span>
        </div>

        <div>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
            {isSignUp ? 'Join Thousands of Sri Lankan Scholars.' : 'Learn. Practice.\nSucceed.'}
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95, lineHeight: 1.6, maxWidth: '520px' }}>
            {isSignUp
              ? 'Create your free account today to access Grade 5, O/L, and A/L model examination papers with live timed feedback.'
              : 'Prepare smarter for Sri Lankan examinations with timed quizzes, instant results, and detailed step-by-step explanations.'}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn btn-outline"
            style={{ marginTop: '24px', borderColor: 'white', color: 'white', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"} <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ fontSize: '13px', opacity: 0.8 }}>© 2026 EduQuiz Pro Inc. All rights reserved.</div>
      </div>

      {/* Sliding Form Container Panel (Swaps positions right <-> left) */}
      <div className={`auth-form-panel ${isSignUp ? 'active-signup' : ''}`}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px', opacity: isSplashing ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="logo-badge" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '24px' }}>EQ</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              {isSignUp ? 'Create Student Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {isSignUp ? 'Enter your details to register on EduQuiz Pro' : 'Enter your details to access your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label className="form-label">Full Student Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kasun Perera" required disabled={isSplashing} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@school.lk" required disabled={isSplashing} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSplashing} />
            </div>

            {isSignUp && (
              <div className="form-group">
                <label className="form-label">Target Examination Level</label>
                <select className="form-input" value={examLevel} onChange={(e) => setExamLevel(e.target.value)}>
                  <option value="G.C.E. Ordinary Level (O/L)">G.C.E. Ordinary Level (O/L)</option>
                  <option value="G.C.E. Advanced Level (A/L)">G.C.E. Advanced Level (A/L)</option>
                  <option value="Grade 5 Scholarship">Grade 5 Scholarship</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '12px', overflow: 'hidden', position: 'relative' }}
              disabled={isSplashing}
            >
              {isSplashing ? 'Authenticating...' : (isSignUp ? 'Create Account & Sign In' : 'Sign In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
