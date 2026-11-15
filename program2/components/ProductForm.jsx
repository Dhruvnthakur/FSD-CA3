import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ProductForm component for data entry
// Demonstrates: useState, useEffect, conditional rendering, event handling
export default function ProductForm({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
 
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  });
 
  const [errors, setErrors] = useState({});
  const [existingProducts, setExistingProducts] = useState([]);

  // Load existing products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('react_products');
    if (saved) {
      try {
        const products = JSON.parse(saved);
        setExistingProducts(products);
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    }
  }, []);

  // Load product data for edit mode
  useEffect(() => {
    if (editMode && id) {
      const saved = localStorage.getItem('react_products');
      if (saved) {
        try {
          const products = JSON.parse(saved);
          const product = products.find(p => p.id === parseInt(id));
          if (product) {
            setFormData({
              name: product.name,
              category: product.category,
              price: product.price,
              stock: product.stock,
              description: product.description || ''
            });
          }
        } catch (e) {
          console.error('Failed to parse products', e);
        }
      }
    }
  }, [editMode, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const product = {
      id: editMode ? parseInt(id) : Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description
    };

    let updatedProducts;
    if (editMode) {
      updatedProducts = existingProducts.map(p => 
        p.id === product.id ? product : p
      );
    } else {
      updatedProducts = [...existingProducts, product];
    }

    localStorage.setItem('react_products', JSON.stringify(updatedProducts));
    setExistingProducts(updatedProducts);
    navigate('/products', { state: { message: editMode ? 'Product updated!' : 'Product added!' } });
  };

  const cancelHandler = () => {
    navigate('/products');
  };

  return (
    <div className="card">
      <h2>{editMode ? 'Edit Product' : 'Add New Product'} (Data-Entry Form)</h2>
     
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            className="select"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
            <option value="home">Home & Garden</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            name="price"
            className="input"
            value={formData.price}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            placeholder="Enter price"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Stock Quantity *</label>
          <input
            type="number"
            name="stock"
            className="input"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter stock quantity"
          />
          {errors.stock && <span className="error">{errors.stock}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            className="textarea"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder="Enter product description"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" onClick={cancelHandler} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
