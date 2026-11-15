import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(form.username, form.email, form.password);
    if (res.success) navigate('/products');
    else setError(res.error || 'Registration failed');
  };

  return (
    <div className="card auth-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input className="input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        {error && <div className="error" style={{ textAlign: 'center' }}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
