/* ==========================================================================
   MOCK DATABASE & SEED DATA
   Paid Quiz & Examination Platform
   ========================================================================== */

export const examLevels = [
  {
    id: "g5",
    title: "Grade 5 Scholarship",
    shortTitle: "Grade 5",
    subtitle: "Scholarship Examination",
    description: "Preparation quizzes for Island Rank Grade 5 scholarship examination with timed IQ and general knowledge tests.",
    iconClass: "exam-icon-g5",
    badge: "Primary Level",
    hasStreams: false
  },
  {
    id: "ol",
    title: "G.C.E. Ordinary Level",
    shortTitle: "O/L",
    subtitle: "Ordinary Level Examination",
    description: "Comprehensive model papers and topical unit tests for core O/L compulsory and bucket subjects.",
    iconClass: "exam-icon-ol",
    badge: "Secondary Level",
    hasStreams: false
  },
  {
    id: "al",
    title: "G.C.E. Advanced Level",
    shortTitle: "A/L",
    subtitle: "Advanced Level Examination",
    description: "Stream-specific past papers, high-yield practice exams, and timed mock tests for A/L candidates.",
    iconClass: "exam-icon-al",
    badge: "Senior Level",
    hasStreams: true
  }
];

export const alStreams = [
  { id: "physical", title: "Physical Science", icon: "📐", subjects: ["comb_math", "physics", "chemistry", "ict"] },
  { id: "biological", title: "Biological Science", icon: "🧬", subjects: ["biology", "chemistry", "physics", "agri"] },
  { id: "commerce", title: "Commerce Stream", icon: "📊", subjects: ["accounting", "business", "econ", "ict"] },
  { id: "arts", title: "Arts Stream", icon: "🎨", subjects: ["sinhala", "history", "logic", "geography"] },
  { id: "technology", title: "Technology Stream", icon: "⚙️", subjects: ["sft", "et", "ict", "bst"] }
];

export const subjects = [
  { id: "comb_math", name: "Combined Mathematics", icon: "📐", color: "#EFF6FF", iconColor: "#2563EB", examLevel: "al", stream: "physical" },
  { id: "physics", name: "Physics", icon: "⚡", color: "#F5F3FF", iconColor: "#7C3AED", examLevel: "al", stream: "physical" },
  { id: "chemistry", name: "Chemistry", icon: "🧪", color: "#ECFDF5", iconColor: "#059669", examLevel: "al", stream: "physical" },
  { id: "biology", name: "Biology", icon: "🧬", color: "#FEF2F2", iconColor: "#DC2626", examLevel: "al", stream: "biological" },
  { id: "ict", name: "Information Technology", icon: "💻", color: "#EEF2FF", iconColor: "#4F46E5", examLevel: "al", stream: "physical" },
  { id: "math", name: "Mathematics", icon: "🔢", color: "#EFF6FF", iconColor: "#2563EB", examLevel: "ol" },
  { id: "science", name: "Science", icon: "🔬", color: "#ECFDF5", iconColor: "#059669", examLevel: "ol" },
  { id: "english", name: "English Language", icon: "📖", color: "#FEF3C7", iconColor: "#D97706", examLevel: "ol" },
  { id: "history", name: "History", icon: "🏛️", color: "#FFF7ED", iconColor: "#EA580C", examLevel: "ol" },
  { id: "accounting", name: "Accounting", icon: "📈", color: "#F0FDF4", iconColor: "#16A34A", examLevel: "al", stream: "commerce" },
  { id: "g5_iq", name: "General Knowledge & IQ", icon: "💡", color: "#FEF3C7", iconColor: "#B45309", examLevel: "g5" },
];

export const quizzes = [
  {
    id: "quiz-math-01",
    title: "Algebra & Quadratic Equations Paper 01",
    examLevel: "ol",
    subjectId: "math",
    subjectName: "Mathematics",
    questionCount: 30,
    durationMinutes: 45,
    difficulty: "Medium",
    price: 300,
    currency: "LKR",
    attemptsAllowed: 1,
    rating: 4.8,
    reviewsCount: 142,
    purchased: true,
    completed: false,
    inProgress: false,
    about: "This quiz covers essential algebraic manipulations, factorization, solving quadratic equations using completing the square method, and real-world word problems.",
    topics: ["Algebraic Expressions", "Factorization", "Quadratic Equations", "Indices & Logarithms"],
    questions: [
      {
        id: 1,
        text: "Solve for x in the equation: 2x² - 8x + 6 = 0",
        options: ["x = 1 or x = 3", "x = -1 or x = -3", "x = 2 or x = 4", "x = 0 or x = 3"],
        correctIndex: 0,
        explanation: "Divide the equation by 2: x² - 4x + 3 = 0. Factorize: (x - 1)(x - 3) = 0. Therefore, x = 1 or x = 3."
      },
      {
        id: 2,
        text: "What is the value of x if log₂(x) = 5?",
        options: ["10", "25", "32", "64"],
        correctIndex: 2,
        explanation: "By logarithmic identity log_b(a) = c implies b^c = a. Therefore, 2⁵ = 32."
      },
      {
        id: 3,
        text: "Factorize the quadratic expression: x² - 9x + 20",
        options: ["(x - 4)(x - 5)", "(x + 4)(x + 5)", "(x - 2)(x - 10)", "(x + 2)(x - 10)"],
        correctIndex: 0,
        explanation: "Find two numbers that multiply to +20 and add up to -9. The numbers are -4 and -5. So (x - 4)(x - 5)."
      },
      {
        id: 4,
        text: "Simplify: (a³b²) × (a⁻¹b³)",
        options: ["a²b⁵", "a⁴b⁵", "a²b⁶", "a³b⁶"],
        correctIndex: 0,
        explanation: "Add exponents of like bases: a^(3 - 1) * b^(2 + 3) = a²b⁵."
      },
      {
        id: 5,
        text: "The sum of roots of a quadratic equation ax² + bx + c = 0 is given by:",
        options: ["-b / a", "c / a", "b / a", "-c / a"],
        correctIndex: 0,
        explanation: "According to Vieta's formulas, the sum of roots is -b/a and the product of roots is c/a."
      },
      {
        id: 6,
        text: "Find the discriminant of the quadratic equation 3x² - 5x + 2 = 0",
        options: ["1", "49", "25", "-1"],
        correctIndex: 0,
        explanation: "Discriminant Δ = b² - 4ac = (-5)² - 4(3)(2) = 25 - 24 = 1."
      }
    ]
  },
  {
    id: "quiz-physics-01",
    title: "Mechanics & Gravitational Fields Test",
    examLevel: "al",
    streamId: "physical",
    subjectId: "physics",
    subjectName: "Physics",
    questionCount: 30,
    durationMinutes: 60,
    difficulty: "Hard",
    price: 450,
    currency: "LKR",
    attemptsAllowed: 1,
    rating: 4.9,
    reviewsCount: 98,
    purchased: false,
    completed: false,
    inProgress: false,
    about: "Advanced Level physics mock paper focusing on Newton's Laws, Momentum Conservation, Kinematics, and Circular Motion.",
    topics: ["Kinematics", "Newton's Laws", "Work, Energy & Power", "Circular Motion", "Gravitational Fields"],
    questions: [
      {
        id: 1,
        text: "A particle is projected vertically upwards with speed u. The maximum height reached is:",
        options: ["u² / (2g)", "u / g", "2u² / g", "u² / g"],
        correctIndex: 0,
        explanation: "Using v² = u² - 2gh at maximum height v = 0: 0 = u² - 2gh => h = u² / (2g)."
      },
      {
        id: 2,
        text: "Which of the following quantity remains conserved during an inelastic collision?",
        options: ["Total Linear Momentum", "Total Kinetic Energy", "Mechanical Energy only", "Velocity"],
        correctIndex: 0,
        explanation: "Linear momentum is conserved in all isolated collisions, whereas Kinetic Energy is lost in inelastic collisions."
      }
    ]
  },
  {
    id: "quiz-g5-01",
    title: "Scholarship Intelligence & Logic Model Paper 01",
    examLevel: "g5",
    subjectId: "g5_iq",
    subjectName: "General Knowledge & IQ",
    questionCount: 25,
    durationMinutes: 30,
    difficulty: "Easy",
    price: 250,
    currency: "LKR",
    attemptsAllowed: 2,
    rating: 4.7,
    reviewsCount: 210,
    purchased: true,
    completed: true,
    inProgress: false,
    lastScore: 22,
    lastPercentage: 88,
    about: "Specially formulated picture logic, pattern completion, and vocabulary questions for Grade 5 scholarship students.",
    topics: ["Pattern Recognition", "Numerical Sequences", "Vocabulary", "Spatial Reasoning"],
    questions: [
      {
        id: 1,
        text: "Find the missing number in the sequence: 4, 8, 12, 16, __",
        options: ["18", "20", "22", "24"],
        correctIndex: 1,
        explanation: "The pattern adds +4 to each consecutive number: 16 + 4 = 20."
      }
    ]
  },
  {
    id: "quiz-chem-01",
    title: "Organic Chemistry Reaction Mechanisms",
    examLevel: "al",
    streamId: "physical",
    subjectId: "chemistry",
    subjectName: "Chemistry",
    questionCount: 30,
    durationMinutes: 50,
    difficulty: "Hard",
    price: 500,
    currency: "LKR",
    attemptsAllowed: 1,
    rating: 4.9,
    reviewsCount: 175,
    purchased: false,
    completed: false,
    inProgress: false,
    about: "Test your understanding of electrophilic additions, nucleophilic substitutions, and aromatic substitution reactions.",
    topics: ["Hydrocarbons", "Alcohols & Phenols", "Aldehydes & Ketones", "Reaction Mechanisms"],
    questions: []
  }
];

export const initialStudentProfile = {
  name: "Kasun Perera",
  email: "kasun.perera@student.lk",
  phone: "+94 77 123 4567",
  examLevel: "G.C.E. Ordinary Level (O/L)",
  school: "Ananda College, Colombo",
  profileImage: null,
  quizzesPurchased: 2,
  quizzesCompleted: 1,
  averageScore: 88,
  studyHours: 24.5,
  paymentHistory: [
    { id: "TXN-90214", date: "2026-08-20", quizTitle: "Algebra & Quadratic Equations Paper 01", amount: "300 LKR", status: "Successful", gateway: "Card Payment" },
    { id: "TXN-88120", date: "2026-08-15", quizTitle: "Scholarship Intelligence & Logic Model Paper 01", amount: "250 LKR", status: "Successful", gateway: "PayHere" }
  ]
};

export const initialAdminStats = {
  totalStudents: 1420,
  totalQuizzes: 48,
  quizPurchases: 3890,
  revenueLKR: 1245000,
  completedAttempts: 3410,
  averageScore: 76.4
};
