import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../services/api';

export default function ProductForm({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stock: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode && id) {
      getProduct(id).then(res => {
        const p = res.data.product;
        setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description || '' });
      }).catch(() => navigate('/products'));
    }
  }, [editMode, id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = 'Name required (min 2 chars)';
    if (!formData.category) newErrors.category = 'Category required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be > 0';
    if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stock must be >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description
    };

    try {
      if (editMode) await updateProduct(id, payload);
      else await createProduct(payload);
      navigate('/products', { state: { message: editMode ? 'Product updated!' : 'Product added!' } });
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="card">
      <h2>{editMode ? 'Edit Product' : 'Add New Product'} (Data-Entry Form)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input name="name" className="input" value={formData.name} onChange={handleInputChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select name="category" className="select" value={formData.category} onChange={handleInputChange}>
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        <div className="form-group">
          <label>Price ($) *</label>
          <input type="number" name="price" className="input" value={formData.price} onChange={handleInputChange} min="0.01" step="0.01" />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label>Stock Quantity *</label>
          <input type="number" name="stock" className="input" value={formData.stock} onChange={handleInputChange} min="0" />
          {errors.stock && <span className="error">{errors.stock}</span>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" className="textarea" value={formData.description} onChange={handleInputChange} rows="3" />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">Save Product</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
