import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, UserPlus, LogIn, XCircle, Sun, Moon, Globe } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser, registerAccount, googleLoginUser } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  
  const [isSplashing, setIsSplashing] = useState(false);
  const [authPanelStatus, setAuthPanelStatus] = useState('success');
  const [activeAccountName, setActiveAccountName] = useState('');
  const [authError, setAuthError] = useState('');

  // Official React Google OAuth Login Hook
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsSplashing(true);
        setAuthPanelStatus('success');
        setAuthError('');

        // Fetch user profile from Google using the access_token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch profile from Google.');
        }

        const profile = await userInfoRes.json();

        const googlePayload = {
          email: profile.email,
          name: profile.name || profile.given_name || 'Google Student',
          sub: profile.sub,
          picture: profile.picture || null
        };

        const nextUser = await googleLoginUser(googlePayload);
        setActiveAccountName(nextUser.name || 'Student');

        setTimeout(() => {
          setIsSplashing(false);
          if (isSignUp) {
            sessionStorage.setItem('eduquiz_new_registration', 'true');
            navigate('/welcome');
          } else {
            sessionStorage.removeItem('eduquiz_new_registration');
            navigate('/dashboard');
          }
        }, 1200);
      } catch (err) {
        setIsSplashing(false);
        setAuthError(err.message || 'Google Authentication failed');
      }
    },
    onError: (errorResponse) => {
      setIsSplashing(false);
      setAuthError('Google Sign-In was cancelled or failed.');
      console.error('Google OAuth Error:', errorResponse);
    }
  });

  const handleGoogleClick = () => {
    setAuthError('');
    triggerGoogleLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setAuthError("Please enter both email and password!");
      return;
    }

    const isAdminAuth = (trimmedEmail === 'admin' || trimmedEmail === 'admin@eduquiz.lk') && (trimmedPass === 'admin@123' || trimmedPass === 'admin');

    if (!isAdminAuth && !EMAIL_REGEX.test(trimmedEmail)) {
      setAuthError("Please enter a valid email address (e.g. name@student.lk)");
      return;
    }

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
            school: school.trim() || 'Sri Lankan School',
            examLevel: 'G.C.E. Ordinary Level (O/L)'
          });
          sessionStorage.setItem('eduquiz_new_registration', 'true');
          nextRoute = '/welcome';
        } else {
          nextUser = await loginUser({
            email: trimmedEmail,
            password: trimmedPass
          });
          sessionStorage.removeItem('eduquiz_new_registration');
          nextRoute = '/dashboard';
        }

        if (nextUser) {
          setActiveAccountName(nextUser.name || trimmedEmail);
          setAuthPanelStatus('success');
          setIsSplashing(true);

          setTimeout(() => {
            setIsSplashing(false);
            navigate(nextRoute);
          }, 1200);
        }
      } catch (err) {
        setIsSplashing(false);
        setAuthError(err.message || "Authentication failed. Please check credentials.");
      }
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>

      {/* Floating Theme and Language Switcher */}
      <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 110 }}>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? t('theme.light') : t('theme.dark')}
          aria-label={t('theme.toggle')}
          style={{ width: '38px', padding: 0 }}
        >
          {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#64748B" />}
        </button>
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
          className="lang-toggle-btn"
          title={t('language.select')}
          aria-label={t('language.select')}
        >
          <Globe size={15} color="var(--color-text-muted)" />
          <span className="lang-badge">{language === 'si' ? 'සිං' : 'EN'}</span>
        </button>
      </div>
      
      {/* Splash Screen Overlay */}
      {isSplashing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            padding: '40px 48px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '420px',
            width: '90%'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: authPanelStatus === 'success' ? 'var(--color-success-light)' : 'var(--color-error-light)',
              color: authPanelStatus === 'success' ? 'var(--color-success)' : 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              animation: 'bounce 1s infinite'
            }}>
              {authPanelStatus === 'success' ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
            </div>
            
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
              {authPanelStatus === 'success'
                ? (language === 'si' ? 'පිවිසුම සාර්ථකයි!' : 'Authentication Successful!')
                : (language === 'si' ? 'දැනුම්දීම' : 'Authentication Notice')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {authPanelStatus === 'success'
                ? (language === 'si'
                    ? <><strong>{activeAccountName}</strong> ලෙස EduQuiz පද්ධතියට පිවිසෙමින්...</>
                    : <>Logging into EduQuiz database as <strong>{activeAccountName}</strong>...</>)
                : (authError || (language === 'si' ? 'ඊමේල් ලිපිනය හෝ මුරපදය වැරදියි.' : 'The username or password is incorrect.'))}
            </p>
          </div>
        </div>
      )}

      {/* Auth Card Container */}
      <div className={`solve-auth-card ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 10px auto' }}>EQ</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)' }}>{t('auth.signUpTitle')}</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{t('auth.signUpDesc')}</p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-block"
              onClick={handleGoogleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: 'var(--color-card-bg)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-main)',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {t('auth.googleSignIn')}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 14px 0' }}>
              <div style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></div>
              <span style={{ padding: '0 10px', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('auth.orEmail')}</span>
              <div style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></div>
            </div>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>{t('auth.fullName')} *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.fullNamePlaceholder')}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>{t('auth.email')} *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@student.lk"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>{t('auth.createPassword')} *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
              <UserPlus size={16} /> {t('auth.registerBtn')}
            </button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="logo-badge" style={{ margin: '0 auto 10px auto' }}>EQ</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)' }}>{t('auth.signInTitle')}</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{t('auth.signInDesc')}</p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-block"
              onClick={handleGoogleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: 'var(--color-card-bg)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-main)',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {t('auth.googleSignIn')}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 14px 0' }}>
              <div style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></div>
              <span style={{ padding: '0 10px', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('auth.orEmail')}</span>
              <div style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></div>
            </div>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>{t('auth.emailOrUser')}</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'si' ? 'ඔබගේ ඊමේල් ලිපිනය ඇතුලත් කරන්න' : 'Enter your email or admin'}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>{t('auth.password')}</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
              <LogIn size={16} /> {t('auth.signInBtn')}
            </button>
          </form>
        </div>

        {/* OVERLAY PANEL */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="overlay-illustration-box">
                <img src="/auth-bg-transparent.png" alt="EduQuiz Illustration" className="overlay-illustration-img" />
              </div>
              <div className="logo-badge" style={{ background: 'white', color: '#4F46E5', margin: '0 auto 10px auto' }}>EQ</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>{t('auth.welcomeBack')}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.5, maxWidth: '300px' }}>
                {t('auth.welcomeBackMsg')}
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>{t('nav.signIn')}</button>
            </div>

            <div className="overlay-panel overlay-right">
              <div className="overlay-illustration-box">
                <img src="/auth-bg-transparent.png" alt="EduQuiz Illustration" className="overlay-illustration-img" />
              </div>
              <div className="logo-badge" style={{ background: 'white', color: '#4F46E5', margin: '0 auto 10px auto' }}>EQ</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>{t('auth.createAccountPrompt')}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.5, maxWidth: '300px' }}>
                {t('auth.createAccountMsg')}
              </p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>{t('auth.registerBtn')}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}