#!/bin/bash

# Exit on any error
set -e

# Variables
IMAGE_NAME="flask-backend-app"
CONTAINER_NAME="flask-backend-container"
APP_PORT="5001" # Should match the EXPOSE and Gunicorn bind port in Dockerfile

# Navigate to the backend directory (assuming the script is run from the project root or backend directory itself)
# If run from project root:
# cd backend || exit

echo "Building Docker image for backend..."
docker build -t "$IMAGE_NAME" .

echo "Stopping and removing existing container if it exists..."
docker stop "$CONTAINER_NAME" || true # Ignore error if container doesn't exist
docker rm "$CONTAINER_NAME" || true   # Ignore error if container doesn't exist

echo "Running Docker container for backend..."
# Note: This assumes the database file 'database/database.db' is accessible.
# For a real deployment, the database needs persistent storage.
# We might need to mount a volume for the database directory.
# Example: -v $(pwd)/../database:/app/database 
# The path /app/database inside the container must match where app.py expects the DB.
# app.py currently uses: os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database', 'database.db')
# which resolves to /app/../database/database.db -> /database/database.db if WORKDIR is /app
# So, the mount should be to /app/database if app.py expects it there, or adjust db_path in app.py.
# Let's assume app.py's db_path is correctly set for container's WORKDIR /app
# The db_path is: db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database', 'database.db')
# Inside the container, if __file__ is /app/app.py, then os.path.dirname(...) is /app.
# Then os.path.join('/app', '..', 'database', 'database.db') becomes /app/../database/database.db which is /database/database.db
# So the volume mount should be to /database in the container if we want to use the existing path logic directly.
# OR, more simply, ensure the database file is copied into the image or a standard path is used.
# The current Dockerfile copies the entire backend directory, including potentially an empty 'database' dir if it were inside 'backend'.
# But 'database' is at the root.
# For simplicity in this script, we'll run without a volume mount, meaning DB is ephemeral inside container.
# A production setup MUST use a volume for the database.

docker run -d -p "$APP_PORT:$APP_PORT" --name "$CONTAINER_NAME" "$IMAGE_NAME"

echo "Backend deployment script finished."
echo "Application should be accessible on port $APP_PORT."
echo "Note: Database is ephemeral in this setup. For production, use a mounted volume for persistence."
echo "And ensure database initialization (db.create_all()) is handled, e.g., via a one-off script or entrypoint modification."
