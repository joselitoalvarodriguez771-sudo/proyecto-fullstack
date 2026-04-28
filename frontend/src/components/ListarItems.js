import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { itemService } from '../services/api';

const ListarItems = () => {
    const [items, setItems] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await itemService.getAll();
            setItems(response.data);
            setCargando(false);
        } catch (err) {
            setError(err.message);
            setCargando(false);
        }
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { class: 'status-error', text: 'Sin Stock' };
        if (quantity < 10) return { class: 'status-warning', text: 'Stock Bajo' };
        return { class: 'status-healthy', text: 'Stock Saludable' };
    };

    if (cargando) return (
        <div className="app">
            <Sidebar />
            <div className="main-content" style={{ textAlign: 'center', padding: '20px' }}>
                Cargando inventario...
            </div>
        </div>
    );
    if (error) return (
        <div className="app">
            <Sidebar />
            <div className="main-content" style={{ color: '#E74C3C', textAlign: 'center' }}>
                Error: {error}
            </div>
        </div>
    );

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <h1>Inventario de Productos</h1>
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => {
                                const status = getStockStatus(item.quantity);
                                return (
                                    <tr key={item.id}>
                                        <td className="secondary-text">{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>S/ {parseFloat(item.price).toFixed(2)}</td>
                                        <td className={status.class}>{status.text}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListarItems;

export default ListarItems;