import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext/UserContext';
import './MealSuggestCall.css';

const MealSuggestCall = () => {
  const userProfile = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('UserContext content:', userProfile);
    if (!userProfile) return; // wait until profile is loaded

    const fetchSuggestions = async () => {
      const token = localStorage.getItem('token');
      try {
        console.log('Fetching suggestions with profile:', userProfile);
        const res = await fetch('http://localhost:3001/api/meal-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userProfile),
        });

        if (res.status === 401 || res.status === 403) {
          // invalid or expired token
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load suggestions');
        }

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Meal-suggestions error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userProfile, navigate]);

  if (loading) return <p>Loading meal suggestions…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="meal-panel">
      <h2>AI-Powered Meal Suggestions</h2>
      <div className="meal-scroll">
        {suggestions.map((meal, i) => (
          <div className="meal-card" key={i}>
            {meal.image && <img src={meal.image} alt={meal.name} />}
            <h3>{meal.name}</h3>
            {meal.neededIngredients?.length > 0 && (
              <p><strong>Buy:</strong> {meal.neededIngredients.join(', ')}</p>
            )}
            <div className="meal-actions">
              <button onClick={() => navigate(`/recipe/${i}`)} className="text-blue-600 underline">
  View Recipe
</button>
              <button>Add to Planner</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSuggestCall;
