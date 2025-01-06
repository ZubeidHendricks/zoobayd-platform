FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Install git for potential dependencies
RUN apk add --no-cache git

# Change to frontend directory
WORKDIR /usr/src/app/packages/frontend

# Copy package files
COPY packages/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY packages/frontend/ ./

# Build the application
RUN npm run build

# Use a smaller base image for production
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy built files
COPY --from=0 /usr/src/app/packages/frontend/build ./build

# Install serve to run the application
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
