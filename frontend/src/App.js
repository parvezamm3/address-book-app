
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