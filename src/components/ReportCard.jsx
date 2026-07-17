import React from "react";
import { formatBytes, formatDate, getPublicUrl } from "../lib/reports.js";
import cardIot from "../assets/card_iot.jpg";
import cardSmart from "../assets/card_smart.jpg";
import cardWearable from "../assets/card_wearable.jpg";
import cardUbicomp from "../assets/card_ubicomp.jpg";

const CARD_IMAGES = [cardIot, cardSmart, cardWearable, cardUbicomp];
const CARD_ALTS = [
  "IoT network visualization",
  "Smart environment sensors",
  "Wearable computing devices",
  "Ubiquitous computing concept",
];

const COURSE_LABEL = {
  CSC: "Computer Science",
  CSE: "Computer Science Education",
  BOTH: "CSC & CSE",
};

function extensionOf(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
}

export default function ReportCard({ report, index = 0 }) {
  const url = getPublicUrl(report.file_path);
  const ext = extensionOf(report.file_name);
  // Deterministic image: same group always shows same image
  const imgIndex = (report.group_number - 1 + CARD_IMAGES.length) % CARD_IMAGES.length;
  const cardImg = CARD_IMAGES[imgIndex];
  const cardAlt = CARD_ALTS[imgIndex];

  return (
    <article className="report-card item-fade" style={{ "--delay": index }}>
      {/* Thumbnail strip */}
      <img className="report-card-image" src={cardImg} alt={cardAlt} loading="lazy" />

      <div className="report-card-body">
        <div className="report-card-top">
          <div className="file-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <span className={`course-tag ${report.course_type}`}>{COURSE_LABEL[report.course_type]}</span>
            <span className="group-tag">GROUP {report.group_number}</span>
          </div>
        </div>

        <h3 className="report-title">{report.title}</h3>
        {report.description && <p className="report-desc">{report.description}</p>}

        <div className="report-meta">
          <span>{ext}</span>
          <span className="dot" />
          <span>{formatBytes(report.file_size)}</span>
          <span className="dot" />
          <span>{formatDate(report.uploaded_at)}</span>
        </div>

        <div className="report-actions">
          <a className="btn btn-primary btn-sm" href={url} target="_blank" rel="noreferrer">View</a>
          <a className="btn btn-ghost btn-sm" href={url} download={report.file_name}>Download</a>
        </div>
      </div>
    </article>
  );
}


