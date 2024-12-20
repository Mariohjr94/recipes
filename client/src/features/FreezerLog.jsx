import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import axios from "axios";

function FreezerLog() {
    const [freezerItems, setFreezerItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [successMessage, setSuccessMessage] = useState('');



useEffect(() => {
  const fetchFreezerItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`);
      
      if (response.data && Array.isArray(response.data)) {
        setFreezerItems(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response from the server.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch freezer items:", err);
      setError("Failed to load freezer items.");
      setLoading(false);
    }
  };

  fetchFreezerItems();
}, []);


 // Add an item to the freezer
  const handleAddItem = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`, {
        name,
        quantity,
      });
      console.log("Item added:", response.data);
      setFreezerItems([...freezerItems, response.data]); // Update UI with the new item
      setName(''); // Clear the input fields
      setQuantity('');
      setSuccessMessage("Item added successfully!");
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error("Failed to add item:", err);
      setError("Failed to add item.");
    }
  };


  if (loading) return <div className="text-center mt-5">Loading freezer items...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
     <div className="container mt-5">
      <h1 className="text-center mb-4">Freezer Inventory</h1>

      {/* Success Message */}
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      {/* Add Item Form */}
      <form className="mb-4" onSubmit={handleAddItem}>
        <div className="row">
          <div className="col-md-5 mb-2">
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
          <div className="col-md-3 mb-2">
            <button type="submit" className="btn btn-primary w-100">
              Add Item
            </button>
          </div>
        </div>
      </form>

      {/* Freezer Items Table */}
      <div className="table-responsive">
        {freezerItems.length > 0 ? (
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: "10%" }}>#</th>
                <th scope="col" style={{ width: "60%" }}>Name</th>
                <th scope="col" style={{ width: "30%" }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {freezerItems.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No items in the freezer yet. Add some to get started!</p>
        )}
      </div>
    </div>
  );
}

export default FreezerLog;