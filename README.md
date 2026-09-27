# ✦ Fashion Store

A modern, full-stack fashion e-commerce platform built with **Next.js**, featuring a premium customer shopping experience, seller management console, AI-powered shopping assistant, secure authentication, orders, analytics, and payment integration.

## ✨ Highlights

* 🛍️ Modern and professional fashion e-commerce storefront
* 🤖 AI-powered shopping assistant with product recommendations
* 🏪 Complete seller console for managing the store
* 📦 Product, order, customer, and inventory management
* 🎟️ Coupon and discount management
* 📊 Seller analytics and revenue tracking
* ❤️ Wishlist and shopping cart
* 🔎 Product search, filtering, and sorting
* 👤 Customer accounts and order history
* 💳 Stripe payment integration
* 🔐 Supabase authentication and database
* 🛡️ API protection and rate limiting
* 📱 Fully responsive interface
* ⚡ Fast, modern Next.js architecture

## 🤖 AI Shopping Assistant

The integrated AI assistant helps customers discover products and get shopping guidance directly inside the store.

It can:

* Answer product-related questions
* Recommend products based on customer needs
* Find similar products
* Check product availability
* Search the product catalog
* Guide customers through the shopping experience

The assistant uses an **agent-style tool system** to interact with store data instead of relying only on static responses.

## 🏪 Seller Console

The platform includes a dedicated seller experience for managing the e-commerce operation.

### Seller Features

* Dashboard overview
* Revenue analytics
* Product management
* Add and edit products
* Order management
* Customer management
* Coupon management
* Product performance insights
* Store settings

## 🛒 Customer Experience

Customers can:

* Browse the fashion catalog
* Search and filter products
* View detailed product pages
* Add products to cart
* Manage wishlist
* Complete checkout
* View previous orders
* Manage account information
* Use the AI shopping assistant
* Receive personalized product recommendations

## 🧰 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend & Data

* Next.js API Routes
* Supabase
* PostgreSQL

### AI

* Groq
* Llama models
* AI tool calling

### Payments

* Stripe

### Additional

* ESLint
* Server-side API architecture
* Rate limiting
* Input validation
* Responsive UI

## 🏗️ Architecture

The application follows a modern full-stack Next.js architecture:

```text
Customer / Seller
       ↓
Next.js Application
       ↓
API Routes / Server Logic
       ↓
 ┌─────┼──────────┐
 ↓     ↓          ↓
DB    AI       Payments
 ↓     ↓          ↓
Supabase  Groq   Stripe
```

Sensitive credentials are stored through environment variables and are **not committed to the repository**.

## 🔐 Environment Variables

Create a `.env.local` file in the project root and add the required environment variables.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

Add any additional Supabase and Stripe credentials required by your local configuration.

> Never commit `.env.local` or any API keys to GitHub.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/a-rahman-dev/fashion-store.git
```

### 2. Navigate to the project

```bash
cd fashion-store
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add your required API credentials.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 📁 Project Structure

```text
src/
├── app/
│   ├── (store)/          # Customer storefront
│   ├── (seller)/         # Seller console
│   └── api/              # Backend API routes
│
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/
│   ├── ai/               # AI assistant & tools
│   ├── db/               # Database queries
│   ├── security/         # API protection
│   ├── stripe/           # Payment integration
│   └── utils/            # Utility functions
│
├── types/                # TypeScript types
└── styles/               # Global styles
```

## 📌 Portfolio Project

This project was built as a **portfolio-grade full-stack e-commerce application** to demonstrate modern frontend architecture, backend integration, AI-powered functionality, payment processing, database operations, authentication, and seller-side management.

## 📄 License

This project is created for portfolio and demonstration purposes.
