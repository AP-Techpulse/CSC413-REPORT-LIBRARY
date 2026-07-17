import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import logo from "../assets/delsu-logo.png";

export default function Navbar({ heroRef }) {
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
        </div>
      </div>
    </header>
  );
}


