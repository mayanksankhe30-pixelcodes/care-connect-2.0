import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SeekerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    careFor: "",
    requirement: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.location ||
      !form.careFor
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    navigate("/careRequirement", {
      state: {
        seeker: form,
      },
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b09] text-[#f4efe7]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <motion.div
          className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a66b]/[0.05] blur-[150px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#aab6a2]/[0.045] blur-[130px]"
          animate={{
            x: [0, 70, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#d8c19d]/[0.035] blur-[130px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.header
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-20 flex items-center justify-between px-5 py-6 sm:px-10"
      >
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="group flex items-center gap-3 rounded-full border border-[#d8c19d]/10 bg-white/[0.025] px-4 py-2.5 backdrop-blur-xl transition hover:border-[#d8c19d]/25"
        >
          <span className="h-2 w-2 rounded-full bg-[#d8c19d] shadow-[0_0_12px_rgba(216,193,157,0.65)]" />

          <span className="text-xs font-semibold tracking-[0.18em] text-[#f4efe7]/80">
            CARE-CONNECT
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-[#f4efe7]/50 transition hover:text-[#d8c19d]"
        >
          Already have an account?{" "}
          <span className="text-[#d8c19d]">
            Login →
          </span>
        </button>
      </motion.header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-8">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="mb-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8c19d]/15 bg-[#d8c19d]/[0.035] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#d8c19d]/85"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8c19d]" />
            CARE SEEKER
          </motion.div>

          <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Let's get to know you.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#f4efe7]/45 sm:text-base">
            Create your Care Seeker profile so we can help you find
            the right caregiver for your needs.
          </p>
        </motion.div>

        {/* =================================================
            FORM CARD
        ================================================== */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.25,
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="rounded-[2rem] border border-[#d8c19d]/10 bg-white/[0.025] p-6 shadow-2xl backdrop-blur-2xl sm:p-9"
        >

          {/* =================================================
              PERSONAL DETAILS
          ================================================== */}

          <div className="mb-8">

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8c19d]/15 bg-[#d8c19d]/[0.05] text-lg">
                👤
              </div>

              <div>
                <h2 className="font-semibold">
                  Personal details
                </h2>

                <p className="text-xs text-[#f4efe7]/35">
                  Tell us who you are
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Name */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-[#f4efe7]/70">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm text-[#f4efe7]/70">
                  Email *
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm text-[#f4efe7]/70">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
                />
              </div>

              {/* Password */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-[#f4efe7]/70">
                  Password *
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
                />
              </div>

              {/* Location */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-[#f4efe7]/70">
                  City / Location *
                </label>

                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    handleChange("location", e.target.value)
                  }
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
                />
              </div>

            </div>
          </div>

          {/* Divider */}

          <div className="my-8 h-px bg-white/[0.06]" />

          {/* =================================================
              CARE DETAILS
          ================================================== */}

          <div>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#aab6a2]/15 bg-[#aab6a2]/[0.05] text-lg">
                ♡
              </div>

              <div>
                <h2 className="font-semibold">
                  Care details
                </h2>

                <p className="text-xs text-[#f4efe7]/35">
                  Help us understand your requirement
                </p>
              </div>
            </div>

            {/* Who needs care */}

            <div>
              <label className="mb-2 block text-sm text-[#f4efe7]/70">
                Who needs care? *
              </label>

              <select
                value={form.careFor}
                onChange={(e) =>
                  handleChange("careFor", e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-[#d8c19d]/10 bg-[#12120f] px-4 py-3.5 text-[#f4efe7] outline-none transition focus:border-[#d8c19d]/35"
              >
                <option value="" className="bg-[#12120f]">
                  Select an option
                </option>

                <option value="Myself" className="bg-[#12120f]">
                  Myself
                </option>

                <option value="Parent" className="bg-[#12120f]">
                  Parent
                </option>

                <option value="Child" className="bg-[#12120f]">
                  Child
                </option>

                <option value="Spouse" className="bg-[#12120f]">
                  Spouse
                </option>

                <option value="Grandparent" className="bg-[#12120f]">
                  Grandparent
                </option>

                <option value="Other family member" className="bg-[#12120f]">
                  Other family member
                </option>
              </select>
            </div>

            {/* Requirement */}

            <div className="mt-5">
              <label className="mb-2 block text-sm text-[#f4efe7]/70">
                Tell us about the care needed
                <span className="ml-2 text-xs text-[#f4efe7]/30">
                  Optional
                </span>
              </label>

              <textarea
                value={form.requirement}
                onChange={(e) =>
                  handleChange("requirement", e.target.value)
                }
                rows={4}
                placeholder="For example: elderly care, post-surgery support, daily assistance..."
                className="w-full resize-none rounded-xl border border-[#d8c19d]/10 bg-black/20 px-4 py-3.5 text-[#f4efe7] outline-none transition placeholder:text-[#f4efe7]/20 focus:border-[#d8c19d]/35"
              />
            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* =================================================
              SUBMIT
          ================================================== */}

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.015,
              boxShadow:
                "0 18px 45px rgba(201,166,107,0.18)",
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="group relative mt-8 w-full overflow-hidden rounded-xl bg-[#c9a66b] py-4 font-medium text-[#17130d]"
          >
            <span className="relative z-10">
              Continue to Care Requirements →
            </span>

            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            />
          </motion.button>

          <p className="mt-5 text-center text-xs leading-6 text-[#f4efe7]/25">
            Your information will be used to personalize your
            Care-Connect experience.
          </p>

        </motion.form>

        {/* Back */}

        <motion.button
          type="button"
          onClick={() => navigate("/signup")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-6 block text-sm text-[#f4efe7]/35 transition hover:text-[#d8c19d]"
        >
          ← Change account type
        </motion.button>

      </div>
    </main>
  );
}

export default SeekerSignup;