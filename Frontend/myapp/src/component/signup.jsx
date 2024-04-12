import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Registration = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const names = fullName.split(' ');
      const firstName = names[0];
      const lastName = names[names.length - 1];
      
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
        }),
      });

      if (response.ok) {
        toast.success('Signup successful');
        setTimeout(() => {
          navigate("/resumeUpload");
        }, 1600);
      } else {
        const errorMessage = await response.text();
        toast.error(`Signup failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Error during signup');
    }
  };

  return (
    <div className="login-container">

    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
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
        <div className="remember-forgot"></div>
        <button type="submit" className="btn">
          Register
        </button>
        <div className="remember-forgot"></div>
        <div className="login-link">
          <p>
            Already have an account? &nbsp;{" "}
            <Link to="/login">
              <button className="butt" type="button">
                Login
              </button>
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer 
              position="top-center"
              autoClose={1500}
              closeOnClick
              pauseOnHover/>
    </div>
    </div>

  );
};

export default Registration;
