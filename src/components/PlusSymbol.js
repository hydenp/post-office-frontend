import React from "react";

function PlusSymbol({
  dimension,
  color,
  style,
  hidden = false,
  background = "none",
}) {
  return (
    <svg
      style={style}
      display={hidden ? "none" : "block"}
      width={dimension}
      height={dimension}
      viewBox="0 0 29 29"
      fill={background}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2.89941" y="12.8994" width="24" height="4" rx="2" fill={color} />
      <rect
        x="12.8994"
        y="26.8994"
        width="24"
        height="4"
        rx="2"
        transform="rotate(-90 12.8994 26.8994)"
        fill={color}
      />
    </svg>
  );
}

export default PlusSymbol;
