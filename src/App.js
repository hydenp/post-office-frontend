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
  const [numVariablesAdded, setNumVariablesAdded] = useState(0);
  const [tableData, setTableData] = useState(null);
  const [bodyInput, setBodyInput] = useState("");
  const [token, setToken] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    checkCachedGoogleUser();
  }, []);

  function checkCachedGoogleUser() {
    // check for a logged-in user and if still valid
    const cachedUser = JSON.parse(localStorage.getItem("googleInfo"));
    if (cachedUser !== null) {
      if (new Date().getTime() > cachedUser.expiry) {
        localStorage.removeItem("googleInfo");
      } else {
        setToken({
          token: cachedUser.token,
          expiry: cachedUser.expiry,
        });
        setProfileInfo(cachedUser.profileInfo);
      }
    }
  }

  function handleGoogleLogin(token, profileInfo) {
    setToken({
      token: token,
      // expiry: new Date().getTime() + 10 * 1000,
      expiry: new Date().getTime() + 3500 * 1000,
    });
    setProfileInfo(profileInfo);

    // set the login
    localStorage.setItem(
      "googleInfo",
      JSON.stringify({
        token: token,
        profileInfo: profileInfo,
        // set for 100 seconds less than an hour
        expiry: new Date().getTime() + 3500 * 1000,
        // expiry: new Date().getTime() + 10 * 1000,
      })
    );
  }

  function resetInputRequest() {
    setTableHeaderVariables(null);
    localStorage.removeItem("tableHeaders");
    setTableData(null);
    localStorage.removeItem("tableData");
    setBodyInput("");
    localStorage.removeItem("bodyInput");
    setNumVariablesAdded(0);
  }

  function resetBody() {
    setBodyInput("");
    localStorage.removeItem("bodyInput");
  }

  function loadTestData() {
    setTableHeaderVariables(testData.tableHeaders);
    setTableData(testData.tableData);
    setBodyInput(testData.bodyInput);
    // setToken(testData.token);
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
    console.log("profile = ", profileInfo);
  }

  function handleBodyInput(v) {
    if (v === "") {
      localStorage.removeItem("bodyInput");
      setBodyInput("");
    } else {
      setBodyInput(v);
    }
  }

  function handleSetFromLocalStorage(cachedHeaderVariables, cachedTableData) {
    setTableHeaderVariables(cachedHeaderVariables);
    setTableData(cachedTableData);
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

  function handleDataColdStart() {
    setTableHeaderVariables(["Recipient", "Subject"]);
    setTableData([]);
  }

  function handleAddHeaderVariable() {
    const newVarName = `new_variable_${numVariablesAdded + 1}`;
    setNumVariablesAdded(numVariablesAdded + 1);

    // update the headers
    const newHeaderVariables = [...tableHeaderVariables];
    newHeaderVariables.push(newVarName);
    setTableHeaderVariables(newHeaderVariables);

    // update the tableData
    const updatedTableData = [];
    for (const row in tableData) {
      const updatedRow = { ...tableData[row] };
      updatedRow[newVarName] = "";
      updatedTableData.push(updatedRow);
    }
    setTableData(updatedTableData);
  }

  function handleDeleteRow(arrIndex) {
    const newTableData = [...tableData];
    newTableData.splice(arrIndex, 1);
    setTableData(newTableData);
  }

  function handleDeleteHeaderVariable(variableIndex) {
    const variableName = tableHeaderVariables[variableIndex];
    // update headers
    const updatedHeaderVariables = [...tableHeaderVariables];
    updatedHeaderVariables.splice(variableIndex, 1);
    setTableHeaderVariables(updatedHeaderVariables);

    // update data body
    const updatedTableData = [];
    for (const rowIndex in tableData) {
      const updatedRow = { ...tableData[rowIndex] };
      delete updatedRow[variableName];
      updatedTableData.push(updatedRow);
    }
    setTableData(updatedTableData);
  }

  function handleRemoveFile() {
    if (
      window.confirm(
        "Are you sure you want to remove that file? Doing so will remove all changes in the table."
      )
    ) {
      setTableHeaderVariables(null);
      setTableData(null);
      resetLocalStorage();
    }
  }

  function printData() {
    console.log("Data ------");
    console.log(tableData);
    console.log(bodyInput);
  }

  function resetLocalStorage() {
    localStorage.removeItem("tableHeaders");
    localStorage.removeItem("tableData");
    localStorage.removeItem("bodyInput");
  }

  function handleResetTable() {
    if (
      window.confirm(
        "Are you sure you want to clear all your progress? You cannot undo this action"
      )
    ) {
      setTableHeaderVariables(null);
      setTableData(null);
      localStorage.removeItem("tableHeaders");
      localStorage.removeItem("tableData");
    }
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
      setHeaderVariableWarning(false);
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
        <button onClick={handleDataColdStart}>Cold Start</button>
        <button onClick={resetLocalStorage}>UNSET Local Storage</button>
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
            handleResetTable={handleResetTable}
            handleSetFromLocalStorage={handleSetFromLocalStorage}
            handleFieldEdit={handleFieldEdit}
            handleHeaderEdit={handleHeaderEdit}
            handleAddRow={handleAddRow}
            handleAddHeaderVariable={handleAddHeaderVariable}
            handleDeleteHeaderVariable={handleDeleteHeaderVariable}
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
            resetBody={resetBody}
          />
        </div>

        {/* Component to start google oauth flow, store it in state variable and print token */}
        <div>
          <h2>Get Google the Keys</h2>
          <GoogleOauth handleGoogleLogin={handleGoogleLogin} />
        </div>

        <div
          style={{
            marginBottom: 50,
          }}
        >
          <RequestHandler
            body={bodyInput}
            data={tableData}
            token={token}
            resetInputRequest={resetInputRequest}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
