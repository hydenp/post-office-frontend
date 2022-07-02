import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const Login = ({ handleLogin }) => {
  const login = useGoogleLogin({
    scope: "https://mail.google.com/",
    onSuccess: (tokenResponse) => {
      handleLogin(tokenResponse);
    },
  });

  return <button onClick={() => login()}>Sign In with Google</button>;
};

const GoogleOauth = () => {
  const [token, setToken] = useState({});

  function handleLogin(props) {
    setToken(props);
  }

  function printToken() {
    console.log("-----------------------------");
    console.log(token);
    console.log(token.access_token);
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <br />
      <Login handleLogin={handleLogin} />
      <hr />
      <button onClick={printToken}>Print Token</button>
    </GoogleOAuthProvider>
  );
};

export default GoogleOauth;
