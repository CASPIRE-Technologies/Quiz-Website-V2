import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('eduquiz_user');
    return stored ? JSON.parse(stored) : {
      name: 'Kasun Perera',
      email: 'kasun.perera@student.lk',
      phone: '+94 77 123 4567',
      role: 'student',
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      school: 'Ananda College, Colombo'
    };
  });

  const [purchases, setPurchases] = useState(() => {
    const stored = localStorage.getItem('eduquiz_purchases');
    return stored ? JSON.parse(stored) : ["quiz-math-01", "quiz-g5-01"];
  });

  const [attempts, setAttempts] = useState(() => {
    const stored = localStorage.getItem('eduquiz_attempts');
    return stored ? JSON.parse(stored) : {
      "quiz-g5-01": { score: 22, total: 25, percentage: 88, timeTaken: "21:40", date: "2026-08-22" }
    };
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('eduquiz_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('eduquiz_user');
  };

  const addPurchase = (quizId) => {
    if (!purchases.includes(quizId)) {
      const updated = [...purchases, quizId];
      setPurchases(updated);
      localStorage.setItem('eduquiz_purchases', JSON.stringify(updated));
    }
  };

  const addAttempt = (quizId, result) => {
    const updated = { ...attempts, [quizId]: result };
    setAttempts(updated);
    localStorage.setItem('eduquiz_attempts', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, purchases, addPurchase, attempts, addAttempt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
