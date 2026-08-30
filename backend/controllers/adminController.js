const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Purchase = require('../models/Purchase');
const QuizAttempt = require('../models/QuizAttempt');

exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuizzes = await Quiz.countDocuments();
    const quizPurchases = await Purchase.countDocuments({ status: 'Successful' });

    const revAggregate = await Purchase.aggregate([
      { $match: { status: 'Successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenueLKR = revAggregate.length > 0 ? revAggregate[0].total : 0;

    const completedAttempts = await QuizAttempt.countDocuments({ status: 'completed' });
    const avgAggregate = await QuizAttempt.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$percentage' } } }
    ]);
    const averageScore = avgAggregate.length > 0 ? Math.round(avgAggregate[0].avg * 10) / 10 : 0;

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalQuizzes,
        quizPurchases,
        revenueLKR,
        completedAttempts,
        averageScore
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute admin statistics.',
      error: err.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ created_at: -1 });
    return res.json({
      success: true,
      users: users.map(u => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        examLevel: u.exam_level || 'G.C.E. Ordinary Level (O/L)',
        school: u.school,
        createdAt: u.created_at,
        status: 'Active',
        purchasesCount: 0,
        attemptsCount: 0
      }))
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch registered users.',
      error: err.message
    });
  }
};

function prepareQuizQuestions(questions) {
  if (!questions || !Array.isArray(questions)) return [];

  return questions.map((q, idx) => {
    const qText = String(q.text || q.questionText || '').trim();
    const options = (q.options || []).map((optText, oIdx) => ({
      option_letter: String.fromCharCode(65 + oIdx),
      option_text: String(optText || '').trim(),
      is_correct: (q.correctIndex === oIdx)
    }));

    return {
      id: q.id || idx + 1,
      question_text: qText,
      explanation: q.explanation || '',
      correct_index: q.correctIndex !== undefined ? q.correctIndex : 0,
      marks: q.marks || 1,
      order_index: idx + 1,
      options
    };
  });
}

exports.createQuiz = async (req, res) => {
  const quizData = req.body;

  if (!quizData.title || String(quizData.title).trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Quiz title is required.'
    });
  }

  const quizId = `quiz-custom-${Date.now()}`;
  const subjectId = quizData.subjectId || 'math';
  const subjectName = quizData.subjectName || 'Mathematics';
  const questions = quizData.questions || [];

  try {
    const formattedQuestions = prepareQuizQuestions(questions);

    const newQuiz = await Quiz.create({
      id: quizId,
      title: String(quizData.title).trim(),
      exam_level: quizData.examLevel || 'ol',
      stream_id: quizData.streamId || 'physical',
      subject_id: subjectId,
      subject_name: subjectName,
      question_count: formattedQuestions.length || quizData.questionCount || 30,
      duration_minutes: Number(quizData.duration || quizData.durationMinutes || 45),
      difficulty: quizData.difficulty || 'Medium',
      price: Number(quizData.price || 300),
      about: quizData.description || quizData.about || 'Custom Model Paper',
      is_published: true,
      questions: formattedQuestions
    });

    return res.json({
      success: true,
      message: 'Quiz paper published successfully to MongoDB.',
      quizId: newQuiz.id
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Quiz creation failed.',
      error: err.message
    });
  }
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const quizData = req.body;
  const subjectId = quizData.subjectId || 'math';
  const subjectName = quizData.subjectName || 'Mathematics';
  const questions = quizData.questions || [];

  try {
    const formattedQuestions = prepareQuizQuestions(questions);

    const updateFields = {
      title: String(quizData.title).trim(),
      exam_level: quizData.examLevel || 'ol',
      stream_id: quizData.streamId || 'physical',
      subject_id: subjectId,
      subject_name: subjectName,
      duration_minutes: Number(quizData.duration || quizData.durationMinutes || 45),
      difficulty: quizData.difficulty || 'Medium',
      price: Number(quizData.price || 300),
      about: quizData.description || quizData.about || 'Custom Model Paper',
      is_published: quizData.is_published !== false
    };

    if (formattedQuestions.length > 0) {
      updateFields.questions = formattedQuestions;
      updateFields.question_count = formattedQuestions.length;
    }

    const quiz = await Quiz.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      updateFields,
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Quiz updated successfully in MongoDB.',
      quizId: quiz.id
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Quiz update failed.',
      error: err.message
    });
  }
};
