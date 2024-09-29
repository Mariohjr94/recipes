import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeForm from "./RecipeForm";

function RecipeTable() {
  const [recipes, setRecipes] = useState([]);
  const [editRecipe, setEditRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`);
      fetchRecipes(); // Refresh the recipe list after deletion
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3>All Recipes</h3>
      {editRecipe && (
        <RecipeForm recipe={editRecipe} onSave={() => {
          setEditRecipe(null);
          fetchRecipes();
        }} />
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ingredients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{recipe.ingredients.join(", ")}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditRecipe(recipe)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(recipe.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecipeTable;
