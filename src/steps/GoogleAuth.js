import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import GmailIcon from "../assets/gmail.svg";

const Login = ({ handleGoogleLogin, title }) => {
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

  return (
    // <div>
    <button
      style={{
        height: 50,
        all: "unset",
        background: "none",
        display: "flex",

        paddingLeft: 20,
        paddingRight: 20,

        borderRadius: 10,
        borderStyle: "solid",
        borderColor: "#0066FF",
        cursor: "pointer",
        flexWrap: "nowrap",
        alignContent: "center",
        backgroundColor: "white",
      }}
      onClick={() => login()}
    >
      <p
        style={{
          color: "#0066FF",
          fontSize: 16,
          marginRight: 10,
        }}
      >
        {title}
      </p>
      <img src={GmailIcon} alt="" />
    </button>
  );
};

const GoogleOauth = ({ profileInfo, token, handleGoogleLogin }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        {profileInfo ? (
          <p
            style={{
              marginTop: 0,
              fontSize: 24,
            }}
          >
            Welcome{" "}
            <span style={{ color: "#0066FF" }}>{profileInfo.email}</span>
          </p>
        ) : (
          <p
            style={{
              marginTop: 0,
            }}
          >
            Connect POST OFFICE to your gmail account to send the email from
            your personal account
          </p>
        )}
        <Login
          title={
            token === null
              ? "Sign In with Google"
              : "Sign In with a different Google Account"
          }
          handleGoogleLogin={handleGoogleLogin}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOauth;
