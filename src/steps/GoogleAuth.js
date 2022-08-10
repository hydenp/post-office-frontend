import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import axios from "axios";
import { colors } from "../assets/colors";

import GmailIcon from "../assets/gmail.svg";

const PROFILE_URL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
const GOOGLE_API_SCOPE = "https://www.googleapis.com/auth/gmail.send";

const Login = ({ handleGoogleLogin, title }) => {
  async function getGoogleProfile(accessToken) {
    return axios.get(PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  const login = useGoogleLogin({
    scope: GOOGLE_API_SCOPE,
    onSuccess: async (tokenResponse) => {
      // noinspection JSUnresolvedVariable
      await getGoogleProfile(tokenResponse.access_token).then((r) => {
        console.log(r);
        handleGoogleLogin(tokenResponse, r.data);
      });
    },
  });

  return (
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
        borderColor: colors.ACCENT,
        cursor: "pointer",
        flexWrap: "nowrap",
        alignContent: "center",
        backgroundColor: "white",
      }}
      onClick={() => login()}
    >
      <p
        style={{
          color: colors.ACCENT,
          fontSize: 16,
          marginRight: 10,
        }}
      >
        {title}
      </p>
      <img src={GmailIcon} alt="gmail" />
    </button>
  );
};

const GoogleOauth = ({
  profileInfo,
  token,
  handleSetProfileInfo,
  handleSetToken,
}) => {
  function handleGoogleLogin(token, profileInfo) {
    handleSetToken({
      token: token,
      // expiry: new Date().getTime() + 10 * 1000,
      expiry: new Date().getTime() + 3500 * 1000,
    });
    handleSetProfileInfo(profileInfo);

    // set the login in local storage
    localStorage.setItem(
      "googleInfo",
      JSON.stringify({
        token: token,
        profileInfo: profileInfo,
        // set for 100 seconds less than an hour
        // expiry: new Date().getTime() + 10 * 1000,
        expiry: new Date().getTime() + 3500 * 1000,
      })
    );
  }

  function checkCachedGoogleUser() {
    // check for a logged-in user and if they're still valid, if so, load into state variables
    const cachedUser = JSON.parse(localStorage.getItem("googleInfo"));
    if (cachedUser !== null) {
      if (new Date().getTime() > cachedUser.expiry) {
        localStorage.removeItem("googleInfo");
      } else {
        handleSetToken({
          token: cachedUser.token,
          expiry: cachedUser.expiry,
        });
        handleSetProfileInfo(cachedUser.profileInfo);
      }
    }
  }

  useEffect(() => {
    checkCachedGoogleUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <span style={{ color: colors.ACCENT }}>{profileInfo.email}</span>
          </p>
        ) : (
          <p
            style={{
              marginTop: 0,
              color: colors.DEACTIVATED,
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
