import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  experience: string;
  qualifications: string;
  price: string;
  bio: string;
  startTime: string;
  endTime: string;
  password: string;
  confirmPassword: string;
};

const steps = [
  {
    number: 1,
    label: "About You",
    title: "Let's get to know you.",
  },
  {
    number: 2,
    label: "Expertise",
    title: "Tell us what you do best.",
  },
  {
    number: 3,
    label: "Services",
    title: "What can families book you for?",
  },
  {
    number: 4,
    label: "Availability",
    title: "Set your working schedule.",
  },
  {
    number: 5,
    label: "Preview",
    title: "Your profile is almost ready.",
  },
];

const expertiseOptions = [
  {
    title: "Elderly Care",
    description: "Daily support & companionship",
    icon: "♡",
  },
  {
    title: "Patient Care",
    description: "Personal & recovery support",
    icon: "✚",
  },
  {
    title: "Post-Surgery Care",
    description: "Recovery & rehabilitation support",
    icon: "⌁",
  },
  {
    title: "Home Nursing",
    description: "Professional home assistance",
    icon: "⌂",
  },
  {
    title: "Child Care",
    description: "Safe & attentive childcare",
    icon: "○",
  },
  {
    title: "Disability Care",
    description: "Personalized daily assistance",
    icon: "∞",
  },
];

const serviceOptions = [
  "Daily assistance",
  "Medication reminders",
  "Mobility assistance",
  "Personal care",
  "Meal preparation",
  "Companionship",
  "Post-surgery support",
  "Night care",
  "Hospital support",
  "Basic nursing assistance",
];

const languageOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
];

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function CaregiverSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "",
    qualifications: "",
    price: "",
    bio: "",
    startTime: "09:00",
    endTime: "18:00",
    password: "",
    confirmPassword: "",
  });

  const [expertise, setExpertise] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);

  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const currentStep = steps[step - 1];

  const profileCompletion = useMemo(() => {
    let completedFields = 0;
    const totalFields = 9;

    if (form.name) completedFields++;
    if (form.email) completedFields++;
    if (form.phone) completedFields++;
    if (form.city) completedFields++;
    if (expertise) completedFields++;
    if (form.experience) completedFields++;
    if (form.qualifications) completedFields++;
    if (services.length > 0) completedFields++;
    if (days.length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }, [form, expertise, services, days]);

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handlePhoto = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Store the image as a Data URL so it remains usable
    // after navigation and page refreshes.
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const toggleService = (service: string) => {
    setServices((previous) =>
      previous.includes(service)
        ? previous.filter((item) => item !== service)
        : [...previous, service]
    );

    setError("");
  };

  const toggleLanguage = (language: string) => {
    setLanguages((previous) =>
      previous.includes(language)
        ? previous.filter((item) => item !== language)
        : [...previous, language]
    );
  };

  const toggleDay = (day: string) => {
    setDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );

    setError("");
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !form.name ||
        !form.email ||
        !form.phone ||
        !form.city
      ) {
        setError("Please complete all required details.");
        return false;
      }

      if (form.phone.replace(/\D/g, "").length < 10) {
        setError("Please enter a valid phone number.");
        return false;
      }

      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }

    if (step === 2) {
      if (!expertise) {
        setError("Please select your primary area of expertise.");
        return false;
      }

      if (!form.experience) {
        setError("Please enter your years of experience.");
        return false;
      }
    }

    if (step === 3) {
      if (services.length === 0) {
        setError("Please select at least one service.");
        return false;
      }

      if (!form.price || Number(form.price) <= 0) {
        setError("Please enter a valid price per slot.");
        return false;
      }
    }

    if (step === 4) {
      if (days.length === 0) {
        setError("Please select at least one available day.");
        return false;
      }

      if (form.startTime >= form.endTime) {
        setError("Your end time must be later than your start time.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (step < 5) {
      setStep((previous) => (previous + 1) as Step);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousStep = () => {
    setError("");

    if (step > 1) {
      setStep((previous) => (previous - 1) as Step);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

 const completeRegistration = async (event: FormEvent) => {
   event.preventDefault();

   if (!validateStep()) return;

   setError("");

   // The caregiver creates their own password during signup.
   const password = form.password;

   try {
     // 1. Register caregiver account in the backend.
     const registerResponse = await fetch(
       "https://care-connect-2-0-111.onrender.com/api/auth/register",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           name: form.name.trim(),
           email: form.email.trim(),
           phone: form.phone.trim(),
           password,
           role: "caregiver",
         }),
       }
     );

     const registerData = await registerResponse.json().catch(() => ({}));

     if (!registerResponse.ok && registerResponse.status !== 409) {
       throw new Error(
         registerData.message || "Caregiver account registration failed."
       );
     }

     // 2. Login and obtain a fresh JWT.
     const loginResponse = await fetch(
       "https://care-connect-2-0-111.onrender.com/api/auth/login",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           email: form.email.trim(),
           password,
         }),
       }
     );

     const loginData = await loginResponse.json().catch(() => ({}));

     if (!loginResponse.ok) {
       throw new Error(
         loginData.message ||
           "Caregiver account was created, but login failed."
       );
     }

     const token =
       loginData.token ||
       loginData.accessToken ||
       loginData.data?.token ||
       loginData.data?.accessToken;

     if (!token) {
       throw new Error(
         "Login succeeded, but the backend did not return a JWT token."
       );
     }

     localStorage.setItem("careconnect_token", token);
     localStorage.setItem("token", token);

     // 3. Create the caregiver profile in MySQL.
     const caregiverResponse = await fetch(
       "https://care-connect-2-0-111.onrender.com/api/caregivers",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
           name: form.name.trim(),
           city: form.city.trim(),
           experience: Number(form.experience),
           qualification: form.qualifications.trim(),
           price: Number(form.price),
           bio: form.bio.trim(),
           start_time: `${form.startTime}:00`,
           end_time: `${form.endTime}:00`,
           photo_url: photo,
         }),
       }
     );

     const caregiverData = await caregiverResponse.json().catch(() => ({}));

     if (!caregiverResponse.ok) {
       throw new Error(
         caregiverData.message || "Caregiver profile creation failed."
       );
     }

     const caregiverId =
       caregiverData.caregiver?.id ??
       caregiverData.data?.caregiver?.id ??
       caregiverData.data?.id ??
       caregiverData.id ??
       caregiverData.caregiver_id;

     if (!caregiverId) {
       throw new Error(
         "Caregiver profile was created, but no caregiver ID was returned by the backend."
       );
     }

     // 4. Save services, expertise, languages and working days.
     const detailsResponse = await fetch(
       `https://care-connect-2-0-111.onrender.com/api/caregivers/${caregiverId}/details`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
           services,
           expertise: expertise ? [expertise] : [],
           languages,
           working_days: days,
         }),
       }
     );

     const detailsData = await detailsResponse.json().catch(() => ({}));

     if (!detailsResponse.ok) {
       throw new Error(
         detailsData.message || "Caregiver details could not be saved."
       );
     }

     // 5. Keep localStorage data so the existing frontend dashboard
     // continues to work without breaking the current UI.
     const caregiver = {
       id: caregiverId,
       name: form.name.trim(),
       email: form.email.trim(),
       phone: form.phone.trim(),
       city: form.city.trim(),
       experience: form.experience,
       qualifications: form.qualifications.trim(),
       price: form.price,
       bio: form.bio.trim(),
       startTime: form.startTime,
       endTime: form.endTime,
       expertise,
       services,
       languages,
       days,
       photo,
       rating: 0,
       reviews: 0,
       verified: false,
       availability: "Available for bookings",
       createdAt: new Date().toISOString(),
     };

     const storageKey = "careconnect_caregivers";
     let caregivers: typeof caregiver[] = [];

     try {
       const saved = localStorage.getItem(storageKey);

       if (saved) {
         const parsed = JSON.parse(saved);

         if (Array.isArray(parsed)) {
           caregivers = parsed;
         }
       }
     } catch {
       caregivers = [];
     }

     // Remove an older local copy with the same email.
     caregivers = caregivers.filter(
       (item) =>
         String(item.email || "").toLowerCase() !==
         form.email.trim().toLowerCase()
     );

     caregivers.push(caregiver);

     localStorage.setItem(storageKey, JSON.stringify(caregivers));
     localStorage.setItem(
       "careconnect_current_caregiver",
       JSON.stringify(caregiver)
     );

     setCompleted(true);
   } catch (error) {
     console.error("Caregiver registration error:", error);

     setError(
       error instanceof Error
         ? error.message
         : "Something went wrong during caregiver registration."
     );
   }
 };

  const inputClass =
    "w-full rounded-2xl border border-[#e7dcc8]/10 bg-[#11110f]/80 px-5 py-4 text-[#f4efe7] outline-none transition-all duration-300 placeholder:text-[#f4efe7]/20 focus:border-[#c9b28c]/40 focus:bg-[#151511] focus:shadow-[0_0_0_4px_rgba(201,178,140,0.04)]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080807] text-[#f4efe7]">

      {/* =====================================================
          ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <motion.div
          className="absolute left-[15%] top-[15%] h-[520px] w-[520px] rounded-full bg-[#a9b39d]/[0.035] blur-[150px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-[5%] top-[35%] h-[600px] w-[600px] rounded-full bg-[#c9b28c]/[0.035] blur-[160px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -70, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {Array.from({ length: 18 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-[2px] w-[2px] rounded-full bg-[#d8c8aa]/40"
            style={{
              left: `${(index * 23) % 100}%`,
              top: `${(index * 37) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.05, 0.45, 0.05],
            }}
            transition={{
              duration: 4 + (index % 4),
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.72)_100%)]" />

      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative z-20 flex items-center justify-between border-b border-white/[0.05] px-5 py-5 sm:px-10"
      >

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="group flex items-center gap-3"
        >
          <span className="h-2 w-2 rounded-full bg-[#b9c3ae] shadow-[0_0_12px_rgba(185,195,174,0.6)] transition group-hover:scale-125" />

          <span className="text-xs font-semibold tracking-[0.2em] text-white/70">
            CARE-CONNECT
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-white/35 transition hover:text-[#d7c5a4]"
        >
          Already have an account?

          <span className="ml-2 text-[#cdbb9c]">
            Login →
          </span>
        </button>

      </motion.header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-8 sm:pt-12">

        {/* =================================================
            TOP INTRO
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#aab59e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#aab59e]" />
                Caregiver onboarding
              </div>

              <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Build your place in the
                <span className="ml-2 text-[#cdbb9c]">
                  care network.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                Create a professional profile that helps families
                understand your experience, services and availability.
              </p>

            </div>

            {/* Completion */}

            <div className="shrink-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 backdrop-blur-xl">

              <div className="mb-2 flex items-center justify-between gap-8">

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Profile readiness
                </span>

                <span className="text-sm text-[#cdbb9c]">
                  {profileCompletion}%
                </span>

              </div>

              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/[0.07]">

                <motion.div
                  className="h-full rounded-full bg-[#aab59e]"
                  animate={{
                    width: `${profileCompletion}%`,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                />

              </div>

            </div>

          </div>

        </motion.div>

        {/* =================================================
            PROGRESS RAIL
        ================================================== */}

        <div className="mb-8 overflow-x-auto pb-2">

          <div className="flex min-w-[650px] items-center">

            {steps.map((item, index) => {

              const active = item.number === step;
              const finished = item.number < step;

              return (
                <div
                  key={item.number}
                  className="flex flex-1 items-center"
                >

                  <button
                    type="button"
                    disabled={item.number > step}
                    onClick={() => {
                      if (item.number < step) {
                        setStep(item.number as Step);
                      }
                    }}
                    className="group flex items-center gap-3 text-left"
                  >

                    <motion.div
                      animate={{
                        scale: active ? 1.08 : 1,
                      }}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all ${
                        finished
                          ? "border-[#aab59e]/50 bg-[#aab59e]/10 text-[#aab59e]"
                          : active
                            ? "border-[#d4c19e]/60 bg-[#d4c19e]/10 text-[#d4c19e] shadow-[0_0_25px_rgba(212,193,158,0.08)]"
                            : "border-white/10 bg-white/[0.02] text-white/25"
                      }`}
                    >
                      {finished ? "✓" : `0${item.number}`}
                    </motion.div>

                    <div className="hidden sm:block">

                      <p
                        className={`text-[10px] uppercase tracking-[0.16em] ${
                          active
                            ? "text-[#d4c19e]"
                            : finished
                              ? "text-[#aab59e]"
                              : "text-white/25"
                        }`}
                      >
                        Step {item.number}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          active
                            ? "text-white/80"
                            : "text-white/30"
                        }`}
                      >
                        {item.label}
                      </p>

                    </div>

                  </button>

                  {index < steps.length - 1 && (
                    <div className="mx-4 h-px flex-1 bg-white/[0.07]">

                      <motion.div
                        className="h-full bg-[#aab59e]/50"
                        animate={{
                          width: item.number < step
                            ? "100%"
                            : "0%",
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      />

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

        {/* =================================================
            CONTENT CARD
        ================================================== */}

        <motion.div
          layout
          className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#10100e]/80 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >

          {/* Card heading */}

          <div className="border-b border-white/[0.06] px-6 py-6 sm:px-10 sm:py-7">

            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#aab59e]">
              0{step} / 05
            </p>

            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              {currentStep.title}
            </h2>

          </div>

          <form
            onSubmit={completeRegistration}
            className="p-6 sm:p-10"
          >

            <AnimatePresence mode="wait">

              {/* =================================================
                  STEP 1
              ================================================== */}

              {step === 1 && (
                <motion.div
                  key="step-one"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

                    {/* Photo */}

                    <div>

                      <p className="mb-3 text-xs text-white/50">
                        Profile photo
                      </p>

                      <label className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-white/10 bg-white/[0.025] transition hover:border-[#cdbb9c]/30">

                        {photo ? (
                          <img
                            src={photo}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">

                            <motion.div
                              whileHover={{
                                scale: 1.08,
                                rotate: -3,
                              }}
                              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#cdbb9c]/15 bg-[#cdbb9c]/[0.05] text-2xl text-[#cdbb9c]"
                            >
                              +
                            </motion.div>

                            <p className="text-xs text-white/45">
                              Add your photo
                            </p>

                            <p className="mt-1 text-[10px] text-white/20">
                              JPG or PNG
                            </p>

                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhoto}
                          className="hidden"
                        />

                      </label>

                    </div>

                    {/* Fields */}

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div className="sm:col-span-2">

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          Full name *
                        </label>

                        <input
                          value={form.name}
                          onChange={(e) =>
                            updateField("name", e.target.value)
                          }
                          placeholder="Your full name"
                          className={inputClass}
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          Email *
                        </label>

                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            updateField("email", e.target.value)
                          }
                          placeholder="you@example.com"
                          className={inputClass}
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          Phone *
                        </label>

                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            updateField("phone", e.target.value)
                          }
                          placeholder="10-digit mobile number"
                          className={inputClass}
                        />

                      </div>

                      <div className="sm:col-span-2">

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          City / Location *
                        </label>

                        <input
                          value={form.city}
                          onChange={(e) =>
                            updateField("city", e.target.value)
                          }
                          placeholder="e.g. Nashik, Maharashtra"
                          className={inputClass}
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          Password *
                        </label>

                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
                          placeholder="Create a password"
                          className={inputClass}
                        />

                        <p className="mt-2 text-[10px] text-white/25">
                          Minimum 8 characters
                        </p>

                      </div>

                      <div>

                        <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                          Confirm Password *
                        </label>

                        <input
                          type="password"
                          value={form.confirmPassword}
                          onChange={(e) =>
                            updateField("confirmPassword", e.target.value)
                          }
                          placeholder="Re-enter your password"
                          className={inputClass}
                        />

                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

              {/* =================================================
                  STEP 2
              ================================================== */}

              {step === 2 && (
                <motion.div
                  key="step-two"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  <p className="mb-5 text-sm text-white/35">
                    Choose your primary area of expertise.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {expertiseOptions.map((option) => {

                      const selected =
                        expertise === option.title;

                      return (
                        <motion.button
                          key={option.title}
                          type="button"
                          whileHover={{
                            y: -5,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() => {
                            setExpertise(option.title);
                            setError("");
                          }}
                          className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                            selected
                              ? "border-[#cdbb9c]/45 bg-[#cdbb9c]/[0.08] shadow-[0_15px_50px_rgba(205,187,156,0.06)]"
                              : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15]"
                          }`}
                        >

                          {selected && (
                            <motion.div
                              layoutId="selected-expertise"
                              className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#aab59e] text-[10px] text-[#10120e]"
                            >
                              ✓
                            </motion.div>
                          )}

                          <div className="mb-5 text-2xl text-[#cdbb9c]">
                            {option.icon}
                          </div>

                          <h3 className="text-sm font-medium">
                            {option.title}
                          </h3>

                          <p className="mt-2 text-xs leading-5 text-white/30">
                            {option.description}
                          </p>

                        </motion.button>
                      );
                    })}

                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                        Experience *
                      </label>

                      <div className="relative">

                        <input
                          type="number"
                          min="0"
                          value={form.experience}
                          onChange={(e) =>
                            updateField(
                              "experience",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 5"
                          className={inputClass}
                        />

                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-white/25">
                          years
                        </span>

                      </div>

                    </div>

                    <div>

                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                        Qualifications
                      </label>

                      <input
                        value={form.qualifications}
                        onChange={(e) =>
                          updateField(
                            "qualifications",
                            e.target.value
                          )
                        }
                        placeholder="e.g. GNM, ANM, Caregiving Certificate"
                        className={inputClass}
                      />

                    </div>

                  </div>

                  <div className="mt-8">

                    <p className="mb-4 text-xs uppercase tracking-[0.12em] text-white/45">
                      Languages spoken
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {languageOptions.map((language) => {

                        const selected =
                          languages.includes(language);

                        return (
                          <motion.button
                            key={language}
                            type="button"
                            whileTap={{
                              scale: 0.95,
                            }}
                            onClick={() =>
                              toggleLanguage(language)
                            }
                            className={`rounded-full border px-4 py-2.5 text-xs transition-all ${
                              selected
                                ? "border-[#aab59e]/40 bg-[#aab59e]/10 text-[#cbd5c0]"
                                : "border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/60"
                            }`}
                          >
                            {selected && "✓ "}
                            {language}
                          </motion.button>
                        );
                      })}

                    </div>

                  </div>

                </motion.div>
              )}

              {/* =================================================
                  STEP 3
              ================================================== */}

              {step === 3 && (
                <motion.div
                  key="step-three"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  <p className="mb-6 text-sm text-white/35">
                    Select everything families can book you for.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {serviceOptions.map((service) => {

                      const selected =
                        services.includes(service);

                      return (
                        <motion.button
                          key={service}
                          type="button"
                          whileHover={{
                            x: 3,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() =>
                            toggleService(service)
                          }
                          className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left text-sm transition-all ${
                            selected
                              ? "border-[#aab59e]/35 bg-[#aab59e]/[0.07] text-[#d5ddcd]"
                              : "border-white/[0.07] bg-white/[0.015] text-white/45 hover:border-white/15"
                          }`}
                        >

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] ${
                              selected
                                ? "border-[#aab59e]/50 bg-[#aab59e] text-[#10120e]"
                                : "border-white/15"
                            }`}
                          >
                            {selected ? "✓" : ""}
                          </span>

                          {service}

                        </motion.button>
                      );
                    })}

                  </div>

                  <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">

                    <div>

                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                        About your care
                      </label>

                      <textarea
                        value={form.bio}
                        onChange={(e) =>
                          updateField(
                            "bio",
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder="Tell families about your experience, approach to caregiving and what they can expect from you..."
                        className={`${inputClass} resize-none`}
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-white/45">
                        Price per slot *
                      </label>

                      <div className="relative">

                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/35">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={form.price}
                          onChange={(e) =>
                            updateField(
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="700"
                          className={`${inputClass} pl-10`}
                        />

                      </div>

                      <p className="mt-3 text-xs leading-5 text-white/25">
                        This is the amount families will see when
                        booking your care slot.
                      </p>

                    </div>

                  </div>

                </motion.div>
              )}

              {/* =================================================
                  STEP 4
              ================================================== */}

              {step === 4 && (
                <motion.div
                  key="step-four"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  <div className="mb-8">

                    <p className="mb-4 text-xs uppercase tracking-[0.12em] text-white/45">
                      Days you normally work
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">

                      {dayOptions.map((day) => {

                        const selected =
                          days.includes(day);

                        return (
                          <motion.button
                            key={day}
                            type="button"
                            whileTap={{
                              scale: 0.94,
                            }}
                            onClick={() =>
                              toggleDay(day)
                            }
                            className={`rounded-xl border px-3 py-4 text-xs transition-all ${
                              selected
                                ? "border-[#aab59e]/40 bg-[#aab59e]/10 text-[#d1dac9]"
                                : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:border-white/15"
                            }`}
                          >
                            {day.slice(0, 3)}

                            {selected && (
                              <div className="mt-1 text-[9px] text-[#aab59e]">
                                AVAILABLE
                              </div>
                            )}

                          </motion.button>
                        );
                      })}

                    </div>

                  </div>

                  <div className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">

                    <div className="mb-7 flex items-center justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-[0.15em] text-[#cdbb9c]">
                          Standard availability
                        </p>

                        <p className="mt-2 text-sm text-white/30">
                          You can customize individual dates later.
                        </p>

                      </div>

                      <div className="hidden h-12 w-12 items-center justify-center rounded-xl border border-[#aab59e]/15 bg-[#aab59e]/[0.05] text-lg text-[#aab59e] sm:flex">
                        ◷
                      </div>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-xs text-white/45">
                          Available from
                        </label>

                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) =>
                            updateField(
                              "startTime",
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs text-white/45">
                          Available until
                        </label>

                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) =>
                            updateField(
                              "endTime",
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />

                      </div>

                    </div>

                    {/* Timeline */}

                    <div className="mt-10">

                      <div className="mb-3 flex justify-between text-[10px] text-white/20">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                      </div>

                      <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.05]">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: "75%",
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-[#aab59e]/45"
                        />

                      </div>

                      <p className="mt-3 text-xs text-white/25">
                        Families will see your regular availability
                        when searching for care.
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 rounded-xl border border-[#cdbb9c]/10 bg-[#cdbb9c]/[0.025] p-4">

                    <p className="text-xs leading-6 text-white/35">
                      <span className="text-[#cdbb9c]">
                        Important:
                      </span>{" "}
                      Once a specific date and time slot is booked,
                      that slot will become unavailable to other
                      users. We'll connect this to the database when
                      we build the booking system.
                    </p>

                  </div>

                </motion.div>
              )}

              {/* =================================================
                  STEP 5
              ================================================== */}

              {step === 5 && (
                <motion.div
                  key="step-five"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -35,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  <div className="mx-auto max-w-3xl">

                    <div className="mb-8 text-center">

                      <p className="text-sm text-white/35">
                        This is how families will see you.
                      </p>

                    </div>

                    {/* Profile card */}

                    <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#151512] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">

                      <div className="relative h-28 bg-[linear-gradient(120deg,#20231d,#171714,#242117)]">

                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,#cdbb9c,transparent_35%)]" />

                      </div>

                      <div className="relative px-6 pb-7 sm:px-8">

                        <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                          <div className="flex items-end gap-5">

                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-[#151512] bg-[#22221d] text-4xl text-[#cdbb9c]">

                              {photo ? (
                                <img
                                  src={photo}
                                  alt={form.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                "◯"
                              )}

                            </div>

                            <div className="pb-2">

                              <div className="mb-1 flex items-center gap-2">

                                <h3 className="text-2xl font-medium">
                                  {form.name || "Your Name"}
                                </h3>

                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#aab59e] text-[9px] text-[#10120e]">
                                  ✓
                                </span>

                              </div>

                              <p className="text-sm text-[#cdbb9c]">
                                {expertise || "Caregiver"}
                              </p>

                            </div>

                          </div>

                          <div className="rounded-xl border border-[#aab59e]/15 bg-[#aab59e]/[0.04] px-4 py-3">

                            <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                              Starting from
                            </p>

                            <p className="mt-1 text-lg text-[#d5c5a8]">
                              ₹{form.price || "—"}
                              <span className="ml-1 text-xs text-white/25">
                                / slot
                              </span>
                            </p>

                          </div>

                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">

                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                              Location
                            </p>

                            <p className="mt-2 text-sm text-white/65">
                              {form.city || "Your city"}
                            </p>

                          </div>

                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                              Experience
                            </p>

                            <p className="mt-2 text-sm text-white/65">
                              {form.experience || "—"} years
                            </p>

                          </div>

                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                              Availability
                            </p>

                            <p className="mt-2 text-sm text-white/65">
                              {days.length} days / week
                            </p>

                          </div>

                        </div>

                        <div className="mt-7">

                          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-white/25">
                            About
                          </p>

                          <p className="text-sm leading-7 text-white/40">
                            {form.bio ||
                              "Your professional introduction will appear here."}
                          </p>

                        </div>

                        <div className="mt-7">

                          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/25">
                            Services
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {services.length > 0 ? (
                              services.slice(0, 6).map((service) => (
                                <span
                                  key={service}
                                  className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/40"
                                >
                                  {service}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-white/20">
                                No services selected
                              </span>
                            )}

                          </div>

                        </div>

                        <div className="mt-7 border-t border-white/[0.06] pt-6">

                          <div className="flex flex-wrap items-center gap-5 text-xs text-white/30">

                            <span>
                              {languages.length > 0
                                ? languages.join(" · ")
                                : "Languages not added"}
                            </span>

                            <span className="text-white/10">
                              •
                            </span>

                            <span>
                              {form.startTime} — {form.endTime}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>

            {/* =================================================
                ERROR
            ================================================== */}

            <AnimatePresence>

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="mt-7 overflow-hidden"
                >

                  <div className="rounded-xl border border-red-300/10 bg-red-300/[0.035] px-4 py-3 text-sm text-red-200/70">
                    {error}
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

            {/* =================================================
                NAVIGATION
            ================================================== */}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-7 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={
                  step === 1
                    ? () => navigate("/signup")
                    : previousStep
                }
                className="rounded-xl px-5 py-3 text-sm text-white/30 transition hover:bg-white/[0.03] hover:text-white/70"
              >
                {step === 1
                  ? "← Back to account type"
                  : "← Previous"}
              </button>

              {step < 5 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{
                    scale: 1.015,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="rounded-xl bg-[#cdbb9c] px-7 py-3.5 text-sm font-medium text-[#14130f] shadow-[0_12px_35px_rgba(205,187,156,0.12)] transition"
                >
                  Continue
                  <span className="ml-3">
                    →
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.015,
                    y: -2,
                    boxShadow:
                      "0 18px 50px rgba(170,181,158,0.18)",
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="rounded-xl bg-[#aab59e] px-7 py-3.5 text-sm font-medium text-[#11130f] shadow-[0_12px_35px_rgba(170,181,158,0.12)]"
                >
                  Complete Registration
                  <span className="ml-3">
                    →
                  </span>
                </motion.button>
              )}

            </div>

          </form>

        </motion.div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-6 text-center text-[10px] uppercase tracking-[0.16em] text-white/15"
        >
          Care-Connect · Professional caregiver network
        </motion.p>

      </div>

      {/* =====================================================
          COMPLETION OVERLAY
      ====================================================== */}

      <AnimatePresence>

        {completed && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080807]/95 px-5 backdrop-blur-xl"
          >

            {/* Rings */}

            <motion.div
              initial={{
                scale: 0.2,
                opacity: 0,
              }}
              animate={{
                scale: [0.2, 1.5, 2.4],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute h-48 w-48 rounded-full border border-[#aab59e]/40"
            />

            <motion.div
              initial={{
                scale: 0.2,
                opacity: 0,
              }}
              animate={{
                scale: [0.2, 1.2, 2],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2.5,
                delay: 0.5,
                repeat: Infinity,
              }}
              className="absolute h-48 w-48 rounded-full border border-[#cdbb9c]/30"
            />

            {/* Content */}

            <div className="relative text-center">

              <motion.div
                initial={{
                  scale: 0,
                  rotate: -30,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 12,
                }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#aab59e]/35 bg-[#aab59e]/10 text-4xl text-[#cdd8c4] shadow-[0_0_70px_rgba(170,181,158,0.15)]"
              >
                ✓
              </motion.div>

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
                  delay: 0.35,
                }}
                className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[#aab59e]"
              >
                Registration complete
              </motion.p>

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl"
              >
                Your profile is ready.
              </motion.h2>

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
                  delay: 0.65,
                }}
                className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/35"
              >
                Welcome to Care-Connect.
                <br />
                Your professional care journey starts here.
              </motion.p>

              <motion.button
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 1,
                }}
                onClick={() =>
                  navigate("/caregiver-dashboard", {
                    state: {
                      caregiver: {
                        ...form,
                        expertise,
                        services,
                        languages,
                        days,
                        photo,
                      },
                    },
                  })
                }
                className="mt-8 rounded-xl bg-[#cdbb9c] px-7 py-3.5 text-sm font-medium text-[#14130f] transition hover:scale-[1.02]"
              >
                Enter Caregiver Dashboard →
              </motion.button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
}

export default CaregiverSignup;