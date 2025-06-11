// frontend/src/pages/CreateAddressPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for redirection

function CreateAddressPage() {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    postcode: '',
    prefecture: '',
    city: '',
    street: '',
    apartment: '', // Optional
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState(''); // For success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(result.message); // Show success message
      // Clear form after successful submission
      setFormData({
        name: '',
        postcode: '',
        prefecture: '',
        city: '',
        street: '',
        apartment: '',
        phone: '',
        email: ''
      });

      // Redirect to homepage after a short delay to show message
      setTimeout(() => {
        navigate('/');
      }, 1500); // Redirect after 1.5 seconds

    } catch (error) {
      console.error("Error adding address:", error);
      setMessage("Failed to add address: " + error.message);
    }
  };

  return (
    <div className="create-address-page">
      <h1>Create New Address</h1>
      <nav>
        <Link to="/" className="nav-button">Back to Homepage</Link>
      </nav>

      <form onSubmit={handleSubmit}>
        {message && <p className="message">{message}</p>}
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
          <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button type="submit">Add Address</button>
      </form>
    </div>
  );
}

export default CreateAddressPage;