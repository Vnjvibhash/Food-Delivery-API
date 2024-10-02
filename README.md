# Food Delivery API

This is a comprehensive Food Delivery API designed to manage various aspects of a food delivery service, including users, restaurants, food items, orders, and payments. The API is built using Node.js, Fastify, and MongoDB.

## Features
- **Admin Panel**: Managed by **Fastify** to handle admin-related functionalities with high performance.
- **User Management**: Sign up, log in, and manage user profiles.
- **Order Management**: Place orders, view order history, and update order statuses.
- **Authentication**: Secure API using JWT tokens for authentication.

## Tech Stack
- **Backend**: Node.js, Fastify
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Stripe or Razorpay (configurable)

## API Endpoints
### Authentication
- `POST /customer/login` - Login as Customer
- `POST /delivery-partner/login` - Login as Delivery Partner
- `POST /refresh` - Refresh the user Token (requires token)
- `GET /user` - Get logged-in user profile (requires token)
- `PATCH /update-user` - Update user profile (requires token)

### Restaurants
- `GET /categories` - Get list of all categories
- `GET /products/:catId` - Get list of all products based on CategoryID

### Orders
- `GET /orders` - Get all the Order completed by Delivery partner or Customer (requires token)
- `GET /order/:id` - Get the Order Details (requires token)
- `POST /orders` - Create a New Order by Customer (requires token)
- `POST /order/:id/confirm` - Confirm the Order By Restorent (Admin only)
- `PATCH /order/:id/status` - Update Status of the Order By Delivery partner (requires token)

## Config
   ```bash
   git clone https://github.com/Vnjvibhash/Food-Delivery-API.git
  ```

