#!/bin/bash

echo "Starting MailO Platform..."
echo "=========================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building and starting containers..."
docker-compose up -d --build

echo ""
echo "Waiting for services to initialize..."
sleep 10

echo ""
echo "Launching Webmail Interface..."
if which xdg-open > /dev/null; then
  xdg-open http://localhost
elif which open > /dev/null; then
  open http://localhost
fi

echo ""
echo "MailO is running!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:5000"
echo "MinIO Console: http://localhost:9001"
echo ""
