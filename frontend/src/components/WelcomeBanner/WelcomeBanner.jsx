import React from "react";
import "./WelcomeBanner.css";
import { jwtDecode } from "jwt-decode";

const WelcomeBanner = ({ mealCount = 4 }) => {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <h2>Welcome back {user?.name || "Guest"},</h2>
        <p>
          You have {mealCount} meals you can make with your current pantry
          stock.
        </p>
        <div className="welcome-buttons">
          <button className="primary">View Suggestions</button>
          <button className="secondary">Update Pantry</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
