# 👟 Alcroz — Multi-Brand Footwear E-Commerce Platform

**Alcroz** is a feature-rich, scalable footwear e-commerce application built for seamless product discovery, secure payments, and efficient order management. From multi-brand filtering to integrated Razorpay payments and downloadable receipts — Alcroz is designed to deliver a complete and modern shopping experience for all.

🌐 **[Live Demo](https://ecommerce-app-frontend-phi.vercel.app/)**

🔗 **[Backend API Repo](https://github.com/Abhi9824/ecommerce-app-backend)**


---

## 🚀 Installation

### Frontend Setup

```bash
git clone https://github.com/Abhi9824/Alcroz.git
npm install
npm run dev
```

### Backend Setup

```bash
git clone https://github.com/Abhi9824/ecommerce-app-backend.git
npm install
node index.js
```

---

## ✨ Features

### 🏠 Home Page
- Hero banners
- Featured collections
- Quick links by gender & category

### 🛍️ Product Listing Page
- Responsive grid layout
- Dynamic filters and sorting

### 🔍 Filtering Options
- Brand
- Gender (Men, Women, Unisex)
- Category (Sneakers, Casual, etc.)
- Price Range
- Ratings
- Sorting by Price or Rating

### 📦 Product Details
- Product specs, image carousel, available sizes
- Add to cart / wishlist

### 🛒 Cart & Wishlist
- Add, update, remove products
- View summaries, quantities, totals

### 🔐 Authentication (JWT)
- Sign Up, Login
- Token-based route access
- Profile persistence

### 👤 Profile & Address Management
- Add / Edit / Delete addresses
- Used in checkout

### 💳 Razorpay Payments
- Secure Razorpay integration
- Verify payments
- Download PDF receipts

### 📜 Order History
- View all past orders
- Re-download receipts

---

## 🧩 Backend API Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET    | `/products` | Get all products |
| POST   | `/products` | Add new product |
| GET    | `/products/:id` | Get single product by ID |
| PUT    | `/products/:productId` | Update a product |
| DELETE | `/products/:productId` | Delete a product |
| GET    | `/products/category/:categoryGender` | Filter by category/gender |
| GET    | `/products/brand/:brandName` | Filter by brand |

### 🛒 Cart Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET    | `/user/:userId/cart` | Get user's cart |
| POST   | `/user/:userId/cart` | Add to cart |
| PUT    | `/user/:userId/cart/:id` | Update cart item |
| DELETE | `/user/:userId/cart/:id` | Remove item from cart |

### 💖 Wishlist Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET    | `/user/:userId/wishlist` | Get wishlist |
| POST   | `/user/:userId/wishlist` | Add to wishlist |
| DELETE | `/user/:userId/wishlist/:productId` | Remove from wishlist |

### 📦 Orders & Payments

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/user/createRazorpayOrder` | Create payment order |
| POST   | `/user/verifyRazorpay` | Verify Razorpay signature |
| POST   | `/user/placeOrder` | Finalize order |
| GET    | `/user/getOrders` | Fetch all orders |
| DELETE | `/user/deleteOrder/:orderId` | Delete specific order |

### 🏠 Address Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET    | `/user/:userId/addresses` | Get all addresses |
| POST   | `/user/:userId/addresses` | Add new address |
| PUT    | `/user/:userId/addresses/:addressId` | Update address |
| DELETE | `/user/:userId/addresses/:addressId` | Delete address |

### 👤 User Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/user/signUp` | Register new user |
| POST   | `/user/login` | Login user |
| GET    | `/user/profile` | Get user profile |
| GET    | `/users` | Get all users |

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React.js
- Redux Toolkit
- React Router DOM
- Bootstrap 5
- React Toastify

### 🌐 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt.js
- Razorpay SDK
- CORS
- 
---

## 🙌 Author

Developed with ❤️ by [Abhijit Chanda](https://github.com/Abhi9824)

---

## 📄 License

This project is licensed under the **MIT License**.
