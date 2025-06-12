// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState('');

  // Function to fetch addresses from the backend
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setMessage("Failed to load addresses.");
    }
  };

  // Fetch addresses when the component mounts
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle address deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      setMessage(result.message); // Show deletion success message
      fetchAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage("Failed to delete address: " + error.message);
    }
  };

  return (
    <div className="home-page">
      <h1>Address Book</h1>

      {/* Navigation Link to Create New Address page */}
      <nav>
        <Link to="/create" className="nav-button">Create New Address</Link>
      </nav>

      {message && <p className="message">{message}</p>}

      <h2>Saved Addresses</h2>
      {addresses.length === 0 ? (
        <p>No addresses saved yet. Click "Create New Address" to add one.</p>
      ) : (
        // Start of Table Display
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Postcode</th>
              <th>Prefecture</th>
              <th>City</th>
              <th>Street</th>
              <th>Apartment</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Added At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map(address => (
              <tr key={address.id}>
                <td>{address.name}</td>
                <td>{address.postcode}</td>
                <td>{address.prefecture}</td>
                <td>{address.city}</td>
                <td>{address.street}</td>
                <td>{address.apartment || '-'}</td>
                <td>{address.phone}</td>
                <td>{address.email}</td>
                <td>{new Date(address.created_at).toLocaleString()}</td>
                <td>
                  <Link to={`/edit/${address.id}`} className="edit-button">Edit</Link>
                  <button onClick={() => handleDelete(address.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        // End of Table Display
      )}
    </div>
  );
}

export default HomePage;