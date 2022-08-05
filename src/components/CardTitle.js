import React from "react";
import { colors } from "../assets/colors";

import checkMark from "../assets/check.svg";

import { cardStates } from "../models";

const StatusIcon = ({ color, number, status }) => {
  return (
    <div
      style={{
        ...iconStyles.container,
        backgroundColor: color,
      }}
    >
      {status === cardStates.complete ? (
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
  const titleStyle = {
    margin: 0,
    fontWeight: 600,
    fontSize: 36,
  };
  const titleIconStyle = {
    display: "flex",
    fontSize: 36,
  };

  return (
    <div
      style={{
        height: 58,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <div style={titleIconStyle}>
        {(() => {
          if (status === cardStates.notStarted) {
            return (
              <>
                <StatusIcon
                  color={colors.DEACTIVATED}
                  number={number}
                  status={status}
                />
                <p
                  style={{
                    color: colors.DEACTIVATED,
                    ...titleStyle,
                  }}
                >
                  {title}
                </p>
              </>
            );
          } else if (status === cardStates.inProgress) {
            return (
              <>
                <StatusIcon
                  color={colors.ACCENT}
                  number={number}
                  status={status}
                />
                <p
                  style={{
                    color: colors.ACCENT,
                    ...titleStyle,
                  }}
                >
                  {title}
                </p>
              </>
            );
          } else if (status === cardStates.complete) {
            return (
              <>
                <StatusIcon
                  color={colors.PRIMARY}
                  number={number}
                  status={status}
                />
                <p
                  style={{
                    color: colors.PRIMARY,
                    ...titleStyle,
                  }}
                >
                  {title}
                </p>
              </>
            );
          }
        })()}
      </div>
    </div>
  );
};

const iconStyles = {
  container: {
    height: 45,
    width: 45,
    borderRadius: 45,
    padding: 0,
    marginRight: 20,
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  },
};

export default CardTitle;
