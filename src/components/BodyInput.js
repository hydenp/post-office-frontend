import React, { useEffect, useState } from "react";

const BodyInput = ({
  bodyInput,
  variableNames,
  handleBodyInputChange,
  handleResetBodyInput,
}) => {
  const [hangingVariables, setHangingVariables] = useState([]);
  const [headerVariables, setHeaderVariables] = useState([]);

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {Object.keys(headerVariables)
          .filter(
            (r) => ["Recipient", "Subject"].indexOf(headerVariables[r]) === -1
          )
          .map((k) => (
            <p
              key={k}
              style={{
                padding: 3,
                color:
                  bodyInput.indexOf(`{${headerVariables[k]}}`) !== -1
                    ? "green"
                    : "red",
              }}
            >
              {headerVariables[k]}
            </p>
          ))}
      </div>
      <div hidden={!(hangingVariables.length > 0)}>
        <p>
          Looks like you tried using a variable that is not in the table data
        </p>
        {hangingVariables.map((v) => (
          <p
            key={v}
            style={{
              backgroundColor: "yellow",
            }}
          >
            {v}
          </p>
        ))}
      </div>
      <textarea
        value={bodyInput}
        rows="20"
        cols="100"
        onChange={(event) => updateVariable(event)}
      ></textarea>
      <button onClick={handleResetBodyInput}>Clear</button>
    </div>
  );
};

export default BodyInput;
