# Deployment Guide

Follow these steps to deploy the Task Manager application to production using **Render** (Backend & Database) and **Vercel** (Frontend).

## Prerequisites
-   GitHub Account (Push your code to a repository)
-   Render Account (Free tier available)
-   Vercel Account (Free tier available)

---

## Part 1: Backend Deployment (Render)

1.  **Create a New Web Service**:
    -   Log in to [Render dashboard](https://dashboard.render.com/).
    -   Click **New +** -> **Web Service**.
    -   Connect your GitHub repository.

2.  **Configure Settings**:
    -   **Root Directory**: `backend` (Important!)
    -   **Environment**: `Node`
    -   **Build Command**: `npm install && npx prisma generate && npm run build`
    -   **Start Command**: `npm start`

3.  **Environment Variables**:
    Add the following variables in the "Environment" tab:
    -   `DATABASE_URL`: (See Part 2 below)
    -   `JWT_SECRET`: Generate a strong random string.
    -   `JWT_EXPIRES_IN`: e.g., `7d`
    -   `COOKIE_SECRET`: Generate a strong random string.
    -   `FRONTEND_URL`: The URL of your future Vercel frontend (e.g., `https://your-app.vercel.app`). *You can update this later.*

4.  **Deploy**: Click "Create Web Service".

---

## Part 2: Database Setup (Render PostgreSQL)

1.  **Create a New PostgreSQL Database**:
    -   Click **New +** -> **PostgreSQL**.
    -   Name: `task-db`
    -   Key/Value: Leave defaults.
    -   Click **Create Database**.

2.  **Get Connection String**:
    -   Once created, copy the **Internal Database URL** (if deploying backend on Render) or **External Database URL** (for local testing).
    -   **Ideally**: Use the **Internal URL** for the backend's `DATABASE_URL` for better performance.

3.  **Update Backend**:
    -   Go back to your Backend Web Service -> Environment.
    -   Set `DATABASE_URL` to the Postgres connection string.

---

## Part 3: Frontend Deployment (Vercel)

1.  **Import Project**:
    -   Log in to [Vercel](https://vercel.com/new).
    -   Import the same GitHub repository.

2.  **Configure Project**:
    -   **Root Directory**: Edit and select `frontend`.
    -   **Framework Preset**: Vite.

3.  **Environment Variables**:
    -   Add `VITE_BACKEND_URL`: The URL of your deployed Render backend (e.g., `https://task-manager-backend.onrender.com`). *Do not include trailing slash.*

4.  **Deploy**: Click "Deploy".

---

## Part 4: Final Connection

1.  **Update Backend CORS**:
    -   Once Vercel deployment completes, copy your new Frontend URL (e.g., `https://task-manager-iota.vercel.app`).
    -   Go to Render -> Backend Service -> Environment.
    -   Update/Add `FRONTEND_URL` with this value.
    -   Render will auto-deploy.

2.  **Verify**:
    -   Open your Vercel URL.
    -   Register a new user.
    -   Everything should work!

## Troubleshooting
-   **CORS Errors**: Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).
-   **Database Errors**: Ensure `DATABASE_URL` is correct and allow the backend to run `npx prisma migrate deploy` if needed (you might need to run this locally pointing to the remote DB once, or add it to build command).
