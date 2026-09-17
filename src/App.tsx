import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import CaregiverProfile from "./pages/CaregiverProfile";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import CareRequirement from "./pages/CareRequirement";

// Authentication
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Registration
import CaregiverSignup from "./pages/CaregiverSignup";
import SeekerSignup from "./pages/SeekerSignup";

// Caregiver
import CaregiverDashboard from "./pages/CaregiverDashboard";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            LANDING
        ===================================== */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* =====================================
            CARE SEEKER FLOW
        ===================================== */}
        <Route
          path="/careRequirement"
          element={<CareRequirement />}
        />

        <Route
          path="/carerequirement"
          element={<CareRequirement />}
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/caregiver/:id"
          element={<CaregiverProfile />}
        />

        <Route
          path="/booking/:id"
          element={<Booking />}
        />

        <Route
          path="/confirmation"
          element={<Confirmation />}
        />

        {/* =====================================
            AUTHENTICATION
        ===================================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* =====================================
            CARE SEEKER REGISTRATION
        ===================================== */}
        <Route
          path="/signup/seeker"
          element={<SeekerSignup />}
        />

        {/* =====================================
            CAREGIVER REGISTRATION
        ===================================== */}
        <Route
          path="/signup/caregiver"
          element={<CaregiverSignup />}
        />

        {/* =====================================
            CAREGIVER DASHBOARD
        ===================================== */}
        <Route
          path="/caregiver-dashboard"
          element={<CaregiverDashboard />}
        />

        {/* =====================================
            ADMIN DASHBOARD
        ===================================== */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;