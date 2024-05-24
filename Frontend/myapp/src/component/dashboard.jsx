// import React, { useState, useEffect } from "react";
// import Navbar from "./navbar";
// import "../styles/dashboard.css";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "../../node_modules/react-circular-progressbar/dist/styles.css";

// const Dashboard = () => {
//   const [resumeData, setResumeData] = useState(null);
//   const [videoResumeData, setVideoResumeData] = useState(null);

//   useEffect(() => {
//     const fetchResumeData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:3001/resources", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         console.log(data)
//         setResumeData(data);
//       } catch (error) {
//         console.error("Error fetching resume data:", error);
//       }
//     };

//     fetchResumeData();
//   }, []);

//   useEffect(() => {
//     const fetchVideoResumeData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:3001/videoResources", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         console.log(data)
//         setVideoResumeData(data);
//       } catch (error) {
//         console.error("Error fetching resume data:", error);
//       }
//     };

//     fetchVideoResumeData();
//   }, []);

//   if (!resumeData) {
//     return <div>Loading...</div>;
//   }
//   const { Name, Email, Phone, Skills, Resume_Score } = resumeData;
//   const {AboutMe} = videoResumeData;
//   const getColor = () => {
//     if (Resume_Score >= 65) {
//       return "#00cc00";
//     } else if (Resume_Score >= 45) {
//       return "#ffcc00";
//     } else {
//       return "#ff0000";
//     }
//   };
//   const formattedScore = Resume_Score.toFixed(2);
//   const CircularProgress = () => (
//     <CircularProgressbar
//       value={Resume_Score}
//       text={`${formattedScore}%`}
//       styles={{
//         root: { width: "200px" },
//         path: {
//           stroke: getColor(),
//         },

//         text: {
//           fill: getColor(),
//         },
//       }}
//     />
//   );

//   return (
//     <div>
//       <Navbar />
//       <div className="home-screen">
//         <div className="main-screen">
//           <div className="heading-div">
//             <div className="basic-details">
//               <h1>Basic Details</h1>
//               <div className="basic-details-subcontainer">
//                 <strong>Name:</strong> {Name}
//               </div>
//               <div className="basic-details-subcontainer">
//                 <strong>Email:</strong>
//                 {Email?.map((skill, index) => (
//                   <div key={index}>{skill}</div>
//                 ))}
//               </div>
//               <div className="basic-details-subcontainer">
//                 <strong>Phone:</strong> {Phone}
//               </div>
//             </div>
//           </div>
//           <div className="heading-div">
//             <h1>Your Skills</h1>
//             <div className="tag-container">
//               {Skills?.map((skill, index) => (
//                 <div className="tag" key={index}>
//                   {skill}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="heading-div">
//             <h1>About Me</h1>
//             <div className="tag-container">
//               <div className="inner-tag">

//               {AboutMe}
//               </div>
//             </div>
//           </div>
//           <div className="heading-div">
//             <h1>Resume Score</h1>
//             <div className="prog-bar">
//               <CircularProgress />
//             </div>
//           </div>
//         </div>
//         <div className="resume-screen">
//           <iframe
//             title="myFrame"
//             className="iframe-win"
//             src={`http://localhost:3001/resumeName/`}
//             width="100%"
//             height="500px"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Dashboard;

import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import "../styles/dashboard.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "../../node_modules/react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const [resumeData, setResumeData] = useState(null);
  const [videoResumeData, setVideoResumeData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/resumeName", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching the PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/resources", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setResumeData(data);
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchResumeData();
  }, []);

  useEffect(() => {
    const fetchVideoResumeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/videoResources", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setVideoResumeData(data);
      } catch (error) {
        console.error("Error fetching video resume data:", error);
      }
    };

    fetchVideoResumeData();
  }, []);

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const { Name, Email, Phone, Skills, Resume_Score } = resumeData;
  const { AboutMe } = videoResumeData || {};

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
                {Email?.map((email, index) => (
                  <div key={index}>{email}</div>
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
          {AboutMe && (
            <div className="heading-div">
              <h1>About Me</h1>
              <div className="tag-container">
                <div className="inner-tag">{AboutMe}</div>
              </div>
            </div>
          )}
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
            src={pdfUrl}
            width="100%"
            height="500px"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
