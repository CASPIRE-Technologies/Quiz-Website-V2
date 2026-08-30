-- ============================================================================
-- MYSQL DATABASE SCHEMA FOR ONLINE PAID QUIZ & EXAMINATION PLATFORM
-- ============================================================================

CREATE DATABASE IF NOT EXISTS quiz_platform_db;
USE quiz_platform_db;

-- 1. Users Table (Students & Admins)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  phone VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  exam_level VARCHAR(64) DEFAULT 'G.C.E. Ordinary Level (O/L)',
  school VARCHAR(128) DEFAULT 'Ananda College, Colombo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Exam Levels Table (Grade 5, O/L, A/L)
CREATE TABLE IF NOT EXISTS exam_levels (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  short_title VARCHAR(32) NOT NULL,
  subtitle VARCHAR(128),
  description TEXT,
  icon_class VARCHAR(64),
  badge VARCHAR(64),
  has_streams BOOLEAN DEFAULT FALSE
);

-- 3. Streams Table (A/L Streams)
CREATE TABLE IF NOT EXISTS streams (
  id VARCHAR(32) PRIMARY KEY,
  exam_level_id VARCHAR(32),
  title VARCHAR(128) NOT NULL,
  icon VARCHAR(16),
  FOREIGN KEY (exam_level_id) REFERENCES exam_levels(id) ON DELETE CASCADE
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(32) PRIMARY KEY,
  exam_level_id VARCHAR(32),
  stream_id VARCHAR(32),
  name VARCHAR(128) NOT NULL,
  icon VARCHAR(16),
  color VARCHAR(16),
  icon_color VARCHAR(16),
  FOREIGN KEY (exam_level_id) REFERENCES exam_levels(id) ON DELETE CASCADE,
  FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE SET NULL
);

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  exam_level_id VARCHAR(32) NOT NULL,
  stream_id VARCHAR(32),
  subject_id VARCHAR(32) NOT NULL,
  subject_name VARCHAR(128) NOT NULL,
  question_count INT DEFAULT 30,
  duration_minutes INT DEFAULT 45,
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  price DECIMAL(10, 2) DEFAULT 300.00,
  attempts_allowed INT DEFAULT 1,
  rating DECIMAL(3, 1) DEFAULT 4.8,
  reviews_count INT DEFAULT 100,
  about TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_level_id) REFERENCES exam_levels(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 6. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id VARCHAR(64) NOT NULL,
  question_text TEXT NOT NULL,
  image_url VARCHAR(255),
  explanation TEXT,
  marks INT DEFAULT 1,
  order_index INT DEFAULT 1,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 7. Options Table (MCQ Options A, B, C, D)
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_letter CHAR(1) NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 8. Purchases Table (Order Receipts)
CREATE TABLE IF NOT EXISTS purchases (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  quiz_id VARCHAR(64) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  gateway VARCHAR(64) DEFAULT 'Card Payment',
  status ENUM('Successful', 'Pending', 'Failed') DEFAULT 'Successful',
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 9. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  quiz_id VARCHAR(64) NOT NULL,
  score INT DEFAULT 0,
  total_questions INT DEFAULT 30,
  percentage DECIMAL(5, 2) DEFAULT 0.00,
  time_taken_seconds INT DEFAULT 0,
  status ENUM('in_progress', 'completed') DEFAULT 'completed',
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 10. User Answers Table (Itemized Answers)
CREATE TABLE IF NOT EXISTS user_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id VARCHAR(64) NOT NULL,
  question_id INT NOT NULL,
  selected_option_index INT,
  is_marked_for_review BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
