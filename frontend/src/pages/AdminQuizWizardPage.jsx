import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, ArrowRight, Check, Eye, HelpCircle, FileText } from 'lucide-react';
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
      options: ['x = 1 or x = 3', 'x = -1 or x = -3', 'x = 2 or x = 4', 'x = 0 or x = 3'],
      correctIndex: 0,
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
        setQuestions(quiz.questions);
      }
    }

    loadQuiz();
  }, [isEditMode, navigate, quizId]);

  // Question editing helper handlers
  const handleAddQuestion = () => {
    const newQ = {
      id: questions.length + 1,
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
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

  const handleUpdateOption = (qIdx, optIdx, val) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = val;
    setQuestions(updated);
  };

  const handleSelectCorrect = (qIdx, optIdx) => {
    const updated = [...questions];
    updated[qIdx].correctIndex = optIdx;
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

    const quizPayload = {
      id: `quiz-custom-${Date.now()}`,
      title: title.trim(),
      examLevel,
      streamId: examLevel === 'al' ? streamId : null,
      subjectId: subjectName.toLowerCase().replace(/\s+/g, '_'),
      subjectName,
      questionCount: questions.length,
      duration,
      difficulty,
      price,
      attemptsAllowed: attempts,
      description: description.trim() || 'Custom examination paper created by Administrator.',
      questions,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Step 3: Frontend Questions & Options Builder ({questions.length} Qs)</h3>
              <button className="btn btn-primary" onClick={handleAddQuestion}>
                <Plus size={16} /> Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="card" style={{ marginBottom: '20px', borderLeft: '6px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>Question {qIdx + 1}</span>
                  <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleRemoveQuestion(qIdx)}>
                    <Trash2 size={14} /> Remove Question
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Question Text *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={q.text}
                    onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                    placeholder={`e.g. Enter question ${qIdx + 1} text here...`}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Options (A, B, C, D) & Select Correct Answer Key *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: q.correctIndex === oIdx ? '2px solid var(--color-success)' : '1px solid var(--color-border)', backgroundColor: q.correctIndex === oIdx ? 'var(--color-success-light)' : 'var(--color-bg)' }}>
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleSelectCorrect(qIdx, oIdx)}
                          style={{ accentColor: 'var(--color-success)', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '13px', width: '20px' }}>{String.fromCharCode(65 + oIdx)}.</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, oIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Solution Explanation Note</label>
                  <input
                    type="text"
                    className="form-input"
                    value={q.explanation}
                    onChange={(e) => handleUpdateExplanation(qIdx, e.target.value)}
                    placeholder="Step-by-step mathematical or scientific solution explanation..."
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span className="badge badge-primary">{subjectName}</span>
              <span className="badge badge-neutral">{examLevel.toUpperCase()}</span>
              <span className="badge badge-success">LKR {price}</span>
              <span className="badge badge-warning">{duration} Mins</span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Paper Questions Preview ({questions.length} Total Qs)</h4>
              
              {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-primary)' }}>
                    Question {idx + 1}: {q.text || '(Empty Question)'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ fontWeight: q.correctIndex === oIdx ? 700 : 400, color: q.correctIndex === oIdx ? 'var(--color-success)' : 'inherit' }}>
                        {String.fromCharCode(65 + oIdx)}. {opt || '---'} {q.correctIndex === oIdx ? '✓ (Key)' : ''}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Explanation: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
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
              Paper <strong>"{title}"</strong> with {questions.length} question(s) will be {isEditMode ? 'updated' : 'published'} live to the Express REST backend and Supabase database for students to enroll and attempt.
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
