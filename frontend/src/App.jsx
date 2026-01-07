import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Tracker from "./pages/Tracker";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= BACKGROUND ================= */
function FloatingBackground() {
  return (
    <div className="bg-particles">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${18 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ================= NAV ================= */
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <strong>ExpenseTracker</strong>
      <div>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/tracker">Tracker</Link>
            <button onClick={logout} style={{ marginLeft: 16 }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}




/* ================= HOME ================= */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div>
        <h1>Expense Tracker</h1>
        <p>
          Tracking your personal budget helps you understand spending habits,
          avoid unnecessary expenses, and build long-term financial discipline.
        </p>
        <button onClick={() => navigate("/tracker")}>Get Started</button>
      </div>
    </div>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <>
      <FloatingBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
