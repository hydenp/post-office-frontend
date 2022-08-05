import React from "react";

const VariablePill = ({ title, type, style = {} }) => {
  let color;
  if (type === "used") {
    color = "#3CCF4E";
  } else if (type === "unused") {
    color = "rgba(191, 217, 255, 0.3)";
  } else if (type === "warning") {
    color = "#DCCE50";
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
        fontSize: 16,
        ...style,
      }}
    >
      <p>{title}</p>
    </div>
  );
};

export default VariablePill;
