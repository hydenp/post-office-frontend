import React, { useState } from "react";
import CardTitle from "./CardTitle";

const StepCard = ({ cardInfo, childComponent }) => {
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
      <CardTitle
        number={cardInfo.number}
        status={cardInfo.status}
        title={cardInfo.title}
      />
      <div
        style={{
          // backgroundColor: "yellow",
          marginTop: 20,
          marginLeft: 60,
          display: show ? "block" : "none",
        }}
      >
        {childComponent}
      </div>
      <div style={{ height: 20 }}></div>
      <button onClick={() => setShow(!show)}>show/hide</button>
    </div>
  );
};

StepCard.propTypes = {};

export default StepCard;
