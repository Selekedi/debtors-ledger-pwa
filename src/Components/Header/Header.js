import React, { useState, forwardRef, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";
import NavItem from "../Navbar/NavItem";
import { Link } from "react-router-dom";
import { useAudit } from "../../contexts/AuditContext";

const Header = forwardRef((props, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const navRef = useRef(null);
  const {toggleAuditMode, isAuditMode} = useAudit()
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== "/";

  const navItems = [
    { label: "home", to: "/" },
    { label: "customers", to: "/customers" },
    { label: "products", to: "/products" },
    { label: "orders", to: "/orders" },
    { label: "payments", to: "/payments" },
    { label: "login" , to: "/login" }
  ];
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header ref={ref} className="header">
      <div className="container">
		  <div className="left-side">
			{showBackButton && (
			  <button className="back-button" onClick={() => navigate(-1)}>
				← Back
			  </button>
			)}
			<Link className="logo-link" to={"/"}>My Debtors</Link>
		  </div>

		  <nav ref={navRef} className={`nav ${menuOpen ? "open" : ""}`}>
			{navItems.map(item => (
			  <NavItem key={item.label} label={item.label} to={item.to} onClick={closeMenu} />
			))}
			<button onClick={toggleAuditMode}>🕵️ {isAuditMode ? "Exit" : "Enter"} Audit Mode</button>
		  </nav>

		  <button className="menu-toggle" onClick={(e) => {
			e.stopPropagation()
        	setMenuOpen(!menuOpen)
			console.log("changes")
         }}
         onMouseDown={(e) => e.stopPropagation()}
  		  onTouchStart={(e) => e.stopPropagation()}
		  
		  >
			  <div className="bar"></div>
		      <div className="bar"></div>
		      <div className="bar"></div>
		  </button>
		</div>
    </header>
  );
});

export default Header;
