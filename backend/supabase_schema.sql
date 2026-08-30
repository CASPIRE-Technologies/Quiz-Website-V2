-- ==========================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- EduQuiz Pro - Online Paid Quiz & Examination Platform
-- ==========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    exam_level VARCHAR(100) DEFAULT 'G.C.E. Ordinary Level (O/L)',
    school VARCHAR(255) DEFAULT 'Sri Lankan School',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EXAM LEVELS TABLE
CREATE TABLE IF NOT EXISTS exam_levels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    badge VARCHAR(100),
    description TEXT
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    exam_level_id VARCHAR(50) REFERENCES exam_levels(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100)
);

-- 4. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    exam_level VARCHAR(50) NOT NULL,
    subject_id VARCHAR(50) REFERENCES subjects(id),
    subject_name VARCHAR(255) NOT NULL,
    question_count INT DEFAULT 30,
    duration_minutes INT DEFAULT 45,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    price NUMERIC(10,2) DEFAULT 300.00,
    currency VARCHAR(10) DEFAULT 'LKR',
    attempts_allowed INT DEFAULT 1,
    about TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT,
    correct_index INT NOT NULL,
    marks INT DEFAULT 1
);

-- 6. OPTIONS TABLE
CREATE TABLE IF NOT EXISTS options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_letter CHAR(1) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- 7. PURCHASES TABLE
CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    quiz_id VARCHAR(100) REFERENCES quizzes(id),
    amount NUMERIC(10,2) NOT NULL,
    gateway VARCHAR(100) DEFAULT 'Card Payment',
    status VARCHAR(50) DEFAULT 'Successful',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    quiz_id VARCHAR(100) REFERENCES quizzes(id),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage INT NOT NULL,
    time_taken_seconds INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Seed Exam Levels
INSERT INTO exam_levels (id, name, badge, description) VALUES
('g5', 'Grade 5 Scholarship', 'Primary Level', 'IQ & General Knowledge'),
('ol', 'G.C.E. Ordinary Level (O/L)', 'Secondary Level', 'Core subjects & model papers'),
('al', 'G.C.E. Advanced Level (A/L)', 'Senior Level', 'Stream-specific past papers')
ON CONFLICT (id) DO NOTHING;
