import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; 
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";


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
      console.log("Fetching recipe with ID:", id);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recipes/${id}`
      );

      if (!response || !response.data) {
        throw new Error("No data found in response.");
      }

      const data = response.data;
      console.log("API Response Data:", data);

      const parsedIngredients = Array.isArray(data.ingredients)
        ? data.ingredients
        : JSON.parse(data.ingredients || "[]");

      const parsedInstructions = Array.isArray(data.instructions)
        ? data.instructions
        : JSON.parse(data.instructions || "[]");

      console.log("Parsed Ingredients:", parsedIngredients);
      console.log("Parsed Instructions:", parsedInstructions);

      setRecipe({
        ...data,
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
      });

      setName(data.name);
      setIngredients(parsedIngredients);
      setInstructions(parsedInstructions);

      console.log("Recipe state set:", {
        ...data,
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      setError("Failed to load recipe.");
      setLoading(false);
    }
  };

  fetchRecipe();
}, [id]);



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
      setRecipe(response.data)
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
  <div className="container mt-5">
  {!editMode ? (
    <div className="card shadow-lg">
      {/* Card Header */}
      <div className="card-header bg-secondary text-white text-center">
        <h2 className="card-title mb-0">{recipe.name}</h2>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Recipe Image */}
        <div className="text-center mb-4">
          <img
            className="img-fluid rounded"
            style={{ maxWidth: "300px", cursor: "pointer" }}
            src={recipe?.image}
            alt={recipe?.name || "Recipe image"}
            onClick={() => window.open(recipe.image, "_blank")}
          />
        </div>

        {/* Ingredients and Instructions */}
        <div className="row">
          {/* Ingredients Section */}
          <div className="col-md-6 mt-3">
            <h4 className="text-secondary">Ingredients</h4>
            {recipe && recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="list-group list-group-flush">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients provided.</p>
            )}
          </div>

          {/* Instructions Section */}
          <div className="col-md-6 mt-3">
            <h4 className="text-danger">Instructions</h4>
            {recipe && recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="list-group list-group-numbered">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="list-group-item">
                    {instruction}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No instructions provided.</p>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer text-center">
        {isLoggedIn && (
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => setEditMode(true)}
          >
            Edit Recipe
          </button>
        )}
      </div>
    </div>
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
