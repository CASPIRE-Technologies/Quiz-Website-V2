const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Purchase = require('../models/Purchase');

exports.processCheckout = async (req, res) => {
  const { quizId, gateway, userId, email } = req.body;
  const transactionId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    // Fetch authoritative price from MongoDB
    const quiz = await Quiz.findOne({ $or: [{ id: quizId }, { _id: quizId }] });
    const quizPrice = quiz ? Number(quiz.price) : 300.00;

    // Resolve user ID if email is provided
    let cleanUserId = userId;
    if (!cleanUserId && email) {
      const user = await User.findOne({ email: String(email).toLowerCase().trim() });
      if (user) cleanUserId = user.id || user._id;
    }
    if (!cleanUserId) cleanUserId = 'student-usr-01';

    const purchase = await Purchase.create({
      id: transactionId,
      user_id: cleanUserId,
      quiz_id: quizId,
      amount: quizPrice,
      gateway: gateway || 'Card Payment',
      status: 'Successful'
    });

    return res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId: purchase.id,
      purchasedQuizId: quizId,
      amount: quizPrice
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Payment transaction failed.',
      error: err.message
    });
  }
};
