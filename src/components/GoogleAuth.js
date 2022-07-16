import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const Login = ({ handleLogin }) => {
  const login = useGoogleLogin({
    scope: "https://mail.google.com/",
    onSuccess: (tokenResponse) => {
      handleLogin(tokenResponse);
    },
  });

  return <button onClick={() => login()}>Sign In with Google</button>;
};

const GoogleOauth = ({ handleToken }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <br />
      <Login handleLogin={handleToken} />
      <hr />
    </GoogleOAuthProvider>
  );
};

export default GoogleOauth;
