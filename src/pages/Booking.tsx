import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
      <path
        d="M12 7v5l3 2"
        strokeWidth="1.7"
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

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
            data?.message || "Caregiver not found"
          );
        }

        const backendCaregiver =
          data?.caregiver || data;

        const formattedCaregiver: Caregiver = {
          id:
            Number(
              backendCaregiver.caregiver_id ||
                backendCaregiver.id ||
                numericId
            ),

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
            IMPORTANT:
            We are using ONLY the real photo_url
            from the backend.

            There is NO mock Unsplash image here.
          */
          image:
            backendCaregiver.photo_url ||
            backendCaregiver.image ||
            "",
        };

        setCaregiver(formattedCaregiver);
      } catch (err: any) {
        console.error(
          "Fetch caregiver error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load caregiver."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, [id]);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const handleConfirm = () => {
    if (!date || !time) {
      alert(
        "Please select a date and time."
      );
      return;
    }

    navigate("/confirmation", {
      state: {
        caregiver,
        date,
        time,
      },
    });
  };

  if (loading) {
    return (
      <main className="booking-page">
        <div className="not-found">
          <h1>Loading...</h1>
          <p>
            Loading caregiver details.
          </p>
        </div>

        <style>{`
          * {
            box-sizing: border-box;
          }

          .booking-page {
            min-height: 100vh;
            background: #07110f;
            color: #f1f3eb;
            font-family:
              Inter,
              "Segoe UI",
              Arial,
              sans-serif;
          }

          .not-found {
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
          }

          .not-found h1 {
            font-family: Georgia, serif;
            font-weight: 400;
          }

          .not-found p {
            color: #71837a;
          }
        `}</style>
      </main>
    );
  }

  if (error || !caregiver) {
    return (
      <main className="booking-page">
        <div className="not-found">
          <h1>Caregiver not found</h1>

          <p>
            {error ||
              "We couldn't find the caregiver for this booking."}
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
          * {
            box-sizing: border-box;
          }

          .booking-page {
            min-height: 100vh;
            background: #07110f;
            color: #f1f3eb;
            font-family:
              Inter,
              "Segoe UI",
              Arial,
              sans-serif;
          }

          .not-found {
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
          }

          .not-found h1 {
            font-family: Georgia, serif;
            font-weight: 400;
          }

          .not-found p {
            color: #71837a;
          }

          .not-found button {
            margin-top: 15px;
            padding: 10px 17px;
            border:
              1px solid
              rgba(82,183,136,.3);
            border-radius: 8px;
            background:
              rgba(82,183,136,.07);
            color: #80c9a4;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="booking-page">

      <div className="booking-glow" />

      <div className="booking-shell">

        {/* BACK */}

        <button
          className="back-button"
          onClick={() =>
            navigate(
              `/caregiver/${caregiver.id}`
            )
          }
        >
          ← Back to profile
        </button>

        {/* HEADER */}

        <div className="booking-heading">

          <div className="eyebrow">
            CARE BOOKING
          </div>

          <h1>
            Book your
            <span> caregiver.</span>
          </h1>

          <p>
            Choose a preferred date and time
            for your care session.
          </p>

        </div>

        {/* MAIN */}

        <section className="booking-layout">

          {/* LEFT */}

          <div className="booking-form">

            {/* CAREGIVER */}

            <div className="caregiver-summary">

              {caregiver.image ? (
                <img
                  src={caregiver.image}
                  alt={caregiver.name}
                />
              ) : (
                <div className="image-placeholder">
                  {caregiver.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="caregiver-summary-info">

                <div className="small-label">
                  YOUR CAREGIVER
                </div>

                <h2>
                  {caregiver.name}
                </h2>

                <p>
                  {caregiver.specialization}
                </p>

                <div className="summary-location">
                  <LocationIcon />
                  {caregiver.location}
                </div>

              </div>

              <div className="summary-rating">
                <StarIcon />

                <strong>
                  {caregiver.rating.toFixed(1)}
                </strong>
              </div>

            </div>

            {/* DATE */}

            <div className="form-section">

              <div className="section-number">
                01
              </div>

              <div className="section-content">

                <h3>
                  Choose a date
                </h3>

                <p>
                  Select the day you would
                  like care.
                </p>

                <div className="input-wrapper">

                  <CalendarIcon />

                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>

            {/* TIME */}

            <div className="form-section">

              <div className="section-number">
                02
              </div>

              <div className="section-content">

                <h3>
                  Choose a time
                </h3>

                <p>
                  Select your preferred care
                  slot.
                </p>

                <div className="input-wrapper">

                  <ClockIcon />

                  <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>

            {/* AVAILABILITY */}

            <div className="availability-note">

              <span className="status-dot" />

              <div>

                <strong>
                  {caregiver.availability}
                </strong>

                <p>
                  Availability shown is based
                  on the current caregiver
                  schedule.
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <aside className="booking-summary">

            <div className="summary-label">
              BOOKING SUMMARY
            </div>

            <h2>
              Your care session
            </h2>

            <div className="summary-caregiver">

              {caregiver.image ? (
                <img
                  src={caregiver.image}
                  alt={caregiver.name}
                />
              ) : (
                <div className="summary-image-placeholder">
                  {caregiver.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>

                <strong>
                  {caregiver.name}
                </strong>

                <span>
                  {caregiver.specialization}
                </span>

              </div>

            </div>

            <div className="summary-line">

              <span>
                Date
              </span>

              <strong>

                {date
                  ? new Date(
                      date + "T00:00:00"
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Not selected"}

              </strong>

            </div>

            <div className="summary-line">

              <span>
                Time
              </span>

              <strong>
                {time ||
                  "Not selected"}
              </strong>

            </div>

            <div className="summary-line">

              <span>
                Duration
              </span>

              <strong>
                1 care slot
              </strong>

            </div>

            <div className="price-line">

              <span>
                Total
              </span>

              <strong>
                ₹
                {caregiver.price.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              className="confirm-button"
              onClick={handleConfirm}
            >
              Confirm Booking
              <ArrowIcon />
            </button>

            <div className="secure-note">
              ✓ Secure booking · No hidden
              charges
            </div>

          </aside>

        </section>

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .booking-page {
          position: relative;

          min-height: 100vh;

          overflow-x: hidden;

          background:
            radial-gradient(
              circle at 78% 4%,
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

        .booking-glow {
          position: absolute;

          width: 420px;
          height: 420px;

          top: -190px;
          left: 30%;

          border-radius: 50%;

          background:
            rgba(72,170,125,.09);

          filter: blur(110px);

          pointer-events: none;
        }

        .booking-shell {
          position: relative;

          z-index: 1;

          width:
            min(
              1050px,
              calc(100% - 40px)
            );

          margin: auto;

          padding:
            55px 0 90px;
        }

        .back-button {
          padding: 0;

          border: 0;

          background: transparent;

          color: #8fa199;

          font-size: .8rem;

          cursor: pointer;

          transition:
            color .2s ease;
        }

        .back-button:hover {
          color: #80c9a4;
        }

        /* HEADER */

        .booking-heading {
          max-width: 700px;

          margin:
            55px auto
            50px;

          text-align: center;
        }

        .eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 12px;

          color: #80c9a4;

          font-size: .67rem;

          font-weight: 700;

          letter-spacing: .2em;
        }

        .eyebrow::before,
        .eyebrow::after {
          content: "";

          width: 25px;
          height: 1px;

          background: #52b788;
        }

        .booking-heading h1 {
          margin:
            20px 0 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              3rem,
              6vw,
              5rem
            );

          font-weight: 400;

          line-height: 1;
        }

        .booking-heading h1 span {
          color: #b9cbbb;

          font-style: italic;
        }

        .booking-heading p {
          max-width: 550px;

          margin:
            22px auto
            0;

          color: #a9b8b0;

          font-size: .95rem;

          line-height: 1.7;
        }

        /* LAYOUT */

        .booking-layout {
          display: grid;

          grid-template-columns:
            1fr 340px;

          gap: 30px;

          align-items: start;
        }

        /* FORM */

        .booking-form {
          padding: 25px;

          border:
            1px solid
            rgba(202,230,214,.11);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.012)
            ),
            rgba(14,29,25,.76);

          box-shadow:
            0 25px 65px
            rgba(0,0,0,.22);
        }

        /* CAREGIVER */

        .caregiver-summary {
          display: flex;

          align-items: center;

          gap: 17px;

          padding-bottom: 25px;

          border-bottom:
            1px solid
            rgba(202,230,214,.09);
        }

        .caregiver-summary img {
          width: 78px;
          height: 78px;

          border-radius: 13px;

          object-fit: cover;
        }

        .image-placeholder {
          width: 78px;
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 13px;

          background:
            rgba(82,183,136,.12);

          border:
            1px solid
            rgba(82,183,136,.2);

          color: #80c9a4;

          font-family: Georgia, serif;

          font-size: 1.7rem;
        }

        .small-label {
          color: #71837a;

          font-size: .61rem;

          font-weight: 700;

          letter-spacing: .15em;
        }

        .caregiver-summary h2 {
          margin: 6px 0 3px;

          font-family:
            Georgia,
            serif;

          font-size: 1.35rem;

          font-weight: 400;
        }

        .caregiver-summary p {
          margin: 0;

          color: #80c9a4;

          font-size: .73rem;
        }

        .summary-location {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 7px;

          color: #71837a;

          font-size: .67rem;
        }

        .summary-location svg {
          width: 13px;
          height: 13px;

          color: #52b788;
        }

        .summary-rating {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-left: auto;

          color: #e2bc68;

          font-size: .8rem;
        }

        .summary-rating svg {
          width: 14px;
          height: 14px;
        }

        .summary-rating strong {
          color: #f1f3eb;
        }

        /* FORM SECTIONS */

        .form-section {
          display: flex;

          gap: 20px;

          padding:
            30px 0;

          border-bottom:
            1px solid
            rgba(202,230,214,.08);
        }

        .section-number {
          color: #52b788;

          font-size: .68rem;

          font-weight: 700;

          letter-spacing: .1em;
        }

        .section-content {
          flex: 1;
        }

        .section-content h3 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size: 1.3rem;

          font-weight: 400;
        }

        .section-content p {
          margin:
            7px 0
            18px;

          color: #71837a;

          font-size: .72rem;
        }

        .input-wrapper {
          display: flex;

          align-items: center;

          gap: 10px;

          width: 100%;

          padding:
            14px 15px;

          border:
            1px solid
            rgba(202,230,214,.11);

          border-radius: 10px;

          background:
            rgba(255,255,255,.025);

          transition:
            border-color .2s ease,
            background .2s ease;
        }

        .input-wrapper:focus-within {
          border-color:
            rgba(82,183,136,.4);

          background:
            rgba(82,183,136,.045);
        }

        .input-wrapper svg {
          width: 18px;
          height: 18px;

          color: #52b788;

          flex-shrink: 0;
        }

        .input-wrapper input {
          width: 100%;

          border: 0;

          outline: 0;

          background: transparent;

          color: #f1f3eb;

          font: inherit;

          font-size: .83rem;
        }

        .input-wrapper input::-webkit-calendar-picker-indicator {
          filter: invert(1);

          opacity: .55;

          cursor: pointer;
        }

        /* AVAILABILITY */

        .availability-note {
          display: flex;

          gap: 12px;

          margin-top: 25px;

          padding: 15px;

          border:
            1px solid
            rgba(82,183,136,.12);

          border-radius: 10px;

          background:
            rgba(82,183,136,.035);
        }

        .status-dot {
          width: 7px;
          height: 7px;

          margin-top: 5px;

          border-radius: 50%;

          background: #52b788;

          box-shadow:
            0 0 10px
            #52b788;

          flex-shrink: 0;
        }

        .availability-note strong {
          color: #80c9a4;

          font-size: .72rem;
        }

        .availability-note p {
          margin:
            4px 0 0;

          color: #71837a;

          font-size: .63rem;

          line-height: 1.5;
        }

        /* SUMMARY */

        .booking-summary {
          position: sticky;

          top: 25px;

          padding: 25px;

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

        .summary-label {
          color: #80c9a4;

          font-size: .62rem;

          font-weight: 700;

          letter-spacing: .17em;
        }

        .booking-summary h2 {
          margin:
            14px 0
            23px;

          font-family:
            Georgia,
            serif;

          font-size: 1.7rem;

          font-weight: 400;
        }

        .summary-caregiver {
          display: flex;

          align-items: center;

          gap: 12px;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            rgba(202,230,214,.08);
        }

        .summary-caregiver img {
          width: 50px;
          height: 50px;

          border-radius: 9px;

          object-fit: cover;
        }

        .summary-image-placeholder {
          width: 50px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

          background:
            rgba(82,183,136,.12);

          border:
            1px solid
            rgba(82,183,136,.2);

          color: #80c9a4;

          font-family: Georgia, serif;

          font-size: 1.2rem;
        }

        .summary-caregiver strong {
          display: block;

          font-size: .8rem;
        }

        .summary-caregiver span {
          display: block;

          margin-top: 4px;

          color: #80c9a4;

          font-size: .65rem;
        }

        .summary-line {
          display: flex;

          justify-content: space-between;

          gap: 20px;

          padding:
            14px 0;

          border-bottom:
            1px solid
            rgba(202,230,214,.06);

          color: #71837a;

          font-size: .7rem;
        }

        .summary-line strong {
          color: #dce7e1;

          font-weight: 500;

          text-align: right;
        }

        .price-line {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding-top: 20px;

          color: #a9b8b0;

          font-size: .75rem;
        }

        .price-line strong {
          color: #f1f3eb;

          font-size: 1.45rem;
        }

        .confirm-button {
          display: flex;

          width: 100%;

          align-items: center;
          justify-content: center;

          gap: 10px;

          margin-top: 22px;

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

          font-size: .77rem;

          font-weight: 700;

          cursor: pointer;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .confirm-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 14px 30px
            rgba(40,122,90,.28);
        }

        .confirm-button svg {
          width: 17px;
          height: 17px;
        }

        .secure-note {
          margin-top: 14px;

          color: #61746b;

          font-size: .59rem;

          text-align: center;
        }

        /* NOT FOUND */

        .not-found {
          display: flex;

          min-height: 100vh;

          align-items: center;
          justify-content: center;

          flex-direction: column;

          text-align: center;
        }

        .not-found h1 {
          font-family: Georgia, serif;

          font-weight: 400;
        }

        .not-found p {
          color: #71837a;
        }

        .not-found button {
          margin-top: 15px;

          padding: 10px 17px;

          border:
            1px solid
            rgba(82,183,136,.3);

          border-radius: 8px;

          background:
            rgba(82,183,136,.07);

          color: #80c9a4;

          cursor: pointer;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {

          .booking-layout {
            grid-template-columns: 1fr;
          }

          .booking-summary {
            position: relative;

            top: auto;
          }

        }

        @media (max-width: 600px) {

          .booking-shell {
            width:
              calc(100% - 28px);

            padding-top: 35px;
          }

          .booking-heading {
            margin-top: 45px;
          }

          .booking-heading h1 {
            font-size: 3rem;
          }

          .booking-form {
            padding: 18px;
          }

          .caregiver-summary {
            align-items: flex-start;
          }

          .caregiver-summary img,
          .image-placeholder {
            width: 65px;
            height: 65px;
          }

          .summary-rating {
            display: none;
          }

          .form-section {
            gap: 12px;
          }

        }

      `}</style>

    </main>
  );
}

export default Booking;