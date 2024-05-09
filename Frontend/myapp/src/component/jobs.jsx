import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/navbar";
import "../styles/jobs.css";

const JobDetails = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/jobs")
      .then((response) => {
        setJobs(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching job data:", error);
      });
  }, [jobs]); // Include jobs in the dependency array

  const numColumns = Math.ceil(jobs.length / 3);

  return (
    <div>
      <Navbar />
      <div className="heading-name">Recommended Jobs</div>
      <div className="main-container">
        <section className="gallery">
          {/* Create columns dynamically based on the number of jobs */}
          {[...Array(numColumns)].map((_, columnIndex) => (
            <div className="column" key={columnIndex}>
              {/* Slice jobs for the current column */}
              {jobs.slice(columnIndex * 3, (columnIndex + 1) * 3).map((job, index) => (
                <Article key={index} job={job} />
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};


const Article = ({ job }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleApplyClick = () => {
    window.open(job.url, "_blank");
  };


  return (
    <article onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div>
        {!isHovered && (
          <div className="detail-job-info">
            <h3>{job.title}</h3>
            <p>{job.company.name}</p>
            <p>{job.benefits}</p>
            <button className="raise" onClick={handleApplyClick}>Apply</button>
          </div>
        )}
        {isHovered && (
          <div className="detail-job-info">
            <h3>{job.title}</h3>
            <p>{job.company.name}</p>
            <p>{job.benefits}</p>
            <p>{job.postDate}</p>
            <p>{job.location}</p>
            <p>{job.type}</p>
            <button className="raise" onClick={handleApplyClick}>Apply</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default JobDetails;
