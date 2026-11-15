// Program 3: Node.js Server-side Utility for Online Shopping
// CO4 - File System, Path modules, HTTP server without Express

const http = require('http');
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// Product data store (using local JSON file)
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Create EventEmitter for notifications
const eventEmitter = new EventEmitter();

// Event handlers for notifications
eventEmitter.on('productCreated', (product) => {
    console.log(`[NOTIFICATION] New product added: ${product.name}`);
});

eventEmitter.on('productUpdated', (product) => {
    console.log(`[NOTIFICATION] Product updated: ${product.name}`);
});

eventEmitter.on('productDeleted', (id) => {
    console.log(`[NOTIFICATION] Product deleted with ID: ${id}`);
});

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize products file if it doesn't exist
function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialProducts = [
            { id: 1, name: 'Smartphone X', category: 'electronics', price: 599.99, stock: 25, description: 'Premium smartphone' },
            { id: 2, name: 'Running Shoes', category: 'sports', price: 89.50, stock: 15, description: 'Professional running shoes' },
            { id: 3, name: 'Novel Collection', category: 'books', price: 39.99, stock: 50, description: 'Bestseller novel collection' }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialProducts, null, 2), 'utf8');
    }
}

// Read all products using synchronous read (for simplicity in demo)
function readProducts() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products:', err.message);
        return [];
    }
}

// Write products using stream for efficient I/O
function writeProducts(products) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(products, null, 2);
        const writeStream = fs.createWriteStream(DATA_FILE, { flags: 'w' });

        writeStream.write(data, 'utf8', () => {
            writeStream.end();
            resolve();
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
}

// Parse URL and extract path/query
function parseUrl(req) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    return {
        pathname: parsedUrl.pathname,
        searchParams: Object.fromEntries(parsedUrl.searchParams),
        method: req.method
    };
}

// Send JSON response
function sendJsonResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data, null, 2));
}

// Send error response
function sendErrorResponse(res, statusCode, message) {
    sendJsonResponse(res, statusCode, { error: message });
}

// Read request body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
}

// Main server setup
initDataFile();

const server = http.createServer(async (req, res) => {
    try {
        const { pathname, searchParams, method } = parseUrl(req);

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS preflight
        if (method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Routes
        if (pathname === '/products' && method === 'GET') {
            const products = readProducts();
            sendJsonResponse(res, 200, { products, count: products.length });

        } else if (pathname === '/products' && method === 'POST') {
            const body = await getRequestBody(req);
            const newProduct = JSON.parse(body);

            // Validate input
            if (!newProduct.name || !newProduct.category || typeof newProduct.price !== 'number') {
                sendErrorResponse(res, 400, 'Missing required fields');
                return;
            }

            const products = readProducts();
            const id = products.length > 0
                ? Math.max(...products.map(p => p.id)) + 1
                : 1;

            const product = {
                id,
                name: newProduct.name,
                category: newProduct.category,
                price: newProduct.price,
                stock: newProduct.stock || 0,
                description: newProduct.description || ''
            };

            products.push(product);
            await writeProducts(products);

            // Emit event
            eventEmitter.emit('productCreated', product);

            sendJsonResponse(res, 201, { product });

        } else if (pathname.startsWith('/products/') && method === 'GET') {
            const id = parseInt(pathname.split('/')[2], 10);
            const products = readProducts();
            const product = products.find(p => p.id === id);

            if (product) {
                sendJsonResponse(res, 200, { product });
            } else {
                sendErrorResponse(res, 404, 'Product not found');
            }

        } else if (pathname.startsWith('/products/') && method === 'PUT') {
            const id = parseInt(pathname.split('/')[2], 10);
            const body = await getRequestBody(req);
            const updates = JSON.parse(body);

            const products = readProducts();
            const index = products.findIndex(p => p.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...updates };
                await writeProducts(products);

                eventEmitter.emit('productUpdated', products[index]);

                sendJsonResponse(res, 200, { product: products[index] });
            } else {
                sendErrorResponse(res, 404, 'Product not found');
            }

        } else if (pathname.startsWith('/products/') && method === 'DELETE') {
            const id = parseInt(pathname.split('/')[2], 10);
            const products = readProducts();
            const index = products.findIndex(p => p.id === id);

            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];
                await writeProducts(products);

                eventEmitter.emit('productDeleted', id);

                sendJsonResponse(res, 200, { message: 'Product deleted successfully' });
            } else {
                sendErrorResponse(res, 404, 'Product not found');
            }

        } else {
            sendErrorResponse(res, 404, 'Route not found');
        }
    } catch (err) {
        console.error('Server error:', err);
        sendErrorResponse(res, 500, 'Internal server error');
    }
});

// Use Streams to monitor file changes
const watchStream = fs.watch(DATA_FILE, (eventType, filename) => {
    if (eventType === 'change') {
        console.log(`[STREAM] File ${filename} was modified`);
    }
});

// Use Streams to log operations
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'server.log'), {
    flags: 'a',
    cwd: __dirname
});

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Middleware to log requests
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.url}\n`;
    logStream.write(logEntry);
    next();
};

// HTTP Server Configuration
const PORT = process.env.PORT || 3001;

// Stream processing utility using EventEmitter
class ProductStreamProcessor extends EventEmitter {
    constructor() {
        super();
        this.buffer = [];
    }

    processProduct(product) {
        this.buffer.push(product);
        this.emit('productStreamed', product);
    }

    flush() {
        const data = [...this.buffer];
        this.buffer = [];
        this.emit('streamFlushed', data);
        return data;
    }

    // Use pipe to transform data
    transformProducts(transformFn) {
        return new ReadableStream({
            start: (controller) => {
                const products = readProducts();
                products.forEach(product => {
                    controller.enqueue(transformFn(product));
                });
                controller.close();
            }
        });
    }
}

// Create stream processor instance
const processor = new ProductStreamProcessor();

processor.on('productStreamed', (product) => {
    console.log(`[STREAM PROCESSOR] Processed: ${product.name}`);
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('APIs available:');
    console.log('  GET    /products       - Get all products');
    console.log('  POST   /products       - Create product');
    console.log('  GET    /products/:id   - Get product by ID');
    console.log('  PUT    /products/:id   - Update product');
    console.log('  DELETE /products/:id   - Delete product');
    console.log('  GET    /products?category=electronics - Filter by category');
});

module.exports = { server, eventEmitter, processor };
