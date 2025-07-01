import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "./CustomerCard.css"; // You’ll define styles here

function CustomerCard({ customer }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="customer-card">
      <div className="summary" onClick={() => setExpanded(!expanded)}>
        <div>
          <strong>{customer.name} {customer.surname}</strong><br />
          <span className={`balance ${customer.balance < 0 ? "negative" : "positive"}`}>
            R{Number(customer.balance).toFixed(2)}
          </span>
        </div>
        <div className="caret">{expanded ? "▲" : "▼"}</div>
      </div>
      
      {expanded && (
        <div className="details">
          <p><strong>Cell:</strong> {customer.cell}</p>
          <p><strong>ID No:</strong> {customer.idNo}</p>
          <div className="actions">
            <button onClick = {() => navigate("/view-customer/" + customer.id)}>
           		View Customer
			</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerCard;

