import React, { useState, useEffect } from "react";
import SubmitButton from "./SubmitButton";

type SubmitStatus = "idle" | "loading" | "success" | "error";

/**
 * Thin wrapper that bridges vanilla JS form handling with React button state.
 * Listens for a custom "web3forms:status" event on window to update the
 * SubmitButton's visual state from the Astro <script> tag.
 */
export default function SubmitButtonController() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.status) {
        setStatus(detail.status);
      }
    };

    window.addEventListener("web3forms:status", handler);
    return () => window.removeEventListener("web3forms:status", handler);
  }, []);

  return <SubmitButton status={status} />;
}
