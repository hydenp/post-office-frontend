import React, { useEffect, useState } from "react";
import VariablePill from "../components/VariablePill";

const BodyInput = ({ bodyInput, variableNames, handleBodyInputChange }) => {
  const [hangingVariables, setHangingVariables] = useState([]);
  const [headerVariables, setHeaderVariables] = useState([]);
  const [allVars, setAllVars] = useState([]);

  // FUNCTIONS

  function updateHangingVariables() {
    // function that checks if the user has used any variables in the body that are not one of the header variables
    // updates the hangingVariables state variable which displays a warning of the incorrect variable

    const regex = /\{([^{}]+)}/g;
    let match;
    let hangingVars = [];
    while ((match = regex.exec(bodyInput))) {
      const matchStart = regex.lastIndex - match[0].length + 1;
      const matchEnd = regex.lastIndex - 1;
      const possibleVar = bodyInput.substring(matchStart, matchEnd);

      if (variableNames !== null) {
        if (!(variableNames.indexOf(possibleVar) !== -1)) {
          hangingVars.push(possibleVar);
        }
      } else {
        hangingVars.push(possibleVar);
      }
    }
    setHangingVariables([...new Set(hangingVars)]);
  }

  function updateUsedVars() {
    const newUsedVars = {};
    for (const v of headerVariables) {
      newUsedVars[v] = bodyInput.indexOf(`{${v}}`) !== -1;
    }
  }

  function updateVariable(e) {
    const val = e.target.value;
    updateUsedVars();
    updateHangingVariables();

    // check for check matching headerVariables
    handleBodyInputChange(val);
  }

  // HOOKS

  useEffect(() => {
    if (variableNames !== null) {
      const newVars = [];
      for (const vn of variableNames) {
        newVars.push(vn);
      }
      setHeaderVariables(newVars);
      updateUsedVars();
    } else {
      setHeaderVariables([]);
      setHangingVariables([]);
    }

    updateHangingVariables();
    // cacheBodyInput(bodyInput);
  }, [variableNames, bodyInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // check for cached input when the component loads
  useEffect(() => {
    const cachedBodyInput = JSON.parse(localStorage.getItem("bodyInput"));
    if (cachedBodyInput !== null) {
      handleBodyInputChange(cachedBodyInput);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setAllVars([...headerVariables, ...hangingVariables]);
  }, [headerVariables, hangingVariables]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#676767",
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

          backgroundColor: "rgba(254, 249, 167, 0.5)",
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
            paddingBottom: allVars.length > 2 ? 15 : 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: "#192636",
          }}
        >
          {/*  list of variables in header */}
          {allVars.length > 2 ? (
            Object.keys(allVars)
              .filter(
                (r) =>
                  ["Recipient", "Subject"].indexOf(headerVariables[r]) === -1
              )
              .map((k) => {
                if (
                  headerVariables.includes(allVars[k]) &&
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
          onChange={(event) => updateVariable(event)}
        ></textarea>
      </div>
    </div>
  );
};

export default BodyInput;
