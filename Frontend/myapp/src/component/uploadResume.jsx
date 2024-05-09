import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/uploadResume.css";
import LoadingSpinner from "./assets/loading"

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const ring = document.querySelector(".ring");
    const con = document.querySelector(".rotate-container ");

    if (isUploading) {
      con.style.animationDuration="5s";
      ring.style.animationDuration = "5s";
    }
  }, [isUploading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      setFile(files[0]);
      console.log(file);
    }
  };
  const token = localStorage.getItem('token');
  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("resume", uploadedFile);
      try {
        const response = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`
            },
          }
        );
        console.log("File uploaded:", response.data);
        window.location.href = "http://localhost:3000/dashboard";
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="upload-resume">
      {isUploading && <LoadingSpinner />}
      <div className={`app-main ${isDragOver ? "dragover" : ""}`}>
        <div className="page page-drop">
          <div className="ring">
            <div className="rotate-container">
              <section className="drop-story">
                <div className="drop-secondary">
                  <div className="media-figure dropzone-container">
                    <div
                      className="dropzone"
                      id="dropzone"
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="dropzone-content--with-image dropzone-content">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="69"
                          height="51"
                          viewBox="0 0 69 51"
                          className="dropzone-content__image tw-mx-auto tw-mb-1"
                        >
                          <defs>
                            <linearGradient
                              id="icon-drop-folder_svg__a"
                              x1="34.5"
                              x2="34.5"
                              y1="48.67"
                              y2="0.19"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0.67" stopColor="#112caf"></stop>
                              <stop offset="0.77" stopColor="#2250f4"></stop>
                            </linearGradient>
                          </defs>
                          <path
                            fill="url(#icon-drop-folder_svg__a)"
                            d="M62.93 6.8H37.11L29.84.19H6.07a3.53 3.53 0 0 0-3.53 3.53v41.42a3.53 3.53 0 0 0 3.53 3.53h56.86a3.53 3.53 0 0 0 3.53-3.53V10.33a3.53 3.53 0 0 0-3.53-3.53"
                          ></path>
                          <path
                            fill="#ffdd73"
                            d="M6.83 12.56h53.01V35.1H6.83z"
                          ></path>
                          <path
                            fill="#fff6d0"
                            d="M10.27 9.83h53.01v22.54H10.27z"
                          ></path>
                          <path
                            fill="#a6bffd"
                            d="M63.17 50.81H5.83a3.46 3.46 0 0 1-3.5-3.06l-2.07-29a3.25 3.25 0 0 1 3.29-3.51h61.9a3.25 3.25 0 0 1 3.29 3.51l-2.07 29a3.46 3.46 0 0 1-3.5 3.06"
                          ></path>
                        </svg>
                        <p className="para">
                          Drag and drop your
                          <br /> Resume File here
                        </p>
                        <p className="dropzone-browse">
                          Or,{" "}
                          <label
                            htmlFor="dropzone-upload"
                            className="upload-label para"
                          >
                            browse to upload
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            name="files[]"
                            title=" "
                            id="dropzone-upload"
                            className="tw-sr-only"
                            onChange={handleFileChange}
                          />
                        </p>
                      </div>
                      <span className="drop-ring"></span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <input
        type="file"
        accept=".pdf"
        name="files[]"
        title=" "
        id="dropzone-upload"
        className="tw-sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadResume;
