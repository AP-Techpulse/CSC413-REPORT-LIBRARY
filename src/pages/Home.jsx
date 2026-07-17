import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ReportCard from "../components/ReportCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import logo from "../assets/delsu-logo.png";
import { fetchReports } from "../lib/reports.js";
import { isSupabaseConfigured } from "../supabaseClient.js";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const FILTERS = [
  { key: "ALL", label: "All Reports" },
  { key: "CSC", label: "Computer Science" },
  { key: "CSE", label: "Computer Science Education" },
];

export default function Home() {
  const heroRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    fetchReports()
      .then(setReports)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesFilter =
        filter === "ALL" || r.course_type === filter || r.course_type === "BOTH";
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        String(r.group_number).includes(q) ||
        (r.description || "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [reports, filter, query]);

  const scrollToLibrary = () => {
    const el = document.getElementById("library");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Nav sits above the hero — receives heroRef for scroll detection */}
      <Navbar heroRef={heroRef} />

      {/* ── Cinematic Video Hero ── */}
      <section className="hero" ref={heroRef}>
        {/* Fullscreen looping video */}
        <video
          className="hero-video"
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* Darkening scrim for legibility */}
        <div className="hero-scrim" aria-hidden="true" />

        {/* Main hero content */}
        <div className="hero-content">
          {/* DELSU crest badge */}
          <div className="hero-crest-wrap animate-fade-rise">
            <span className="scan-ring" />
            <span className="scan-ring r2" />
            <span className="scan-ring r3" />
            <img src={logo} alt="DELSU crest" />
          </div>

          <p className="hero-eyebrow animate-fade-rise">
            Central Repository &middot; CSC 413 &middot; DELSU
          </p>

          <h1 className="animate-fade-rise">
            Every group's{" "}
            <em>pervasive system</em>{" "}
            report,{" "}
            <em>in one place.</em>
          </h1>

          <p className="hero-sub animate-fade-rise-delay">
            All documents here were produced by CSC&nbsp;413 students — Computer
            Science and Computer Science Education alike — covering the pervasive
            computing prototypes each group defended this semester. Mrs. Omede
            has asked every student to study all of them ahead of the exam.
          </p>

          <button
            className="hero-cta liquid-glass animate-fade-rise-delay-2"
            onClick={scrollToLibrary}
            type="button"
          >
            Browse the Library
          </button>
        </div>

        {/* Scroll-down nudge */}
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── Search + Filters + Report Grid ── */}
      <div id="library" className="search-section">
        <div className="container">
          {/* Search bar */}
          <div className="search-wrap" style={{ marginBottom: 0 }}>
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by title, group number, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Filter chips */}
          <div className="filter-row">
            <div className="chip-group">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`chip ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {!loading && (
              <span className="result-count">
                {filtered.length} report{filtered.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Report content */}
          {!isSupabaseConfigured ? (
            <EmptyState
              title="Backend not connected yet"
              message="Add your Supabase project URL and anon key to the environment variables, then redeploy."
            />
          ) : loading ? (
            <Loader />
          ) : loadError ? (
            <EmptyState title="Could not load reports" message={loadError} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No reports match that search"
              message="Try a different keyword, or clear the filter above to see everything in the library."
            />
          ) : (
            <div className="report-grid page-fade">
              {filtered.map((r, idx) => (
                <ReportCard key={r.id} report={r} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
