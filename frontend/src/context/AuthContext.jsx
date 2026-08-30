import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

function getStoredUserDatabase() {
  const stored = localStorage.getItem('eduquiz_registered_users_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return [];
}

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(getStoredUserDatabase);

  // Active user session (null if not logged in, no hardcoded demo accounts)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('eduquiz_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [purchases, setPurchases] = useState(() => {
    const stored = localStorage.getItem('eduquiz_purchases');
    return stored ? JSON.parse(stored) : [];
  });

  const [attempts, setAttempts] = useState(() => {
    const stored = localStorage.getItem('eduquiz_attempts');
    return stored ? JSON.parse(stored) : {};
  });

  const registerAccount = async (newUserData) => {
    const { user: newUser } = await api.register(newUserData);

    const db = getStoredUserDatabase();
    const updatedDb = [newUser, ...db.filter(u => u.email !== newUser.email)];
    setUsersDb(updatedDb);
    localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));

    setUser(newUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(newUser));
    return newUser;
  };

  const loginUser = async (loginData) => {
    const inputEmail = (loginData.email || '').toLowerCase().trim();
    const inputPassword = (loginData.password || '').trim();

    // Admin Credentials Check
    if ((inputEmail === 'admin' || inputEmail === 'admin@eduquiz.lk') && (inputPassword === 'admin@123' || inputPassword === 'admin')) {
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

    const { user: found } = await api.login({
      email: inputEmail,
      password: inputPassword
    });

    setUser(found);
    localStorage.setItem('eduquiz_user', JSON.stringify(found));
    return found;
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
