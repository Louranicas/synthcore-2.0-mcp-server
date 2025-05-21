# Stage 1: Build the React application
FROM node:18-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
# Parcel's default output directory is 'dist'
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine-slim

# Copy build artifacts from the 'builder' stage
# Parcel outputs to 'dist' by default.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration if needed (optional for basic setup)
# For example, to handle client-side routing with React Router:
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# For now, we'll use the default Nginx config which serves index.html.
# For React Router, a custom config is usually needed to redirect all paths to index.html.
# Let's create a basic nginx.conf for this.

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
