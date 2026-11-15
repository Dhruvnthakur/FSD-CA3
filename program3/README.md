# Program 3: Node.js Server-side Utility (No Express)
## Course Outcome: CO4

### Features Implemented
1. **File System (fs) Module**: Read/write products to JSON file
2. **Path Module**: Cross-platform file path resolution
3. **Streams**: WriteStream for efficient file writes, ReadStream for logging
4. **EventEmitter**: Custom events for productCreated, productUpdated, productDeleted
5. **Native HTTP Server**: Basic HTTP server without Express framework

### API Endpoints
- GET    /products         - Get all products
- POST   /products         - Create product
- GET    /products/:id     - Get product by ID
- PUT    /products/:id     - Update product
- DELETE /products/:id     - Delete product

### Project Structure
```
program3/
├── server.js          # Main HTTP server with all functionality
├── data/
│   └── products.json  # Data persistence file
└── logs/
    └── server.log     # Request logging via streams
```

### Run Instructions
```bash
cd program3
node server.js  # Starts on http://localhost:3001
```
