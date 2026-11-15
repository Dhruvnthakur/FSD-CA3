import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('react_products');
    if (saved) {
      try {
        const products = JSON.parse(saved);
        const found = products.find(p => p.id === parseInt(id));
        setProduct(found);
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    }
  }, [id]);

  if (!product) {
    return <div className="card"><p>Product not found</p></div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Product Details: {product.name}</h2>
        <div>
          <Link to={`/edit/${product.id}`} className="btn btn-primary">Edit</Link>
          <Link to="/products" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Back to List</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
        <div><strong>ID:</strong> #{product.id}</div>
        <div><strong>Name:</strong> {product.name}</div>
        <div><strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{product.category}</span></div>
        <div><strong>Price:</strong> ${Number(product.price).toFixed(2)}</div>
        <div><strong>Stock:</strong> {product.stock}</div>
        <div>
          <strong>Status:</strong> 
          {product.stock === 0 ? (
            <span className="badge badge-out">Out of Stock</span>
          ) : product.stock < 5 ? (
            <span className="badge badge-low">Low Stock ({product.stock})</span>
          ) : (
            <span className="badge badge-stock">In Stock</span>
          )}
        </div>
        <div><strong>Description:</strong> {product.description || 'No description provided'}</div>
      </div>
    </div>
  );
}
