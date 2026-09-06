import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function QuizInstructionsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getQuizById(quizId);
      if (res.quiz) setQuiz(res.quiz);
    }
    load();
  }, [quizId]);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
          {quiz ? quiz.title : (language === 'si' ? 'ප්‍රශ්න පත්‍රය පූරණය වෙමින් පවතී...' : 'Loading Examination Paper...')}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          {quiz ? `${quiz.subjectName || (language === 'si' ? 'සාමාන්‍ය' : 'General')} • ${quiz.questions?.length || quiz.questionCount || 30} ${language === 'si' ? 'ප්‍රශ්න' : 'Questions'} • ${quiz.durationMinutes || 45} ${language === 'si' ? 'මිනිත්තු' : 'Minutes'}` : (language === 'si' ? 'පූරණය වෙමින්...' : 'Loading...')}
        </p>
      </div>

      <div className="card" style={{ backgroundColor: 'var(--color-warning-light)', borderColor: 'var(--color-border)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {language === 'si' ? 'වැදගත් දැනුම්දීමක්' : 'Important Notice'}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {language === 'si' ? '"ප්‍රශ්නාවලිය අරඹන්න" ක්ලික් කළ පසු, කාල ගණකය ආරම්භ වන අතර එය නැවැත්විය නොහැක.' : 'Once you click "Start Quiz", the countdown timer begins immediately and cannot be paused.'}
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, cursor: 'pointer', color: 'var(--color-text-main)' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          {language === 'si' ? 'මම සියලු විභාග උපදෙස් කියවා එකඟ වෙමි.' : 'I have read and agree to all exam instructions.'}
        </label>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => navigate('/my-quizzes')}>
          {language === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
        </button>
        <button className="btn btn-primary btn-lg" disabled={!agreed} onClick={() => navigate(`/quiz/${quizId}/attempt`)}>
          {language === 'si' ? 'ප්‍රශ්නාවලිය අරඹන්න' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
