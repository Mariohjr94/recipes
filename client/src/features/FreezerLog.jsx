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
     const [searchTerm, setSearchTerm] = useState(''); 
     const [editItem, setEditItem] = useState(null); 




useEffect(() => {
  const fetchFreezerItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`);
      
      if (response.data && Array.isArray(response.data)) {
        setFreezerItems(response.data);
      } else {
        setError("Unexpected response from the server.");
      }

      setLoading(false);
    } catch (err) {
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

  //Search element 

   const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredItems = freezerItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );

    const handleEdit = (item) => {
      setEditItem(item);
      setName(item.name);
      setQuantity(item.quantity);
    };

    const handleUpdateItem = async () => {
  if (!editItem) return;

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${editItem.id}`,
      { name, quantity }
    );
    console.log("Item updated:", response.data);

    setFreezerItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editItem.id ? response.data : item
      )
    );

    // Reset form
    setEditItem(null);
    setName("");
    setQuantity("");
  } catch (err) {
    console.error("Failed to update item:", err);
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/freezer-items/${id}`
    );
    console.log("Item deleted:", id);

    setFreezerItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  } catch (err) {
    console.error("Failed to delete item:", err);
  }
};




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

      {/* Success Message */}
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

       {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search freezer items..."
            value={searchTerm}
            onChange={handleSearch}
            />
        </div>

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

       {/* Form for Add/Update */}
    <div className="mb-4">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      {editItem ? (
        <button className="btn btn-success" onClick={handleUpdateItem}>
          Update Item
        </button>
      ) : (
        <button className="btn btn-primary" onClick={handleAddItem}>
          Add Item
        </button>
      )}
      {editItem && (
        <button
          className="btn btn-secondary ms-2"
          onClick={() => {
            setEditItem(null);
            setName("");
            setQuantity("");
          }}
        >
          Cancel
        </button>
      )}
    </div>

      {/* Freezer Items Table */}
      <div className="table-responsive">
        {filteredItems.length > 0 ? (
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: "10%" }}>#</th>
                <th scope="col" style={{ width: "60%" }}>Name</th>
                <th scope="col" style={{ width: "30%" }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                    <button 
                    className="btn btn-primary me-2" 
                    onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
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