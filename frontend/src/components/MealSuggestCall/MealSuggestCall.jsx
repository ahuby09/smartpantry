import React from "react";
import "./MealSuggestCall.css";

const MealSuggestCall = () => {
  return (
    <div className="main-content">
      <h2>AI-Powered Meal Suggestion</h2>
      <div className="suggestion-grid">
        <div
          className="suggestion-box"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="overlay">
            <p>View AI Suggested Meals</p>
          </div>
          <span>Breakfast</span>
        </div>
        <div
          className="suggestion-box"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="overlay">
            <p>View AI Suggested Meals</p>
          </div>
          <span>Dinner</span>
        </div>
        <div
          className="suggestion-box"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          <div className="overlay">
            <p>View AI Suggested Meals</p>
          </div>
          <span>Tea</span>
        </div>
        <div
          className="suggestion-box"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="overlay">
            <p>View AI Suggested Meals</p>
          </div>
          <span>Dessert</span>
        </div>
      </div>
    </div>
  );
};

export default MealSuggestCall;
