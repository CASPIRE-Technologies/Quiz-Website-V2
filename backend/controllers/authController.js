const { pool } = require('../config/db');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email || 'kasun.perera@student.lk']);
    
    if (rows.length > 0) {
      const user = rows[0];
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          examLevel: user.exam_level,
          school: user.school
        },
        token: 'mock-jwt-token-eduquiz-2026'
      });
    }

    // Default Fallback User
    return res.json({
      success: true,
      user: {
        id: 'usr-01',
        name: 'Kasun Perera',
        email: email || 'kasun.perera@student.lk',
        phone: '+94 77 123 4567',
        role: 'student',
        examLevel: 'G.C.E. Ordinary Level (O/L)',
        school: 'Ananda College, Colombo'
      },
      token: 'mock-jwt-token-eduquiz-2026'
    });
  } catch (err) {
    // Fallback response if DB offline
    return res.json({
      success: true,
      user: {
        id: 'usr-01',
        name: 'Kasun Perera',
        email: email || 'kasun.perera@student.lk',
        phone: '+94 77 123 4567',
        role: 'student',
        examLevel: 'G.C.E. Ordinary Level (O/L)',
        school: 'Ananda College, Colombo'
      },
      token: 'mock-jwt-token-eduquiz-2026'
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
