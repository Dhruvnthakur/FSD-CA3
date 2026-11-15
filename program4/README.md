# Program 4: Express.js REST API with JWT Authentication
## Course Outcome: CO5

### Features Implemented
1. **CRUD Routes**: GET, POST, PUT, DELETE for /api/products
2. **Middleware**:
   - Request Logger (custom)
   - JSON Body Parser (express.json())
   - Input Validation (validateProductInput)
   - JWT Authentication (authenticateToken)
3. **Centralized Error Handling**: Global error middleware
4. **JWT Authentication**: Register/Login with bcrypt password hashing
5. **Protected Routes**: POST/PUT/DELETE require valid JWT token

### API Endpoints

**Auth (Public):**
- POST /api/auth/register - Register new user
- POST /api/auth/login    - Login user

**Products (Public GET, Protected CRUD):**
- GET    /api/products       - Get all products (with query filters)
- GET    /api/products/:id   - Get product by ID
- POST   /api/products       - Create product (Protected)
- PUT    /api/products/:id   - Update product (Protected)
- DELETE /api/products/:id   - Delete product (Protected)

**Protected:**
- GET /api/user/profile - Get current user profile

### Project Structure
```
program4/
├── server.js      # Main Express server
├── package.json
├── .env.example   # Environment variables template
```

### Run Instructions
```bash
cd program4
npm install
cp .env.example .env  # Configure JWT_SECRET
npm run dev  # Starts on http://localhost:4000
```

### Usage Example
```bash
# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'

# Use token for protected route
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"New Product","category":"electronics","price":99.99,"stock":10}'
```
