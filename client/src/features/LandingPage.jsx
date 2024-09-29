// src/features/landing/LandingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`);
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load recipes.");
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Delicious Recipes</h1>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={recipe.image} className="card-img-top" alt={recipe.name} />
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.ingredients.join(", ")}</p>
                <a href={`/recipe/${recipe.id}`} className="btn btn-primary">
                  View Recipe
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
