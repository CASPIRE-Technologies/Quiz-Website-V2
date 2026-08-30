const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    quiz_id: { type: String, required: true },
    amount: { type: Number, required: true },
    gateway: { type: String, default: 'Card Payment' },
    status: { type: String, default: 'Successful' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
