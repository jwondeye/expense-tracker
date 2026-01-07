import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      setError("");
      setMessage("");

      if (!email) {
        setError("Please enter your email");
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
        <h1>Reset Password</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        {error && <div style={{ color: "red" }}>{error}</div>}
        {message && <div style={{ color: "#22c55e" }}>{message}</div>}

        <button onClick={handleReset}>Send Reset Email</button>
      </div>
    </div>
  );
}
