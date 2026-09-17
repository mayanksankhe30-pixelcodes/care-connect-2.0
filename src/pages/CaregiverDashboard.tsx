import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

type BookingStatus = "Confirmed" | "Pending";

type Booking = {
  id: number;
  client: string;
  type: string;
  time: string;
  duration: string;
  amount: number;
  status: BookingStatus;
};

type Caregiver = {
  name: string;
  email?: string;
  phone?: string;
  city: string;
  expertise: string;
  experience: string;
  qualifications?: string;
  price: string;
  bio?: string;
  services: string[];
  languages: string[];
  days: string[];
  startTime: string;
  endTime: string;
  photo: string | null;
};

const bookings: Booking[] = [];

const activities: {
  time: string;
  title: string;
  description: string;
}[] = [];const navItems = [
  {
    label: "Overview",
    icon: "◉",
  },
  {
    label: "Bookings",
    icon: "□",
  },
  {
    label: "Availability",
    icon: "◷",
  },
  {
    label: "Services",
    icon: "◇",
  },
  {
    label: "Profile",
    icon: "○",
  },
];

function readSavedCaregiver(): Caregiver | null {
  try {
    const saved = localStorage.getItem(
      "careconnect_current_caregiver"
    );

    return saved
      ? (JSON.parse(saved) as Caregiver)
      : null;
  } catch {
    localStorage.removeItem(
      "careconnect_current_caregiver"
    );

    return null;
  }
}

function CaregiverDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const incoming = location.state?.caregiver as
    | Partial<Caregiver>
    | undefined;

  const [caregiver, setCaregiver] =
    useState<Caregiver | null>(
      () => readSavedCaregiver()
    );

  const [activeSection, setActiveSection] =
    useState("Overview");

  const [availability, setAvailability] =
    useState(true);

  const [showNotifications, setShowNotifications] =
    useState(false);

  useEffect(() => {
    if (!incoming?.name) return;

    const normalized: Caregiver = {
      name: incoming.name,
      email: incoming.email ?? "",
      phone: incoming.phone ?? "",
      city: incoming.city ?? "",
      expertise: incoming.expertise ?? "Caregiver",
      experience: incoming.experience ?? "0",
      qualifications:
        incoming.qualifications ?? "",
      price: incoming.price ?? "0",
      bio: incoming.bio ?? "",
      services: incoming.services ?? [],
      languages: incoming.languages ?? [],
      days: incoming.days ?? [],
      startTime: incoming.startTime ?? "09:00",
      endTime: incoming.endTime ?? "18:00",
      photo: incoming.photo ?? null,
    };

    setCaregiver(normalized);

    localStorage.setItem(
      "careconnect_current_caregiver",
      JSON.stringify(normalized)
    );
  }, [location.state]);

  const today = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  }, []);

  const totalToday = bookings
    .filter(
      (booking) => booking.status === "Confirmed"
    )
    .reduce(
      (sum, booking) => sum + booking.amount,
      0
    );

  if (!caregiver) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090908] px-6 text-[#f1ede5]">

        <motion.div
          className="absolute left-[10%] top-[10%] h-80 w-80 rounded-full bg-[#aab59e]/10 blur-[120px]"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-[5%] right-[5%] h-96 w-96 rounded-full bg-[#cbbd9f]/10 blur-[140px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-white/[0.025] p-10 text-center shadow-2xl backdrop-blur-2xl"
        >

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#aab59e]/20 bg-[#aab59e]/10 text-2xl text-[#cbbd9f]">
            ✦
          </div>

          <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-[#aab59e]">
            Caregiver workspace
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight">
            Profile not found.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/35">
            Complete your caregiver registration first.
            Your dashboard will use the profile you submit.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/signup/caregiver")
            }
            className="mt-8 rounded-xl bg-[#cbbd9f] px-6 py-3 text-sm font-medium text-[#16150f] transition hover:scale-[1.02]"
          >
            Complete caregiver registration →
          </button>

        </motion.section>
      </main>
    );
  }

  const profileStrength = Math.round(
    (
      [
        caregiver.name,
        caregiver.city,
        caregiver.expertise,
        caregiver.experience,
        caregiver.services.length,
        caregiver.languages.length,
        caregiver.days.length,
      ].filter(Boolean).length / 7
    ) * 100
  );

  return (
    <main className="min-h-screen bg-[#090908] text-[#f1ede5]">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <motion.div
          className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#aab59e]/[0.025] blur-[150px]"
          animate={{
            x: [0, 70, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-[-200px] top-[35%] h-[600px] w-[600px] rounded-full bg-[#c8b693]/[0.025] blur-[170px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.025),transparent_40%)]" />

      </div>

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] border-r border-white/[0.055] bg-[#0b0b0a]/90 backdrop-blur-2xl lg:flex lg:flex-col">

        <div className="flex h-20 items-center border-b border-white/[0.055] px-7">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >

            <motion.span
              whileHover={{
                scale: 1.15,
              }}
              className="h-2 w-2 rounded-full bg-[#b8c3ad] shadow-[0_0_14px_rgba(184,195,173,0.45)]"
            />

            <span className="text-xs font-semibold tracking-[0.2em] text-white/70">
              CARE-CONNECT
            </span>

          </button>

        </div>

        <div className="border-b border-white/[0.055] px-5 py-6">

          <div className="flex items-center gap-3">

            <Avatar
              caregiver={caregiver}
              size="small"
            />

            <div className="min-w-0">

              <p className="truncate text-sm font-medium text-white/80">
                {caregiver.name}
              </p>

              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-white/25">
                {caregiver.expertise}
              </p>

            </div>

          </div>

        </div>

        <nav className="flex-1 px-4 py-6">

          <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.2em] text-white/20">
            Workspace
          </p>

          <div className="space-y-1">

            {navItems.map((item) => {

              const active =
                activeSection === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setActiveSection(item.label)
                  }
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                    active
                      ? "bg-white/[0.055] text-[#d6c8ad]"
                      : "text-white/30 hover:bg-white/[0.025] hover:text-white/65"
                  }`}
                >

                  {active && (
                    <motion.span
                      layoutId="active-caregiver-nav"
                      className="absolute left-0 h-5 w-[2px] rounded-full bg-[#b4c0aa]"
                    />
                  )}

                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                      active
                        ? "bg-[#b4c0aa]/10 text-[#bfcbb6]"
                        : "bg-white/[0.025] text-white/25"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.label}

                </button>
              );
            })}

          </div>

        </nav>

        <div className="border-t border-white/[0.055] p-4">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/25 transition hover:bg-white/[0.025] hover:text-white/60"
          >
            <span>↩</span>
            Back to Care-Connect
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="relative z-10 lg:pl-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.055] bg-[#090908]/80 px-5 backdrop-blur-2xl sm:px-8">

          <div>

            <p className="hidden text-[9px] uppercase tracking-[0.2em] text-white/20 sm:block">
              Caregiver workspace
            </p>

            <h1 className="text-sm font-medium text-white/75 sm:mt-1 sm:text-base">
              Good to see you,{" "}
              <span className="text-[#cbbd9f]">
                {caregiver.name.split(" ")[0]}.
              </span>
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setAvailability(
                  (value) => !value
                )
              }
              className="hidden items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 sm:flex"
            >

              <motion.span
                animate={{
                  opacity: availability
                    ? [0.5, 1, 0.5]
                    : 0.4,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className={`h-2 w-2 rounded-full ${
                  availability
                    ? "bg-[#aab9a0]"
                    : "bg-white/25"
                }`}
              />

              <span className="text-xs text-white/45">
                {availability
                  ? "Available for bookings"
                  : "Currently unavailable"}
              </span>

            </button>

            {/* Notifications */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowNotifications(
                    (value) => !value
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-sm text-white/40 transition hover:text-white"
              >
                ♢

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#cbbd9f]" />
              </button>

              <AnimatePresence>

                {showNotifications && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    className="absolute right-0 top-14 w-80 rounded-2xl border border-white/[0.08] bg-[#141412] p-4 shadow-2xl"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <p className="text-sm font-medium">
                        Notifications
                      </p>

                      <span className="text-[10px] text-white/25">
                        0 new
                      </span>

                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">

                      <p className="text-xs text-white/45">
                        No new notifications
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-white/20">
                        New booking activity will appear here.
                      </p>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            <div className="lg:hidden">
              <Avatar
                caregiver={caregiver}
                size="small"
              />
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">

          <AnimatePresence mode="wait">

            {/* OVERVIEW */}

            {activeSection === "Overview" && (
              <motion.div
                key="overview"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.35,
                }}
              >

                <PageHeader
                  eyebrow={today}
                  title={
                    <>
                      Your care,{" "}
                      <span className="text-[#cbbd9f]">
                        at a glance.
                      </span>
                    </>
                  }
                  description="Everything you need to manage today's care, bookings and availability."
                />

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                  <Stat
                    label="Today's earnings"
                    value={`₹${totalToday.toLocaleString(
                      "en-IN"
                    )}`}
                    detail="From confirmed care"
                  />

                  <Stat
                    label="Today's bookings"
                    value={bookings
                      .filter(
                        (item) =>
                          item.status ===
                          "Confirmed"
                      )
                      .length.toString()}
                    detail="Confirmed sessions"
                  />

                  <Stat
                    label="Profile views"
                    value="0"
                    detail="No views yet"
                  />

                  <Stat
                    label="Rating"
                    value="New"
                    detail="No reviews yet"
                  />

                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">

                  {/* SCHEDULE */}

                  <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018]">

                    <div className="flex items-center justify-between border-b border-white/[0.055] px-6 py-5">

                      <div>

                        <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                          Today
                        </p>

                        <h3 className="mt-1 text-sm font-medium text-white/75">
                          Care schedule
                        </h3>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            "Bookings"
                          )
                        }
                        className="text-[11px] text-[#cbbd9f] transition hover:text-white"
                      >
                        View all →
                      </button>

                    </div>

                    <div className="p-5">

                      <div className="relative">

                        <div className="absolute bottom-4 left-[47px] top-4 w-px bg-white/[0.06]" />

                        <div className="space-y-2">

                          {bookings.length > 0 ? (
                            bookings.map((booking, index) => (

                              <motion.div
                                key={booking.id}
                                initial={{
                                  opacity: 0,
                                  x: -10,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                }}
                                transition={{
                                  delay:
                                    0.15 +
                                    index * 0.1,
                                }}
                                className="group relative grid grid-cols-[65px_1fr] gap-3 rounded-xl px-1 py-4 transition hover:bg-white/[0.02]"
                              >

                                <div className="relative z-10 pt-1 text-right text-[10px] text-white/25">
                                  {booking.time}
                                </div>

                                <div className="relative rounded-xl border border-white/[0.055] bg-[#11110f] p-4">

                                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                                    <div>

                                      <div className="flex items-center gap-2">

                                        <h4 className="text-sm text-white/70">
                                          {booking.client}
                                        </h4>

                                        <Status
                                          status={
                                            booking.status
                                          }
                                        />

                                      </div>

                                      <p className="mt-2 text-xs text-white/25">
                                        {booking.type} ·{" "}
                                        {booking.duration}
                                      </p>

                                    </div>

                                    <p className="text-sm text-[#cbbd9f]">
                                      ₹
                                      {booking.amount.toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>

                                  </div>

                                </div>

                              </motion.div>
                            ))
                          ) : (
                            <div className="rounded-xl border border-dashed border-white/[0.07] bg-white/[0.01] p-8 text-center">
                              <p className="text-sm text-white/45">
                                No bookings yet
                              </p>
                              <p className="mt-2 text-xs leading-5 text-white/20">
                                Your confirmed care sessions will appear here.
                              </p>
                            </div>
                          )}

                        </div>

                      </div>

                    </div>

                  </section>

                  {/* RIGHT COLUMN */}

                  <div className="space-y-5">

                    {/* PROFILE STRENGTH */}

                    <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-6">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                            Profile
                          </p>

                          <h3 className="mt-1 text-sm font-medium text-white/75">
                            Profile strength
                          </h3>

                        </div>

                        <span className="text-sm text-[#cbbd9f]">
                          {profileStrength}%
                        </span>

                      </div>

                      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${profileStrength}%`,
                          }}
                          transition={{
                            delay: 0.3,
                            duration: 1,
                          }}
                          className="h-full rounded-full bg-[#aab59e]"
                        />

                      </div>

                      <p className="mt-4 text-xs leading-5 text-white/25">
                        A complete profile helps
                        families make decisions with
                        confidence.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            "Profile"
                          )
                        }
                        className="mt-5 text-xs text-[#cbbd9f] hover:text-white"
                      >
                        Review profile →
                      </button>

                    </section>

                    {/* AVAILABILITY */}

                    <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-6">

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                            Availability
                          </p>

                          <h3 className="mt-1 text-sm font-medium text-white/75">
                            Accept new bookings
                          </h3>

                        </div>

                        <Toggle
                          checked={availability}
                          onClick={() =>
                            setAvailability(
                              (value) =>
                                !value
                            )
                          }
                        />

                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-5">

                        <div>

                          <p className="text-xs text-white/40">
                            Standard hours
                          </p>

                          <p className="mt-1 text-sm text-white/65">
                            {caregiver.startTime}{" "}
                            —{" "}
                            {caregiver.endTime}
                          </p>

                        </div>

                        <span className="text-xs text-white/20">
                          {caregiver.days.length}{" "}
                          days/week
                        </span>

                      </div>

                    </section>

                  </div>

                </div>

                {/* ACTIVITY */}

                <section className="mt-5 rounded-2xl border border-white/[0.065] bg-white/[0.018]">

                  <div className="border-b border-white/[0.055] px-6 py-5">

                    <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                      Activity
                    </p>

                    <h3 className="mt-1 text-sm font-medium text-white/75">
                      Recent activity
                    </h3>

                  </div>

                  <div className="divide-y divide-white/[0.045]">

                    {activities.length > 0 ? (
                      activities.map((activity, index) => (

                        <motion.div
                          key={activity.title}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                          }}
                          className="flex items-start gap-4 px-6 py-5"
                        >

                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#aab59e]/50" />

                          <div className="flex-1">

                            <p className="text-xs text-white/55">
                              {activity.title}
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-white/25">
                              {activity.description}
                            </p>

                          </div>

                          <span className="text-[9px] text-white/15">
                            {activity.time}
                          </span>

                        </motion.div>

                      ))
                    ) : (
                      <div className="px-6 py-8 text-center">
                        <p className="text-xs text-white/35">
                          No activity yet
                        </p>
                        <p className="mt-2 text-[10px] text-white/20">
                          Your booking and payment activity will appear here.
                        </p>
                      </div>
                    )}

                  </div>

                </section>

              </motion.div>
            )}

            {/* BOOKINGS */}

            {activeSection === "Bookings" && (
              <motion.div
                key="bookings"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
              >

                <PageHeader
                  eyebrow="Bookings"
                  title="Your care schedule."
                  description="Manage confirmed sessions and incoming requests."
                />

                <div className="grid gap-4">

                  {bookings.map(
                    (booking, index) => (

                      <motion.div
                        key={booking.id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.08,
                        }}
                        className="flex flex-col gap-5 rounded-2xl border border-white/[0.065] bg-white/[0.018] p-5 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#cbbd9f]/[0.06] text-[#cbbd9f]">
                            {booking.client.charAt(
                              0
                            )}
                          </div>

                          <div>

                            <p className="text-sm text-white/70">
                              {booking.client}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {booking.type} ·{" "}
                              {booking.duration}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-6 sm:gap-8">

                          <div>

                            <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                              Time
                            </p>

                            <p className="mt-1 text-xs text-white/55">
                              {booking.time}
                            </p>

                          </div>

                          <div>

                            <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                              Amount
                            </p>

                            <p className="mt-1 text-xs text-[#cbbd9f]">
                              ₹
                              {booking.amount.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                          <Status
                            status={
                              booking.status
                            }
                          />

                        </div>

                      </motion.div>
                    )
                  )}

                </div>

              </motion.div>
            )}

            {/* AVAILABILITY */}

            {activeSection === "Availability" && (
              <motion.div
                key="availability"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
              >

                <PageHeader
                  eyebrow="Availability"
                  title="Control when you care."
                  description="Set your regular working schedule. Specific booked slots will be locked automatically once the real booking system is connected."
                />

                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

                  <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-6 sm:p-8">

                    <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                      Regular working days
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">

                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => {

                        const selected =
                          caregiver.days.includes(
                            day
                          );

                        return (
                          <div
                            key={day}
                            className={`rounded-xl border p-4 text-xs ${
                              selected
                                ? "border-[#aab59e]/25 bg-[#aab59e]/[0.06] text-[#cbd5c1]"
                                : "border-white/[0.06] text-white/20"
                            }`}
                          >

                            <div className="flex items-center justify-between">

                              <span>
                                {day.slice(0, 3)}
                              </span>

                              {selected && (
                                <span className="text-[#aab59e]">
                                  ✓
                                </span>
                              )}

                            </div>

                          </div>
                        );
                      })}

                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">

                      <InfoBox
                        label="Starts"
                        value={
                          caregiver.startTime
                        }
                      />

                      <InfoBox
                        label="Ends"
                        value={
                          caregiver.endTime
                        }
                      />

                    </div>

                  </section>

                  <section className="rounded-2xl border border-[#cbbd9f]/10 bg-[#cbbd9f]/[0.025] p-6">

                    <p className="text-[9px] uppercase tracking-[0.17em] text-[#cbbd9f]/60">
                      Booking protection
                    </p>

                    <h3 className="mt-3 text-lg font-medium">
                      Your time stays yours.
                    </h3>

                    <p className="mt-4 text-xs leading-6 text-white/30">
                      When a family books a
                      specific caregiver, date and
                      time combination, that slot must
                      become unavailable to every
                      other family.
                    </p>

                    <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">

                      <div className="flex items-center gap-3">

                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#aab59e]/10 text-[#aab59e]">
                          ✓
                        </span>

                        <div>

                          <p className="text-xs text-white/60">
                            Double bookings
                          </p>

                          <p className="mt-1 text-[10px] text-white/20">
                            Will be prevented
                            server-side.
                          </p>

                        </div>

                      </div>

                    </div>

                  </section>

                </div>

              </motion.div>
            )}

            {/* SERVICES */}

            {activeSection === "Services" && (
              <motion.div
                key="services"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
              >

                <PageHeader
                  eyebrow="Services"
                  title="What you offer."
                  description="The services families can discover and book from your professional profile."
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {(
                    caregiver.services.length
                      ? caregiver.services
                      : ["Caregiving services"]
                  ).map(
                    (service, index) => (

                      <motion.div
                        key={service}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.06,
                        }}
                        whileHover={{
                          y: -3,
                        }}
                        className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-6"
                      >

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#aab59e]/[0.07] text-sm text-[#aab59e]">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <h3 className="mt-6 text-sm text-white/70">
                          {service}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-white/25">
                          Available as part of your
                          professional care service.
                        </p>

                      </motion.div>
                    )
                  )}

                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.065] bg-white/[0.018] p-6">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                        Standard rate
                      </p>

                      <p className="mt-2 text-2xl text-[#cbbd9f]">
                        ₹
                        {caregiver.price ||
                          "—"}

                        <span className="ml-2 text-xs text-white/20">
                          per slot
                        </span>
                      </p>

                    </div>

                    <button
                      type="button"
                      className="rounded-xl border border-white/[0.08] px-5 py-3 text-xs text-white/40 transition hover:border-white/15 hover:text-white/70"
                    >
                      Edit pricing →
                    </button>

                  </div>

                </div>

              </motion.div>
            )}

            {/* PROFILE */}

            {activeSection === "Profile" && (
              <motion.div
                key="profile"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
              >

                <PageHeader
                  eyebrow="Professional profile"
                  title="How families see you."
                  description="Keep your professional information clear, current and trustworthy."
                />

                <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">

                  <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-7">

                    <div className="flex items-center gap-5">

                      <Avatar
                        caregiver={caregiver}
                        size="large"
                      />

                      <div>

                        <h3 className="text-xl font-medium">
                          {caregiver.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#cbbd9f]">
                          {caregiver.expertise}
                        </p>

                        <p className="mt-2 text-[10px] text-white/25">
                          {caregiver.city}
                        </p>

                      </div>

                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Experience"
                        value={`${caregiver.experience || "—"} years`}
                      />

                      <InfoBox
                        label="Rating"
                        value="4.9 / 5"
                      />

                    </div>

                  </section>

                  <section className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-7">

                    <p className="text-[9px] uppercase tracking-[0.17em] text-white/20">
                      Professional details
                    </p>

                    <div className="mt-6 space-y-5">

                      <DetailRow
                        label="Primary expertise"
                        value={
                          caregiver.expertise
                        }
                      />

                      <DetailRow
                        label="Location"
                        value={caregiver.city}
                      />

                      <DetailRow
                        label="Languages"
                        value={
                          caregiver.languages
                            .length
                            ? caregiver.languages.join(
                                ", "
                              )
                            : "Not specified"
                        }
                      />

                      <DetailRow
                        label="Working hours"
                        value={`${caregiver.startTime} — ${caregiver.endTime}`}
                      />

                    </div>

                    {caregiver.bio && (
                      <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                        <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                          About
                        </p>

                        <p className="mt-2 text-xs leading-6 text-white/35">
                          {caregiver.bio}
                        </p>

                      </div>
                    )}

                    <button
                      type="button"
                      className="mt-7 rounded-xl bg-[#cbbd9f] px-5 py-3 text-xs font-medium text-[#16150f] transition hover:scale-[1.01]"
                    >
                      Edit professional profile
                    </button>

                  </section>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div className="mb-9">

      <p className="text-[10px] uppercase tracking-[0.2em] text-[#aab59e]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/30">
        {description}
      </p>

    </div>
  );
}

function Avatar({
  caregiver,
  size,
}: {
  caregiver: Caregiver;
  size: "small" | "large";
}) {
  const classes =
    size === "large"
      ? "h-20 w-20 rounded-2xl text-2xl"
      : "h-11 w-11 rounded-xl text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[#1a1a17] text-[#c9b997] ${classes}`}
    >

      {caregiver.photo ? (
        <img
          src={caregiver.photo}
          alt={caregiver.name}
          className="h-full w-full object-cover"
        />
      ) : (
        caregiver.name
          .charAt(0)
          .toUpperCase()
      )}

    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
      }}
      className="rounded-2xl border border-white/[0.065] bg-white/[0.018] p-5 transition-colors hover:border-white/[0.11]"
    >

      <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
        {label}
      </p>

      <p className="mt-5 text-2xl font-medium tracking-tight text-white/85">
        {value}
      </p>

      <p className="mt-2 text-[11px] text-white/25">
        {detail}
      </p>

    </motion.div>
  );
}

function Status({
  status,
}: {
  status: BookingStatus;
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[8px] uppercase tracking-[0.1em] ${
        status === "Confirmed"
          ? "bg-[#aab59e]/[0.08] text-[#aab59e]"
          : "bg-[#cbbd9f]/[0.08] text-[#cbbd9f]"
      }`}
    >
      {status}
    </span>
  );
}

function Toggle({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle availability"
      className={`relative h-7 w-12 rounded-full transition ${
        checked
          ? "bg-[#aab59e]/20"
          : "bg-white/[0.08]"
      }`}
    >

      <motion.span
        animate={{
          x: checked ? 21 : 3,
        }}
        className={`absolute top-1 h-5 w-5 rounded-full ${
          checked
            ? "bg-[#aab59e]"
            : "bg-white/30"
        }`}
      />

    </button>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/65">
        {value}
      </p>

    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.05] pb-4 sm:flex-row sm:items-center sm:justify-between">

      <span className="text-xs text-white/25">
        {label}
      </span>

      <span className="text-xs text-white/60">
        {value}
      </span>

    </div>
  );
}

export default CaregiverDashboard;