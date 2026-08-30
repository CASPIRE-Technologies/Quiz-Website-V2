const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    quiz_id: { type: String, required: true },
    score: { type: Number, default: 0 },
    total_questions: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    time_taken_seconds: { type: Number, default: 0 },
    status: { type: String, default: 'completed' },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
