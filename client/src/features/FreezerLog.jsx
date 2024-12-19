import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FreezerLog = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get('/api/freezer-items');
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items.');
    }
  };

  const handleAddItem = async () => {
    try {
      const { data } = await axios.post('/api/freezer-items', { name, quantity });
      setItems([...items, data]);
      setName('');
      setQuantity('');
    } catch (err) {
      setError('Failed to add item.');
    }
  };

  return (
    <div>
      <h1>Freezer Logger</h1>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddItem}>Add Item</button>
      {error && <p>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FreezerLog;
