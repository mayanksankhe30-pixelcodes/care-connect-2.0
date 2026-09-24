import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Globe from "./globe";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ScrollGlobeProps {
  onGetStarted?: () => void;
  onExplore?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  className?: string;
}

interface Section {
  id: string;
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  features?: {
    title: string;
    description: string;
  }[];
  actions?: {
    label: string;
    variant: "primary" | "secondary";
    onClick?: () => void;
  }[];
}

interface GlobePositionConfig {
  top: string;
  left: string;
  scale: number;
}

interface ParsedGlobePosition {
  top: number;
  left: number;
  scale: number;
}

const globePositions: GlobePositionConfig[] = [
  { top: "50%", left: "76%", scale: 1.35 },
  { top: "28%", left: "52%", scale: 0.9 },
  { top: "48%", left: "78%", scale: 1.5 },
  { top: "50%", left: "50%", scale: 1.75 },
];

const parsePercent = (value: string): number =>
  Number.parseFloat(value.replace("%", ""));

/* ============================================================
   CARE NETWORK BACKGROUND
   ============================================================ */

function CareNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;

    interface CareNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulsePhase: number;
      pulseSpeed: number;
      color: string;
    }

    interface CarePulse {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      isWarm?: boolean;
    }

    const nodePalette = [
      "rgba(82, 121, 111,",
      "rgba(45, 106, 79,",
      "rgba(107, 144, 128,",
      "rgba(224, 169, 109,",
    ];

    let nodes: CareNode[] = [];
    let pulses: CarePulse[] = [];

    const initNodes = () => {
      const count = Math.min(
        Math.floor((width * height) / 38000),
        30
      );

      nodes = [];

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          radius: Math.random() * 1.5 + 1.5,
          baseAlpha: Math.random() * 0.3 + 0.35,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.025,
          color:
            nodePalette[
              Math.floor(Math.random() * nodePalette.length)
            ],
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initNodes();
    };

    resize();

    window.addEventListener("resize", resize, {
      passive: true,
    });

    let lastPulseSpawn = 0;
    const maxConnectionDistance = 160;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (
        time - lastPulseSpawn > 2400 &&
        nodes.length > 1
      ) {
        lastPulseSpawn = time;

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (
              dist < maxConnectionDistance &&
              Math.random() > 0.5
            ) {
              pulses.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.01 + Math.random() * 0.007,
                isWarm: Math.random() > 0.6,
              });

              break;
            }
          }

          if (pulses.length > 4) break;
        }
      }

      /* Connection lines */

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const alpha =
              (1 - dist / maxConnectionDistance) * 0.16;

            ctx.strokeStyle = `rgba(82, 121, 111, ${alpha})`;
            ctx.lineWidth = 0.9;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      /* Traveling pulses */

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];

        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const from = nodes[pulse.fromIndex];
        const to = nodes[pulse.toIndex];

        if (!from || !to) {
          pulses.splice(p, 1);
          continue;
        }

        const px =
          from.x + (to.x - from.x) * pulse.progress;

        const py =
          from.y + (to.y - from.y) * pulse.progress;

        const pulseAlpha =
          Math.sin(pulse.progress * Math.PI) * 0.6;

        ctx.fillStyle = pulse.isWarm
          ? `rgba(224, 169, 109, ${pulseAlpha * 0.35})`
          : `rgba(82, 121, 111, ${pulseAlpha * 0.35})`;

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = pulse.isWarm
          ? `rgba(224, 169, 109, ${pulseAlpha})`
          : `rgba(45, 106, 79, ${pulseAlpha})`;

        ctx.beginPath();
        ctx.arc(px, py, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Nodes */

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) {
          node.x = width + 20;
        } else if (node.x > width + 20) {
          node.x = -20;
        }

        if (node.y < -20) {
          node.y = height + 20;
        } else if (node.y > height + 20) {
          node.y = -20;
        }

        node.pulsePhase += node.pulseSpeed;

        const currentAlpha =
          node.baseAlpha +
          Math.sin(node.pulsePhase) * 0.12;

        ctx.fillStyle = `${node.color}${Math.max(
          currentAlpha * 0.3,
          0.05
        )})`;

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.radius * 2.8,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = `${node.color}${Math.max(
          currentAlpha,
          0.15
        )})`;

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}

/* ============================================================
   CAREGIVER / CLIENT HERO SHOWCASE
   Automatically cycles through the types of care offered by
   Care-Connect so visitors immediately understand the product.
   ============================================================ */
function CaregiverShowcase() {
  const careScenes = [
    {
      title: "Elderly Care",
      subtitle: "A caregiver helping a senior at home",
      image:
        "https://img77.uenicdn.com/image/upload/v1709814377/business/8bd0d0e3895645a0af65dfaa289fd076.jpg",
    },
    {
      title: "Patient Care",
      subtitle: "Support for recovery and daily assistance",
      image:
        "https://app.nurseg.in/blog-images/elderly-caretaker.png",
    },
    {
      title: "Child Care",
      subtitle: "Safe and attentive support for children",
      image:
        "https://www.caritas-ooe.at/fileadmin/_processed_/6/2/csm_therapien_bee7d80204.jpg",
    },
    {
      title: "Family Support",
      subtitle: "Compassionate help where families need it",
      image:
        "https://images.squarespace-cdn.com/content/v1/66043e81d5d1e33cf90a81ab/53e511d7-0978-46d4-b17d-d55889f805d8/467F8360-740C-42A0-9183-8FB87CB2D256.jpeg",
    },
  ];

  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % careScenes.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [careScenes.length]);

  const scene = careScenes[activeScene];

  return (
    <div className="relative mt-12 w-full max-w-[560px] lg:mt-0 lg:max-w-[620px]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-emerald-700/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-2 shadow-[0_25px_80px_rgba(45,90,67,0.14)] backdrop-blur-xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={scene.image}
              src={scene.image}
              alt={`${scene.title} - ${scene.subtitle}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-stone-950/35 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Care-Connect
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scene.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="absolute bottom-5 left-5 right-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                {scene.title}
              </p>
              <p className="mt-1 text-sm text-white/90 sm:text-base">
                {scene.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 px-3 pb-2 pt-3 sm:px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Care that connects
            </p>
            <p className="mt-1 text-xs text-stone-600">
              Discover care for every stage of life.
            </p>
          </div>

          <div className="flex gap-1.5" aria-label="Care types">
            {careScenes.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === activeScene
                    ? "w-7 bg-emerald-700"
                    : "w-1.5 bg-stone-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const lightAtmosphereKeyframes = `
  @keyframes organicMorph1 {
    0%, 100% {
      transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg);
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }

    33% {
      transform: translate3d(140px, -70px, 0) scale(1.18) rotate(6deg);
      border-radius: 40% 60% 70% 30% / 50% 60% 30% 60%;
    }

    66% {
      transform: translate3d(-90px, 80px, 0) scale(0.9) rotate(-5deg);
      border-radius: 70% 30% 50% 50% / 30% 40% 60% 70%;
    }
  }

  @keyframes organicMorph2 {
    0%, 100% {
      transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg);
      border-radius: 50% 50% 60% 40% / 40% 60% 50% 60%;
    }

    40% {
      transform: translate3d(-130px, 90px, 0) scale(1.22) rotate(-8deg);
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }

    75% {
      transform: translate3d(100px, -80px, 0) scale(0.92) rotate(5deg);
      border-radius: 30% 70% 50% 50% / 50% 30% 70% 50%;
    }
  }

  @keyframes organicMorph3 {
    0%, 100% {
      transform: translate3d(0px, 0px, 0) scale(0.95);
      opacity: 0.32;
    }

    50% {
      transform: translate3d(80px, -90px, 0) scale(1.25);
      opacity: 0.48;
    }
  }

  @keyframes peachWarmthDrift {
    0%, 100% {
      transform: translate3d(0px, 0px, 0) scale(0.96);
      opacity: 0.35;
    }

    50% {
      transform: translate3d(-60px, -50px, 0) scale(1.2);
      opacity: 0.52;
    }
  }

  @keyframes flowingRibbon {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }

    50% {
      transform: translate(-50%, -50%) rotate(180deg) scale(1.15);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg) scale(1);
    }
  }

  @keyframes waterRipple {
    0% {
      transform: translate(-50%, -50%) scale(0.65);
      opacity: 0.45;
    }

    60% {
      opacity: 0.22;
    }

    100% {
      transform: translate(-50%, -50%) scale(1.8);
      opacity: 0;
    }
  }
`;

export default function CareConnectLanding({
  onGetStarted,
  onExplore,
  onLogin,
  onSignUp,
  className,
}: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const positions: ParsedGlobePosition[] = useMemo(
    () =>
      globePositions.map((position) => ({
        top: parsePercent(position.top),
        left: parsePercent(position.left),
        scale: position.scale,
      })),
    []
  );

  const sections: Section[] = useMemo(
    () => [
      {
        id: "hero",
        badge: "CARE-CONNECT",
        title: "Find the right caregiver",
        subtitle: "Wherever care is needed.",
        description:
          "Care-Connect connects families with trusted caregivers based on location, availability, services and hourly cost.",
        align: "left",
        actions: [
          {
            label: "Find a Caregiver",
            variant: "primary",
            onClick: onGetStarted,
          },
          {
            label: "Explore Care",
            variant: "secondary",
            onClick: onExplore,
          },
        ],
      },

      {
        id: "connected-care",
        badge: "CONNECTED CARE",
        title: "Care without boundaries",
        subtitle: "Connected across regions.",
        description:
          "Discover caregivers available in your area and find the care that fits your family's needs.",
        align: "center",
        features: [
          {
            title: "Search by Location",
            description:
              "Find caregivers based on your city or preferred region.",
          },
          {
            title: "Check Availability",
            description:
              "See when caregivers are available before making a booking.",
          },
        ],
      },

      {
        id: "caregiver-discovery",
        badge: "CAREGIVER DISCOVERY",
        title: "Compare before you choose",
        subtitle: "Everything you need in one place.",
        description:
          "View caregiver profiles, services, availability and slot costs so you can make a confident decision.",
        align: "left",
        features: [
          {
            title: "Caregiver Profiles",
            description:
              "Explore caregiver experience, services and other important details.",
          },
          {
            title: "Transparent Pricing",
            description:
              "Know the cost of a caregiver's slot before booking.",
          },
          {
            title: "Availability",
            description:
              "Choose a caregiver whose available time matches your requirement.",
          },
        ],
      },

      {
        id: "future-of-care",
        badge: "CARE-CONNECT 2.0",
        title: "Better care starts",
        subtitle: "with the right connection.",
        description:
          "From discovering a caregiver to confirming a booking, Care-Connect makes the journey simple and connected.",
        align: "center",
        actions: [
          {
            label: "Get Started",
            variant: "primary",
            onClick: onGetStarted,
          },
          {
            label: "Find Care",
            variant: "secondary",
            onClick: onExplore,
          },
        ],
      },
    ],
    [onGetStarted, onExplore]
  );

  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      maxScroll > 0
        ? Math.min(Math.max(scrollTop / maxScroll, 0), 1)
        : 0;

    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;

    let closestSection = 0;
    let smallestDistance = Infinity;

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionCenter =
        rect.top + rect.height / 2;

      const distance = Math.abs(
        sectionCenter - viewportCenter
      );

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestSection = index;
      }
    });

    const position = positions[closestSection];

    if (position) {
      const transform = `
        translate3d(
          ${position.left}vw,
          ${position.top}vh,
          0
        )
        translate3d(-50%, -50%, 0)
        scale3d(
          ${position.scale},
          ${position.scale},
          1
        )
      `;

      setGlobeTransform(transform);
    }

    setActiveSection(closestSection);
  }, [positions]);

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current !== null) return;

      animationFrameRef.current =
        requestAnimationFrame(() => {
          updateScrollPosition();
          animationFrameRef.current = null;
        });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    updateScrollPosition();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const position = positions[0];

    if (!position) return;

    setGlobeTransform(`
      translate3d(
        ${position.left}vw,
        ${position.top}vh,
        0
      )
      translate3d(-50%, -50%, 0)
      scale3d(
        ${position.scale},
        ${position.scale},
        1
      )
    `);
  }, [positions]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <main
      className={cn(
        "relative min-h-screen w-full overflow-x-hidden",
        "bg-[#FAF8F5] text-stone-900",
        "selection:bg-emerald-100 selection:text-emerald-900",
        className
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: lightAtmosphereKeyframes,
        }}
      />

      {/* TOP NAVIGATION */}

      <header className="pointer-events-auto fixed left-0 right-0 top-0 z-[9999] px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => scrollToSection(0)}
            className="
              group flex items-center gap-2 rounded-full
              border border-stone-200/80
              bg-white/70 px-4 py-2
              shadow-[0_4px_20px_rgba(0,0,0,0.03)]
              backdrop-blur-xl
              transition-all duration-300
              hover:border-emerald-700/30
              hover:bg-white/90
            "
          >
            <span
              className="
                h-2 w-2 rounded-full
                bg-emerald-600
                shadow-[0_0_8px_rgba(45,106,79,0.8)]
              "
            />

            <span
              className="
                text-sm font-semibold
                tracking-[0.12em]
                text-stone-800
              "
            >
              CARE-CONNECT
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (onLogin) {
                  onLogin();
                } else {
                  window.location.href = "/login";
                }
              }}
              className="
                rounded-xl
                border border-stone-300/80
                bg-white/75
                px-4 py-2.5
                text-sm font-medium
                text-stone-700
                shadow-[0_2px_10px_rgba(0,0,0,0.02)]
                backdrop-blur-xl
                transition-all duration-300
                hover:border-emerald-700/30
                hover:bg-white
                hover:text-emerald-900
                sm:px-5
              "
            >
              Login
            </button>

            <button
              onClick={() => {
                if (onSignUp) {
                  onSignUp();
                } else {
                  window.location.href = "/signup";
                }
              }}
              className="
                rounded-xl
                border border-emerald-800/20
                bg-emerald-700
                px-4 py-2.5
                text-sm font-medium
                text-white
                shadow-[0_6px_22px_rgba(45,90,67,0.22)]
                transition-all duration-300
                hover:bg-emerald-800
                hover:shadow-[0_8px_26px_rgba(45,90,67,0.3)]
                sm:px-5
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          LIGHT, VISIBLY DYNAMIC LIVING BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#FAF8F5]">

        {/* Subtle organic texture */}

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(82, 121, 111, 0.4) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* SAGE MORPHING LIGHT */}

        <div
          className="
            absolute
            left-[46%]
            top-[22%]
            h-[720px]
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            bg-gradient-to-br
            from-[#84a98c]/35
            via-[#b7e4c7]/25
            to-[#52796f]/30
            blur-[110px]
            will-change-transform
          "
          style={{
            animation:
              "organicMorph1 16s ease-in-out infinite",
          }}
        />

        {/* PEACH / BEIGE MORPHING LIGHT */}

        <div
          className="
            absolute
            left-[22%]
            top-[38%]
            h-[680px]
            w-[680px]
            -translate-x-1/2
            -translate-y-1/2
            bg-gradient-to-tr
            from-[#fedac2]/45
            via-[#ede0d4]/35
            to-[#fcd5ce]/40
            blur-[105px]
            will-change-transform
          "
          style={{
            animation:
              "organicMorph2 20s ease-in-out infinite",
          }}
        />

        {/* MINT / EUCALYPTUS LIGHT */}

        <div
          className="
            absolute
            left-[68%]
            top-[32%]
            h-[800px]
            w-[800px]
            -translate-x-1/2
            -translate-y-1/2
            bg-gradient-to-tl
            from-[#a7f3d0]/35
            via-[#84a98c]/30
            to-[#d8f3dc]/40
            blur-[115px]
            will-change-transform
          "
          style={{
            animation:
              "organicMorph3 18s ease-in-out infinite",
          }}
        />

        {/* WARM HUMAN GLOW */}

        <div
          className="
            absolute
            left-[50%]
            top-[58%]
            h-[540px]
            w-[540px]
            -translate-x-1/2
            -translate-y-1/2
            bg-gradient-to-r
            from-[#e0a96d]/20
            via-[#fedac2]/30
            to-[#fbf9f6]/40
            blur-[100px]
            will-change-transform
          "
          style={{
            animation:
              "peachWarmthDrift 14s ease-in-out infinite",
          }}
        />

        {/* ORGANIC FLOWING RIBBON */}

        <div
          className="
            absolute
            left-[62%]
            top-[44%]
            h-[940px]
            w-[940px]
            rounded-[44%]
            bg-[radial-gradient(ellipse_at_center,rgba(132,169,140,0.22)_0%,rgba(254,218,194,0.18)_40%,transparent_70%)]
            blur-[80px]
            will-change-transform
          "
          style={{
            animation:
              "flowingRibbon 40s linear infinite",
          }}
        />

        {/* RIPPLE SYSTEM */}

        <div
          className="
            absolute
            -translate-x-1/2
            -translate-y-1/2
            transition-all
            duration-[1400ms]
            ease-[cubic-bezier(0.23,1,0.32,1)]
          "
          style={{
            left: `${
              positions[activeSection]?.left ?? 76
            }%`,
            top: `${
              positions[activeSection]?.top ?? 50
            }%`,
          }}
        >
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[500px]
              w-[500px]
              rounded-full
              border
              border-emerald-800/15
              bg-emerald-600/[0.025]
              shadow-[0_0_40px_rgba(82,121,111,0.12)]
            "
            style={{
              animation:
                "waterRipple 8s cubic-bezier(0.2,0.8,0.4,1) infinite",
            }}
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[500px]
              w-[500px]
              rounded-full
              border
              border-amber-700/12
              bg-amber-600/[0.02]
              shadow-[0_0_35px_rgba(224,169,109,0.1)]
            "
            style={{
              animation:
                "waterRipple 8s cubic-bezier(0.2,0.8,0.4,1) 4s infinite",
            }}
          />
        </div>

        {/* CARE NETWORK */}

        <CareNetworkBackground />

        {/* SOFT EDGE LIGHT */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(250,248,245,0.7)_100%)]
          "
        />
      </div>

      {/* SCROLL PROGRESS */}

      <div
        className="
          fixed left-0 top-0 z-[60]
          h-[2px] w-full
          bg-stone-200/80
        "
      >
        <div
          className="
            h-full origin-left
            bg-gradient-to-r
            from-emerald-700
            via-teal-600
            to-emerald-700
            transition-transform duration-150
          "
          style={{
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </div>

      {/* RIGHT SIDE NAVIGATION */}

      <div
        className="
          fixed right-5 top-1/2 z-50
          hidden -translate-y-1/2 md:block
        "
      >
        <div className="relative flex flex-col items-center gap-5">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to ${section.badge}`}
              className={cn(
                "relative h-3 w-3 rounded-full border transition-all duration-300",
                activeSection === index
                  ? "scale-125 border-emerald-700 bg-emerald-700 shadow-[0_0_12px_rgba(45,90,67,0.5)]"
                  : "border-stone-300 bg-stone-200/80 hover:border-emerald-700 hover:bg-emerald-700/30"
              )}
            />
          ))}

          <div
            className="
              absolute
              left-1/2
              top-0
              -z-10
              h-full
              w-px
              -translate-x-1/2
              bg-stone-300/70
            "
          />
        </div>
      </div>
            {/* =====================================================
          GLOBE
          ===================================================== */}

      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-10",
          "will-change-transform",
          "transition-transform duration-[1400ms]",
          "ease-[cubic-bezier(0.23,1,0.32,1)]"
        )}
        style={{
          transform: globeTransform,
          opacity: activeSection === 3 ? 0.35 : 0.88,
        }}
      >
        {/* Globe halo */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -z-10
            h-[85%]
            w-[85%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-600/[0.12]
            blur-[90px]
          "
        />

        <div className="scale-[0.65] sm:scale-75 lg:scale-100">
          <Globe />
        </div>
      </div>

      {/* =====================================================
          LANDING PAGE SECTIONS
          ===================================================== */}

      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(element) => {
            sectionRefs.current[index] = element;
          }}
          className={cn(
            "relative z-20 flex min-h-screen w-full flex-col justify-center",
            "px-5 py-20 sm:px-8 lg:px-16",
            index === 0 && "lg:flex-row lg:items-center lg:gap-16",
            section.align === "center" &&
              "items-center text-center",
            section.align === "right" &&
              "items-end text-right",
            (!section.align ||
              section.align === "left") &&
              "items-start text-left"
          )}
        >
          <div
            className={cn(
              "w-full",
              "max-w-xl lg:max-w-2xl",
              "transition-all duration-700",
              section.align === "center" &&
                "max-w-3xl"
            )}
          >
            {/* BADGE */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-800/15
                bg-emerald-800/[0.06]
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-emerald-900
                shadow-[0_2px_12px_rgba(0,0,0,0.03)]
                backdrop-blur-xl
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-emerald-600
                  shadow-[0_0_8px_rgba(45,106,79,0.8)]
                "
              />

              {section.badge}
            </div>

            {/* HEADING */}

            <h1
              className={cn(
                "font-semibold leading-[1.02]",
                "tracking-[-0.045em]",
                "text-stone-900",
                index === 0
                  ? "text-5xl sm:text-6xl lg:text-7xl"
                  : "text-4xl sm:text-5xl lg:text-6xl"
              )}
            >
              <span>{section.title}</span>

              {section.subtitle && (
                <>
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-emerald-800
                      via-teal-700
                      to-emerald-900
                      bg-clip-text
                      text-transparent
                    "
                  >
                    {section.subtitle}
                  </span>
                </>
              )}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-8
                text-stone-600
                sm:text-lg
              "
            >
              {section.description}
            </p>

            {/* FEATURES */}

            {section.features && (
              <div className="mt-9 grid gap-4">
                {section.features.map(
                  (feature) => (
                    <div
                      key={feature.title}
                      className="
                        group
                        rounded-2xl
                        border
                        border-stone-200/80
                        bg-white/65
                        p-5
                        shadow-[0_8px_30px_rgba(0,0,0,0.03)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-emerald-700/30
                        hover:bg-white/90
                        hover:shadow-[0_15px_40px_rgba(45,90,67,0.08)]
                      "
                    >
                      <div className="flex gap-4 text-left">
                        <div
                          className="
                            mt-1.5
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-emerald-600
                            shadow-[0_0_8px_rgba(45,106,79,0.7)]
                          "
                        />

                        <div>
                          <h3 className="font-semibold text-stone-900">
                            {feature.title}
                          </h3>

                          <p
                            className="
                              mt-1.5
                              text-sm
                              leading-7
                              text-stone-600
                            "
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}

            {section.actions && (
              <div
                className={cn(
                  "mt-9 flex flex-col flex-wrap gap-3",
                  "sm:flex-row sm:gap-4",
                  section.align === "center" &&
                    "justify-center",
                  section.align === "right" &&
                    "justify-end",
                  (!section.align ||
                    section.align === "left") &&
                    "justify-start"
                )}
              >
                {section.actions.map(
                  (action) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={cn(
                        "group relative overflow-hidden rounded-xl px-7 py-3.5",
                        "font-medium transition-all duration-300",
                        "hover:scale-[1.02]",
                        "active:scale-[0.98]",
                        "text-sm sm:text-base",
                        "focus:outline-none",
                        "focus:ring-2",
                        "focus:ring-emerald-700/30",
                        "w-full sm:w-auto",

                        action.variant ===
                          "primary"
                          ? `
                            border
                            border-emerald-800/20
                            bg-emerald-700
                            text-white
                            shadow-[0_8px_25px_rgba(45,90,67,0.22)]
                            hover:bg-emerald-800
                            hover:shadow-[0_10px_30px_rgba(45,90,67,0.3)]
                          `
                          : `
                            border
                            border-stone-300/80
                            bg-white/70
                            text-stone-800
                            shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                            backdrop-blur-xl
                            hover:border-emerald-700/40
                            hover:bg-white/95
                            hover:text-emerald-900
                          `
                      )}
                    >
                      <span className="relative z-10">
                        {action.label}
                      </span>

                      {action.variant ===
                        "primary" && (
                        <div
                          className="
                            absolute
                            inset-0
                            -translate-x-full
                            bg-gradient-to-r
                            from-transparent
                            via-white/20
                            to-transparent
                            transition-transform
                            duration-700
                            group-hover:translate-x-full
                          "
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {index === 0 && <CaregiverShowcase />}
        </section>
      ))}
    </main>
  );
}