import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { itemService, categoryService } from '../services/api';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ sku: '', name: '', description: '', quantity: 0, price: 0, categoryId: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemService.getAll();
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await itemService.update(editing.id, form);
      } else {
        await itemService.create(form);
      }
      setForm({ sku: '', name: '', description: '', quantity: 0, price: 0, categoryId: '' });
      setEditing(null);
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error al guardar el producto: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (item) => {
    setForm({ sku: item.sku, name: item.name, description: item.description, quantity: item.quantity, price: item.price, categoryId: item.categoryId });
    setEditing(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await itemService.delete(id);
        fetchItems();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { class: 'status-error', text: 'Sin Stock' };
    if (quantity < 10) return { class: 'status-warning', text: 'Stock Bajo' };
    return { class: 'status-healthy', text: 'Stock Saludable' };
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Productos</h1>
        <div className="card">
          <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>SKU:</label>
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Cantidad:</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label>Categoría:</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">Seleccionar Categoría</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-add">{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm({ sku: '', name: '', description: '', quantity: 0, price: 0, categoryId: '' }); }}>Cancelar</button>}
          </form>
        </div>
        <div className="card">
          <h2>Lista de Productos</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const status = getStockStatus(item.quantity);
                return (
                  <tr key={item.id}>
                    <td className="secondary-text">{item.id}</td>
                    <td className="secondary-text">{item.sku}</td>
                    <td>{item.Category?.name || 'Sin categoría'}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>S/ {parseFloat(item.price).toFixed(2)}</td>
                    <td className={status.class}>{status.text}</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                    </td>
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

export default ItemManagement;