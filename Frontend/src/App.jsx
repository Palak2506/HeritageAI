import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Need AuthContext from Step 1.3
import MainChatApp from './MainChatApp.jsx'; // The new chat wrapper
import Login from './Login.jsx'; // We will create this next
import Register from './Register.jsx'; // Optional: for signup

// --- Helper component to protect routes ---
// It checks if the user is logged in and either renders the component or redirects to login.
const ProtectedRoute = ({ element: Component }) => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    // Show a loading state while we check the token
    if (isLoading) return <div>Loading...</div>; 

    // If logged in, show the component (MainChatApp)
    // If not logged in, redirect to the login page
    return isLoggedIn ? Component : <Navigate to="/login" replace />;
};
// ------------------------------------------


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      
      {/* Protected routes */}
      {/* The root path is now protected and renders the chat app */}
      <Route 
        path="/" 
        element={<ProtectedRoute element={<MainChatApp />} />} 
      />

      {/* Redirect all other unknown routes to the home/protected route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;