# 👟 Sneaker Finder

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🚀 Overview

Sneaker Finder is a modern, full-stack e-commerce platform designed for sneaker enthusiasts. Built with performance and user experience in mind, it offers a seamless shopping experience for premium sneakers.

### ✨ Key Features

- **Real-time Inventory Management** - Live tracking of sneaker availability
- **Secure Authentication** - Protected user accounts and data
- **Streamlined Checkout Process** - Smooth and secure payment integration
- **Responsive Design** - Perfect experience across all devices
- **Cloud-based Image Storage** - High-quality sneaker imagery via Cloudinary
- **User Profiles** - Personalized shopping experience
- **Secure Payments** - Integrated with Stripe payment processing

## 🛠️ Technology Stack

### Frontend (SneakerFinderClient)
- React 18 with TypeScript
- Vite for blazing-fast development
- React Router for seamless navigation
- Axios for API communication
- Modern UI/UX design principles

### Backend (SneakerFinderServer)
- Node.js with Express
- TypeScript for type safety
- JWT for secure authentication
- Stripe payment integration
- Cloudinary for image management
- RESTful API architecture
- MongoDB with Mongoose

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/current` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove from cart

### Checkout
- `GET /api/checkout/info` - Get checkout information
- `POST /api/checkout/create-checkout-session` - Create Stripe checkout session
- `POST /api/checkout/confirm` - Confirm payment
- `POST /api/checkout/webhook` - Stripe webhook handler

### Orders
- `GET /api/orders` - Get user's order history

## 💾 Database Schema

### User Collection
- Email (String, unique)
- Password (String, hashed)
- Profile Picture (String, URL)
- Shipping Addresses (Array)
- Created At (Date)

### Product Collection
- Name (String)
- Price (Number)
- Brand (String)
- Color (String)
- Image URL (String)
- Available Sizes (Array)
- Stock Count (Number)

### Order Collection
- User ID (Reference)
- Products (Array)
- Total Amount (Number)
- Shipping Address (Object)
- Payment Status (String)
- Order Status (String)
- Created At (Date)

## 👥 Contributors

This project was developed by:

- **Jakub Klis** - [jakubklis2201@gmail.com](mailto:jakubklis2201@gmail.com)
- **Robert Sternal** - [shoprobinho@gmail.com](mailto:shoprobinho@gmail.com)

## 📝 License

This project is licensed under the ISC License.

---
*Last updated: January 8, 2025*
