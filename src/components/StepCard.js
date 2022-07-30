import React, { useState } from "react";
import CardTitle from "./CardTitle";

const StepCard = ({ cardInfo, childComponent, footer }) => {
  const [show, setShow] = useState(true);

  return (
    <div
      style={{
        minWidth: 800,
        backgroundColor: "#F6F6F6",
        borderRadius: 20,
        padding: 40,
        marginTop: 15,
        marginBottom: 15,
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        boxShadow:
          cardInfo.status === "in-progress"
            ? "0px 10px 10px rgba(0, 0, 0, 0.25)"
            : null,
      }}
    >
      <div
        onClick={() => setShow(!show)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          cursor: "pointer",
        }}
      >
        <CardTitle
          number={cardInfo.number}
          status={cardInfo.status}
          title={cardInfo.title}
        />
      </div>
      <div
        style={{
          display: show ? "flex" : "none",
          alignContent: "flex-start",
          marginTop: 20,
          marginLeft: 60,
          overflow: "scroll auto",
          scrollbarColor: "#E8E8E8 transparent",
          // backgroundColor: "yellow",
        }}
      >
        {childComponent}
      </div>
      <div
        style={{
          marginLeft: 60,
        }}
      >
        {footer}
      </div>
    </div>
  );
};

export default StepCard;
