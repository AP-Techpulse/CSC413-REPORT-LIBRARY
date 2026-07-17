import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import UploadForm from "../components/UploadForm.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import logo from "../assets/delsu-logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchReports, deleteReport, getPublicUrl, formatBytes, formatDate } from "../lib/reports.js";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchReports()
      .then(setReports)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (report) => {
    if (!window.confirm(`Remove "${report.title}" (Group ${report.group_number}) from the library? This cannot be undone.`)) return;
    setDeletingId(report.id);
    try {
      await deleteReport(report);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (err) {
      alert(err.message || "Could not delete this report.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalSize = reports.reduce((sum, r) => sum + (r.file_size || 0), 0);
  const cscCount = reports.filter((r) => r.course_type === "CSC" || r.course_type === "BOTH").length;
  const cseCount = reports.filter((r) => r.course_type === "CSE" || r.course_type === "BOTH").length;

  return (
    <div className="admin-shell">

      {/* ── Admin Topbar ── consistent with public nav */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          {/* Left spacer */}
          <div />

          {/* Centered brand */}
          <div className="admin-topbar-left">
            <div className="admin-topbar-logo">
              <img src={logo} alt="DELSU crest" />
            </div>
            <div className="admin-topbar-text">
              <div className="admin-topbar-title">CSC 413 Report Library</div>
              <div className="admin-topbar-sub">Admin Console &nbsp;<span className="admin-badge">Admin</span></div>
            </div>
          </div>

          {/* Right actions */}
          <div className="admin-topbar-actions">
            <ThemeToggle />
            <Link to="/" className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.15)" }}>
              ← Public Site
            </Link>
            <button className="btn btn-danger btn-sm" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }} onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container">

        {/* ── Stats Row ── */}
        <div className="stats-row">
          <div className="stat-card featured">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{reports.length}</div>
          </div>
          <div className="stat-card featured-emerald">
            <div className="stat-label">Computer Science</div>
            <div className="stat-value">{cscCount}</div>
          </div>
          <div className="stat-card featured-alt">
            <div className="stat-label">CS Education</div>
            <div className="stat-value">{cseCount}</div>
          </div>
          <div className="stat-card featured-rose">
            <div className="stat-label">Storage Used</div>
            <div className="stat-value" style={{ fontSize: "22px", paddingTop: "8px" }}>{formatBytes(totalSize)}</div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="admin-grid">

          {/* Upload panel */}
          <div className="panel">
            <div className="panel-head">
              <h2>Add a new report</h2>
              <p>Upload a group's report — it appears instantly on the public site.</p>
            </div>
            <div className="panel-body">
              <UploadForm onUploaded={load} />
            </div>
          </div>

          {/* Manage reports panel */}
          <div className="panel">
            <div className="panel-head">
              <h2>Manage reports</h2>
              <p>
                {loading ? "Loading…" : `${reports.length} report${reports.length === 1 ? "" : "s"} currently live on the public site.`}
              </p>
            </div>

            {loading ? (
              <Loader label="Loading reports…" />
            ) : error ? (
              <EmptyState title="Could not load reports" message={error} />
            ) : reports.length === 0 ? (
              <EmptyState title="No reports uploaded yet" message="Use the form on the left to add the first group report." />
            ) : (
              <div>
                {reports.map((r) => {
                  const url = getPublicUrl(r.file_path);
                  return (
                    <div className="report-row" key={r.id}>
                      {/* File icon */}
                      <div className="report-row-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                        </svg>
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="report-row-title">
                          Group {r.group_number} &middot; {r.title}
                        </div>
                        <div className="report-row-meta">
                          {r.course_type} &middot; {formatBytes(r.file_size)} &middot; {formatDate(r.uploaded_at)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="report-row-actions">
                        <a className="btn btn-ghost btn-sm" href={url} target="_blank" rel="noreferrer">View</a>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(r)}
                          disabled={deletingId === r.id}
                        >
                          {deletingId === r.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


