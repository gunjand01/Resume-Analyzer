import React from "react";
import "./team.css"; // Import CSS file
import harshal from "./Harshal.jpg";
import gunjan from "./Gunjan.jpg";
import pushpaj from "./Pushpaj.jpg"
import { FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

function Profiles() {
  return (
    <div className="prof-main">
      <div className="profiles">
        <div className="prof-child" href="#">
          <img className="prof-pic" src={harshal} alt="" />
          <div className="prof-details">
            <div className="prof-name">Gunjan Dahiwale</div>
            <div className="prof-exp">Full Stack Developer</div>
            <div className="prof-social">
              <FaInstagram />
              <FaTwitter />
              <FaEnvelope />
            </div>
          </div>
        </div>
        <div className="prof-child" href="#">
          <img className="prof-pic" src={gunjan} alt="" />
          <div className="prof-details">
            <div className="prof-name">Gunjan Dahiwale</div>
            <div className="prof-exp">Full Stack Developer</div>
            <div className="prof-social">
              <FaInstagram />
              <FaTwitter />
              <FaEnvelope />
            </div>
          </div>
        </div>
        <div className="prof-child" href="#">
          <img className="prof-pic" src={pushpaj} alt="" />
          <div className="prof-details">
            <div className="prof-name">Gunjan Dahiwale</div>
            <div className="prof-exp">Full Stack Developer</div>
            <div className="prof-social">
              <FaInstagram />
              <FaTwitter />
              <FaEnvelope />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profiles;
