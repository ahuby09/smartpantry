import React, { useEffect, useState } from 'react';
import './RecipeModal.css';

const RecipeModal = ({ onClose, onSelect }) => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/recipes.json')
      .then((res) => res.json())
      .then(setRecipes);
  }, []);

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select a Recipe</h3>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="recipe-list">
          {filtered.map(recipe => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => {
                onSelect(recipe);
                onClose();
              }}
            >
              <img src={recipe.image} alt={recipe.name} />
              <span>{recipe.name}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RecipeModal;
