import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CategoryManagement from './pages/CategoryManagement';
import ItemManagement from './pages/ItemManagement';
import MovementManagement from './pages/MovementManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><ItemManagement /></ProtectedRoute>} />
          <Route path="/movements" element={<ProtectedRoute><MovementManagement /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
