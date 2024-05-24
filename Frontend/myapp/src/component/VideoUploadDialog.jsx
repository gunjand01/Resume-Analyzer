import React, { useState } from "react";
import axios from "axios";

import "../styles/VideoUploadDialog.css";

const VideoUploadDialog = ({ isOpen, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
      await uploadFile(uploadedFile);
    }
  };

  const token = localStorage.getItem('token');
  const uploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("videoResume", file); // Ensure this field name matches the one on the server

    try {
      console.log(token);
      const response = await axios.post(
        "http://localhost:3001/uploadVideo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // Include the token in the header
          }
        }
      );
      console.log("Video resume uploaded:", response.data);
      onClose(); // Close the popup on successful upload
    } catch (error) {
      console.error("Error uploading video resume:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="popup-container">
      <div className="dialog">
        <h1 className="dialog__heading">Do you want to upload a video resume?</h1>
        <form className="dialog__form" onSubmit={(e) => e.preventDefault()}>
          <div className="dialog__file-upload">
            <input
              type="file"
              accept="video/*"
              className="dialog__input"
              onChange={handleFileChange}
              name="video"
              disabled={isUploading}
            />
            <p className="dialog__text">
              {selectedFile ? selectedFile.name : "You haven't chosen any files yet."}
            </p>
          </div>
          <div className="dialog__buttons">
            <button
              className="dialog_button dialog_button--secondary"
              type="button"
              onClick={onClose}
              disabled={isUploading}
            >
              Not now
            </button>
            <button
              className="dialog_button dialog_button--primary"
              type="button"
              onClick={() => document.querySelector('.dialog__input').click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload file"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadDialog;
