import React, { useEffect, useState } from "react";
import axios from "axios";
import ResponseView from "./ResponseView";

const RequestHandler = ({
  body,
  data,
  token,
  handleResetInputRequest,
  handleResetToken,
  validEmails,
}) => {
  const [request, setRequest] = useState({});
  const [requestReady, setRequestReady] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [response, setResponse] = useState(null);

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
    return newRequest;
  }

  function makeRequest() {
    if (new Date().getTime() > token.expiry) {
      //  make sure the token is still valid before sending the request
      handleResetToken();
      window.alert(
        "The Google token is no longer valid, please sign in again!"
      );
    } else {
      setRequestSent(true);
      setRequestInProgress(true);
      axios
        .post(process.env.REACT_APP_AWS_GATEWAY_DEV_API, request)
        .then((response) => {
          console.log(response);
          setResponse(response);
          setRequestInProgress(false);
          handleResetInputRequest();
        });
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
      <button onClick={test}>Print request</button>
      {(() => {
        if (requestSent === false) {
          return (
            <>
              <h2>Send Mail</h2>
              <p style={{ color: validEmails ? "green" : "red" }}>Data Ready</p>
              <p style={{ color: body ? "green" : "red" }}>Body Added</p>
              <p style={{ color: token ? "green" : "red" }}>
                Signed in with Google
              </p>
              <br />
              <br />
              <button onClick={makeRequest} disabled={!requestReady}>
                Send Emails
              </button>
            </>
          );
        } else if (requestSent && requestInProgress) {
          return <p>Request Sending!!!</p>;
        } else {
          return (
            <ul>
              <h2>Mail Status</h2>
              <ResponseView response={response} />
              <button onClick={() => setRequestSent(false)}>Send more!</button>
            </ul>
          );
        }
      })()}
    </div>
  );
};

export default RequestHandler;
