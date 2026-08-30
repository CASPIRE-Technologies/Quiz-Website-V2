-- ============================================================================
-- SEED DATA FOR QUIZ PLATFORM DATABASE
-- ============================================================================

USE quiz_platform_db;

-- Seed Users
INSERT INTO users (id, name, email, phone, password_hash, role, exam_level, school) VALUES
('usr-01', 'Kasun Perera', 'kasun.perera@student.lk', '+94 77 123 4567', 'password123', 'student', 'G.C.E. Ordinary Level (O/L)', 'Ananda College, Colombo'),
('usr-admin', 'Platform Admin', 'admin@eduquiz.pro', '+94 11 999 8888', 'admin123', 'admin', 'G.C.E. Advanced Level (A/L)', 'Ministry of Education')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Exam Levels
INSERT INTO exam_levels (id, title, short_title, subtitle, description, icon_class, badge, has_streams) VALUES
('g5', 'Grade 5 Scholarship', 'Grade 5', 'Scholarship Examination', 'Preparation quizzes for Island Rank Grade 5 scholarship examination.', 'exam-icon-g5', 'Primary Level', FALSE),
('ol', 'G.C.E. Ordinary Level', 'O/L', 'Ordinary Level Examination', 'Comprehensive model papers and topical unit tests for core O/L subjects.', 'exam-icon-ol', 'Secondary Level', FALSE),
('al', 'G.C.E. Advanced Level', 'A/L', 'Advanced Level Examination', 'Stream-specific past papers and timed mock tests for A/L candidates.', 'exam-icon-al', 'Senior Level', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed A/L Streams
INSERT INTO streams (id, exam_level_id, title, icon) VALUES
('physical', 'al', 'Physical Science', '📐'),
('biological', 'al', 'Biological Science', '🧬'),
('commerce', 'al', 'Commerce Stream', '📊'),
('arts', 'al', 'Arts Stream', '🎨'),
('technology', 'al', 'Technology Stream', '⚙️')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Subjects
INSERT INTO subjects (id, exam_level_id, stream_id, name, icon, color, icon_color) VALUES
('comb_math', 'al', 'physical', 'Combined Mathematics', '📐', '#EFF6FF', '#2563EB'),
('physics', 'al', 'physical', 'Physics', '⚡', '#F5F3FF', '#7C3AED'),
('chemistry', 'al', 'physical', 'Chemistry', '🧪', '#ECFDF5', '#059669'),
('biology', 'al', 'biological', 'Biology', '🧬', '#FEF2F2', '#DC2626'),
('ict', 'al', 'physical', 'Information Technology', '💻', '#EEF2FF', '#4F46E5'),
('math', 'ol', NULL, 'Mathematics', '🔢', '#EFF6FF', '#2563EB'),
('science', 'ol', NULL, 'Science', '🔬', '#ECFDF5', '#059669'),
('g5_iq', 'g5', NULL, 'General Knowledge & IQ', '💡', '#FEF3C7', '#B45309')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Sample Quiz
INSERT INTO quizzes (id, title, exam_level_id, stream_id, subject_id, subject_name, question_count, duration_minutes, difficulty, price, attempts_allowed, about) VALUES
('quiz-math-01', 'Algebra & Quadratic Equations Paper 01', 'ol', NULL, 'math', 'Mathematics', 30, 45, 'Medium', 300.00, 1, 'This quiz covers algebraic manipulations, factorization, solving quadratic equations, and real-world word problems.')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Questions
INSERT INTO questions (id, quiz_id, question_text, explanation, marks, order_index) VALUES
(1, 'quiz-math-01', 'Solve for x in the equation: 2x² - 8x + 6 = 0', 'Divide by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore x = 1 or x = 3.', 1, 1),
(2, 'quiz-math-01', 'What is the value of x if log₂(x) = 5?', 'By definition log_b(a) = c implies b^c = a. Therefore 2⁵ = 32.', 1, 2)
ON DUPLICATE KEY UPDATE question_text=VALUES(question_text);

-- Seed Options
INSERT INTO options (question_id, option_letter, option_text, is_correct) VALUES
(1, 'A', 'x = 1 or x = 3', TRUE),
(1, 'B', 'x = -1 or x = -3', FALSE),
(1, 'C', 'x = 2 or x = 4', FALSE),
(1, 'D', 'x = 0 or x = 3', FALSE),
(2, 'A', '10', FALSE),
(2, 'B', '25', FALSE),
(2, 'C', '32', TRUE),
(2, 'D', '64', FALSE)
ON DUPLICATE KEY UPDATE option_text=VALUES(option_text);
