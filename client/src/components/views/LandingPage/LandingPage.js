import React, { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isGoogleLogined, setisGoogleLogined] = useState(false);
  const [isLogined, setisLogined] = useState({
    success: false,
    accessToken: "",
  });
  // Google Login API ID
  const GoogleClientId =
    "515877873051-1as951vpielge00b45jb5h15021nnelg.apps.googleusercontent.com";

  // 로그아웃 함수부
  const onClickLogoutHandler = () => {
    if (isGoogleLogined) {
      setisLogined({
        success: false,
        accessToken: "",
      });
      setisGoogleLogined(false);
    } else {
      axios.get(`/api/users/logout`).then((response) => {
        if (response.data.success) {
          setisLogined({
            success: false,
            accessToken: "",
          });
          console.log("logout ", response);
        } else {
          alert("로그아웃 하는데 실패 했습니다.");
        }
      });
    }
  };

  // 이메일로 로그인 함수부
  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        console.log("login response", response);
        setisLogined({
          success: true,
          accessToken: response.accessToken,
        });
      } else {
        alert("Error˝");
      }
    });
  };

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>토큰 테스트</h2>
      <br />
      {isLogined.success ? (
        // 로그인 렌더링 화면
        <div>
          <GoogleLogout
            clientId={GoogleClientId}
            render={(renderProps) => (
              <button
                onClick={onClickLogoutHandler}
                disabled={renderProps.disabled}
              >
                Log Out
              </button>
            )}
            buttonText="Logout"
            onLogoutSuccess={(response) => {
              alert("Suucess in Logout");
              setisLogined({ success: false, accessToken: "" });
            }}
          ></GoogleLogout>
        </div>
      ) : (
        //   로그인 렌더링 화면
        // TODO: 구글로 로그인한 경우, 인증부분을 어떻게 처리하나?
        // -> 특정 구역 출입 가능 여부 어떻게?
        <div style={{ display: "flex", flexDirection: "column" }}>
          <GoogleLogin
            clientId={GoogleClientId}
            buttonText="구글로 로그인"
            onSuccess={(response) => {
              alert("Suucess in Google Login");
              setisLogined({
                success: true,
                accessToken: response.accessToken,
              });
              setisGoogleLogined(true);
            }}
            onFailure={(response) => {
              alert("Error in Google Login");
            }}
            cookiePolicy={"single_host_origin"}
          />
          <br />
          <br />
          <div>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={onSubmitHandler}
            >
              <label>Email</label>
              <input type="email" value={Email} onChange={onEmailHandler} />
              <label>Password</label>
              <input
                type="password"
                value={Password}
                onChange={onPasswordHandler}
              />
              <br />
              <button type="submit">이메일로 로그인</button>
              <br />
              <button onClick={() => props.history.push("/register")}>
                회원가입
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(LandingPage);
