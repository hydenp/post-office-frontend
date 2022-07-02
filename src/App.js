import "./App.css";

import GoogleOauth from "./components/GoogleAuth";
import FileUpload from "./components/FileUpload";
import { useEffect, useState } from "react";
import DataView from "./components/DataView";
import BodyInput from "./components/BodyInput";
import RequestHandler from "./components/RequestHandler";

function App() {
  const [tableHeaders, setTableHeaders] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [bodyInput, setBodyInput] = useState(null);
  const [token, setToken] = useState(null);

  // useEffect(() => {
  //   console.log("table data = ", tableData);
  //   console.log("body input = ", bodyInput);
  //   console.log("token = ", token);
  // }, [tableData, bodyInput, token]);

  useEffect(() => {
    console.log("re-render");
  });

  function handleToken(t) {
    setToken(t);
  }

  function handleBodyInput(v) {
    if (v === "") {
      setBodyInput(null);
    } else {
      setBodyInput(v);
    }
  }

  function handleUpload(headers, data) {
    setTableHeaders(headers);
    setTableData(data);
  }

  function handleRemoveFile() {
    if (
      window.confirm(
        "Are you sure you want to remove that file? Doing so will remove all changes in the table."
      )
    ) {
      setTableHeaders(null);
      setTableData(null);
    }
  }

  function printData() {
    console.log("Data ------");
    console.log(tableData);
    console.log(bodyInput);
  }

  function handleFieldEdit(rowIndex, key, newValue) {
    // create the new data object with updated fields
    const newData = {
      ...tableData,
      [rowIndex]: {
        ...tableData[rowIndex],

        // override with new value
        [key]: newValue,
      },
    };

    // set the state to the new value
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

        {/* Component to handle file upload*/}
        <FileUpload
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
        />

        <div>
          <h2>View and Edit your uploaded data</h2>
          <DataView
            tableHeaders={tableHeaders}
            tableData={tableData}
            handleFieldEdit={handleFieldEdit}
          />
          <br />
          <button onClick={printData}>print data</button>
        </div>

        {/* Component to handle creating body of email */}
        <div>
          <h2>Create a body for your email</h2>
          <BodyInput
            variableNames={tableHeaders}
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
          <h2>Send Mail</h2>
          <RequestHandler body={bodyInput} data={tableData} token={token} />
        </div>
      </div>
    </div>
  );
}

export default App;
