import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="smart-footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h4>🧭 Navigation</h4>
          <ul>
            <li>Home</li>
            <li>Dashboard</li>
            <li>Meal Planner</li>
            <li>Pantry</li>
            <li>Shopping List</li>
            <li>Recipes</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>👤 User</h4>
          <ul>
            <li>Profile</li>
            <li>Account Settings</li>
            <li>Log In / Sign Up</li>
            <li>Forgot Password</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>📄 Legal</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
            <li>Copyright Notice</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>💬 Support</h4>
          <ul>
            <li>Help Center / FAQ</li>
            <li>Contact Us</li>
            <li>Report an Issue</li>
            <li>Community Guidelines</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-logo">SmartPantry </span>
        <p>
          © 2025 SmartPantry. All rights reserved.
          <br />
          <span>
            SmartPantry™ is a trademark of SmartPantry. Unauthorized use is
            prohibited.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
