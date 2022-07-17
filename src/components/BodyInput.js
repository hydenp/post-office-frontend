import React, { useEffect, useState } from "react";

const BodyInput = ({ variableNames, bodyInput, handleBodyInput }) => {
  const [headerVariables, setHeaderVariables] = useState([]);
  const [hangingVariables, setHangingVariables] = useState([]);

  function updateUsedVars() {
    const newUsedVars = {};
    for (const v of headerVariables) {
      newUsedVars[v] = bodyInput.indexOf(`{${v}}`) !== -1;
    }
  }

  function updateHangingVariables() {
    const regex = /\{([^{}]+)}/g;
    let match;

    let hangingVars = [];
    while ((match = regex.exec(bodyInput))) {
      const matchStart = regex.lastIndex - match[0].length + 1;
      const matchEnd = regex.lastIndex - 1;
      const possibleVar = bodyInput.substring(matchStart, matchEnd);

      if (!(variableNames.indexOf(possibleVar) !== -1)) {
        hangingVars.push(possibleVar);
      }
    }
    setHangingVariables([...new Set(hangingVars)]);
  }

  function update(e) {
    const val = e.target.value;
    updateUsedVars();
    updateHangingVariables();

    // check for check matching headerVariables
    handleBodyInput(val);
  }

  useEffect(() => {
    if (variableNames !== null) {
      const newVars = [];
      for (const vn of variableNames) {
        newVars.push(vn);
      }
      setHeaderVariables(newVars);
      updateUsedVars();
    }
    updateHangingVariables();
  }, [variableNames, bodyInput]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {Object.keys(headerVariables)
          .filter(
            (r) => ["email", "subject"].indexOf(headerVariables[r]) === -1
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
        onChange={(event) => update(event)}
      ></textarea>
    </div>
  );
};

export default BodyInput;
