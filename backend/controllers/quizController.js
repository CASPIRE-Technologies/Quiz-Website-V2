const { pool } = require('../config/db');

// Seed mock data fallback for quizzes
const mockQuizzes = [
  {
    id: "quiz-math-01",
    title: "Algebra & Quadratic Equations Paper 01",
    examLevel: "ol",
    subjectId: "math",
    subjectName: "Mathematics",
    questionCount: 30,
    durationMinutes: 45,
    difficulty: "Medium",
    price: 300,
    currency: "LKR",
    attemptsAllowed: 1,
    rating: 4.8,
    reviewsCount: 142,
    about: "This quiz covers essential algebraic manipulations, factorization, solving quadratic equations using completing the square method, and real-world word problems.",
    topics: ["Algebraic Expressions", "Factorization", "Quadratic Equations", "Indices & Logarithms"],
    questions: [
      {
        id: 1,
        text: "Solve for x in the equation: 2x² - 8x + 6 = 0",
        options: ["x = 1 or x = 3", "x = -1 or x = -3", "x = 2 or x = 4", "x = 0 or x = 3"],
        correctIndex: 0,
        explanation: "Divide the equation by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore, x = 1 or x = 3."
      },
      {
        id: 2,
        text: "What is the value of x if log₂(x) = 5?",
        options: ["10", "25", "32", "64"],
        correctIndex: 2,
        explanation: "By logarithmic identity log_b(a) = c implies b^c = a. Therefore, 2⁵ = 32."
      }
    ]
  },
  {
    id: "quiz-physics-01",
    title: "Mechanics & Gravitational Fields Test",
    examLevel: "al",
    streamId: "physical",
    subjectId: "physics",
    subjectName: "Physics",
    questionCount: 30,
    durationMinutes: 60,
    difficulty: "Hard",
    price: 450,
    currency: "LKR",
    attemptsAllowed: 1,
    rating: 4.9,
    reviewsCount: 98,
    about: "Advanced Level physics mock paper focusing on Newton's Laws, Momentum Conservation, Kinematics, and Circular Motion.",
    topics: ["Kinematics", "Newton's Laws", "Work, Energy & Power", "Circular Motion", "Gravitational Fields"],
    questions: []
  },
  {
    id: "quiz-g5-01",
    title: "Scholarship Intelligence & Logic Model Paper 01",
    examLevel: "g5",
    subjectId: "g5_iq",
    subjectName: "General Knowledge & IQ",
    questionCount: 25,
    durationMinutes: 30,
    difficulty: "Easy",
    price: 250,
    currency: "LKR",
    attemptsAllowed: 2,
    rating: 4.7,
    reviewsCount: 210,
    about: "Specially formulated picture logic, pattern completion, and vocabulary questions for Grade 5 scholarship students.",
    topics: ["Pattern Recognition", "Numerical Sequences", "Vocabulary", "Spatial Reasoning"],
    questions: []
  }
];

exports.getAllQuizzes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE is_published = TRUE');
    if (rows.length > 0) {
      return res.json({ success: true, quizzes: rows });
    }
  } catch (err) {
    // fallback
  }
  return res.json({ success: true, quizzes: mockQuizzes });
};

exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [id]);
    if (rows.length > 0) {
      const quiz = rows[0];
      return res.json({ success: true, quiz });
    }
  } catch (err) {
    // fallback
  }

  const found = mockQuizzes.find(q => q.id === id) || mockQuizzes[0];
  return res.json({ success: true, quiz: found });
};
