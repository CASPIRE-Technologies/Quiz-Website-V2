const Quiz = require('../models/Quiz');

function formatQuiz(quizDoc) {
  const quiz = quizDoc.toObject ? quizDoc.toObject() : quizDoc;
  return {
    id: quiz.id || quiz._id,
    title: quiz.title,
    examLevel: quiz.exam_level || quiz.examLevel || 'ol',
    streamId: quiz.stream_id || quiz.streamId || 'physical',
    subjectId: quiz.subject_id || quiz.subjectId || 'math',
    subjectName: quiz.subject_name || quiz.subjectName || 'Mathematics',
    questionCount: quiz.question_count || (quiz.questions ? quiz.questions.length : 30),
    durationMinutes: quiz.duration_minutes || quiz.durationMinutes || 45,
    difficulty: quiz.difficulty || 'Medium',
    price: quiz.price || 300,
    about: quiz.about || 'Model Paper',
    is_published: quiz.is_published !== false,
    questions: (quiz.questions || []).map((q, idx) => ({
      id: q.id || idx + 1,
      text: q.question_text || q.text || '',
      questionText: q.question_text || q.text || '',
      explanation: q.explanation || '',
      correctIndex: q.correct_index !== undefined ? q.correct_index : 0,
      marks: q.marks || 1,
      options: (q.options || []).map((o, oIdx) => o.option_text || o.text || String(o))
    }))
  };
}

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ is_published: { $ne: false } }).sort({ created_at: -1 });
    return res.json({ success: true, quizzes: quizzes.map(formatQuiz) });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes from MongoDB.',
      error: err.message
    });
  }
};

exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findOne({ $or: [{ id }, { _id: id }] });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz paper not found.'
      });
    }

    return res.json({
      success: true,
      quiz: formatQuiz(quiz)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz details.',
      error: err.message
    });
  }
};
