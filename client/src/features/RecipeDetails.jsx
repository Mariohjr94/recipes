// src/features/recipes/RecipeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load recipe.");
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1>{recipe.name}</h1>
      <img src={recipe.image} alt={recipe.name} className="img-fluid mb-4" />
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetails;
