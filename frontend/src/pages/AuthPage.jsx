import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser, registerAccount } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [examLevel, setExamLevel] = useState('G.C.E. Ordinary Level (O/L)');
  const [school, setSchool] = useState('');
  
  const [isSplashing, setIsSplashing] = useState(false);
  const [activeAccountName, setActiveAccountName] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSplashing(true);

    const isAdminAuth = (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@eduquiz.lk') && password.trim() === 'admin@123';

    setTimeout(() => {
      if (isAdminAuth) {
        setActiveAccountName('System Administrator');
        loginUser({
          email: 'admin@eduquiz.lk',
          password: 'admin@123'
        });
        window.open('/admin', '_blank');
        navigate('/dashboard');
      } else if (isSignUp) {
        // Register brand new user account
        const registered = registerAccount({
          name: name.trim() || 'New Student',
          email: email.trim(),
          password: password.trim(),
          examLevel,
          school: school.trim() || 'Sri Lankan School'
        });
        setActiveAccountName(registered.name);
        navigate('/dashboard');
      } else {
        // Sign in existing registered account
        const loggedIn = loginUser({
          email: email.trim(),
          password: password.trim()
        });
        setActiveAccountName(loggedIn.name);
        navigate('/dashboard');
      }
    }, 950);
  };

  const fillAdminCredentials = () => {
    setEmail('admin');
    setPassword('admin@123');
    setIsAdminMode(true);
  };

  const fillDemoStudent = () => {
    setEmail('kasun.perera@student.lk');
    setPassword('password123');
    setIsAdminMode(false);
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
              {isSignUp ? 'Registration Successful!' : 'Welcome Back!'} <Sparkles size={24} color="#F59E0B" />
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Logging in as <strong>{activeAccountName || name || 'Registered Account'}</strong>...
            </p>
          </div>
        </div>
      )}

      {/* Main Solve It Smart Animated Auth Card Container */}
      <div className={`solve-auth-card ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Create Your Account</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Register your personal student account</p>
            </div>

            <div className="form-group">
              <label className="form-label">Full Student Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amal Perera"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address / Username</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amal@student.lk"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Examination Level</label>
              <select className="form-input" value={examLevel} onChange={(e) => setExamLevel(e.target.value)}>
                <option value="G.C.E. Ordinary Level (O/L)">G.C.E. Ordinary Level (O/L)</option>
                <option value="G.C.E. Advanced Level (A/L)">G.C.E. Advanced Level (A/L)</option>
                <option value="Grade 5 Scholarship">Grade 5 Scholarship</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px' }}>
              Register & Access Dashboard
            </button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>
                {isAdminMode ? 'Admin Console Login' : 'Sign In'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {isAdminMode ? 'Opens Admin Panel in a separate standalone window' : 'Sign in with your registered account'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Email / Username</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kasun.perera@student.lk or admin"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '16px' }}>
              {isAdminMode ? 'Launch Standalone Admin Window' : 'Sign In to My Account'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={fillDemoStudent}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                Kasun Account
              </button>
              <button
                type="button"
                onClick={fillAdminCredentials}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ShieldCheck size={14} /> Admin Account (admin)
              </button>
            </div>
          </form>
        </div>

        {/* OVERLAY SLIDING PANEL */}
        <div className="overlay-container">
          <div className="overlay">
            
            <div className="overlay-panel overlay-left">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Welcome Back!</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                Sign in with your registered student account to access your model papers
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Hello, Scholar!</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                Register your own personal account to begin timed quizzes and track results
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>
                Create Account
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
