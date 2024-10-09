// src/features/landing/LandingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [selectedCategory, setSelectedCategory] = useState(null); 

const fetchRecipes = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/recipes', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    setRecipes(response.data); 
    setFilteredRecipes(response.data);
    setLoading(false)
  } catch (error) {
    console.error("Failed to load recipes.", error);
  }
};

 // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories.", error);
      setError("Failed to load categories");
    }
  };

  // Filter recipes when a category is clicked
  const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      setFilteredRecipes(recipes); // Show all recipes if "All" is selected
    } else {
      const filtered = recipes.filter(recipe => recipe.category_id === categoryId);
      setFilteredRecipes(filtered);
    }
    setSelectedCategory(categoryId);
  };

useEffect(() => {
  fetchRecipes();
  fetchCategories();
}, []);


  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

   return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Recipes</h1>

      {/* Category Buttons */}
      <div className="mb-4 text-center category-buttons">
        <button className={`  btbtn btn-warning mx-1 ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => handleCategoryClick(null)}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-warning mx-1 ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="row">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100">
                <img src={recipe.image} className="card-img-top" alt={recipe.name} />
                <div className="card-body">
                  <h5 className="card-title text-center">{recipe.name}</h5>
                  <a href={`/recipe/${recipe.id}`} className="btn btn-outline-secondary">
                    View Recipe
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes available for this category.</p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;