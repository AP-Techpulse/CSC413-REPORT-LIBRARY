import React, { useRef, useState } from "react";
import { uploadReport } from "../lib/reports.js";

const initialForm = { groupNumber: "", title: "", courseType: "CSC", description: "" };

export default function UploadForm({ onUploaded }) {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) return setError("Please choose a report file to upload.");
    if (!form.groupNumber || !form.title.trim()) {
      return setError("Group number and title are required.");
    }

    setBusy(true);
    try {
      await uploadReport({
        file,
        groupNumber: form.groupNumber,
        title: form.title.trim(),
        courseType: form.courseType,
        description: form.description.trim(),
      });
      setSuccess(`"${form.title.trim()}" was uploaded successfully.`);
      setForm(initialForm);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded?.();
    } catch (err) {
      setError(err.message || "Something went wrong while uploading. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div
        className={`dropzone ${dragOver ? "dragover" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
        {file ? (
          <p className="file-chosen">{file.name}</p>
        ) : (
          <p>Click to choose a file, or drag a PDF / DOCX / PPTX here</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          style={{ display: "none" }}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      <div className="field" style={{ marginTop: 18 }}>
        <label htmlFor="title">Report title</label>
        <input id="title" type="text" placeholder='e.g. "Smart Waste Bin Monitoring System"' value={form.title} onChange={update("title")} />
      </div>

      <div className="two-col">
        <div className="field">
          <label htmlFor="groupNumber">Group number</label>
          <input id="groupNumber" type="number" min="1" placeholder="e.g. 4" value={form.groupNumber} onChange={update("groupNumber")} />
        </div>
        <div className="field">
          <label htmlFor="courseType">Intended for</label>
          <select id="courseType" value={form.courseType} onChange={update("courseType")}>
            <option value="CSC">Computer Science</option>
            <option value="CSE">Computer Science Education</option>
            <option value="BOTH">Both departments</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Short description (optional)</label>
        <textarea id="description" placeholder="One or two lines describing what this report covers..." value={form.description} onChange={update("description")} />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Uploading..." : "Add report to the library"}
      </button>
    </form>
  );
}
