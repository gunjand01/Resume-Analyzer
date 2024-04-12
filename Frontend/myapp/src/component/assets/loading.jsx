
import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const backendProcesses = ([
    "Analyzing your resume",
    "Parsing your resume",
    "Getting your basic details",
    "Getting your resume score",
    "Getting your recommended skills"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcessIndex(prevIndex => (prevIndex + 1) % backendProcesses.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, [backendProcesses.length]);

  const containerStyle = {
    position: 'fixed',
    top: '20px', 
    right: '20px', 
    zIndex: '9999', 
    display: 'flex',
    alignItems: 'center',
  };

  const spinnerCircleStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #007bff', 
    borderRadius: '50%',
    width: '40px', 
    height: '40px',
    animation: 'spin 1s linear infinite', 
  };

  const processStyle = {
    marginRight: '10px', 
    textAlign: 'center',

  };

  return (
    <div style={containerStyle}>
      <div style={processStyle}>
        {backendProcesses[currentProcessIndex]}
      </div>

        <div style={spinnerCircleStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
