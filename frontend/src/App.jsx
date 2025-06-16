import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import CreateAddressPage from './pages/CreateAddressPage'; 
import EditAddressPage from './pages/EditAddressPage'; 
import LoginPage from './pages/LoginPage'; 
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider and useAuth

import './App.css'; // Your main CSS file

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Get auth state and loading state

  if (loading) {
    // Show a loading indicator while the initial auth check is in progress
    return (
      <div className="App">
        <h1>Loading Application...</h1>
        <p>Please wait while we verify your session.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected page)
  return children ? children : <Outlet />;
};

function App() {
  return (
    <Router>
      {/* AuthProvider wraps the entire application to provide auth context */}
      <AuthProvider>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes wrapped by ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateAddressPage />} />
            <Route path="/edit/:id" element={<EditAddressPage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;