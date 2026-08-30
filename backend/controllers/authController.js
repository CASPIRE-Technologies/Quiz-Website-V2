const { pool } = require('../config/db');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    examLevel: user.exam_level,
    school: user.school
  };
}

exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    examLevel,
    school
  } = req.body;

  const cleanEmail = String(email || '').toLowerCase().trim();
  const cleanPassword = String(password || '').trim();

  if (!name || !cleanEmail || !cleanPassword) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists for this email.'
      });
    }

    const [rows] = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, exam_level, school)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING id, name, email, phone, role, exam_level, school`,
      [
        String(name).trim(),
        cleanEmail,
        phone || null,
        hashPassword(cleanPassword),
        'student',
        examLevel || 'G.C.E. Ordinary Level (O/L)',
        school || 'Sri Lankan School'
      ]
    );

    return res.status(201).json({
      success: true,
      user: formatUser(rows[0])
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Check the database connection and tables.'
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = String(email || '').toLowerCase().trim();
  const cleanPassword = String(password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    
    if (rows.length > 0) {
      const user = rows[0];
      const storedPassword = user.password_hash || '';
      const passwordMatches =
        storedPassword === hashPassword(cleanPassword) ||
        storedPassword === cleanPassword;

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      return res.json({
        success: true,
        user: formatUser(user)
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please start the backend and check Supabase.'
    });
  }
};

exports.getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: {
      name: 'Kasun Perera',
      email: 'kasun.perera@student.lk',
      phone: '+94 77 123 4567',
      examLevel: 'G.C.E. Ordinary Level (O/L)',
      school: 'Ananda College, Colombo',
      quizzesPurchased: 2,
      quizzesCompleted: 1,
      averageScore: 88,
      studyHours: 24.5,
      paymentHistory: [
        { id: "TXN-90214", date: "2026-08-20", quizTitle: "Algebra & Quadratic Equations Paper 01", amount: "300 LKR", status: "Successful", gateway: "Card Payment" },
        { id: "TXN-88120", date: "2026-08-15", quizTitle: "Scholarship Intelligence & Logic Model Paper 01", amount: "250 LKR", status: "Successful", gateway: "PayHere" }
      ]
    }
  });
};
