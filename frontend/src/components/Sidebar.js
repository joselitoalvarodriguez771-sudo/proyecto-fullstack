import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2>Gestión de Inventario</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/categories">Categorías</Link></li>
        <li><Link to="/items">Productos</Link></li>
        <li><Link to="/movements">Movimientos</Link></li>
        <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '10px' }}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;