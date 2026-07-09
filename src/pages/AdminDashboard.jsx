import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import UploadForm from "../components/UploadForm.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import logo from "../assets/delsu-logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchReports, deleteReport, formatBytes, formatDate } from "../lib/reports.js";

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
  const cscCount = reports.filter((r) => r.course_type === "CSC").length;
  const cseCount = reports.filter((r) => r.course_type === "CSE").length;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <div className="topnav-logo"><img src={logo} alt="DELSU crest" /></div>
            <div>
              <h1>CSC 413 Report Library</h1>
              <span className="admin-badge">Admin</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <Link to="/" className="btn btn-ghost btn-sm">View public site</Link>
            <button className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{reports.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Computer Science</div>
            <div className="stat-value">{cscCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Comp. Science Education</div>
            <div className="stat-value">{cseCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Storage Used</div>
            <div className="stat-value">{formatBytes(totalSize)}</div>
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <div className="panel-head">
              <h2>Add a new report</h2>
              <p>Upload a group's report so it appears instantly on the public site.</p>
            </div>
            <div className="panel-body">
              <UploadForm onUploaded={load} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Manage reports</h2>
              <p>Everything currently visible to students.</p>
            </div>
            {loading ? (
              <Loader label="Loading reports..." />
            ) : error ? (
              <EmptyState title="Could not load reports" message={error} />
            ) : reports.length === 0 ? (
              <EmptyState title="No reports uploaded yet" message="Use the form on the left to add the first group report." />
            ) : (
              <div>
                {reports.map((r) => (
                  <div className="report-row" key={r.id}>
                    <div>
                      <div className="report-row-title">Group {r.group_number} &middot; {r.title}</div>
                      <div className="report-row-meta">{r.course_type} &middot; {formatBytes(r.file_size)} &middot; {formatDate(r.uploaded_at)}</div>
                    </div>
                    <div className="report-row-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? "Removing..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
