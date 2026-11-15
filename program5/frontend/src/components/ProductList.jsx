import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { deleteProduct } from '../services/api';

export default function ProductList() {
  const { products, loading, error, refetch } = useProducts();
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
      refetch();
    }
  };

  const filteredProducts = products
    .filter(p => filterCategory ? p.category === filterCategory : true)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="card">Loading products...</div>;

  return (
    <div className="card">
      <h2>Product Catalog <small style={{ color: '#777' }}>(CO6 - Connected to Backend)</small></h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
          style={{ width: '200px' }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Price ($)</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No products found</td></tr>
          ) : (
            filteredProducts.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td><Link to={`/products/${p.id}`} style={{ fontWeight: 600 }}>{p.name}</Link></td>
                <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  {p.stock === 0 ? <span className="badge badge-out">Out of Stock</span>
                    : p.stock < 5 ? <span className="badge badge-low">Low ({p.stock})</span>
                    : <span className="badge badge-stock">In Stock</span>}
                </td>
                <td>
                  <Link to={`/products/${p.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>View</Link>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
