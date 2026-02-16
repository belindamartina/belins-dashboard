# Belins Dashboard 

A modern, full-stack personal productivity dashboard featuring a clock, task manager, focus timer, and motivational quotes. Designed with a sleek, premium aesthetic.

Try : [belins-dashboard](https://belindamartina.github.io/belins-dashboard/)

##  Features

-   **Personalized Greeting**: Login screen with a personalized greeting and session persistence.
-   **Dynamic Clock**: Real-time clock to keep you on schedule.
-   **Task Manager**: Organize your daily tasks with an intuitive interface.
-   **Focus Timer**: Built-in Pomodoro-style timer to boost productivity.
-   **Daily Inspiration**: Curated motivational quotes to keep you inspired.
-   **Stats Overview**: Quick look at your productivity metrics.
-   **Premium UI**: Glassmorphism effects, smooth animations, and a responsive design.

##  Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (with TypeScript)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: Vanilla CSS (Modern design patterns)
-   **Deployment**: GitHub Pages

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (using MongoDB Atlas)
-   **Deployment**: Vercel (Serverless Functions)

##  Project Structure

```text
belins-dashboard/
├── client/           # React frontend (Vite)
│   ├── src/          # Source code
│   └── public/       # Static assets
├── server/           # Express API backend
│   └── server.js     # API entry point
├── DEPLOYMENT.md     # Detailed deployment guide
└── README.md         # Project overview
```

##  Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [MongoDB](https://www.mongodb.com/cloud/atlas) (Atlas or local instance)

### 1. Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (optional if running locally with default settings):
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=3001
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file for the API endpoint:
    ```env
    VITE_SERVER_URL=http://localhost:3001
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

##  License

This project is open-source and available under the MIT License.
