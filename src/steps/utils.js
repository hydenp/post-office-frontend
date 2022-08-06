export function checkValidData(tableData) {
  let allValid = true;
  for (const rowIndex in tableData) {
    for (const objectKey in tableData[rowIndex]) {
      if (objectKey === "Recipient") {
        allValid =
          allValid &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
            tableData[rowIndex][objectKey]
          );
      } else {
        allValid = allValid && tableData[rowIndex][objectKey] !== "";
      }
    }
  }
  return allValid;
}
