// src/utils/RedirectHandler.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASENAME = "/debtors-ledger-pwa"; // Must match your Router basename exactly

export default function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let redirectPath = params.get("redirect");

    if (redirectPath && redirectPath.startsWith(BASENAME)) {
      // Remove the leading /debtors-ledger-pwa part
      redirectPath = redirectPath.slice(BASENAME.length) || "/";
    }

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

