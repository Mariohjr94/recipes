// src/features/landing/LandingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Add this file for custom styles

function LandingPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/recipes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecipes(response.data);
      setFilteredRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load recipes.", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories.", error);
      setError("Failed to load categories");
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) => recipe.category_id === categoryId
      );
      setFilteredRecipes(filtered);
    }
    setSelectedCategory(categoryId);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      handleCategoryClick(selectedCategory);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5 custom-title">Recipes</h1>

      {/* Search Bar */}
      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control custom-search"
          placeholder="🔍 Search for recipes..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Category Buttons */}
      <div className="category-container mb-5 text-center">
        <button
          className={`btn category-pill mx-1 ${
            selectedCategory === null ? "active-category" : ""
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn category-pill mx-1 ${
              selectedCategory === category.id ? "active-category" : ""
            }`}
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
            <div
              key={recipe.id}
              className="col-6 col-md-4 col-lg-3 mb-4 recipe-card-container"
            >
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card recipe-card h-100">
                  <img
                    src={recipe.image}
                    className="card-img-top recipe-card-img"
                    alt={recipe.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">{recipe.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center no-recipes">No recipes available.</p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
