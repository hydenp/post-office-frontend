import React, { useEffect, useState } from "react";

const BodyInput = ({ variableNames, bodyInput }) => {
  const [variables, setVariables] = useState([]);
  const [usedVars, setUsedVars] = useState({});

  useEffect(() => {
    if (variableNames !== null) {
      const newVars = [];
      const newUsedVars = {};
      for (const vn of variableNames) {
        newVars.push(vn);
        newUsedVars[vn] = false;
      }
      setVariables(newVars);
      setUsedVars(newUsedVars);
    }
  }, [variableNames]);

  function update(e) {
    const val = e.target.value;

    // check for check matching variables
    const newUsedVars = {};
    for (const v of variables) {
      newUsedVars[v] = val.indexOf(`{${v}}`) !== -1;
    }
    setUsedVars(newUsedVars);
    bodyInput.current = val;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {Object.keys(usedVars).map((k) => (
          <p
            key={k}
            style={{ padding: 3, color: usedVars[k] ? "green" : "red" }}
          >
            {k}
          </p>
        ))}
      </div>
      <textarea
        rows="20"
        cols="100"
        onChange={(event) => update(event)}
      ></textarea>
    </div>
  );
};

export default BodyInput;
