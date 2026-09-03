import React, { useState } from "react";
import RollingText from "./RollingText";

export default function SubmitButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="contact-section__submit"
      type="submit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RollingText text="Enviar" active={isHovered} />
    </button>
  );
}
