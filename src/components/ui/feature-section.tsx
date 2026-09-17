"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
  onComplete?: () => void;
}

export function FeatureSteps({
  features,
  className = "",
  title = "How Care-Connect Works",
  autoPlayInterval = 4000,
  onComplete,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (features.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature(
            (current) => (current + 1) % features.length
          );
          return 0;
        }

        return prev + 100 / (autoPlayInterval / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [features.length, autoPlayInterval]);

  if (features.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        min-h-screen
        w-full
        bg-[#050505]
        px-5
        py-20
        text-white
        sm:px-8
        lg:px-16
        ${className}
      `}
    >
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="mb-12 text-center">

          {/* Badge */}
          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-400/20
              bg-blue-500/[0.06]
              px-4
              py-2
              text-xs
              font-medium
              uppercase
              tracking-[0.18em]
              text-blue-300
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-blue-400
                shadow-[0_0_10px_rgba(96,165,250,0.8)]
              "
            />

            Care-Connect
          </div>

          {/* Heading */}
          <h1
            className="
              text-4xl
              font-semibold
              tracking-[-0.04em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            <span
              className="
                bg-gradient-to-r
                from-white
                via-white
                to-blue-300
                bg-clip-text
                text-transparent
              "
            >
              {title}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-white/50
              sm:text-lg
            "
          >
            Tell us what you need and we&apos;ll help you find
            the right caregiver.
          </p>
        </div>

        {/* Main Content */}
        <div
          className="
            grid
            items-center
            gap-10
            md:grid-cols-2
            lg:gap-16
          "
        >

          {/* Steps */}
          <div className="space-y-8">

            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-5"
                initial={{ opacity: 0.35 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.35,
                }}
                transition={{ duration: 0.5 }}
              >

                {/* Step Number */}
                <motion.div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    text-sm
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      index === currentFeature
                        ? `
                          scale-110
                          border-blue-400
                          bg-blue-500
                          text-white
                          shadow-[0_0_25px_rgba(59,130,246,0.35)]
                        `
                        : index < currentFeature
                          ? `
                            border-blue-400/40
                            bg-blue-500/10
                            text-blue-300
                          `
                          : `
                            border-white/15
                            bg-white/[0.03]
                            text-white/40
                          `
                    }
                  `}
                >
                  {index < currentFeature ? "✓" : index + 1}
                </motion.div>

                {/* Step Information */}
                <div className="flex-1">

                  <p
                    className="
                      mb-1
                      text-xs
                      uppercase
                      tracking-[0.15em]
                      text-blue-400/70
                    "
                  >
                    {feature.step}
                  </p>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-white
                      sm:text-2xl
                    "
                  >
                    {feature.title || feature.step}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-white/45
                      sm:text-base
                    "
                  >
                    {feature.content}
                  </p>

                </div>
              </motion.div>
            ))}

            {/* Progress */}
            <div className="pt-3">

              <div
                className="
                  mb-2
                  flex
                  justify-between
                  text-xs
                  text-white/35
                "
              >
                <span>
                  Step {currentFeature + 1} of {features.length}
                </span>

                <span>
                  {Math.round(progress)}%
                </span>
              </div>

              <div
                className="
                  h-1
                  overflow-hidden
                  rounded-full
                  bg-white/[0.08]
                "
              >
                <motion.div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-400
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

            </div>
          </div>

          {/* Image */}
          <div
            className="
              relative
              h-[280px]
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-white/[0.02]
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              sm:h-[350px]
              lg:h-[450px]
            "
          >

            <AnimatePresence mode="wait">

              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-3xl
                      "
                      initial={{
                        y: 80,
                        opacity: 0,
                        rotateX: -15,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                      }}
                      exit={{
                        y: -80,
                        opacity: 0,
                        rotateX: 15,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >

                      <img
                        src={feature.image}
                        alt={feature.title || feature.step}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                      {/* Image Overlay */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black
                          via-black/20
                          to-transparent
                        "
                      />

                      {/* Image Text */}
                      <div
                        className="
                          absolute
                          bottom-0
                          left-0
                          right-0
                          p-6
                          sm:p-8
                        "
                      >

                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-blue-300
                          "
                        >
                          {feature.step}
                        </p>

                        <h3
                          className="
                            mt-2
                            text-2xl
                            font-semibold
                            text-white
                            sm:text-3xl
                          "
                        >
                          {feature.title}
                        </h3>

                      </div>
                    </motion.div>
                  )
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-12 flex justify-center">

          <button
            className="
              rounded-xl
              border
              border-blue-400/30
              bg-blue-500
              px-8
              py-3.5
              font-medium
              text-white
              shadow-[0_10px_35px_rgba(37,99,235,0.28)]
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:bg-blue-400
              hover:shadow-[0_12px_45px_rgba(37,99,246,0.4)]
            "
            onClick={() => {
              if (currentFeature === features.length - 1) {
                onComplete?.();
                return;
              }

              setCurrentFeature((current) => current + 1);
              setProgress(0);
            }}
          >
            {currentFeature === features.length - 1
              ? "Find Caregiver →"
              : "Continue →"}
          </button>

        </div>

      </div>
    </div>
  );
}