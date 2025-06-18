import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import { UserProvider } from './contexts/UserContext/UserContext';
import ViewRecipe from './components/ViewRecipe/ViewRecipe';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < exp * 1000;
  } catch (e) {
    return false;
  }
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recipe/:index" element={<ViewRecipe />} />
      {/* Protected Route - Wrap HomePage with UserProvider */}
      <Route
  path="/"
  element={
    isAuthenticated() ? (
      <UserProvider>
        <HomePage />
      </UserProvider>
    ) : (
      <Navigate to="/login" />
    )
  }
/>
    </Routes>
  );
};

export default App;
