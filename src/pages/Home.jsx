import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ReportCard from "../components/ReportCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import logo from "../assets/delsu-logo.png";
import { fetchReports } from "../lib/reports.js";
import { isSupabaseConfigured } from "../supabaseClient.js";

const FILTERS = [
  { key: "ALL", label: "All Reports" },
  { key: "CSC", label: "Computer Science" },
  { key: "CSE", label: "Computer Science Education" },
];

export default function Home() {
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
      const matchesFilter = filter === "ALL" || r.course_type === filter || r.course_type === "BOTH";
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        String(r.group_number).includes(q) ||
        (r.description || "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [reports, filter, query]);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <p className="hero-eyebrow">Central Repository &middot; CSC 413</p>
              <h1>Every group's <em>pervasive system</em> report, in one place.</h1>
              <p className="hero-sub">
                All documents here were produced by CSC 413 students, Computer Science and Computer
                Science Education alike, covering the pervasive computing prototypes each group
                defended this semester. Mrs. Omede has asked that every student study all of them
                ahead of the exam, so browse, read, and download whatever you need.
              </p>
              <div className="search-wrap">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search by title, group number, or keyword..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="hero-crest-wrap">
              <span className="scan-ring" />
              <span className="scan-ring r2" />
              <span className="scan-ring r3" />
              <img src={logo} alt="DELSU crest" />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
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
          {!loading && <span className="result-count">{filtered.length} report{filtered.length === 1 ? "" : "s"}</span>}
        </div>

        {!isSupabaseConfigured ? (
          <EmptyState
            title="Backend not connected yet"
            message="This deployment hasn't been connected to Supabase yet. Add your project URL and anon key to the environment variables, then redeploy."
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

      <Footer />
    </>
  );
}
