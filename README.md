<div align="center">
  <h1>📧 MailO</h1>
  <p><strong>Enterprise Email Server Platform</strong></p>
</div>

[![Build Status](https://github.com/your-username/mailo/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-username/mailo/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

MailO™ is a multi-tenant, enterprise-grade mail collaboration platform inspired by SmarterMail simplicity and Fastmail performance, redesigned with a clean iMac-style UI and built entirely on the .NET ecosystem.

## 🚀 Product Overview
- **Simple & Fast**: Modern iMac-inspired interface using Blazor.
- **Privacy & Security**: Built with security first, supporting 2FA and encryption.
- **Multi-tenant**: SaaS or on-prem ready with tenant isolation.
- **Scalable**: From single server to cluster.

## 📧 Feature Modules
- **Email**: Threaded conversations, rich HTML composer, search, folders & labels.
- **Calendar**: Day/Week/Month views, reminders, invitations.
- **Contacts**: Global address book, auto-complete, groups & tags.
- **DNS Management**: Custom domain support, MX/SPF/DKIM/DMARC generation.
- **Administration**: Multi-level admin roles (Super Admin, Tenant Admin, End User).

## 🛠 Tech Stack
- **Backend**: ASP.NET Core 10, Entity Framework Core.
- **Database**: PostgreSQL / SQL Server.
- **Caching**: Redis.
- **Frontend**: Blazor Server with Tailwind CSS.
- **Infrastructure**: Postfix/Dovecot integration.

## 📂 Repository Structure
- `/src`: .NET Solution source code
- `/docs`: Architecture, Roadmap, and Guides
- `/scripts`: Database and Utility scripts
- `/tests`: Unit and Integration tests

## 🏁 Run Locally
1. Ensure you have .NET 10 SDK and PostgreSQL/Redis installed.
2. `dotnet restore`
3. `dotnet ef database update --project src/Mailto.Infrastructure --startup-project src/Mailto.Api`
4. `dotnet run --project src/Mailto.Api`

Alternatively, use Docker:
```bash
docker-compose up -d
```

## 📜 Documentation
- [Developer Guide](DEVELOPER_DOCS.md)
- [Deployment Guide](DEPLOYMENT.md)
- [CI/CD Automation](CI_CD_AUTOMATION.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## 💬 Support & Contact
- **Licensing**: [your-licensing@yourdomain.com](mailto:your-licensing@yourdomain.com)
- **Sales**: [your-sales@yourdomain.com](mailto:your-sales@yourdomain.com)
- **Support**: [your-support@yourdomain.com](mailto:your-support@yourdomain.com)
- **Website**: [https://yourcompany.com](https://yourcompany.com)

## ### Social Media
Coming soon! Follow us for updates:
- Twitter (launching soon)
- LinkedIn (launching soon)
- YouTube tutorials (in development)

---
Licensed by & Designed and Developed by **Limitless Infotech Solution Pvt. Ltd.**
