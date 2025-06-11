
// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import CreateAddressPage from './pages/CreateAddressPage'; 
import EditAddressPage from './pages/EditAddressPage'; 


import './App.css'; // Your main CSS file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateAddressPage />} />
        <Route path="/edit/:id" element={<EditAddressPage />} />
      </Routes>
    </Router>
  );
}

export default App;