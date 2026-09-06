import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Helper: Safe JSON parsing for localStorage
function safeJSONParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function getUserKey(user) {
  if (!user) return null;
  return user.id || user._id || user.email || 'guest';
}

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(() => safeJSONParse('eduquiz_registered_users_v2', []));
  const [user, setUser] = useState(() => safeJSONParse('eduquiz_user', null));
  const [token, setToken] = useState(() => localStorage.getItem('eduquiz_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const userKey = getUserKey(user);

  const [purchases, setPurchases] = useState(() => 
    userKey ? safeJSONParse(`eduquiz_purchases_${userKey}`, []) : []
  );

  const [attempts, setAttempts] = useState(() => 
    userKey ? safeJSONParse(`eduquiz_attempts_${userKey}`, {}) : {}
  );

  // Sync user-scoped storage state when user changes
  useEffect(() => {
    const key = getUserKey(user);
    if (key) {
      setAttempts(safeJSONParse(`eduquiz_attempts_${key}`, {}));
      setPurchases(safeJSONParse(`eduquiz_purchases_${key}`, []));
    } else {
      setAttempts({});
      setPurchases([]);
    }
  }, [user?.email, user?.id, user?._id]);

  // Initial Auth Check on Application Boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('eduquiz_token');
      if (storedToken) {
        try {
          const res = await api.getProfile();
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('eduquiz_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out.');
          logoutUser();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const saveAuthSession = useCallback((newUser, newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('eduquiz_token', newToken);
    }
    setUser(newUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(newUser));

    setUsersDb((prevDb) => {
      const updatedDb = [newUser, ...prevDb.filter((u) => u.email !== newUser.email)];
      localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));
      return updatedDb;
    });
  }, []);

  const registerAccount = async (newUserData) => {
    const payload = {
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      ...newUserData
    };
    const res = await api.register(payload);
    if (res && res.user) {
      saveAuthSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const loginUser = async (loginData) => {
    const inputEmail = (loginData.email || '').toLowerCase().trim();
    const inputPassword = (loginData.password || '').trim();

    const res = await api.login({
      email: inputEmail,
      password: inputPassword
    });

    if (res && res.user) {
      saveAuthSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const googleLoginUser = async (googlePayload) => {
    const res = await api.googleLogin(googlePayload);
    if (res && res.user) {
      saveAuthSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res?.message || 'Google Authentication failed');
  };

  const updateUserExamLevel = async (examLevel) => {
    if (!user) return;
    const updatedUser = { ...user, examLevel };
    setUser(updatedUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(updatedUser));

    setUsersDb((prevDb) => {
      const updatedDb = prevDb.map((u) => (u.email === user.email ? { ...u, examLevel } : u));
      localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));
      return updatedDb;
    });

    await api.updateExamLevel(user.email, examLevel);
    return updatedUser;
  };

  const updateUserProfile = async (updatedFields) => {
    if (!user) return null;
    const mergedUser = { ...user, ...updatedFields };
    setUser(mergedUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(mergedUser));

    setUsersDb((prevDb) => {
      const updatedDb = prevDb.map((u) => (u.email === user.email ? { ...u, ...updatedFields } : u));
      localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));
      return updatedDb;
    });

    const res = await api.updateProfile(updatedFields);
    if (res && res.success && res.user) {
      const finalUser = { ...mergedUser, ...res.user };
      setUser(finalUser);
      localStorage.setItem('eduquiz_user', JSON.stringify(finalUser));
      return finalUser;
    }
    return mergedUser;
  };

  const logoutUser = useCallback(() => {
    setUser(null);
    setToken(null);
    setAttempts({});
    setPurchases([]);
    localStorage.removeItem('eduquiz_user');
    localStorage.removeItem('eduquiz_token');
    sessionStorage.removeItem('eduquiz_new_registration');
  }, []);

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
    <AuthContext.Provider
      value={{
        user,
        token,
        usersDb,
        isLoading,
        registerAccount,
        loginUser,
        googleLoginUser,
        updateUserExamLevel,
        updateUserProfile,
        logoutUser,
        purchases,
        addPurchase,
        attempts,
        addAttempt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);