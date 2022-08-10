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
            marginTop: 0,
            textAlign: "left",
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

          backgroundColor: "rgba(254, 249, 167, 0.7)",
        }}
      >
        <p>Looks like you tried using a</p>
        <VariablePill
          title={"variable"}
          type={"warning"}
          style={{
            marginLeft: 10,
            marginRight: 10,
          }}
        />
        <p> that is not in the table data</p>
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
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: colors.PRIMARY,
          }}
        >
          {/*  list of variables in header */}
          {allVars.length > 2 || hangingVariables.length > 0 ? (
            Object.keys(allVars)
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
                marginLeft: 10,
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
            height: 240,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
          onChange={(event) => updateBodyEvent(event.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default BodyInput;
