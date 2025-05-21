# Developer Guide - Item Management Application

## 1. Project Overview

This document provides guidance for developers working on the Item Management Application.

*   **Purpose**: A full-stack web application allowing users to register, log in, and manage a personal list of items.
*   **Tech Stack**:
    *   **Backend**: Flask (Python web framework)
    *   **Frontend**: React (JavaScript library for UI) with Parcel as the bundler.
    *   **Database**: SQLite (file-based relational database)
    *   **Containerization**: Docker for both backend and frontend services.

## 2. Setup Instructions

Follow these steps to set up the development environment on your local machine.

### 2.1. Prerequisites
*   Git
*   Python 3.8+ and pip
*   Node.js (v18 recommended to match CI/CD) and npm
*   Docker (and Docker Compose, optionally, though not explicitly set up in this project)

### 2.2. Clone Repository
```bash
git clone <repository_url>
cd <project_directory>
```

### 2.3. Backend Setup (Flask)
1.  **Navigate to Backend Directory**:
    ```bash
    cd backend
    ```
2.  **Create and Activate Virtual Environment** (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Database Initialization**:
    The Flask application (`app.py`) is configured to create the SQLite database and tables if they don't exist when the development server starts. The database file (`database.db`) will be created in the `database/` directory at the project root.
5.  **Run Flask Development Server**:
    ```bash
    python app.py
    ```
    The backend should now be running, typically on `http://127.0.0.1:5001`.

### 2.4. Frontend Setup (React)
1.  **Navigate to Frontend Directory**:
    ```bash
    cd frontend 
    # (If you were in the backend directory, use 'cd ../frontend')
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run React Development Server (Parcel)**:
    ```bash
    npm start
    ```
    The frontend development server should now be running, typically on `http://localhost:3000` (as configured in `package.json`), and will proxy API requests if needed (though current setup uses direct API calls with CORS expected).

## 3. Project Structure

A brief overview of the key directories:

*   **`.github/workflows/`**: Contains GitHub Actions workflow files for CI/CD (e.g., `ci_cd_pipeline.yml`).
*   **`backend/`**: Contains the Flask backend application.
    *   `app.py`: Main Flask application file (routes, models, logic).
    *   `requirements.txt`: Python dependencies.
    *   `Dockerfile`: For containerizing the backend.
    *   `deploy_backend.sh`: Script for building and running the backend Docker container.
    *   `tests/`: Backend unit and integration tests.
*   **`database/`**: Intended location for the SQLite database file (`database.db`). Created automatically by the backend on first run if it doesn't exist.
*   **`frontend/`**: Contains the React frontend application.
    *   `public/`: Public assets (e.g., `index.html`).
    *   `index.js`: Main entry point for the React application.
    *   `App.js`: Root React component with routing.
    *   `components/`: Reusable React components (e.g., `AuthForm.js`, `ItemList.js`).
    *   `api.js`: Helper module for making API calls to the backend.
    *   `package.json`: Node.js project metadata and dependencies.
    *   `Dockerfile`: For containerizing the frontend (multi-stage build with Nginx).
    *   `nginx.conf`: Nginx configuration for serving the React app.
    *   `deploy_frontend.sh`: Script for building and running the frontend Docker container.
*   **`API_DOCUMENTATION.md`**: Documentation for the backend API.
*   **`DEPLOYMENT_NOTES.md`**: Notes on deployment, environment configuration, logging, monitoring, etc.
*   **`DEVELOPER_GUIDE.md`**: This file.
*   **`prometheus.yml`**: Placeholder Prometheus configuration.
*   **`USER_MANUAL.md`**: User documentation for the application.

## 4. Running Tests

### 4.1. Backend Tests
Backend tests use Python's `unittest` framework.
1.  Ensure your virtual environment is activated and dependencies are installed.
2.  Navigate to the project root directory.
3.  Run the tests:
    ```bash
    # From the project root directory (/app in the sandbox)
    cd backend 
    python -m unittest discover -s tests -p "test_*.py"
    # Or, if you are already in the /app/backend directory:
    # python -m unittest discover -s tests -p "test_*.py"
    ```
    (Note: The command `cd /app/backend && python -m unittest discover -s tests -p "test_*.py"` was found to work reliably in the sandbox.)

### 4.2. Frontend Tests
Frontend tests use Jest and React Testing Library.
1.  Ensure Node.js dependencies are installed.
2.  Navigate to the `frontend` directory.
3.  Run the tests:
    ```bash
    npm test
    ```
    (Note: The command `cd /app/frontend && npm test` was used in the sandbox.)

## 5. Deployment

Refer to `DEPLOYMENT_NOTES.md` for detailed information on environment configuration, logging, monitoring, backup, and update processes.

*   **Docker**: Both backend and frontend applications are designed to be containerized using Docker. Dockerfiles are provided in their respective directories (`backend/Dockerfile`, `frontend/Dockerfile`).
*   **Deployment Scripts**: Basic deployment scripts (`backend/deploy_backend.sh`, `frontend/deploy_frontend.sh`) are provided to build Docker images and run containers. These are illustrative and would need adaptation for specific production environments.
*   **Database**: For production, ensure the SQLite database file is persisted using Docker volumes as noted in `DEPLOYMENT_NOTES.md` and `backend/deploy_backend.sh`. Consider migrating to a more robust database like PostgreSQL for production workloads.
*   **Environment Variables**: Crucial for configuring the application in different environments (development, staging, production) without hardcoding settings. See `DEPLOYMENT_NOTES.md`.

## 6. Coding Guidelines

**(Placeholder Section)**

*   Follow PEP 8 for Python code.
*   Use ESLint/Prettier (or similar) for consistent JavaScript/React code formatting (setup not included in this project version).
*   Write clear and concise comments where necessary.
*   Ensure components are reusable and modular.
*   Write unit and integration tests for new features and bug fixes.

## 7. CI/CD

A basic CI/CD pipeline is outlined using GitHub Actions in `.github/workflows/ci_cd_pipeline.yml`. This includes:
*   Automated builds and tests for backend and frontend on pushes/PRs to the main branch.
*   Conceptual steps for Docker image building and deployment.

Refer to the workflow file for more details.

---
Happy Developing!
