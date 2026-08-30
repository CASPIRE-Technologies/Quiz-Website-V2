import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Sparkles, UserPlus, LogIn, XCircle } from 'lucide-react';

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
  const [authPanelStatus, setAuthPanelStatus] = useState('success');
  const [activeAccountName, setActiveAccountName] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      alert("Please enter both email/username and password!");
      return;
    }

    const isAdminAuth = (trimmedEmail === 'admin' || trimmedEmail === 'admin@eduquiz.lk') && (trimmedPass === 'admin@123' || trimmedPass === 'admin');

    setIsSplashing(false);
    setAuthError('');
    setActiveAccountName('');

    setTimeout(async () => {
      try {
        let nextUser;
        let nextRoute = '/dashboard';

        if (isAdminAuth) {
          nextUser = await loginUser({
            email: trimmedEmail,
            password: trimmedPass
          });
          nextRoute = '/admin';
        } else if (isSignUp) {
          nextUser = await registerAccount({
            name: name.trim() || 'New Student',
            email: trimmedEmail,
            password: trimmedPass,
            examLevel,
            school: school.trim() || 'Sri Lankan School'
          });
        } else {
          nextUser = await loginUser({
            email: trimmedEmail,
            password: trimmedPass
          });
        }

        setAuthPanelStatus('success');
        setActiveAccountName(nextUser.name || nextUser.email || 'Student');
        setIsSplashing(true);
        setTimeout(() => navigate(nextRoute), 900);
      } catch (err) {
        setActiveAccountName('');
        setAuthPanelStatus('error');
        setAuthError(err.message || 'Invalid username or password');
        setIsSplashing(true);
        setTimeout(() => setIsSplashing(false), 1400);
      }
    }, 800);
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
            background: authPanelStatus === 'success'
              ? 'radial-gradient(circle, #7C3AED 0%, #2563EB 40%, #10B981 70%, #EC4899 100%)'
              : 'radial-gradient(circle, #FEE2E2 0%, #F97316 35%, #EF4444 70%, #991B1B 100%)',
            animation: 'circleSplashExpand 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            boxShadow: authPanelStatus === 'success'
              ? '0 0 120px rgba(124, 58, 237, 0.9)'
              : '0 0 120px rgba(239, 68, 68, 0.75)'
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
            animation: 'splashPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            border: '2px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: authPanelStatus === 'success' ? 'var(--color-success-light)' : 'var(--color-error-light)',
              color: authPanelStatus === 'success' ? 'var(--color-success)' : 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              {authPanelStatus === 'success' ? <CheckCircle2 size={38} /> : <XCircle size={38} />}
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {authPanelStatus === 'success'
                ? (activeAccountName === 'System Administrator' ? 'Admin Access Granted!' : `Welcome, ${activeAccountName}!`)
                : 'Incorrect Login'} {authPanelStatus === 'success' && <Sparkles size={24} color="#F59E0B" />}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {authPanelStatus === 'success'
                ? <>Logging into Supabase database as <strong>{activeAccountName}</strong>...</>
                : (authError || 'The username or password is incorrect.')}
            </p>
          </div>
        </div>
      )}

      {/* Main Solve It Smart Animated Auth Card Container */}
      <div className={`solve-auth-card ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* REAL SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Create Real Account</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Register your personal student account on Supabase</p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@student.lk"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password *</label>
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
              <label className="form-label">Examination Level</label>
              <select className="form-input" value={examLevel} onChange={(e) => setExamLevel(e.target.value)}>
                <option value="G.C.E. Ordinary Level (O/L)">G.C.E. Ordinary Level (O/L)</option>
                <option value="G.C.E. Advanced Level (A/L)">G.C.E. Advanced Level (A/L)</option>
                <option value="Grade 5 Scholarship">Grade 5 Scholarship</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px' }}>
              <UserPlus size={18} /> Register Real Account
            </button>
          </form>
        </div>

        {/* REAL SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>EQ</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Student & Admin Sign In</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Sign in with your registered account credentials
              </p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or admin"
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
              <LogIn size={18} /> Sign In to My Account
            </button>
          </form>
        </div>

        {/* OVERLAY SLIDING PANEL */}
        <div className="overlay-container">
          <div className="overlay">
            
            <div className="overlay-panel overlay-left">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Welcome Back!</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                Sign in with your registered student account to access model papers and track performance
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <div className="logo-badge" style={{ background: 'white', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>EQ</div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>Create Real Account</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, maxWidth: '320px' }}>
                Register your own personal account to begin timed quizzes and save your results to Supabase
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
