import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data.product))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Product Details: {product.name}</h2>
        <Link to="/products" className="btn btn-secondary">Back to List</Link>
      </div>
      <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '500px' }}>
        <p><strong>ID:</strong> #{product.id}</p>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{product.category}</span></p>
        <p><strong>Price:</strong> ${Number(product.price).toFixed(2)}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Status:</strong> {product.stock === 0 ? <span className="badge badge-out">Out of Stock</span> : product.stock < 5 ? <span className="badge badge-low">Low Stock</span> : <span className="badge badge-stock">In Stock</span>}</p>
        <p><strong>Description:</strong> {product.description || 'No description'}</p>
      </div>
    </div>
  );
}
