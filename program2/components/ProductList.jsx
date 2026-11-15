import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 99.99, stock: 15, description: 'Noise cancelling over-ear headphones' },
    { id: 2, name: 'Smart Watch', category: 'electronics', price: 199.50, stock: 3, description: 'Fitness tracker with heart rate monitor' },
    { id: 3, name: 'Running Shoes', category: 'sports', price: 79.99, stock: 0, description: 'Lightweight breathable running shoes' }
  ]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect for persistence/syncing (simulated API fetch)
  useEffect(() => {
    const saved = localStorage.getItem('react_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('react_products', JSON.stringify(products));
  }, [products]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products
    .filter(p => filterCategory ? p.category === filterCategory : true)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Product Listing View</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px' }}
          />
          <select className="select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
          </select>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No products found</td></tr>
          ) : (
            filteredProducts.map(product => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>
                  <Link to={`/products/${product.id}`} style={{ fontWeight: 600, color: '#3498db' }}>
                    {product.name}
                  </Link>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  {product.stock === 0 ? (
                    <span className="badge badge-out">Out of Stock</span>
                  ) : product.stock < 5 ? (
                    <span className="badge badge-low">Low Stock ({product.stock})</span>
                  ) : (
                    <span className="badge badge-stock">In Stock</span>
                  )}
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/products/${product.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>View</Link>
                  <Link to={`/edit/${product.id}`} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Edit</Link>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger" style={{ fontSize: '0.8rem' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
