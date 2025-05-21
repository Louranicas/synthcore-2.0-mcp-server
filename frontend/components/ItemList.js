import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state for creating/editing items
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // For storing item being edited
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.getItems();
      setItems(response.data);
    } catch (err) {
      setError(`Failed to fetch items: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!itemName) {
      setError('Item name is required.');
      return;
    }
    try {
      // The backend /items POST expects user_id.
      // The current api.js createItem doesn't explicitly pass it, relying on backend fallback.
      // For a more robust solution, user_id should be obtained from the authenticated user context.
      // Let's assume the backend can handle or we pass a placeholder if needed.
      // For now, no user_id is explicitly sent from here.
      await api.createItem({ name: itemName, description: itemDescription });
      setItemName('');
      setItemDescription('');
      fetchItems(); // Refresh list
    } catch (err) {
      setError(`Failed to create item: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setItemName(item.name);
    setItemDescription(item.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentItem || !itemName) {
        setError('Item name is required.');
        return;
    }
    setError('');
    try {
      await api.updateItem(currentItem.id, { name: itemName, description: itemDescription });
      setIsEditing(false);
      setCurrentItem(null);
      setItemName('');
      setItemDescription('');
      fetchItems(); // Refresh list
    } catch (err) {
      setError(`Failed to update item: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (itemId) => {
    setError('');
    try {
      await api.deleteItem(itemId);
      fetchItems(); // Refresh list
    } catch (err) {
      setError(`Failed to delete item: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setItemName('');
    setItemDescription('');
    setError('');
  };

  if (isLoading) return <p>Loading items...</p>;

  return (
    <div>
      <h2>Item Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>{isEditing ? 'Edit Item' : 'Create New Item'}</h3>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label htmlFor="itemName">Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="itemDescription">Description:</label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </div>
        <button type="submit">{isEditing ? 'Update Item' : 'Create Item'}</button>
        {isEditing && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <h3>Item List</h3>
      {items.length === 0 && !isLoading && <p>No items found. Create one!</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> (ID: {item.id}, UserID: {item.user_id || 'N/A'})
            <p>{item.description || 'No description'}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
