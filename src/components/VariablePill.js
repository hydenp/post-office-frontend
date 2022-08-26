import React from "react";
import { colors } from "../assets/colors";

const VariablePill = ({ title, type, style = {} }) => {
  let color;
  if (type === "used") {
    color = colors.GREEN;
  } else if (type === "unused") {
    color = "rgba(191, 217, 255, 0.3)";
  } else if (type === "warning") {
    color = colors.RED;
  }
  return (
    <div
      style={{
        height: 30,
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: color,
        color: "white",
        fontWeight: 500,
        fontSize: 14,
        ...style,
      }}
    >
      <p>{title}</p>
    </div>
  );
};

export default VariablePill;
