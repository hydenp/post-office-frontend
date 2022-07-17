import "./App.css";

import GoogleOauth from "./components/GoogleAuth";
import FileUpload from "./components/FileUpload";
import { useEffect, useState } from "react";
import DataView from "./components/DataView";
import BodyInput from "./components/BodyInput";
import RequestHandler from "./components/RequestHandler";

import testData from "./test_data.json";

function App() {
  const [tableHeaderVariables, setTableHeaderVariables] = useState(null);
  const [headerVariableWarning, setHeaderVariableWarning] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [bodyInput, setBodyInput] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log("re-render");
    // loadTestData();
  }, []);

  function loadTestData() {
    setTableHeaderVariables(testData.tableHeaders);
    setTableData(testData.tableData);
    setBodyInput(testData.bodyInput);
    setToken(testData.token);
  }

  function unsetTestData() {
    setTableHeaderVariables(null);
    setTableData(null);
    setBodyInput("");
    setToken(null);
  }

  function printStates() {
    console.log("headers = ", tableHeaderVariables);
    console.log("data = ", tableData);
  }

  function handleToken(t) {
    setToken(t);
  }

  function handleBodyInput(v) {
    if (v === "") {
      setBodyInput("");
    } else {
      setBodyInput(v);
    }
  }

  function handleUpload(headers, data) {
    setTableHeaderVariables(headers);
    setTableData(data);
  }

  function handleAddRow() {
    // create an object with all the keys mapped to empty strings
    const newRow = {};
    for (const header in tableHeaderVariables) {
      newRow[tableHeaderVariables[header]] = "";
    }

    // create the shallow copy and set new
    const newTableData = [...tableData];
    newTableData.push(newRow);
    setTableData(newTableData);
  }

  function handleDeleteRow(arrIndex) {
    const newTableData = [...tableData];
    newTableData.splice(arrIndex, 1);
    setTableData(newTableData);
  }

  function handleRemoveFile() {
    if (
      window.confirm(
        "Are you sure you want to remove that file? Doing so will remove all changes in the table."
      )
    ) {
      setTableHeaderVariables(null);
      setTableData(null);
    }
  }

  function printData() {
    console.log("Data ------");
    console.log(tableData);
    console.log(bodyInput);
  }

  function handleHeaderEdit(arrIndex, newValue) {
    // make sure the variable doesn't already exist
    if (tableHeaderVariables.includes(newValue)) {
      // display the warning for 3 seconds that variables must be unique
      setHeaderVariableWarning(true);
      setTimeout(function () {
        setHeaderVariableWarning(false);
      }, 3000);

      // if the new header variable is valid, perform the necessary updates
    } else {
      // update the header variables
      const oldValue = tableHeaderVariables[arrIndex];
      const newHeaders = [...tableHeaderVariables];
      newHeaders[arrIndex] = newValue;
      setTableHeaderVariables(newHeaders);

      // update the keys in the table data
      const newTableData = [];
      for (const rowIndex in tableData) {
        const updatedRow = { ...tableData[rowIndex] };
        updatedRow[newValue] = updatedRow[oldValue];
        delete updatedRow[oldValue];
        newTableData.push(updatedRow);
      }

      setTableData(newTableData);

      // update the tableData with the new key
      const newBody = bodyInput.replaceAll(`{${oldValue}}`, `{${newValue}}`);
      setBodyInput(newBody);
    }
  }

  function handleFieldEdit(arrIndex, key, newValue) {
    // create the new row object
    const newRow = { ...tableData[arrIndex], [key]: newValue };
    // shallow copy data and then set new row
    const newData = [...tableData];
    newData[arrIndex] = newRow;

    setTableData(newData);
  }

  return (
    <div className="App">
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1>PostOffice</h1>
        <button onClick={loadTestData}>Set Data</button>
        <button onClick={unsetTestData}>UNSET Data</button>
        <button onClick={printStates}>Print Data</button>

        {/* Component to handle file upload*/}
        <FileUpload
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
        />

        <div>
          <h2>View and Edit your uploaded data</h2>
          <DataView
            tableHeaders={tableHeaderVariables}
            headerWarning={headerVariableWarning}
            tableData={tableData}
            handleFieldEdit={handleFieldEdit}
            handleHeaderEdit={handleHeaderEdit}
            handleAddRow={handleAddRow}
            handleDeleteRow={handleDeleteRow}
          />
          <br />
          <button onClick={printData}>print data</button>
        </div>

        {/* Component to handle creating body of email */}
        <div>
          <h2>Create a body for your email</h2>
          <BodyInput
            variableNames={tableHeaderVariables}
            bodyInput={bodyInput}
            handleBodyInput={handleBodyInput}
          />
        </div>

        {/* Component to start google oauth flow, store it in state variable and print token */}
        <div>
          <h2>Get Google the Keys</h2>
          <GoogleOauth handleToken={handleToken} />
        </div>

        <div
          style={{
            marginBottom: 50,
          }}
        >
          <RequestHandler body={bodyInput} data={tableData} token={token} />
        </div>
      </div>
    </div>
  );
}

export default App;
