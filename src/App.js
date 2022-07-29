import "./App.css";

import GoogleOauth from "./components/GoogleAuth";
import FileUpload from "./components/FileUpload";
import { useEffect, useState } from "react";
import DataView from "./components/DataView";
import BodyInput from "./components/BodyInput";
import RequestHandler from "./components/RequestHandler";

import testData from "./test_data.json";
import CardTitle from "./components/CardTitle";

function App() {
  const [bodyInput, setBodyInput] = useState("");
  const [headerVariableWarning, setHeaderVariableWarning] = useState(false);
  const [numVariablesAdded, setNumVariablesAdded] = useState(0);
  const [profileInfo, setProfileInfo] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [tableHeaderVariables, setTableHeaderVariables] = useState(null);
  const [token, setToken] = useState(null);
  const [validEmails, setValidEmails] = useState(false);

  // HELPER METHODS FOR DEBUG/DEV

  function loadTestData() {
    setTableHeaderVariables(testData.tableHeaders);
    setTableData(testData.tableData);
    setBodyInput(testData.bodyInput);
  }

  function printData() {
    console.log("Data ------");
    console.log(tableData);
    console.log(bodyInput);
  }

  function printStates() {
    console.log("headers = ", tableHeaderVariables);
    console.log("data = ", tableData);
    console.log("profile = ", profileInfo);
  }

  function resetLocalStorage() {
    localStorage.removeItem("tableHeaders");
    localStorage.removeItem("tableData");
    localStorage.removeItem("bodyInput");
  }

  function unsetTestData() {
    setTableHeaderVariables(null);
    setTableData(null);
    setBodyInput("");
    setToken(null);
  }

  // COMPONENT: BodyInput

  function handleBodyInputChange(newValue) {
    if (newValue === "" || newValue === null) {
      localStorage.removeItem("bodyInput");
      setBodyInput("");
    } else {
      localStorage.setItem("bodyInput", JSON.stringify(newValue));
      setBodyInput(newValue);
    }
  }

  function handleResetBodyInput() {
    setBodyInput("");
    localStorage.removeItem("bodyInput");
  }

  // COMPONENT: DataView

  function handleAddHeaderVariable() {
    const newVarName = `new_variable_${numVariablesAdded + 1}`;
    setNumVariablesAdded(numVariablesAdded + 1);

    // update the headers state variable
    const newHeaderVariables = [...tableHeaderVariables];
    newHeaderVariables.push(newVarName);
    setTableHeaderVariables(newHeaderVariables);

    // update the tableData with the new key in every row
    const updatedTableData = [];
    for (const row in tableData) {
      const updatedRow = { ...tableData[row] };
      updatedRow[newVarName] = "";
      updatedTableData.push(updatedRow);
    }
    setTableData(updatedTableData);
  }

  function handleAddTableRow() {
    // create an object with all the keys mapped to empty strings
    const newRow = {};
    for (const header in tableHeaderVariables) {
      newRow[tableHeaderVariables[header]] = "";
    }

    // create the shallow copy and set the state variable to the shallow copy
    const newTableData = [...tableData];
    newTableData.push(newRow);
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

  function handleDeleteRow(arrIndex) {
    const newTableData = [...tableData];
    newTableData.splice(arrIndex, 1);
    setTableData(newTableData);
  }

  function handleHeaderEdit(arrIndex, newValue) {
    // make sure the variable doesn't already exist
    if (tableHeaderVariables.includes(newValue)) {
      // display the warning for 3 seconds that variables must be unique
      setHeaderVariableWarning(true);
      setTimeout(function () {
        setHeaderVariableWarning(false);
      }, 3000);

      // if the new header variable is valid, perform updates
    } else {
      // update the header variables state
      setHeaderVariableWarning(false);
      const oldValue = tableHeaderVariables[arrIndex];
      const newHeaders = [...tableHeaderVariables];
      newHeaders[arrIndex] = newValue;
      setTableHeaderVariables(newHeaders);

      // update the key in the table data row objects
      const newTableData = [];
      for (const rowIndex in tableData) {
        const updatedRow = { ...tableData[rowIndex] };
        updatedRow[newValue] = updatedRow[oldValue];
        delete updatedRow[oldValue];
        newTableData.push(updatedRow);
      }
      setTableData(newTableData);

      // update the bodyInput with the new key everywhere it is used
      const newBody = bodyInput.replaceAll(`{${oldValue}}`, `{${newValue}}`);
      setBodyInput(newBody);
    }
  }

  function handleResetTableData() {
    if (
      window.confirm(
        "Are you sure you want to clear all your progress? You cannot undo this action."
      )
    ) {
      setTableHeaderVariables(null);
      setTableData(null);
      localStorage.removeItem("tableHeaders");
      localStorage.removeItem("tableData");
    }
  }

  function handleSetTableDataFromLocalStorage(
    cachedHeaderVariables,
    cachedTableData
  ) {
    setTableHeaderVariables(cachedHeaderVariables);
    setTableData(cachedTableData);
  }

  function handleTableFieldEdit(rowIndex, key, newValue) {
    // create the new row object
    const newRow = { ...tableData[rowIndex], [key]: newValue };
    // shallow copy data and then set new row
    const newData = [...tableData];
    newData[rowIndex] = newRow;

    setTableData(newData);
  }

  function handleValidEmailsUpdate(v) {
    setValidEmails(v);
  }

  // COMPONENT: FileUpload

  function handleDataColdStart() {
    setTableHeaderVariables(["Recipient", "Subject"]);
    setTableData([]);
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

  function handleUpload(headers, data) {
    setTableHeaderVariables(headers);
    setTableData(data);
  }

  // COMPONENT: GoogleAuth

  function handleGoogleLogin(token, profileInfo) {
    setToken({
      token: token,
      // expiry: new Date().getTime() + 10 * 1000,
      expiry: new Date().getTime() + 3500 * 1000,
    });
    setProfileInfo(profileInfo);

    // set the login in local storage
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

  // COMPONENT: RequestHandler

  function handleResetInputRequest() {
    setTableHeaderVariables(null);
    localStorage.removeItem("tableHeaders");
    setTableData(null);
    localStorage.removeItem("tableData");
    setBodyInput("");
    localStorage.removeItem("bodyInput");
    setNumVariablesAdded(0);
  }

  function handleResetToken() {
    setToken(null);
    setProfileInfo(null);
  }

  // HOOKS related

  function checkCachedGoogleUser() {
    // check for a logged-in user and if they're still valid, if so, load into state variables
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

  useEffect(() => {
    checkCachedGoogleUser();
  }, []);

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

        <div>
          <CardTitle
            number={1}
            status={"not-started"}
            title={"Upload and View data"}
          />
          <CardTitle
            number={2}
            status={"in-progress"}
            title={"Upload and View data"}
          />
          <CardTitle
            number={2}
            status={"complete"}
            title={"Upload and View data"}
          />
        </div>

        {/* Component to handle file upload*/}
        <FileUpload
          handleRemoveFile={handleRemoveFile}
          handleUpload={handleUpload}
        />

        <div>
          <h2>View and Edit your uploaded data</h2>
          <DataView
            headerWarning={headerVariableWarning}
            tableData={tableData}
            tableHeaderVariables={tableHeaderVariables}
            handleAddHeaderVariable={handleAddHeaderVariable}
            handleAddTableRow={handleAddTableRow}
            handleDeleteHeaderVariable={handleDeleteHeaderVariable}
            handleDeleteRow={handleDeleteRow}
            handleHeaderEdit={handleHeaderEdit}
            handleResetTableData={handleResetTableData}
            handleSetTableDataFromLocalStorage={
              handleSetTableDataFromLocalStorage
            }
            handleTableFieldEdit={handleTableFieldEdit}
            handleValidEmailsUpdate={handleValidEmailsUpdate}
          />
          <br />
          <button onClick={printData}>print data</button>
        </div>

        {/* Component to handle creating body of email */}
        <div>
          <h2>Create a body for your email</h2>
          <BodyInput
            bodyInput={bodyInput}
            variableNames={tableHeaderVariables}
            handleBodyInputChange={handleBodyInputChange}
            handleResetBodyInput={handleResetBodyInput}
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
          {/* Component to handle sending of request and displaying response*/}
          <RequestHandler
            body={bodyInput}
            data={tableData}
            token={token}
            validEmails={validEmails}
            handleResetInputRequest={handleResetInputRequest}
            handleResetToken={handleResetToken}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
