import React from "react";

function DeleteSymbol({
  dimension,
  color,
  hidden = false,
  background = "none",
}) {
  return (
    <svg
      display={hidden ? "none" : "block"}
      width={dimension}
      height={dimension}
      viewBox="0 0 20 20"
      fill={background}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2.82861"
        width="24"
        height="4"
        rx="2"
        transform="rotate(45 2.82861 0)"
        fill={color}
      />
      <rect
        y="16.9707"
        width="24"
        height="4"
        rx="2"
        transform="rotate(-45 0 16.9707)"
        fill={color}
      />
    </svg>
  );
}

export default DeleteSymbol;
