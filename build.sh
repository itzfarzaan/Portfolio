#!/bin/bash
# Build script for portfolio deployment

echo "Building portfolio for production..."
npm install
npm run build

echo "Build completed successfully!"
echo "Files are ready in the 'dist' directory"
