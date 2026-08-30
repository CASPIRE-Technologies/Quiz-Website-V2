import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ExamsPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();

  const subjects = [
    { id: "comb_math", name: "Combined Mathematics", icon: "📐", color: "#EFF6FF" },
    { id: "physics", name: "Physics", icon: "⚡", color: "#F5F3FF" },
    { id: "chemistry", name: "Chemistry", icon: "🧪", color: "#ECFDF5" },
    { id: "biology", name: "Biology", icon: "🧬", color: "#FEF2F2" },
    { id: "ict", name: "Information Technology", icon: "💻", color: "#EEF2FF" },
    { id: "math", name: "Mathematics", icon: "🔢", color: "#EFF6FF" },
    { id: "science", name: "Science", icon: "🔬", color: "#ECFDF5" }
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Choose a Subject</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Select a subject to browse model papers, past papers & topical unit tests</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {subjects.map(sub => (
          <div key={sub.id} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate(`/quizzes?subjectId=${sub.id}`)}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {sub.icon}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{sub.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Available Quizzes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
