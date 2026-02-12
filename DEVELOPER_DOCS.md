# MailO - Developer Documentation

Welcome to the MailO developer documentation. This guide provides technical details for developers looking to contribute to or extend the MailO platform.

## Architecture Overview

MailO is built on a modern .NET 10.0 stack:
- **Frontend**: Blazor Server with Tailwind CSS for an iMac-inspired UI.
- **Backend API**: ASP.NET Core Web API.
- **Core Logic**: Shared domain entities and interfaces.
- **Infrastructure**: Entity Framework Core with PostgreSQL and Redis.
- **Background Workers**: Background tasks for SMTP/IMAP processing.

## Getting Started

### Prerequisites
- .NET 10.0 SDK
- PostgreSQL
- Redis
- Docker (optional but recommended)

### Setup
1. Clone the repository.
2. Run `dotnet restore` to install dependencies.
3. Update `appsettings.json` with your database credentials.
4. Run `dotnet ef database update --project src/MailO.Infrastructure --startup-project src/MailO.Api` to apply migrations.
5. Run the project using `dotnet run --project src/MailO.Api`.

## Contact
For technical inquiries, contact your-dev@yourdomain.com or your-info@yourdomain.com.
Visit [https://yourcompany.com](https://yourcompany.com) for more information.
