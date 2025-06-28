import React from "react";
import "./FeaturedRecipe.css";

const FeaturedRecipe = () => {
  return (
    <div className="featured-wrapper">
      <h2>Featured Recipe</h2>
      <div className="featured-container">
        <div
          className="featured-image"
          style={{ backgroundImage: "url('/images/beef-stirfry.jpg')" }}
        />
        <div className="featured-details">
          <h3>Beef Stir-Fry</h3>
          <p>
            Beef stir-fry is a quick and flavourful dish made by sautéing thinly
            sliced beef with a mix of colourful vegetables like bell peppers,
            broccoli, and carrots. Cooked in a savoury sauce often made with soy
            sauce, garlic, ginger, and a hint of sesame oil, this dish delivers
            a perfect balance of tender meat and crisp vegetables. Served over
            rice or noodles, it's a satisfying and wholesome meal ideal for busy
            weeknights.
          </p>
          <button className="view-recipe">View Recipe</button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRecipe;
