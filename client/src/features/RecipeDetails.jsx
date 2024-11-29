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
  const [categories, setCategories] = useState([]);

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token; // Check if a token exists

  // Form state for editing
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [image, setImage] = useState(null); // Add image state
  const [categoryId, setCategoryId] = useState("");  

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(
          ${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}
        );

  // Safely parse ingredients and instructions
      const parsedIngredients =
        typeof data.ingredients === "string"
          ? (() => {
              try {
                return JSON.parse(data.ingredients);
              } catch {
                console.error("Invalid ingredients format:", data.ingredients);
                return [];
              }
            })()
          : Array.isArray(data.ingredients)
          ? data.ingredients
          : [];

              const parsedInstructions =
        typeof data.instructions === "string"
          ? (() => {
              try {
                return JSON.parse(data.instructions);
              } catch {
                console.error("Invalid instructions format:", data.instructions);
                return [];
              }
            })()
          : Array.isArray(data.instructions)
          ? data.instructions
          : [];
        
  // Set state
        setRecipe({
          ...data,
          ingredients: parsedIngredients,
          instructions: parsedInstructions,
        });
        setName(data.name);
        setIngredients(parsedIngredients);
        setInstructions(parsedInstructions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        setError("Failed to load recipe.");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

   // Fetch available categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(${import.meta.env.VITE_API_BASE_URL}/api/categories);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

const handleSave = async () => {
  try {
    const headers = { Authorization: Bearer ${token} };
    
    const formData = new FormData();

if (image) {
  formData.append("image", image);  // Only append if a new image is selected
}
    
    formData.append("name", name || recipe.name); 
    formData.append("ingredients", JSON.stringify(ingredients)); 
    formData.append("instructions", JSON.stringify(instructions));
    formData.append("category_id", categoryId || recipe.category_id);

    await axios.put(
      ${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id},
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
              className="btn btn-dark mt-4"
              onClick={() => setEditMode(true)}
            >
              Edit Recipe
            </button>
          )}
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card p-4">
          <h1 className="text-center  mb-5">Edit Recipe</h1>

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


          {/* Category Dropdown */}
          <div className="mb-3">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              className="form-select"
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}  // Update category on change
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>


          {/* Image Upload Section */}
          <div className="mb-3">
            <label>Recipe Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
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
              className=" btn btn-secondary"
              onClick={() => setInstructions([...instructions, ""])}
            >
              Add Instruction
            </button>
          </div>

          <button className="btn btn-success" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary ml-2 mt-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
          </div>
      )}
    </div>
  );
}

export default RecipeDetails;