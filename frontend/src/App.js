// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import './App.css';
// import AddressTablePage from './components/AddressTablePage';

// function Home() {
//   const [addresses, setAddresses] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     postcode: '',
//     prefecture: '',
//     city: '',
//     street: '',
//     apartment: '',
//     phone: '',
//     email: ''
//   });
//   const [message, setMessage] = useState('');

//   // Function to fetch addresses
//   const fetchAddresses = async () => {
//     try {
//       const response = await fetch('/api/addresses');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setAddresses(data);
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       setMessage("Failed to load addresses.");
//     }
//   };

//   // Fetch addresses on component mount
//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(''); // Clear previous messages
//     try {
//       const response = await fetch('/api/addresses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || `HTTP error! status: ${response.status}`);
//       }

//       setMessage(result.message);
//       setFormData({ name: '', postcode: '', prefecture:'', city: '', street: '', apartment: '', phone:'', email:''}); // Clear form
//       fetchAddresses(); // Refresh the list
//     } catch (error) {
//       console.error("Error adding address:", error);
//       setMessage("Failed to add address: " + error.message);
//     }
//   };

//   // Handle address deletion
//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`/api/addresses/${id}`, {
//         method: 'DELETE'
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || `HTTP error! status: ${response.status}`);
//       }

//       setMessage(result.message);
//       fetchAddresses(); // Refresh the list
//     } catch (error) {
//       console.error("Error deleting address:", error);
//       setMessage("Failed to delete address: " + error.message);
//     }
//   };
//   return (
//     <div className="App">
//       <h1>Address Book</h1>

//       <form onSubmit={handleSubmit}>
//         <h2>Add New Address</h2>
//         {message && <p className="message">{message}</p>}
//         <div>
//           <label>Name:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Postcode:</label>
//           <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Prefecture:</label>
//           <input type="text" name="prefecture" value={formData.prefecture} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>City:</label>
//           <input type="text" name="city" value={formData.city} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Street:</label>
//           <input type="text" name="street" value={formData.street} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Apartment:</label>
//           <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Phone:</label>
//           <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input type="text" name="email" value={formData.email} onChange={handleChange} required />
//         </div>
        
        
//         <button type="submit">Add Address</button>
//       </form>
//       <h2>Saved Addresses (List View)</h2>
//       {addresses.length === 0 ? (
//         <p>No addresses saved yet.</p>
//       ) : (
//         <ul>
//           {addresses.map(address => (
//             <li key={address.id}>
//               <strong>{address.name}</strong><br/>
//               {address.postcode} {address.prefecture} {address.city} {address.street} {address.apartment}<br/>
//               Phone: {address.phone} | Email: {address.email}<br/>
//               <small>Added: {new Date(address.created_at).toLocaleString()}</small>
//               <button onClick={() => handleDelete(address.id)} className="delete-button">Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/addresses-table" element={<AddressTablePage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Import the new HomePage component
import CreateAddressPage from './pages/CreateAddressPage'; // Import the new CreateAddressPage component

import './App.css'; // Your main CSS file

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Homepage */}
        <Route path="/" element={<HomePage />} />
        {/* Route for the Create New Address page */}
        <Route path="/create" element={<CreateAddressPage />} />
      </Routes>
    </Router>
  );
}

export default App;