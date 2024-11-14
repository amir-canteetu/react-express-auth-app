# Role-Based Authentication System with JWT Tokens & React Context

This application implements a robust role-based authentication system using JSON Web Tokens (JWTs) on the backend and React Context on the frontend. It includes secure login, registration, token refresh, and protected routes, suitable for managing sessions in a web application.

## Table of Contents

- [Role-Based Authentication System with JWT Tokens \& React Context](#role-based-authentication-system-with-jwt-tokens--react-context)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment Variables](#environment-variables)
    - [Backend `.env`](#backend-env)

## Features

- Role-based access control with JWT authentication.
- Secure login, logout, and session handling with access and refresh tokens.
- Protected routes on both frontend and backend.
- Dynamic session management with token refresh handled by Axios interceptors.
- Modular and scalable structure for further expansion.

## Tech Stack

- **Backend:** Node.js, Express, JWT, Bcrypt, Nodemon
- **Frontend:** React, React Context, React Router, Axios, Material UI

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm or Yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/amir-canteetu/react-express-auth-app.git
    cd react-express-auth-app
    ```

2. Install backend and frontend dependencies:
    ```bash
    # Backend setup
    cd api
    npm install

    # Frontend setup
    cd ../client
    npm install
    ```

## Environment Variables

The app requires certain environment variables to be set up. Create a `.env` file in the `api` folder with the following data:

### Backend `.env`

```plaintext
APIUSERSURL="http://localhost:3001/users"
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
accessTokenExpiresIn="15m"
refreshTokenExpiresIn="7d"

## Usage

### Starting the Backend

1. Navigate to the backend directory:
    ```bash
    cd api
    ```

2. Start the backend server:
    ```bash
    nodemon
    ```

3. Start the database:
    ```bash
    npx json-server --watch db.json --port 3001
    ``` 

### Starting the Frontend

1. Navigate to the frontend directory:
    ```bash
    cd ../client
    ```

2. Start the frontend development server:
    ```bash
    npm run dev
    ```

## Endpoints

### Backend API

- **`POST /auth/register`** - User registration
- **`POST /auth/login`** - User login
- **`POST /auth/refresh-token`** - Refresh access token
- **`POST /auth/logout`** - User logout
- **`GET /app/profile`** - Protected route for user profile (autheticated user only)
- **`GET /app/settings`** - Protected route for user settings (Admin only)

## Authentication Flow

The app uses access and refresh tokens to manage user sessions securely:
1. **Access Token**: Short-lived, stored in-memory.
2. **Refresh Token**: Longer-lived, stored as an HTTP-only cookie for security.
3. **Automatic Refresh**: Axios interceptors handle token refresh when the access token expires, maintaining a seamless session.

## Contributing

Contributions are very welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/YourFeature`).
3. Commit your changes.
4. Push to the branch and submit a Pull Request.

## License

This project is licensed under the MIT License.
```
