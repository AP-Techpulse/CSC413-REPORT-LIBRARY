import React from "react";

export default function Loader({ label = "Scanning the archive..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader-beam" />
      <span>{label}</span>
    </div>
  );
}
