"use client";
import Navbar from "@/components/Navbar";

import { fetchSignInMethodsForEmail } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  linkWithCredential,
} from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";

import { auth, db } from "@/lib/firebase";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { app } from "@/lib/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const ecosystemContent: Record<string, string> = {
  Hardware:
    "Crafting intelligent, modular hardware systems that feel powerful yet simple—designed to travel anywhere, evolve over time, and inspire hands-on discovery.",
  Dashboard:
    "Building unified digital dashboards that transform raw data into clarity, with future-ready AI integration for insights, guidance, and smarter decision-making.",
  Experiments:
    "Enabling guided and open-ended experimentation that encourages curiosity, creativity, and real-world problem solving beyond textbooks.",
  Learning:
    "Creating immersive learning journeys where theory meets practice, empowering users to learn by doing, failing, improving, and mastering concepts.",
};

// Type for particles
type Particle = { top: number; left: number; delay: number };

// Persistent counter for unique particle IDs
let particleIdCounter = 0;

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState<{
    email: string;
    credential: any;
  } | null>(null);

  const [showTopArrow, setShowTopArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopArrow(window.scrollY > 300); // show after scrolling 300px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [heroParticles, setHeroParticles] = useState<Particle[]>([]);
  const [productParticles, setProductParticles] = useState<Particle[]>([]);
  const [formType, setFormType] = useState<"register" | "login">("register");
  const [cursorParticles, setCursorParticles] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [loginForm, setLoginForm] = useState({ user: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Generate hero & product floating particles
  useEffect(() => {
    const heroArr = Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setHeroParticles(heroArr);

    const productArr = Array.from({ length: 10 }).map(() => ({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 2,
    }));
    setProductParticles(productArr);
  }, []);

  // Smooth trailing cursor animation
  useEffect(() => {
    if (mobileMenuOpen) return;
    if (window.innerWidth < 768) return;
    let mouseX = 0;
    let mouseY = 0;
    const maxParticles = 12;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      id: number;
    }[] = [];

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      if (particles.length < maxParticles) {
        particleIdCounter += 1;
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: 0,
          vy: 0,
          id: particleIdCounter,
        });
      }

      for (let i = 0; i < particles.length; i++) {
        const target = i === 0 ? { x: mouseX, y: mouseY } : particles[i - 1];
        particles[i].vx += (target.x - particles[i].x) * 0.15;
        particles[i].vy += (target.y - particles[i].y) * 0.15;
        particles[i].vx *= 0.7;
        particles[i].vy *= 0.7;
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
      }

      if (particles.length > maxParticles)
        particles.splice(0, particles.length - maxParticles);

      setCursorParticles([
        ...particles.map((p) => ({ x: p.x, y: p.y, id: p.id })),
      ]);
      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  //Scroll Tracking

  useEffect(() => {
    const sectionIds = ["about", "ecosystem", "products", "access"];
    const handleScroll = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        const dot = document.getElementById(`dot-${id}`);
        if (!section || !dot) return;
        if (
          scrollMiddle >= section.offsetTop &&
          scrollMiddle < section.offsetTop + section.offsetHeight
        ) {
          dot.classList.add("bg-white");
          dot.classList.remove("bg-white/30");
          dot.classList.add("scale-125");
        } else {
          dot.classList.remove("bg-white");
          dot.classList.remove("scale-125");
          dot.classList.add("bg-white/30");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //JS Parallax
  useEffect(() => {
    const heroOrb = document.querySelector(".hero-orb") as HTMLElement;
    const ecosystemOrb = document.querySelector(
      ".ecosystem-orb"
    ) as HTMLElement;

    const handleParallax = () => {
      const scrollY = window.scrollY;
      if (heroOrb) heroOrb.style.transform = `translateY(${scrollY * 0.2}px)`;
      if (ecosystemOrb)
        ecosystemOrb.style.transform = `translateY(${scrollY * 0.1}px)`;
    };

    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  // Smooth scroll for nav
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Validation for register
  const validateRegister = () => {
    const errs: { [key: string]: string } = {};
    if (!registerForm.name.trim()) errs.name = "Name is required";
    if (!registerForm.email.match(/^\S+@\S+\.\S+$/))
      errs.email = "Valid email required";
    if (!registerForm.phone.match(/^\d{10}$/))
      errs.phone = "10-digit phone required";
    if (registerForm.password.length < 6)
      errs.password = "Password min 6 chars";
    if (registerForm.password !== registerForm.confirm)
      errs.confirm = "Passwords must match";
    if (!registerForm.terms) errs.terms = "You must accept terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation for login
  const validateLogin = () => {
    const errs: { [key: string]: string } = {};
    if (!loginForm.user.trim()) errs.user = "Name/Email required";
    if (!loginForm.password) errs.password = "Password required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ----------------- HELPER FUNCTION -----------------
  const showFormMessage = (
    type: "success" | "error",
    text: string,
    clearForm: boolean = false
  ) => {
    setFormMessage({ type, text });

    // Clear the form if requested
    if (clearForm) {
      if (formType === "register") {
        setRegisterForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirm: "",
          terms: false,
        });
      } else {
        setLoginForm({ user: "", password: "" });
      }
    }

    // Remove the message after 4 seconds
    setTimeout(() => setFormMessage(null), 4000);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setFormType("login");

    try {
      // 1️⃣ Ask user to pick Google account (no login yet)
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;

      if (!gUser.email) return;

      // 2️⃣ Check which providers already exist
      const methods = await fetchSignInMethodsForEmail(auth, gUser.email);

      // 3️⃣ If password already exists → block Google-only login
      if (methods.includes("password") && !methods.includes("google.com")) {
        // ⛔ Roll back Google login
        await auth.signOut();

        setPendingGoogle({
          email: gUser.email,
          credential: GoogleAuthProvider.credentialFromResult(result),
        });

        showFormMessage(
          "error",
          "Account exists with password. Please login using password to link Google."
        );
        return;
      }

      // 4️⃣ Check Firestore registration
      const q = query(
        collection(db, "users"),
        where("email", "==", gUser.email)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        await auth.signOut();
        showFormMessage(
          "error",
          "This Google account is not registered. Please register first."
        );
        return;
      }

      const userName = snap.docs[0].data().name || "";
      showFormMessage(
        "success",
        `Welcome back${userName ? `, ${userName}` : ""}!`,
        true
      );
    } catch (err: any) {
      showFormMessage("error", err.message || "Google sign-in failed");
    }
  };

  // ----------------- HANDLE REGISTER -----------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      showFormMessage("error", "Firebase not ready. Please try again.");
      return;
    }

    if (!validateRegister()) {
      showFormMessage("error", "Please fix the errors above and try again.");
      return;
    }

    const { name, email, phone, password } = registerForm;

    try {
      // 1️⃣ Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Store profile in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        createdAt: new Date(),
      });

      // ✅ Show success and clear form
      showFormMessage(
        "success",
        "Registration successful! You can now log in.",
        true
      );
    } catch (error: any) {
      showFormMessage("error", error.message || "Registration failed");
    }
  };
  // ----------------- HANDLE LOGIN -----------------

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      let email = loginForm.user.trim();

      // If user entered name → resolve email
      if (!isEmail(email)) {
        const q = query(collection(db, "users"), where("name", "==", email));
        const snap = await getDocs(q);

        if (snap.empty) {
          showFormMessage("error", "User not found");
          return;
        }

        email = snap.docs[0].data().email;
      }

      // ✅ SIGN OUT CURRENT USER FIRST
      if (auth.currentUser) {
        await auth.signOut();
      }

      // ✅ Then email/password login
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        loginForm.password
      );

      // 🔗 Link Google if pending
      if (pendingGoogle && pendingGoogle.email === email) {
        await linkWithCredential(cred.user, pendingGoogle.credential);
        setPendingGoogle(null);
      }

      // Firestore fetch
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const userName = userDoc.exists() ? userDoc.data().name : "";

      showFormMessage(
        "success",
        `Welcome back${userName ? `, ${userName}` : ""}!`,
        true
      );
    } catch (err) {
      console.error(err);
      showFormMessage("error", "Invalid credentials");
    }
  };

  // ----------------- HANDLE FORGOT PASSWORD -----------------
  const handleForgotPassword = async () => {
    if (!loginForm.user.trim()) {
      setErrors({ user: "Please enter your registered name or email" });
      return;
    }

    try {
      let email = loginForm.user;

      // If user entered a name instead of email, resolve to email from Firestore
      if (!isEmail(loginForm.user) && db) {
        const q = query(
          collection(db, "users"),
          where("name", "==", loginForm.user)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const userData = snap.docs[0].data();
          email = userData.email;
        } else {
          showFormMessage("error", "User not found");
          return;
        }
      }

      // Send password reset email
      if (!auth) {
        showFormMessage("error", "Firebase Auth not initialized yet.");
        return;
      }
      await sendPasswordResetEmail(auth, email);

      showFormMessage(
        "success",
        "Password reset email sent! Check your inbox."
      );
    } catch (err: any) {
      console.error(err);
      showFormMessage(
        "error",
        err.message || "Failed to send password reset email"
      );
    }
  };

  // Helper function for floating labels
  const getLabelClasses = (value: string) =>
    `absolute left-4 text-sm transition-all
     ${
       value
         ? "top-[-8px] text-blue-400 text-xs"
         : "top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-[-8px] peer-focus:text-blue-400 peer-focus:text-xs capitalize"
     }`;
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Render nothing on server

  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="scroll-smooth min-h-screen pt-[72px] relative overflow-x-hidden text-white">
        {/* ================= GLOBAL WIX-STYLE BACKGROUND ================= */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0
                bg-gradient-to-br
                from-purple-200/40 to-blue-200/40
                dark:from-purple-900/40 dark:to-blue-900/40"
          />

          {/* Base gradient */}
          <div
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(30,64,175,0.25), transparent 40%)," +
                "radial-gradient(circle at 80% 30%, rgba(124,58,237,0.25), transparent 45%)," +
                "radial-gradient(circle at 50% 80%, rgba(14,165,233,0.25), transparent 45%)," +
                "linear-gradient(to bottom, #020617, #000)",
            }}
            className="absolute inset-0"
          />

          {/* Floating blobs */}
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-purple-500/30 rounded-full blur-[180px] animate-bg-float-1" />
          <div className="absolute top-[20%] -right-48 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[180px] animate-bg-float-2" />
          <div className="absolute bottom-[-30%] left-[20%] w-[800px] h-[800px] bg-cyan-400/20 rounded-full blur-[200px] animate-bg-float-3" />
        </div>
        {/* =============================================================== */}

        {/* Scroll Progress Dots */}
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-4 z-50">
          {["about", "ecosystem", "products", "access"].map((id) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className="w-3 h-3 rounded-full bg-white/30 transition-all"
              id={`dot-${id}`}
            />
          ))}
        </div>

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-blue-500/5 blur-[160px]" />
        </div>
        {/* NAVBAR */}
        <header className="fixed top-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10">
          <div className="flex items-center justify-between px-6 md:px-16 py-4">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-blue-400">CompanyXYZ</h1>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
              {["about", "ecosystem", "products", "access"].map((section) => (
                <button
                  key={section}
                  onClick={() => handleNavClick(section)}
                  className="hover:text-blue-400 transition"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}

              {/* LOGIN / PROFILE */}
              <button className="ml-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <div className="w-7 h-7 rounded-full bg-blue-400/40" />
                <span className="text-sm">
                  {user
                    ? user.displayName?.split(" ")[0] ||
                      user.email?.split("@")[0]
                    : "Login"}
                </span>
              </button>
            </nav>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-gray-300 relative w-8 h-8"
                aria-label="Open menu"
              >
                <motion.span
                  className="absolute top-2 left-1 w-6 h-[2px] bg-white"
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 6 : 0,
                  }}
                />
                <motion.span
                  className="absolute top-4 left-1 w-6 h-[2px] bg-white"
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                />
                <motion.span
                  className="absolute top-6 left-1 w-6 h-[2px] bg-white"
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? -6 : 0,
                  }}
                />
              </button>
            </div>
          </div>

          {/* Mobile menu + backdrop */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* OVERLAY */}
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* SLIDE-IN PANEL */}
                <motion.div
                  className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-900 z-50 p-6 md:hidden"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  {/* CLOSE */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 text-white text-2xl"
                  >
                    ✕
                  </button>

                  {/* PROFILE SECTION */}
                  <div className="flex items-center gap-4 mt-10 mb-10">
                    <div className="w-12 h-12 rounded-full bg-blue-400/40" />
                    <div>
                      <p className="text-white font-medium">
                        {user
                          ? user.displayName?.split(" ")[0] ||
                            user.email?.split("@")[0]
                          : "Guest User"}
                      </p>

                      {!user && (
                        <button className="text-sm text-gray-400 hover:text-blue-400">
                          Login / Sign up
                        </button>
                      )}
                    </div>
                  </div>

                  {/* LINKS */}
                  <div className="flex flex-col gap-6 text-lg text-white">
                    {["about", "ecosystem", "products", "access"].map(
                      (section) => (
                        <button
                          key={section}
                          onClick={() => {
                            handleNavClick(section);
                            setMobileMenuOpen(false);
                          }}
                          className="text-left hover:text-blue-400 transition"
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </header>

        {/* HERO */}
        <section className="min-h-[calc(100vh-72px)] snap-start px-6 md:px-16 py-12 md:py-0 flex items-center relative">
          {/* BACKGROUND LAYER */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Red glow */}
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full 
                  bg-red-600/30 blur-[140px]"
            />

            {/* Secondary glow */}
            <div
              className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full 
                  bg-orange-500/20 blur-[140px]"
            />
            <motion.div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full 
             bg-red-600/30 blur-[140px]"
              animate={{ y: [0, 40, 0] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] hero-orb pointer-events-none" />

          <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center h-full">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-extrabold"
              >
                Rethinking
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Practical Education
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="text-gray-400 max-w-2xl mt-6"
              >
                CompanyXYZ is building a new-age learning ecosystem where
                experimentation, technology, and guided knowledge come together
                seamlessly.
              </motion.p>
            </div>

            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 6, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, rotate: 1 }}
                animate={{ y: [0, -10, 0] }}
                className="relative w-full h-full"
              >
                <Image
                  src="/hero_img.JPG"
                  alt="Creative illustration representing CompanyXYZ"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Hero Floating particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {heroParticles.map((p, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-blue-400/15 rounded-full absolute animate-pulse"
                  style={{
                    top: `${p.top}%`,
                    left: `${p.left}%`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="min-h-screen snap-start px-6 md:px-16 py-12 md:py-0 flex items-center"
        >
          <div className="w-full max-w-7xl mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-center mb-14"
            >
              What We Do
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                [
                  "Our Purpose",
                  "CompanyXYZ exists to reimagine how innovation, learning, and technology come together to solve real-world challenges in an accessible and meaningful way.",
                ],
                [
                  "Our Mission",
                  "To build thoughtful, future-ready solutions and ecosystems that empower learners, creators, and institutions beyond traditional limitations.",
                ],
                [
                  "Our Approach",
                  "We follow a design-first, problem-driven mindset—combining creativity, technology, and scalability while keeping simplicity, safety, and impact at the core.",
                ],
              ].map(([title, desc]) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section
          id="ecosystem"
          className="min-h-screen snap-start px-6 md:px-16 py-12 md:py-0 flex items-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl ecosystem-orb animate-pulse-slow" />
          <div className="absolute bottom-10 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse-slow" />

          <div className="w-full max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-12">
              The CompanyXYZ Ecosystem
            </h3>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {Object.keys(ecosystemContent).map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-400/20"
                >
                  <h4 className="text-lg font-semibold text-purple-300">
                    {item}
                  </h4>
                  <p
                    className="text-gray-400 mt-2 text-sm"
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                      marginBottom: "15px",
                      lineHeight: "1.6",
                    }}
                  >
                    {ecosystemContent[item]}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse-slow" />
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          className="min-h-screen snap-start px-6 md:px-16 py-12 md:py-0 flex items-center justify-center text-center relative"
        >
          <div className="w-full max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-12">Products Preview</h3>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-[260px] md:w-[360px] aspect-square rounded-2xl overflow-hidden shadow-xl shadow-black/40 cursor-pointer">
                <Image
                  src="/synlab.jpg"
                  alt="SynLab Portable Lab"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 opacity-100 md:opacity-0 md:hover:opacity-100 transition">
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="px-4 py-2 mb-2 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-semibold"
                  >
                    View Demo
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-semibold"
                  >
                    Details
                  </motion.button>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold">
                  SynLab — The Portable Lab
                </h4>
                <p className="text-gray-400 text-sm mt-2">
                  The first portable smart laboratory in our ecosystem.
                </p>
                <span className="inline-block mt-4 text-blue-400 text-sm">
                  More products coming soon
                </span>
              </div>
            </motion.div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {productParticles.map((p, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
                  style={{
                    top: `${p.top}%`,
                    left: `${p.left}%`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* REGISTER/LOGIN */}
        <section
          id="access"
          className="min-h-screen snap-start px-6 md:px-16 flex items-center relative pt-20 py-12"
        >
          <div className="w-full max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Get Started</h3>
            <p className="text-gray-400 mb-8">
              Create an account to access dashboards, tutorials, and future
              products.
            </p>

            <div className="max-w-2xl mx-auto bg-black/40 rounded-xl p-8 backdrop-blur-md">
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setFormType("register")}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    formType === "register"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => setFormType("login")}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    formType === "login"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  Login
                </button>
              </div>

              {/* Forms (register/login) */}
              {formType === "register" ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-5 text-left"
                  onSubmit={handleRegisterSubmit}
                >
                  {["name", "email", "phone", "password", "confirm"].map(
                    (field, idx) => (
                      <div key={idx} className="relative">
                        <input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          value={(registerForm as any)[field]}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              [field]: e.target.value,
                            })
                          }
                          className="peer w-full p-4 rounded-lg bg-white/10 text-white placeholder-transparent focus:ring-2 focus:ring-blue-400 outline-none"
                          placeholder={field}
                        />
                        <label
                          className={getLabelClasses(
                            (registerForm as any)[field]
                          )}
                        >
                          {field}
                        </label>
                        {errors[field] && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors[field]}
                          </p>
                        )}
                      </div>
                    )
                  )}

                  <label className="flex items-center gap-2 text-gray-400 text-sm">
                    <input
                      type="checkbox"
                      checked={registerForm.terms}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          terms: e.target.checked,
                        })
                      }
                      className="accent-blue-400"
                    />
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 underline">
                      Terms & Conditions
                    </a>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs">{errors.terms}</p>
                  )}

                  {formMessage && (
                    <p
                      aria-live="polite"
                      className={`text-sm mb-2 px-2 py-1 rounded ${
                        formMessage.type === "success"
                          ? "bg-green-500/30 text-green-200"
                          : "bg-red-500/30 text-red-200"
                      }`}
                    >
                      {formMessage.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="touch-effect mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg text-white"
                  >
                    Register
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-5 text-left"
                  onSubmit={handleLoginSubmit}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={loginForm.user}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, user: e.target.value })
                      }
                      placeholder="Name or Email"
                      className="peer w-full p-4 rounded-lg bg-white/10 text-white placeholder-transparent focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <label className={getLabelClasses(loginForm.user)}>
                      Name or Email
                    </label>
                    {errors.user && (
                      <p className="text-red-400 text-xs mt-1">{errors.user}</p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password"
                      className="peer w-full p-4 rounded-lg bg-white/10 text-white placeholder-transparent focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <label className={getLabelClasses(loginForm.password)}>
                      Password
                    </label>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {formMessage && (
                    <p
                      aria-live="polite"
                      className={`text-sm mb-2 px-2 py-1 rounded ${
                        formMessage.type === "success"
                          ? "bg-green-500/30 text-green-200"
                          : "bg-red-500/30 text-red-200"
                      }`}
                    >
                      {formMessage.text}
                    </p>
                  )}

                  <div className="text-right text-sm">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-blue-400 underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="touch-effect mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg text-white"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="touch-effect mt-4 flex items-center justify-center gap-3 w-full px-6 py-3
             bg-white text-black rounded-lg font-semibold
             hover:bg-gray-200 transition-all"
                  >
                    <img src="/google.png" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER – UPDATED */}
        <footer className="border-t border-white/10 px-6 md:px-16 py-8 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} CompanyXYZ · All rights reserved.
          <div className="mt-3">
            <p className="text-white font-semibold">Innovexa Team</p>
            <p>
              Adarsh Kumar Dash ·
              <a
                href="https://www.linkedin.com/in/adarsh-kumar-dash-5020873a3/"
                className="text-cyan-400 underline ml-1"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </footer>
        {showTopArrow && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500/80 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.button>
        )}

        {/* GLOBAL CURSOR TRAIL (DESKTOP ONLY) */}
        {cursorParticles.map((p, i) => (
          <motion.div
            key={p.id}
            className="fixed w-3 h-3 rounded-full z-20"
            style={{
              top: p.y,
              left: p.x,
              background: `rgba(59,130,246,${0.15 + i * 0.06})`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        ))}
      </main>
    </div>
  );
}
