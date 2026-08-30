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
        const isCorrect = (q.studentChoice !== undefined ? q.studentChoice : q.correctIndex) === q.correctIndex;
        return (
          <div key={q.id || idx} className="card" style={{ marginBottom: '20px', borderLeft: `6px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-error)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>Question {idx + 1}</span>
              <span className={`badge ${isCorrect ? 'badge-success' : 'badge-error'}`}>{isCorrect ? 'Correct ✓' : 'Incorrect ✕'}</span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>{q.text}</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} style={{ padding: '12px 16px', borderRadius: '8px', border: oIdx === q.correctIndex ? '1px solid var(--color-success)' : '1px solid var(--color-border)', backgroundColor: oIdx === q.correctIndex ? 'var(--color-success-light)' : 'var(--color-bg)', fontWeight: oIdx === q.correctIndex ? 700 : 500 }}>
                  {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex ? '✓ (Correct Key)' : ''}
                </div>
              ))}
            </div>

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
