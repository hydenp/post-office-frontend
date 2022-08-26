import "./App.css";

import GoogleOauth from "./steps/GoogleAuth";
import FileUpload from "./steps/FileUpload";
import { useEffect, useState } from "react";
import DataView from "./steps/DataView";
import BodyInput from "./steps/BodyInput";
import RequestHandler from "./steps/RequestHandler";
import StepCard from "./components/StepCard";
import { cardStates } from "./models";
import { checkValidData, getHangingVariables } from "./steps/utils";
import { colors } from "./assets/colors";

import logo from "./assets/post_office_icon.svg";
import PrimaryButton from "./components/PrimaryButton";

function App() {
  const [bodyInput, setBodyInput] = useState("");
  const [overrideDemoShow, setOverrideDemoShow] = useState(true);
  const [demoWatched, setDemoWatched] = useState(false);
  const [headerVariableWarning, setHeaderVariableWarning] = useState(false);
  const [numVariablesAdded, setNumVariablesAdded] = useState(0);
  const [profileInfo, setProfileInfo] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableHeaderVariables, setTableHeaderVariables] = useState([]);
  const [token, setToken] = useState(null);
  const [validEmails, setValidEmails] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());

  // HELPER METHODS FOR DEBUG/DEV

  // function loadTestData() {
  //   setTableHeaderVariables(testData.tableHeaders);
  //   setTableData(testData.tableData);
  //   setBodyInput(testData.bodyInput);
  // }

  // function printStates() {
  //   console.log("headers = ", tableHeaderVariables);
  //   console.log("data = ", tableData);
  //   console.log("profile = ", profileInfo);
  // }

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

  // COMPONENT: FileUpload
  function getFileUploadCardState() {
    if (tableData.length > 0) {
      return cardStates.complete;
    } else {
      return cardStates.todo;
    }
  }

  // COMPONENT: DataView
  function getDataViewCardState() {
    // update card state if all data is valid
    if (tableData.length === 0) {
      return cardStates.notStarted;
    } else if (checkValidData(tableData)) {
      return cardStates.complete;
    } else {
      return cardStates.todo;
    }
  }

  // COMPONENT: BodyInput
  function getBodyInputCardState() {
    let allVariablesUsed = true;
    for (const k in tableHeaderVariables) {
      if (!["0", "1"].includes(k)) {
        allVariablesUsed =
          allVariablesUsed &&
          bodyInput.indexOf(`{${tableHeaderVariables[k]}}`) !== -1;
      }
    }
    if (
      allVariablesUsed &&
      bodyInput !== "" &&
      getHangingVariables(bodyInput, tableHeaderVariables).length === 0
    ) {
      return cardStates.complete;
    } else {
      return cardStates.todo;
    }
  }

  // COMPONENT: BodyInput
  function getGoogleLoginCardState() {
    if (token !== null && profileInfo !== null) {
      return cardStates.complete;
    } else {
      return cardStates.todo;
    }
  }

  // COMPONENT: RequestHandler
  function getReviewAndSendCardState() {
    // check google token is still valid
    if (token !== null) {
      if (new Date().getTime() > token.expiry) {
        localStorage.removeItem("googleInfo");
        setToken(null);
        setProfileInfo(null);
      }
    }

    const currStates = [
      getDataViewCardState(),
      getBodyInputCardState(),
      getGoogleLoginCardState(),
    ];

    if (
      currStates[0] === cardStates.complete &&
      currStates[1] === cardStates.complete &&
      currStates[2] === cardStates.complete
    ) {
      return cardStates.complete;
    } else if (
      currStates[0] !== cardStates.notStarted ||
      currStates[1] !== cardStates.notStarted ||
      currStates[2] !== cardStates.todo
    ) {
      return cardStates.todo;
    } else {
      return cardStates.notStarted;
    }
  }

  // HANDLE SET FUNCTIONS

  function handleSetBodyInput(v) {
    setBodyInput(v);
  }

  function handleSetOverride(v) {
    setOverrideDemoShow(v);
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

  // track window size and update whenever changed
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="App" style={{ position: "relative", minHeight: "100vh" }}>
      {windowSize.innerWidth > 750 ? (
        <>
          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBottom: 20,
            }}
          >
            <div
              style={{
                paddingTop: 50,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={logo}
                alt="logo"
                style={{
                  height: 70,
                  marginRight: 20,
                }}
              />
              <p
                style={{
                  margin: 0,
                  paddingBottom: 5,
                  fontSize: 60,
                  fontWeight: 600,
                }}
              >
                Post Office
              </p>
            </div>
            <p
              style={{
                marginLeft: 70,
                color: colors.DEACTIVATED,
                paddingBottom: 20,
                fontStyle: "italic",
              }}
            >
              The quickest way to send templated emails
            </p>
            {/*<button*/}
            {/*  onClick={() => console.log(process.env.REACT_APP_AWS_GATEWAY_DEV_API)}*/}
            {/*>*/}
            {/*  print endpoint*/}
            {/*</button>*/}
            {/*<button onClick={() => console.log(token)}>print token</button>*/}
            {/*<button onClick={unsetTestData}>UNSET Data</button>*/}
            {/*<button onClick={handleDataColdStart}>Cold Start</button>*/}
            {/*<button onClick={resetLocalStorage}>UNSET Local Storage</button>*/}
            {/*<button onClick={printStates}>Print Data</button>*/}

            <StepCard
              cardInfo={{
                number: "~",
                status: demoWatched ? cardStates.complete : cardStates.todo,
                title: "Quick Tutorial",
              }}
              overrideShow={overrideDemoShow}
              handleSetOverride={handleSetOverride}
              childComponent={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <iframe
                    width="700"
                    height="530"
                    src="https://www.youtube.com/embed/EbDxQbGfSfM"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: 0,
                    }}
                  ></iframe>
                  <PrimaryButton
                    title={"Done"}
                    style={{
                      width: 40,
                      marginTop: 20,
                    }}
                    onClick={() => {
                      setOverrideDemoShow(true);
                      setDemoWatched(true);
                    }}
                  />
                </div>
              }
            />

            {/*File upload step */}
            <StepCard
              cardInfo={{
                number: 1,
                status: getFileUploadCardState(),
                title: "Upload CSV or start with a Blank Data Table",
              }}
              childComponent={
                <FileUpload
                  tableData={tableData}
                  handleSetTableHeaderVariables={handleSetTableHeaderVariables}
                  handleSetTableData={handleSetTableData}
                />
              }
            />

            {/* View end Edit the data step */}
            <StepCard
              cardInfo={{
                number: 2,
                status: getDataViewCardState(),
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
                  handleSetHeaderVariableWarning={
                    handleSetHeaderVariableWarning
                  }
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
                status: getBodyInputCardState(),
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
                status: getGoogleLoginCardState(),
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
                status: getReviewAndSendCardState(),
                title: "Review and Send",
              }}
              childComponent={
                <RequestHandler
                  body={bodyInput}
                  data={tableData}
                  profileInfo={profileInfo}
                  token={token}
                  validEmails={validEmails}
                  validationStates={[
                    getDataViewCardState(),
                    getBodyInputCardState(),
                    getGoogleLoginCardState(),
                  ]}
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
          <div
            style={{
              marginTop: 15,
              height: 65,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.BACKGROUND,
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: colors.DEACTIVATED,
              }}
            >
              React + Amplify | Lambda + Terraform
            </p>
            <a
              href="https://v727sjlnxuq.typeform.com/to/sH25XXP3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p
                style={{
                  position: "absolute",
                  right: 25,
                  bottom: 0,
                  color: colors.DEACTIVATED,
                  padding: 7,
                  backgroundColor: "#ECEBEB",
                  borderRadius: 7,
                }}
              >
                Feedback
              </p>
            </a>
          </div>
        </>
      ) : (
        // <div
        //   style={{
        //     display: "flex",
        //     alignItems: "flex-start",
        //     backgroundColor: "red",
        //     height: "100%",
        //   }}
        // >
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              paddingTop: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                height: 36,
                marginRight: 12,
              }}
            />
            <p
              style={{
                margin: 0,
                paddingBottom: 5,
                fontSize: 42,
                fontWeight: 600,
              }}
            >
              Post Office
            </p>
          </div>
          <p
            style={{
              width: "70%",
              alignSelf: "center",
              color: colors.DEACTIVATED,
              fontSize: 14,
              marginBottom: 30,
            }}
          >
            Please use a bigger screen in order for Post Office to provide a
            suitable experience. Meantime you can checkout the demo below!
          </p>
          <div
            style={{
              width: "70%",
            }}
          >
            <iframe
              width={"100%"}
              height={0.5 * windowSize.innerWidth}
              src="https://www.youtube.com/embed/EbDxQbGfSfM"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: 0,
              }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
