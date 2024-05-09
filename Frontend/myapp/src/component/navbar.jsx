import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../styles/navbar.css";
import img1 from "../img/logo.png";
import ProfileStatistics from "./assets/userProfile";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleProfileClick = () => {
    setShowProfileCard(true);
  };
  const handleLogout=()=>{
    setIsLoggedIn(false);
    localStorage.removeItem("token")
  }

  const handleCloseProfileCard = () => {
    setShowProfileCard(false);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="nav-wrapper">
          <div className="gradbar"></div>
          <nav className="navbar">
            <img src={img1} alt="Company Logo" />
            <div
              className={`menu-toggle ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <ul className={`nav ${isOpen ? "mobile-nav" : ""}`}>
              <li className="nav-item">
                <Link to="/" className="user-div"> {/* Use Link component */}
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/team" className="user-div"> {/* Use Link component */}
                  Team
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="user-div"> {/* Use Link component */}
                  About
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="user-div" onClick={handleProfileClick}>
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="user-div"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="user-div"> {/* Use Link component */}
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="user-div"> {/* Use Link component */}
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
      {showProfileCard && (
        <div className="profile-card">
          <ProfileStatistics />
          <button onClick={handleCloseProfileCard} className="close-btn">
            ×
          </button>
        </div>
      )}
    </div>
  );
};
export default Navbar;