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

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`
        );
        const parsedIngredients = Array.isArray(data.ingredients)
          ? data.ingredients
          : JSON.parse(data.ingredients || "[]");
        const parsedInstructions = Array.isArray(data.instructions)
          ? data.instructions
          : JSON.parse(data.instructions || "[]");

        setRecipe({
          ...data,
          ingredients: parsedIngredients,
          instructions: parsedInstructions,
        });
        setName(data.name);
        setIngredients(parsedIngredients);
        setInstructions(parsedInstructions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Failed to load recipe.");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  console.log("Fetched Recipe Data:", data);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }
      formData.append("name", name);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", JSON.stringify(instructions));
      formData.append("category_id", categoryId || recipe.category_id);

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`,
        formData,
        { headers }
      );

      setEditMode(false);
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recipe-details container mt-5">
      {!editMode ? (
        <>
          <h1>{recipe.name}</h1>
          {isLoggedIn && (
            <button className="btn btn-secondary" onClick={() => setEditMode(true)}>Edit Recipe</button>
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
