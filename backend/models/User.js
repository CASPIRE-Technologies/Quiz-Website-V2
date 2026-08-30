const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    password_hash: { type: String, default: '' },
    role: { type: String, default: 'student' },
    exam_level: { type: String, default: null },
    school: { type: String, default: 'Sri Lankan School' },
    provider: { type: String, default: 'local' },
    google_id: { type: String, default: null },
    avatar_url: { type: String, default: null }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('User', userSchema);
