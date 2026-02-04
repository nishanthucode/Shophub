# Mini E-Commerce Application

A full-stack MERN application (MongoDB, Express, React, Node.js).

## ✅ Prerequisites
*   Node.js (v14+)
*   MongoDB (running locally)
    > **Verify:** Run `mongosh` in terminal. If it fails, [Download MongoDB Community Server](https://www.mongodb.com/try/download/community).
*   Git

## 🚀 Quick Setup

### 1. Clone & Install Backend
```bash
cd backend
npm install
```

### 2. Install Frontend
```bash
cd ../frontend
npm install
```

### 3. Create Admin User
Open a terminal in the `backend` folder and run:
```bash
node createAdmin.js
```
*   **Result:** Creates admin user with email `admin@example.com` and password `admin123`.

### 4. Start the Application
You need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 🔐 Login Credentials
*   **Admin:** `admin@example.com` / `admin123`
*   **User:** Create new users via the Admin Dashboard.

## 🌐 Access
Open your browser at **http://localhost:3000**
