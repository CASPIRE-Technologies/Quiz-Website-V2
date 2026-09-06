import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen, GraduationCap, Search, X, ChevronRight, ArrowLeft,
  FileText, ExternalLink, Download, Eye, Sparkles, CheckCircle2,
  Layers, Filter, Clock, BookMarked, Compass, Award, Share2,
  Check, ArrowRight, HelpCircle
} from 'lucide-react';
import {
  EDUCATION_LEVELS,
  AL_STREAMS,
  SUBJECTS_DATA,
  BOOKS_DATA
} from '../data/educationResourcesData';
import { useLanguage } from '../context/LanguageContext';

export default function EducationResourcesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();

  // Navigation state driven by URL or local state
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || null); // 'ol' | 'al' | null
  const [selectedStream, setSelectedStream] = useState(searchParams.get('stream') || null); // 'physical' | 'bio' | etc.
  const [selectedSubjectId, setSelectedSubjectId] = useState(searchParams.get('subject') || null); // 'ol-math' | etc.

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedium, setFilterMedium] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Modal / Deep-dive state
  const [activeModalBook, setActiveModalBook] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [expandedSyllabusBookId, setExpandedSyllabusBookId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state to URL parameters smoothly
  useEffect(() => {
    const params = {};
    if (selectedLevel) params.level = selectedLevel;
    if (selectedStream) params.stream = selectedStream;
    if (selectedSubjectId) params.subject = selectedSubjectId;
    setSearchParams(params, { replace: true });
  }, [selectedLevel, selectedStream, selectedSubjectId, setSearchParams]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModalBook) {
        setActiveModalBook(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalBook]);

  // Derived current subject object
  const currentSubject = selectedSubjectId ? SUBJECTS_DATA[selectedSubjectId] : null;

  // Derived current stream object
  const currentStream = selectedStream ? AL_STREAMS.find(s => s.id === selectedStream) : null;

  // Available subjects for the current view
  const currentSubjectsList = useMemo(() => {
    if (!selectedLevel) return [];
    if (selectedLevel === 'ol') {
      return Object.values(SUBJECTS_DATA).filter(s => s.level === 'ol');
    }
    if (selectedLevel === 'al') {
      if (selectedStream) {
        const stream = AL_STREAMS.find(s => s.id === selectedStream);
        if (!stream) return [];
        return stream.subjectIds.map(id => SUBJECTS_DATA[id]).filter(Boolean);
      }
      return Object.values(SUBJECTS_DATA).filter(s => s.level === 'al');
    }
    return [];
  }, [selectedLevel, selectedStream]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    let list = BOOKS_DATA;

    // Filter by subject if a subject is selected
    if (selectedSubjectId) {
      list = list.filter(b => b.subjectId === selectedSubjectId);
    } else if (selectedLevel) {
      list = list.filter(b => b.level === selectedLevel);
      if (selectedLevel === 'al' && selectedStream) {
        const stream = AL_STREAMS.find(s => s.id === selectedStream);
        if (stream) {
          list = list.filter(b => stream.subjectIds.includes(b.subjectId));
        }
      }
    }

    // Filter by medium
    if (filterMedium !== 'all') {
      list = list.filter(b => b.medium.toLowerCase().includes(filterMedium.toLowerCase()));
    }

    // Filter by type
    if (filterType !== 'all') {
      list = list.filter(b => b.type === filterType);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => {
        const titleMatch = b.title.toLowerCase().includes(q);
        const subMatch = b.subtitle?.toLowerCase().includes(q);
        const pubMatch = b.publisher.toLowerCase().includes(q);
        const subjectObj = SUBJECTS_DATA[b.subjectId];
        const subjectMatch = subjectObj?.name.toLowerCase().includes(q);
        const chapterMatch = b.chapters?.some(c =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.keyConcepts?.some(k => k.toLowerCase().includes(q))
        );
        return titleMatch || subMatch || pubMatch || subjectMatch || chapterMatch;
      });
    }

    return list;
  }, [selectedSubjectId, selectedLevel, selectedStream, filterMedium, filterType, searchQuery]);

  // Reset helpers
  const handleResetToLevels = () => {
    setSelectedLevel(null);
    setSelectedStream(null);
    setSelectedSubjectId(null);
    setExpandedSyllabusBookId(null);
  };

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setSelectedStream(null);
    setSelectedSubjectId(null);
    setExpandedSyllabusBookId(null);
  };

  const handleSelectStream = (streamId) => {
    setSelectedStream(streamId);
    setSelectedSubjectId(null);
    setExpandedSyllabusBookId(null);
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setExpandedSyllabusBookId(null);
  };

  const handleOpenBookModal = (book, chapterIdx = 0) => {
    setActiveModalBook(book);
    setActiveChapterIndex(chapterIdx);
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="resources-page" style={{ paddingBottom: '60px' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO & HEADER BANNER
          ═══════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '24px',
        padding: '36px 32px',
        color: 'white',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
      }}>
        {/* Background decorative glowing circles */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '25%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '14px',
            color: '#93C5FD',
          }}>
            <BookMarked size={16} /> {t('resources.badge')}
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '10px',
            letterSpacing: '-0.5px'
          }}>
            {t('resources.title')}
          </h1>

          <p style={{
            fontSize: '15px',
            color: '#94A3B8',
            maxWidth: '720px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            {t('resources.subtitle')}
          </p>

          {/* Quick Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '6px 16px',
            maxWidth: '680px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            <Search size={20} color="var(--color-text-muted)" style={{ flexShrink: 0, marginRight: '10px' }} />
            <input
              type="text"
              placeholder={t('resources.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                color: 'var(--color-text-main)',
                backgroundColor: 'transparent',
                padding: '8px 0',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE BREADCRUMB NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <nav aria-label="Breadcrumb" style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px 18px',
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        marginBottom: '24px',
        fontSize: '13px',
      }}>
        <button
          onClick={handleResetToLevels}
          style={{
            background: 'none',
            border: 'none',
            color: selectedLevel ? 'var(--color-primary)' : 'var(--color-text-main)',
            fontWeight: selectedLevel ? 600 : 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          <Compass size={15} /> All Resources
        </button>

        {selectedLevel && (
          <>
            <ChevronRight size={14} color="var(--color-text-muted)" />
            <button
              onClick={() => {
                setSelectedStream(null);
                setSelectedSubjectId(null);
                setExpandedSyllabusBookId(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: (selectedStream || selectedSubjectId) ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: (selectedStream || selectedSubjectId) ? 600 : 700,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              {selectedLevel === 'ol' ? 'O/L (Ordinary Level)' : 'A/L (Advanced Level)'}
            </button>
          </>
        )}

        {selectedLevel === 'al' && selectedStream && (
          <>
            <ChevronRight size={14} color="var(--color-text-muted)" />
            <button
              onClick={() => {
                setSelectedSubjectId(null);
                setExpandedSyllabusBookId(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: selectedSubjectId ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: selectedSubjectId ? 600 : 700,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              {currentStream?.name || selectedStream}
            </button>
          </>
        )}

        {currentSubject && (
          <>
            <ChevronRight size={14} color="var(--color-text-muted)" />
            <span style={{
              color: 'var(--color-text-main)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>{currentSubject.icon}</span> {currentSubject.name}
            </span>
          </>
        )}

        {/* Share / Copy link button on the right */}
        <button
          onClick={handleCopyShare}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title="Copy page link"
        >
          {copiedLink ? <Check size={13} color="var(--color-success)" /> : <Share2 size={13} />}
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          FILTER PILLS (Medium & Resource Type)
          ═══════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> {language === 'si' ? 'මාධ්‍යය:' : 'Medium:'}
          </span>
          {[
            { id: 'all', label: t('resources.allMediums') },
            { id: 'English', label: t('resources.englishMedium') },
            { id: 'Sinhala', label: t('resources.sinhalaMedium') }
          ].map(({ id: med, label }) => (
            <button
              key={med}
              onClick={() => setFilterMedium(med)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterMedium === med ? 'var(--color-primary)' : 'var(--color-card-bg)',
                color: filterMedium === med ? 'white' : 'var(--color-text-muted)',
                boxShadow: filterMedium === med ? '0 2px 6px rgba(37,99,235,0.25)' : 'none',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: filterMedium === med ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            {language === 'si' ? 'වර්ගය:' : 'Format:'}
          </span>
          {[
            { id: 'all', label: t('resources.allTypes') },
            { id: 'Textbook', label: t('resources.textbook') },
            { id: 'Resource Book', label: t('resources.resourceBook') },
            { id: 'Teacher Guide', label: t('resources.teacherGuide') }
          ].map(({ id: typ, label }) => (
            <button
              key={typ}
              onClick={() => setFilterType(typ)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterType === typ ? 'var(--color-secondary)' : 'var(--color-card-bg)',
                color: filterType === typ ? 'white' : 'var(--color-text-muted)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: filterType === typ ? 'var(--color-secondary)' : 'var(--color-border)',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SEARCH RESULTS OVERRIDE (WHEN SEARCH IS ACTIVE)
          ═══════════════════════════════════════════════════════ */}
      {searchQuery.trim() && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                Search Results for "{searchQuery}"
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Found {filteredBooks.length} learning resources matching your search
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <X size={14} /> Clear Search
            </button>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <HelpCircle size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No resources match your search</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 16px auto' }}>
                Try searching for general topic names like "Physics", "Calculus", "Photosynthesis", or clear your filters.
              </p>
              <button onClick={() => { setSearchQuery(''); setFilterMedium('all'); setFilterType('all'); }} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpenModal={handleOpenBookModal}
                  onToggleSyllabus={() => setExpandedSyllabusBookId(expandedSyllabusBookId === book.id ? null : book.id)}
                  isSyllabusExpanded={expandedSyllabusBookId === book.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          FLOW VIEW 1: LEVEL SELECTION (O/L vs A/L)
          ═══════════════════════════════════════════════════════ */}
      {!searchQuery.trim() && !selectedLevel && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {t('resources.step1')}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {t('resources.step1Desc')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}>
            {EDUCATION_LEVELS.map((lvl) => {
              const isOL = lvl.id === 'ol';
              return (
                <div
                  key={lvl.id}
                  onClick={() => handleSelectLevel(lvl.id)}
                  className="card"
                  style={{
                    position: 'relative',
                    padding: '32px 28px',
                    cursor: 'pointer',
                    border: '2px solid var(--color-border)',
                    borderRadius: '20px',
                    background: 'var(--color-card-bg)',
                    transition: 'all 0.25s ease',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = lvl.color;
                    e.currentTarget.style.boxShadow = `0 16px 32px ${lvl.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      backgroundColor: isOL ? 'var(--color-primary-light)' : 'rgba(124, 58, 237, 0.15)',
                      color: lvl.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      boxShadow: `0 8px 16px ${lvl.color}15`,
                    }}>
                      {isOL ? <BookOpen size={32} /> : <GraduationCap size={32} />}
                    </div>

                    <span style={{
                      backgroundColor: isOL ? 'var(--color-primary-light)' : 'rgba(124, 58, 237, 0.15)',
                      color: lvl.color,
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      letterSpacing: '0.3px',
                    }}>
                      {isOL ? t('resources.secondaryBadge') : t('resources.seniorSecondaryBadge')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                    {isOL ? t('exam.ol') : t('exam.al')}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '22px' }}>
                    {isOL ? t('resources.olDesc') : t('resources.alDesc')}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-main)' }}>
                      <Layers size={16} color={lvl.color} />
                      <span>{lvl.totalSubjects} {t('resources.subjects')}</span>
                    </div>
                    <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-main)' }}>
                      <BookMarked size={16} color={lvl.color} />
                      <span>{lvl.totalBooks}+ {t('resources.booksGuides')}</span>
                    </div>
                  </div>

                  <button
                    className="btn"
                    style={{
                      width: '100%',
                      backgroundColor: lvl.color,
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '12px',
                    }}
                  >
                    <span>{isOL ? t('resources.browseOl') : t('resources.browseAl')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Info Feature Box */}
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '18px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Award size={24} />
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {t('resources.nieBannerTitle')}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {t('resources.nieBannerDesc')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          FLOW VIEW 2: A/L STREAM SELECTION (FOR A/L ONLY)
          ═══════════════════════════════════════════════════════ */}
      {!searchQuery.trim() && selectedLevel === 'al' && !selectedStream && !selectedSubjectId && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {language === 'si' ? 'පියවර 2 • උ/පෙළ විෂය ධාරාව තෝරාගැනීම' : 'Step 2 • A/L Stream Selection'}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {t('resources.selectStream')}
              </h2>
            </div>
            <button
              onClick={() => setSelectedLevel(null)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={15} /> {t('resources.backToOverview')}
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}>
            {AL_STREAMS.map((stream) => (
              <div
                key={stream.id}
                onClick={() => handleSelectStream(stream.id)}
                className="card"
                style={{
                  padding: '24px 20px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  border: '1.5px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = stream.color;
                  e.currentTarget.style.boxShadow = `0 12px 24px ${stream.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: `${stream.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}>
                      {stream.icon}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: stream.color,
                      backgroundColor: `${stream.color}20`,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}>
                      {stream.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    {stream.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {stream.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {language === 'si' ? 'ඇතුළත් විෂයයන්:' : 'Subjects Included:'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {stream.subjectIds.map((id) => {
                      const s = SUBJECTS_DATA[id];
                      if (!s) return null;
                      return (
                        <span
                          key={id}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-bg)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          {s.name}
                        </span>
                      );
                    })}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: stream.color,
                    paddingTop: '10px',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    <span>{language === 'si' ? 'විෂයයන් බලන්න' : 'View Stream Subjects'}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          FLOW VIEW 3: SUBJECT SELECTION (FOR O/L OR SELECTED A/L STREAM)
          ═══════════════════════════════════════════════════════ */}
      {!searchQuery.trim() && selectedLevel && !selectedSubjectId && (selectedLevel === 'ol' || selectedStream) && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {selectedLevel === 'ol' ? (language === 'si' ? 'සා/පෙළ විෂයයන්' : 'O/L Subjects') : (language === 'si' ? `${currentStream?.name} විෂයයන්` : `${currentStream?.name} Subjects`)}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {language === 'si' ? 'විෂය නිර්දේශය සහ පොත් බැලීමට විෂයයක් තෝරන්න' : 'Choose a Subject to View Syllabus & Books'}
              </h2>
            </div>

            <button
              onClick={() => {
                if (selectedLevel === 'al') setSelectedStream(null);
                else setSelectedLevel(null);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={15} /> {language === 'si' ? 'ආපසු' : 'Back'}
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
          }}>
            {currentSubjectsList.map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id)}
                className="card"
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: '1.5px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = sub.themeColor;
                  e.currentTarget.style.boxShadow = `0 10px 20px ${sub.themeColor}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      border: '1px solid var(--color-border)',
                    }}>
                      {sub.icon}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-bg)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}>
                      {sub.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    {sub.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {sub.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={14} color={sub.themeColor} />
                    <span>{sub.totalBooks} {language === 'si' ? 'නිල පොත්' : 'Official Books'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sub.themeColor, fontWeight: 700 }}>
                    <span>{language === 'si' ? 'ගවේෂණය' : 'Explore'}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          FLOW VIEW 4: BOOKS & SYLLABUS FOR A SPECIFIC SUBJECT
          ═══════════════════════════════════════════════════════ */}
      {!searchQuery.trim() && currentSubject && (
        <div>
          {/* Subject Banner */}
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                border: '1px solid var(--color-border)',
              }}>
                {currentSubject.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: currentSubject.themeColor,
                    backgroundColor: 'var(--color-bg)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}>
                    {currentSubject.code}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    • {selectedLevel === 'ol' ? (language === 'si' ? 'සාමාන්‍ය පෙළ' : 'O/L Examination') : `A/L ${currentStream?.name || ''}`}
                  </span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {currentSubject.name} – {language === 'si' ? 'පොත් සහ විෂය නිර්දේශය' : 'Books & Syllabus'}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Button to practice quizzes for this subject */}
              {currentSubject.quizSubjectId && (
                <button
                  onClick={() => navigate(`/quizzes?subjectId=${currentSubject.quizSubjectId}`)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} /> {language === 'si' ? `${currentSubject.name} ප්‍රශ්නාවලි පුහුණුව` : `Practice ${currentSubject.name} Quizzes`}
                </button>
              )}
              <button
                onClick={() => setSelectedSubjectId(null)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> {language === 'si' ? 'ආපසු විෂයයන් වෙත' : 'Back to Subjects'}
              </button>
            </div>
          </div>

          {/* Section: Available Books and Learning Materials */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {language === 'si' ? 'පොත් සහ නිර්දේශිත අධ්‍යයන ද්‍රව්‍ය' : 'Books & Recommended Learning Materials'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {language === 'si' 
                ? 'අන්තර්ජාලයෙන් කියවීමට "පොත / සම්පත බලන්න" හෝ විෂය නිර්දේශ ඒකක බැලීමට "විෂය නිර්දේශය" ක්ලික් කරන්න.'
                : 'Click "View Book / Open Resource" to read online, or "View Syllabus & Chapters" to inspect unit breakdowns.'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpenModal={handleOpenBookModal}
                onToggleSyllabus={() => setExpandedSyllabusBookId(expandedSyllabusBookId === book.id ? null : book.id)}
                isSyllabusExpanded={expandedSyllabusBookId === book.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE RESOURCE VIEWER / READER MODAL
          ═══════════════════════════════════════════════════════ */}
      {activeModalBook && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '20px',
        }}
        onClick={() => setActiveModalBook(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card-bg)',
              borderRadius: '24px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-bg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: activeModalBook.gradient,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                    {activeModalBook.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {activeModalBook.publisher} • {activeModalBook.edition} ({activeModalBook.year})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={activeModalBook.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} /> {language === 'si' ? 'සම්පූර්ණ සම්පත බලන්න (PDF)' : 'Open Full Resource (PDF)'}
                </a>
                <button
                  onClick={() => setActiveModalBook(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: Split view (Chapters list left, Details & Reader right) */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              flexDirection: 'row',
            }}>
              {/* Left Column: Chapters / Table of Contents */}
              <div style={{
                width: '320px',
                borderRight: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                overflowY: 'auto',
                padding: '16px',
                flexShrink: 0,
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{language === 'si' ? 'පටුන' : 'Table of Contents'}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--color-border)', padding: '2px 6px', borderRadius: '4px' }}>
                    {activeModalBook.chapters?.length || 0} {language === 'si' ? 'ඒකක' : 'Units'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeModalBook.chapters?.map((ch, idx) => {
                    const isSelected = activeChapterIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {language === 'si' ? 'පරිච්ඡේදය' : 'Chapter'} {ch.number}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={11} /> {ch.hours} {language === 'si' ? 'පැය' : 'hrs'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)', lineHeight: 1.3 }}>
                          {ch.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Chapter breakdown & concepts */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                backgroundColor: 'var(--color-card-bg)',
              }}>
                {activeModalBook.chapters && activeModalBook.chapters[activeChapterIndex] ? (
                  (() => {
                    const ch = activeModalBook.chapters[activeChapterIndex];
                    return (
                      <div>
                        {/* Chapter Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            fontSize: '12px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}>
                            {language === 'si' ? 'ඒකකය / පරිච්ඡේදය' : 'Unit / Chapter'} {ch.number}
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {language === 'si' ? `ඇස්තමේන්තුගත කාලය: පැය ${ch.hours}` : `Estimated Teaching Time: ${ch.hours} Hours`}
                          </span>
                        </div>

                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '14px' }}>
                          {ch.title}
                        </h2>

                        {/* Chapter Overview Box */}
                        <div style={{
                          backgroundColor: 'var(--color-bg)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid var(--color-border)',
                          marginBottom: '20px',
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                            {language === 'si' ? 'විෂය නිර්දේශයේ විෂය පථය සහ සාරාංශය' : 'Syllabus Scope & Summary'}
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--color-text-main)', lineHeight: 1.6, margin: 0 }}>
                            {ch.summary}
                          </p>
                        </div>

                        {/* Key Competencies / Concepts */}
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={16} color="var(--color-success)" /> {language === 'si' ? 'මූලික නිපුණතා සහ විභාග මාතෘකා:' : 'Core Competencies & Examination Topics:'}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {ch.keyConcepts?.map((concept, cIdx) => (
                              <div
                                key={cIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 14px',
                                  backgroundColor: 'var(--color-card-bg)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  color: 'var(--color-text-main)',
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                                <span>{concept}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Book Metadata Quick Bar */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '10px',
                          padding: '14px',
                          backgroundColor: 'var(--color-bg)',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          marginBottom: '24px',
                          fontSize: '12px',
                          textAlign: 'center',
                        }}>
                          <div>
                            <div style={{ color: 'var(--color-text-muted)' }}>{language === 'si' ? 'භාෂා මාධ්‍යය' : 'Language Medium'}</div>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{activeModalBook.medium}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--color-text-muted)' }}>{language === 'si' ? 'පිටු ගණන' : 'Page Count'}</div>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{activeModalBook.pages} {language === 'si' ? 'පිටු' : 'Pages'}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--color-text-muted)' }}>{language === 'si' ? 'ගොනු ප්‍රමාණය' : 'File Size'}</div>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{activeModalBook.fileSize}</div>
                          </div>
                        </div>

                        {/* Direct Action Link to Practice Quizzes */}
                        {SUBJECTS_DATA[activeModalBook.subjectId]?.quizSubjectId && (
                          <div style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--color-card-bg) 0%, var(--color-primary-light) 100%)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                                {language === 'si' ? `${ch.number} වන පරිච්ඡේදය පිළිබඳ ඔබේ අවබෝධය පරීක්ෂා කිරීමට සූදානම්ද?` : `Ready to test your understanding of Chapter ${ch.number}?`}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                {language === 'si' ? 'මෙම විෂය සඳහා පසුගිය විභාග බහුවරණ සහ ආදර්ශ ප්‍රශ්න විසඳන්න.' : 'Solve past paper MCQs & model questions for this subject.'}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const qSubId = SUBJECTS_DATA[activeModalBook.subjectId]?.quizSubjectId;
                                setActiveModalBook(null);
                                navigate(`/quizzes?subjectId=${qSubId}`);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Sparkles size={14} /> {language === 'si' ? 'ප්‍රශ්නාවලි පුහුණු වන්න' : 'Practice Quizzes Now'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    {language === 'si' ? 'විෂය නිර්දේශ තොරතුරු බැලීමට පරිච්ඡේදයක් තෝරන්න.' : 'Select a chapter to view syllabus breakdown.'}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-bg)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}>
              <span>{language === 'si' ? 'අධ්‍යාපන අමාත්‍යාංශයේ සහ ජාතික අධ්‍යාපන ආයතනයේ නිල විෂය නිර්දේශ ද්‍රව්‍ය' : 'Ministry of Education & National Institute of Education curriculum materials'}</span>
              <button
                onClick={() => setActiveModalBook(null)}
                className="btn btn-secondary btn-sm"
              >
                {language === 'si' ? 'වසන්න' : 'Close Viewer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENT: BOOK / RESOURCE CARD
   ═══════════════════════════════════════════════════════════════ */
function BookCard({ book, onOpenModal, onToggleSyllabus, isSyllabusExpanded }) {
  const { language } = useLanguage();
  const subject = SUBJECTS_DATA[book.subjectId];

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        borderRadius: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1.5px solid var(--color-border)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top section: Book realistic spine visual + Meta */}
      <div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {/* Visual Book Cover Thumbnail */}
          <div
            style={{
              width: '74px',
              height: '104px',
              borderRadius: '8px',
              background: book.gradient,
              boxShadow: '3px 5px 12px rgba(15, 23, 42, 0.22)',
              flexShrink: 0,
              padding: '10px 8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Book spine line effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '6px',
              width: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }} />

            <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', opacity: 0.9 }}>
              {book.level.toUpperCase()}
            </div>

            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              lineHeight: 1.15,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {subject?.name || book.title}
            </div>

            <div style={{ fontSize: '8px', opacity: 0.8, fontWeight: 600 }}>
              {book.year}
            </div>
          </div>

          {/* Book Info Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: book.accentColor,
                backgroundColor: 'var(--color-bg)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
              }}>
                {book.type}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {book.medium}
              </span>
            </div>

            <h4 style={{
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              lineHeight: 1.3,
              marginBottom: '4px',
            }}>
              {book.title}
            </h4>

            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              {book.publisher}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>{book.pages} {language === 'si' ? 'පිටු' : 'Pages'}</span>
              <span>•</span>
              <span>{book.fileSize}</span>
              <span>•</span>
              <span>{book.downloads} {language === 'si' ? 'කියවීම්' : 'Reads'}</span>
            </div>
          </div>
        </div>

        {/* Syllabus Scope Summary */}
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.45,
          marginBottom: '14px',
        }}>
          {book.syllabusSummary}
        </p>

        {/* Quick Chapter Pill Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {book.chapters?.slice(0, 3).map((ch, idx) => (
            <span
              key={idx}
              onClick={() => onOpenModal(book, idx)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Click to preview chapter"
            >
              Ch {ch.number}: {ch.title.length > 22 ? ch.title.slice(0, 22) + '...' : ch.title}
            </span>
          ))}
          {book.chapters && book.chapters.length > 3 && (
            <span
              onClick={() => onOpenModal(book, 3)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              +{book.chapters.length - 3} {language === 'si' ? 'තවත් පරිච්ඡේද' : 'more chapters'}
            </span>
          )}
        </div>

        {/* Inline Expanded Syllabus Breakdown (if toggled) */}
        {isSyllabusExpanded && (
          <div style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid var(--color-border)',
            marginBottom: '18px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              {language === 'si' ? 'සම්පූර්ණ පරිච්ඡේද ලැයිස්තුව සහ ඉගැන්වීම් කාලය' : 'Full Chapter List & Teaching Hours'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {book.chapters?.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenModal(book, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {ch.number}. {ch.title}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>
                    {ch.hours} {language === 'si' ? 'පැය' : 'hrs'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border)',
        flexWrap: 'wrap',
      }}>
        {/* Primary View Book / Open Resource Button */}
        <button
          onClick={() => onOpenModal(book, 0)}
          className="btn btn-primary"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '9px 12px',
          }}
        >
          <Eye size={15} />
          <span>{language === 'si' ? 'පොත / සම්පත බලන්න' : 'View Book / Resource'}</span>
        </button>

        {/* Secondary View Syllabus / Chapters Button */}
        <button
          onClick={onToggleSyllabus}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '9px 12px',
          }}
          title="Inspect syllabus competencies"
        >
          <BookMarked size={15} />
          <span>{isSyllabusExpanded ? (language === 'si' ? 'විෂය නිර්දේශය සඟවන්න' : 'Hide Syllabus') : (language === 'si' ? 'විෂය නිර්දේශය' : 'Syllabus')}</span>
        </button>
      </div>
    </div>
  );
}
