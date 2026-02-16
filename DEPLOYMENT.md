# Deployment Guide for Belins Dashboard

This project is configured for deployment:
- **Frontend**: GitHub Pages
- **Backend**: Vercel

## Prerequisites

- [Node.js](https://nodejs.org/) installed.
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account.

---

## 1. Backend Deployment (Vercel)

The backend (`server/`) is configured as a Vercel Serverless Function.

1.  **Push your code to GitHub** (if you haven't already).
2.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
3.  **Import your repository** (`belins-dashboard`).
4.  **Configure the Project**:
    *   **Root Directory**: **IMPORTANT** - Change this to `server`.
    *   **Environment Variables**:
        *   `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
        *   (Optional) If you skip this, the app uses in-memory storage (resets on restart).
5.  **Deploy**: Click "Deploy".
6.  **Copy the URL**: Once deployed, copy your backend URL (e.g., `https://belins-dashboard-server.vercel.app`).

---

## 2. Frontend Deployment (GitHub Pages)

The frontend (`client/`) uses `gh-pages` for deployment.

1.  **Configure the API URL**:
    *   Create a file named `.env.production` in the `client` folder.
    *   Add your Vercel Backend URL:
        ```env
        VITE_SERVER_URL=https://your-app-name.vercel.app
        ```

2.  **Install & Deploy**:
    *   Open a terminal in the `client` folder.
    *   Run:
        ```bash
        npm install
        npm run deploy
        ```
    *   This builds the app and pushes it to the `gh-pages` branch.

3.  **Enable GitHub Pages**:
    *   Go to your GitHub Repository -> **Settings** -> **Pages**.
    *   Set **Source** to `Deploy from a branch`.
    *   Set **Branch** to `gh-pages` / `(root)`.
    *   Click **Save**.

Your app will be live at: `https://belindamartina.github.io/belins-dashboard/`
