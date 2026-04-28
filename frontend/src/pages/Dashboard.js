import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { itemService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, totalValue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const items = await itemService.getAll();
        const totalItems = items.data.length;
        const lowStock = items.data.filter(item => item.quantity < 10).length;
        const totalValue = items.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setStats({ totalItems, lowStock, totalValue });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="card">
            <h3>Total de Productos</h3>
            <p style={{ fontSize: '2em', color: '#27AE60' }}>{stats.totalItems}</p>
          </div>
          <div className="card">
            <h3>Productos con Stock Bajo</h3>
            <p style={{ fontSize: '2em', color: '#F39C12' }}>{stats.lowStock}</p>
          </div>
          <div className="card">
            <h3>Valor Total del Inventario</h3>
            <p style={{ fontSize: '2em', color: '#3498DB' }}>S/ {stats.totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;