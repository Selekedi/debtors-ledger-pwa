import React from "react";
import { NavLink } from "react-router-dom";
import "./NavItem.css"

export default function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
      onClick={onClick}
    >
      {label}
    </NavLink>
  );
}
