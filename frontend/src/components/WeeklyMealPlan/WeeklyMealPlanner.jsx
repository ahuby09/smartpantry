import React, { useState } from "react";
import "./WeeklyMealPlanner.css";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const WeeklyMealPlanner = () => {
  const [planner, setPlanner] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { Breakfast: "", Lunch: "", Dinner: "" };
      return acc;
    }, {})
  );

  const handleMeal = (day, type, action) => {
    if (action === "add") {
      const input = prompt(`Enter ${type} for ${day}`);
      if (input !== null) {
        setPlanner((prev) => ({
          ...prev,
          [day]: { ...prev[day], [type]: input },
        }));
      }
    } else {
      const suggestions = [
        "Avocado Toast",
        "Pasta Bake",
        "Grilled Chicken",
        "Veggie Wrap",
        "Salmon Bowl",
        "French Toast",
        "Tomato Soup",
        "Pita Pizza",
        "Fruit Salad",
      ];
      const choice =
        suggestions[Math.floor(Math.random() * suggestions.length)];
      setPlanner((prev) => ({
        ...prev,
        [day]: { ...prev[day], [type]: choice },
      }));
    }
  };

  return (
    <>
      <h2 className="planner-header">Weekly Planner</h2>
      <div className="planner-container">
        {daysOfWeek.map((day) => (
          <div className="planner-card" key={day}>
            <h3>{day}</h3>
            {mealTypes.map((type) => (
              <div className="meal-row" key={type}>
                <span className="meal-label">{type}:</span>
                <span className="meal-value">{planner[day][type] || "—"}</span>
                <div className="meal-actions">
                  <button onClick={() => handleMeal(day, type, "add")}>
                    Add
                  </button>
                  <button onClick={() => handleMeal(day, type, "suggest")}>
                    Suggest
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WeeklyMealPlanner;
