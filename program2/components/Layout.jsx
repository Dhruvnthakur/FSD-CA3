import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div>
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🛒 React Shopping Store (CO3)</h1>
          <nav className="nav">
            <Link 
              to="/products" 
              className={`btn ${location.pathname === '/products' ? 'btn-secondary' : ''}`}
            >
              Product Catalog
            </Link>
            <Link 
              to="/add" 
              className={`btn ${location.pathname === '/add' ? 'btn-primary' : ''}`}
            >
              Add New Product
            </Link>
          </nav>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
    </div>
  );
}
