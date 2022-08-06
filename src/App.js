import "./App.css";

import GoogleOauth from "./steps/GoogleAuth";
import FileUpload from "./steps/FileUpload";
import { useState } from "react";
import DataView from "./steps/DataView";
import BodyInput from "./steps/BodyInput";
import RequestHandler from "./steps/RequestHandler";
import StepCard from "./components/StepCard";
import { cardStates } from "./models";

function App() {
  const [bodyInput, setBodyInput] = useState("");
  const [headerVariableWarning, setHeaderVariableWarning] = useState(false);
  const [numVariablesAdded, setNumVariablesAdded] = useState(0);
  const [profileInfo, setProfileInfo] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [tableHeaderVariables, setTableHeaderVariables] = useState(null);
  const [token, setToken] = useState(null);
  const [validEmails, setValidEmails] = useState(false);

  const [cardState, setCardState] = useState({
    1: cardStates.inProgress,
    2: cardStates.notStarted,
    3: cardStates.notStarted,
    4: cardStates.notStarted,
    5: cardStates.notStarted,
  });

  // HELPER METHODS FOR DEBUG/DEV

  // function loadTestData() {
  //   setTableHeaderVariables(testData.tableHeaders);
  //   setTableData(testData.tableData);
  //   setBodyInput(testData.bodyInput);
  // }

  function printStates() {
    console.log("headers = ", tableHeaderVariables);
    console.log("data = ", tableData);
    console.log("profile = ", profileInfo);
    console.log("cardState = ", cardState);
  }

  // function resetLocalStorage() {
  //   localStorage.removeItem("tableHeaders");
  //   localStorage.removeItem("tableData");
  //   localStorage.removeItem("bodyInput");
  // }

  // function unsetTestData() {
  //   setTableHeaderVariables(null);
  //   setTableData(null);
  //   setBodyInput("");
  //   setToken(null);
  // }

  // HANDLE SET FUNCTIONS

  function handleSetBodyInput(v) {
    setBodyInput(v);
  }

  function handleSetCardState(newStates) {
    let updatedStates = { ...cardState, ...newStates };
    if (
      updatedStates[2] !== cardStates.notStarted ||
      updatedStates[3] !== cardStates.notStarted ||
      updatedStates[4] !== cardStates.notStarted
    ) {
      updatedStates = { ...updatedStates, 5: cardStates.inProgress };
    } else {
      updatedStates = { ...updatedStates, 5: cardStates.notStarted };
    }
    setCardState(() => updatedStates);
  }

  function handleSetHeaderVariableWarning(v) {
    setHeaderVariableWarning(v);
  }

  function handleSetNumVariablesAdded(v) {
    setNumVariablesAdded(v);
  }

  function handleSetProfileInfo(v) {
    setProfileInfo(v);
  }

  function handleSetTableData(v) {
    setTableData(v);
  }

  function handleSetTableHeaderVariables(v) {
    setTableHeaderVariables(v);
  }

  function handleSetToken(v) {
    setToken(v);
  }

  function handleSetValidEmailsUpdate(v) {
    setValidEmails(v);
  }

  return (
    <div className="App">
      <div
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1>PostOffice</h1>
        {/*<button onClick={loadTestData}>Set Data</button>*/}
        {/*<button onClick={unsetTestData}>UNSET Data</button>*/}
        {/*<button onClick={handleDataColdStart}>Cold Start</button>*/}
        {/*<button onClick={resetLocalStorage}>UNSET Local Storage</button>*/}
        <button onClick={printStates}>Print Data</button>

        {/*File upload step */}
        <StepCard
          cardInfo={{
            number: 1,
            status: cardState[1],
            title: "Upload CSV or start with a Blank Data Table",
          }}
          childComponent={
            <FileUpload
              tableData={tableData}
              handleSetCardState={handleSetCardState}
              handleSetTableHeaderVariables={handleSetTableHeaderVariables}
              handleSetTableData={handleSetTableData}
            />
          }
        />

        {/* View end Edit the data step */}
        <StepCard
          cardInfo={{
            number: 2,
            status: cardState[2],
            title: "View and Edit your Data",
          }}
          childComponent={
            <DataView
              bodyInput={bodyInput}
              headerWarning={headerVariableWarning}
              numVariablesAdded={numVariablesAdded}
              tableData={tableData}
              tableHeaderVariables={tableHeaderVariables}
              handleSetBodyInput={handleSetBodyInput}
              handleSetCardState={handleSetCardState}
              handleSetHeaderVariableWarning={handleSetHeaderVariableWarning}
              handleSetNumVariablesAdded={handleSetNumVariablesAdded}
              handleSetTableData={handleSetTableData}
              handleSetTableHeaderVariables={handleSetTableHeaderVariables}
              handleSetValidEmailsUpdate={handleSetValidEmailsUpdate}
            />
          }
        />

        {/* Creating body of email step */}
        <StepCard
          cardInfo={{
            number: 3,
            status: cardState[3],
            title: "Create a Template Body for your Emails",
          }}
          childComponent={
            <BodyInput
              bodyInput={bodyInput}
              tableHeaderVariables={tableHeaderVariables}
              handleSetBodyInput={handleSetBodyInput}
            />
          }
        />

        {/* Component to start google oauth flow, store it in state variable and print token */}
        <StepCard
          cardInfo={{
            number: 4,
            status: cardState[4],
            title: "Authorize Google",
          }}
          childComponent={
            <GoogleOauth
              profileInfo={profileInfo}
              token={token}
              handleSetProfileInfo={handleSetProfileInfo}
              handleSetToken={handleSetToken}
            />
          }
        />

        {/* Component to handle sending of request and displaying response*/}

        <StepCard
          cardInfo={{
            number: 5,
            status: cardState[5],
            title: "Review and Send",
          }}
          childComponent={
            <RequestHandler
              body={bodyInput}
              data={tableData}
              profileInfo={profileInfo}
              token={token}
              validEmails={validEmails}
              handleSetProfileInfo={handleSetProfileInfo}
              handleSetToken={handleSetToken}
              handleSetTableHeaderVariables={handleSetTableHeaderVariables}
              handleSetTableData={handleSetTableData}
              handleSetBodyInput={handleSetBodyInput}
              handleSetNumVariablesAdded={handleSetNumVariablesAdded}
            />
          }
        />
      </div>
    </div>
  );
}

export default App;
