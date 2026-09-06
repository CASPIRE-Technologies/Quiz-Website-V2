const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Purchase = require('../models/Purchase');
const QuizAttempt = require('../models/QuizAttempt');
const Question = require('../models/Question');

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
    const isMultipleChoice = q.isMultipleChoice !== false && q.is_multiple_choice !== false;
    const hasImage = Boolean(q.hasImage || q.has_image);
    const imageUrl = (hasImage && (q.imageUrl || q.image_url)) ? String(q.imageUrl || q.image_url).trim() : null;

    let correctIndices = [];
    if (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) {
      correctIndices = q.correctIndices.map(Number).filter(n => !isNaN(n));
    } else if (q.correctIndex !== undefined && q.correctIndex !== null && !isNaN(Number(q.correctIndex))) {
      correctIndices = [Number(q.correctIndex)];
    }

    const options = (q.options || []).map((opt, oIdx) => {
      const optText = typeof opt === 'string' ? opt : (opt?.text || opt?.option_text || '');
      const optLetter = (typeof opt === 'object' && opt?.letter) ? opt.letter : String.fromCharCode(65 + oIdx);
      const isCorrect = correctIndices.includes(oIdx);
      return {
        option_letter: optLetter,
        option_text: String(optText || '').trim(),
        is_correct: isCorrect
      };
    });

    const correctOptions = correctIndices.map(i => `Option ${String.fromCharCode(65 + i)}`);
    const correctOption = correctOptions.join(', ');

    return {
      id: q.id || idx + 1,
      question_text: qText,
      explanation: q.explanation || '',
      is_multiple_choice: isMultipleChoice,
      has_image: hasImage,
      image_url: imageUrl,
      correct_index: correctIndices.length > 0 ? correctIndices[0] : 0,
      correct_indices: correctIndices,
      correct_option: correctOption,
      correct_options: correctOptions,
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

    const quizQuery = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ id }, { _id: id }] } : { id };
    const quiz = await Quiz.findOneAndUpdate(
      quizQuery,
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

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ created_at: -1 });
    return res.json({
      success: true,
      questions: questions.map(q => ({
        id: q.id,
        questionText: q.question_text,
        isMultipleChoice: q.is_multiple_choice,
        hasImage: q.has_image,
        imageUrl: q.image_url,
        options: q.options ? q.options.map(o => ({
          letter: o.option_letter,
          text: o.option_text,
          isCorrect: o.is_correct
        })) : [],
        correctOption: q.correct_option,
        correctOptions: q.correct_options || (q.correct_option ? [q.correct_option] : []),
        correctIndex: q.correct_index,
        correctIndices: Array.isArray(q.correct_indices) && q.correct_indices.length > 0
          ? q.correct_indices
          : (q.correct_index !== null && q.correct_index !== undefined ? [q.correct_index] : []),
        subject: q.subject,
        examLevel: q.exam_level,
        explanation: q.explanation,
        quizId: q.quiz_id,
        createdAt: q.created_at
      }))
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch questions.',
      error: err.message
    });
  }
};

exports.createQuestion = async (req, res) => {
  const {
    questionText,
    isMultipleChoice,
    options,
    correctIndex,
    correctIndices,
    correctOption,
    correctOptions,
    hasImage,
    imageUrl,
    subject,
    examLevel,
    explanation,
    quizId
  } = req.body;

  const cleanQuestionText = String(questionText || '').trim();

  if (!cleanQuestionText) {
    return res.status(400).json({
      success: false,
      message: 'Question text is required.'
    });
  }

  let formattedOptions = [];
  let finalCorrectIndices = [];
  let finalCorrectIndex = null;
  let finalCorrectOption = null;
  let finalCorrectOptions = [];

  if (isMultipleChoice) {
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Multiple Choice questions must include at least 2 answer options.'
      });
    }

    // Ensure all options have non-empty text
    for (let i = 0; i < options.length; i++) {
      const optText = typeof options[i] === 'string' ? options[i] : (options[i]?.text || '');
      if (!String(optText).trim()) {
        return res.status(400).json({
          success: false,
          message: `Option ${String.fromCharCode(65 + i)} cannot be empty.`
        });
      }
    }

    // Validate that at least one correct answer is selected
    if (Array.isArray(correctIndices) && correctIndices.length > 0) {
      finalCorrectIndices = correctIndices.map(Number).filter(n => !isNaN(n) && n >= 0 && n < options.length);
    } else if (correctIndex !== undefined && correctIndex !== null && !isNaN(Number(correctIndex))) {
      finalCorrectIndices = [Number(correctIndex)];
    }

    if (finalCorrectIndices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one correct answer before saving the Multiple Choice question.'
      });
    }

    finalCorrectIndex = finalCorrectIndices[0];
    finalCorrectOptions = finalCorrectIndices.map(i => {
      const opt = options[i];
      const optLetter = (typeof opt === 'object' && opt?.letter) ? opt.letter : String.fromCharCode(65 + i);
      return `Option ${optLetter}`;
    });
    finalCorrectOption = correctOption || finalCorrectOptions.join(', ');

    formattedOptions = options.map((opt, idx) => {
      const optText = typeof opt === 'string' ? opt : (opt?.text || '');
      const optLetter = typeof opt === 'object' && opt?.letter ? opt.letter : String.fromCharCode(65 + idx);
      return {
        option_letter: optLetter,
        option_text: String(optText).trim(),
        is_correct: finalCorrectIndices.includes(idx)
      };
    });
  }

  const finalHasImage = Boolean(hasImage && imageUrl);
  const finalImageUrl = finalHasImage ? String(imageUrl).trim() : null;

  try {
    const questionId = `q-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newQuestion = await Question.create({
      id: questionId,
      question_text: cleanQuestionText,
      is_multiple_choice: Boolean(isMultipleChoice),
      has_image: finalHasImage,
      image_url: finalImageUrl,
      options: formattedOptions,
      correct_option: finalCorrectOption,
      correct_options: finalCorrectOptions,
      correct_index: finalCorrectIndex,
      correct_indices: finalCorrectIndices,
      subject: subject || 'General',
      exam_level: examLevel || 'ol',
      explanation: explanation || '',
      quiz_id: quizId || null
    });

    return res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      question: {
        id: newQuestion.id,
        questionText: newQuestion.question_text,
        isMultipleChoice: newQuestion.is_multiple_choice,
        hasImage: newQuestion.has_image,
        imageUrl: newQuestion.image_url,
        options: newQuestion.options.map(o => ({
          letter: o.option_letter,
          text: o.option_text,
          isCorrect: o.is_correct
        })),
        correctOption: newQuestion.correct_option,
        correctOptions: newQuestion.correct_options,
        correctIndex: newQuestion.correct_index,
        correctIndices: newQuestion.correct_indices,
        subject: newQuestion.subject,
        examLevel: newQuestion.exam_level,
        explanation: newQuestion.explanation,
        quizId: newQuestion.quiz_id,
        createdAt: newQuestion.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create question.',
      error: err.message
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const qQuery = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ id }, { _id: id }] } : { id };
    const deleted = await Question.findOneAndDelete(qQuery);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Question deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete question.',
      error: err.message
    });
  }
};
