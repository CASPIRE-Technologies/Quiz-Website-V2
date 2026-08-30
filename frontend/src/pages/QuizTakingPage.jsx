import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuizTakingPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { addAttempt } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(2700);
  const [autosave, setAutosave] = useState('Saved ✓');

  useEffect(() => {
    async function loadQuizData() {
      const res = await api.getQuizById(quizId);
      if (res.quiz) {
        setQuiz(res.quiz);
        if (res.quiz.questions && res.quiz.questions.length > 0) {
          setQuestions(res.quiz.questions);
        } else {
          // Fallback questions if paper has no custom questions
          setQuestions([
            { id: 1, text: `Question 1 for ${res.quiz.title}: Solve for x in 2x² - 8x + 6 = 0`, options: ["x = 1 or x = 3", "x = -1 or x = -3", "x = 2 or x = 4", "x = 0 or x = 3"], correctIndex: 0 },
            { id: 2, text: "What is the value of x if log₂(x) = 5?", options: ["10", "25", "32", "64"], correctIndex: 2 },
            { id: 3, text: "Factorize the quadratic expression: x² - 9x + 20", options: ["(x - 4)(x - 5)", "(x + 4)(x + 5)", "(x - 2)(x - 10)", "(x + 2)(x - 10)"], correctIndex: 0 }
          ]);
        }
        setTimeLeft((res.quiz.durationMinutes || 45) * 60);
      }
    }
    loadQuizData();
  }, [quizId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    setAnswers({ ...answers, [currentIdx]: optIdx });
    setAutosave('Saving...');
    setTimeout(() => setAutosave('Saved ✓'), 200);
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const result = {
      score: correctCount,
      total: questions.length,
      percentage,
      timeTaken: `${Math.floor(( (quiz?.durationMinutes || 45) * 60 - timeLeft ) / 60)} mins`,
      date: new Date().toISOString().split('T')[0]
    };

    await api.submitAttempt(quizId, answers, 1965);
    addAttempt(quizId, result);
    navigate(`/quiz/${quizId}/result`);
  };

  const currQ = questions[currentIdx] || { id: 1, text: 'Loading Question...', options: ['A', 'B', 'C', 'D'], correctIndex: 0 };

  return (
    <div style={{ margin: '-24px -24px 0 -24px' }}>
      {/* Quiz Top Header Bar */}
      <div style={{ height: '68px', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{quiz ? quiz.title : 'Loading Examination Paper...'}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Question {currentIdx + 1} of {questions.length}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '9999px', fontWeight: 800 }}>
          <Clock size={18} /> {formatTime(timeLeft)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={14} /> {autosave}
          </span>
          <button className="btn btn-danger btn-sm" style={{ backgroundColor: 'var(--color-error)', color: 'white' }} onClick={handleSubmit}>Submit Quiz</button>
        </div>
      </div>

      {/* Main 70/30 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>Question {currentIdx + 1}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setMarked({ ...marked, [currentIdx]: !marked[currentIdx] })}>
              <Flag size={14} /> {marked[currentIdx] ? 'Marked' : 'Mark for Review'}
            </button>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{currQ.text}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            {currQ.options.map((opt, oIdx) => {
              const isSel = answers[currentIdx] === oIdx;
              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: isSel ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                    backgroundColor: isSel ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer',
                    fontWeight: isSel ? 700 : 500
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <div>{opt}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
            <button className="btn btn-outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>
              <ArrowLeft size={16} /> Previous
            </button>
            <button className="btn btn-primary" onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(currentIdx + 1) : handleSubmit()}>
              {currentIdx === questions.length - 1 ? 'Finish & Submit' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Palette Sidebar */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Question Palette</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {questions.map((q, idx) => {
              const isAns = answers[idx] !== undefined;
              const isMark = marked[idx];
              const isCurr = currentIdx === idx;
              let bg = 'var(--color-bg)';
              let color = 'var(--color-text-muted)';
              if (isMark) { bg = 'var(--color-warning-light)'; color = '#B45309'; }
              else if (isAns) { bg = 'var(--color-success-light)'; color = 'var(--color-success)'; }

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: bg,
                    color,
                    border: isCurr ? '2px solid var(--color-primary)' : '2px solid transparent'
                  }}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
