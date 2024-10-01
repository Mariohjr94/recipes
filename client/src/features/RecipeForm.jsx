import React, { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";

function RecipeForm({ recipe = {}, onSave }) {
  const [name, setName] = useState(recipe.name || "");
  const [ingredients, setIngredients] = useState(recipe.ingredients?.join(", ") || "");
  const [instructions, setInstructions] = useState(recipe.instructions || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = {
      name,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      instructions,
    };

    try {
      if (recipe.id) {
        // If editing, update recipe
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/recipes/${recipe.id}`, newRecipe);
      } else {
        // If adding a new recipe
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`, newRecipe);
      }
      onSave();  // Call onSave to refresh the recipe list
    } catch (error) {
      console.error("Failed to save the recipe:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Recipe Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="ingredients">Ingredients (comma separated)</label>
            <input
              type="text"
              className="form-control"
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="instructions">Instructions</label>
            <textarea
              className="form-control"
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">{recipe.id ? "Update" : "Add"} Recipe</button>
        </form>
    </div>
   
  );
}

export default RecipeForm;
