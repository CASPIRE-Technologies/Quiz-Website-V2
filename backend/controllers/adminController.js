const { pool } = require('../config/db');

exports.getAdminStats = async (req, res) => {
  return res.json({
    success: true,
    stats: {
      totalStudents: 1420,
      totalQuizzes: 48,
      quizPurchases: 3890,
      revenueLKR: 1245000,
      completedAttempts: 3410,
      averageScore: 76.4
    }
  });
};

exports.createQuiz = async (req, res) => {
  const quizData = req.body;
  const quizId = `quiz-custom-${Date.now()}`;
  const subjectId = quizData.subjectId || 'math';
  const subjectName = quizData.subjectName || 'Mathematics';

  try {
    await pool.query(
      `INSERT INTO subjects (id, exam_level_id, name, category)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         exam_level_id = EXCLUDED.exam_level_id,
         name = EXCLUDED.name`,
      [subjectId, quizData.examLevel || 'ol', subjectName, 'Custom']
    );

    await pool.query(
      `INSERT INTO quizzes
        (id, title, exam_level, subject_id, subject_name, question_count, duration_minutes, difficulty, price, about, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quizId,
        quizData.title || 'Custom Model Paper',
        quizData.examLevel || 'ol',
        subjectId,
        subjectName,
        quizData.questions ? quizData.questions.length : 30,
        quizData.duration || 45,
        quizData.difficulty || 'Medium',
        quizData.price || 300,
        quizData.description || quizData.about || 'Custom Model Paper',
        true
      ]
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Quiz creation failed. Check that Supabase tables exist.',
      error: err.message
    });
  }

  return res.json({
    success: true,
    message: 'Quiz paper published successfully to Supabase.',
    quizId
  });
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const quizData = req.body;
  const subjectId = quizData.subjectId || 'math';
  const subjectName = quizData.subjectName || 'Mathematics';

  try {
    await pool.query(
      `INSERT INTO subjects (id, exam_level_id, name, category)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         exam_level_id = EXCLUDED.exam_level_id,
         name = EXCLUDED.name`,
      [subjectId, quizData.examLevel || 'ol', subjectName, 'Custom']
    );

    const [rows] = await pool.query(
      `UPDATE quizzes SET
        title = ?,
        exam_level = ?,
        subject_id = ?,
        subject_name = ?,
        question_count = ?,
        duration_minutes = ?,
        difficulty = ?,
        price = ?,
        about = ?,
        is_published = ?
       WHERE id = ?
       RETURNING id`,
      [
        quizData.title || 'Custom Model Paper',
        quizData.examLevel || 'ol',
        subjectId,
        subjectName,
        quizData.questions ? quizData.questions.length : quizData.questionCount || 30,
        quizData.duration || quizData.durationMinutes || 45,
        quizData.difficulty || 'Medium',
        quizData.price || 300,
        quizData.description || quizData.about || 'Custom Model Paper',
        quizData.is_published !== false,
        id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Quiz updated successfully in Supabase.',
      quizId: id
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Quiz update failed. Check that Supabase tables exist.',
      error: err.message
    });
  }
};
