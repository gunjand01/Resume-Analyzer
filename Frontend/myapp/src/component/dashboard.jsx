import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import "../styles/dashboard.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "../../node_modules/react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        // Retrieve the token from local storage
        const response = await fetch("http://localhost:3001/resources", {
          headers: {
            Authorization: `Bearer ${token}`,
             // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data)
        setResumeData(data);
        // Assuming setResumeData is a state updater function
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchResumeData();
  }, []);

  if (!resumeData) {
    return <div>Loading...</div>;
  }
  const { Name, Email, Phone, Skills, Recommended_Skills, Resume_Score } =
    resumeData;
  const getColor = () => {
    if (Resume_Score >= 65) {
      return "#00cc00";
    } else if (Resume_Score >= 45) {
      return "#ffcc00";
    } else {
      return "#ff0000";
    }
  };
  const formattedScore = Resume_Score.toFixed(2);
  const CircularProgress = () => (
    <CircularProgressbar
      value={Resume_Score}
      text={`${formattedScore}%`}
      styles={{
        root: { width: "200px" },
        path: {
          stroke: getColor(),
        },

        text: {
          fill: getColor(),
        },
      }}
    />
  );

  return (
    <div>
      <Navbar />
      <div className="home-screen">
        <div className="main-screen">
          <div className="heading-div">
            <div className="basic-details">
              <h1>Basic Details</h1>
              <div className="basic-details-subcontainer">
                <strong>Name:</strong> {Name}
              </div>
              <div className="basic-details-subcontainer">
                <strong>Email:</strong>
                {Email?.map((skill, index) => (
                  <div key={index}>{skill}</div>
                ))}
              </div>
              <div className="basic-details-subcontainer">
                <strong>Phone:</strong> {Phone}
              </div>
            </div>
          </div>
          <div className="heading-div">
            <h1>Your Skills</h1>
            <div className="tag-container">
              {Skills?.map((skill, index) => (
                <div className="tag" key={index}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div className="heading-div">
            <h1>Recommended Skills</h1>
            <div className="tag-container">
              {Recommended_Skills?.map((Recommended_Skills, index) => (
                <div className="tag" key={index}>
                  {Recommended_Skills}
                </div>
              ))}
            </div>
          </div>
          <div className="heading-div">
            <h1>Resume Score</h1>
            <div className="prog-bar">
              <CircularProgress />
            </div>
          </div>
        </div>
        <div className="resume-screen">
          <iframe
            title="myFrame"
            className="iframe-win"
            src={`http://localhost:3001/resumeName/`}
            width="100%"
            height="500px"
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
