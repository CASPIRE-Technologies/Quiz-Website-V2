const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Quiz = require('../models/Quiz');

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/edu_pulse_lk_db';

const defaultQuizzes = [
  {
    id: 'quiz-ol-math-01',
    title: 'O/L Mathematics Paper 01 (Algebra & Functions)',
    exam_level: 'ol',
    stream_id: 'general',
    subject_id: 'math',
    subject_name: 'Mathematics',
    question_count: 5,
    duration_minutes: 45,
    difficulty: 'Medium',
    price: 300,
    about: 'Covers quadratic equations, linear functions, matrices, and probability for O/L students.',
    is_published: true,
    questions: [
      {
        id: 1,
        question_text: 'Solve for x in the equation: 2x² - 8x + 6 = 0',
        explanation: 'Divide the equation by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore, x = 1 or x = 3.',
        correct_index: 0,
        marks: 1,
        order_index: 1,
        options: [
          { option_letter: 'A', option_text: 'x = 1 or x = 3', is_correct: true },
          { option_letter: 'B', option_text: 'x = -1 or x = -3', is_correct: false },
          { option_letter: 'C', option_text: 'x = 2 or x = 4', is_correct: false },
          { option_letter: 'D', option_text: 'x = 0 or x = 3', is_correct: false }
        ]
      },
      {
        id: 2,
        question_text: 'Find the gradient of the line passing through (2, 3) and (6, 11).',
        explanation: 'Gradient m = (y2 - y1) / (x2 - x1) = (11 - 3) / (6 - 2) = 8 / 4 = 2.',
        correct_index: 1,
        marks: 1,
        order_index: 2,
        options: [
          { option_letter: 'A', option_text: '4', is_correct: false },
          { option_letter: 'B', option_text: '2', is_correct: true },
          { option_letter: 'C', option_text: '3', is_correct: false },
          { option_letter: 'D', option_text: '1/2', is_correct: false }
        ]
      },
      {
        id: 3,
        question_text: 'If log₁₀(x) = 3, what is the value of x?',
        explanation: 'By definition of logarithms, x = 10³ = 1000.',
        correct_index: 2,
        marks: 1,
        order_index: 3,
        options: [
          { option_letter: 'A', option_text: '30', is_correct: false },
          { option_letter: 'B', option_text: '100', is_correct: false },
          { option_letter: 'C', option_text: '1000', is_correct: true },
          { option_letter: 'D', option_text: '300', is_correct: false }
        ]
      },
      {
        id: 4,
        question_text: 'What is the sum of the interior angles of a convex hexagon (6-sided polygon)?',
        explanation: 'Sum = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.',
        correct_index: 0,
        marks: 1,
        order_index: 4,
        options: [
          { option_letter: 'A', option_text: '720°', is_correct: true },
          { option_letter: 'B', option_text: '540°', is_correct: false },
          { option_letter: 'C', option_text: '900°', is_correct: false },
          { option_letter: 'D', option_text: '360°', is_correct: false }
        ]
      },
      {
        id: 5,
        question_text: 'A bag contains 5 red balls and 3 blue balls. A ball is drawn at random. What is the probability of drawing a red ball?',
        explanation: 'Total balls = 8. Red balls = 5. P(Red) = 5/8.',
        correct_index: 3,
        marks: 1,
        order_index: 5,
        options: [
          { option_letter: 'A', option_text: '3/8', is_correct: false },
          { option_letter: 'B', option_text: '1/2', is_correct: false },
          { option_letter: 'C', option_text: '5/3', is_correct: false },
          { option_letter: 'D', option_text: '5/8', is_correct: true }
        ]
      }
    ]
  },
  {
    id: 'quiz-al-physics-01',
    title: 'A/L Physics Mechanics & Gravitational Fields Model Paper 01',
    exam_level: 'al',
    stream_id: 'physical',
    subject_id: 'physics',
    subject_name: 'Physics',
    question_count: 4,
    duration_minutes: 60,
    difficulty: 'Hard',
    price: 450,
    about: 'Advanced Level Physics Paper covering Newtonian mechanics, circular motion, and gravitational fields.',
    is_published: true,
    questions: [
      {
        id: 1,
        question_text: 'A car accelerates uniformly from rest to 30 m/s in 10 seconds. Calculate the acceleration.',
        explanation: 'a = (v - u) / t = (30 - 0) / 10 = 3 m/s².',
        correct_index: 0,
        marks: 1,
        order_index: 1,
        options: [
          { option_letter: 'A', option_text: '3 m/s²', is_correct: true },
          { option_letter: 'B', option_text: '30 m/s²', is_correct: false },
          { option_letter: 'C', option_text: '300 m/s²', is_correct: false },
          { option_letter: 'D', option_text: '0.3 m/s²', is_correct: false }
        ]
      },
      {
        id: 2,
        question_text: 'What is the SI unit of gravitational potential?',
        explanation: 'Gravitational potential V = Work / Mass = Joules per kilogram (J kg⁻¹).',
        correct_index: 1,
        marks: 1,
        order_index: 2,
        options: [
          { option_letter: 'A', option_text: 'J', is_correct: false },
          { option_letter: 'B', option_text: 'J kg⁻¹', is_correct: true },
          { option_letter: 'C', option_text: 'N kg⁻¹', is_correct: false },
          { option_letter: 'D', option_text: 'W kg⁻¹', is_correct: false }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'edu_pulse_lk_db' });
    console.log('🌱 Connected to MongoDB Atlas cluster for seeding...');

    // 1. Seed Admin Account
    await User.findOneAndUpdate(
      { email: 'admin@eduquiz.lk' },
      {
        id: 'usr-admin-01',
        name: 'System Administrator',
        email: 'admin@eduquiz.lk',
        phone: '+94 11 200 0000',
        password_hash: hashPassword('admin@123'),
        role: 'admin',
        exam_level: 'All Levels',
        school: 'EduQuiz HQ'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin account (admin@eduquiz.lk / admin@123) seeded.');

    // 2. Seed Default Model Quizzes if empty
    for (const quizData of defaultQuizzes) {
      await Quiz.findOneAndUpdate(
        { id: quizData.id },
        quizData,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Model quiz papers & questions seeded into MongoDB Atlas cluster.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
}

seed();
