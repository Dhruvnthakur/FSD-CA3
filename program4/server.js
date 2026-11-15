// Program 4: Express.js REST API with Middleware, Input Validation, Error Handling, and JWT Authentication
// Course Outcome: CO5

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// SECURITY: JWT_SECRET must be set in environment variables
// NEVER use hardcoded secrets in production!
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET environment variable is not set!');
  console.error('   Please add JWT_SECRET=your_secret_key to your .env file');
  process.exit(1);
}

// In-memory data store for demonstration
let users = [];
let products = [
  { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1299.99, stock: 10, description: 'High performance laptop' },
  { id: 2, name: 'Wireless Headphones', category: 'electronics', price: 199.50, stock: 4, description: 'Noise cancelling' },
  { id: 3, name: 'Running Shoes', category: 'sports', price: 89.99, stock: 15, description: 'Comfortable footwear' }
];

// Middleware 1: Request Logger Middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
};

// Middleware 2: JSON Parser Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// Middleware 3: JWT Authentication Guard (Protected Route Middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// Middleware 4: Input Validation Middleware for Products
const validateProductInput = (req, res, next) => {
  const { name, category, price, stock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be a string with at least 2 characters');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Category is required');
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    errors.push('Price must be a number greater than 0');
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    errors.push('Stock must be a non-negative integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation Failed', details: errors });
  }

  next();
};

// ================= AUTH ROUTES =================

// Register User
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    next(err);
  }
});

// Login User
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});

// ================= CRUD PRODUCT ROUTES =================

// GET all products (Public route)
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({ count: result.length, products: result });
});

// GET product by ID (Public route)
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ product });
});

// POST create product (Protected Route)
app.post('/api/products', authenticateToken, validateProductInput, (req, res) => {
  const { name, category, price, stock, description } = req.body;

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    category,
    price,
    stock,
    description: description || ''
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product created', product: newProduct });
});

// PUT update product (Protected Route)
app.put('/api/products/:id', authenticateToken, validateProductInput, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, category, price, stock, description } = req.body;

  products[index] = {
    ...products[index],
    name,
    category,
    price,
    stock,
    description: description || products[index].description
  };

  res.json({ message: 'Product updated', product: products[index] });
});

// DELETE product (Protected Route)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(index, 1)[0];
  res.json({ message: 'Product deleted', product: deletedProduct });
});

// Protected profile route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile data', user: req.user });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express REST API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/auth/register - Register user');
  console.log('  POST /api/auth/login    - Login user');
  console.log('  GET  /api/products      - Get all products (Public)');
  console.log('  GET  /api/products/:id  - Get product by ID (Public)');
  console.log('  POST /api/products      - Create product (Protected)');
  console.log('  PUT  /api/products/:id  - Update product (Protected)');
  console.log('  DELETE /api/products/:id - Delete product (Protected)');
});

module.exports = app;
