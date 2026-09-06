const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option_letter: { type: String, required: true },
  option_text: { type: String, required: true },
  is_correct: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  question_text: { type: String, required: true },
  explanation: { type: String, default: '' },
  is_multiple_choice: { type: Boolean, default: true },
  has_image: { type: Boolean, default: false },
  image_url: { type: String, default: null },
  correct_index: { type: Number, default: 0 },
  correct_indices: [{ type: Number }],
  correct_option: { type: String, default: null },
  correct_options: [{ type: String }],
  marks: { type: Number, default: 1 },
  order_index: { type: Number, default: 1 },
  options: [optionSchema]
});

const quizSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    exam_level: { type: String, default: 'ol' },
    stream_id: { type: String, default: 'physical' },
    subject_id: { type: String, default: 'math' },
    subject_name: { type: String, default: 'Mathematics' },
    question_count: { type: Number, default: 30 },
    duration_minutes: { type: Number, default: 45 },
    difficulty: { type: String, default: 'Medium' },
    price: { type: Number, default: 300 },
    about: { type: String, default: 'Model Examination Paper' },
    is_published: { type: Boolean, default: true },
    questions: [questionSchema]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
