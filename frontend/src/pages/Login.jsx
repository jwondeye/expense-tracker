import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setMessage("");

      if (!email || (!isSignup && !password)) {
        setError("Email and password required");
        return;
      }

      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      navigate("/tracker");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      setError("");
      setMessage("");

      if (!email) {
        setError("Enter your email first");
        return;
      }

      await resetPassword(email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="hero">
      <div>
        <h1>{isSignup ? "Create Account" : "Login"}</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        {!isSignup && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
          </>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}
        {message && <div style={{ color: "#22c55e" }}>{message}</div>}

        <button onClick={handleSubmit}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        {!isSignup && (
          <p
            style={{ marginTop: 12, cursor: "pointer", color: "#8b5cf6" }}
            onClick={handleReset}
          >
            Forgot password?
          </p>
        )}

        <p
          style={{ marginTop: 16, cursor: "pointer", color: "#8b5cf6" }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Need an account? Sign up"}
        </p>
      </div>
    </div>
  );
}
