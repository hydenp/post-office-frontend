import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = ({ handleGoogleLogin }) => {
  async function getGoogleProfile(accessToken) {
    return axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  const login = useGoogleLogin({
    scopes: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    onSuccess: async (tokenResponse) => {
      await getGoogleProfile(tokenResponse.access_token).then((r) => {
        console.log(r);
        handleGoogleLogin(tokenResponse, r.data);
      });
    },
  });

  return <button onClick={() => login()}>Sign In with Google</button>;
};

const GoogleOauth = ({ handleGoogleLogin }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <br />
      <Login handleGoogleLogin={handleGoogleLogin} />
      <hr />
    </GoogleOAuthProvider>
  );
};

export default GoogleOauth;
