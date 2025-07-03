import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RecipeDetails.css";
import Breadcrumb from "../breadcrumb/breadcrumb";
const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ingredients");

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ingredients, setIngredients] = useState([]);
  const [methodSteps, setMethodSteps] = useState([]);
  const [dietaryTags, setDietaryTags] = useState([]);
  const [tasteTags, setTasteTags] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error("Failed to load recipe");

        const data = await res.json();

        if (!data || !data.length) throw new Error("Recipe not found");

        const recipeData = data[0];
         console.log(data[0]);

        // Parse ingredients: split by newline, trim, and remove empty lines
       const parsedIngredients = recipeData.ingredients
  ? recipeData.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
  : [];                                                             

        // Parse method: split by newline or ". " (period + space), trim and remove empty
        const parsedMethod = recipeData.method
          ? recipeData.method.split(/\n|\.\s/).map((step) => step.trim()).filter(Boolean)
          : [];

        // Parse dietary and taste tags (comma-separated)
        const parsedDietaryTags = recipeData.dietary_tags
          ? recipeData.dietary_tags.split(",").map((tag) => tag.trim())
          : [];

        const parsedTasteTags = recipeData.taste_tags
          ? recipeData.taste_tags.split(",").map((tag) => tag.trim())
          : [];

        setIngredients(parsedIngredients);
        setMethodSteps(parsedMethod);
        setDietaryTags(parsedDietaryTags);
        setTasteTags(parsedTasteTags);
        setRecipe(recipeData);
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  if (loading) return <p>Loading recipe…</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!recipe) return null;

  return (
    <div className="recipe-wrapper">
      <div className="recipe-banner"
  style={{
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
      url(${recipe.image_url})
    `,
  }}
>
  {/* Centered content container */}
  <div className="banner-center">
    <div className="banner-content">
      <h1>{recipe.name}</h1>
      <p className="banner-sub">Smoky, grilled favorites perfect for outdoor gatherings.</p>
      <button className="add-btn">Add to planner</button>
    </div>
  </div>

  {/* Tags bar pinned to bottom */}
  <div className="tags-bar">
    {dietaryTags.map((tag, idx) => (
      <span key={idx} className="tag tag-dietary">{tag}</span>
    ))}
    {tasteTags.map((tag, idx) => (
      <span key={idx} className="tag tag-taste">{tag}</span>
    ))}
  </div>
</div>
<Breadcrumb />


       
 <div className="recipe-tabs">
  <h2 className="second-heading">{recipe.name}</h2>
  <div className="tab-buttons">
    <button
      className={activeTab === "ingredients" ? "active" : ""}
      onClick={() => setActiveTab("ingredients")}
    >
      Ingredients
    </button>
    <button
      className={activeTab === "method" ? "active" : ""}
      onClick={() => setActiveTab("method")}
    >
      Method
    </button>
  </div>

  <div className="tab-content">
    {activeTab === "ingredients" && (
      <ul>
        {ingredients.map((item, i) => (
          <li key={i}>{i + 1}) {item}</li>
        ))}
      </ul>
    )}

    {activeTab === "method" && (
      <ol>
        {methodSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    )}
  </div>
</div>
    </div>
  );
};

export default RecipeDetails;
