import React, { useState, useEffect } from "react";
import "./RegistrationForm.css";
import { useNavigate, useLocation } from "react-router-dom";

const dietaryOptions = [
  "No Dietary Requirements",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
];
const flavorOptions = [
  "Spicy",
  "Sweet",
  "Salty",
  "Creamy",
  "Cheesy",
  "Savory",
  "Smoky",
  "Fruity",
  "Earthy",
  "Herby",
  "Zesty",
  "Tangy",
  "Rich",
  "Mild",
  "Bold",
  "Roasted",
  "Pickled",
  "Garlicky",
];
const cuisineOptions = [
  "Chinese",
  "Indian",
  "Italian",
  "Mexican",
  "American",
  "Thai",
  "Japanese",
  "Middle Eastern",
  "Mediterranean",
  "French",
  "British",
  "Korean",
  "Spanish",
  "Vietnamese",
];
const allergyOptions = [
  "No Allergies",
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Gluten",
  "Soy",
  "Eggs",
  "Seafood",
];

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    householdSize: "",
    numberOfKids: "",
    dietaryPreferences: [],
    flavorPreferences: [],
    cuisinePreferences: [],
    allergies: [],
  });

  useEffect(() => {
    if (location.state) {
      setForm((prev) => ({
        ...prev,
        email: location.state.email || "",
        password: location.state.password || "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name, value) => {
    setForm((prev) => {
      const list = prev[name];
      return {
        ...prev,
        [name]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="registration-container">
      <div className="image-column">
        <img
          src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Smart Pantry"
        />
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="logo">SmartPantry Registration</h2>
        {error && <p className="error">{error}</p>}

        {step === 1 && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="input-row">
              <input
                name="householdSize"
                type="number"
                placeholder="Household Size"
                value={form.householdSize}
                onChange={handleChange}
              />
              <input
                name="numberOfKids"
                type="number"
                placeholder="Number of Kids"
                value={form.numberOfKids}
                onChange={handleChange}
              />
            </div>

            <div className="preference-section">
              <label>Allergies:</label>
              <div className="toggle-button-group">
                {allergyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={
                      form.allergies.includes(opt) ? "toggle active" : "toggle"
                    }
                    onClick={() => handleToggle("allergies", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <label>Dietary Preferences:</label>
              <div className="toggle-button-group">
                {dietaryOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={
                      form.dietaryPreferences.includes(opt)
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() => handleToggle("dietaryPreferences", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="preference-section">
              <label>Favorite Flavors:</label>
              <div className="toggle-button-group">
                {flavorOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={
                      form.flavorPreferences.includes(opt)
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() => handleToggle("flavorPreferences", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <label>Preferred Cuisines:</label>
              <div className="toggle-button-group">
                {cuisineOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={
                      form.cuisinePreferences.includes(opt)
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() => handleToggle("cuisinePreferences", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="button-row">
              <button
                type="button"
                className="submit-btn secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button type="submit" className="submit-btn">
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
