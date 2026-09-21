import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Role = "seeker" | "caregiver" | null;

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim());

  const canCreateAccount =
    name.trim().length >= 2 &&
    isValidEmail &&
    password.length >= 6;

  const handleCreateAccount = () => {
    if (!canCreateAccount) return;

    if (role === "caregiver") {
      navigate("/signup/caregiver");
    } else {
      navigate("/careRequirement");
    }
  };

  const particles = Array.from({ length: 18 });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b09] text-[#f4efe7]">

      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Warm central glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a66b]/[0.055] blur-[150px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Sage glow */}
        <motion.div
          className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#9baa91]/[0.045] blur-[130px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft champagne glow */}
        <motion.div
          className="absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-[#d8c19d]/[0.035] blur-[140px]"
          animate={{
            x: [0, -70, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {particles.map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#d8c19d]/30"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.08, 0.5, 0.08],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              delay: index * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_8%,rgba(0,0,0,0.78)_100%)]" />
      </div>

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex items-center justify-between px-5 py-6 sm:px-10"
      >

        {/* Logo */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 rounded-full border border-[#d8c19d]/10 bg-white/[0.025] px-4 py-2.5 backdrop-blur-xl transition-all duration-300 hover:border-[#d8c19d]/25 hover:bg-[#d8c19d]/[0.035]"
        >
          <span className="h-2 w-2 rounded-full bg-[#d8c19d] shadow-[0_0_12px_rgba(216,193,157,0.65)] transition group-hover:scale-125" />

          <span className="text-xs font-semibold tracking-[0.18em] text-[#f4efe7]/80">
            CARE-CONNECT
          </span>
        </button>

        {/* Login */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-xl border border-[#d8c19d]/10 bg-white/[0.025] px-5 py-2.5 text-sm text-[#f4efe7]/65 backdrop-blur-xl transition-all duration-300 hover:border-[#d8c19d]/25 hover:bg-[#d8c19d]/[0.035] hover:text-[#f4efe7]"
        >
          Already have an account?

          <span className="ml-2 text-[#d8c19d]">
            Login →
          </span>
        </button>

      </motion.header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-6xl items-center justify-center px-5 pb-16">

        <AnimatePresence mode="wait">

          {/* =================================================
              ROLE SELECTION
          ================================================= */}

          {!role && (
            <motion.div
              key="role-selection"
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -30,
                scale: 0.96,
              }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="w-full"
            >

              {/* =================================================
                  HEADING
              ================================================== */}

              <div className="mx-auto mb-12 max-w-3xl text-center">

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                  }}
                  className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8c19d]/15 bg-[#d8c19d]/[0.035] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#d8c19d]/85 backdrop-blur-xl"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8c19d] shadow-[0_0_10px_rgba(216,193,157,0.7)]" />

                  CREATE ACCOUNT
                </motion.div>

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                    duration: 0.7,
                  }}
                  className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl"
                >
                  Join{" "}

                  <span className="bg-gradient-to-r from-[#f4efe7] via-[#d8c19d] to-[#aab6a2] bg-clip-text text-transparent">
                    Care-Connect.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.45,
                    duration: 0.7,
                  }}
                  className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#f4efe7]/45 sm:text-lg"
                >
                  Choose how you want to use Care-Connect.
                  Whether you need care or provide it, you're in the right place.
                </motion.p>

              </div>

              {/* =================================================
                  ROLE CARDS
              ================================================== */}

              <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">

                {/* =================================================
                    CARE SEEKER
                ================================================== */}

                <motion.button
                  type="button"
                  onClick={() => navigate("/signup/seeker")}
                  initial={{
                    opacity: 0,
                    x: -70,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.55,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-[#d8c19d]/10 bg-[#d8c19d]/[0.025] p-8 text-left backdrop-blur-2xl transition-all duration-500 hover:border-[#d8c19d]/30 hover:bg-[#d8c19d]/[0.045] hover:shadow-[0_25px_80px_rgba(201,166,107,0.10)] sm:p-10"
                >

                  {/* Glow */}

                  <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#c9a66b]/[0.08] blur-[70px] transition-all duration-700 group-hover:bg-[#c9a66b]/[0.16]" />

                  <div className="relative">

                    {/* Icon */}

                    <motion.div
                      whileHover={{
                        rotate: [0, -8, 8, 0],
                        scale: 1.1,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8c19d]/20 bg-[#d8c19d]/[0.055] text-3xl shadow-[0_0_35px_rgba(201,166,107,0.08)]"
                    >
                      👤
                    </motion.div>

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#d8c19d]">
                      I NEED CARE
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight text-[#f4efe7]">
                      Care Seeker
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-[#f4efe7]/45">
                      Find trusted caregivers based on your location,
                      care requirements, availability, experience and cost.
                    </p>

                    {/* Benefits */}

                    <div className="mt-7 space-y-2.5">

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d8c19d]/10 text-xs text-[#d8c19d]">
                          ✓
                        </span>
                        Find trusted caregivers
                      </div>

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d8c19d]/10 text-xs text-[#d8c19d]">
                          ✓
                        </span>
                        Compare availability & cost
                      </div>

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d8c19d]/10 text-xs text-[#d8c19d]">
                          ✓
                        </span>
                        Book with confidence
                      </div>

                    </div>

                    {/* Continue */}

                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#d8c19d] transition-all duration-300 group-hover:gap-4">
                      Continue as Care Seeker

                      <motion.span
                        animate={{
                          x: [0, 4, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className="text-lg"
                      >
                        →
                      </motion.span>
                    </div>

                  </div>

                </motion.button>

                {/* =================================================
                    CAREGIVER
                ================================================== */}

                <motion.button
                  type="button"
                  onClick={() => navigate("/signup/caregiver")}
                  initial={{
                    opacity: 0,
                    x: 70,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.55,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-[#aab6a2]/10 bg-[#aab6a2]/[0.025] p-8 text-left backdrop-blur-2xl transition-all duration-500 hover:border-[#aab6a2]/30 hover:bg-[#aab6a2]/[0.045] hover:shadow-[0_25px_80px_rgba(170,182,162,0.10)] sm:p-10"
                >

                  {/* Glow */}

                  <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#9baa91]/[0.07] blur-[70px] transition-all duration-700 group-hover:bg-[#9baa91]/[0.15]" />

                  <div className="relative">

                    {/* Icon */}

                    <motion.div
                      whileHover={{
                        rotate: [0, 8, -8, 0],
                        scale: 1.1,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#aab6a2]/20 bg-[#aab6a2]/[0.055] text-3xl shadow-[0_0_35px_rgba(170,182,162,0.08)]"
                    >
                      🩺
                    </motion.div>

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#aab6a2]">
                      I PROVIDE CARE
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight text-[#f4efe7]">
                      Caregiver
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-[#f4efe7]/45">
                      Offer your caregiving services, manage your availability,
                      set your pricing and connect with people who need care.
                    </p>

                    {/* Benefits */}

                    <div className="mt-7 space-y-2.5">

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#aab6a2]/10 text-xs text-[#aab6a2]">
                          ✓
                        </span>
                        Create your professional profile
                      </div>

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#aab6a2]/10 text-xs text-[#aab6a2]">
                          ✓
                        </span>
                        Manage your schedule
                      </div>

                      <div className="flex items-center gap-3 text-sm text-[#f4efe7]/55">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#aab6a2]/10 text-xs text-[#aab6a2]">
                          ✓
                        </span>
                        Grow your caregiving work
                      </div>

                    </div>

                    {/* Continue */}

                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#aab6a2] transition-all duration-300 group-hover:gap-4">
                      Continue as Caregiver

                      <motion.span
                        animate={{
                          x: [0, 4, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className="text-lg"
                      >
                        →
                      </motion.span>
                    </div>

                  </div>

                </motion.button>

              </div>

            </motion.div>
          )}

          {/* =================================================
              SELECTED ROLE
          ================================================== */}

          {role && (
            <motion.div
              key="selected-role"
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="w-full max-w-xl"
            >

              {/* Role Icon */}

              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 180,
                  damping: 12,
                }}
                className={`mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border text-4xl ${
                  role === "seeker"
                    ? "border-[#d8c19d]/30 bg-[#d8c19d]/[0.08] shadow-[0_0_60px_rgba(201,166,107,0.18)]"
                    : "border-[#aab6a2]/30 bg-[#aab6a2]/[0.08] shadow-[0_0_60px_rgba(170,182,162,0.16)]"
                }`}
              >
                {role === "seeker" ? "👤" : "🩺"}
              </motion.div>

              {/* Heading */}

              <div className="mb-8 text-center">

                <p
                  className={`text-xs font-medium uppercase tracking-[0.2em] ${
                    role === "seeker"
                      ? "text-[#d8c19d]"
                      : "text-[#aab6a2]"
                  }`}
                >
                  {role === "seeker"
                    ? "CARE SEEKER"
                    : "CAREGIVER"}
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  You're joining as{" "}

                  <span className="bg-gradient-to-r from-[#f4efe7] via-[#d8c19d] to-[#aab6a2] bg-clip-text text-transparent">
                    {role === "seeker"
                      ? "Care Seeker"
                      : "Caregiver"}
                  </span>
                </h1>

                <p className="mt-4 text-sm leading-7 text-[#f4efe7]/45">
                  {role === "seeker"
                    ? "Let's create your account so you can find the right care."
                    : "Let's create your professional profile so people can discover your services."}
                </p>

              </div>

              {/* =================================================
                  FORM
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                }}
                className="rounded-[2rem] border border-[#d8c19d]/10 bg-white/[0.025] p-7 shadow-2xl backdrop-blur-2xl sm:p-9"
              >

                <div className="space-y-5">

                  {/* Name */}

                  <div>
                    <label className="mb-2 block text-sm text-[#f4efe7]/70">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35 focus:bg-[#d8c19d]/[0.025]"
                    />
                  </div>

                  {/* Email */}

                  <div>
                    <label className="mb-2 block text-sm text-[#f4efe7]/70">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35 focus:bg-[#d8c19d]/[0.025]"
                    />
                  </div>

                  {/* Password */}

                  <div>
                    <label className="mb-2 block text-sm text-[#f4efe7]/70">
                      Password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35 focus:bg-[#d8c19d]/[0.025]"
                    />

                    <p className="mt-2 text-[10px] text-[#f4efe7]/25">
                      Password must be at least 6 characters.
                    </p>
                  </div>

                  {/* Create Account */}

                  <motion.button
  type="button"
  onClick={handleCreateAccount}
  disabled={!canCreateAccount}
  whileHover={
    canCreateAccount
      ? {
          scale: 1.02,
          boxShadow: "0 15px 45px rgba(170,181,158,0.25)",
        }
      : undefined
  }
  whileTap={canCreateAccount ? { scale: 0.97 } : undefined}
  className={`group relative w-full overflow-hidden rounded-xl py-4 font-medium transition-all ${
    canCreateAccount
      ? "bg-[#cdbb9c] text-[#15140f] shadow-[0_10px_35px_rgba(205,187,156,0.15)]"
      : "cursor-not-allowed bg-white/[0.08] text-[#f4efe7]/25"
  }`}
>

                    <span className="relative z-10">
                      Create{" "}
                      {role === "seeker"
                        ? "Care Seeker"
                        : "Caregiver"}{" "}
                      Account →
                    </span>

                    {/* Animated shine — only when the form is valid */}
                    {canCreateAccount && (
                      <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        }}
                      />
                    )}

                  </motion.button>

                </div>

              </motion.div>

              {/* Change Role */}

              <motion.button
                type="button"
                onClick={() => setRole(null)}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.7,
                }}
                className="mx-auto mt-6 block text-sm text-[#f4efe7]/35 transition hover:text-[#d8c19d]"
              >
                ← Choose a different role
              </motion.button>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </main>
  );
}

export default Signup;