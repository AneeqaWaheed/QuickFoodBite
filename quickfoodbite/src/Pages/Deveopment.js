
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import "../styles/TempUnavailable.css";
const Development = () => {
  return (
    <>
    <div className="temporary-page">
          <div className="temporary-card">
            <div className="temporary-icon">
              <FaTools />
            </div>
    
            <h1>Services are unavailable due to Exams. </h1>
    
            <p>
              We’ll Be Back Soon
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
    </>
  );
};

export default Development;
