#!/bin/bash
set -e

# Print Node and npm versions
node --version
npm --version

# Navigate to frontend directory
cd packages/frontend

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install

# List installed packages
npm list --depth=0

# Build the project
npm run build

# Exit successfully
exit 0