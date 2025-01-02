import React from "react";
import "./Features.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom";


const AssetMaze = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-text">Asset Maze</div>
        </div>
        <nav className="nav">
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          <Link to="/contacts" className="nav-link">
            Contact Us
          </Link>
          <Link to="/features" className="nav-link">
            Features
          </Link>
        </nav>
        <button onClick={handleNavigateToLogin} className="sign-in-button">
          Sign In
        </button>
      </header>

      {/* Features Section */}
      <div className="features-container">
        <div className="card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4xfWpNtfJUIS45MsGQy8wnj0Jt4ilr1DqdT0OFAiMt8M_eRobFeCgiIqQBo3F3GW2ZXc&usqp=CAU"
            alt="Asset Acquisition"
            className="card-image"
          />
          <h5 className="card-title">ASSET ACQUISITION</h5>
          <p className="card-text">
            “At Asset Maze, our asset acquisition process ensures strategic and
            cost-effective investments.”
          </p>
        </div>
        <div className="card">
          <img
            src="data:image/jpeg;base64,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"
            alt="Asset Management"
            className="card-image"
          />
          <h5 className="card-title">ASSET MANAGEMENT</h5>
          <p className="card-text">
            “Effective asset management maximizes the value of investments over
            time.”
          </p>
        </div>
        <div className="card">
          <img
            src="data:image/jpeg;base64,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"
            alt="Asset Maintenance"
            className="card-image"
          />
          <h5 className="card-title">ASSET MAINTENANCE</h5>
          <p className="card-text">
            “Maintaining assets ensures their value and long-term performance.”
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-section">
          <h5>Use cases</h5>
          <ul>
            <li>UI Design</li>
            <li>Design</li>
            <li>Blog</li>
            <li>UX Design</li>
            <li>Prototyping</li>
            <li>Best Practices</li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Resources</h5>
          <ul>
            <li>Wireframing</li>
            <li>Development Features</li>
            <li>Colors</li>
            <li>Diagramming</li>
            <li>Design Systems</li>
            <li>Color Wheel</li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Support</h5>
          <ul>
            <li>Brainstorming</li>
            <li>Collaboration Features</li>
            <li>Online Whiteboard</li>
            <li>Design Process</li>
            <li>Developers</li>
            <li>Team Collaboration</li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default AssetMaze;
