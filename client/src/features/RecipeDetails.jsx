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
        console.log("recipe data",response.data);
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
    <div className=" recipe-details container mt-5">
      <div className="card">
        <h1 className=" recipe-title text-center mt-5 mb-5">{recipe.name}</h1>
        <div className="recipe-image-container">
          <img src={recipe.image} alt={recipe.name} className="img-fluid mb-4 recipe-image" />
        </div>

          {/* Servings and Time Section */}
          <div className="recipe-meta d-flex justify-content-between mt-4">
            <div>Yield: {recipe.servings || "Not specified"}</div>
          </div>

          <div className="container mt-5">
          <h3 className="subtitle">Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3 className=" subtitle mt-5">Instructions</h3>
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li className="mb-5" key={index}>{instruction}</li>
              ))}
            </ol>
      </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
