import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

function RecipeForm({ recipe = {}, onSave }) {
  const token = useSelector((state) => state.auth.token)
  const [name, setName] = useState(recipe.name || "");
  const [ingredients, setIngredients] = useState(recipe.ingredients || [""]);
  const [instructions, setInstructions] = useState(recipe.instructions || "");
  const [categories, setCategories] = useState([]); 
  const [categoryId, setCategoryId] = useState(recipe.category_id || "");  
  const [image, setImage] = useState(null);  

  // Fetch categories from the backend when the component loads
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
      console.log("Received categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  fetchCategories();
}, []);
  
  

  // Handle ingredient input change for a specific index
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  // Add a new empty ingredient input field
  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  // Remove a specific ingredient input field
  const removeIngredientField = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();  // Use FormData to handle image upload
    formData.append("name", name);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("instructions", instructions);
    formData.append("category_id", categoryId);

    if (image) {
      formData.append("image", image);  // Append the image file
    }

    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'  // Important for file uploads
      };

      if (recipe.id) {
        // If editing, update recipe
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/recipes/${recipe.id}`, formData, { headers });
      } else {
        // If adding a new recipe
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`, formData, { headers });
      }
      
      onSave();  // Call onSave to refresh the recipe list
    } catch (error) {
      console.error("Failed to save the recipe:", error);
    }
  };

 return (
    <div className="d-flex justify-content-center align-items-center vh-100">
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
        
        {/* Ingredients Section */}
        <div className="mb-3">
          <label className="form-label" htmlFor="ingredients">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeIngredientField(index)}
                disabled={ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={addIngredientField}
          >
            Add Ingredient
          </button>
        </div>
        
        {/* Instructions Section */}
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

        {/* Category Dropdown */}
        <div className="mb-3">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            className="form-select"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label" htmlFor="image">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        

        {/* Submit Button */}
        <button type="submit" className="btn btn-dark">
          {recipe.id ? "Update" : "Add"} Recipe
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;