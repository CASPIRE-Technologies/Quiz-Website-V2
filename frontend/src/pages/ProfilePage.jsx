import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Student Profile</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Manage account details, view subscription status, and payment receipts</p>
      </div>

      <div className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: 'white', fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.name ? user.name.charAt(0) : 'S'}
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{user?.name}</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{user?.email} • {user?.phone}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <span className="badge badge-primary">{user?.examLevel}</span>
            <span className="badge badge-neutral">{user?.school}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Payment Receipts</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Transaction ID</th>
                <th style={{ padding: '12px 16px' }}>Quiz Paper Name</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Gateway</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {user?.paymentHistory?.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{item.id}</td>
                  <td style={{ padding: '12px 16px' }}>{item.quizTitle}</td>
                  <td style={{ padding: '12px 16px' }}>{item.amount}</td>
                  <td style={{ padding: '12px 16px' }}>{item.gateway}</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-success">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
