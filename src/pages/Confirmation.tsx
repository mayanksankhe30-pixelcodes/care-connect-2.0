import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Caregiver {
  id: number;
  name: string;
  specialization: string;
  location: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  availability: string;
  image: string;
}

interface BookingData {
  caregiver?: Caregiver;
  date?: string;
  time?: string;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M14 31L25 42L47 19"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.55,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
        strokeWidth="1.7"
      />

      <path
        d="M16 2v4M8 2v4M3 9h18"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle
        cx="12"
        cy="12"
        r="9"
        strokeWidth="1.7"
      />

      <path
        d="M12 7v5l3 2"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="10"
        r="2.2"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking =
    (location.state as BookingData | null) || null;

  const caregiver = booking?.caregiver;

  const [showContent, setShowContent] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const formattedDate = booking?.date
    ? new Date(
        booking.date + "T00:00:00"
      ).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not available";

  const formattedTime = booking?.time
    ? new Date(
        `1970-01-01T${booking.time}`
      ).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time not available";

  return (
    <main className="confirmation-page">

      {/* ATMOSPHERE */}

      <div className="background-grid" />

      <motion.div
        className="glow glow-main"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="glow glow-left"
        animate={{
          y: [0, -35, 0],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* FLOATING PARTICLES */}

      <div className="particles">
        {[...Array(18)].map((_, index) => (
          <motion.span
            key={index}
            className="particle"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: -100,
            }}
            transition={{
              duration:
                3.5 + (index % 5) * 0.7,
              delay:
                index * 0.18,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              left: `${5 + (index * 17) % 90}%`,
              top: `${70 + (index % 4) * 5}%`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}

      <section className="confirmation-shell">

        {/* SUCCESS ANIMATION */}

        <motion.div
          className="success-area"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <motion.div
            className="success-ring ring-one"
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 0.5, 1],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="success-ring ring-two"
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: [0.5, 1.35, 1],
              opacity: [0, 0.3, 0.8],
            }}
            transition={{
              duration: 1.2,
              delay: 0.15,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="success-circle"
            initial={{
              scale: 0,
              rotate: -20,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
          >
            <CheckIcon />
          </motion.div>

        </motion.div>

        {/* TITLE */}

        <motion.div
          className="confirmation-heading"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.85,
          }}
        >

          <div className="eyebrow">
            CARE-CONNECT
          </div>

          <h1>
            Care is
            <span> confirmed.</span>
          </h1>

          <p>
            Your caregiver has been successfully
            booked. Everything is set for your care
            session.
          </p>

        </motion.div>

        {/* BOOKING CARD */}

        {showContent && (
          <motion.div
            className="booking-card"
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* CAREGIVER */}

            {caregiver && (
              <div className="caregiver-row">

                <div className="caregiver-image">

                  <img
                    src={caregiver.image}
                    alt={caregiver.name}
                  />

                  <span className="online-dot" />

                </div>

                <div className="caregiver-info">

                  <span className="small-label">
                    YOUR CAREGIVER
                  </span>

                  <h2>
                    {caregiver.name}
                  </h2>

                  <p>
                    {caregiver.specialization}
                  </p>

                </div>

                <div className="confirmed-badge">
                  ✓ Confirmed
                </div>

              </div>
            )}

            {/* DETAILS */}

            <div className="booking-details">

              <div className="detail">

                <div className="detail-icon">
                  <CalendarIcon />
                </div>

                <div>
                  <span>
                    DATE
                  </span>

                  <strong>
                    {formattedDate}
                  </strong>
                </div>

              </div>

              <div className="detail">

                <div className="detail-icon">
                  <ClockIcon />
                </div>

                <div>
                  <span>
                    TIME
                  </span>

                  <strong>
                    {formattedTime}
                  </strong>
                </div>

              </div>

              <div className="detail">

                <div className="detail-icon">
                  <LocationIcon />
                </div>

                <div>
                  <span>
                    LOCATION
                  </span>

                  <strong>
                    {caregiver?.location ||
                      "Location confirmed"}
                  </strong>
                </div>

              </div>

            </div>

            {/* PRICE */}

            <div className="total-row">

              <div>
                <span>
                  TOTAL CARE SESSION
                </span>

                <p>
                  1 care slot
                </p>
              </div>

              <strong>
                ₹
                {caregiver?.price.toLocaleString(
                  "en-IN"
                ) || "0"}
              </strong>

            </div>

          </motion.div>
        )}

        {/* MESSAGE */}

        <motion.div
          className="confirmation-message"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.5,
            duration: 0.6,
          }}
        >
          <span className="message-line" />

          <p>
            A smooth care experience starts here.
          </p>

          <span className="message-line" />
        </motion.div>

        {/* BUTTON */}

        <motion.button
          className="home-button"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.7,
            duration: 0.6,
          }}
          whileHover={{
            y: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={() => navigate("/")}
        >
          Back to Care-Connect
          <ArrowIcon />
        </motion.button>

      </section>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .confirmation-page {
          position: relative;

          min-height: 100vh;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 20%,
              rgba(82,183,136,.13),
              transparent 28rem
            ),
            #07110f;

          color: #f1f3eb;

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* BACKGROUND */

        .background-grid {
          position: absolute;

          inset: 0;

          opacity: .23;

          pointer-events: none;

          background-image:
            linear-gradient(
              rgba(255,255,255,.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.018) 1px,
              transparent 1px
            );

          background-size:
            72px 72px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 80%
            );
        }

        .glow {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(100px);
        }

        .glow-main {
          width: 500px;
          height: 500px;

          top: -230px;
          left: calc(50% - 250px);

          background:
            rgba(55,160,112,.14);
        }

        .glow-left {
          width: 320px;
          height: 320px;

          left: -180px;
          top: 45%;

          background:
            rgba(41,118,92,.09);
        }

        /* PARTICLES */

        .particles {
          position: absolute;

          inset: 0;

          pointer-events: none;
        }

        .particle {
          position: absolute;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background:
            #80c9a4;

          box-shadow:
            0 0 12px
            rgba(128,201,164,.8);
        }

        /* SHELL */

        .confirmation-shell {
          position: relative;

          z-index: 2;

          width:
            min(
              700px,
              calc(100% - 40px)
            );

          min-height: 100vh;

          margin: auto;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          padding:
            70px 0;
        }

        /* SUCCESS */

        .success-area {
          position: relative;

          width: 150px;
          height: 150px;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .success-circle {
          position: relative;

          z-index: 3;

          display: flex;

          width: 92px;
          height: 92px;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              145deg,
              #63c895,
              #287a5a
            );

          color: white;

          box-shadow:
            0 0 0 8px
              rgba(82,183,136,.06),

            0 20px 55px
              rgba(44,139,96,.3);
        }

        .success-circle svg {
          width: 58px;
          height: 58px;
        }

        .success-ring {
          position: absolute;

          border-radius: 50%;

          border:
            1px solid
            rgba(82,183,136,.35);
        }

        .ring-one {
          width: 120px;
          height: 120px;
        }

        .ring-two {
          width: 150px;
          height: 150px;

          border-color:
            rgba(82,183,136,.15);
        }

        /* HEADING */

        .confirmation-heading {
          margin-top: 28px;

          text-align: center;
        }

        .eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 11px;

          color: #80c9a4;

          font-size: .65rem;

          font-weight: 700;

          letter-spacing: .22em;
        }

        .eyebrow::before,
        .eyebrow::after {
          content: "";

          width: 22px;
          height: 1px;

          background:
            #52b788;
        }

        .confirmation-heading h1 {
          margin:
            17px 0
            0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              3rem,
              7vw,
              5rem
            );

          font-weight: 400;

          line-height: .98;
        }

        .confirmation-heading h1 span {
          color: #b9cbbb;

          font-style: italic;
        }

        .confirmation-heading p {
          max-width: 540px;

          margin:
            20px auto
            0;

          color: #9aaca3;

          font-size: .88rem;

          line-height: 1.75;
        }

        /* BOOKING CARD */

        .booking-card {
          width: 100%;

          margin-top: 38px;

          padding: 25px;

          border:
            1px solid
            rgba(202,230,214,.12);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.012)
            ),
            rgba(14,29,25,.84);

          box-shadow:
            0 30px 80px
            rgba(0,0,0,.3);

          backdrop-filter:
            blur(22px);
        }

        /* CAREGIVER */

        .caregiver-row {
          display: flex;

          align-items: center;

          gap: 15px;

          padding-bottom: 22px;

          border-bottom:
            1px solid
            rgba(202,230,214,.09);
        }

        .caregiver-image {
          position: relative;

          flex-shrink: 0;
        }

        .caregiver-image img {
          width: 68px;
          height: 68px;

          border-radius: 12px;

          object-fit: cover;
        }

        .online-dot {
          position: absolute;

          right: -2px;
          bottom: 2px;

          width: 10px;
          height: 10px;

          border-radius: 50%;

          background: #52b788;

          border:
            2px solid
            #0e1d19;

          box-shadow:
            0 0 8px
            #52b788;
        }

        .small-label {
          color: #71837a;

          font-size: .58rem;

          font-weight: 700;

          letter-spacing: .15em;
        }

        .caregiver-info h2 {
          margin:
            5px 0 2px;

          font-family:
            Georgia,
            serif;

          font-size: 1.35rem;

          font-weight: 400;
        }

        .caregiver-info p {
          margin: 0;

          color: #80c9a4;

          font-size: .68rem;
        }

        .confirmed-badge {
          margin-left: auto;

          padding:
            8px 11px;

          border:
            1px solid
            rgba(82,183,136,.18);

          border-radius: 999px;

          background:
            rgba(82,183,136,.06);

          color: #80c9a4;

          font-size: .62rem;

          font-weight: 700;
        }

        /* DETAILS */

        .booking-details {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;

          padding:
            23px 0;

          border-bottom:
            1px solid
            rgba(202,230,214,.08);
        }

        .detail {
          display: flex;

          gap: 10px;

          align-items: center;
        }

        .detail-icon {
          display: flex;

          width: 34px;
          height: 34px;

          flex-shrink: 0;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(82,183,136,.07);

          color: #52b788;
        }

        .detail-icon svg {
          width: 16px;
          height: 16px;
        }

        .detail span {
          display: block;

          margin-bottom: 4px;

          color: #61746b;

          font-size: .53rem;

          font-weight: 700;

          letter-spacing: .1em;
        }

        .detail strong {
          display: block;

          color: #dce7e1;

          font-size: .67rem;

          font-weight: 500;

          line-height: 1.4;
        }

        /* TOTAL */

        .total-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding-top: 22px;
        }

        .total-row span {
          color: #71837a;

          font-size: .58rem;

          font-weight: 700;

          letter-spacing: .12em;
        }

        .total-row p {
          margin:
            4px 0 0;

          color: #61746b;

          font-size: .62rem;
        }

        .total-row > strong {
          font-size: 1.5rem;

          font-weight: 600;
        }

        /* MESSAGE */

        .confirmation-message {
          display: flex;

          width: 100%;

          align-items: center;

          gap: 14px;

          justify-content: center;

          margin-top: 28px;
        }

        .confirmation-message p {
          margin: 0;

          color: #71837a;

          font-family:
            Georgia,
            serif;

          font-size: .75rem;

          font-style: italic;
        }

        .message-line {
          width: 45px;
          height: 1px;

          background:
            rgba(82,183,136,.2);
        }

        /* BUTTON */

        .home-button {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          margin-top: 22px;

          padding:
            13px 20px;

          border:
            1px solid
            rgba(82,183,136,.22);

          border-radius: 9px;

          background:
            rgba(82,183,136,.055);

          color: #9fc4b0;

          font-size: .72rem;

          font-weight: 650;

          cursor: pointer;

          transition:
            background .2s ease,
            border-color .2s ease;
        }

        .home-button:hover {
          background:
            rgba(82,183,136,.10);

          border-color:
            rgba(82,183,136,.38);
        }

        .home-button svg {
          width: 16px;
          height: 16px;

          color: #80c9a4;
        }

        /* MOBILE */

        @media (max-width: 650px) {

          .confirmation-shell {
            width:
              calc(100% - 28px);

            padding:
              50px 0;
          }

          .success-area {
            transform:
              scale(.88);
          }

          .confirmation-heading h1 {
            font-size: 3.1rem;
          }

          .booking-card {
            padding: 19px;
          }

          .caregiver-row {
            align-items: flex-start;
          }

          .confirmed-badge {
            display: none;
          }

          .booking-details {
            grid-template-columns: 1fr;

            gap: 17px;
          }

          .detail {
            align-items: flex-start;
          }

          .total-row > strong {
            font-size: 1.3rem;
          }

        }

      `}</style>
    </main>
  );
}

export default Confirmation;