import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/login_signin.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:3001/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username,
  //         password,
  //       }),
  //     }).then((res)=>{
  //       return res.json();
  //     });
  //     console.log(response)
  //     if (response.token) {
  //       localStorage.setItem("token",response.token)
  //       toast.success("Login successful");
  //       setTimeout(() => {
  //         navigate("/resumeUpload");
  //       }, 1600);
  //     } else {
  //       const errorMessage = await response.text();
  //       toast.error(`Login failed: ${errorMessage}`);
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     toast.error("Error during login");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem("token", data.token);
            toast.success("Login successful");
            setTimeout(() => {
                if (data.hasResources) {
                    navigate("/dashboard");
                } else {
                    navigate("/resumeUpload");
                }
            }, 1600);
        } else {
            toast.error(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        toast.error("Error during login");
    }
};

  return (
    <div className="login-container">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            {/* <button className="butt" type="button">
            Forgot password ?
          </button> */}
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <div className="register-link">
            <p>
              Don't have an account?&nbsp;
              <Link to="/register">
                <button className="butt" type="button">
                  Signup
                </button>
              </Link>
            </p>
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          closeOnClick
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Login;
