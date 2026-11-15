# Program 5: Full Stack Integration - React + Express + PostgreSQL
## Course Outcome: CO6

### Features Implemented
1. **Frontend (React + Vite)**: Product listing, forms, detail views, auth pages
2. **Backend (Express + Sequelize)**: REST API with PostgreSQL
3. **Database**: PostgreSQL with Users and Products tables
4. **Authentication**: JWT-based auth with bcrypt password hashing
5. **CORS Configuration**: Configured for frontend-backend communication
6. **Environment Variables**: .env for secrets management
7. **Deployment Ready**: Vercel (frontend) + Render (backend) configs

### Project Structure
```
program5/
├── package.json              # Root scripts for concurrent dev
├── .env.example             # Environment template
├── backend/
│   ├── package.json
│   ├── server.js            # Express server with auth & CRUD
│   ├── db.js                # Sequelize PostgreSQL connection
│   ├── models/
│   │   ├── Product.js       # Product model with validations
│   │   └── User.js          # User model with bcrypt hooks
│   └── migrate.js           # Database sync script
├── frontend/
│   ├── package.json
│   ├── vite.config.js       # Vite + proxy config
│   ├── index.html
│   ├── styles.css
│   └── src/
│       ├── main.jsx
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── ProductList.jsx
│       │   ├── ProductForm.jsx
│       │   └── ProductDetail.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── hooks/
│       │   ├── useProducts.js
│       │   └── useAuth.js
│       └── services/
│           └── api.js
└── db/
    └── schema.sql           # PostgreSQL schema
```

### Run Instructions (Development)
```bash
# 1. Start PostgreSQL (ensure database exists)
# 2. Configure environment
cd program5
cp .env.example .env
# Edit .env with your database credentials

# 3. Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# 4. Run migrations
cd backend && npm run migrate

# 5. Start both servers concurrently
cd .. && npm run start
```

### Deployment

**Backend (Render):**
1. Create Web Service on Render
2. Connect GitHub repo
3. Build: `npm install && cd backend && npm install`
4. Start: `cd backend && npm start`
5. Add Environment Variables from .env.example

**Frontend (Vercel):**
1. Import project on Vercel
2. Root Directory: `program5/frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`

### Key Code Highlights
- **Sequelize Models**: Validations, hooks for password hashing
- **Auth Context**: JWT storage, auto-refresh, protected routes
- **Custom Hooks**: useProducts (data fetching), useAuth (auth state)
- **API Service**: Axios with interceptor for auth headers
- **CORS**: Configured for specific frontend origin
