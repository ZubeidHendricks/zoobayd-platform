FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with relaxed type checking
RUN npm run build -- --skipLibCheck || true

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]