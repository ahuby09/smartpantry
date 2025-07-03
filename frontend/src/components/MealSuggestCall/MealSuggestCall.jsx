import React from "react";
import "./MealSuggestCall.css";

const MealSuggestCall = () => {
  const fetchMealSuggestions = async (type) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/meal-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type, // 👈 Pass selected meal type
          dietaryPreferences: [],      // You can replace these with real values
          cuisinePreferences: [],
          flavorPreferences: [],
          allergies: []
        }),
      });

      const data = await response.json();
      console.log(`Suggested meals for ${type}:`, data);

      // TODO: setState or navigate to results page/modal
    } catch (err) {
      console.error("Error fetching meal suggestions:", err);
    }
  };

  const mealTypes = [
    {
      label: "Breakfast",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      label: "lunch",
      image:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      label: "dinner",
      image:
        "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      label: "Dessert",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="main-content">
      <h2>AI-Powered Meal Suggestion</h2>
      <div className="suggestion-grid">
        {mealTypes.map((meal) => (
          <div
            key={meal.label}
            className="suggestion-box"
            style={{ backgroundImage: `url(${meal.image})` }}
            onClick={() => fetchMealSuggestions(meal.label)} // 👈 Trigger suggestion
          >
            <div className="overlay">
              <p>View AI Suggested Meals</p>
            </div>
            <span>{meal.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSuggestCall;
