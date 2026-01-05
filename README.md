# Task Manager - Full-Stack Application

This is a full-stack task management application built from scratch in 24 hours as a skills assessment. The project demonstrates a comprehensive understanding of modern web development principles, including a RESTful API backend, a dynamic React frontend, and a secure authentication system.

## Core Technologies

*   **Backend:** Node.js with the Express.js framework
*   **Frontend:** React
*   **Database:** MongoDB Atlas
*   **Authentication:** JSON Web Tokens (JWT)
*   **Styling:** Tailwind CSS

## Features

*   **Secure User Authentication:** Users can register and log in to a secure system.
*   **Data Privacy:** A user can only view and manage their own tasks. Data is completely isolated between users.
*   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their tasks.
*   **Real-Time Synchronization:** The application uses polling to keep data consistent across multiple open tabs or windows.
*   **Cross-Tab Session Management:** Logging in or out in one window will automatically synchronize the state across all other open windows for the application.

---

## Project Architecture: The Full-Stack Principle

This project was built with a clear separation of concerns, following a modern client-server architecture:

1.  **The Backend (`/server` directory):** A stateless RESTful API built with Node.js and Express. Its sole responsibility is to handle business logic, interact with the MongoDB database, and manage user authentication. It communicates using only JSON data.

2.  **The Frontend (`/src` directory):** A dynamic Single-Page Application (SPA) built with React. Its responsibility is to manage the entire user interface and experience. It is completely decoupled from the backend; it only knows how to make HTTP requests to the API to fetch or send data.

This separation makes the application scalable, maintainable, and easy to develop.

---

## The Two-Layer Security Model

Security and data privacy were top priorities. The application implements a robust, two-layer defense mechanism to protect user data.

### Layer 1: Authentication ("Are you allowed in the building?")

This layer ensures that only valid, logged-in users can access protected parts of the API.

*   **How it works:** It uses a **JSON Web Token (JWT)** system. When a user successfully logs in with their username and password, the server generates a signed, tamper-proof JWT and sends it to the client.
*   **Implementation:** A custom **`auth` middleware** (`server/middleware/auth.js`) is placed on every private API route. This middleware intercepts every request, verifies the JWT's signature, and rejects any request that does not have a valid token.

### Layer 2: Authorization ("Is this your apartment?")

This layer ensures that even a logged-in user can only access their own data.

*   **How it works:** After the `auth` middleware successfully verifies a user's token, it extracts the user's unique ID and attaches it to the request object. The main route handler then uses this ID to filter every single database query.
*   **Implementation:** A database call to fetch tasks looks like this:
    ```javascript
    // This query will only find tasks where the 'userId' field matches the ID of the authenticated user.
    const tasks = await Task.find({ userId: req.user });
    ```

This two-layer system makes it impossible for one user to view, edit, or delete another user's tasks, guaranteeing complete data isolation.

---

## My Learning Journey & Bug Fixes

This project was a self learning challenge. A significant part of the process was not just writing code, but also testing, debugging, and fixing critical issues. Here are some of the key bugs I encountered and how I fixed them:

### Bug #1: Critical Data Leak Between Users

*   **The Problem:** During testing, I discovered that if I logged in as User A, logged out, and then logged in as User B, User B would see User A's tasks. This was a critical security failure.
*   **The Investigation:** I first checked the backend API and confirmed that the database query was correctly filtering by `userId`. This led me to suspect the issue was on the frontend. I realized that the component's state was not being properly cleared between user sessions.
*   **The Fix:** I made the `useEffect` hook in the `TaskList` component dependent on the authentication token (`useEffect(() => { ... }, [token])`). This ensures that whenever a user logs in or out (which changes the token), the component's entire data-fetching lifecycle is reset. The old polling interval is cleared, the old task data is wiped from the state, and a fresh data fetch is initiated for the new user.

### Bug #2: Session Desynchronization Across Multiple Windows

*   **The Problem:** I tested a scenario where I was logged in as User A in one browser window and then logged in as User B in a second window. I noticed that the first window would start showing User B's data, creating a data leak and a confusing user experience.
*   **The Investigation:** I learned that `localStorage` is shared across all tabs and windows of the same origin. Logging in on one window was overwriting the token for all other windows, but the other windows weren't aware of the change.
*   **The Fix:** I implemented a global `storage` event listener inside the `Navbar` component. This browser event fires in all tabs/windows whenever `localStorage` is changed by another tab/window. The event handler detects if the `auth-token` was changed and, if so, forces a full page reload (`window.location.reload()`). This ensures that all open windows are always synchronized to the same user session, whether logging in or logging out.

---

## How to Run This Project

### Prerequisites

*   Node.js installed
*   A MongoDB Atlas account and a connection string

### Backend Setup

1.  Navigate to the `server` directory:
    ```sh
    cd server
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Create a `.env` file in the `server` directory with the following variables:
    ```
    ATLAS_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  Start the backend server:
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  From the project's root directory, install the dependencies:
    ```sh
    npm install
    ```

2.  Start the frontend development server:
    ```sh
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:3000`.
