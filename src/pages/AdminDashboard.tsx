import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Users,
  MapPin,
  IndianRupee,
  Star,
  Briefcase,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Caregiver {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  location?: string;
  experience?: number;
  qualifications?: string;
  price?: number;
  bio?: string;
  rating?: number;
  reviews?: number;
  verified?: boolean;
  availability?: string;
  startTime?: string;
  endTime?: string;
  expertise?: string[];
  services?: string[];
  languages?: string[];
  days?: string[];
  photo?: string;
  image?: string;
  createdAt?: string;
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] =
    useState<Caregiver | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD CAREGIVERS FROM BACKEND
  // =========================================================

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/caregivers"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch caregivers"
        );
      }

      /*
        Backend response expected:

        {
          status: "success",
          count: 1,
          caregivers: [...]
        }
      */

      const backendCaregivers = Array.isArray(data?.caregivers)
        ? data.caregivers
        : [];

      const formattedCaregivers: Caregiver[] =
        backendCaregivers.map((caregiver: any) => ({
          id: String(
            caregiver.id ??
              caregiver.caregiver_id ??
              ""
          ),

          name:
            caregiver.name ??
            caregiver.caregiver_name ??
            "Unnamed Caregiver",

          email:
            caregiver.email ??
            caregiver.caregiver_email,

          phone:
            caregiver.phone ??
            caregiver.caregiver_phone,

          city:
            caregiver.city ??
            caregiver.location,

          location:
            caregiver.location ??
            caregiver.city,

          experience:
            caregiver.experience != null
              ? Number(caregiver.experience)
              : 0,

          qualifications:
            caregiver.qualifications ??
            caregiver.qualification,

          price:
            caregiver.price != null
              ? Number(caregiver.price)
              : 0,

          bio: caregiver.bio,

          rating:
            caregiver.rating != null
              ? Number(caregiver.rating)
              : 0,

          reviews:
            caregiver.reviews != null
              ? Number(caregiver.reviews)
              : caregiver.review_count != null
              ? Number(caregiver.review_count)
              : 0,

          verified:
            caregiver.verified === true ||
            caregiver.verified === 1,

          availability:
            caregiver.availability ??
            caregiver.availability_status,

          startTime:
            caregiver.startTime ??
            caregiver.start_time,

          endTime:
            caregiver.endTime ??
            caregiver.end_time,

          expertise: Array.isArray(caregiver.expertise)
            ? caregiver.expertise
            : [],

          services: Array.isArray(caregiver.services)
            ? caregiver.services
            : [],

          languages: Array.isArray(caregiver.languages)
            ? caregiver.languages
            : [],

          days: Array.isArray(caregiver.days)
            ? caregiver.days
            : Array.isArray(caregiver.working_days)
            ? caregiver.working_days
            : [],

          photo:
            caregiver.photo ??
            caregiver.image,

          image:
            caregiver.image ??
            caregiver.photo,

          createdAt:
            caregiver.createdAt ??
            caregiver.created_at,
        }));

      setCaregivers(formattedCaregivers);
    } catch (err: any) {
      console.error("Fetch caregivers error:", err);

      setError(
        err?.message ||
          "Unable to connect to Care-Connect backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE CAREGIVER
  // =========================================================

  const handleDeleteCaregiver = async (caregiverId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this caregiver? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication token not found."
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/caregivers/${caregiverId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete caregiver"
        );
      }

      // Remove deleted caregiver from UI
      setCaregivers((current) =>
        current.filter(
          (caregiver) =>
            caregiver.id !== String(caregiverId)
        )
      );

      // Close modal if deleted caregiver was being viewed
      if (
        selectedCaregiver?.id ===
        String(caregiverId)
      ) {
        setSelectedCaregiver(null);
      }

    } catch (err: any) {
      console.error(
        "Delete caregiver error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete caregiver."
      );
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCaregivers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return caregivers;
    }

    return caregivers.filter((caregiver) => {
      const name =
        caregiver.name?.toLowerCase() || "";

      const email =
        caregiver.email?.toLowerCase() || "";

      const city =
        caregiver.city?.toLowerCase() ||
        caregiver.location?.toLowerCase() ||
        "";

      const qualifications =
        caregiver.qualifications?.toLowerCase() ||
        "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        city.includes(query) ||
        qualifications.includes(query)
      );
    });
  }, [caregivers, searchQuery]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalCaregivers = caregivers.length;

  const verifiedCaregivers = caregivers.filter(
    (caregiver) => caregiver.verified
  ).length;

  const availableCaregivers = caregivers.filter(
    (caregiver) =>
      caregiver.availability
        ?.toLowerCase()
        .includes("available")
  ).length;

  const averageRating =
    caregivers.length > 0
      ? (
          caregivers.reduce(
            (sum, caregiver) =>
              sum + (caregiver.rating || 0),
            0
          ) / caregivers.length
        ).toFixed(1)
      : "0.0";

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute top-[40%] -left-40 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="absolute bottom-0 right-[20%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <ArrowLeft size={20} />
              </motion.button>

              <div>
                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={22}
                    className="text-cyan-400"
                  />

                  <h1 className="text-xl font-semibold">
                    Care-Connect Admin
                  </h1>

                </div>

                <p className="text-sm text-white/50 mt-1">
                  Platform management dashboard
                </p>
              </div>

            </div>

            {/* Refresh */}
            <button
              onClick={fetchCaregivers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
            >
              <RefreshCw
                size={16}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-cyan-400 text-sm font-medium mb-2">
            CONTROL CENTER
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Manage Care-Connect
          </h2>

          <p className="text-white/50 mt-2 max-w-2xl">
            View and manage caregivers registered in
            the Care-Connect backend.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-red-300">
            <p className="font-medium">
              Backend connection error
            </p>

            <p className="text-sm mt-1 text-red-200/70">
              {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <StatCard
            icon={<Users size={20} />}
            label="Total Caregivers"
            value={totalCaregivers}
            delay={0}
          />

          <StatCard
            icon={<ShieldCheck size={20} />}
            label="Verified"
            value={verifiedCaregivers}
            delay={0.05}
          />

          <StatCard
            icon={<Briefcase size={20} />}
            label="Available"
            value={availableCaregivers}
            delay={0.1}
          />

          <StatCard
            icon={<Star size={20} />}
            label="Average Rating"
            value={averageRating}
            delay={0.15}
          />

        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="mb-6"
        >
          <div className="relative max-w-xl">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search caregivers by name, email, city..."
              className="w-full h-13 pl-12 pr-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-white placeholder:text-white/30 outline-none focus:border-cyan-400/40 focus:bg-white/[0.06] transition"
            />

          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-cyan-400 mb-4"
            />

            <p className="text-white/60">
              Loading caregivers from backend...
            </p>

          </div>
        ) : filteredCaregivers.length === 0 ? (

          /* Empty */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center"
          >

            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-5">

              <Users
                size={28}
                className="text-white/30"
              />

            </div>

            <h3 className="text-xl font-semibold">
              {caregivers.length === 0
                ? "No caregivers registered"
                : "No caregivers found"}
            </h3>

            <p className="text-white/40 mt-2">
              {caregivers.length === 0
                ? "No caregiver records were returned by the backend."
                : "Try changing your search."}
            </p>

          </motion.div>

        ) : (

          /* Caregiver List */
          <div className="space-y-4">

            {filteredCaregivers.map(
              (caregiver, index) => (

                <motion.div
                  key={caregiver.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.055] backdrop-blur-xl p-5 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                    {/* Avatar */}
                    <div className="shrink-0">

                      {caregiver.photo ||
                      caregiver.image ? (

                        <img
                          src={
                            caregiver.photo ||
                            caregiver.image
                          }
                          alt={caregiver.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                        />

                      ) : (

                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-white/10 flex items-center justify-center">

                          <span className="text-2xl font-bold text-cyan-300">
                            {caregiver.name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </span>

                        </div>

                      )}

                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-lg font-semibold">
                          {caregiver.name ||
                            "Unnamed Caregiver"}
                        </h3>

                        {caregiver.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">

                            <ShieldCheck size={12} />

                            Verified

                          </span>
                        )}

                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-white/50">

                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />

                          {caregiver.city ||
                            caregiver.location ||
                            "Location not provided"}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Briefcase size={15} />

                          {caregiver.experience ?? 0}{" "}
                          years experience
                        </span>

                        <span className="flex items-center gap-1.5">
                          <IndianRupee size={15} />

                          {caregiver.price ?? 0}
                          /slot
                        </span>

                        <span className="flex items-center gap-1.5">

                          <Star
                            size={15}
                            className="text-yellow-400"
                          />

                          {caregiver.rating
                            ? caregiver.rating
                            : "New"}

                        </span>

                      </div>

                      {caregiver.email && (
                        <p className="text-xs text-white/35 mt-3">
                          {caregiver.email}
                        </p>
                      )}

                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-3">

                      <span className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-emerald-400/10 text-emerald-300 border border-emerald-400/15 text-xs">
                        {caregiver.availability ||
                          "Availability not set"}
                      </span>

                      {/* View */}
                      <button
                        onClick={() =>
                          setSelectedCaregiver(
                            caregiver
                          )
                        }
                        className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition"
                      >
                        View
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDeleteCaregiver(
                            caregiver.id
                          )
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-400/20 bg-red-400/10 hover:bg-red-400/20 text-red-300 text-sm transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                </motion.div>
              )
            )}

          </div>

        )}

        {/* Backend notice */}
        <div className="mt-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">

          <div className="flex gap-3">

            <ShieldCheck
              size={20}
              className="text-cyan-300 shrink-0 mt-0.5"
            />

            <div>

              <p className="text-sm font-medium text-cyan-200">
                Connected to Care-Connect backend
              </p>

              <p className="text-xs text-white/40 mt-1">
                Caregiver information is loaded from
                the MySQL-backed API instead of
                browser localStorage.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* Details Modal */}
      {selectedCaregiver && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-5"
          onClick={() =>
            setSelectedCaregiver(null)
          }
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1728] shadow-2xl"
          >

            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-cyan-400 text-xs font-medium">
                    CAREGIVER PROFILE
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    {selectedCaregiver.name}
                  </h3>

                </div>

                <button
                  onClick={() =>
                    setSelectedCaregiver(null)
                  }
                  className="text-white/40 hover:text-white text-2xl"
                >
                  ×
                </button>

              </div>

            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">

              {/* Basic Information */}
              <div className="grid sm:grid-cols-2 gap-4">

                <InfoItem
                  label="Email"
                  value={
                    selectedCaregiver.email ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Phone"
                  value={
                    selectedCaregiver.phone ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Location"
                  value={
                    selectedCaregiver.city ||
                    selectedCaregiver.location ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Experience"
                  value={`${selectedCaregiver.experience ?? 0} years`}
                />

                <InfoItem
                  label="Price"
                  value={`₹${selectedCaregiver.price ?? 0} / slot`}
                />

                <InfoItem
                  label="Rating"
                  value={
                    selectedCaregiver.rating
                      ? `${selectedCaregiver.rating} (${selectedCaregiver.reviews ?? 0} reviews)`
                      : "New caregiver"
                  }
                />

              </div>

              {/* Qualifications */}
              {selectedCaregiver.qualifications && (
                <div>

                  <p className="text-xs uppercase tracking-wider text-white/30 mb-2">
                    Qualifications
                  </p>

                  <p className="text-white/70">
                    {selectedCaregiver.qualifications}
                  </p>

                </div>
              )}

              {/* Bio */}
              {selectedCaregiver.bio && (
                <div>

                  <p className="text-xs uppercase tracking-wider text-white/30 mb-2">
                    About
                  </p>

                  <p className="text-white/60 leading-relaxed">
                    {selectedCaregiver.bio}
                  </p>

                </div>
              )}

              {/* Expertise */}
              {selectedCaregiver.expertise &&
                selectedCaregiver.expertise.length >
                  0 && (

                  <TagSection
                    title="Expertise"
                    items={
                      selectedCaregiver.expertise
                    }
                  />

                )}

              {/* Services */}
              {selectedCaregiver.services &&
                selectedCaregiver.services.length >
                  0 && (

                  <TagSection
                    title="Services"
                    items={
                      selectedCaregiver.services
                    }
                  />

                )}

              {/* Languages */}
              {selectedCaregiver.languages &&
                selectedCaregiver.languages.length >
                  0 && (

                  <TagSection
                    title="Languages"
                    items={
                      selectedCaregiver.languages
                    }
                  />

                )}

              {/* Schedule */}
              <div className="grid sm:grid-cols-2 gap-4">

                <InfoItem
                  label="Working Days"
                  value={
                    selectedCaregiver.days?.join(
                      ", "
                    ) || "Not provided"
                  }
                />

                <InfoItem
                  label="Working Hours"
                  value={
                    selectedCaregiver.startTime &&
                    selectedCaregiver.endTime
                      ? `${selectedCaregiver.startTime} - ${selectedCaregiver.endTime}`
                      : "Not provided"
                  }
                />

              </div>

            </div>

          </motion.div>

        </div>

      )}

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
      className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5"
    >

      <div className="flex items-center justify-between">

        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center">
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold mt-4">
        {value}
      </p>

      <p className="text-sm text-white/40 mt-1">
        {label}
      </p>

    </motion.div>
  );
}

// =========================================================
// INFO ITEM
// =========================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p className="text-xs uppercase tracking-wider text-white/30 mb-1">
        {label}
      </p>

      <p className="text-sm text-white/70 break-words">
        {value}
      </p>

    </div>
  );
}

// =========================================================
// TAG SECTION
// =========================================================

function TagSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>

      <p className="text-xs uppercase tracking-wider text-white/30 mb-2">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">

        {items.map((item, index) => (

          <span
            key={`${item}-${index}`}
            className="px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/15 text-xs text-cyan-200"
          >
            {item}
          </span>

        ))}

      </div>

    </div>
  );
}

export default AdminDashboard;