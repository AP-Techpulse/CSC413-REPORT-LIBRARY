import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import logo from "../assets/delsu-logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ heroRef }) {
  const { isAdmin } = useAuth();
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef?.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsOverHero(heroBottom > 80);
      } else {
        setIsOverHero(window.scrollY < 60);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  return (
    <header className={`topnav${isOverHero ? " topnav--glass" : ""}`}>
      <div className="topnav-inner">
        {/* Left spacer for centering grid */}
        <div />

        <Link to="/" className="topnav-brand">
          <div className="topnav-logo">
            <img src={logo} alt="DELSU crest" />
          </div>
          <div className="topnav-title">
            CSC 413 Report Library
            <span>Delta State University, Abraka</span>
          </div>
        </Link>

        <div className="topnav-actions">
          <ThemeToggle />
          {/* Admin dashboard link only shown if already logged in — no public login button */}
          {isAdmin && (
            <Link to="/admin" className="btn btn-admin btn-sm">Admin</Link>
          )}
        </div>
      </div>
    </header>
  );
}

