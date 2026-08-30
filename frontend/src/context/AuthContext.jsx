import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Kasun Perera',
    email: 'kasun.perera@student.lk',
    phone: '+94 77 123 4567',
    role: 'student',
    examLevel: 'G.C.E. Ordinary Level (O/L)',
    school: 'Ananda College, Colombo',
    studyHours: 24.5,
    paymentHistory: [
      { id: "TXN-90214", date: "2026-08-20", quizTitle: "Algebra & Quadratic Equations Paper 01", amount: "300 LKR", status: "Successful", gateway: "Card Payment" }
    ]
  });

  const [purchases, setPurchases] = useState(["quiz-math-01", "quiz-g5-01"]);
  const [attempts, setAttempts] = useState({
    "quiz-g5-01": { score: 22, total: 25, percentage: 88, timeTaken: "21:40", date: "2026-08-22" }
  });

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);

  const addPurchase = (quizId) => {
    if (!purchases.includes(quizId)) setPurchases([...purchases, quizId]);
  };

  const addAttempt = (quizId, result) => {
    setAttempts({ ...attempts, [quizId]: result });
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, purchases, addPurchase, attempts, addAttempt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
