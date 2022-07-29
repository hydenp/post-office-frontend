import React from "react";

import checkMark from "../assets/check.svg";

const statuses = ["not-started", "in-progress", "complete"];

const StatusIcon = ({ color, number, status }) => {
  return (
    <div
      style={{
        height: 45,
        width: 45,
        borderRadius: 45,
        backgroundColor: color,
        padding: 0,
        marginRight: 20,
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      {status === statuses[2] ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img
            src={checkMark}
            alt="check"
            style={{
              margin: 0,
              padding: 0,
              height: 28,
              width: 28,
            }}
          />
        </div>
      ) : (
        <p
          style={{
            color: "white",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {number}
        </p>
      )}
    </div>
  );
};

const CardTitle = ({ number, status, title }) => {
  let color;
  const titleStyle = {
    margin: 0,
    fontWeight: 600,
  };

  function rete() {
    if (status === statuses[0]) {
      color = "#676767";
      return (
        <div
          style={{
            display: "flex",
            fontSize: 36,
          }}
        >
          <StatusIcon color={color} number={number} status={status} />
          <p
            style={{
              color: color,
              ...titleStyle,
            }}
          >
            {title}
          </p>
        </div>
      );
    } else if (status === statuses[1]) {
      color = "#0066FF";
      return (
        <div
          style={{
            display: "flex",
            fontSize: 36,
          }}
        >
          <StatusIcon color={color} number={number} status={status} />
          <p
            style={{
              color: color,
              ...titleStyle,
            }}
          >
            {title}
          </p>
        </div>
      );
    } else if (status === statuses[2]) {
      color = "#192636";
      return (
        <div
          style={{
            display: "flex",
            fontSize: 36,
          }}
        >
          <StatusIcon color={color} number={number} status={status} />
          <p
            style={{
              color: color,
              ...titleStyle,
            }}
          >
            {title}
          </p>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        height: 58,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {rete()}
    </div>
  );
};

export default CardTitle;
