# MailO Deployment Guide

This guide explains how to deploy and run the MailO platform on Windows and Linux using Docker.

## Prerequisites

- **Docker** and **Docker Compose** must be installed on your machine.
- **Git** (optional, for cloning the repository).

## Quick Start

### Windows

1.  Navigate to the project directory.
2.  Double-click `start-windows.bat`.
3.  The script will:
    *   Check if Docker is running.
    *   Build and start all services (Frontend, Backend, Database, Storage).
    *   Automatically open the Webmail interface in your default browser.

### Linux / macOS

1.  Open a terminal in the project directory.
2.  Make the script executable: `chmod +x start-linux.sh`
3.  Run the script: `./start-linux.sh`
4.  The script will build the containers and launch the browser.

## Architecture

The platform runs as a set of Docker containers:

*   **mailo_webmail**: Nginx server hosting the React frontend (Port 80).
*   **mailo_backend**: Node.js/Express API (Port 5000).
*   **mailo_mongo**: MongoDB database (Port 27017).
*   **mailo_minio**: Object storage for attachments (Ports 9000/9001).
*   **mailo_redis**: Caching and session management (Port 6379).

## Manual Commands

If you prefer to run commands manually:

```bash
# Start all services
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Troubleshooting

*   **Port Conflicts**: Ensure ports 80, 5000, 27017, 9000, 9001, and 6379 are free.
*   **Docker Not Running**: Make sure Docker Desktop (Windows) or the Docker daemon (Linux) is active.
