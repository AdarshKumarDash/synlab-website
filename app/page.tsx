"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // ----------------- HANDLE REGISTER -----------------
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegister()) {
      // Extract user details
      const { name, email, phone, password } = registerForm;
      const user = { name, email, phone, password };

      localStorage.setItem("user", JSON.stringify(user));

      // Show success message
      setFormMessage({ type: "success", text: "Registration Successful!" });
      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
        terms: false,
      });

      // Clear message after 5s
      setTimeout(() => setFormMessage(null), 5000);
    } else {
      setFormMessage({
        type: "error",
        text: "Please fix the errors above and try again.",
      });
      setTimeout(() => setFormMessage(null), 5000);
    }
  };

  // ----------------- HANDLE LOGIN -----------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setFormMessage({
          type: "error",
          text: "No registered user found. Please register first.",
        });
        setTimeout(() => setFormMessage(null), 5000);
        return;
      }

      const user = JSON.parse(storedUser);
      if (
        (loginForm.user === user.name || loginForm.user === user.email) &&
        loginForm.password === user.password
      ) {
        setFormMessage({
          type: "success",
          text: `Login Successful! Welcome ${user.name}`,
        });
        console.log("Redirect to dashboard...");

        setTimeout(() => setFormMessage(null), 5000);
      } else {
        setFormMessage({
          type: "error",
          text: "Invalid username/email or password!",
        });
        setTimeout(() => setFormMessage(null), 5000);
      }
    } else {
      setFormMessage({
        type: "error",
        text: "Please fix the errors above and try again.",
      });
      setTimeout(() => setFormMessage(null), 5000);
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

  return (
    <main className="scroll-smooth snap-y snap-mandatory min-h-screen pt-[72px] relative overflow-x-hidden text-white bg-[radial-gradient(circle_at_top_left,#1e3a8a33,transparent_40%),radial-gradient(circle_at_bottom_right,#7c3aed33,transparent_40%),linear-gradient(to_bottom,#020617,#000)]">
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
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            {["about", "ecosystem", "products", "access"].map((section) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className="hover:text-blue-400 transition"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {/* Simple hamburger icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu + backdrop */}
        {mobileMenuOpen && (
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/40 md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* MOBILE SLIDING MENU */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur p-6 flex flex-col gap-6 z-50 md:hidden"
            >
              {["about", "ecosystem", "products", "access"].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    handleNavClick(section);
                    setMobileMenuOpen(false);
                  }}
                  className="text-white text-lg font-semibold hover:text-blue-400 transition"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </header>

      {/* HERO */}
      <section className="min-h-[calc(100vh-72px)] snap-start px-6 md:px-16 py-12 md:py-0 flex items-center relative">
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] hero-orb pointer-events-none" />
        {/* Hero background colorful shapes */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute top-[50px] right-[-150px] w-[300px] h-[300px] bg-yellow-400/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-120px] left-[50px] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[50px] right-[100px] w-[200px] h-[200px] bg-green-400/25 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />

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
              transition={{ duration: 1 }}
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
          <h3 className="text-3xl font-bold mb-12">The CompanyXYZ Ecosystem</h3>

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
                  className="mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg text-white"
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
                      setLoginForm({ ...loginForm, password: e.target.value })
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
                  <a href="#" className="text-blue-400 underline">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg text-white"
                >
                  Login
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
          className="fixed w-3 h-3 rounded-full z-[9999]"
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
  );
}
