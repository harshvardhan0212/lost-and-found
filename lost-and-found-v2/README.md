# 🔍 Lost and Found — Full Stack Project

A beginner-friendly full-stack **Lost and Found** system built with:
- **Backend**: Node.js + Express.js + MongoDB + JWT
- **Frontend**: React + Axios + React Router

---

## 📁 Project Structure

```
lost-and-found/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              ← MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  ← Register & Login logic
│   │   │   ├── itemController.js  ← Create & fetch items
│   │   │   └── claimController.js ← Claim an item
│   │   ├── models/
│   │   │   ├── User.js            ← User schema
│   │   │   ├── Item.js            ← Item schema
│   │   │   └── Claim.js           ← Claim schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js      ← /api/auth/*
│   │   │   ├── itemRoutes.js      ← /api/items/*
│   │   │   └── claimRoutes.js     ← /api/claims/*
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js  ← JWT token verification
│   │   └── app.js                 ← Express app setup
│   ├── server.js                  ← Entry point
│   ├── .env                       ← Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js          ← Navigation bar
    │   ├── pages/
    │   │   ├── HomePage.js        ← List all items + Claim
    │   │   ├── LoginPage.js       ← Login form
    │   │   ├── RegisterPage.js    ← Register form
    │   │   └── CreateItemPage.js  ← Post an item
    │   ├── api.js                 ← Axios instance + interceptor
    │   ├── App.js                 ← Routes setup
    │   ├── index.js               ← React entry point
    │   └── index.css              ← Global styles
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally) OR use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- npm (comes with Node.js)

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone / Download the project

Place both `backend/` and `frontend/` folders inside a `lost-and-found/` directory.

---

### Step 2 — Set up the Backend

```bash
# Navigate to backend folder
cd lost-and-found/backend

# Install all dependencies
npm install
```

**Configure .env file:**

Open `.env` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lost_and_found
JWT_SECRET=your_super_secret_key_here
```

> If using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

**Start the backend server:**

```bash
# For development (auto-restarts on file changes)
npm run dev

# OR for production
npm start
```

You should see:
```
MongoDB Connected: localhost
Server running on http://localhost:5000
```

---

### Step 3 — Set up the Frontend

Open a **new terminal window** and:

```bash
# Navigate to frontend folder
cd lost-and-found/frontend

# Install all dependencies
npm install

# Start the React development server
npm start
```

The browser will open at **http://localhost:3000**

---

## 🌐 API Endpoints Reference

### Auth Routes
| Method | URL | Description | Protected |
|--------|-----|-------------|-----------|
| POST | `/api/auth/register` | Register new user | ❌ No |
| POST | `/api/auth/login` | Login & get JWT | ❌ No |

### Item Routes
| Method | URL | Description | Protected |
|--------|-----|-------------|-----------|
| GET | `/api/items` | Get all items | ❌ No |
| GET | `/api/items/:id` | Get item by ID | ❌ No |
| POST | `/api/items` | Create an item | ✅ Yes |

### Claim Routes
| Method | URL | Description | Protected |
|--------|-----|-------------|-----------|
| POST | `/api/claims` | Claim an item | ✅ Yes |

---

## 🧪 Test the API (without frontend)

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) (VS Code extension):

**Register:**
```json
POST http://localhost:5000/api/auth/register
Body: { "name": "Alice", "email": "alice@test.com", "password": "123456" }
```

**Login:**
```json
POST http://localhost:5000/api/auth/login
Body: { "email": "alice@test.com", "password": "123456" }
```

**Create Item (copy token from login response):**
```
POST http://localhost:5000/api/items
Headers: Authorization: Bearer <your_token_here>
Body: {
  "title": "Blue Wallet",
  "description": "Found near cafeteria",
  "location": "Library 2nd Floor",
  "status": "found"
}
```

**Claim an Item:**
```
POST http://localhost:5000/api/claims
Headers: Authorization: Bearer <your_token_here>
Body: { "itemId": "<item_id_from_get_items>" }
```

---

## 💡 Key Concepts Explained

| Concept | Where Used | What It Does |
|---------|-----------|--------------|
| `bcryptjs` | authController | Hashes passwords before saving |
| `jsonwebtoken` | authController + authMiddleware | Creates/verifies login tokens |
| `mongoose.Schema` | models/ | Defines data structure for MongoDB |
| `populate()` | itemController | Replaces ID with actual user data |
| `req.user` | authMiddleware | Attaches logged-in user to request |
| `localStorage` | Frontend | Stores JWT token in browser |
| `Axios interceptor` | api.js | Auto-adds token to every request |
| `useEffect` | HomePage | Fetches data when component loads |

---

## 🎯 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `MongoDB connection refused` | Make sure MongoDB is running locally |
| `401 Not authorized` | Token missing or expired — login again |
| `400 User already exists` | Use a different email |
| `CORS error` | Make sure `cors()` is in app.js |
| React app blank | Check browser console for errors |
