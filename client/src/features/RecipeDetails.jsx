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
  const isLoggedIn = !!token; // Check if a token exists

  // Form state for editing
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
   const [image, setImage] = useState(null); // Add image state

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`
        );
        setRecipe(data);
        setName(data.name);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
        setLoading(false);
      } catch (error) {
        setError("Failed to load recipe.");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

const handleSave = async () => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    
    const formData = new FormData();

    if (recipe.image && !image) {
      formData.append("image", recipe.image);  
    } else if (image) {
      formData.append("image", image);  // Use the newly selected image
    }
    
    formData.append("name", name || recipe.name); 
    formData.append("ingredients", JSON.stringify(ingredients)); 
    formData.append("instructions", JSON.stringify(instructions)); // 

    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`,
      formData,
      { headers }
    );

    setEditMode(false); 
  } catch (error) {
    console.error("Failed to update recipe:", error);
  }
};

console.log(recipe);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recipe-details container mt-5">

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

          {isLoggedIn && (
            <button
              className="btn btn-primary mt-4"
              onClick={() => setEditMode(true)}
            >
              Edit Recipe
            </button>
          )}
        </>
      ) : (
        <>
          <h1>Edit Recipe</h1>

          {/* Edit Form */}
          <div className="mb-3">
            <label>Recipe Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Image Upload Section */}
<div className="mb-3">
  <label>Recipe Image</label>
  <input
    type="file"
    className="form-control"
    onChange={(e) => setRecipe({ ...recipe, image: e.target.files[0] })}
  />
</div>


          {/* Ingredients Input */}
          <div className="mb-3">
            <label>Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                className="form-control mb-2"
                value={ingredient}
                onChange={(e) =>
                  setIngredients(
                    ingredients.map((ing, i) =>
                      i === index ? e.target.value : ing
                    )
                  )
                }
              />
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIngredients([...ingredients, ""])}
            >
              Add Ingredient
            </button>
          </div>

          {/* Instructions Input */}
          <div className="mb-3">
            <label>Instructions</label>
            {instructions.map((instruction, index) => (
              <input
                key={index}
                type="text"
                className="form-control mb-2"
                value={instruction}
                onChange={(e) =>
                  setInstructions(
                    instructions.map((inst, i) =>
                      i === index ? e.target.value : inst
                    )
                  )
                }
              />
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setInstructions([...instructions, ""])}
            >
              Add Instruction
            </button>
          </div>

          <button className="btn btn-success" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary ml-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;
