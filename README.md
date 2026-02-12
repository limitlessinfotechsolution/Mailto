# Mailto™ Platform

Enterprise-grade multi-tenant mail platform.

Licensed by & Designed and Developed by
Limitless Infotech Solution Pvt. Ltd.

## Tech Stack
- ASP.NET Core 8
- Blazor
- PostgreSQL
- Redis
- SMTP / IMAP

## Repository Structure
- `/src`: .NET Solution source code
- `/docs`: Architecture, Roadmap, and Guides
- `/scripts`: Database and Utility scripts
- `/tests`: Unit and Integration tests

## Run Locally
1. Ensure you have .NET 8 SDK and PostgreSQL/Redis installed.
2. `dotnet restore`
3. `dotnet ef database update`
4. `dotnet run --project src/Mailto.Api`

Alternatively, use Docker:
`docker-compose -f docker-compose.mailto.yml up -d`
