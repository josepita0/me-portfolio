import React, { useState } from "react";
import RollingText from "./RollingText";

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface SubmitButtonProps {
  status?: SubmitStatus;
}

export default function SubmitButton({ status = "idle" }: SubmitButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const disabled = status === "loading";

  const getText = () => {
    switch (status) {
      case "loading":
        return "Enviando\u2026";
      case "success":
        return "\u00a1Enviado!";
      case "error":
        return "Reintentar";
      default:
        return "Enviar";
    }
  };

  return (
    <button
      className="contact-section__submit"
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {status === "idle" || status === "error" ? (
        <RollingText text={getText()} active={isHovered && status === "idle"} />
      ) : (
        <span>{getText()}</span>
      )}
    </button>
  );
}
