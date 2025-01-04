#!/bin/bash
set -e

# Navigate to frontend directory
cd packages/frontend

# Install dependencies
npm ci

# Build the project
npm run build

# Exit successfully
exit 0