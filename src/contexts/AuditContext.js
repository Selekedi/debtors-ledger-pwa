// context/AuditContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuditContext = createContext();

export function AuditProvider({ children }) {
  const [isAuditMode, setIsAuditMode] = useState(false);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("auditMode");
    if (stored === "true") setIsAuditMode(true);
  }, []);

  const toggleAuditMode = () => {
    setIsAuditMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("auditMode", newValue.toString());
      return newValue;
    });
  };

  return (
    <AuditContext.Provider value={{ isAuditMode, toggleAuditMode }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  return useContext(AuditContext);
}
