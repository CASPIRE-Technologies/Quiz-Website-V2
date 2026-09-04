import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User, Mail, Phone, School, GraduationCap, Award, CheckCircle2,
  Save, Edit3, Clock, CreditCard, BookOpen, ShieldCheck, Sparkles,
  AlertCircle, Camera, Check, ExternalLink, ArrowRight, RefreshCw
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'avatar-blue', name: 'Blue Scholar', bg: 'linear-gradient(135deg, #2563EB, #1D4ED8)', icon: '🎓' },
  { id: 'avatar-purple', name: 'Purple Genius', bg: 'linear-gradient(135deg, #7C3AED, #6D28D9)', icon: '⭐' },
  { id: 'avatar-amber', name: 'Amber Achiever', bg: 'linear-gradient(135deg, #D97706, #B45309)', icon: '🏆' },
  { id: 'avatar-emerald', name: 'Emerald Scientist', bg: 'linear-gradient(135deg, #059669, #047857)', icon: '🔬' },
  { id: 'avatar-rose', name: 'Rose Explorer', bg: 'linear-gradient(135deg, #E11D48, #BE123C)', icon: '💡' },
];

const EXAM_LEVEL_OPTIONS = [
  {
    id: 'G.C.E. Ordinary Level (O/L)',
    title: 'G.C.E. Ordinary Level (O/L)',
    badge: 'Secondary',
    desc: 'Mathematics, Science, English, Sinhala/Tamil, History'
  },
  {
    id: 'G.C.E. Advanced Level (A/L)',
    title: 'G.C.E. Advanced Level (A/L)',
    badge: 'Senior Secondary',
    desc: 'Physical Science, Bio Science, Commerce, Arts, Tech'
  },
  {
    id: 'Grade 5 Scholarship',
    title: 'Grade 5 Scholarship',
    badge: 'Primary',
    desc: 'IQ logic, visual reasoning, pattern recognition & GK'
  }
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile, attempts, purchases } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'receipts'
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    school: '',
    examLevel: 'G.C.E. Ordinary Level (O/L)',
    avatarUrl: ''
  });

  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState('avatar-blue');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Sync state with current user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        school: user.school || 'Sri Lankan School',
        examLevel: user.examLevel || 'G.C.E. Ordinary Level (O/L)',
        avatarUrl: user.avatarUrl || ''
      });
      if (user.avatarUrl && user.avatarUrl.startsWith('preset:')) {
        setSelectedAvatarPreset(user.avatarUrl.replace('preset:', ''));
      }
    }
  }, [user]);

  // Fetch full profile info from backend
  useEffect(() => {
    let isMounted = true;
    const fetchBackendProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await api.getProfile();
        if (isMounted && res && res.success && res.user) {
          setProfileData(res.user);
        }
      } catch (err) {
        // Fallback gracefully to local auth data
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };
    fetchBackendProfile();
    return () => { isMounted = false; };
  }, [user?.email]);

  // Derived Performance Metrics
  const metrics = useMemo(() => {
    const attemptKeys = Object.keys(attempts || {});
    const totalAttempted = profileData?.quizzesCompleted ?? attemptKeys.length;
    const totalPurchased = profileData?.quizzesPurchased ?? (purchases || []).length;
    
    let avg = profileData?.averageScore;
    if (avg === undefined) {
      const scores = Object.values(attempts || {}).map(a => a?.score ?? a?.percentage ?? 0);
      avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    return {
      quizzesAttempted: totalAttempted,
      quizzesPurchased: totalPurchased,
      averageScore: avg
    };
  }, [attempts, purchases, profileData]);

  // Form submission handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setSaveError('');

    if (!formData.name.trim()) {
      setSaveError('Full Name is required.');
      return;
    }

    setIsSaving(true);
    try {
      let finalAvatar = formData.avatarUrl;
      if (!finalAvatar && selectedAvatarPreset) {
        finalAvatar = `preset:${selectedAvatarPreset}`;
      }

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        school: formData.school.trim(),
        examLevel: formData.examLevel,
        avatarUrl: finalAvatar
      };

      const updated = await updateUserProfile(payload);
      if (updated) {
        setSaveSuccess('Student profile updated successfully!');
        setTimeout(() => {
          setSaveSuccess('');
          setActiveTab('overview');
        }, 1500);
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to update student profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to render user avatar
  const renderAvatar = (size = 80, fontSize = 32) => {
    const customUrl = formData.avatarUrl || user?.avatarUrl;
    if (customUrl && !customUrl.startsWith('preset:')) {
      return (
        <img
          src={customUrl}
          alt={user?.name || 'Student Avatar'}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }

    const presetId = customUrl?.startsWith('preset:') 
      ? customUrl.replace('preset:', '') 
      : selectedAvatarPreset;
    const preset = AVATAR_PRESETS.find(p => p.id === presetId) || AVATAR_PRESETS[0];

    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: preset.bg,
        color: 'white',
        fontSize: `${fontSize}px`,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid white',
        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
        position: 'relative'
      }}>
        {preset.icon || (user?.name ? user.name.charAt(0).toUpperCase() : 'S')}
      </div>
    );
  };

  const receiptsList = profileData?.paymentHistory || [];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)' }}>Student Profile</h1>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Student Account
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Manage your personal credentials, track academic test progress, and view transaction history
          </p>
        </div>

        {/* Quick Tab Controls */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'overview' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'overview' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            <User size={15} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'edit' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'edit' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            <Edit3 size={15} /> Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'receipts' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'receipts' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            <CreditCard size={15} /> Receipts ({receiptsList.length})
          </button>
        </div>
      </div>

      {/* Success / Error Notification Banners */}
      {saveSuccess && (
        <div style={{
          backgroundColor: 'var(--color-success-light)',
          color: 'var(--color-success)',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={18} /> {saveSuccess}
        </div>
      )}

      {saveError && (
        <div style={{
          backgroundColor: 'var(--color-error-light)',
          color: 'var(--color-error)',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <AlertCircle size={18} /> {saveError}
        </div>
      )}

      {/* Hero Student Banner Card */}
      <div className="card" style={{
        padding: '28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Accent */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', position: 'relative' }}>
          {renderAvatar(88, 36)}

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {user?.name || 'Student Learner'}
              </h2>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>Active Member</span>
              {user?.provider === 'google' && (
                <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4338CA', fontSize: '11px' }}>
                  Google Linked
                </span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={15} /> {user?.email || 'No email attached'}
              </span>
              {user?.phone && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={15} /> {user?.phone}
                </span>
              )}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}>
                <GraduationCap size={14} /> {user?.examLevel || 'Exam Level Unassigned'}
              </span>
              <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}>
                <School size={14} /> {user?.school || 'Sri Lankan School'}
              </span>
            </div>
          </div>

          {activeTab !== 'edit' && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('edit')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #2563EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Exam Stream</span>
                <GraduationCap size={20} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {user?.examLevel ? user.examLevel.split('(')[0].trim() : 'O/L'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Target Examination</p>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #7C3AED' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Quizzes Attempted</span>
                <BookOpen size={20} color="#7C3AED" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {metrics.quizzesAttempted}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Completed Test Papers</p>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #16A34A' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Average Score</span>
                <Award size={20} color="#16A34A" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {metrics.averageScore}%
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Overall Quiz Accuracy</p>
            </div>

            <div className="card" style={{ padding: '20px', borderLeft: '4px solid #D97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Quizzes Enrolled</span>
                <CreditCard size={20} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {metrics.quizzesPurchased}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Purchased Papers</p>
            </div>
          </div>

          {/* Detailed Information Panels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Personal Details */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--color-primary)" /> Personal Credentials
                </h3>
                <span className="badge badge-neutral" style={{ fontSize: '11px' }}>Read-only summary</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>{user?.name}</p>
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>{user?.email}</p>
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {user?.phone ? user.phone : <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Not specified (tap edit to add)</span>}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Authentication Provider</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {user?.provider || 'Standard Local Account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <School size={18} color="var(--color-secondary)" /> Academic Info
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>Sri Lanka</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Current Exam Level</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
                    {user?.examLevel || 'Not selected'}
                  </p>
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>School or Institute</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {user?.school || 'Sri Lankan School'}
                  </p>
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Account Role</span>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {user?.role || 'Student'}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Learning Dashboard Access</span>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Full access to quizzes, real-time timer simulations, and result review analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeTab === 'edit' && (
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)' }}>Edit Profile Details</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Keep your student information up to date across EduQuiz
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab('overview')}
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleProfileSubmit}>
            {/* Avatar Selection Section */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)', display: 'block', marginBottom: '10px' }}>
                Profile Avatar Style
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                {AVATAR_PRESETS.map(preset => {
                  const isSelected = selectedAvatarPreset === preset.id && (!formData.avatarUrl || formData.avatarUrl.startsWith('preset:'));
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarPreset(preset.id);
                        setFormData(prev => ({ ...prev, avatarUrl: `preset:${preset.id}` }));
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: preset.bg,
                        color: 'white',
                        fontSize: '22px',
                        border: isSelected ? '3px solid var(--color-primary)' : '2px solid transparent',
                        boxShadow: isSelected ? '0 0 0 3px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      title={preset.name}
                    >
                      {preset.icon}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white'
                        }}>
                          <Check size={11} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Image URL */}
              <div style={{ maxWidth: '460px' }}>
                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Or enter custom Avatar image URL (optional)
                </label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.avatarUrl.startsWith('preset:') ? '' : formData.avatarUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Input Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} /> Full Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ashan Nuwantha"
                  required
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} /> Email Address (Account Identifier)
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                  Email is locked to protect your quiz purchase history and credentials.
                </span>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} /> Contact Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                />
              </div>

              {/* School / Institution */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <School size={15} /> School / Educational Institution
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  placeholder="e.g. Royal College / Ananda College"
                />
              </div>
            </div>

            {/* Examination Level Selector */}
            <div style={{ marginBottom: '28px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <GraduationCap size={15} /> Targeted Examination Level *
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px'
              }}>
                {EXAM_LEVEL_OPTIONS.map(opt => {
                  const isSelected = formData.examLevel === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(prev => ({ ...prev, examLevel: opt.id }))}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)' }}>
                          {opt.title}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{opt.badge}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  opacity: isSaving ? 0.7 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('overview')}
                style={{ padding: '12px 20px', borderRadius: '10px', fontSize: '14px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: RECEIPTS & ORDERS */}
      {activeTab === 'receipts' && (
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--color-primary)" /> Payment Receipts & Transactions
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Official receipts for all unlocked timed quiz papers and mock examinations
              </p>
            </div>
            <button
              onClick={() => navigate('/quizzes')}
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              Browse All Quizzes
            </button>
          </div>

          {receiptsList.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              border: '1px dashed var(--color-border)'
            }}>
              <CreditCard size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 14px auto', opacity: 0.5 }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                No Payment Receipts Yet
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '380px', margin: '0 auto 16px auto' }}>
                When you enroll in premium quiz papers, your official transaction receipts and invoices will be cataloged here.
              </p>
              <button
                onClick={() => navigate('/quizzes')}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '10px 20px' }}
              >
                Explore Available Quizzes
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Transaction ID</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Quiz Paper</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Date</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Amount</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Payment Gateway</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptsList.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(248, 250, 252, 0.6)'
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                        {item.id}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {item.quizTitle}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        {item.date || 'Recent'}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        {item.amount}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>
                        {item.gateway || 'Card Payment'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> {item.status || 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
