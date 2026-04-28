import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { movementService, itemService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MovementManagement = () => {
  const { user } = useAuth();
  const [movements, setMovements] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemId: '', type: 'entrada', quantity: 0 });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchMovements();
    fetchItems();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await movementService.getAll();
      setMovements(response.data);
    } catch (err) {
      console.error('Error fetching movements:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await itemService.getAll();
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...form, userId: user.id, itemId: parseInt(form.itemId), quantity: parseInt(form.quantity) };
      if (editing) {
        await movementService.update(editing.id, dataToSend);
      } else {
        await movementService.create(dataToSend);
      }
      setForm({ itemId: '', type: 'entrada', quantity: 0 });
      setEditing(null);
      fetchMovements();
    } catch (err) {
      console.error('Error saving movement:', err);
      alert('Error al guardar el movimiento: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (movement) => {
    setForm({ itemId: movement.itemId, type: movement.type, quantity: movement.quantity });
    setEditing(movement);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await movementService.delete(id);
        fetchMovements();
      } catch (err) {
        console.error('Error deleting movement:', err);
      }
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Movimientos</h1>
        <div className="card">
          <h2>{editing ? 'Editar Movimiento' : 'Nuevo Movimiento'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Producto:</label>
              <select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required>
                <option value="">Seleccionar Producto</option>
                {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo:</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad:</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} required />
            </div>
            <button type="submit" className="btn btn-add">{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm({ itemId: '', type: 'entrada', quantity: 0 }); }}>Cancelar</button>}
          </form>
        </div>
        <div className="card">
          <h2>Lista de Movimientos</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(movement => (
                <tr key={movement.id}>
                  <td className="secondary-text">{movement.id}</td>
                  <td>{movement.Item?.name || 'Desconocido'}</td>
                  <td>{movement.type}</td>
                  <td>{movement.quantity}</td>
                  <td>{movement.User?.name || 'Sin usuario'}</td>
                  <td className="secondary-text">{new Date(movement.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEdit(movement)}>Editar</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(movement.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MovementManagement;