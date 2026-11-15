import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div>
      <header style={{ background: '#2c3e50', color: 'white', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem' }}>🛒 Full Stack Shopping App (CO6)</h1>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              Products
            </Link>
            {user && (
              <>
                <Link to="/add" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  Add Product
                </Link>
                <span style={{ marginRight: '1rem' }}>Welcome, {user.username}</span>
                <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-danger" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
