
import React from "react";
import { FaTools } from "react-icons/fa";
import "../styles/TempUnavailable.css";

const TemporaryUnavailable = () => {
  return (
    
    <div className="temporary-page">
      <div className="temporary-card">
        <div className="temporary-icon">
          <FaTools />
        </div>

        <h1>We’ll Be Back Soon!</h1>

        <p>
          Fleent is temporarily unavailable for this Service while we make some improvements.
          Please check back again shortly.
        </p>

        <div className="temporary-status">
          <span className="status-dot"></span>
          Temporarily unavailable
        </div>

        <p className="temporary-thanks">
          Thank you for your patience 💙
        </p>
      </div>
    </div>
  );
};

export default TemporaryUnavailable;
