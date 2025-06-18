import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../NavBar/NavBar';
import './ViewRecipe.css';

export default function ViewRecipe() {
  const { index } = useParams(); // index from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3001/api/meal-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dietaryPreferences: [],
        cuisinePreferences: [],
        flavorPreferences: [],
        allergies: [],
      }),
    })
      .then(res => res.json())
      .then(data => {
        setRecipe(data[index]);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [index]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-lg">Loading recipe...</div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-red-600 text-lg">Recipe not found.</div>
      </>
    );
  }

  return (
    <>
  <Navbar />
  <div className="view-recipe-container">
    <h1>{recipe.name}</h1>

    {recipe.image && <img src={recipe.image} alt={recipe.name} />}

    <section>
      <h2>Ingredients</h2>
      <ul className="ingredients-list">
        {recipe.neededIngredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
    </section>

    <section>
      <h2>Method</h2>
      <p className="method-text">{recipe.method}</p>
    </section>

    {recipe.recipe && (
      <div style={{ textAlign: 'center' }}>
        <a
          href={recipe.recipe}
          target="_blank"
          rel="noopener noreferrer"
          className="full-recipe-link"
        >
          View full recipe instructions ↗
        </a>
      </div>
    )}
  </div>
</>
  );
}
