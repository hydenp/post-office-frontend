import React, { useEffect, useState } from "react";

const BodyInput = ({ variableNames, bodyInput, handleBodyInput }) => {
  const [headerVariables, setHeaderVariables] = useState([]);

  function updateUsedVars() {
    const newUsedVars = {};
    for (const v of headerVariables) {
      newUsedVars[v] = bodyInput.indexOf(`{${v}}`) !== -1;
    }
  }

  function update(e) {
    const val = e.target.value;
    updateUsedVars();
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
  }, [variableNames, bodyInput]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {Object.keys(headerVariables).map((k) => (
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
