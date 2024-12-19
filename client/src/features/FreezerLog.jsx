import React, { useState, useEffect } from "react";
import axios from "axios";

function FreezerLog() {
  const [freezerItems, setFreezerItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchFreezerItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/freezer-items`);
      console.log("API Response for Freezer Items:", response.data);
      setFreezerItems(response.data || []); // Ensure it is always an array
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch freezer items:", err);
      setError("Failed to load freezer items.");
      setLoading(false);
    }
  };

  fetchFreezerItems();
}, []);


  if (loading) return <div className="text-center mt-5">Loading freezer items...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Freezer Inventory</h1>
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
