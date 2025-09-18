# SubsMan - Subscription Management System

SubsMan is a backend system built with Node.js for managing user subscriptions. It provides a scalable and modular structure for handling user accounts, subscription plans, billing cycles, and access control.

## 🚀 Features

- User registration and authentication
- Subscription creation, renewal, and cancellation
- Middleware for auth and request validation
- Modular route and controller structure
- Configurable database integration

## 🏗️ Project Structure

    ├── app.js # Main app entry point
    ├── config/ # Configuration files
    ├── controllers/ # Business logic
    ├── database/ # DB config and setup
    ├── middlewares/ # Auth and validation middlewares
    ├── models/ # Database models
    ├── routes/ # API endpoints
    ├── utils/ # Utility functions
    ├── package.json
    └── .gitignore

## 🛠️ Tech Stack

- Node.js
- Express.js
- Sequelize / Mongoose *(depending on your DB)*
- JWT for authentication
- ESLint for code quality

## ⚙️ Installation

1. Clone the repo:
```bash
git clone https://github.com/HafizMMoaz/subsman.git
cd subsman
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in a .env file:
```bash
PORT=
SERVER_URL=
NODE_ENV=
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
ARCJET_KEY=
ARCJET_ENV=
QSTASH_URL=
QSTASH_TOKEN=
EMAIL_USERNAME=
EMAIL_PASSWORD=
```
4. Run the server
```bash
npm run dev
or
npm run start
```