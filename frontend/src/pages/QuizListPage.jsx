import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Filter, FileText, Clock, Sparkles, CheckCircle2,
  BookOpen, GraduationCap, Award, ChevronDown, ArrowUpDown,
  Star, ShoppingCart, PlayCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EXAM_LEVEL_FILTERS = [
  { id: 'all', label: 'All Exam Levels' },
  { id: 'ol', label: 'O/L (Ordinary Level)' },
  { id: 'al', label: 'A/L (Advanced Level)' },
  { id: 'scholarship', label: 'Grade 5 Scholarship' }
];

const DIFFICULTY_FILTERS = [
  { id: 'all', label: 'All Difficulties' },
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Hard', label: 'Hard' }
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'available', label: 'Available to Buy' },
  { id: 'purchased', label: 'Enrolled / Purchased' },
  { id: 'completed', label: 'Completed' }
];

export default function QuizListPage() {
  const navigate = useNavigate();
  const { purchases, attempts } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'questions' | 'duration'

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getQuizzes();
        if (res.quizzes) setQuizzes(res.quizzes);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamically extract unique subjects from quizzes
  const availableSubjects = useMemo(() => {
    const subjects = new Set();
    quizzes.forEach(q => {
      if (q.subjectName) subjects.add(q.subjectName);
    });
    return ['all', ...Array.from(subjects).sort()];
  }, [quizzes]);

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

  // Filtered & Sorted Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes
      .filter(quiz => {
        // Search query check (title, subject, about, topics)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = quiz.title?.toLowerCase().includes(q);
          const subjectMatch = quiz.subjectName?.toLowerCase().includes(q);
          const aboutMatch = quiz.about?.toLowerCase().includes(q);
          const topicsMatch = quiz.topics?.some(t => t.toLowerCase().includes(q));
          if (!titleMatch && !subjectMatch && !aboutMatch && !topicsMatch) {
            return false;
          }
        }

        // Exam level filter
        if (!matchExamLevel(quiz.examLevel, selectedLevel)) {
          return false;
        }

        // Subject filter
        if (selectedSubject !== 'all' && quiz.subjectName !== selectedSubject) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all' && quiz.difficulty !== selectedDifficulty) {
          return false;
        }

        // Status filter
        const isPurchased = purchases.includes(quiz.id);
        const isCompleted = attempts[quiz.id] !== undefined;

        if (selectedStatus === 'available' && isPurchased) return false;
        if (selectedStatus === 'purchased' && !isPurchased) return false;
        if (selectedStatus === 'completed' && !isCompleted) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'questions') return (b.questionCount || 0) - (a.questionCount || 0);
        if (sortBy === 'duration') return (a.durationMinutes || 0) - (b.durationMinutes || 0);
        return 0; // default
      });
  }, [quizzes, searchQuery, selectedLevel, selectedSubject, selectedDifficulty, selectedStatus, sortBy, purchases, attempts]);

  const hasActiveFilters = searchQuery !== '' || selectedLevel !== 'all' || selectedSubject !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all' || sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedSubject('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSortBy('default');
  };

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-main)' }}>Browse Quizzes</h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              Explore official timed practice papers, unit mocks, and past examinations
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'Paper Available' : 'Papers Available'}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR CONTROLS CARD */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
        
        {/* Search Input Bar */}
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
            placeholder="Search quizzes by paper title, subject, keywords (e.g. Algebra, Physics, Chemistry)..."
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

        {/* Exam Level Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)'
        }}>
          {EXAM_LEVEL_FILTERS.map(lvl => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary-light)' : 'white',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {lvl.id === 'ol' && <BookOpen size={14} />}
                {lvl.id === 'al' && <GraduationCap size={14} />}
                {lvl.id === 'scholarship' && <Award size={14} />}
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Dropdown Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            
            {/* Subject Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Subjects</option>
                {availableSubjects.filter(s => s !== 'all').map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer'
                }}
              >
                {DIFFICULTY_FILTERS.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer'
                }}
              >
                {STATUS_FILTERS.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Right side: Sort By & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="default">Default / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="questions">Most Questions</option>
                <option value="duration">Shortest Duration</option>
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
                Reset Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* QUIZ PAPERS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Loading Examination Papers...</div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px dashed var(--color-border)'
        }}>
          <Search size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            No Quizzes Match Your Search
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            We couldn't find any examination papers matching your active filters. Try searching with different keywords or clearing filters.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleResetFilters}
            style={{ fontSize: '13px', padding: '10px 20px' }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '20px'
        }}>
          {filteredQuizzes.map(quiz => {
            const isPurchased = purchases.includes(quiz.id);
            const isCompleted = attempts[quiz.id] !== undefined;
            const completedScore = isCompleted ? (attempts[quiz.id]?.score ?? attempts[quiz.id]?.percentage) : null;

            // Difficulty color helper
            const getDifficultyStyle = (diff) => {
              if (diff === 'Easy') return { bg: '#DCFCE7', text: '#16A34A' };
              if (diff === 'Hard') return { bg: '#FEE2E2', text: '#EF4444' };
              return { bg: '#FEF3C7', text: '#D97706' };
            };
            const diffStyle = getDifficultyStyle(quiz.difficulty);

            // Exam level badge label
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
                  border: isPurchased ? '1.5px solid #BFDBFE' : '1px solid var(--color-border)',
                  backgroundColor: isPurchased ? '#F8FAFC' : 'white',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '11px', fontWeight: 800 }}>
                        {levelLabel}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: diffStyle.bg,
                          color: diffStyle.text,
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {quiz.difficulty || 'Medium'}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="badge badge-success" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={12} /> Score: {completedScore}%
                      </span>
                    ) : isPurchased ? (
                      <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '11px' }}>
                        Enrolled
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Subject */}
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    lineHeight: 1.35,
                    color: 'var(--color-text-main)',
                    marginBottom: '6px'
                  }}>
                    {quiz.title}
                  </h4>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}>
                    {quiz.subjectName}
                  </p>

                  {quiz.about && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {quiz.about}
                    </p>
                  )}

                  {/* Metadata: Questions, Duration, Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '16px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(241, 245, 249, 0.6)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <FileText size={14} /> {quiz.questionCount || quiz.questions?.length || 30} Qs
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Clock size={14} /> {quiz.durationMinutes || 45} Mins
                    </span>
                    {quiz.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: '#D97706', marginLeft: 'auto' }}>
                        <Star size={13} fill="#D97706" /> {quiz.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Bar: Price & CTA Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Fee</span>
                    <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      LKR {quiz.price || 300}
                    </span>
                  </div>

                  {isCompleted ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/quiz/${quiz.id}/details`)}
                      style={{ fontWeight: 700, fontSize: '13px', padding: '8px 14px' }}
                    >
                      View Results
                    </button>
                  ) : isPurchased ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'var(--color-success)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '13px',
                        padding: '8px 16px'
                      }}
                      onClick={() => navigate(`/quiz/${quiz.id}/details`)}
                    >
                      Start Quiz
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/quiz/${quiz.id}/details`)}
                      style={{ fontWeight: 700, fontSize: '13px', padding: '8px 16px' }}
                    >
                      Buy Quiz
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
