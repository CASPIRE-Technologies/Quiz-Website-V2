import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdminQuizWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [price, setPrice] = useState(300);

  const handlePublish = async () => {
    await api.createQuiz({ title, subjectName: subject, price, duration: 45, examLevel: 'ol' });
    alert('Quiz published to MySQL database successfully!');
    navigate('/admin');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Create New Quiz (Wizard)</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Step {step} of 3</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Step 1: Quiz Information</h3>
            <div className="form-group">
              <label className="form-label">Quiz Paper Title</label>
              <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. O/L Mathematics Paper 02" />
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Pricing</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Step 2: Pricing & Duration</h3>
            <div className="form-group">
              <label className="form-label">Price (LKR)</label>
              <input type="number" className="form-input" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Publish</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Step 3: Publish to MySQL</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Publishing paper: <strong>{title || 'New Model Paper'}</strong> (LKR {price})</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={handlePublish}>Publish Quiz Live 🎉</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
