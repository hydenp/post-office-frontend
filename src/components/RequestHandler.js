import React, { useEffect, useState } from "react";

const RequestHandler = ({ body, data, token }) => {
  const [request, setRequest] = useState({});
  const [requestReady, setRequestReady] = useState(false);

  function createRequest(body, data, token) {
    // structure of request
    const newRequest = {
      emails: [],
      auth: {},
    };

    // loop through and make replacements
    for (const rowIndex in data) {
      let replacedBody = body;
      for (const k in data[rowIndex]) {
        replacedBody = replacedBody.replace(`{${k}}`, data[rowIndex][k]);
      }
      const email = {
        email: data[rowIndex].email,
        subject: data[rowIndex].subject,
        body: replacedBody,
      };
      newRequest.emails.push(email);
    }
    newRequest.auth.token = token.access_token;
    return newRequest;
  }

  useEffect(() => {
    setRequestReady(body !== null && data !== null && token !== null);
    if (body !== null && data !== null && token !== null) {
      setRequest(createRequest(body, data, token));
    }
  }, [body, data, token]);

  function test() {
    console.log(request);
    console.log(requestReady);
  }

  function makeRequest() {
    //  TODO: implement sending the request
  }

  return (
    <div>
      <p style={{ color: data ? "green" : "red" }}>Data Uploaded</p>
      <p style={{ color: body ? "green" : "red" }}>Body Added</p>
      <p style={{ color: token ? "green" : "red" }}>Signed in with Google</p>
      <button onClick={test}>Print request</button>
      <button onClick={makeRequest} disabled={!requestReady}>
        SEND IT!!
      </button>
    </div>
  );
};

export default RequestHandler;
