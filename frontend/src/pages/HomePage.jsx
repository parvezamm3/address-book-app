// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth hook

function HomePage() {
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth(); // Get user info and logout function

  // const [ldapUsers, setLdapUsers] = useState([]);
  // const [ldapUserCount, setLdapUserCount] = useState(null);
  // const [ldapLoading, setLdapLoading] = useState(false);
  // const [ldapError, setLdapError] = useState(null);

  // Function to fetch addresses from the backend
  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/addresses', { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 401) { // Unauthorized, likely session expired or not logged in
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAddresses(data);
      setMessage('');
    } catch (error) {
      setError("Failed to load addresses: " + error.message);
      console.error("Error fetching addresses:", error);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to fetch LDAP user list
  // const fetchLdapUsers = async () => {
  //   setLdapLoading(true);
  //   setLdapError(null);
  //   try {
  //     const response = await fetch('/api/ldap/users', { credentials: 'include' });
  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         throw new Error("Unauthorized to fetch LDAP users. Please log in.");
  //       }
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setLdapUsers(data);
  //   } catch (err) {
  //     setLdapError("Failed to load LDAP users: " + err.message);
  //     console.error("Error fetching LDAP users:", err);
  //   } finally {
  //     setLdapLoading(false);
  //   }
  // };

  // // NEW: Function to fetch LDAP user count
  // const fetchLdapUserCount = async () => {
  //   setLdapLoading(true);
  //   setLdapError(null);
  //   try {
  //     const response = await fetch('/api/ldap/users/count', { credentials: 'include' });
  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         throw new Error("Unauthorized to fetch LDAP user count. Please log in.");
  //       }
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setLdapUserCount(data.userCount);
  //   } catch (err) {
  //     setLdapError("Failed to load LDAP user count: " + err.message);
  //     console.error("Error fetching LDAP user count:", err);
  //   } finally {
  //     setLdapLoading(false);
  //   }
  // };

  // Fetch addresses when the component mounts
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle address deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include' // Send cookies
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      setMessage(result.message); // Show deletion success message
      fetchAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage("Failed to delete address: " + error.message);
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
      <div className="home-page">
        <h1>Address Book</h1>
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <h1>Address Book</h1>
        <p className="message error">Error: {error}</p>
        <nav>
          <Link to="/create" className="nav-button">Create New Address</Link>
          <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
        </nav>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Address Book</h1>

      <nav>
        <Link to="/create" className="nav-button">Create New Address</Link>
        {user && <span className="welcome-message">Welcome, {user.username}!</span>}
        <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
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
      {/* <hr style={{ margin: '40px 0', borderColor: '#ccc' }} /> */}

      {/* NEW: LDAP Information Section */}
      {/* <section className="ldap-info-section">
        <h2>LDAP User Information</h2>
        <div className="ldap-buttons">
          <button onClick={fetchLdapUserCount} className="nav-button">Get User Count</button>
          <button onClick={fetchLdapUsers} className="nav-button">Get User List</button>
        </div>

        {ldapLoading && <p>Loading LDAP data...</p>}
        {ldapError && <p className="message error">LDAP Error: {ldapError}</p>}

        {ldapUserCount !== null && (
          <p className="ldap-count">Total LDAP Users: <strong>{ldapUserCount}</strong></p>
        )}

        {ldapUsers.length > 0 && (
          <div className="ldap-user-list-container">
            <h3>LDAP User List ({ldapUsers.length} results)</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}>
              <table className="ldap-user-table">
                <thead>
                  <tr>
                    <th>sAMAccountName</th>
                    <th>Display Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>DN</th>
                  </tr>
                </thead>
                <tbody>
                  {ldapUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.sAMAccountName || '-'}</td>
                      <td>{user.displayName || user.cn || '-'}</td>
                      <td>{user.mail || '-'}</td>
                      <td>{user.description || '-'}</td>
                      <td style={{ fontSize: '0.8em', maxWidth: '300px', wordBreak: 'break-all' }}>{user.dn || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section> */}
    </div>
  );
}

export default HomePage;