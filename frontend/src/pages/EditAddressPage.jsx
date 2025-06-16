// frontend/src/pages/EditAddressPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useParams for ID
import { useAuth } from '../AuthContext';

function EditAddressPage() {
  const { id } = useParams(); // Get the ID from the URL (e.g., /edit/123 -> id = 123)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    postcode: '',
    prefecture: '',
    city: '',
    street: '',
    apartment: '',
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for fetching data
  const { logout } = useAuth(); // Get logout function

  // Effect to fetch existing address data when component mounts or ID changes
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/addresses/${id}`, { credentials: 'include' });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please log in.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data); // Pre-fill form with fetched data
      } catch (err) {
        setError("Failed to load address for editing: " + err.message);
        console.error("Error fetching single address:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAddress();
    }
  }, [id]); // Re-run effect if ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
      }
        setIsError(true);
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(result.message);
      // No need to clear form as it's pre-filled, but can navigate back
      setTimeout(() => {
        navigate('/'); // Redirect to homepage after successful update
      }, 1500);

    } catch (err) {
      console.error("Error updating address:", err);
      setIsError(true);
      setMessage("Failed to update address: " + err.message);
    }
  };

  const handleLogout = async () => {
    setMessage('');
    const result = await logout();
    if (result.success) {
      setMessage("You have been logged out.");
    } else {
      setMessage("Logout failed: " + result.error);
    }
  };

  if (loading) {
    return (
      <div className="create-address-page"> {/* Reusing form page styling */}
        <h1>Edit Address</h1>
        <p>Loading address details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-address-page">
        <h1>Edit Address</h1>
        <p className="message error">Error: {error}</p>
        <nav><Link to="/" className="nav-button">Back to Homepage</Link></nav>
      </div>
    );
  }

  return (
    <div className="create-address-page">
      <h1>Edit Address (ID: {id})</h1>
      <nav>
        <Link to="/" className="nav-button">Back to Homepage</Link>
        <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
      </nav>

      <form onSubmit={handleSubmit}>
        {message && <p className={`message ${isError ? 'error' : ''}`}>{message}</p>}
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Postcode:</label>
          <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} required />
        </div>
        <div>
          <label>Prefecture:</label>
          <input type="text" name="prefecture" value={formData.prefecture} onChange={handleChange} required />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <label>Street:</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        </div>
        <div>
          <label>Apartment:</label>
          <input type="text" name="apartment" value={formData.apartment || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button type="submit">Update Address</button>
      </form>
    </div>
  );
}

export default EditAddressPage;