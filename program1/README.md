# Program 1: Vanilla JavaScript Shopping Interface
## Course Outcomes: CO1, CO2

### Features Implemented
1. **DOM Manipulation**: Dynamic product table rendering from JavaScript array
2. **Event Handling**: Form submission, search input, sort dropdown, delete buttons
3. **Input Validation**: Client-side validation with meaningful error messages
4. **Fetch API with async/await**: Fetches sample data from DummyJSON API
5. **Dynamic Display**: Products sorted, filtered, displayed with status badges
6. **Error Handling**: HTTP errors, validation errors, network failures

### Project Structure
```
program1/
├── index.html      # Main HTML with form and product table
├── styles.css      # Complete styling for all UI elements
├── app.js          # Vanilla JS logic (validation, fetch, render)
└── README.md
```

### Run Instructions
```bash
cd program1
# Open index.html directly in browser, OR
npx serve  # Simple HTTP server
```

### Key Code Highlights
- **validateForm()**: Validates name (min 2 chars), price (>0), category (required), stock (>=0)
- **fetchSampleProducts()**: Async function using Fetch API with try/catch
- **renderProducts()**: Dynamic table rendering with filtering and sorting
- **XSS protection**: escapeHtml() function for safe DOM insertion
- **Status badges**: In Stock (green), Low Stock (orange), Out of Stock (red)
- **External API**: Fetches from https://dummyjson.com/products
