"use client";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  HeartPulse,
  Brain,
  Stethoscope,
  Pill,
  ShieldCheck,
  Bell,
  FileText,
  BarChart3,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Lock,
  Users,
  Sparkles,
  Activity,
  ChevronDown,
} from "lucide-react";

/* ── Reusable fade-up wrapper ─────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ─────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
const HERO_WORDS = ["Diagnostics,", "Insights,", "Prescriptions,"];

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setWordIdx((i) => (i + 1) % HERO_WORDS.length),
      2200,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 px-6">
      {/* Animated blobs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-medical-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/6 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-medical-500/10 border border-medical-500/20 rounded-full text-medical-500 text-xs font-bold uppercase tracking-widest"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.span>
          AI-Powered Medical Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
        >
          AI-Driven{" "}
          <span className="relative inline-block">
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-medical-500"
            >
              {HERO_WORDS[wordIdx]}
            </motion.span>
          </span>
          <br />
          <span className="text-slate-400 dark:text-slate-500">
            Human-Centered
          </span>{" "}
          Care
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Bridge the gap between self-diagnosis and professional consultation.
          Get instant symptom analysis, connect with certified doctors, and
          manage your health — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="px-8 py-4 bg-medical-500 text-white rounded-2xl font-bold shadow-xl shadow-medical-500/25 hover:bg-medical-600 transition text-sm tracking-wide flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/medicines"
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm tracking-wide"
            >
              Browse Medicines
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-2"
        >
          {[
            "No credit card required",
            "10 verified doctors",
            "50+ medicines catalogued",
          ].map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400"
      >
        <span className="text-[10px] font-medium uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Stats ────────────────────────────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: 10, suffix: "+", label: "Verified Doctors" },
    { value: 50, suffix: "+", label: "Medicines Catalogued" },
    { value: 30, suffix: "+", label: "Diseases Mapped" },
    { value: 100, suffix: "%", label: "Secure & Encrypted" },
  ];
  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(({ value, suffix, label }, i) => (
          <FadeUp key={label} delay={i * 0.1}>
            <p className="text-4xl font-black text-medical-500">
              <Counter to={value} suffix={suffix} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {label}
            </p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      color: "bg-medical-500/10 text-medical-500",
      border: "hover:border-medical-500/40",
      title: "Symptom Logic Engine",
      desc: "Enter symptoms and get AI-powered probability matches against our disease database. Each result shows emergency level, precautions, and suggested medicines.",
    },
    {
      icon: Stethoscope,
      color: "bg-emerald-500/10 text-emerald-500",
      border: "hover:border-emerald-500/40",
      title: "Verified Doctor Network",
      desc: "Browse specialists across Cardiology, Neurology, Pediatrics, and more. Filter by specialty and book directly from the platform.",
    },
    {
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-500",
      border: "hover:border-blue-500/40",
      title: "Smart Booking System",
      desc: "Multi-step booking with calendar picker, time slot selection, and symptom pre-fill from the Symptom Checker. No double-bookings guaranteed.",
    },
    {
      icon: FileText,
      color: "bg-indigo-500/10 text-indigo-500",
      border: "hover:border-indigo-500/40",
      title: "Digital Prescriptions",
      desc: "Doctors issue PDF prescriptions directly on the platform. Patients download, track medications, and mark daily doses taken.",
    },
    {
      icon: Bell,
      color: "bg-amber-500/10 text-amber-500",
      border: "hover:border-amber-500/40",
      title: "Real-Time Notifications",
      desc: "Socket.io-powered live alerts when a doctor approves your appointment or issues a prescription. No page refresh needed.",
    },
    {
      icon: Pill,
      color: "bg-purple-500/10 text-purple-500",
      border: "hover:border-purple-500/40",
      title: "Medicine Directory",
      desc: "50+ medicines with brand names, generic names, uses, side effects, precautions, pricing, and stock levels — all searchable.",
    },
  ];
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Platform Features
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Everything you need in one place
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            MediVantage combines AI diagnostics, doctor booking, and
            prescription management into a single cohesive ecosystem.
          </p>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, border, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.08}>
              <motion.div
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
                }}
                transition={{ duration: 0.2 }}
                className={`p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl ${border} transition-colors group h-full`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <h3 className="font-bold text-base mb-2 group-hover:text-medical-500 transition">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      desc: "Register as a Patient or Doctor in under 2 minutes. Your data is encrypted end-to-end.",
    },
    {
      step: "02",
      title: "Check Your Symptoms",
      desc: "Use the Symptom Logic Engine to get instant AI-powered diagnostic matches with probability scores.",
    },
    {
      step: "03",
      title: "Book a Consultation",
      desc: "Choose a verified specialist, pick a date and time slot, and confirm your appointment.",
    },
    {
      step: "04",
      title: "Receive Your Prescription",
      desc: "Your doctor issues a digital PDF prescription. Track your medications daily in the Medicine Tracker.",
    },
  ];
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            From symptoms to prescription in 4 steps
          </h2>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, title, desc }, i) => (
            <FadeUp key={step} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden group"
              >
                <span className="text-6xl font-black text-slate-100 dark:text-slate-800 absolute top-3 right-3 leading-none select-none group-hover:text-medical-500/10 transition-colors duration-500">
                  {step}
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-medical-500 text-white rounded-xl flex items-center justify-center font-black text-sm mb-4 shadow-lg shadow-medical-500/25"
                >
                  {step}
                </motion.div>
                <h3 className="font-bold text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Symptom Engine Preview ────────────────────────────────────────────────── */
function SymptomEngineSection() {
  const symptoms = ["Fever", "Headache", "Fatigue", "Sore Throat", "Chills"];
  const results = [
    {
      name: "Influenza",
      match: 85,
      level: "medium",
      cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      name: "Common Cold",
      match: 72,
      level: "low",
      cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      name: "Pneumonia",
      match: 45,
      level: "high",
      cls: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <FadeUp>
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Symptom Logic Engine
          </p>
          <h2 className="text-4xl font-black tracking-tight mb-4">
            AI diagnostics that actually explain themselves
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Our engine cross-references your symptoms against a structured
            disease database and returns probability-ranked matches — not just a
            list of scary possibilities.
          </p>
          <ul className="space-y-3">
            {[
              "Probability match percentage for each condition",
              "Emergency level badge (Low / Medium / High / Critical)",
              "Suggested medicines linked to each disease",
              "One-click booking pre-filled with your symptoms",
            ].map((item) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{" "}
                {item}
              </motion.li>
            ))}
          </ul>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block mt-8"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-medical-500 text-white rounded-xl font-bold text-sm hover:bg-medical-600 transition"
            >
              Try It Now <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div
            ref={ref}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Selected Symptoms
            </p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="px-3 py-1 bg-medical-500/10 text-medical-500 border border-medical-500/20 rounded-full text-xs font-bold"
                >
                  {s}
                </motion.span>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Potential Matches
              </p>
              {results.map(({ name, match, level, cls }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <p className="font-bold text-sm">{name}</p>
                    <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${match}%` } : {}}
                        transition={{
                          delay: 0.8 + i * 0.15,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-1.5 bg-medical-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-black text-medical-500">
                      {match}%
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${cls}`}
                    >
                      {level}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Roles ────────────────────────────────────────────────────────────────── */
function RolesSection() {
  const roles = [
    {
      icon: Users,
      iconCls: "bg-medical-500/10 text-medical-500",
      btnCls: "bg-medical-500 hover:bg-medical-600 shadow-medical-500/25",
      glow: "hover:shadow-medical-500/10",
      title: "For Patients",
      features: [
        "AI Symptom Checker",
        "Book verified doctors",
        "Digital prescription download",
        "Medicine tracker with daily reminders",
        "Real-time appointment notifications",
      ],
      cta: "Register as Patient",
      href: "/register",
    },
    {
      icon: Stethoscope,
      iconCls: "bg-indigo-500/10 text-indigo-500",
      btnCls: "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/25",
      glow: "hover:shadow-indigo-500/10",
      title: "For Doctors",
      features: [
        "Manage appointment queue",
        "View patient symptom history",
        "Issue digital prescriptions",
        "PDF generation & cloud storage",
        "Real-time patient notifications",
      ],
      cta: "Join as Doctor",
      href: "/register",
    },
    {
      icon: BarChart3,
      iconCls: "bg-emerald-500/10 text-emerald-500",
      btnCls: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25",
      glow: "hover:shadow-emerald-500/10",
      title: "For Admins",
      features: [
        "Platform analytics dashboard",
        "Doctor verification workflow",
        "Medicine database CRUD",
        "User management & access control",
        "Disease trend analytics",
      ],
      cta: "Admin Access",
      href: "/login",
    },
  ];
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Three-Way Ecosystem
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Built for every role in healthcare
          </h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(
            (
              { icon: Icon, iconCls, btnCls, glow, title, features, cta, href },
              i,
            ) => (
              <FadeUp key={title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className={`p-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-full shadow-xl shadow-transparent ${glow} transition-shadow duration-300`}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconCls}`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="font-black text-lg mb-4">{title}</h3>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {features.map((f, fi) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fi * 0.07 }}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" />{" "}
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href={href}
                      className={`block w-full py-2.5 text-white rounded-xl text-sm font-bold text-center transition shadow-lg ${btnCls}`}
                    >
                      {cta}
                    </Link>
                  </motion.div>
                </motion.div>
              </FadeUp>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Medicine Preview ─────────────────────────────────────────────────────── */
function MedicinePreviewSection() {
  const medicines = [
    {
      brand: "Amoxil",
      generic: "Amoxicillin",
      category: "Antibiotics",
      price: "$12.50",
      cls: "bg-red-500/10 text-red-500",
    },
    {
      brand: "Lipitor",
      generic: "Atorvastatin",
      category: "Cardiovascular",
      price: "$45.00",
      cls: "bg-rose-500/10 text-rose-500",
    },
    {
      brand: "Ventolin",
      generic: "Salbutamol",
      category: "Respiratory",
      price: "$55.00",
      cls: "bg-sky-500/10 text-sky-500",
    },
    {
      brand: "Glucophage",
      generic: "Metformin",
      category: "Diabetes",
      price: "$18.00",
      cls: "bg-violet-500/10 text-violet-500",
    },
    {
      brand: "Zyrtec",
      generic: "Cetirizine",
      category: "Antihistamines",
      price: "$16.50",
      cls: "bg-amber-500/10 text-amber-500",
    },
    {
      brand: "Calpol",
      generic: "Paracetamol",
      category: "Fever/Pain",
      price: "$8.99",
      cls: "bg-orange-500/10 text-orange-500",
    },
  ];
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Medicine Directory
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            50+ medicines, fully catalogued
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm max-w-lg mx-auto">
            Every medicine includes brand name, generic name, uses, side
            effects, precautions, pricing, and stock levels.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {medicines.map(({ brand, generic, category, price, cls }, i) => (
            <FadeUp key={brand} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -3, borderColor: "rgba(14,165,233,0.4)" }}
                className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors cursor-default"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm">{brand}</p>
                  <p className="font-black text-sm text-slate-700 dark:text-white">
                    {price}
                  </p>
                </div>
                <p className="text-xs font-mono text-slate-400 mb-3">
                  {generic}
                </p>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${cls}`}
                >
                  {category}
                </span>
              </motion.div>
            </FadeUp>
          ))}
        </div>
        <FadeUp className="text-center">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              href="/medicines"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              View All Medicines <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Security ─────────────────────────────────────────────────────────────── */
function SecuritySection() {
  const items = [
    {
      icon: Lock,
      title: "JWT Dual-Token Auth",
      desc: "Short-lived access tokens + HttpOnly refresh cookies. Your session is secure even if the access token is intercepted.",
    },
    {
      icon: ShieldCheck,
      title: "bcrypt Password Hashing",
      desc: "All passwords are hashed with bcrypt at 12 salt rounds — industry standard for medical-grade security.",
    },
    {
      icon: Users,
      title: "Role-Based Access Control",
      desc: "Patients, Doctors, and Admins each see only what they are authorised to see. Edge middleware enforces this on every route.",
    },
    {
      icon: Zap,
      title: "Encrypted Data in Transit",
      desc: "All API communication uses HTTPS. Sensitive fields like passwords are never returned in API responses.",
    },
  ];
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Security & Trust
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Medical-grade security, built in
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm max-w-lg mx-auto">
            Your health data deserves the highest level of protection. We do not
            cut corners.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.1}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex gap-4 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="w-10 h-10 bg-medical-500/10 text-medical-500 rounded-xl flex items-center justify-center shrink-0"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "Patient",
      text: "The symptom checker flagged my condition as high-risk and suggested I book immediately. Turned out to be the right call. This platform might have saved my life.",
      avatar: "AM",
      color: "bg-medical-500",
    },
    {
      name: "Dr. Sarah Jenkins",
      role: "Cardiologist",
      text: "Managing my appointment queue has never been easier. The prescription PDF system is seamless and my patients love getting their prescriptions digitally.",
      avatar: "SJ",
      color: "bg-indigo-500",
    },
    {
      name: "Priya Nair",
      role: "Patient",
      text: "I used to spend hours googling symptoms and scaring myself. MediVantage gives me actual probability scores and connects me to a real doctor in minutes.",
      avatar: "PN",
      color: "bg-emerald-500",
    },
    {
      name: "Dr. Omar Khalid",
      role: "General Practitioner",
      text: "The real-time notifications mean I never miss a new appointment request. The platform handles all the admin so I can focus on patient care.",
      avatar: "OK",
      color: "bg-violet-500",
    },
    {
      name: "Fatima Al-Hassan",
      role: "Patient",
      text: "The medicine tracker is brilliant. I can see my full prescription history and mark daily doses taken all in one place.",
      avatar: "FA",
      color: "bg-rose-500",
    },
    {
      name: "Ravi Sharma",
      role: "Patient",
      text: "Booked my first appointment in under 3 minutes. The doctor had my symptom history before I even said a word. Incredibly efficient.",
      avatar: "RS",
      color: "bg-amber-500",
    },
  ];
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-medical-500 text-xs font-black uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            Trusted by patients and doctors
          </h2>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, text, avatar, color }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 h-full flex flex-col"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: s * 0.06 }}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div
                    className={`w-9 h-9 ${color} text-white rounded-xl flex items-center justify-center text-xs font-black`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-[10px] text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <FadeUp>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-medical-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-medical-500/30"
          >
            <HeartPulse className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-6">
            Your health journey starts here
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mt-4">
            Join MediVantage today. Get AI-powered diagnostics, connect with
            verified doctors, and take control of your health.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register"
                className="px-8 py-4 bg-medical-500 text-white rounded-2xl font-bold shadow-xl shadow-medical-500/25 hover:bg-medical-600 transition text-sm flex items-center gap-2"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/doctors"
                className="px-8 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm"
              >
                Browse Doctors
              </Link>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-medical-500 rounded-lg flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-base">MediVantage</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              AI-Driven Diagnostics, Human-Centered Care. A three-way ecosystem
              for patients, doctors, and administrators.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              Platform
            </p>
            <ul className="space-y-2">
              {[
                ["Medicines", "/medicines"],
                ["Doctors", "/doctors"],
                ["Sign In", "/login"],
                ["Register", "/register"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-medical-500 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              Dashboards
            </p>
            <ul className="space-y-2">
              {[
                ["Patient Portal", "/patient"],
                ["Doctor Portal", "/doctor"],
                ["Admin Panel", "/admin"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-medical-500 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            &copy; {year} MediVantage. AI-assisted diagnostics for informational
            purposes only.
          </span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-500" /> All systems
            operational
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page export ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SymptomEngineSection />
      <RolesSection />
      <MedicinePreviewSection />
      <SecuritySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}
