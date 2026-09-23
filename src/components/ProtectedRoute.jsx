import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show a clean loading state while Firebase auth status is initializing
  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
