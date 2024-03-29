import React from "react";
import { colors } from "../assets/colors";

const PrimaryButton = ({ title, disabled, onClick, style }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        all: "unset",
        background: "none",
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 10,
        paddingBottom: 10,
        cursor: "pointer",
        backgroundColor: disabled ? colors.DEACTIVATED : colors.ACCENT,
        color: "white",
        fontWeight: 500,
        fontSize: 16,
        ...style,
      }}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
