import React from "react"
import "./InfoGrid.css"

export default function InfoGrid({ fields }) {
  return (
    <div className="info-grid">
      {fields.map(([label, value]) => (
        <>
          <div className="label">{label}</div>
          <div className="value">{value}</div>
        </>
      ))}
    </div>
  );
}

