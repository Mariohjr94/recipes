import React, { useState, useEffect } from "react";
import axios from "axios";

function FreezerLog() {
  const [freezerItems, setFreezerItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
  const fetchFreezerItemsAndCategories = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/categories`), // New endpoint
      ]);

      if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
        setFreezerItems(itemsResponse.data);
      } else {
        setError("Unexpected response from the server for freezer items.");
      }

      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data); // Use all categories from the database
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


  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();

    if (editItem) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${editItem.id}`,
          { name, quantity, category_id: categoryId }
        );
        setFreezerItems((prevItems) =>
          prevItems.map((item) => (item.id === editItem.id ? response.data : item))
        );
        setEditItem(null);
        setName("");
        setQuantity("");
        setCategoryId("");
        setSuccessMessage("Item updated successfully!");
      } catch (err) {
        console.error("Failed to update item:", err);
        setError("Failed to update item.");
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`,
          { name, quantity, category_id: categoryId }
        );
        setFreezerItems([...freezerItems, response.data]); // Update UI with the new item
        setName("");
        setQuantity("");
        setCategoryId("");
        setSuccessMessage("Item added successfully!");
      } catch (err) {
        console.error("Failed to add item:", err);
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
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${id}`);
      setFreezerItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSuccessMessage("Item deleted successfully!");
    } catch (err) {
      console.error("Failed to delete item:", err);
      setError("Failed to delete item.");
    }
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredItems = freezerItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category_name || "Uncategorized"}</td>
                  <td>
                    <button className="btn btn-secondary me-2" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
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
