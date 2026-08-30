import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

function getStoredUserDatabase() {
  const stored = localStorage.getItem('eduquiz_registered_users_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return [];
}

function getUserKey(user) {
  if (!user) return null;
  return user.id || user.email || 'guest';
}

function getStoredAttemptsForUser(userKey) {
  if (!userKey) return {};
  const stored = localStorage.getItem(`eduquiz_attempts_${userKey}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return {};
}

function getStoredPurchasesForUser(userKey) {
  if (!userKey) return [];
  const stored = localStorage.getItem(`eduquiz_purchases_${userKey}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return [];
}

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(getStoredUserDatabase);

  // Active user session (null if not logged in)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('eduquiz_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [purchases, setPurchases] = useState(() => {
    const storedUser = localStorage.getItem('eduquiz_user');
    const u = storedUser ? JSON.parse(storedUser) : null;
    return getStoredPurchasesForUser(getUserKey(u));
  });

  const [attempts, setAttempts] = useState(() => {
    const storedUser = localStorage.getItem('eduquiz_user');
    const u = storedUser ? JSON.parse(storedUser) : null;
    return getStoredAttemptsForUser(getUserKey(u));
  });

  // Re-sync user-scoped purchases and attempts whenever active user changes
  useEffect(() => {
    const key = getUserKey(user);
    setAttempts(getStoredAttemptsForUser(key));
    setPurchases(getStoredPurchasesForUser(key));
  }, [user?.email, user?.id]);

  const saveAuthSession = (newUser, token) => {
    if (token) {
      localStorage.setItem('eduquiz_token', token);
    }
    setUser(newUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(newUser));

    const db = getStoredUserDatabase();
    const updatedDb = [newUser, ...db.filter(u => u.email !== newUser.email)];
    setUsersDb(updatedDb);
    localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));
  };

  const registerAccount = async (newUserData) => {
    const { user: newUser, token } = await api.register(newUserData);
    saveAuthSession(newUser, token);
    return newUser;
  };

  const loginUser = async (loginData) => {
    const inputEmail = (loginData.email || '').toLowerCase().trim();
    const inputPassword = (loginData.password || '').trim();

    const { user: found, token } = await api.login({
      email: inputEmail,
      password: inputPassword
    });

    saveAuthSession(found, token);
    return found;
  };

  const googleLoginUser = async (googlePayload) => {
    const { user: found, token } = await api.googleLogin(googlePayload);
    saveAuthSession(found, token);
    return found;
  };

  const updateUserExamLevel = async (examLevel) => {
    if (!user) return;
    const updatedUser = { ...user, examLevel };
    setUser(updatedUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(updatedUser));

    const db = getStoredUserDatabase();
    const updatedDb = db.map(u => u.email === user.email ? { ...u, examLevel } : u);
    setUsersDb(updatedDb);
    localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));

    await api.updateExamLevel(user.email, examLevel);
    return updatedUser;
  };

  const logoutUser = () => {
    setUser(null);
    setAttempts({});
    setPurchases([]);
    localStorage.removeItem('eduquiz_user');
    localStorage.removeItem('eduquiz_token');
  };

  const addPurchase = (quizId) => {
    if (!purchases.includes(quizId)) {
      const updated = [...purchases, quizId];
      setPurchases(updated);
      const key = getUserKey(user);
      if (key) {
        localStorage.setItem(`eduquiz_purchases_${key}`, JSON.stringify(updated));
      }
    }
  };

  const addAttempt = (quizId, result) => {
    const updated = { ...attempts, [quizId]: result };
    setAttempts(updated);
    const key = getUserKey(user);
    if (key) {
      localStorage.setItem(`eduquiz_attempts_${key}`, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, usersDb, registerAccount, loginUser, googleLoginUser, updateUserExamLevel, logoutUser, purchases, addPurchase, attempts, addAttempt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
