// src/features/landing/LandingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const fetchRecipes = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/recipes', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    setRecipes(response.data); 
  } catch (error) {
    console.error("Failed to load recipes.", error);
  }
};

useEffect(() => {
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
