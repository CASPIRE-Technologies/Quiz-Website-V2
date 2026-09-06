import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ExamsPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const subjects = [
    { id: "comb_math", nameKey: "exams.subjectCombinedMaths", fallback: "Combined Mathematics", icon: "📐", bg: "var(--color-primary-light)" },
    { id: "physics", nameKey: "exams.subjectPhysics", fallback: "Physics", icon: "⚡", bg: "var(--color-secondary-light)" },
    { id: "chemistry", nameKey: "exams.subjectChemistry", fallback: "Chemistry", icon: "🧪", bg: "var(--color-success-light)" },
    { id: "biology", nameKey: "exams.subjectBiology", fallback: "Biology", icon: "🧬", bg: "var(--color-error-light)" },
    { id: "ict", nameKey: "exams.subjectIct", fallback: "Information Technology", icon: "💻", bg: "var(--color-primary-light)" },
    { id: "math", nameKey: "exams.subjectMaths", fallback: "Mathematics", icon: "🔢", bg: "var(--color-warning-light)" },
    { id: "science", nameKey: "exams.subjectScience", fallback: "Science", icon: "🔬", bg: "var(--color-success-light)" }
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-main)' }}>{t('exams.title')}</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{t('exams.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {subjects.map(sub => (
          <div key={sub.id} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate(`/quizzes?subjectId=${sub.id}`)}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: sub.bg, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {sub.icon}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)' }}>{t(sub.nameKey, sub.fallback)}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('exams.availableQuizzes')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
