import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { addPurchase } = useAuth();

  const handlePay = async () => {
    await api.checkout(quizId || 'quiz-math-01', 300, 'Card Payment');
    addPurchase(quizId || 'quiz-math-01');
    alert('Payment Successful! Quiz Unlocked.');
    navigate(`/quiz/${quizId || 'quiz-math-01'}/instructions`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Payment Checkout</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Complete payment via secure gateway to unlock quiz</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Select Payment Gateway</h3>
          <div style={{ padding: '16px', borderRadius: '14px', border: '2px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCard size={24} color="var(--color-primary)" />
            <div>
              <div style={{ fontWeight: 700 }}>Credit / Debit Card</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Visa, MasterCard, Amex</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-success)', marginTop: '20px' }}>
            <ShieldCheck size={16} /> <span>256-Bit SSL Encrypted Payment Guarantee</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>
            <span>Total Pay:</span>
            <span style={{ color: 'var(--color-primary)' }}>LKR 300</span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={handlePay}>Pay LKR 300</button>
        </div>
      </div>
    </div>
  );
}
