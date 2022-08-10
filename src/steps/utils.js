// DataView helpers

export function checkValidData(tableData) {
  let allValid = true;
  for (const rowIndex in tableData) {
    for (const objectKey in tableData[rowIndex]) {
      if (objectKey === "Recipient") {
        allValid =
          allValid &&
          /^[a-zA-Z.!#$%&'+/=?^_`{|}~-][a-zA-Z\d.!#$%&'+/=?^_`{|}~-]*@/gm.test(
            tableData[rowIndex][objectKey]
          );
      } else {
        allValid = allValid && tableData[rowIndex][objectKey] !== "";
      }
    }
  }
  return allValid;
}

// BodyInput helpers

export function getHangingVariables(newBodyInput, newTableHeaderVariables) {
  // function that checks if the user has used any variables in the body that are not one of the header variables
  // updates the hangingVariables state variable which displays a warning of the incorrect variable

  const regex = /\{([^{}]+)}/g;
  let match;
  let hangingVars = [];
  while ((match = regex.exec(newBodyInput))) {
    const matchStart = regex.lastIndex - match[0].length + 1;
    const matchEnd = regex.lastIndex - 1;
    const possibleVar = newBodyInput.substring(matchStart, matchEnd);

    if (newTableHeaderVariables !== null) {
      if (!(newTableHeaderVariables.indexOf(possibleVar) !== -1)) {
        hangingVars.push(possibleVar);
      }
    } else {
      hangingVars.push(possibleVar);
    }
  }
  return [...new Set(hangingVars)];
}
