import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route 
              path="products" 
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="products/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="add" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="edit/:id" 
              element={
                <ProtectedRoute>
                  <ProductForm editMode />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
