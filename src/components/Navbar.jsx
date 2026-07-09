import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import logo from "../assets/delsu-logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAdmin } = useAuth();
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="topnav-brand">
          <div className="topnav-logo"><img src={logo} alt="DELSU crest" /></div>
          <div className="topnav-title">
            CSC 413 Report Library
            <span>Delta State University, Abraka</span>
          </div>
        </Link>
        <div className="topnav-actions">
          <ThemeToggle />
          {isAdmin ? (
            <Link to="/admin" className="btn btn-admin btn-sm">Admin Dashboard</Link>
          ) : (
            <Link to="/admin/login" className="btn btn-ghost btn-sm">Admin Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
