import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Kasun Perera');
  const [email, setEmail] = useState('kasun.perera@student.lk');
  const [password, setPassword] = useState('password123');
  const [examLevel, setExamLevel] = useState('G.C.E. Ordinary Level (O/L)');
  const [isSplashing, setIsSplashing] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSplashing(true);

    const isAdminAuth = (email.trim() === 'admin' || email.trim() === 'admin@eduquiz.lk') && password.trim() === 'admin@123';

    setTimeout(() => {
      if (isAdminAuth) {
        loginUser({
          name: 'System Administrator',
          email: 'admin@eduquiz.lk',
          phone: '+94 11 200 0000',
          role: 'admin',
          examLevel: 'Administrator'
        });
        navigate('/admin');
      } else {
        loginUser({
          name: isSignUp ? name : 'Kasun Perera',
          email,
          phone: '+94 77 123 4567',
          role: 'student',
          examLevel,
          school: 'Ananda College, Colombo'
        });
        navigate('/dashboard');
      }
    }, 950);
  };

  const fillAdminCredentials = () => {
    setEmail('admin');
    setPassword('admin@123');
    setIsAdminMode(true);
  };

  return (
    <div className="solve-auth-stage">
      {/* Dynamic Liquid Color Splash Overlay */}
      {isSplashing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #7C3AED 0%, #2563EB 40%, #10B981 70%, #EC4899 100%)',
            animation: 'circleSplashExpand 0.95s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            boxShadow: '0 0 120px rgba(124, 58, 237, 0.9)'
          }} />

          <div style={{
            position: 'relative',
            zIndex: 1000,
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
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={38} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {email === 'admin' ? 'Admin Access Granted!' : (isSignUp ? 'Account Created!' : 'Welcome Back!')} <Sparkles size={24} color="#F59E0B" />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Logging into EduQuiz Pro...
            </p>
          </div>
        </div>
      )}

      {/* Main Solve It Smart Animated Auth Card Container */}
      <div className={`solve-auth-card ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* SIGN UP FORM (Left side when active) */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Create Account</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Use your email for registration</p>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email or Phone</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Exam Level</label>
              <select className="form-input" value={examLevel} onChange={(e) => setExamLevel(e.target.value)}>
                <option value="G.C.E. Ordinary Level (O/L)">G.C.E. Ordinary Level (O/L)</option>
                <option value="G.C.E. Advanced Level (A/L)">G.C.E. Advanced Level (A/L)</option>
                <option value="Grade 5 Scholarship">Grade 5 Scholarship</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px' }}>
              Sign Up
            </button>
          </form>
        </div>

        {/* SIGN IN FORM (Right side when active) */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>
                {isAdminMode ? 'Admin Portal Login' : 'Welcome Back'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {isAdminMode ? 'Sign in with administrator credentials' : 'Enter your details to sign in'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Email / Username</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin or student@lk" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '16px' }}>
              {isAdminMode ? 'Login as Administrator' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={fillAdminCredentials}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ShieldCheck size={14} /> Quick Admin Login (admin / admin@123)
              </button>
            </div>
          </form>
        </div>

        {/* OVERLAY SLIDING PANEL (Slides left <-> right) */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* OVERLAY LEFT (Shown when Sign Up form is active) */}
            <div className="overlay-panel overlay-left">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Welcome Back!</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                To keep connected with us please sign in with your student credentials
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>

            {/* OVERLAY RIGHT (Shown when Sign In form is active) */}
            <div className="overlay-panel overlay-right">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Hello, Student!</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                Enter your details and start your examination preparation journey with EduQuiz Pro
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
