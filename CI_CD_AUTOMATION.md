# CI/CD Automation

MailO uses GitHub Actions for continuous integration and delivery.

## Workflows

### CI Pipeline
- Runs on every push and pull request to `main`.
- Performs `dotnet restore`, `dotnet build`, and `dotnet test`.
- Ensures code quality and prevents regressions.

### Deployment Pipeline
- Triggers on releases or manual dispatch.
- Builds Docker images for all services.
- Pushes images to the container registry.

## Configuration
CI/CD settings can be found in the `.github/workflows` directory.

Developed by Limitless Infotech Solution Pvt Ltd.
