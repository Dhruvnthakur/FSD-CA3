# Program 2: React Online Shopping Application
## Course Outcome: CO3

### Features Implemented
1. **Reusable Functional Components**: ProductList, ProductForm, ProductDetail, Layout
2. **JSX & Props**: Components receive and use props for data flow
3. **State Management**: useState for form data, product list, filters
4. **Side Effects**: useEffect for localStorage persistence and data loading
5. **Conditional Rendering**: Edit/Add modes, loading states, empty states
6. **Event Handling**: Form submissions, delete confirmations, navigation
7. **React Router**: Client-side routing with /products, /products/:id, /add, /edit/:id

### Project Structure
```
program2/
├── index.html
├── styles.css
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx (entry point with BrowserRouter)
    ├── components/
    │   ├── Layout.jsx
    │   ├── ProductList.jsx (listing view with search/filter/sort)
    │   ├── ProductForm.jsx (data-entry form with validation)
    │   └── ProductDetail.jsx (detail view)
```

### Run Instructions
```bash
cd program2
npm install
npm run dev  # Starts on http://localhost:3002
```
