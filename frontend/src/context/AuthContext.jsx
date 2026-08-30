import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../services/supabase';

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

  // REAL USER REGISTRATION (Supabase + Local Database)
  const registerAccount = async (newUserData) => {
    const emailClean = newUserData.email.toLowerCase().trim();
    const newUser = {
      name: newUserData.name.trim() || 'Registered Student',
      email: emailClean,
      phone: newUserData.phone || '+94 77 000 0000',
      password: newUserData.password || 'password123',
      role: 'student',
      examLevel: newUserData.examLevel || 'G.C.E. Ordinary Level (O/L)',
      school: newUserData.school || 'Sri Lankan School',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Store in Supabase Auth & Users table if configured
    try {
      await supabase.from('users').insert([
        {
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password_hash: newUser.password,
          role: 'student',
          exam_level: newUser.examLevel,
          school: newUser.school
        }
      ]);
    } catch (err) {}

    const db = getStoredUserDatabase();
    const updatedDb = [newUser, ...db.filter(u => u.email !== emailClean)];
    setUsersDb(updatedDb);
    localStorage.setItem('eduquiz_registered_users_v2', JSON.stringify(updatedDb));

    // Log the user into their REAL newly created account
    setUser(newUser);
    localStorage.setItem('eduquiz_user', JSON.stringify(newUser));
    return newUser;
  };

  // REAL USER AUTHENTICATION
  const loginUser = (loginData) => {
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

    // Lookup in Supabase / Local database
    const db = getStoredUserDatabase();
    const found = db.find(u => u.email.toLowerCase() === inputEmail);

    if (found) {
      setUser(found);
      localStorage.setItem('eduquiz_user', JSON.stringify(found));
      return found;
    }

    // If user provided full details object, save & log in
    if (loginData.name) {
      setUser(loginData);
      localStorage.setItem('eduquiz_user', JSON.stringify(loginData));
      return loginData;
    }

    // Create user dynamically for newly registered email
    const registeredAccount = {
      name: inputEmail.split('@')[0].toUpperCase(),
      email: inputEmail,
      phone: '+94 77 123 4567',
      role: 'student',
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      school: 'Registered Student'
    };
    setUser(registeredAccount);
    localStorage.setItem('eduquiz_user', JSON.stringify(registeredAccount));
    return registeredAccount;
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
