import React, { useEffect, useState } from "react";
import VariablePill from "../components/VariablePill";
import { colors } from "../assets/colors";
import { getHangingVariables } from "./utils";

const BodyInput = ({ bodyInput, tableHeaderVariables, handleSetBodyInput }) => {
  const [hangingVariables, setHangingVariables] = useState([]);
  const [allVars, setAllVars] = useState([]);

  // FUNCTIONS
  function handleBodyInputChange(newValue) {
    if (newValue === "" || newValue === null) {
      localStorage.removeItem("bodyInput");
      return "";
    } else {
      localStorage.setItem("bodyInput", JSON.stringify(newValue));
      return newValue;
    }
  }

  function updateBodyEvent(eventValue) {
    // check for check matching headerVariables
    const newBodyInput = handleBodyInputChange(eventValue);
    const newHangingVars = getHangingVariables(
      newBodyInput,
      tableHeaderVariables
    );
    handleSetBodyInput(newBodyInput);
    setHangingVariables(newHangingVars);

    setAllVars([...tableHeaderVariables, ...newHangingVars]);
  }

  // HOOKS

  // check for cached input when the component loads
  useEffect(() => {
    const cachedBodyInput = JSON.parse(localStorage.getItem("bodyInput"));
    if (cachedBodyInput !== null) {
      handleSetBodyInput(cachedBodyInput);
      setHangingVariables(
        getHangingVariables(cachedBodyInput, tableHeaderVariables)
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const newHangingVariables = getHangingVariables(
      bodyInput,
      tableHeaderVariables
    );
    setAllVars([...tableHeaderVariables, ...newHangingVariables]);
    setHangingVariables(newHangingVariables);
  }, [tableHeaderVariables, bodyInput]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          color: colors.DEACTIVATED,
        }}
      >
        <p
          style={{
            textAlign: "left",
            marginTop: 0,
            marginBottom: 20,
            fontSize: 14,
            color: colors.DEACTIVATED,
          }}
        >
          You can access the variables using the this syntax:{" "}
          {"{variable_name}"}
        </p>
      </div>
      <div
        style={{
          display: hangingVariables.length > 0 ? "flex" : "none",
          alignItems: "center",
          borderRadius: 10,
          paddingLeft: 10,
          marginBottom: 10,

          backgroundColor: colors.YELLOW,
        }}
      >
        <p>
          Looks like you tried using the following variables that aren't not in
          the table data:
        </p>
        {hangingVariables.map((k, v) => {
          return (
            <>
              <VariablePill
                title={k}
                type={"warning"}
                style={{
                  marginLeft: 4,
                  marginRight: 2,
                }}
              />
              {v + 1 !== hangingVariables.length && ","}
            </>
          );
        })}
      </div>

      {/* text input*/}
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
        }}
      >
        {/* header */}
        <div
          style={{
            minHeight: 60,
            height: "auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            width: "100%",
            paddingBottom:
              allVars.length > 2 || hangingVariables.length > 0 ? 15 : 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.PRIMARY,
          }}
        >
          {/*  list of variables in header */}
          {tableHeaderVariables.length > 2 ? (
            Object.keys(tableHeaderVariables)
              .filter(
                (r) =>
                  ["Recipient", "Subject"].indexOf(tableHeaderVariables[r]) ===
                  -1
              )
              .map((k) => {
                if (
                  tableHeaderVariables.includes(allVars[k]) &&
                  bodyInput.indexOf(`{${allVars[k]}}`) !== -1
                ) {
                  return (
                    <VariablePill
                      key={k}
                      title={allVars[k]}
                      type={"used"}
                      style={{
                        marginLeft: 15,
                        marginTop: 15,
                      }}
                    />
                  );
                } else {
                  if (bodyInput.indexOf(`{${allVars[k]}}`) !== -1) {
                    return (
                      <VariablePill
                        key={k}
                        title={allVars[k]}
                        type={"warning"}
                        style={{
                          marginLeft: 15,
                          marginTop: 15,
                        }}
                      />
                    );
                  } else {
                    return (
                      <VariablePill
                        key={k}
                        title={allVars[k]}
                        type={"unused"}
                        style={{
                          marginLeft: 15,
                          marginTop: 15,
                        }}
                      />
                    );
                  }
                }
              })
          ) : (
            <p
              style={{
                marginLeft: 15,
                fontSize: 14,
                color: "white",
              }}
            >
              You can add variables in the previous step
            </p>
          )}
        </div>
        <textarea
          placeholder="Start your email template here..."
          value={bodyInput}
          style={{
            fontSize: 14,
            height: 240,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          onChange={(event) => updateBodyEvent(event.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default BodyInput;
