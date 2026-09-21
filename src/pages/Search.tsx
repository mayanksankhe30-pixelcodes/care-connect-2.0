import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Specialization =
  | "Elderly Care"
  | "Patient Care"
  | "Post-Surgery Care"
  | "Child Care"
  | "Disability Care"
  | "Home Nursing";

type Availability =
  | "Available today"
  | "Available tomorrow"
  | "Weekdays"
  | "Weekends";

type SortOption =
  | "recommended"
  | "highest-rated"
  | "lowest-price"
  | "most-experienced";

interface Caregiver {
  id: string;
  name: string;
  specialization: Specialization;
  location: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  availability: Availability;
  image: string;
  verified: boolean;
}

interface SearchFilters {
  location: string;
  specialization: Specialization | "";
  maximumBudget: string;
  availability: Availability | "";
}

const SPECIALIZATIONS: Specialization[] = [
  "Elderly Care",
  "Patient Care",
  "Post-Surgery Care",
  "Child Care",
  "Disability Care",
  "Home Nursing",
];

const AVAILABILITY_OPTIONS: Availability[] = [
  "Available today",
  "Available tomorrow",
  "Weekdays",
  "Weekends",
];

const INITIAL_FILTERS: SearchFilters = {
  location: "",
  specialization: "",
  maximumBudget: "",
  availability: "",
};

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
      />
      <circle cx="12" cy="10" r="2.25" strokeWidth="1.8" />
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        d="m7.5 12 3 3 6-6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M5 12h14m-5-5 5 5-5 5"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="6.5" strokeWidth="1.7" />
      <path strokeLinecap="round" strokeWidth="1.7" d="m16 16 4 4" />
    </svg>
  );
}

function CaregiverCard({
  caregiver,
  onViewProfile,
}: {
  caregiver: Caregiver;
  onViewProfile: (id: string) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.4 }}
      className="caregiver-card"
    >
      <div className="card-image">
        {caregiver.image ? (
          <img
            src={caregiver.image}
            alt={caregiver.name}
            loading="lazy"
          />
        ) : (
          <div className="card-image-placeholder">
            {caregiver.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}

        <div className="image-overlay" />

        <div className="availability">
          <span />
          {caregiver.availability}
        </div>
      </div>

      <div className="card-body">
        <div className="card-top">
          <div>
            <div className="name-row">
              <h3>{caregiver.name}</h3>

              {caregiver.verified && (
                <span className="verified">
                  <CheckIcon />
                </span>
              )}
            </div>

            <p className="specialization">
              {caregiver.specialization}
            </p>
          </div>

          <div className="rating">
            {caregiver.reviews > 0 ? (
              <>
                <StarIcon />
                <strong>{caregiver.rating.toFixed(1)}</strong>
              </>
            ) : (
              <strong className="new-rating">New</strong>
            )}
          </div>
        </div>

        <div className="card-details">
          <span>
            <LocationIcon />
            {caregiver.location}
          </span>

          <i />

          <span>
            <strong>{caregiver.experience}</strong> years experience
          </span>
        </div>

        <div className="card-bottom">
          <div>
            <div className="price">
              ₹{caregiver.price.toLocaleString("en-IN")}
              <small>/ slot</small>
            </div>

            <div className="reviews">
              {caregiver.reviews > 0
                ? `${caregiver.reviews} verified reviews`
                : "New caregiver profile"}
            </div>
          </div>

          <motion.button
            type="button"
            className="profile-button"
            onClick={() => onViewProfile(caregiver.id)}
            whileTap={{ scale: 0.96 }}
          >
            View Profile
            <ArrowIcon />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function Search() {
  const navigate = useNavigate();

  const [filters, setFilters] =
    useState<SearchFilters>(INITIAL_FILTERS);

  const [sortOption, setSortOption] =
    useState<SortOption>("recommended");

  const [registeredCaregivers, setRegisteredCaregivers] = useState<Caregiver[]>([]);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const response = await fetch(
          "https://care-connect-2-0-111.onrender.com/api/caregivers"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch caregivers");
        }

        const data = await response.json();

        const caregivers: Caregiver[] = (data.caregivers || []).map(
          (caregiver: any) => ({
            id: String(caregiver.caregiver_id),
            name: caregiver.name,
            specialization: caregiver.specialization || "Elderly Care",
            location: caregiver.city || "",
            experience: Number(caregiver.experience) || 0,
            rating: Number(caregiver.rating) || 0,
            reviews: Number(caregiver.reviews) || 0,
            price: Number(caregiver.price) || 0,
            availability: "Available today",
            image: caregiver.photo || "",
            verified: Boolean(caregiver.verified),
          })
        );

        setRegisteredCaregivers(caregivers);
      } catch (error) {
        console.error("Failed to load caregivers:", error);
        setRegisteredCaregivers([]);
      }
    };

    fetchCaregivers();
  }, []);

  const filteredCaregivers = useMemo(() => {
    const location = filters.location.trim().toLowerCase();

    const budget = Number(filters.maximumBudget);

    const results = registeredCaregivers.filter((caregiver) => {
      const locationMatch =
        !location ||
        caregiver.location.toLowerCase().includes(location);

      const specializationMatch =
        !filters.specialization ||
        caregiver.specialization === filters.specialization;

      const budgetMatch =
        !filters.maximumBudget ||
        Number.isNaN(budget) ||
        caregiver.price <= budget;

      const availabilityMatch =
        !filters.availability ||
        caregiver.availability === filters.availability;

      return (
        locationMatch &&
        specializationMatch &&
        budgetMatch &&
        availabilityMatch
      );
    });

    return [...results].sort((a, b) => {
      switch (sortOption) {
        case "highest-rated":
          return b.rating - a.rating || b.reviews - a.reviews;

        case "lowest-price":
          return a.price - b.price;

        case "most-experienced":
          return b.experience - a.experience;

        default:
          return (
            Number(b.verified) - Number(a.verified) ||
            b.rating - a.rating ||
            b.reviews - a.reviews
          );
      }
    });
  }, [filters, sortOption, registeredCaregivers]);

  const updateFilter = (
    key: keyof SearchFilters,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSortOption("recommended");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleViewProfile = (id: string) => {
    navigate(`/caregiver/${encodeURIComponent(id)}`);
  };

  return (
    <main className="search-page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="grid-bg" />

      <section className="search-shell">

        {/* HEADER */}

        <motion.header
          className="hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow">
            CARE DISCOVERY
          </div>

          <h1>
            Find the right
            <span> caregiver.</span>
          </h1>

          <p>
            Discover trusted caregivers based on your location,
            care requirements, availability and budget.
          </p>
        </motion.header>

        {/* FILTER PANEL */}

        <motion.form
          className="filter-panel"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="field">
            <label>Location</label>

            <div className="field-control">
              <LocationIcon />

              <input
                value={filters.location}
                onChange={(e) =>
                  updateFilter("location", e.target.value)
                }
                placeholder="e.g. Nashik"
              />
            </div>
          </div>

          <div className="field">
            <label>Specialization</label>

            <select
              value={filters.specialization}
              onChange={(e) =>
                updateFilter(
                  "specialization",
                  e.target.value
                )
              }
            >
              <option value="">
                Any specialization
              </option>

              {SPECIALIZATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Maximum Budget</label>

            <div className="budget-input">
              <span>₹</span>

              <input
                type="number"
                min="0"
                value={filters.maximumBudget}
                onChange={(e) =>
                  updateFilter(
                    "maximumBudget",
                    e.target.value
                  )
                }
                placeholder="1000"
              />
            </div>
          </div>

          <div className="field">
            <label>Availability</label>

            <select
              value={filters.availability}
              onChange={(e) =>
                updateFilter(
                  "availability",
                  e.target.value
                )
              }
            >
              <option value="">
                Any availability
              </option>

              {AVAILABILITY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            type="submit"
            className="search-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <SearchIcon />
            Search
          </motion.button>
        </motion.form>

        {/* RESULTS HEADER */}

        <motion.div
          className="results-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="results-label">
              CAREGIVER DIRECTORY
            </p>

            <h2>
              {filteredCaregivers.length} caregivers found
            </h2>
          </div>

          <div className="sort-area">
            <label>Sort by</label>

            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value as SortOption
                )
              }
            >
              <option value="recommended">
                Recommended
              </option>

              <option value="highest-rated">
                Highest rated
              </option>

              <option value="lowest-price">
                Lowest price
              </option>

              <option value="most-experienced">
                Most experienced
              </option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </motion.div>

        {/* CAREGIVER GRID */}

        <AnimatePresence mode="popLayout">
          {filteredCaregivers.length > 0 ? (
            <motion.div
              className="caregiver-grid"
              layout
            >
              {filteredCaregivers.map((caregiver) => (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-icon">
                <SearchIcon />
              </div>

              <h3>No caregivers found</h3>

              <p>
                Try changing your location, budget,
                specialization or availability.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER NOTE */}

        <div className="directory-note">
          <span />
          Showing caregivers who have registered with Care-Connect.
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .search-page {
          --bg: #07110f;
          --surface: rgba(14, 29, 25, 0.82);
          --surface-2: rgba(19, 38, 32, 0.92);
          --border: rgba(202, 230, 214, 0.12);
          --border-strong: rgba(82, 183, 136, 0.35);

          --text: #f1f3eb;
          --soft: #a9b8b0;
          --muted: #71837a;

          --green: #52b788;
          --green-light: #80c9a4;
          --sage: #b9cbbb;
          --gold: #e2bc68;

          position: relative;
          min-height: 100vh;
          overflow-x: hidden;

          background:
            radial-gradient(
              circle at 80% 5%,
              rgba(48, 145, 104, 0.16),
              transparent 30rem
            ),
            radial-gradient(
              circle at 5% 45%,
              rgba(40, 105, 88, 0.10),
              transparent 28rem
            ),
            var(--bg);

          color: var(--text);

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .grid-bg {
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.28;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            );

          background-size: 72px 72px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 75%
            );
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
        }

        .glow-one {
          width: 420px;
          height: 420px;
          top: -220px;
          left: 30%;
          background: rgba(58, 167, 116, 0.10);
        }

        .glow-two {
          width: 300px;
          height: 300px;
          top: 45%;
          right: -160px;
          background: rgba(48, 135, 104, 0.08);
        }

        .search-shell {
          position: relative;
          z-index: 1;

          width: min(
            1180px,
            calc(100% - 40px)
          );

          margin: auto;

          padding:
            90px 0
            80px;
        }

        /* HERO */

        .hero {
          max-width: 800px;
          margin: auto;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 24px;

          color: var(--green-light);

          font-size: 0.7rem;
          font-weight: 700;

          letter-spacing: 0.22em;
        }

        .eyebrow::before,
        .eyebrow::after {
          content: "";

          width: 25px;
          height: 1px;

          background: var(--green);
        }

        .hero h1 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(3rem, 7vw, 5.7rem);

          font-weight: 400;
          line-height: 0.98;
        }

        .hero h1 span {
          color: var(--sage);
          font-style: italic;
        }

        .hero p {
          max-width: 650px;

          margin:
            28px auto
            0;

          color: var(--soft);

          font-size:
            clamp(1rem, 2vw, 1.1rem);

          line-height: 1.75;
        }

        /* FILTER */

        .filter-panel {
          display: grid;

          grid-template-columns:
            1.25fr
            1.25fr
            .85fr
            1.1fr
            auto;

          gap: 8px;

          margin-top: 55px;

          padding: 12px;

          border:
            1px solid
            var(--border);

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.015)
            ),
            var(--surface);

          box-shadow:
            0 30px 80px
            rgba(0,0,0,.35);

          backdrop-filter:
            blur(22px);
        }

        .field {
          min-width: 0;

          padding:
            15px 16px;

          border-radius: 11px;

          transition:
            .2s ease;
        }

        .field:focus-within {
          background:
            rgba(82,183,136,.055);

          border:
            1px solid
            var(--border-strong);
        }

        .field label {
          display: block;

          margin-bottom: 9px;

          color: var(--muted);

          font-size: .65rem;
          font-weight: 700;

          letter-spacing: .14em;

          text-transform: uppercase;
        }

        .field-control,
        .budget-input {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .field-control svg {
          width: 17px;
          height: 17px;

          color: var(--green);

          flex-shrink: 0;
        }

        .field input,
        .field select {
          width: 100%;

          padding: 0;

          border: 0;
          outline: none;

          background: transparent;

          color: var(--text);

          font: inherit;
          font-size: .88rem;
        }

        .field input::placeholder {
          color: var(--muted);
        }

        .field select {
          cursor: pointer;

          appearance: none;

          padding-right: 20px;

          background-image:
            linear-gradient(
              45deg,
              transparent 50%,
              #7f968a 50%
            ),
            linear-gradient(
              135deg,
              #7f968a 50%,
              transparent 50%
            );

          background-position:
            calc(100% - 10px) 50%,
            calc(100% - 6px) 50%;

          background-size:
            4px 4px,
            4px 4px;

          background-repeat: no-repeat;
        }

        .field option,
        .sort-area option {
          background: #10201c;
          color: var(--text);
        }

        .budget-input span {
          color: var(--green);
          font-weight: 700;
        }

        .search-button {
          display: flex;

          min-height: 70px;

          align-items: center;
          justify-content: center;

          gap: 10px;

          padding:
            0 25px;

          border:
            1px solid
            rgba(163,221,190,.25);

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #4eaa7f,
              #327d5d
            );

          color: white;

          font-size: .88rem;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 12px 28px
            rgba(38,125,89,.22);
        }

        .search-button svg {
          width: 18px;
          height: 18px;
        }

        /* RESULTS HEADER */

        .results-header {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;

          margin-top: 75px;
          margin-bottom: 25px;
        }

        .results-label {
          margin: 0 0 8px;

          color: var(--green-light);

          font-size: .65rem;
          font-weight: 700;

          letter-spacing: .17em;
        }

        .results-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 2rem;
          font-weight: 400;
        }

        .sort-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sort-area label {
          color: var(--muted);
          font-size: .78rem;
        }

        .sort-area select {
          padding:
            10px 34px 10px 13px;

          border:
            1px solid
            var(--border);

          border-radius: 9px;

          background: var(--surface-2);

          color: var(--text);

          outline: none;

          cursor: pointer;
        }

        .sort-area button {
          padding: 10px 0;

          border: 0;

          background: transparent;

          color: var(--green-light);

          font-size: .78rem;

          cursor: pointer;
        }

        /* GRID */

        .caregiver-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        /* CARD */

        .caregiver-card {
          overflow: hidden;

          border:
            1px solid
            var(--border);

          border-radius: 17px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.012)
            ),
            var(--surface);

          box-shadow:
            0 20px 50px
            rgba(0,0,0,.20);

          transition:
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .caregiver-card:hover {
          border-color:
            rgba(82,183,136,.28);

          box-shadow:
            0 28px 65px
            rgba(0,0,0,.35);
        }

        .card-image {
          position: relative;

          height: 245px;

          overflow: hidden;
        }

        .card-image img,
        .card-image-placeholder {
          width: 100%;
          height: 100%;

          object-fit: cover;

          transition:
            transform .5s ease;
        }

        .card-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(185,203,187,.18),
              transparent 38%
            ),
            #18251f;

          color: var(--sage);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 3.8rem;
          letter-spacing: .08em;
        }

        .caregiver-card:hover
        .card-image img,
        .caregiver-card:hover
        .card-image-placeholder {
          transform: scale(1.045);
        }

        .image-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              transparent 45%,
              rgba(0,0,0,.48)
            );
        }

        .availability {
          position: absolute;

          top: 14px;
          left: 14px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding:
            8px 11px;

          border:
            1px solid
            rgba(255,255,255,.13);

          border-radius: 999px;

          background:
            rgba(7,17,15,.72);

          color: #d9e7df;

          font-size: .67rem;
          font-weight: 700;

          backdrop-filter:
            blur(10px);
        }

        .availability span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: var(--green);

          box-shadow:
            0 0 9px
            var(--green);
        }

        .card-body {
          padding: 21px;
        }

        .card-top {
          display: flex;

          justify-content: space-between;

          gap: 12px;
        }

        .name-row {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .name-row h3 {
          margin: 0;

          font-size: 1.03rem;
          font-weight: 650;
        }

        .verified {
          display: flex;

          width: 18px;
          height: 18px;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(82,183,136,.17);

          color: var(--green-light);
        }

        .verified svg {
          width: 11px;
          height: 11px;
        }

        .specialization {
          margin: 5px 0 0;

          color: var(--green-light);

          font-size: .76rem;
        }

        .rating {
          display: flex;
          align-items: center;

          gap: 5px;

          color: var(--gold);

          font-size: .8rem;
        }

        .rating svg {
          width: 14px;
          height: 14px;
        }

        .rating strong {
          color: var(--text);
        }

        .new-rating {
          color: var(--green-light) !important;
          font-size: .72rem;
          font-weight: 700;
        }

        .card-details {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-top: 20px;

          color: var(--soft);

          font-size: .73rem;
        }

        .card-details span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .card-details svg {
          width: 14px;
          height: 14px;

          color: var(--green);
        }

        .card-details i {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: var(--muted);
        }

        .card-details strong {
          color: var(--text);
        }

        .card-bottom {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 15px;

          margin-top: 23px;

          padding-top: 17px;

          border-top:
            1px solid
            var(--border);
        }

        .price {
          color: var(--text);

          font-size: 1.05rem;
          font-weight: 700;
        }

        .price small {
          color: var(--muted);

          font-size: .7rem;
          font-weight: 400;
        }

        .reviews {
          margin-top: 4px;

          color: var(--muted);

          font-size: .66rem;
        }

        .profile-button {
          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            9px 12px;

          border:
            1px solid
            var(--border);

          border-radius: 8px;

          background:
            rgba(255,255,255,.025);

          color: var(--text);

          font-size: .72rem;
          font-weight: 650;

          cursor: pointer;

          transition:
            background .2s ease,
            border-color .2s ease;
        }

        .profile-button:hover {
          background:
            rgba(82,183,136,.08);

          border-color:
            var(--border-strong);
        }

        .profile-button svg {
          width: 15px;
          height: 15px;

          color: var(--green-light);
        }

        /* EMPTY */

        .empty-state {
          padding: 80px 20px;

          text-align: center;

          border:
            1px solid
            var(--border);

          border-radius: 18px;

          background:
            rgba(255,255,255,.025);
        }

        .empty-icon {
          display: flex;

          width: 55px;
          height: 55px;

          margin: auto;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(82,183,136,.08);

          color: var(--green);
        }

        .empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .empty-state h3 {
          margin: 18px 0 8px;

          font-family: Georgia, serif;

          font-size: 1.5rem;
          font-weight: 400;
        }

        .empty-state p {
          margin: 0 auto 22px;

          max-width: 450px;

          color: var(--soft);

          font-size: .85rem;
          line-height: 1.6;
        }

        .empty-state button {
          padding:
            10px 17px;

          border:
            1px solid
            var(--border-strong);

          border-radius: 8px;

          background:
            rgba(82,183,136,.07);

          color: var(--green-light);

          cursor: pointer;
        }

        /* NOTE */

        .directory-note {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          margin-top: 45px;

          color: var(--muted);

          font-size: .68rem;

          text-align: center;
        }

        .directory-note span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: var(--green);
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .filter-panel {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .search-button {
            min-height: 58px;
          }

          .caregiver-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .search-shell {
            width:
              min(
                100% - 28px,
                1180px
              );

            padding-top: 60px;
          }

          .hero h1 {
            font-size: 3.2rem;
          }

          .filter-panel {
            grid-template-columns: 1fr;

            margin-top: 35px;
          }

          .search-button {
            min-height: 56px;
          }

          .results-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .sort-area {
            flex-wrap: wrap;
          }

          .caregiver-grid {
            grid-template-columns: 1fr;
          }

          .card-image {
            height: 260px;
          }
        }

        @media (max-width: 430px) {
          .hero h1 {
            font-size: 2.8rem;
          }

          .card-image {
            height: 230px;
          }

          .card-bottom {
            align-items: flex-start;

            flex-direction: column;
          }

          .profile-button {
            width: 100%;

            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}

export default Search;