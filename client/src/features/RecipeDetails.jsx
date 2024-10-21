import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; 
import axios from "axios";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); 

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token; 

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`
        );
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load recipe.");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recipe-details container mt-5">
      <div className="container">
      {!editMode ? (
        <>
          <h1 className="recipe-title">{recipe.name}</h1>
          <div className="recipe-image-container">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="img-fluid recipe-image"
            />
          </div>

          <h3 className="mt-5">Ingredients</h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h3 className="mt-5">Instructions</h3>
          <ol className="instructions-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>

          {/* Show Edit button if user is logged in */}
          {isLoggedIn ? (
            <button
              className="btn btn-dark mt-4"
              onClick={() => setEditMode(true)}
            >
              Edit Recipe
            </button>
          ) : null} {/* Hide the button if not logged in */}
        </>
      ) : (
        <>
          <h1>Edit Recipe</h1>
          {/* Your edit form goes here */}
        </>
      )}
    </div>
      </div>
      
  );
}

export default RecipeDetails;
