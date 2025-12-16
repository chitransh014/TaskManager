# Collaborative Task Manager

A full-stack, real-time task management application built with React, Node.js, Express, PostgreSQL, and Socket.io.

## Features
-   **Authentication**: Secure Register/Login with JWT & HttpOnly cookies.
-   **Task Management**: Create, Read, Update, Delete tasks.
-   **Real-time Collaboration**: Live updates for task creation, status changes, and deletions across all connected users.
-   **Dashboard**: Personal views (Assigned to Me, Created by Me, Overdue).
-   **Filtering & Sorting**: Filter tasks by Status/Priority and Sort by Due Date.
-   **User Profile**: Update your name and email.

## Tech Stack
### Frontend
-   **React** (Vite + TypeScript)
-   **Tailwind CSS** (Styling)
-   **TanStack Query** (State Management & Caching)
-   **React Hook Form + Zod** (Form Validation)
-   **Socket.io Client** (Real-time events)

### Backend
-   **Node.js + Express** (TypeScript)
-   **Prisma ORM** (Database interaction)
-   **PostgreSQL** (Database)
-   **Socket.io** (WebSockets)
-   **JWT** (Authentication)

## Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL installed and running

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
COOKIE_SECRET="your_cookie_secret"
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_BACKEND_URL="http://localhost:5000"
```

Start the frontend:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## API Documentation

### Auth
-   `POST /auth/register` - Register a new user
-   `POST /auth/login` - Login user
-   `POST /auth/logout` - Logout user
-   `GET /auth/profile` - Get current user profile
-   `PUT /auth/profile` - Update user profile
-   `GET /auth/users` - Get all users (for assignment)

### Tasks
-   `POST /tasks` - Create a task
-   `GET /tasks` - Get tasks (supports filters: `creatorId`, `assignedToId`, `status`, `priority`, `sortBy`)
-   `GET /tasks/:id` - Get task details
-   `PUT /tasks/:id` - Update task
-   `DELETE /tasks/:id` - Delete task
-   `GET /tasks/assigned-to-me` - Get tasks assigned to current user
-   `GET /tasks/created-by-me` - Get tasks created by current user
-   `GET /tasks/overdue` - Get overdue tasks

## Architecture Overview
The backend follows a **Controller-Service-Repository** pattern:
1.  **Controller**: Handles HTTP requests, validation (DTOs), and responses.
2.  **Service**: Contains business logic and triggers Socket.io events.
3.  **Repository**: Handles direct database interactions using Prisma.

**Socket.io Integration**:
-   The `SocketService` singleton manages the IO instance.
-   When `TaskService` performs an action (create/update/delete), it emits an event (`task:created`, `task:updated`, etc.).
-   The Frontend listens for these events and invalidates React Query caches to trigger a re-fetch.

## Trade-offs & Decisions
-   **Polling vs Sockets**: Chose Sockets for instant updates which is critical for collaboration.
-   **JWT in Cookie**: Chose `HttpOnly` cookies for better security against XSS compared to generic LocalStorage.
-   **Prisma**: Used for type-safe database queries.
