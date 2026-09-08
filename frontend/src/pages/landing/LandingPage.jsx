import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Trophy,
  Zap,
  ShieldCheck,
  Star,
  Users,
  PlayCircle,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Check,
  HelpCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  RefreshCw,
  Award,
  Layers,
  FileText,
  ExternalLink,
} from "lucide-react";
import LandingHeader from "../../components/headers/LandingHeader";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { isSinhala } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Billing cycle toggle for plans: 'term' or 'year'
  const [billingCycle, setBillingCycle] = useState("term");

  // Interactive Quiz Preview State
  const [selectedPreviewTrack, setSelectedPreviewTrack] = useState("ol");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    examTrack: "ol",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Platform stats
  const platformStats = [
    {
      label: isSinhala ? "ක්‍රියාකාරී සිසුන්" : "Active Students",
      value: "15,000+",
      icon: Users,
      color: "#38BDF8",
    },
    {
      label: isSinhala ? "සම්පූර්ණ කළ ප්‍රශ්නාවලි" : "Quizzes Completed",
      value: "120,000+",
      icon: Trophy,
      color: "#F59E0B",
    },
    {
      label: isSinhala ? "විභාග සාමාර්ථ්‍ය ප්‍රතිශතය" : "Success Rate",
      value: "94.8%",
      icon: Zap,
      color: "#10B981",
    },
    {
      label: isSinhala ? "විශේෂඥ ආදර්ශ ප්‍රශ්න පත්‍ර" : "Expert Model Papers",
      value: "500+",
      icon: BookOpen,
      color: "#8B5CF6",
    },
  ];

  // Exam tracks
  const examTracks = [
    {
      id: "g5",
      title: isSinhala ? "5 වසර ශිෂ්‍යත්වය" : "Grade 5 Scholarship",
      badge: isSinhala ? "ප්‍රාථමික අංශය" : "Primary Level",
      icon: "🎒",
      desc: isSinhala
        ? "IQ බුද්ධි පරීක්ෂණ, ගණිතමය තර්කනය සහ සාමාන්‍ය දැනුම ආවරණය වන කාල ගණනය කළ ආදර්ශ ප්‍රශ්නාවලි."
        : "Master IQ, mathematical logic, and general knowledge with timed practice sets tailored for young achievers.",
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    },
    {
      id: "ol",
      title: isSinhala
        ? "අ.පො.ස. සාමාන්‍ය පෙළ (O/L)"
        : "G.C.E. Ordinary Level (O/L)",
      badge: isSinhala ? "ද්විතීයික අංශය" : "Secondary Level",
      icon: "📘",
      desc: isSinhala
        ? "විද්‍යාව, ගණිතය, ඉතිහාසය, වාණිජ්‍ය ඇතුළු ප්‍රධාන විෂයන් සඳහා නවතම විෂය නිර්දේශානුකූල පසුගිය සහ ආදර්ශ පත්‍ර."
        : "Comprehensive coverage of core subjects, model papers, and real-time marking to secure 9 As.",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    {
      id: "al",
      title: isSinhala
        ? "අ.පො.ස. උසස් පෙළ (A/L)"
        : "G.C.E. Advanced Level (A/L)",
      badge: isSinhala ? "ජ්‍යෙෂ්ඨ අංශය" : "Senior Level",
      icon: "🎓",
      desc: isSinhala
        ? "ජීව විද්‍යාව, භෞතික විද්‍යාව, වාණිජ්‍ය, කලා හා තාක්ෂණවේදය ධාරාවන් සඳහා ඉහළ ප්‍රමිතියෙන් යුතු ප්‍රශ්න පත්‍ර."
        : "Stream-specific past papers and high-yield questions for Science, Maths, Commerce, Arts & Tech.",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
  ];

  // Features list
  const coreFeatures = [
    {
      title: isSinhala
        ? "ක්ෂණික ලකුණු හා විශ්ලේෂණ"
        : "Instant Scoring & Analytics",
      desc: isSinhala
        ? "ප්‍රශ්නයෙන් ප්‍රශ්නයට වැය කළ කාලය සහ නිවැරදි පිළිතුරු විවරණ සමඟ ක්ෂණික ප්‍රගති වාර්තාවක් ලබා ගන්න."
        : "Get immediate feedback with detailed breakdown of correct answers, time spent per question, and speed metrics.",
      icon: BarChart3,
      badge: "Real-time",
      color: "#38BDF8",
    },
    {
      title: isSinhala
        ? "ප්‍රවීණ ආචාර්ය මණ්ඩලයක් විසින් සම්පාදිතයි"
        : "Curated by Top Educators",
      desc: isSinhala
        ? "ශ්‍රී ලංකා විභාග දෙපාර්තමේන්තුවේ නවතම විභාග ආකෘතිය හා විෂය නිර්දේශයට 100% ක් අනුකූලව සැකසූ ප්‍රශ්න."
        : "Questions crafted according to the latest official syllabus standards and national exam structures.",
      icon: ShieldCheck,
      badge: "Verified",
      color: "#10B981",
    },
    {
      title: isSinhala ? "අනුවර්තී අධ්‍යයන මාවත" : "Adaptive Learning Engine",
      desc: isSinhala
        ? "ඔබ දුර්වල විෂය කොටස් ස්වයංක්‍රීයව හඳුනාගෙන, ඒවා ශක්තිමත් කිරීමට සුදුසු විශේෂ අභ්‍යාස නිර්දේශ කරයි."
        : "Track daily streaks, identify weak areas automatically, and receive custom study recommendations.",
      icon: Sparkles,
      badge: "AI Powered",
      color: "#8B5CF6",
    },
    {
      title: isSinhala
        ? "ද්විභාෂා විවරණ (සිංහල සහ ඉංග්‍රීසි)"
        : "Bilingual Solutions",
      desc: isSinhala
        ? "සෑම ප්‍රශ්නයක් සඳහාම පියවරෙන් පියවර පැහැදිලි කළ විවරණ සිංහල සහ ඉංග්‍රීසි මාධ්‍ය දෙකෙන්ම ලබාගත හැක."
        : "Step-by-step solutions and conceptual breakdowns available in both English and Sinhala media.",
      icon: BookOpen,
      badge: "Bilingual",
      color: "#F59E0B",
    },
    {
      title: isSinhala ? "නියම විභාග පරිසර සමාකරණය" : "Timed Exam Simulator",
      desc: isSinhala
        ? "විභාග ශාලාවේ පීඩනයට හුරුවීම සඳහා නියමිත කාල සීමාවන්, ප්‍රශ්න මඟහැරීම් හා ස්වයංක්‍රීය භාරදීම්."
        : "Simulate official exam hall pressure with real-time countdown clocks, review flags, and auto-submit.",
      icon: Clock,
      badge: "Exam Mode",
      color: "#EC4899",
    },
    {
      title: isSinhala ? "ඕනෑම උපාංගයකින් පහසුවෙන්" : "Multi-Device Sync",
      desc: isSinhala
        ? "ස්මාර්ට් ජංගම දුරකථනය, ටැබ් හෝ පරිගණකය මඟින් ඕනෑම තැනක සිට ප්‍රශ්නාවලි වලට මුහුණ දෙන්න."
        : "Practice smoothly across your smartphone, tablet, or desktop with instant cloud synchronization.",
      icon: Layers,
      badge: "Cloud Sync",
      color: "#06B6D4",
    },
  ];

  // Pricing Plans
  const plansData = [
    {
      id: "free",
      name: isSinhala ? "මූලික නොමිලේ පැකේජය" : "Free Starter",
      badge: isSinhala ? "නොමිලේ" : "Free Trial",
      price: "LKR 0",
      period: isSinhala ? "සදහටම" : "forever",
      desc: isSinhala
        ? "වේදිකාව අත්හදා බැලීමට කැමති සිසුන් සඳහා ආරම්භක ප්‍රවේශය."
        : "Great for trying out sample quizzes and discovering the platform.",
      features: [
        isSinhala
          ? "ආදර්ශ ප්‍රශ්නාවලි 3ක් සඳහා නොමිලේ ප්‍රවේශය"
          : "Access to 3 free sample model papers",
        isSinhala
          ? "ක්ෂණික ලකුණු පුවරුව හා නිවැරදි පිළිතුරු"
          : "Instant scoring & basic answer view",
        isSinhala
          ? "ප්‍රජා සාකච්ඡා සහ ප්‍රශ්න විසඳුම්"
          : "Community forum discussions",
        isSinhala
          ? "ඕනෑම උපාංගයකින් ප්‍රවේශ වීම"
          : "Standard web & mobile access",
      ],
      isPopular: false,
      ctaText: isSinhala ? "නොමිලේ අරඹන්න" : "Start Free",
      ctaAction: () => navigate("/quizzes"),
    },
    {
      id: "pro",
      name: isSinhala ? "ශිෂ්‍ය ප්‍රෝ පැකේජය" : "Student Pro",
      badge: isSinhala ? "වඩාත් ජනප්‍රියයි" : "Most Popular",
      price: billingCycle === "term" ? "LKR 1,500" : "LKR 3,900",
      period:
        billingCycle === "term"
          ? isSinhala
            ? "වාරයකට (මාස 3)"
            : "per term (3 mos)"
          : isSinhala
            ? "වසරකට"
            : "per academic year",
      desc: isSinhala
        ? "විභාගයෙන් ඉහළම ප්‍රතිඵල අපේක්ෂා කරන බුද්ධිමත් සිසුන් සඳහා."
        : "Comprehensive exam preparation with full access to all past & model papers.",
      features: [
        isSinhala
          ? "තෝරාගත් ශ්‍රේණියේ සියලුම ආදර්ශ හා පසුගිය ප්‍රශ්න පත්‍ර"
          : "Full access to all model & past papers",
        isSinhala
          ? "සීමාරහිත ප්‍රශ්නාවලි උත්සාහයන් (Unlimited Attempts)"
          : "Unlimited timed quiz attempts",
        isSinhala
          ? "පියවරෙන් පියවර විස්තරාත්මක පිළිතුරු විවරණ"
          : "Complete step-by-step solutions",
        isSinhala
          ? "AI දුර්වලතා හඳුනාගැනීමේ ප්‍රස්ථාර හා විශ්ලේෂණ"
          : "AI progress radar & weakness tracking",
        isSinhala
          ? "දිවයිනේ ශ්‍රේණිගත කිරීම් ලීඩර්බෝඩ් ප්‍රවේශය"
          : "Island-wide student leaderboard rankings",
      ],
      isPopular: true,
      ctaText: isSinhala ? "Pro තෝරාගන්න" : "Get Student Pro",
      ctaAction: () => navigate(user ? "/quizzes" : "/login"),
    },
    {
      id: "scholar",
      name: isSinhala ? "විද්වත් අල්ටිමේට්" : "Scholar Ultimate",
      badge: isSinhala ? "උපරිම වටිනාකම" : "Best Value",
      price: billingCycle === "term" ? "LKR 2,500" : "LKR 5,900",
      period:
        billingCycle === "term"
          ? isSinhala
            ? "වාරයකට"
            : "per term"
          : isSinhala
            ? "වසරකට"
            : "per academic year",
      desc: isSinhala
        ? "A සාමාර්ථ්‍යයන් හා දිවයිනේ කුසලතා ඉලක්ක කරන සිසුන් සඳහා සම්පූර්ණ විසඳුම."
        : "The all-inclusive elite training suite for top island & district rank aspirants.",
      features: [
        isSinhala
          ? "Student Pro හි සියලුම පහසුකම්"
          : "Everything in Student Pro",
        isSinhala
          ? "මුද්‍රණය කළ හැකි කෙටි සටහන් හා PDF ප්‍රශ්න පත්‍ර"
          : "Downloadable PDF revision notes & summaries",
        isSinhala
          ? "අවසන් විභාග ඉලක්කගත විශේෂ අනුමාන ප්‍රශ්න පත්‍ර"
          : "Exclusive final exam prediction papers",
        isSinhala
          ? "WhatsApp හරහා ප්‍රවීණ ගුරු සහයෝගය"
          : "Priority WhatsApp teacher Q&A support",
        isSinhala
          ? "දෙමාපියන් සඳහා සතිපතා ප්‍රගති වාර්තා"
          : "Weekly parent progress reports & SMS alerts",
      ],
      isPopular: false,
      ctaText: isSinhala ? "Ultimate අරඹන්න" : "Unlock Scholar",
      ctaAction: () => navigate(user ? "/quizzes" : "/login"),
    },
  ];

  // Interactive Quiz Previews Data
  const previewQuestions = {
    g5: {
      trackName: isSinhala
        ? "5 වසර ශිෂ්‍යත්වය - බුද්ධි පරීක්ෂණය"
        : "Grade 5 Scholarship - IQ Logic",
      question: isSinhala
        ? "රූප රටාවේ මීළඟට පැමිණිය යුතු රූපය කුමක්ද? [🔺, 🔻, 🔺, 🔻, ?]"
        : "In a logic sequence: 2, 6, 12, 20, 30, ... What is the next number?",
      options: isSinhala
        ? [
            "🔺 උඩුකුරු ත්‍රිකෝණය",
            "🔻 යටිකුරු ත්‍රිකෝණය",
            "🟦 නිල් සමචතුරස්‍රය",
            "⚪ සුදු වෘත්තය",
          ]
        : ["36", "40", "42", "44"],
      correctIndex: isSinhala ? 0 : 2,
      explanation: isSinhala
        ? "මෙහි රටාව වන්නේ උඩුකුරු හා යටිකුරු ත්‍රිකෝණ එකිනෙක මාරුවෙන් මාරුවට පැමිණීමයි. එබැවින් මීළඟට පැමිණිය යුත්තේ උඩුකුරු ත්‍රිකෝණයයි (🔺)."
        : "The pattern adds increasing even numbers: +4 (2->6), +6 (6->12), +8 (12->20), +10 (20->30), so next is +12: 30 + 12 = 42.",
    },
    ol: {
      trackName: isSinhala
        ? "අ.පො.ස. සාමාන්‍ය පෙළ - විද්‍යාව"
        : "G.C.E. O/L - Science",
      question: isSinhala
        ? "ශාක පත්‍රවල ප්‍රභාසංස්ලේෂණය සඳහා ප්‍රධාන වශයෙන්ම ආලෝක ශක්තිය අවශෝෂණය කරගන්නා වර්ණකය කුමක්ද?"
        : "Which organelle is universally known as the powerhouse of the eukaryotic cell?",
      options: isSinhala
        ? ["ක්ලෝරොෆිල් (හරිතප්‍රද)", "කැරොටින්", "සැන්තොෆිල්", "ඇන්තොසයනින්"]
        : [
            "Ribosome",
            "Mitochondria",
            "Endoplasmic Reticulum",
            "Golgi Apparatus",
          ],
      correctIndex: isSinhala ? 0 : 1,
      explanation: isSinhala
        ? "හරිතලව තුළ ඇති හරිතප්‍රද (Chlorophyll) මඟින් සූර්යාලෝකය අවශෝෂණය කර රසායනික ශක්තිය බවට පරිවර්තනය කරයි."
        : "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions via ATP synthesis.",
    },
    al: {
      trackName: isSinhala
        ? "අ.පො.ස. උසස් පෙළ - සාමාන්‍ය පොදු පරීක්ෂණය"
        : "G.C.E. A/L - General Knowledge & Aptitude",
      question: isSinhala
        ? "පෘථිවි වායුගෝලයේ වැඩිම ප්‍රතිශතයක් අඩංගු වන වායුව කුමක්ද?"
        : "Which parameter directly determines the kinetic energy of ideal gas molecules?",
      options: isSinhala
        ? [
            "ඔක්සිජන් (O₂)",
            "නයිට්‍රජන් (N₂)",
            "කාබන් ඩයොක්සයිඩ් (CO₂)",
            "ආගන් (Ar)",
          ]
        : [
            "Absolute Temperature",
            "Total Pressure",
            "Molar Mass",
            "Gas Volume",
          ],
      correctIndex: isSinhala ? 1 : 0,
      explanation: isSinhala
        ? "වායුගෝලයේ පරිමාවෙන් 78.08% ක් පමණ සමන්විත වන්නේ නයිට්‍රජන් (N₂) වායුවෙනි. ඔක්සිජන් ප්‍රතිශතය 20.95% කි."
        : "According to kinetic molecular theory, the average translational kinetic energy of gas molecules is directly proportional to absolute temperature (T in Kelvin).",
    },
  };

  const currentPreview = previewQuestions[selectedPreviewTrack];

  const handleSelectOption = (idx) => {
    if (!isAnswerChecked) {
      setSelectedOption(idx);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption !== null) {
      setIsAnswerChecked(true);
    }
  };

  const handleResetPreview = (newTrack) => {
    setSelectedPreviewTrack(newTrack);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", examTrack: "ol", message: "" });
    }, 1000);
  };

  // FAQ items
  const faqItems = [
    {
      q: isSinhala
        ? "Edu Pulse ප්‍රශ්නාවලි සකස් කරන්නේ කවුරුන් විසින්ද?"
        : "Who prepares the questions and model papers on Edu Pulse?",
      a: isSinhala
        ? "අපගේ සියලුම ප්‍රශ්න පත්‍ර දිවයිනේ ප්‍රමුඛ ජාතික පාසල්වල වසර ගණනාවක අත්දැකීම් ඇති ප්‍රවීණ ආචාර්යවරුන් සහ විභාග ප්‍රශ්න පත්‍ර සම්පාදකයින් විසින් නිර්මාණය කරනු ලැබේ."
        : "All model papers are authored and peer-reviewed by veteran educators from top national schools and syllabus advisors in Sri Lanka.",
    },
    {
      q: isSinhala
        ? "මට ජංගම දුරකථනයෙන් ප්‍රශ්න පත්‍ර වලට පිළිතුරු සැපයිය හැකිද?"
        : "Can I take quizzes on my smartphone or tablet?",
      a: isSinhala
        ? "ඔව්, Edu Pulse ඕනෑම ස්මාර්ට් දුරකථනයක, ටැබ් එකක හෝ පරිගණකයක වෙබ් බ්‍රව්සරයෙන් ඉතා සුමටව ක්‍රියාත්මක වේ. කිසිදු අමතර ඇප් එකක් ස්ථාපනය කිරීම අවශ්‍ය නොවේ."
        : "Yes, Edu Pulse is 100% responsive and optimized for mobile phones, tablets, and laptops. No bulky app installation required.",
    },
    {
      q: isSinhala
        ? "ගෙවීම් සිදුකළ හැක්කේ කෙසේද?"
        : "What payment methods are supported in Sri Lanka?",
      a: isSinhala
        ? "අපි Visa, MasterCard, Frimi, Genie, Koko මෙන්ම බැංකු තැන්පතු (Direct Bank Transfer) ක්‍රමයන් සඳහාද සහය දක්වන්නෙමු."
        : "We accept Sri Lankan Visa, MasterCard, debit/credit cards, FriMi, Genie, Koko pay, and verified direct bank deposits.",
    },
    {
      q: isSinhala
        ? "නොමිලේ අත්හදා බැලීමට ක්‍රමයක් තිබේද?"
        : "Can I try sample quizzes before paying?",
      a: isSinhala
        ? "අනිවාර්යයෙන්ම! ඔබට නොමිලේ ගිණුමක් සාදා සෑම විෂය ධාරාවකම ආදර්ශ ප්‍රශ්නාවලි සහ මෙම වෙබ් අඩවියේ ඇති සජීවී පෙරදසුන නොමිලේම භාවිතා කළ හැක."
        : "Absolutely! You can try our live interactive preview below, or register a free account to practice selected model papers anytime.",
    },
  ];

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
        minHeight: "100vh",
        backgroundColor: isDark ? "#0B0F19" : "#F8FAFC",
        color: isDark ? "#F1F5F9" : "#0F172A",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── STICKY GLASSMORPHIC HEADER ── */}
      <LandingHeader />

      {/* ══════════════════════════════════════════════════════════
          1. HOME / HERO SECTION (#home)
          ══════════════════════════════════════════════════════════ */}
      <section
        id="home"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "130px",
          paddingBottom: "70px",
        }}
      >
        {/* Ambient Glowing Orbs */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "750px",
            height: "450px",
            background: isDark
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(124, 58, 237, 0.05) 60%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(70px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "25%",
            right: "8%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Animated Badge Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 18px",
              borderRadius: "999px",
              background: isDark
                ? "rgba(56, 189, 248, 0.12)"
                : "rgba(2, 132, 199, 0.08)",
              border: isDark
                ? "1px solid rgba(56, 189, 248, 0.3)"
                : "1px solid rgba(2, 132, 199, 0.25)",
              color: isDark ? "#38BDF8" : "#0284C7",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "26px",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.12)",
            }}
          >
            <Sparkles size={15} />
            <span>
              {isSinhala
                ? "ශ්‍රී ලංකාවේ බුද්ධිමත්ම විභාග සූදානම් කිරීමේ වේදිකාව"
                : "The Next-Gen Sri Lankan Exam Preparation Platform"}
            </span>
          </div>

          {/* Hero Main Heading */}
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "22px",
              color: isDark ? "#FFFFFF" : "#0F172A",
            }}
          >
            {isSinhala ? "විභාග ජයගන්නා" : "Master Your Exams with"} <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #0284C7 0%, #2563EB 45%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Edu Pulse Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: isDark ? "#94A3B8" : "#64748B",
              maxWidth: "720px",
              margin: "0 auto 38px",
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            {isSinhala
              ? "5 වසර ශිෂ්‍යත්වය, අ.පො.ස. සාමාන්‍ය පෙළ සහ උසස් පෙළ විභාග ඉලක්ක කරගත් උසස් ආදර්ශ ප්‍රශ්න පත්‍ර, ක්ෂණික ලකුණු විශ්ලේෂණය හා සවිස්තර විවරණ."
              : "Access high-yield model papers, interactive practice sets, and real-time performance analytics tailored specifically for Grade 5, O/L, and A/L students."}
          </p>

          {/* Hero CTA Button Group */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "50px",
            }}
          >
            <button
              onClick={() => navigate(user ? "/dashboard" : "/quizzes")}
              className="btn-interactive"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 30px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <span>
                {user
                  ? isSinhala
                    ? "මගේ උපකරණ පුවරුව"
                    : "Go to Dashboard"
                  : isSinhala
                    ? "ප්‍රශ්නාවලි ආරම්භ කරන්න"
                    : "Start Practice Free"}
              </span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#previews"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("previews")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "15px 26px",
                borderRadius: "14px",
                background: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(15, 23, 42, 0.04)",
                color: isDark ? "#F8FAFC" : "#0F172A",
                fontWeight: 600,
                fontSize: "15px",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.12)"
                  : "1px solid rgba(15, 23, 42, 0.12)",
                cursor: "pointer",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              className="btn-outline-hover"
            >
              <PlayCircle size={18} color="#0284C7" />
              <span>
                {isSinhala
                  ? "සජීවී ආදර්ශ ප්‍රශ්නයක් බලන්න"
                  : "Try Live Question Preview"}
              </span>
            </a>
            {/* youtube video section */}
          <iframe
            width="100%"
            style={{
              marginTop: "40px",
              borderRadius: "14px",
              border: "1px solid var(--color-border)",
              
            }}
            height="315"
            src="https://www.youtube.com/embed/D0UnqGm_miA?si=mDB4ka3XvQWtNcdb"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          </div>

          

          

          {/* Exam Stream Target Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "22px",
              textAlign: "left",
            }}
          >
            {examTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => navigate("/quizzes")}
                className="quiz-paper-card"
                style={{
                  borderRadius: "20px",
                  background: isDark ? "rgba(30, 41, 59, 0.65)" : "#FFFFFF",
                  border: isDark
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "28px 24px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 10px 25px -8px rgba(0,0,0,0.4)"
                    : "0 8px 20px -6px rgba(0,0,0,0.06)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>{track.icon}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: isDark
                        ? "rgba(56, 189, 248, 0.12)"
                        : "rgba(2, 132, 199, 0.08)",
                      color: isDark ? "#38BDF8" : "#0284C7",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {track.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    marginBottom: "10px",
                  }}
                >
                  {track.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: isDark ? "#94A3B8" : "#64748B",
                    lineHeight: 1.55,
                    marginBottom: "22px",
                  }}
                >
                  {track.desc}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0284C7",
                  }}
                >
                  <span>
                    {isSinhala
                      ? "ප්‍රශ්න පත්‍ර බලන්න"
                      : "Explore Practice Sets"}
                  </span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>

          {/* Key Metrics Strip */}
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              padding: "24px 28px",
              borderRadius: "20px",
              background: isDark ? "rgba(30, 41, 59, 0.55)" : "#FFFFFF",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: isDark
                ? "0 10px 30px -10px rgba(0,0,0,0.5)"
                : "0 12px 28px -8px rgba(15, 23, 42, 0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {platformStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: `${stat.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={22} color={stat.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDark ? "#94A3B8" : "#64748B",
                        fontWeight: 500,
                        marginTop: "3px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </section>

      

      {/* ══════════════════════════════════════════════════════════
          2. FEATURES SECTION (#features)
          ══════════════════════════════════════════════════════════ */}
      <section
        id="features"
        style={{
          padding: "80px 24px",
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.5)"
            : "rgba(241, 245, 249, 0.6)",
          borderTop: isDark
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "1px solid rgba(0, 0, 0, 0.05)",
          borderBottom: isDark
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#0284C7",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {isSinhala ? "සුවිශේෂී තාක්ෂණය" : "Key Capabilities"}
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                color: isDark ? "#FFFFFF" : "#0F172A",
                marginBottom: "12px",
              }}
            >
              {isSinhala
                ? "විභාග සාමාර්ථ්‍යය තහවුරු කරන විශේෂාංග"
                : "Designed for Academic Excellence"}
            </h2>
            <p
              style={{
                color: isDark ? "#94A3B8" : "#64748B",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {isSinhala
                ? "සාම්ප්‍රදායික පාඩම් කිරීමෙන් ඔබ්බට ගොස්, සිසුන්ගේ ශක්තීන් හා දුර්වලතා බුද්ධිමත්ව හඳුනාගන්නා නවීන අත්දැකීමක්."
                : "Everything you need to build examination confidence, master tricky question styles, and secure top grades."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {coreFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="feature-card-hover"
                  style={{
                    padding: "28px 24px",
                    borderRadius: "20px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255, 255, 255, 0.07)"
                      : "1px solid rgba(0, 0, 0, 0.07)",
                    boxShadow: isDark
                      ? "0 8px 20px rgba(0, 0, 0, 0.25)"
                      : "0 6px 18px rgba(15, 23, 42, 0.04)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        background: `${feat.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp size={22} color={feat.color} />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: feat.color,
                        background: `${feat.color}15`,
                        padding: "3px 10px",
                        borderRadius: "8px",
                      }}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      marginBottom: "10px",
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: isDark ? "#94A3B8" : "#64748B",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. PLANS & PRICING SECTION (#plans)
          ══════════════════════════════════════════════════════════ */}
      <section id="plans" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#0284C7",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {isSinhala ? "පැහැදිලි සහ සාධාරණ මිල ගණන්" : "Affordable Access"}
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                color: isDark ? "#FFFFFF" : "#0F172A",
                marginBottom: "12px",
              }}
            >
              {isSinhala
                ? "ඔබට ගැළපෙන හොඳම පැකේජය තෝරාගන්න"
                : "Transparent Student Pricing Plans"}
            </h2>
            <p
              style={{
                color: isDark ? "#94A3B8" : "#64748B",
                fontSize: "16px",
                maxWidth: "620px",
                margin: "0 auto 28px",
              }}
            >
              {isSinhala
                ? "ශ්‍රී ලාංකික සිසුන් සහ දෙමාපියන් වෙනුවෙන් විශේෂයෙන් සැකසූ සහනදායී අධ්‍යාපනික සැලසුම්."
                : "Invest in your academic success with high-value plans designed for Sri Lankan school students."}
            </p>

            {/* Term vs Year Billing Switcher */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px",
                borderRadius: "999px",
                background: isDark
                  ? "rgba(30, 41, 59, 0.8)"
                  : "rgba(226, 232, 240, 0.8)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setBillingCycle("term")}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    billingCycle === "term" ? "#0284C7" : "transparent",
                  color:
                    billingCycle === "term"
                      ? "#FFFFFF"
                      : isDark
                        ? "#94A3B8"
                        : "#64748B",
                }}
              >
                {isSinhala ? "වාරික ගෙවීම්" : "Term Plan (3 Months)"}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("year")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    billingCycle === "year" ? "#0284C7" : "transparent",
                  color:
                    billingCycle === "year"
                      ? "#FFFFFF"
                      : isDark
                        ? "#94A3B8"
                        : "#64748B",
                }}
              >
                <span>
                  {isSinhala ? "වාර්ෂික ගෙවීම්" : "Full Academic Year"}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    background: "#10B981",
                    color: "#FFFFFF",
                    padding: "2px 6px",
                    borderRadius: "6px",
                  }}
                >
                  SAVE 30%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "26px",
              alignItems: "stretch",
            }}
          >
            {plansData.map((plan) => (
              <div
                key={plan.id}
                style={{
                  borderRadius: "24px",
                  background: isDark ? "#1E293B" : "#FFFFFF",
                  border: plan.isPopular
                    ? "2px solid #0284C7"
                    : isDark
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: plan.isPopular
                    ? "0 16px 36px -10px rgba(2, 132, 199, 0.35)"
                    : isDark
                      ? "0 10px 25px -8px rgba(0,0,0,0.3)"
                      : "0 8px 22px rgba(15, 23, 42, 0.05)",
                  transform: plan.isPopular ? "scale(1.02)" : "none",
                  zIndex: plan.isPopular ? 2 : 1,
                }}
              >
                {plan.isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-13px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background:
                        "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      padding: "4px 14px",
                      borderRadius: "20px",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                      textTransform: "uppercase",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      marginBottom: "8px",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: isDark ? "#94A3B8" : "#64748B",
                      lineHeight: 1.5,
                      minHeight: "40px",
                    }}
                  >
                    {plan.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    marginBottom: "24px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "34px",
                      fontWeight: 900,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: isDark ? "#94A3B8" : "#64748B",
                      fontWeight: 500,
                    }}
                  >
                    / {plan.period}
                  </span>
                </div>

                <div style={{ flex: 1, marginBottom: "28px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: isDark ? "#CBD5E1" : "#475569",
                      marginBottom: "14px",
                    }}
                  >
                    {isSinhala ? "ඇතුළත් විශේෂාංග:" : "Included Features:"}
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {plan.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          fontSize: "14px",
                          color: isDark ? "#E2E8F0" : "#334155",
                        }}
                      >
                        <Check
                          size={16}
                          color="#10B981"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={plan.ctaAction}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: plan.isPopular
                      ? "none"
                      : isDark
                        ? "1px solid rgba(255, 255, 255, 0.15)"
                        : "1px solid rgba(0, 0, 0, 0.15)",
                    background: plan.isPopular
                      ? "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)"
                      : "transparent",
                    color: plan.isPopular
                      ? "#FFFFFF"
                      : isDark
                        ? "#F1F5F9"
                        : "#0F172A",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: plan.isPopular
                      ? "0 6px 18px rgba(37, 99, 235, 0.35)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                  className="btn-interactive"
                >
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. ABOUT SECTION (#about)
          ══════════════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: "80px 24px",
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.5)"
            : "rgba(241, 245, 249, 0.6)",
          borderTop: isDark
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "1px solid rgba(0, 0, 0, 0.05)",
          borderBottom: isDark
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            {/* Story & Mission */}
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#0284C7",
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                {isSinhala ? "අපේ දැක්ම" : "Our Mission"}
              </span>
              <h2
                style={{
                  fontSize: "clamp(26px, 4vw, 36px)",
                  fontWeight: 800,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: "16px",
                  lineHeight: 1.25,
                }}
              >
                {isSinhala
                  ? "සෑම ශ්‍රී ලාංකික සිසුවෙකුටම සමාන ගුණාත්මක අධ්‍යාපනයක්"
                  : "Empowering Every Sri Lankan Student to Excel"}
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: isDark ? "#94A3B8" : "#64748B",
                  lineHeight: 1.7,
                  marginBottom: "20px",
                }}
              >
                {isSinhala
                  ? "Edu Pulse ආරම්භ කරන ලද්දේ දිවයිනේ කොළඹ හෝ දුෂ්කර ගම්මානයක වේවා, සෑම ශ්‍රී ලාංකික දරුවෙකුටම ජාතික විභාග සඳහා හොඳම සම්පත්, ආදර්ශ පත්‍ර හා ප්‍රවීණ ගුරු විවරණ එකම තැනකින් ලබාදීමේ අරමුණෙනි."
                  : "Edu Pulse was founded with a dedicated vision: to bridge the educational divide across Sri Lanka. Whether a student is preparing in Colombo, Jaffna, Kandy, or Hambantota, they deserve access to the highest-quality exam preparation resources."}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: isDark ? "#94A3B8" : "#64748B",
                  lineHeight: 1.7,
                  marginBottom: "28px",
                }}
              >
                {isSinhala
                  ? "නවීන අධ්‍යාපනික තාක්ෂණය සමඟින් සිසුන්ගේ කාලය ඉතිරි කරමින්, පීඩනයෙන් තොරව ඉහළම සාමාර්ථ්‍යයන් කරා ළඟා වීමට අපි මඟ පෙන්වන්නෙමු."
                  : "By combining expert human pedagogy with modern AI-driven adaptive learning, we turn stressful revision into an engaging, structured journey toward top island rankings."}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#0284C7",
                    }}
                  >
                    9 Provinces
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: isDark ? "#94A3B8" : "#64748B",
                    }}
                  >
                    Island-wide active reach
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#10B981",
                    }}
                  >
                    150+ Top Teachers
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: isDark ? "#94A3B8" : "#64748B",
                    }}
                  >
                    Curriculum paper setters
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials / Hall of Fame Card */}
            <div
              style={{
                borderRadius: "24px",
                background: isDark ? "#1E293B" : "#FFFFFF",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
                padding: "36px 30px",
                boxShadow: isDark
                  ? "0 12px 32px rgba(0,0,0,0.35)"
                  : "0 10px 28px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#F59E0B",
                  marginBottom: "16px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" />
                ))}
              </div>

              <blockquote
                style={{
                  fontSize: "16px",
                  fontStyle: "italic",
                  color: isDark ? "#E2E8F0" : "#334155",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                {isSinhala
                  ? '"Edu Pulse හි ඇති ආදර්ශ ප්‍රශ්න පත්‍ර සහ කාල ගණනය කිරීමේ පහසුකම නිසා මගේ විභාග බිය සම්පූර්ණයෙන්ම නැතිවුණා. මට O/L විභාගයෙන් A සාමාර්ථ්‍ය 9ක් ලබාගැනීමට මෙය විශාල පිටුවහලක් වුණා!"'
                  : '"The timed exam simulator and detailed answer breakdowns made all the difference in my O/L prep. It pinpointed exactly where I was making careless mistakes in Mathematics and Science!"'}
              </blockquote>

              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "16px",
                  }}
                >
                  KP
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    Kaveesha Perera
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#0284C7",
                      fontWeight: 600,
                    }}
                  >
                    G.C.E. O/L 9A Achiever (Colombo)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. INTERACTIVE QUIZ PREVIEWS SECTION (#previews)
          ══════════════════════════════════════════════════════════ */}
      <section id="previews" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#0284C7",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {isSinhala ? "සජීවී අත්දැකීම" : "Interactive Test Drive"}
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                color: isDark ? "#FFFFFF" : "#0F172A",
                marginBottom: "12px",
              }}
            >
              {isSinhala
                ? "ප්‍රශ්නාවලි එන්ජිම සජීවීව අත්හදා බලන්න"
                : "Experience the Quiz Engine Live"}
            </h2>
            <p
              style={{
                color: isDark ? "#94A3B8" : "#64748B",
                fontSize: "16px",
                maxWidth: "580px",
                margin: "0 auto 28px",
              }}
            >
              {isSinhala
                ? "පහත ඇති සැබෑ ප්‍රශ්නයට පිළිතුරු සපයා ක්ෂණික විවරණය සහ ලකුණු ලබාගන්නා ආකාරය අත්විඳින්න."
                : "Select an exam stream below, choose an answer, and witness our instant marking and explanation system in action."}
            </p>

            {/* Stream Selector Tabs */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px",
                borderRadius: "16px",
                background: isDark ? "#1E293B" : "#EDF2F7",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              {[
                { id: "g5", label: isSinhala ? "5 ශිෂ්‍යත්වය" : "Grade 5" },
                {
                  id: "ol",
                  label: isSinhala ? "සාමාන්‍ය පෙළ (O/L)" : "G.C.E. O/L",
                },
                {
                  id: "al",
                  label: isSinhala ? "උසස් පෙළ (A/L)" : "G.C.E. A/L",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleResetPreview(tab.id)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backgroundColor:
                      selectedPreviewTrack === tab.id
                        ? "#0284C7"
                        : "transparent",
                    color:
                      selectedPreviewTrack === tab.id
                        ? "#FFFFFF"
                        : isDark
                          ? "#94A3B8"
                          : "#64748B",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Live Question Card */}
          <div
            style={{
              borderRadius: "24px",
              background: isDark ? "#1E293B" : "#FFFFFF",
              border: isDark
                ? "1px solid rgba(56, 189, 248, 0.25)"
                : "1px solid rgba(2, 132, 199, 0.2)",
              boxShadow: "0 20px 40px -15px rgba(2, 132, 199, 0.15)",
              padding: "36px 30px",
              position: "relative",
            }}
          >
            {/* Header bar of question card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "22px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    background: "rgba(2, 132, 199, 0.12)",
                    color: "#0284C7",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {currentPreview.trackName}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: isDark ? "#94A3B8" : "#64748B",
                  }}
                >
                  Question 1 of 1
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isDark ? "#CBD5E1" : "#475569",
                  background: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                }}
              >
                <Clock size={14} color="#0284C7" />
                <span>00:45</span>
              </div>
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: isDark ? "#FFFFFF" : "#0F172A",
                lineHeight: 1.5,
                marginBottom: "26px",
              }}
            >
              {currentPreview.question}
            </h3>

            {/* Options List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {currentPreview.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentPreview.correctIndex === idx;

                let optionBg = isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(15, 23, 42, 0.02)";
                let optionBorder = isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.08)";
                let optionColor = isDark ? "#F1F5F9" : "#0F172A";

                if (isAnswerChecked) {
                  if (isCorrect) {
                    optionBg = "rgba(16, 185, 129, 0.15)";
                    optionBorder = "#10B981";
                    optionColor = "#10B981";
                  } else if (isSelected && !isCorrect) {
                    optionBg = "rgba(239, 68, 68, 0.15)";
                    optionBorder = "#EF4444";
                    optionColor = "#EF4444";
                  }
                } else if (isSelected) {
                  optionBg = "rgba(2, 132, 199, 0.12)";
                  optionBorder = "#0284C7";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      border: `1.5px solid ${optionBorder}`,
                      backgroundColor: optionBg,
                      cursor: isAnswerChecked ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      color: optionColor,
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: `2px solid ${optionBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    >
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Answer Checked Feedback Card */}
            {isAnswerChecked && (
              <div
                style={{
                  borderRadius: "16px",
                  padding: "20px 24px",
                  backgroundColor:
                    selectedOption === currentPreview.correctIndex
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(2, 132, 199, 0.1)",
                  border:
                    selectedOption === currentPreview.correctIndex
                      ? "1px solid rgba(16, 185, 129, 0.3)"
                      : "1px solid rgba(2, 132, 199, 0.3)",
                  marginBottom: "26px",
                  animation: "dropdownFadeIn 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <CheckCircle2 size={20} color="#10B981" />
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#10B981",
                    }}
                  >
                    {selectedOption === currentPreview.correctIndex
                      ? isSinhala
                        ? "නිවැරදියි! විශිෂ්ටයි!"
                        : "Correct! Great job!"
                      : isSinhala
                        ? "නිවැරදි පිළිතුර විවරණය මෙන්න:"
                        : "Step-by-step Solution Explanation:"}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: isDark ? "#E2E8F0" : "#334155",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {currentPreview.explanation}
                </p>
              </div>
            )}

            {/* Card Action Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <button
                onClick={() => handleResetPreview(selectedPreviewTrack)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.1)",
                  background: "transparent",
                  color: isDark ? "#94A3B8" : "#64748B",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={14} />
                <span>{isSinhala ? "නැවත මුල සිට" : "Reset Question"}</span>
              </button>

              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      selectedOption === null
                        ? isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)"
                        : "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                    color: selectedOption === null ? "#94A3B8" : "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: selectedOption === null ? "not-allowed" : "pointer",
                    boxShadow:
                      selectedOption !== null
                        ? "0 6px 18px rgba(37, 99, 235, 0.35)"
                        : "none",
                  }}
                >
                  <span>
                    {isSinhala ? "පිළිතුර පරීක්ෂා කරන්න" : "Check Answer"}
                  </span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => navigate(user ? "/dashboard" : "/quizzes")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                  }}
                >
                  <Sparkles size={16} />
                  <span>
                    {isSinhala
                      ? "තවත් 500+ ප්‍රශ්නාවලි උත්සාහ කරන්න"
                      : "Try 500+ Full Model Papers"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. CONTACT & SUPPORT SECTION (#contact)
          ══════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          padding: "80px 24px",
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.5)"
            : "rgba(241, 245, 249, 0.6)",
          borderTop: isDark
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#0284C7",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {isSinhala ? "සම්බන්ධ වන්න" : "Academic Support"}
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                color: isDark ? "#FFFFFF" : "#0F172A",
                marginBottom: "12px",
              }}
            >
              {isSinhala
                ? "අපගේ අධ්‍යාපනික සහය කණ්ඩායම අමතන්න"
                : "Get in Touch with Our Academic Team"}
            </h2>
            <p
              style={{
                color: isDark ? "#94A3B8" : "#64748B",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {isSinhala
                ? "ගිණුම් ලියාපදිංචිය, ප්‍රශ්නාවලි හෝ පාසල් බලපත්‍ර පිළිබඳ ඕනෑම ගැටලුවක් අපට යොමු කරන්න."
                : "Have questions regarding syllabus coverage, school licensing, or payment methods? We are here to guide you."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "36px",
            }}
          >
            {/* Contact Details & FAQs */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(2, 132, 199, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} color="#0284C7" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      Helpline & WhatsApp
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      +94 11 234 5678 / +94 77 123 4567
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} color="#10B981" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      Official Email
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      support@edupulse.lk
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(139, 92, 246, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} color="#8B5CF6" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      Headquarters
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      Edu Pulse Educational Technologies, Colombo 03, Sri Lanka
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQs */}
              <div>
                <h4
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    marginBottom: "14px",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                  }}
                >
                  {isSinhala
                    ? "නිතර අසන ප්‍රශ්න (FAQ)"
                    : "Frequently Asked Questions"}
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {faqItems.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      style={{
                        borderRadius: "12px",
                        background: isDark ? "#1E293B" : "#FFFFFF",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid rgba(0,0,0,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaq(openFaq === fIdx ? null : fIdx)
                        }
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "none",
                          background: "transparent",
                          color: isDark ? "#F1F5F9" : "#0F172A",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={16}
                          style={{
                            transform:
                              openFaq === fIdx ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s ease",
                            color: "#0284C7",
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {openFaq === fIdx && (
                        <div
                          style={{
                            padding: "0 18px 14px",
                            fontSize: "13px",
                            color: isDark ? "#94A3B8" : "#64748B",
                            lineHeight: 1.6,
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div
              style={{
                borderRadius: "24px",
                background: isDark ? "#1E293B" : "#FFFFFF",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.08)",
                padding: "36px 30px",
                boxShadow: isDark
                  ? "0 12px 30px rgba(0,0,0,0.3)"
                  : "0 8px 24px rgba(15, 23, 42, 0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: "8px",
                }}
              >
                {isSinhala ? "අපට පණිවිඩයක් එවන්න" : "Send Us a Direct Message"}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: isDark ? "#94A3B8" : "#64748B",
                  marginBottom: "24px",
                }}
              >
                {isSinhala
                  ? "අපගේ අධ්‍යාපනික උපදේශකවරයෙකු පැය 2ක් ඇතුළත ඔබ හා සම්බන්ධ වනු ඇත."
                  : "Our academic counselors respond to all queries within 2 hours."}
              </p>

              {contactSubmitted ? (
                <div
                  style={{
                    padding: "30px 20px",
                    borderRadius: "16px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    textAlign: "center",
                    animation: "dropdownFadeIn 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#10B981",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h4
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#10B981",
                      marginBottom: "6px",
                    }}
                  >
                    {isSinhala
                      ? "පණිවිඩය සාර්ථකව ලැබිණි!"
                      : "Message Sent Successfully!"}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: isDark ? "#CBD5E1" : "#475569",
                      margin: 0,
                    }}
                  >
                    {isSinhala
                      ? "අපගේ කණ්ඩායම ඉක්මනින්ම ඔබ හා සම්බන්ධ වනු ඇත."
                      : "Thank you for reaching out. We will get back to you shortly."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isDark ? "#CBD5E1" : "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      {isSinhala ? "ඔබගේ නම" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Fernando"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(0,0,0,0.12)",
                        background: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        padding: "0 14px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isDark ? "#CBD5E1" : "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      {isSinhala ? "විද්‍යුත් තැපෑල" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.lk"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(0,0,0,0.12)",
                        background: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        padding: "0 14px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isDark ? "#CBD5E1" : "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      {isSinhala ? "විභාග ධාරාව" : "Academic Stream"}
                    </label>
                    <select
                      value={contactForm.examTrack}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          examTrack: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(0,0,0,0.12)",
                        background: isDark ? "#1E293B" : "#FFFFFF",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        padding: "0 14px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    >
                      <option value="g5">
                        Grade 5 Scholarship (5 වසර ශිෂ්‍යත්වය)
                      </option>
                      <option value="ol">G.C.E. Ordinary Level (O/L)</option>
                      <option value="al">G.C.E. Advanced Level (A/L)</option>
                      <option value="parent">
                        Parent / Teacher / School License
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isDark ? "#CBD5E1" : "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      {isSinhala ? "ඔබගේ පණිවිඩය" : "Your Message"}
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder={
                        isSinhala
                          ? "ඔබගේ ගැටලුව මෙහි සඳහන් කරන්න..."
                          : "How can our academic team help you?"
                      }
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid rgba(0,0,0,0.12)",
                        background: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        padding: "12px 14px",
                        fontSize: "14px",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      height: "46px",
                      borderRadius: "12px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: contactSubmitting ? "not-allowed" : "pointer",
                      boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
                      marginTop: "6px",
                    }}
                  >
                    <Send size={16} />
                    <span>
                      {contactSubmitting
                        ? isSinhala
                          ? "යවමින් පවතී..."
                          : "Sending..."
                        : isSinhala
                          ? "පණිවිඩය යවන්න"
                          : "Send Message"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. LANDING FOOTER
          ══════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: isDark
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          padding: "60px 24px 36px",
          backgroundColor: isDark ? "#080C14" : "#FFFFFF",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "36px",
              marginBottom: "48px",
            }}
          >
            {/* Brand column */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "15px",
                  }}
                >
                  EQ
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: isDark ? "#FFFFFF" : "#0F172A",
                  }}
                >
                  Edu Pulse
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: isDark ? "#94A3B8" : "#64748B",
                  lineHeight: 1.6,
                  maxWidth: "280px",
                }}
              >
                {isSinhala
                  ? "ශ්‍රී ලංකාවේ සියලුම සිසුන් සඳහා උසස් තත්ත්වයේ ආදර්ශ ප්‍රශ්න පත්‍ර හා බුද්ධිමත් විභාග සූදානම් කිරීම."
                  : "Sri Lanka's intelligent examination practice platform for Grade 5 Scholarship, O/L, and A/L learners."}
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: "14px",
                }}
              >
                Quick Navigation
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <a
                  href="#home"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  Home
                </a>
                <a
                  href="#features"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  Features & Tools
                </a>
                <a
                  href="#plans"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  Plans & Pricing
                </a>
                <a
                  href="#about"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  About Edu Pulse
                </a>
                <a
                  href="#previews"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  Live Quiz Preview
                </a>
                <a
                  href="#contact"
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    textDecoration: "none",
                  }}
                >
                  Contact & Help
                </a>
              </div>
            </div>

            {/* Exam Tracks */}
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: "14px",
                }}
              >
                Exam Programs
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                  Grade 5 Scholarship IQ & Maths
                </span>
                <span style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                  G.C.E. O/L Science & Mathematics
                </span>
                <span style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                  G.C.E. O/L English, History & Commerce
                </span>
                <span style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                  G.C.E. A/L Biological & Physical Science
                </span>
                <span style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
                  G.C.E. A/L Commerce & Arts Stream
                </span>
              </div>
            </div>

            {/* Student Portal */}
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: "14px",
                }}
              >
                Student Portal
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <button
                  onClick={() => navigate(user ? "/dashboard" : "/login")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    color: "#0284C7",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {user ? "My Student Dashboard" : "Student Login"}
                </button>
                <button
                  onClick={() =>
                    navigate("/login", { state: { isSignUp: true } })
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    color: isDark ? "#94A3B8" : "#64748B",
                    cursor: "pointer",
                  }}
                >
                  Create New Account
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    color: isDark ? "#94A3B8" : "#64748B",
                    cursor: "pointer",
                  }}
                >
                  Browse Quiz Library
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: "28px",
              borderTop: isDark
                ? "1px solid rgba(255, 255, 255, 0.06)"
                : "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "13px",
              color: isDark ? "#64748B" : "#94A3B8",
            }}
          >
            <div>
              © {new Date().getFullYear()} Edu Pulse Platform Sri Lanka. All
              rights reserved.
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Academic Integrity</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .quiz-paper-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.3) !important;
          border-color: rgba(56, 189, 248, 0.4) !important;
        }

        .feature-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.25) !important;
          border-color: rgba(56, 189, 248, 0.35) !important;
        }

        .btn-interactive:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }

        .btn-outline-hover:hover {
          background-color: rgba(2, 132, 199, 0.08) !important;
          border-color: #0284C7 !important;
        }
      `}</style>
    </div>
  );
}
