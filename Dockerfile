FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Set executable permissions for the entry point
RUN chmod +x build/index.js

# Expose any necessary ports
# Note: MCP servers typically communicate via stdio, so no ports are needed

# Set environment variables
ENV NODE_ENV=production
ENV SERVER_NAME=synthcore-2.0
ENV SERVER_VERSION=2.0.0
ENV MIN_RESONANCE_THRESHOLD=0.6
ENV MAX_ETHICAL_DRIFT=0.05
ENV MAX_REFLEXIVE_INSTABILITY=0.08

# Run the server
CMD ["node", "build/index.js"]
