-- PostgreSQL Schema for Online Shopping Database (CO6)
-- Run: psql -U postgres -d shopping_db -f schema.sql

CREATE DATABASE IF NOT EXISTS shopping_db;
\c shopping_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data
INSERT INTO products (name, category, price, stock, description) VALUES
('Laptop Pro', 'electronics', 1299.99, 10, 'High-performance business laptop'),
('Wireless Headphones', 'electronics', 199.50, 4, 'Noise-cancelling wireless headphones'),
('Running Shoes', 'sports', 89.99, 15, 'Lightweight running shoes'),
('Cotton T-Shirt', 'clothing', 24.99, 25, 'Premium cotton t-shirt'),
('Programming Book', 'books', 49.99, 50, 'Complete programming guide');
