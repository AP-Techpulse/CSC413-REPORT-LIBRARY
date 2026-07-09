import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/delsu-logo.png";
import { isSupabaseConfigured } from "../supabaseClient.js";

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Could not sign in. Check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card page-fade">
        <Link to="/" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          Back to the library
        </Link>
        <div className="auth-logo"><img src={logo} alt="DELSU crest" /></div>
        <h2>Admin Login</h2>
        <p className="auth-sub">Sign in to upload or manage CSC 413 group reports.</p>

        {!isSupabaseConfigured && (
          <div className="form-error">Backend not connected yet. Add your Supabase environment variables before logging in.</div>
        )}
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-admin btn-block" disabled={busy || !isSupabaseConfigured}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
