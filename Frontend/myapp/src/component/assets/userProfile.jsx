import React from 'react';
import './userProfile.css';
import img from "./pas.jpeg"
const ProfileStatistics = () => {
  return (
    <div className="card-container">
      <div className="card-header">
        <img src={img} alt="User Avatar" className="avatar" />
        <h2>Julie L.</h2>
        <p>@Programmer | arsenaultp.com</p>
        <div className="social-icons" style={{ marginTop: '10px',  }}>
            <a href="/" ><i className="fab fa-twitter"></i></a>
            <a href="/"><i className="fab fa-linkedin"></i></a>
            <a href="/"><i className="fab fa-github"></i></a>
          </div>
      </div>
      <div className="card-main">
        <button>MESSAGE NOW</button>
        <div className="stats">
          <div>
            <h3>8471</h3>
            <p>Wallets</p>
          </div>
          <div>
            <h3>8512</h3>
            <p>Income</p>
          </div>
          <div>
            <h3>4751</h3>
            <p>Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatistics;
