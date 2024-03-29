import React from "react";
import checkMark from "../assets/check.svg";
import DeleteSymbol from "./DeleteSymbol";
import { colors } from "../assets/colors";

const StepStatus = ({ title, status }) => {
  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        marginBottom: 20,
      }}
    >
      {status === "complete" ? (
        <>
          <div
            style={{
              height: 20,
              width: 20,
              borderRadius: 20,
              backgroundColor: colors.GREEN,
              padding: 0,
              marginRight: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={checkMark}
              alt="check"
              style={{
                margin: 0,
                padding: 0,
                height: 12,
                width: 12,
              }}
            />
          </div>
          <p
            style={{
              margin: 0,
              color: colors.GREEN,
              display: "flex",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {title}
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              height: 20,
              width: 20,
              borderRadius: 20,
              backgroundColor: colors.RED,
              padding: 0,
              marginRight: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DeleteSymbol dimension={12} color={"white"} />
          </div>
          <p
            style={{
              margin: 0,
              color: colors.RED,
              display: "flex",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {title}
          </p>
        </>
      )}
    </div>
  );
};

export default StepStatus;
