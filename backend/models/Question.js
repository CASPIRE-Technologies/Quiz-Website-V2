const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option_letter: { type: String, required: true },
  option_text: { type: String, required: true },
  is_correct: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    question_text: { type: String, required: true },
    is_multiple_choice: { type: Boolean, default: false },
    has_image: { type: Boolean, default: false },
    image_url: { type: String, default: null },
    options: [optionSchema],
    correct_option: { type: String, default: null }, // e.g. "Option A" or "Option A, Option C"
    correct_options: [{ type: String }],
    correct_index: { type: Number, default: null },
    correct_indices: [{ type: Number }],
    subject: { type: String, default: 'General' },
    exam_level: { type: String, default: 'ol' },
    explanation: { type: String, default: '' },
    quiz_id: { type: String, default: null }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Question', questionSchema);
