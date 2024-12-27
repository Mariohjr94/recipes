import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaCaretDown } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function FreezerLog() {
  const [freezerItems, setFreezerItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchFreezerItemsAndCategories = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/categories`),
        ]);

        if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
          const sortedItems = itemsResponse.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setFreezerItems(sortedItems);
        } else {
          setError("Unexpected response from the server for freezer items.");
        }

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          setError("Unexpected response from the server for categories.");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchFreezerItemsAndCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      setFilteredItems(freezerItems);
    } else {
      const filtered = freezerItems.filter((item) => item.category_id === categoryId);
      setFilteredItems(filtered);
    }
    setSelectedCategory(categoryId);
  };

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();

    if (editItem) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${editItem.id}`,
          { name, quantity, category_id: categoryId }
        );
        const updatedItems = freezerItems.map((item) =>
          item.id === editItem.id ? response.data : item
        );
        const sortedItems = updatedItems.sort((a, b) => a.name.localeCompare(b.name));
        setFreezerItems(sortedItems);
        setEditItem(null);
        setName("");
        setQuantity("");
        setCategoryId("");
        setSuccessMessage("Item updated successfully!");
      } catch (err) {
        setError("Failed to update item.");
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`,
          { name, quantity, category_id: categoryId }
        );
        const updatedItems = [...freezerItems, response.data];
        const sortedItems = updatedItems.sort((a, b) => a.name.localeCompare(b.name));
        setFreezerItems(sortedItems);
        setName("");
        setQuantity("");
        setCategoryId("");
        setSuccessMessage("Item added successfully!");
      } catch (err) {
        setError("Failed to add item.");
      }
    }

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    setQuantity(item.quantity);
    setCategoryId(item.category_id || "");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${id}`);
      setFreezerItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSuccessMessage("Item deleted successfully!");
    } catch (err) {
      setError("Failed to delete item.");
    }
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    let filtered = freezerItems;

    if (selectedCategory !== null) {
      filtered = filtered.filter((item) => item.category_id === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [freezerItems, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Freezer Inventory</h1>

      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search freezer items..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Category Buttons */}
      <div className="mb-5 text-center category-buttons">
        <button
          className={`btn btn-warning mx-1 ${selectedCategory === null ? "active" : ""}`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-warning mx-1 ${selectedCategory === category.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <form className="mb-4" onSubmit={handleAddOrUpdateItem}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Quantity (e.g., 2 kg)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-secondary">
          {editItem ? "Update Item" : "Add Item"}
        </button>
      </form>

      <div className="table-responsive">
        {filteredItems.length > 0 ? (
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Category</th>
                {isLoggedIn && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category_name || "Uncategorized"}</td>
                  {isLoggedIn && (
                    <td>
                      <div className="dropdown d-flex justify-content-center">
                        <button
                          className="btn btn-outline-secondary dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton-${item.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ width: "50%" }}
                        >
                          
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton-${item.id}`}
                        >
                          <li>
                            <button
                              className="dropdown-item btn-sm"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit className="me-2" /> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              data-bs-toggle="modal"
                              data-bs-target={`#deleteModal-${item.id}`}
                            >
                              <FaTrash className="me-2" /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="modal fade"
                        id={`deleteModal-${item.id}`}
                        tabIndex="-1"
                        aria-labelledby="deleteModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="deleteModalLabel">
                                Confirm Deletion
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              Are you sure you want to delete this item?
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(item.id)}
                                data-bs-dismiss="modal"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No items found.</p>
        )}
      </div>
    </div>
  );
}

export default FreezerLog;
