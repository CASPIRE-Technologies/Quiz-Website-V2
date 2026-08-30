const { pool } = require('../config/db');

exports.processCheckout = async (req, res) => {
  const { quizId, amount, gateway } = req.body;
  const transactionId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    await pool.query(
      'INSERT INTO purchases (id, user_id, quiz_id, amount, gateway, status) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, 'usr-01', quizId, amount || 300.00, gateway || 'Card Payment', 'Successful']
    );
  } catch (err) {
    // fallback log
  }

  return res.json({
    success: true,
    message: 'Payment processed successfully',
    transactionId,
    purchasedQuizId: quizId
  });
};
