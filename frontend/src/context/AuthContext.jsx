import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const initialSeedUsers = [
  {
    name: 'Kasun Perera',
    email: 'kasun.perera@student.lk',
    phone: '+94 77 123 4567',
    password: 'password123',
    role: 'student',
    examLevel: 'G.C.E. Ordinary Level (O/L)',
    school: 'Ananda College, Colombo'
  },
  {
    name: 'Dilani Fernando',
    email: 'dilani.f@gmail.com',
    phone: '+94 71 888 2211',
    password: 'password123',
    role: 'student',
    examLevel: 'G.C.E. Advanced Level (A/L)',
    school: 'Visakha Vidyalaya, Colombo'
  }
];

function getStoredUserDatabase() {
  const stored = localStorage.getItem('eduquiz_registered_users_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(initialSeedUsers));
  return initialSeedUsers;
}

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(getStoredUserDatabase);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('eduquiz_user');
    return stored ? JSON.parse(stored) : initialSeedUsers[0];
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

  // Register a brand new user account
  const registerAccount = (newUserData) => {
    const db = getStoredUserDatabase();
    const newUser = {
      name: newUserData.name || 'New Student',
      email: newUserData.email.toLowerCase().trim(),
      phone: newUserData.phone || '+94 77 000 0000',
      password: newUserData.password || 'password123',
      role: 'student',
      examLevel: newUserData.examLevel || 'G.C.E. Ordinary Level (O/L)',
      school: newUserData.school || 'Sri Lankan School',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedDb = [newUser, ...db.filter(u => u.email !== newUser.email)];
    setUsersDb(updatedDb);
    localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));

    // Automatically set logged in user to the newly registered user
    setUser(newUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(newUser));
    return newUser;
  };

  // Authenticate existing user or admin
  const loginUser = (loginData) => {
    const inputEmail = (loginData.email || '').toLowerCase().trim();
    const inputPassword = (loginData.password || '').trim();

    // Admin Credentials Check
    if ((inputEmail === 'admin' || inputEmail === 'admin@eduquiz.lk') && inputPassword === 'admin@123') {
      const adminAcc = {
        name: 'System Administrator',
        email: 'admin@eduquiz.lk',
        phone: '+94 11 200 0000',
        role: 'admin',
        examLevel: 'Administrator'
      };
      setUser(adminAcc);
      localStorage.setItem('eduquiz_user', JSON.stringify(adminAcc));
      return adminAcc;
    }

    // Lookup in registered database
    const db = getStoredUserDatabase();
    const found = db.find(u => u.email.toLowerCase() === inputEmail);

    if (found) {
      setUser(found);
      localStorage.setItem('eduquiz_user', JSON.stringify(found));
      return found;
    }

    // Fallback: If user provides full details object, save & set
    if (loginData.name) {
      setUser(loginData);
      localStorage.setItem('eduquiz_user', JSON.stringify(loginData));
      return loginData;
    }

    // Create user dynamically based on entered email handle
    const createdUser = {
      name: inputEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: inputEmail,
      phone: '+94 77 123 4567',
      role: 'student',
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      school: 'Sri Lankan School'
    };
    setUser(createdUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(createdUser));
    return createdUser;
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
    <AuthContext.Provider value={{ user, usersDb, registerAccount, loginUser, logoutUser, purchases, addPurchase, attempts, addAttempt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
