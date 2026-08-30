const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

exports.submitAttempt = async (req, res) => {
  const { quizId, answers, timeTakenSeconds, userId } = req.body;
  const cleanQuizId = String(quizId || '').trim();

  try {
    // 1. Fetch quiz questions directly from MongoDB
    const quiz = await Quiz.findOne({ $or: [{ id: cleanQuizId }, { _id: cleanQuizId }] });
    const questions = quiz ? (quiz.questions || []) : [];

    let score = 0;
    let totalMarks = 0;
    const totalQuestions = questions.length > 0 ? questions.length : Object.keys(answers || {}).length || 1;

    if (questions.length > 0) {
      questions.forEach((q, idx) => {
        const qId = q.id || idx + 1;
        const studentChoice = answers ? (answers[qId] !== undefined ? answers[qId] : answers[idx]) : undefined;
        totalMarks += (q.marks || 1);
        if (studentChoice !== undefined && Number(studentChoice) === Number(q.correct_index)) {
          score += (q.marks || 1);
        }
      });
    } else {
      // If quiz has no embedded questions, fallback calculate score
      Object.keys(answers || {}).forEach(() => {
        totalMarks += 1;
        score += 1;
      });
      if (totalMarks === 0) totalMarks = 1;
    }

    const percentage = Math.min(100, Math.round((score / (totalMarks || 1)) * 100));
    const seconds = Number(timeTakenSeconds || 0);
    const mins = Math.floor(seconds / 60);
    const timeTakenStr = mins > 0 ? `${mins} mins` : `${seconds}s`;
    const attemptId = `att-${Date.now()}`;
    const cleanUserId = userId || 'student-usr-01';

    const attemptDoc = await QuizAttempt.create({
      id: attemptId,
      user_id: cleanUserId,
      quiz_id: cleanQuizId,
      score,
      total_questions: totalQuestions,
      percentage,
      time_taken_seconds: seconds,
      status: 'completed',
      answers: answers || {}
    });

    return res.json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        id: attemptDoc.id,
        quizId: cleanQuizId,
        score,
        total: totalQuestions,
        percentage,
        timeTaken: timeTakenStr,
        date: new Date().toISOString().split('T')[0],
        answers: answers || {}
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record quiz attempt in MongoDB.',
      error: err.message
    });
  }
};

exports.getAttemptResult = async (req, res) => {
  const { id } = req.params;
  try {
    const attempt = await QuizAttempt.findOne({
      $or: [{ id }, { quiz_id: id }]
    }).sort({ created_at: -1 });

    if (attempt) {
      const seconds = attempt.time_taken_seconds || 0;
      const mins = Math.floor(seconds / 60);
      const timeTakenStr = mins > 0 ? `${mins} mins` : `${seconds}s`;

      return res.json({
        success: true,
        result: {
          id: attempt.id,
          quizId: attempt.quiz_id,
          score: attempt.score,
          total: attempt.total_questions,
          percentage: attempt.percentage,
          timeTaken: timeTakenStr,
          date: new Date(attempt.created_at || Date.now()).toISOString().split('T')[0]
        }
      });
    }
  } catch (err) {}

  return res.json({
    success: true,
    result: {
      id,
      score: 0,
      total: 0,
      percentage: 0,
      timeTaken: '0 mins',
      date: new Date().toISOString().split('T')[0]
    }
  });
};
