// Program 1: Vanilla JavaScript Shopping Interface
// CO1 & CO2 - DOM manipulation, Event handling, Input Validation, Fetch API with async/await

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let products = [
        { id: 101, name: 'Laptop Pro', category: 'electronics', price: 1299.99, stock: 12, status: 'In Stock' },
        { id: 102, name: 'Wireless Headphones', category: 'electronics', price: 199.50, stock: 4, status: 'Low Stock' },
        { id: 103, name: 'Cotton T-Shirt', category: 'clothing', price: 24.99, stock: 0, status: 'Out of Stock' }
    ];

    // DOM Elements
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productCategorySelect = document.getElementById('productCategory');
    const productStockInput = document.getElementById('productStock');
    const productDescriptionInput = document.getElementById('productDescription');
    const productBody = document.getElementById('productBody');
    const fetchSampleBtn = document.getElementById('fetchSampleBtn');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const loadingDiv = document.getElementById('loading');
    const errorBanner = document.getElementById('errorMessage');
    const emptyState = document.getElementById('emptyState');

    // Validation helper
    function validateForm() {
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));

        // Name validation
        const name = productNameInput.value.trim();
        if (!name || name.length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
            productNameInput.classList.add('invalid');
            isValid = false;
        }

        // Price validation
        const price = parseFloat(productPriceInput.value);
        if (isNaN(price) || price <= 0) {
            document.getElementById('priceError').textContent = 'Price must be greater than 0';
            productPriceInput.classList.add('invalid');
            isValid = false;
        }

        // Category validation
        if (!productCategorySelect.value) {
            document.getElementById('categoryError').textContent = 'Please select a category';
            productCategorySelect.classList.add('invalid');
            isValid = false;
        }

        // Stock validation
        const stock = parseInt(productStockInput.value, 10);
        if (isNaN(stock) || stock < 0) {
            document.getElementById('stockError').textContent = 'Stock cannot be negative';
            productStockInput.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    }

    // Determine status badge based on stock quantity
    function getStatusBadge(stock) {
        if (stock === 0) {
            return '<span class="badge badge-outofstock">Out of Stock</span>';
        } else if (stock < 5) {
            return '<span class="badge badge-lowstock">Low Stock</span>';
        } else {
            return '<span class="badge badge-instock">In Stock</span>';
        }
    }

    // Render products table dynamically
    function renderProducts() {
        const query = searchInput.value.toLowerCase().trim();
        const sortVal = sortSelect.value;

        // Filter
        let filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        // Sort
        filtered.sort((a, b) => {
            if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
            if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
            if (sortVal === 'price-asc') return a.price - b.price;
            if (sortVal === 'price-desc') return b.price - a.price;
            if (sortVal === 'category') return a.category.localeCompare(b.category);
            return 0;
        });

        productBody.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td><span style="text-transform: capitalize;">${escapeHtml(p.category)}</span></td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>${getStatusBadge(p.stock)}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            `;
            productBody.appendChild(tr);
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Global delete function
    window.deleteProduct = (id) => {
        products = products.filter(p => p.id !== id);
        renderProducts();
    };

    // Add Product Form Handler
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newProduct = {
            id: Date.now(),
            name: productNameInput.value.trim(),
            category: productCategorySelect.value,
            price: parseFloat(productPriceInput.value),
            stock: parseInt(productStockInput.value, 10),
            description: productDescriptionInput.value.trim()
        };

        products.unshift(newProduct);
        renderProducts();
        productForm.reset();
        showError('');
    });

    // Fetch Sample Data using Fetch API and Async/Await
    async function fetchSampleProducts() {
        loadingDiv.style.display = 'block';
        showError('');
        try {
            const response = await fetch('https://dummyjson.com/products?limit=5');

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();

            const fetchedProducts = data.products.map(item => ({
                id: item.id + 1000,
                name: item.title,
                category: item.category,
                price: item.price,
                stock: item.stock,
                description: item.description
            }));

            // Append fetched products to existing list
            products = [...fetchedProducts, ...products];
            renderProducts();
        } catch (err) {
            showError(`Failed to fetch data: ${err.message}. Please check network connection.`);
        } finally {
            loadingDiv.style.display = 'none';
        }
    }

    function showError(msg) {
        if (msg) {
            errorBanner.textContent = msg;
            errorBanner.style.display = 'block';
        } else {
            errorBanner.style.display = 'none';
        }
    }

    // Event Listeners for sort & search
    fetchSampleBtn.addEventListener('click', fetchSampleProducts);
    sortSelect.addEventListener('change', renderProducts);
    searchInput.addEventListener('input', renderProducts);

    // Initial render
    renderProducts();
});