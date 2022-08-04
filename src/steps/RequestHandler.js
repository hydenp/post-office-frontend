import React, { useEffect, useState } from "react";
import axios from "axios";
import PrimaryButton from "../components/PrimaryButton";
import StepStatus from "../components/StepStatus";

const requestStatuses = {
  notSent: 0,
  sending: 1,
  complete: 2,
};

const RequestHandler = ({
  body,
  data,
  profileInfo,
  token,
  validEmails,
  handleResetInputRequest,
  handleResetToken,
}) => {
  const [request, setRequest] = useState({});
  const [requestReady, setRequestReady] = useState(false);
  const [response, setResponse] = useState(null);
  const [requestStatus, setRequestStatus] = useState(requestStatuses.notSent);
  // const [requestStatus, setRequestStatus] = useState(requestStatuses.sending);

  // DEBUG/DEV
  function test() {
    console.log(request);
    console.log(requestReady);
  }

  // FUNCTIONS

  function createRequest(body, data, token) {
    // structure of request
    const newRequest = {
      headers: {
        "content-type": "application/json",
      },
      emails: [],
      auth: {},
    };

    // loop through and make replacements of each variable in the body
    for (const rowIndex in data) {
      let replacedBody = body;
      for (const k in data[rowIndex]) {
        replacedBody = replacedBody.replace(`{${k}}`, data[rowIndex][k]);
      }
      const email = {
        recipient: data[rowIndex]["Recipient"],
        subject: data[rowIndex]["Subject"],
        body: replacedBody,
      };
      newRequest.emails.push(email);
    }
    newRequest.auth.token = token.token.access_token;
    // newRequest.auth.token = "broke";
    return newRequest;
  }

  function makeRequest() {
    return axios.post(process.env.REACT_APP_AWS_GATEWAY_DEV_API, request);
  }

  async function handleRequest() {
    if (new Date().getTime() > token.expiry) {
      //  make sure the token is still valid before sending the request
      handleResetToken();
      window.alert(
        "The Google token is no longer valid, please sign in again!"
      );
    } else {
      // set status to sending
      setRequestStatus(requestStatuses.sending);
      await makeRequest().then((r) => {
        setResponse(r);
      });
      setRequestStatus(requestStatuses.complete);
    }
  }

  // HOOKS

  useEffect(() => {
    if (body !== "" && data !== null && token !== null && validEmails) {
      setRequestReady(true);
      setRequest(createRequest(body, data, token));
    } else {
      setRequestReady(false);
    }
  }, [body, data, validEmails, token]);

  return (
    <div>
      {/*<button onClick={test}>Print request</button>*/}
      {(() => {
        if (requestStatus === requestStatuses.notSent) {
          return (
            <div>
              <StepStatus
                title={"Data Upload and Ready"}
                status={validEmails ? "complete" : ""}
              />
              <StepStatus
                title={"Body Template Added"}
                status={body ? "complete" : ""}
              />
              <StepStatus
                title={"Google Authorized"}
                status={token ? "complete" : ""}
              />
              {profileInfo ? (
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <PrimaryButton
                    title={`Send ${data ? data.length : ""} email(s)`}
                    onClick={() => handleRequest()}
                    disabled={!requestReady}
                  />
                  <p
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    from the address{" "}
                    <span style={{ color: "#0066FF" }}>
                      {profileInfo.email}
                    </span>
                  </p>
                </div>
              ) : (
                <p>Sign In with Google above to send!</p>
              )}
            </div>
          );
        } else if (requestStatus === requestStatuses.sending) {
          return (
            <div
              style={{
                // backgroundColor: "yellow",
                display: "flex",
                alignItems: "flex-start",
                alignContent: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  marginRight: 15,
                }}
              >
                Sending emails (hopefully)
              </p>
              <div className="loading-spinner"></div>
            </div>
          );
        } else if (requestStatus === requestStatuses.complete) {
          if (response.data.status === "success") {
            return (
              <>
                <StepStatus
                  title={"All messages successfully sent"}
                  status={"complete"}
                />
                <PrimaryButton
                  onClick={() => {
                    handleResetInputRequest();
                    setRequestStatus(requestStatuses.notSent);
                  }}
                  title={"Clear input and Send More :)"}
                />
              </>
            );
          } else {
            return (
              <>
                <StepStatus
                  title={"Bad Sign In! Please try Authorizing Google again!"}
                  status={"not-complete"}
                />
                <PrimaryButton
                  title={"Okay"}
                  disabled={false}
                  onClick={() => setRequestStatus(requestStatuses.notSent)}
                />
              </>
            );
          }
        }
      })()}
    </div>
  );
};

export default RequestHandler;
