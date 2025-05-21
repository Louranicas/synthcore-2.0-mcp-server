#!/bin/bash

# Exit on any error
set -e

# Variables
IMAGE_NAME="react-frontend-app"
CONTAINER_NAME="react-frontend-container"
APP_PORT="80" # Nginx will serve on port 80 by default inside the container

# Navigate to the frontend directory (assuming the script is run from the project root or frontend directory itself)
# If run from project root:
# cd frontend || exit

echo "Building React application (npm run build)..."
# This step assumes Node.js and npm are available on the machine running this script.
# Alternatively, the Docker build process itself handles this if only 'docker build' is called.
# The frontend Dockerfile already incorporates the build process.
# So, directly building the Docker image is sufficient.
# If we wanted to build locally first, we'd run:
# npm install # To ensure devDependencies like parcel are available
# npm run build

echo "Building Docker image for frontend..."
docker build -t "$IMAGE_NAME" .

echo "Stopping and removing existing container if it exists..."
docker stop "$CONTAINER_NAME" || true # Ignore error if container doesn't exist
docker rm "$CONTAINER_NAME" || true   # Ignore error if container doesn't exist

echo "Running Docker container for frontend..."
# We map port 8080 on the host to port 80 in the container for example
docker run -d -p 8080:"$APP_PORT" --name "$CONTAINER_NAME" "$IMAGE_NAME"

echo "Frontend deployment script finished."
echo "Application should be accessible on port 8080 (mapped to container's port $APP_PORT)."
