import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  verified: boolean;
  about: string;
  services: string[];
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

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" strokeWidth="1.8" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2.6 2.82 5.72 6.31.92-4.56 4.45 1.08 6.28L12 17l-5.65 2.97 1.08-6.28-4.56-4.45 6.31-.92L12 2.6Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="m7.5 12 3 3 6-6"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaregiverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        setLoading(true);
        setError("");

        const numericId = Number(id);

        if (!numericId || Number.isNaN(numericId)) {
          setError("Invalid caregiver ID.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/caregivers/${numericId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Caregiver not found"
          );
        }

        const backendCaregiver =
          data.caregiver || data;

        const formattedCaregiver: Caregiver = {
          id:
            backendCaregiver.caregiver_id ||
            backendCaregiver.id ||
            numericId,

          name:
            backendCaregiver.name ||
            "Caregiver",

          specialization:
            backendCaregiver.specialization ||
            backendCaregiver.expertise?.[0] ||
            backendCaregiver.services?.[0] ||
            "Caregiver",

          location:
            backendCaregiver.city ||
            backendCaregiver.location ||
            "Location not specified",

          experience:
            Number(
              backendCaregiver.experience
            ) || 0,

          rating:
            Number(
              backendCaregiver.rating
            ) || 0,

          reviews:
            Number(
              backendCaregiver.reviews_count ||
                backendCaregiver.reviews ||
                backendCaregiver.review_count ||
                0
            ),

          price:
            Number(
              backendCaregiver.price
            ) || 0,

          availability:
            backendCaregiver.availability_status ||
            "Availability not specified",

          /*
           * IMPORTANT:
           * Use the REAL photo stored in MySQL.
           *
           * The backend caregiver profile stores
           * the uploaded image in photo_url.
           *
           * No mock/default image is used.
           */
          image:
            backendCaregiver.photo_url ||
            backendCaregiver.image ||
            "",

          verified:
            backendCaregiver.verified === true ||
            backendCaregiver.verified === 1,

          about:
            backendCaregiver.bio ||
            backendCaregiver.about ||
            backendCaregiver.description ||
            "Experienced caregiver focused on providing compassionate and dependable support.",

          services:
            Array.isArray(
              backendCaregiver.services
            )
              ? backendCaregiver.services
                  .map((service: any) => {
                    if (
                      typeof service ===
                      "string"
                    ) {
                      return service;
                    }

                    if (
                      service &&
                      typeof service ===
                        "object"
                    ) {
                      return (
                        service.service_name ||
                        service.name ||
                        service.service ||
                        ""
                      );
                    }

                    return "";
                  })
                  .filter(Boolean)
              : typeof backendCaregiver.services ===
                  "string"
                ? backendCaregiver.services
                    .split(",")
                    .map(
                      (
                        service: string
                      ) =>
                        service.trim()
                    )
                    .filter(Boolean)
                : [],
        };

        setCaregiver(
          formattedCaregiver
        );
      } catch (err) {
        console.error(
          "Failed to fetch caregiver:",
          err
        );

        setError(
          "We couldn't find the caregiver you're looking for."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, [id]);

  /* LOADING */

  if (loading) {
    return (
      <main className="profile-page">
        <div className="not-found">
          <h1>
            Loading caregiver...
          </h1>

          <p>
            Please wait while we load
            the caregiver profile.
          </p>
        </div>

        <style>{`
          .profile-page {
            min-height: 100vh;
            background: #07110f;
            color: #f1f3eb;
            font-family: Inter, "Segoe UI", Arial, sans-serif;
          }

          .not-found {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .not-found h1 {
            font-family: Georgia, serif;
            font-weight: 400;
          }

          .not-found p {
            color: #8fa199;
          }
        `}</style>
      </main>
    );
  }

  /* ERROR / NOT FOUND */

  if (!caregiver || error) {
    return (
      <main className="profile-page">
        <div className="not-found">

          <h1>
            Caregiver not found
          </h1>

          <p>
            {error ||
              "We couldn't find the caregiver you're looking for."}
          </p>

          <button
            onClick={() =>
              navigate("/search")
            }
          >
            Back to Search
          </button>

        </div>

        <style>{`
          .profile-page {
            min-height: 100vh;
            background: #07110f;
            color: #f1f3eb;
            font-family: Inter, "Segoe UI", Arial, sans-serif;
          }

          .not-found {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .not-found h1 {
            font-family: Georgia, serif;
            font-weight: 400;
          }

          .not-found p {
            color: #8fa199;
          }

          .not-found button {
            margin-top: 15px;
            padding: 11px 18px;
            border: 1px solid rgba(82,183,136,.3);
            border-radius: 8px;
            background: rgba(82,183,136,.08);
            color: #80c9a4;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-glow" />

      <div className="profile-shell">

        {/* BACK */}

        <button
          className="back-button"
          onClick={() =>
            navigate("/search")
          }
        >
          ← Back to caregivers
        </button>

        {/* PROFILE HERO */}

        <motion.section
          className="profile-hero"
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
          }}
        >

          <div className="profile-image">

            {caregiver.image ? (
              <img
                src={caregiver.image}
                alt={caregiver.name}
              />
            ) : (
              <div className="profile-image-placeholder">
                {caregiver.name
                  .split(" ")
                  .map(
                    (part) =>
                      part[0]
                  )
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <div className="availability-badge">

              <span />

              {caregiver.availability}

            </div>

          </div>

          <div className="profile-info">

            <div className="profile-eyebrow">
              CAREGIVER PROFILE
            </div>

            <div className="name-line">

              <h1>
                {caregiver.name}
              </h1>

              {caregiver.verified && (
                <span className="verified-large">
                  <CheckIcon />
                </span>
              )}

            </div>

            <p className="profile-specialization">
              {caregiver.specialization} Specialist
            </p>

            <div className="profile-location">

              <LocationIcon />

              {caregiver.location}

            </div>

            <div className="stats">

              <div className="stat">

                <StarIcon />

                <div>

                  <strong>
                    {caregiver.rating > 0
                      ? caregiver.rating.toFixed(
                          1
                        )
                      : "New"}
                  </strong>

                  <span>
                    {caregiver.reviews} reviews
                  </span>

                </div>

              </div>

              <div className="stat-divider" />

              <div className="stat">

                <strong>
                  {caregiver.experience}
                </strong>

                <div>
                  <span>
                    years
                  </span>

                  <span>
                    experience
                  </span>
                </div>

              </div>

              <div className="stat-divider" />

              <div className="stat">

                <strong>
                  ₹
                  {caregiver.price.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <div>
                  <span>
                    per
                  </span>

                  <span>
                    slot
                  </span>
                </div>

              </div>

            </div>

          </div>

        </motion.section>

        {/* CONTENT */}

        <section className="profile-content">

          <motion.div
            className="main-column"
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
              delay: 0.15,
            }}
          >

            {/* ABOUT */}

            <div className="content-section">

              <div className="section-label">
                ABOUT
              </div>

              <h2>
                Compassionate care,
                <span>
                  {" "}
                  when it matters.
                </span>
              </h2>

              <p className="about-text">
                {caregiver.about}
              </p>

            </div>

            {/* SERVICES */}

            <div className="content-section">

              <div className="section-label">
                SERVICES
              </div>

              <h2>
                What{" "}
                {caregiver.name.split(
                  " "
                )[0]}{" "}
                can help with
              </h2>

              {caregiver.services.length >
              0 ? (
                <div className="services-grid">

                  {caregiver.services.map(
                    (
                      service,
                      index
                    ) => (
                      <div
                        className="service"
                        key={`${service}-${index}`}
                      >

                        <span className="service-check">
                          <CheckIcon />
                        </span>

                        {service}

                      </div>
                    )
                  )}

                </div>
              ) : (
                <p className="about-text">
                  Services will be
                  available soon.
                </p>
              )}

            </div>

            {/* REVIEWS */}

            <div className="content-section">

              <div className="section-label">
                REVIEWS
              </div>

              <div className="review-summary">

                <div className="big-rating">

                  <strong>
                    {caregiver.rating >
                    0
                      ? caregiver.rating.toFixed(
                          1
                        )
                      : "New"}
                  </strong>

                  <div className="stars">

                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />

                  </div>

                  <span>
                    Based on{" "}
                    {caregiver.reviews}{" "}
                    reviews
                  </span>

                </div>

                <div className="review-quote">
                  “Reliable, caring and professional.
                  A great choice for families looking
                  for dependable support.”
                </div>

              </div>

            </div>

          </motion.div>

          {/* BOOKING CARD */}

          <motion.aside
            className="booking-card"
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.2,
            }}
          >

            <div className="booking-label">
              BOOK CARE
            </div>

            <h3>
              Ready to get started?
            </h3>

            <p>
              Choose{" "}
              {caregiver.name.split(
                " "
              )[0]}{" "}
              for your care requirements.
            </p>

            <div className="booking-price">

              <strong>
                ₹
                {caregiver.price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              <span>
                / slot
              </span>

            </div>

            <div className="booking-availability">

              <span />

              {caregiver.availability}

            </div>

            <button
              className="book-button"
              onClick={() =>
                navigate(
                  `/booking/${caregiver.id}`
                )
              }
            >
              Book This Caregiver

              <ArrowIcon />

            </button>

            <div className="secure-note">
              ✓ Secure booking · No hidden charges
            </div>

          </motion.aside>

        </section>

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .profile-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;

          background:
            radial-gradient(
              circle at 80% 5%,
              rgba(55,150,110,.14),
              transparent 30rem
            ),
            #07110f;

          color: #f1f3eb;

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .profile-glow {
          position: absolute;

          width: 420px;
          height: 420px;

          top: -180px;
          left: 30%;

          border-radius: 50%;

          background:
            rgba(72,170,125,.09);

          filter: blur(110px);

          pointer-events: none;
        }

        .profile-shell {
          position: relative;

          z-index: 1;

          width:
            min(
              1120px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            55px 0 90px;
        }

        .back-button {
          border: 0;

          background: transparent;

          color: #9db1a6;

          font-size: .8rem;

          cursor: pointer;

          padding: 0;

          margin-bottom: 35px;

          transition:
            color .2s ease;
        }

        .back-button:hover {
          color: #80c9a4;
        }

        .profile-hero {
          display: grid;

          grid-template-columns:
            430px 1fr;

          gap: 55px;

          align-items: center;

          padding-bottom: 60px;

          border-bottom:
            1px solid
            rgba(202,230,214,.10);
        }

        .profile-image {
          position: relative;

          height: 470px;

          overflow: hidden;

          border-radius: 22px;

          border:
            1px solid
            rgba(202,230,214,.13);

          box-shadow:
            0 30px 80px
            rgba(0,0,0,.38);
        }

        .profile-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .profile-image-placeholder {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            rgba(82,183,136,.10);

          color: #80c9a4;

          font-family:
            Georgia,
            serif;

          font-size: 5rem;
        }

        .availability-badge {
          position: absolute;

          top: 18px;
          left: 18px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            9px 13px;

          border-radius: 999px;

          background:
            rgba(7,17,15,.78);

          border:
            1px solid
            rgba(255,255,255,.12);

          backdrop-filter:
            blur(12px);

          font-size: .7rem;

          font-weight: 700;
        }

        .availability-badge span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #52b788;

          box-shadow:
            0 0 10px
            #52b788;
        }

        .profile-eyebrow {
          color: #80c9a4;

          font-size: .68rem;

          font-weight: 700;

          letter-spacing: .2em;
        }

        .name-line {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 18px;
        }

        .name-line h1 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              2.8rem,
              5vw,
              5rem
            );

          font-weight: 400;

          line-height: 1;
        }

        .verified-large {
          display: flex;

          width: 25px;
          height: 25px;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(82,183,136,.18);

          color: #80c9a4;
        }

        .verified-large svg {
          width: 15px;
          height: 15px;
        }

        .profile-specialization {
          margin:
            15px 0 0;

          color: #80c9a4;

          font-size: 1rem;
        }

        .profile-location {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 25px;

          color: #a9b8b0;

          font-size: .85rem;
        }

        .profile-location svg {
          width: 17px;
          height: 17px;

          color: #52b788;
        }

        .stats {
          display: flex;

          align-items: center;

          gap: 24px;

          margin-top: 40px;

          padding-top: 28px;

          border-top:
            1px solid
            rgba(202,230,214,.10);
        }

        .stat {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .stat > svg {
          width: 16px;
          height: 16px;

          color: #e2bc68;
        }

        .stat strong {
          display: block;

          font-size: 1rem;
        }

        .stat span {
          display: block;

          color: #71837a;

          font-size: .65rem;

          margin-top: 2px;
        }

        .stat-divider {
          width: 1px;
          height: 35px;

          background:
            rgba(202,230,214,.10);
        }

        .profile-content {
          display: grid;

          grid-template-columns:
            1fr 330px;

          gap: 70px;

          padding-top: 65px;
        }

        .content-section {
          padding-bottom: 55px;
        }

        .section-label {
          margin-bottom: 15px;

          color: #80c9a4;

          font-size: .66rem;

          font-weight: 700;

          letter-spacing: .18em;
        }

        .content-section h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              1.8rem,
              3vw,
              2.5rem
            );

          font-weight: 400;

          line-height: 1.15;
        }

        .content-section h2 span {
          color: #b9cbbb;

          font-style: italic;
        }

        .about-text {
          max-width: 650px;

          margin-top: 20px;

          color: #a9b8b0;

          font-size: .92rem;

          line-height: 1.85;
        }

        .services-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 12px;

          margin-top: 25px;
        }

        .service {
          display: flex;

          align-items: center;

          gap: 10px;

          padding: 14px;

          border:
            1px solid
            rgba(202,230,214,.09);

          border-radius: 10px;

          background:
            rgba(255,255,255,.025);

          color: #a9b8b0;

          font-size: .76rem;
        }

        .service-check {
          display: flex;

          width: 19px;
          height: 19px;

          flex: 0 0 auto;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(82,183,136,.12);

          color: #80c9a4;
        }

        .service-check svg {
          width: 11px;
          height: 11px;
        }

        .review-summary {
          display: grid;

          grid-template-columns:
            180px 1fr;

          gap: 30px;

          margin-top: 25px;

          padding: 22px;

          border:
            1px solid
            rgba(202,230,214,.09);

          border-radius: 14px;

          background:
            rgba(255,255,255,.025);
        }

        .big-rating strong {
          display: block;

          font-family:
            Georgia,
            serif;

          font-size: 2.6rem;

          font-weight: 400;
        }

        .stars {
          display: flex;

          gap: 3px;

          margin-top: 5px;

          color: #e2bc68;
        }

        .stars svg {
          width: 14px;
          height: 14px;
        }

        .big-rating span {
          display: block;

          margin-top: 7px;

          color: #71837a;

          font-size: .62rem;
        }

        .review-quote {
          display: flex;

          align-items: center;

          color: #a9b8b0;

          font-family:
            Georgia,
            serif;

          font-size: .95rem;

          font-style: italic;

          line-height: 1.7;
        }

        .booking-card {
          position: sticky;

          top: 25px;

          align-self: start;

          padding: 27px;

          border:
            1px solid
            rgba(202,230,214,.13);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.015)
            ),
            rgba(14,29,25,.9);

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.28);
        }

        .booking-label {
          color: #80c9a4;

          font-size: .65rem;

          font-weight: 700;

          letter-spacing: .17em;
        }

        .booking-card h3 {
          margin:
            17px 0 8px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 1.7rem;

          font-weight: 400;
        }

        .booking-card > p {
          margin: 0;

          color: #8fa199;

          font-size: .76rem;

          line-height: 1.6;
        }

        .booking-price {
          margin-top: 28px;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(202,230,214,.09);
        }

        .booking-price strong {
          font-size: 1.7rem;
        }

        .booking-price span {
          color: #71837a;

          font-size: .75rem;
        }

        .booking-availability {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-top: 13px;

          color: #80c9a4;

          font-size: .7rem;
        }

        .booking-availability span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #52b788;
        }

        .book-button {
          display: flex;

          width: 100%;

          align-items: center;
          justify-content: center;

          gap: 10px;

          margin-top: 25px;

          padding: 15px;

          border: 0;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #52b788,
              #287a5a
            );

          color: white;

          font-size: .78rem;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 12px 30px
            rgba(40,122,90,.22);

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .book-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 16px 35px
            rgba(40,122,90,.32);
        }

        .book-button svg {
          width: 17px;
          height: 17px;
        }

        .secure-note {
          margin-top: 15px;

          color: #61746b;

          font-size: .61rem;

          text-align: center;
        }

        @media (max-width: 900px) {

          .profile-hero {
            grid-template-columns: 1fr;

            gap: 35px;
          }

          .profile-image {
            height: 430px;
          }

          .profile-content {
            grid-template-columns: 1fr;

            gap: 30px;
          }

          .booking-card {
            position: relative;

            top: auto;
          }

        }

        @media (max-width: 600px) {

          .profile-shell {
            width:
              calc(100% - 28px);

            padding-top: 35px;
          }

          .profile-image {
            height: 360px;
          }

          .name-line h1 {
            font-size: 3rem;
          }

          .stats {
            flex-wrap: wrap;

            gap: 18px;
          }

          .stat-divider {
            display: none;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .review-summary {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </main>
  );
}

export default CaregiverProfile;