import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, ArrowRight, Check, Eye, HelpCircle, FileText, ImageIcon, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AdminQuizWizardPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const isEditMode = Boolean(quizId);
  const [step, setStep] = useState(1);

  // Step 1: Basic Information
  const [title, setTitle] = useState('');
  const [examLevel, setExamLevel] = useState('ol');
  const [streamId, setStreamId] = useState('physical');
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  // Step 2: Settings & Rules
  const [duration, setDuration] = useState(45);
  const [price, setPrice] = useState(300);
  const [attempts, setAttempts] = useState(1);

  // Step 3: Questions & Answers Builder (Interactive Frontend Builder)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'Solve for x in the equation: 2x² - 8x + 6 = 0',
      isMultipleChoice: true,
      options: ['x = 1 or x = 3', 'x = -1 or x = -3', 'x = 2 or x = 4', 'x = 0 or x = 3'],
      correctIndices: [0],
      correctIndex: 0,
      hasImage: false,
      imageUrl: null,
      imageFileName: '',
      explanation: 'Divide the equation by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore, x = 1 or x = 3.'
    }
  ]);

  useEffect(() => {
    if (!isEditMode) return;

    async function loadQuiz() {
      const res = await api.getQuizById(quizId);
      if (!res.success || !res.quiz) {
        alert('Unable to load quiz for editing.');
        navigate('/admin');
        return;
      }

      const quiz = res.quiz;
      setTitle(quiz.title || '');
      setExamLevel(quiz.examLevel || quiz.exam_level || 'ol');
      setStreamId(quiz.streamId || quiz.stream_id || 'physical');
      setSubjectName(quiz.subjectName || quiz.subject_name || 'Mathematics');
      setDescription(quiz.about || quiz.description || '');
      setDifficulty(quiz.difficulty || 'Medium');
      setDuration(Number(quiz.durationMinutes || quiz.duration_minutes || 45));
      setPrice(Number(quiz.price || 300));
      setAttempts(Number(quiz.attemptsAllowed || quiz.attempts_allowed || 1));
      if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
        setQuestions(quiz.questions.map((q, idx) => ({
          id: q.id || idx + 1,
          text: q.text || q.questionText || '',
          isMultipleChoice: q.isMultipleChoice !== false && q.is_multiple_choice !== false,
          options: Array.isArray(q.options) && q.options.length > 0
            ? q.options.map(o => typeof o === 'string' ? o : (o.text || o.option_text || ''))
            : ['', '', '', ''],
          correctIndices: Array.isArray(q.correctIndices) && q.correctIndices.length > 0
            ? q.correctIndices
            : (Array.isArray(q.correct_indices) && q.correct_indices.length > 0
                ? q.correct_indices
                : (q.correctIndex !== undefined && q.correctIndex !== null ? [q.correctIndex] : [0])),
          correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
          hasImage: Boolean(q.hasImage || q.has_image),
          imageUrl: q.imageUrl || q.image_url || null,
          imageFileName: '',
          explanation: q.explanation || ''
        })));
      }
    }

    loadQuiz();
  }, [isEditMode, navigate, quizId]);

  // Question editing helper handlers
  const handleAddQuestion = () => {
    const newQ = {
      id: questions.length + 1,
      text: '',
      isMultipleChoice: true,
      options: ['', '', '', ''],
      correctIndices: [],
      correctIndex: null,
      hasImage: false,
      imageUrl: null,
      imageFileName: '',
      explanation: ''
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) {
      alert("A quiz paper must have at least 1 question!");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestionText = (idx, text) => {
    const updated = [...questions];
    updated[idx].text = text;
    setQuestions(updated);
  };

  const handleToggleMultipleChoice = (qIdx, enabled) => {
    const updated = [...questions];
    updated[qIdx].isMultipleChoice = enabled;
    if (enabled && (!updated[qIdx].options || updated[qIdx].options.length < 2)) {
      updated[qIdx].options = ['', '', '', ''];
      updated[qIdx].correctIndices = [];
      updated[qIdx].correctIndex = null;
    }
    setQuestions(updated);
  };

  const handleToggleImage = (qIdx, enabled) => {
    const updated = [...questions];
    updated[qIdx].hasImage = enabled;
    if (!enabled) {
      updated[qIdx].imageUrl = null;
      updated[qIdx].imageFileName = '';
    }
    setQuestions(updated);
  };

  const handleImageFileSelect = (qIdx, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size exceeds 15MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...questions];
      updated[qIdx].hasImage = true;
      updated[qIdx].imageUrl = e.target.result;
      updated[qIdx].imageFileName = file.name;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].hasImage = false;
    updated[qIdx].imageUrl = null;
    updated[qIdx].imageFileName = '';
    setQuestions(updated);
  };

  const handleUpdateOption = (qIdx, optIdx, val) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = val;
    setQuestions(updated);
  };

  const handleToggleCorrectOption = (qIdx, optIdx) => {
    const updated = [...questions];
    const cur = updated[qIdx].correctIndices || (updated[qIdx].correctIndex !== undefined && updated[qIdx].correctIndex !== null ? [updated[qIdx].correctIndex] : []);
    let next;
    if (cur.includes(optIdx)) {
      next = cur.filter(i => i !== optIdx);
    } else {
      next = [...cur, optIdx].sort((a, b) => a - b);
    }
    updated[qIdx].correctIndices = next;
    updated[qIdx].correctIndex = next.length > 0 ? next[0] : null;
    setQuestions(updated);
  };

  const handleAddOption = (qIdx) => {
    const updated = [...questions];
    const cur = updated[qIdx].options || [];
    if (cur.length >= 8) return;
    updated[qIdx].options = [...cur, ''];
    setQuestions(updated);
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    const updated = [...questions];
    const cur = updated[qIdx].options || [];
    if (cur.length <= 2) {
      alert('A Multiple Choice question must have at least 2 options.');
      return;
    }
    const nextOpts = cur.filter((_, i) => i !== optIdx);
    const curCorrect = updated[qIdx].correctIndices || (updated[qIdx].correctIndex !== undefined && updated[qIdx].correctIndex !== null ? [updated[qIdx].correctIndex] : []);
    const nextCorrect = curCorrect
      .filter(i => i !== optIdx)
      .map(i => (i > optIdx ? i - 1 : i));
    updated[qIdx].options = nextOpts;
    updated[qIdx].correctIndices = nextCorrect;
    updated[qIdx].correctIndex = nextCorrect.length > 0 ? nextCorrect[0] : null;
    setQuestions(updated);
  };

  const handleUpdateExplanation = (qIdx, text) => {
    const updated = [...questions];
    updated[qIdx].explanation = text;
    setQuestions(updated);
  };

  // Step 5: Publish Handler
  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a Quiz Paper Title!");
      setStep(1);
      return;
    }

    if (!duration || duration <= 0) {
      alert("Please enter a valid exam duration in minutes!");
      setStep(2);
      return;
    }

    if (price === undefined || price < 0) {
      alert("Please enter a valid quiz price (0 or greater)!");
      setStep(2);
      return;
    }

    if (questions.length === 0) {
      alert("At least one question is required before publishing a quiz!");
      setStep(3);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text || !q.text.trim()) {
        alert(`Question #${i + 1} has an empty question text. Please enter a valid question.`);
        setStep(3);
        return;
      }

      if (q.isMultipleChoice) {
        const validOpts = (q.options || []).filter(o => o && String(o).trim());
        if (validOpts.length < 2) {
          alert(`Question #${i + 1} is Multiple Choice and must have at least 2 filled answer options!`);
          setStep(3);
          return;
        }

        const correctList = q.correctIndices || (q.correctIndex !== undefined && q.correctIndex !== null ? [q.correctIndex] : []);
        if (!correctList || correctList.length === 0) {
          alert(`Question #${i + 1} is Multiple Choice: Please select at least one correct answer key using the checkboxes!`);
          setStep(3);
          return;
        }
      }
    }

    const targetId = isEditMode ? quizId : `quiz-custom-${Date.now()}`;
    const formattedQuestions = questions.map((q, idx) => {
      const isMC = q.isMultipleChoice !== false;
      const curCorrect = isMC ? (q.correctIndices || (q.correctIndex !== undefined ? [q.correctIndex] : [0])) : [];
      return {
        id: q.id || idx + 1,
        text: q.text.trim(),
        questionText: q.text.trim(),
        isMultipleChoice: isMC,
        hasImage: Boolean(q.hasImage && q.imageUrl),
        imageUrl: (q.hasImage && q.imageUrl) ? q.imageUrl : null,
        options: isMC ? q.options.map(o => String(o).trim()) : [],
        correctIndices: curCorrect,
        correctIndex: curCorrect.length > 0 ? curCorrect[0] : 0,
        explanation: q.explanation ? q.explanation.trim() : ''
      };
    });

    const quizPayload = {
      id: targetId,
      title: title.trim(),
      examLevel,
      streamId: examLevel === 'al' ? streamId : null,
      subjectId: subjectName.toLowerCase().replace(/\s+/g, '_'),
      subjectName,
      questionCount: formattedQuestions.length,
      durationMinutes: Number(duration),
      duration: Number(duration),
      difficulty,
      price: Number(price),
      attemptsAllowed: Number(attempts),
      description: description.trim() || 'Custom examination paper created by Administrator.',
      questions: formattedQuestions,
      is_published: true
    };

    const res = isEditMode
      ? await api.updateQuiz(quizId, quizPayload)
      : await api.createQuiz(quizPayload);

    if (res.success) {
      alert(`Quiz Paper "${title}" ${isEditMode ? 'updated' : 'created and published'} successfully!`);
      navigate('/admin');
    } else {
      alert(res.message || `Quiz ${isEditMode ? 'update' : 'creation'} failed.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        {/* Wizard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{isEditMode ? 'Edit Quiz Paper' : 'Create New Quiz Paper'} (5-Step Wizard)</h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{isEditMode ? 'Update quiz details and publish changes live' : 'Build quiz questions & options from frontend and publish live'}</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>
            <ArrowLeft size={16} /> Exit Wizard
          </button>
        </div>

        {/* Step Stepper Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
          {['1. Basic Info', '2. Rules & Pricing', '3. Add Questions', '4. Preview', '5. Publish'].map((label, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === idx + 1 ? 1 : 0.6 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step === idx + 1 ? 'var(--color-primary)' : 'var(--color-border)', color: 'white', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: '13px', fontWeight: step === idx + 1 ? 700 : 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Step 1: Quiz Paper Details</h3>
            
            <div className="form-group">
              <label className="form-label">Quiz Paper Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. G.C.E. O/L Mathematics Model Paper 2026"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Examination Level</label>
                <select className="form-input" value={examLevel} onChange={(e) => setExamLevel(e.target.value)}>
                  <option value="ol">G.C.E. Ordinary Level (O/L)</option>
                  <option value="al">G.C.E. Advanced Level (A/L)</option>
                  <option value="g5">Grade 5 Scholarship</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, Science"
                />
              </div>
            </div>

            {examLevel === 'al' && (
              <div className="form-group">
                <label className="form-label">A/L Stream</label>
                <select className="form-input" value={streamId} onChange={(e) => setStreamId(e.target.value)}>
                  <option value="physical">Physical Science (Maths)</option>
                  <option value="bio">Biological Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                  <option value="tech">Technology</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Description / Syllabus Scope</label>
              <textarea
                className="form-input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of topics covered in this examination paper..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-primary btn-lg" onClick={() => { if(!title.trim()) return alert('Please enter paper title'); setStep(2); }}>
                Next: Rules & Pricing <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RULES & PRICING */}
        {step === 2 && (
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Step 2: Settings, Rules & Pricing</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Paper Price (LKR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="300"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  placeholder="45"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Allowed Attempt Count</label>
                <select className="form-input" value={attempts} onChange={(e) => setAttempts(Number(e.target.value))}>
                  <option value={1}>1 Single Attempt</option>
                  <option value={2}>2 Attempts</option>
                  <option value={5}>5 Attempts</option>
                  <option value={99}>Unlimited Attempts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Rating</label>
                <select className="form-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard (Exam Standard)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
                Next: Add Questions <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: QUESTIONS & ANSWERS BUILDER */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Step 3: Frontend Questions & Options Builder ({questions.length} Qs)</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  Create questions with optional multiple-choice options (one or more correct answers) and optional image uploads.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleAddQuestion} style={{ gap: '6px' }}>
                <Plus size={16} /> Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="card" style={{ marginBottom: '24px', borderLeft: '6px solid var(--color-primary)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>Question {qIdx + 1}</span>
                    <span className={`badge ${q.isMultipleChoice ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '11px' }}>
                      {q.isMultipleChoice ? ((q.correctIndices || []).length > 1 ? 'Multiple Choice (Multi-Answer)' : 'Multiple Choice') : 'Normal Text'}
                    </span>
                    {q.hasImage && q.imageUrl && (
                      <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                        <ImageIcon size={11} /> Image Attached
                      </span>
                    )}
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-error)', gap: '4px' }} onClick={() => handleRemoveQuestion(qIdx)}>
                    <Trash2 size={14} /> Remove Question
                  </button>
                </div>

                {/* 1. Question Text Area */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
                    Question Text *
                  </label>
                  <textarea
                    rows={3}
                    className="form-input"
                    value={q.text}
                    onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                    placeholder={`e.g. Enter question ${qIdx + 1} text here...`}
                    style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontSize: '14px', fontFamily: 'inherit' }}
                    required
                  />
                </div>

                {/* 2. Multiple Choice Options — OPTIONAL (One or more answers can be correct) */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: q.isMultipleChoice ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  border: q.isMultipleChoice ? '1.5px solid var(--color-primary-border)' : '1px solid var(--color-border)',
                  marginBottom: '18px',
                  transition: 'all 0.2s ease'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={q.isMultipleChoice}
                      onChange={(e) => handleToggleMultipleChoice(qIdx, e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>
                      Add Multiple Choice
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(Optional)</span>
                  </label>

                  {q.isMultipleChoice ? (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Enter answer options and select one or more correct answers using the checkboxes:
                        <span style={{ marginLeft: '6px', color: 'var(--color-success)', fontWeight: 700 }}>
                          ({(q.correctIndices || []).length} answer{(q.correctIndices || []).length === 1 ? '' : 's'} marked correct)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = (q.correctIndices || []).includes(oIdx);
                          return (
                            <div
                              key={oIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: isCorrect ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
                                backgroundColor: isCorrect ? 'var(--color-success-light)' : 'white',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isCorrect}
                                onChange={() => handleToggleCorrectOption(qIdx, oIdx)}
                                title={`Mark Option ${String.fromCharCode(65 + oIdx)} as correct`}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--color-success)', cursor: 'pointer', flexShrink: 0 }}
                              />
                              <span style={{ fontWeight: 800, fontSize: '13px', width: '22px', flexShrink: 0, color: isCorrect ? 'var(--color-success)' : 'inherit' }}>
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <input
                                type="text"
                                className="form-input"
                                style={{ padding: '6px 10px', fontSize: '13px', flex: 1 }}
                                value={opt}
                                onChange={(e) => handleUpdateOption(qIdx, oIdx, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                              />
                              {isCorrect && (
                                <span className="badge badge-success" style={{ fontSize: '11px', flexShrink: 0, padding: '2px 8px' }}>
                                  ✓ Correct
                                </span>
                              )}
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  title={`Remove Option ${String.fromCharCode(65 + oIdx)}`}
                                  onClick={() => handleRemoveOption(qIdx, oIdx)}
                                  style={{ color: 'var(--color-error)', padding: '4px 6px', flexShrink: 0 }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleAddOption(qIdx)}
                          disabled={q.options.length >= 8}
                          style={{ fontSize: '12px', gap: '6px' }}
                        >
                          <Plus size={14} /> Add Option {String.fromCharCode(65 + q.options.length)}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Normal descriptive / essay question (No multiple choice options attached).
                    </div>
                  )}
                </div>

                {/* 3. Question Image — OPTIONAL */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: q.hasImage ? '#F5F3FF' : 'var(--color-bg)',
                  border: q.hasImage ? '1.5px solid #DDD6FE' : '1px solid var(--color-border)',
                  marginBottom: '18px',
                  transition: 'all 0.2s ease'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={q.hasImage}
                      onChange={(e) => handleToggleImage(qIdx, e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>
                      Add Question Image
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>(Optional)</span>
                  </label>

                  {q.hasImage && (
                    <div style={{ marginTop: '14px' }}>
                      {!q.imageUrl ? (
                        <label style={{
                          border: '2px dashed #C4B5FD',
                          borderRadius: '12px',
                          padding: '20px',
                          textAlign: 'center',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'block',
                          transition: 'all 0.2s ease'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageFileSelect(qIdx, e.target.files?.[0])}
                          />
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                            <Upload size={20} />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-main)' }}>
                            Click to Upload Question Image
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            PNG, JPG, JPEG, WEBP, GIF (Max 15MB)
                          </div>
                        </label>
                      ) : (
                        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <div style={{ width: '100px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img src={q.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: '160px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
                              {q.imageFileName || 'Attached question image'}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <label className="btn btn-outline btn-sm" style={{ fontSize: '11px', cursor: 'pointer' }}>
                                Change Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleImageFileSelect(qIdx, e.target.files?.[0])}
                                />
                              </label>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => handleRemoveImage(qIdx)}
                                style={{ color: 'var(--color-error)', fontSize: '11px' }}
                              >
                                <Trash2 size={12} /> Remove Image
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Solution Explanation Note */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>Solution Explanation Note</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={q.explanation}
                    onChange={(e) => handleUpdateExplanation(qIdx, e.target.value)}
                    placeholder="Step-by-step mathematical or scientific solution explanation..."
                    style={{ width: '100%', resize: 'vertical', fontSize: '13px', lineHeight: 1.4 }}
                  />
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(4)}>
                Next: Preview Paper <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW PAPER */}
        {step === 4 && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{title || 'Untitled Model Paper'}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{subjectName}</span>
              <span className="badge badge-neutral">{examLevel.toUpperCase()}</span>
              <span className="badge badge-success">LKR {price}</span>
              <span className="badge badge-warning">{duration} Mins</span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Paper Questions Preview ({questions.length} Total Qs)</h4>
              
              {questions.map((q, idx) => {
                const correctList = q.correctIndices || (q.correctIndex !== undefined && q.correctIndex !== null ? [q.correctIndex] : []);
                return (
                  <div key={idx} style={{ marginBottom: '20px', padding: '18px', borderRadius: '12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                        Question {idx + 1}: {q.text || <em style={{ color: 'var(--color-text-muted)' }}>(Empty Question)</em>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span className={`badge ${q.isMultipleChoice ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '11px' }}>
                          {q.isMultipleChoice ? (correctList.length > 1 ? 'Multiple Choice (Multi-Correct)' : 'Multiple Choice') : 'Normal Text'}
                        </span>
                        {q.hasImage && q.imageUrl && (
                          <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}>
                            <ImageIcon size={10} /> Image Attached
                          </span>
                        )}
                      </div>
                    </div>

                    {q.hasImage && q.imageUrl && (
                      <div style={{ marginBottom: '14px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#0F172A', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={q.imageUrl} alt="Question Preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                      </div>
                    )}

                    {q.isMultipleChoice ? (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', fontSize: '13px', marginBottom: '10px' }}>
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = correctList.includes(oIdx);
                            return (
                              <div
                                key={oIdx}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: isCorrect ? '1.5px solid var(--color-success)' : '1px solid var(--color-border)',
                                  backgroundColor: isCorrect ? 'var(--color-success-light)' : 'white',
                                  fontWeight: isCorrect ? 700 : 400,
                                  color: isCorrect ? 'var(--color-success)' : 'inherit',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}. {opt || '---'}</span>
                                {isCorrect && <Check size={14} style={{ marginLeft: 'auto' }} />}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> Correct Answer Key: {correctList.map(i => `Option ${String.fromCharCode(65 + i)}`).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'white', border: '1px dashed var(--color-border)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Normal descriptive / essay question (No choices attached).
                      </div>
                    )}

                    {q.explanation && (
                      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)', backgroundColor: 'white', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(3)}>
                <ArrowLeft size={16} /> Edit Questions
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(5)}>
                Proceed to Publish <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PUBLISH LIVE */}
        {step === 5 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Check size={36} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Ready to Publish Live!</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
              Paper <strong>"{title}"</strong> with {questions.length} question(s) will be {isEditMode ? 'updated' : 'published'} live to the Express REST backend and MongoDB Atlas database for students to enroll and attempt.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button className="btn btn-outline" onClick={() => setStep(4)}>
                Back to Preview
              </button>
              <button className="btn btn-primary btn-lg" onClick={handlePublish}>
                {isEditMode ? 'Save Quiz Changes' : 'Publish Quiz Live Now'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
