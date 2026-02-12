# Deployment Guide

This guide provides instructions for deploying MailO in a production environment.

## Requirements
- Ubuntu 22.04+ or similar Linux distribution.
- Docker and Docker Compose.
- Nginx for reverse proxy.
- SSL Certificate (e.g., Let's Encrypt).

## Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mailo.git
   cd mailo
   ```

2. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`.

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Setup Reverse Proxy**
   Configure Nginx to forward requests to the API and UI services.

5. **Verify Deployment**
   Visit your domain to ensure the platform is accessible.

## Support
For deployment support, contact your-support@yourdomain.com.
