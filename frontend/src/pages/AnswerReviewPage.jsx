import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AnswerReviewPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizById(quizId);
      if (res.quiz) {
        setQuiz(res.quiz);
        if (res.quiz.questions && res.quiz.questions.length > 0) {
          setQuestions(res.quiz.questions);
        }
      }
    }
    load();
  }, [quizId]);

  const defaultQuestions = [
    {
      id: 1,
      text: "Solve for x in the equation: 2x² - 8x + 6 = 0",
      options: ["x = 1 or x = 3", "x = -1 or x = -3", "x = 2 or x = 4", "x = 0 or x = 3"],
      correctIndex: 0,
      studentChoice: 0,
      explanation: "Divide the equation by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore, x = 1 or x = 3."
    },
    {
      id: 2,
      text: "What is the value of x if log₂(x) = 5?",
      options: ["10", "25", "32", "64"],
      correctIndex: 2,
      studentChoice: 2,
      explanation: "By logarithmic identity log_b(a) = c implies b^c = a. Therefore, 2⁵ = 32."
    }
  ];

  const displayQuestions = questions.length > 0 ? questions : defaultQuestions;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Solutions & Explanations</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Itemized Answer Breakdown for {quiz ? quiz.title : 'Examination Model Paper'}
        </p>
      </div>

      {displayQuestions.map((q, idx) => {
        const isMulti = Array.isArray(q.correctIndices) && q.correctIndices.length > 1;
        const correctIndicesList = Array.isArray(q.correctIndices) && q.correctIndices.length > 0
          ? q.correctIndices
          : (q.correctIndex !== undefined && q.correctIndex !== null ? [q.correctIndex] : []);

        let isCorrect;
        if (isMulti) {
          if (Array.isArray(q.studentChoice)) {
            const s1 = [...q.studentChoice].sort((a, b) => a - b);
            const s2 = [...correctIndicesList].sort((a, b) => a - b);
            isCorrect = s1.length === s2.length && s1.every((v, i) => v === s2[i]);
          } else {
            isCorrect = false;
          }
        } else {
          const choice = Array.isArray(q.studentChoice) ? q.studentChoice[0] : q.studentChoice;
          isCorrect = choice !== undefined ? choice === (correctIndicesList[0] ?? q.correctIndex) : true;
        }

        const hasOptions = Array.isArray(q.options) && q.options.length > 0 && q.isMultipleChoice !== false;

        return (
          <div key={q.id || idx} className="card" style={{ marginBottom: '20px', borderLeft: `6px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-error)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>Question {idx + 1}</span>
                {isMulti && (
                  <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                    Multi-Correct
                  </span>
                )}
              </div>
              <span className={`badge ${isCorrect ? 'badge-success' : 'badge-error'}`}>{isCorrect ? 'Correct ✓' : 'Incorrect ✕'}</span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.4 }}>{q.text}</h4>

            {/* Question Image if present */}
            {q.hasImage && q.imageUrl && (
              <div style={{
                marginBottom: '16px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                backgroundColor: '#F8FAFC',
                maxHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px'
              }}>
                <img
                  src={q.imageUrl}
                  alt={`Diagram for Question ${idx + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '268px', objectFit: 'contain', borderRadius: '6px' }}
                />
              </div>
            )}

            {hasOptions ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {q.options.map((opt, oIdx) => {
                  const isKey = correctIndicesList.includes(oIdx);
                  return (
                    <div
                      key={oIdx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: isKey ? '1.5px solid var(--color-success)' : '1px solid var(--color-border)',
                        backgroundColor: isKey ? 'var(--color-success-light)' : 'var(--color-bg)',
                        fontWeight: isKey ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      </div>
                      {isKey && (
                        <span style={{ color: 'var(--color-success)', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                          ✓ Correct Key
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px dashed var(--color-border)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Descriptive / Open-ended Question
              </div>
            )}

            {correctIndicesList.length > 0 && (
              <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>
                ✓ Correct {correctIndicesList.length > 1 ? 'Answer Keys' : 'Answer Key'}: {correctIndicesList.map(i => `Option ${String.fromCharCode(65 + i)}`).join(', ')}
              </div>
            )}

            <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '16px', borderRadius: '14px', fontSize: '14px', color: '#1E3A8A', border: '1px solid var(--color-primary-border)' }}>
              <strong>Solution Explanation:</strong><br />
              {q.explanation || 'No detailed step-by-step solution provided for this question.'}
            </div>
          </div>
        );
      })}

      <button className="btn btn-outline btn-lg" onClick={() => navigate(`/quiz/${quizId}/result`)}>Back to Results</button>
    </div>
  );
}
