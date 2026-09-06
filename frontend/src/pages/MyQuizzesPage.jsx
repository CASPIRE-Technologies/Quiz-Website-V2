import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, BookOpen, Clock, FileText, CheckCircle2,
  Award, PlayCircle, RotateCcw, AlertCircle, ArrowRight,
  GraduationCap, Filter, Sparkles, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const { purchases, attempts } = useAuth();
  const { t } = useLanguage();

  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const statusFilters = useMemo(() => [
    { id: 'all', label: t('myQuizzes.totalEnrolled') },
    { id: 'pending', label: t('myQuizzes.readyToStart') },
    { id: 'completed', label: t('myQuizzes.completed') }
  ], [t]);

  const examLevelFilters = useMemo(() => [
    { id: 'all', label: t('quizzes.allLevels') },
    { id: 'ol', label: t('quizzes.ol') },
    { id: 'al', label: t('quizzes.al') },
    { id: 'scholarship', label: t('quizzes.scholarship') }
  ], [t]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getQuizzes();
        if (res && res.quizzes) {
          setAllQuizzes(res.quizzes);
        }
      } catch (err) {
        console.error('Failed to load quiz catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Map purchase IDs to rich quiz objects
  const enrolledQuizzes = useMemo(() => {
    const quizMap = new Map();
    allQuizzes.forEach(q => quizMap.set(q.id, q));

    return purchases.map(id => {
      const found = quizMap.get(id);
      if (found) return found;

      // Fallback object if quiz metadata is missing
      return {
        id,
        title: id === 'quiz-math-01' ? 'O/L Algebra & Quadratic Equations Paper 01' : `Exam Paper (${id})`,
        subjectName: 'General Examination',
        examLevel: 'ol',
        questionCount: 30,
        durationMinutes: 45,
        difficulty: 'Medium'
      };
    });
  }, [purchases, allQuizzes]);

  // Extract unique subjects from enrolled quizzes
  const enrolledSubjects = useMemo(() => {
    const subjects = new Set();
    enrolledQuizzes.forEach(q => {
      if (q.subjectName) subjects.add(q.subjectName);
    });
    return ['all', ...Array.from(subjects).sort()];
  }, [enrolledQuizzes]);

  // Normalized helper for exam level matching
  const matchExamLevel = (quizLevel, filter) => {
    if (filter === 'all') return true;
    if (!quizLevel) return false;
    const l = quizLevel.toLowerCase();
    if (filter === 'ol') return l.includes('ol') || l.includes('ordinary');
    if (filter === 'al') return l.includes('al') || l.includes('advanced');
    if (filter === 'scholarship') return l.includes('scholarship') || l.includes('grade 5');
    return l === filter;
  };

  // Filter & sort enrolled quizzes
  const filteredEnrolled = useMemo(() => {
    return enrolledQuizzes
      .filter(quiz => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = quiz.title?.toLowerCase().includes(q);
          const subjMatch = quiz.subjectName?.toLowerCase().includes(q);
          if (!titleMatch && !subjMatch) return false;
        }

        // Status filter
        const isCompleted = attempts[quiz.id] !== undefined;
        if (selectedStatus === 'completed' && !isCompleted) return false;
        if (selectedStatus === 'pending' && isCompleted) return false;

        // Level filter
        if (!matchExamLevel(quiz.examLevel, selectedLevel)) return false;

        // Subject filter
        if (selectedSubject !== 'all' && quiz.subjectName !== selectedSubject) return false;

        return true;
      })
      .sort((a, b) => {
        const aCompleted = attempts[a.id] !== undefined;
        const bCompleted = attempts[b.id] !== undefined;
        const aScore = attempts[a.id]?.score ?? attempts[a.id]?.percentage ?? 0;
        const bScore = attempts[b.id]?.score ?? attempts[b.id]?.percentage ?? 0;

        if (sortBy === 'score-desc') return bScore - aScore;
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        if (sortBy === 'duration') return (a.durationMinutes || 0) - (b.durationMinutes || 0);

        // Default: pending quizzes first, then completed
        if (!aCompleted && bCompleted) return -1;
        if (aCompleted && !bCompleted) return 1;
        return 0;
      });
  }, [enrolledQuizzes, searchQuery, selectedStatus, selectedLevel, selectedSubject, sortBy, attempts]);

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'all' || selectedLevel !== 'all' || selectedSubject !== 'all' || sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedLevel('all');
    setSelectedSubject('all');
    setSortBy('default');
  };

  // Summary counts
  const completedCount = useMemo(() => {
    return enrolledQuizzes.filter(q => attempts[q.id] !== undefined).length;
  }, [enrolledQuizzes, attempts]);

  const pendingCount = enrolledQuizzes.length - completedCount;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)' }}>{t('myQuizzes.title')}</h1>
              <span className="badge badge-primary" style={{ fontSize: '13px' }}>
                {purchases.length} {purchases.length === 1 ? 'Paper' : 'Papers'}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {t('myQuizzes.subtitle')}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/quizzes')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 18px' }}
          >
            <BookOpen size={16} /> {t('myQuizzes.exploreNew')}
          </button>
        </div>
      </div>

      {/* QUICK STATUS PILLS / TABS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div
          className="card"
          onClick={() => setSelectedStatus('all')}
          style={{
            padding: '16px 20px',
            borderLeft: '4px solid var(--color-primary)',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'all' ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.totalEnrolled')}</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '2px' }}>
            {enrolledQuizzes.length}
          </div>
        </div>

        <div
          className="card"
          onClick={() => setSelectedStatus('pending')}
          style={{
            padding: '16px 20px',
            borderLeft: '4px solid #2563EB',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'pending' ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.readyToStart')}</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
            {pendingCount}
          </div>
        </div>

        <div
          className="card"
          onClick={() => setSelectedStatus('completed')}
          style={{
            padding: '16px 20px',
            borderLeft: '4px solid var(--color-success)',
            cursor: 'pointer',
            backgroundColor: selectedStatus === 'completed' ? 'var(--color-success-light)' : 'var(--color-card-bg)',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.completed')}</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>
            {completedCount}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      {enrolledQuizzes.length > 0 && (
        <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search
              size={18}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('myQuizzes.searchPlaceholder')}
              style={{
                paddingLeft: '44px',
                paddingRight: searchQuery ? '40px' : '16px',
                height: '46px',
                fontSize: '14px',
                borderRadius: '12px'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Bar Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              
              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.statusFilter')}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-card-bg)',
                    color: 'var(--color-text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {statusFilters.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Exam Level Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.levelFilter')}</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-card-bg)',
                    color: 'var(--color-text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {examLevelFilters.map(lvl => (
                    <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter (if multiple subjects exist) */}
              {enrolledSubjects.length > 2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.subjectFilter')}</span>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '13px',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">{t('quizzes.allSubjects')}</option>
                    {enrolledSubjects.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            {/* Sort & Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('myQuizzes.sortFilter')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-card-bg)',
                    color: 'var(--color-text-main)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="default">{t('myQuizzes.sortPendingFirst')}</option>
                  <option value="score-desc">{t('myQuizzes.sortHighScore')}</option>
                  <option value="title-asc">{t('myQuizzes.sortTitleAsc')}</option>
                  <option value="duration">{t('myQuizzes.sortDuration')}</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-primary)',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('quizzes.resetFilters')}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ENROLLED QUIZZES GRID OR EMPTY STATES */}
      {enrolledQuizzes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: '16px',
          border: '1px dashed var(--color-border)'
        }}>
          <BookOpen size={52} color="var(--color-primary)" style={{ margin: '0 auto 16px auto', opacity: 0.6 }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            {t('myQuizzes.noEnrolledTitle')}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 20px auto' }}>
            {t('myQuizzes.noEnrolledDesc')}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/quizzes')}
            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
          >
            {t('myQuizzes.browseBtn')}
          </button>
        </div>
      ) : filteredEnrolled.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 24px',
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: '16px',
          border: '1px dashed var(--color-border)'
        }}>
          <Search size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 14px auto', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
            {t('myQuizzes.noMatchTitle')}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '380px', margin: '0 auto 16px auto' }}>
            {t('myQuizzes.noMatchDesc')}
          </p>
          <button
            className="btn btn-secondary"
            onClick={handleResetFilters}
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            {t('quizzes.clearFilters')}
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredEnrolled.map(quiz => {
            const isCompleted = attempts[quiz.id] !== undefined;
            const attemptResult = attempts[quiz.id];
            const scorePercent = isCompleted ? (attemptResult?.score ?? attemptResult?.percentage ?? 0) : 0;

            const levelLabel = quiz.examLevel ? quiz.examLevel.toUpperCase() : 'EXAM';

            return (
              <div
                key={quiz.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '22px',
                  borderRadius: '16px',
                  border: isCompleted ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card-bg)',
                  overflow: 'hidden'
                }}
              >
                <div>
                  {/* Status Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 800 }}>
                      {levelLabel}
                    </span>

                    {isCompleted ? (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> {t('quizzes.completed')}
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                        {t('myQuizzes.readyToStart')}
                      </span>
                    )}
                  </div>

                  {/* Title & Subject */}
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    lineHeight: 1.35,
                    color: 'var(--color-text-main)',
                    marginBottom: '4px'
                  }}>
                    {quiz.title}
                  </h4>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    marginBottom: '14px'
                  }}>
                    {quiz.subjectName}
                  </p>

                  {/* Completed Score Ribbon */}
                  {isCompleted ? (
                    <div style={{
                      backgroundColor: 'var(--color-bg)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('quizzes.scoreBadge')}</span>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: scorePercent >= 75 ? '#16A34A' : scorePercent >= 50 ? '#D97706' : '#EF4444'
                      }}>
                        {scorePercent}%
                      </span>
                    </div>
                  ) : null}

                  {/* Meta Specs */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '16px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} /> {quiz.questionCount || 30} {t('quizzes.qs')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {quiz.durationMinutes || 45} {t('quizzes.mins')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%'
                }}>
                  {isCompleted ? (
                    <>
                      <button
                        className="btn btn-primary btn-block btn-sm"
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          padding: '9px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onClick={() => navigate(`/quiz/${quiz.id}/instructions`)}
                      >
                        <RotateCcw size={14} /> {t('myQuizzes.retakeQuiz')}
                      </button>

                      <button
                        className="btn btn-outline btn-block btn-sm"
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          padding: '9px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onClick={() => navigate(`/quiz/${quiz.id}/result`)}
                      >
                        <Award size={14} /> {t('common.viewResults')}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-block btn-sm"
                      style={{
                        fontWeight: 700,
                        fontSize: '13px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onClick={() => navigate(`/quiz/${quiz.id}/instructions`)}
                    >
                      <PlayCircle size={15} /> {t('myQuizzes.startQuiz')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
