import React, { useEffect, useState } from "react";
import CardTitle from "./CardTitle";
import { colors } from "../assets/colors";

const StepCard = ({
  cardInfo,
  childComponent,
  overrideShow = false,
  handleSetOverride,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (overrideShow) {
      setShow(false);
      handleSetOverride(false);
    }
  }, [handleSetOverride, overrideShow]);

  return (
    <div
      style={{
        minWidth: 650,
        backgroundColor: colors.BACKGROUND,
        borderRadius: 20,
        padding: 30,
        marginTop: 12,
        marginBottom: 12,
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        boxShadow: show ? "0px 10px 10px rgba(0, 0, 0, 0.25)" : null,
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
      {/* child component container */}
      <div
        style={{
          display: show ? "flex" : "none",
          alignContent: "flex-start",
          marginTop: 5,
          marginLeft: 53,
          overflow: "scroll auto",
          scrollbarColor: "#E8E8E8 transparent",
          // backgroundColor: "yellow",
        }}
      >
        {childComponent}
      </div>
    </div>
  );
};

export default StepCard;
