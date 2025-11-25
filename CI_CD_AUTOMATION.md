# CI/CD Automation Documentation

This document describes the comprehensive CI/CD automation setup for the MailO project.

## 📋 Overview

The project includes 4 automated workflows:

1. **CI Pipeline** (`.github/workflows/ci.yml`) - Main build and test pipeline
2. **Deployment** (`.github/workflows/deploy.yml`) - Automated production deployment
3. **Test Suite** (`.github/workflows/test.yml`) - Comprehensive testing
4. **PR Checks** (`.github/workflows/pr-checks.yml`) - Pull request validation

## 🚀 CI Pipeline

**Triggers:** Push to `main`, `master`, `develop` branches, or PRs

**Jobs:**
- **Lint**: Code quality checks for frontend and backend
- **Build Frontend**: Compiles React app and uploads artifacts
- **Build Docker**: Creates optimized Docker images with caching
- **Status Check**: Reports overall pipeline status

**Features:**
- Parallel job execution for faster builds
- GitHub Actions cache for Docker layers
- Build artifact retention (7 days)

## 🌐 Deployment Workflow

**Triggers:** Push to `main`/`master`, version tags (`v*`), or manual dispatch

**Process:**
1. Build Docker images with BuildKit
2. Push to Docker Hub registry
3. SSH into production server
4. Pull latest images
5. Deploy with `docker compose`
6. Clean up old images

**Required Secrets:**
```
DOCKER_USERNAME     - Docker Hub username
DOCKER_PASSWORD     - Docker Hub password/token
SERVER_HOST         - Production server IP/hostname
SERVER_USER         - SSH username
SSH_PRIVATE_KEY     - SSH private key for authentication
```

## 🧪 Test Suite

**Triggers:** Push to `main`, `master`, `develop`, or PRs

**Jobs:**
- **Frontend Tests**: Unit tests, bundle size checks
- **Backend Tests**: API tests with MongoDB and Redis
- **Security Scan**: Trivy vulnerability scanning + npm audit

**Services:**
- MongoDB (test database)
- Redis (test cache)

## ✅ PR Checks

**Triggers:** PR opened, synchronized, or reopened

**Checks:**
- ESLint code quality
- Prettier formatting
- TODO/FIXME detection
- Bundle size analysis
- Dependency review
- Automatic labeling

## 🤖 Dependabot

**Configuration:** `.github/dependabot.yml`

**Updates:**
- **npm packages** (webmail & backend) - Weekly on Mondays
- **Docker images** - Weekly
- **GitHub Actions** - Monthly

**Features:**
- Automatic PR creation
- Semantic commit messages
- Auto-labeling by category

## 🏷️ Auto-Labeling

**Configuration:** `.github/labeler.yml`

**Labels:**
- `webmail` - Frontend changes
- `backend` - Backend changes
- `docker` - Docker/deployment changes
- `ci/cd` - Workflow changes
- `documentation` - Markdown files
- `dependencies` - Package updates
- `configuration` - Config file changes

## 📦 Docker Optimization

**`.dockerignore`** excludes:
- `node_modules`
- Development files
- Git history
- Documentation
- Environment files

**Benefits:**
- Smaller image sizes
- Faster builds
- Better security

## 🔧 Setup Instructions

### 1. Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```bash
# Docker Hub
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token

# Production Server
SERVER_HOST=your-server-ip
SERVER_USER=deploy-user
SSH_PRIVATE_KEY=your-private-key
```

### 2. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions"
# Copy private key to GITHUB_SECRETS
# Add public key to server's ~/.ssh/authorized_keys
```

### 3. Prepare Production Server

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Create deployment directory
mkdir -p /opt/mailo
cd /opt/mailo

# Copy docker-compose.yml
# Set environment variables in .env
```

### 4. Enable Workflows

Workflows are automatically enabled when you push to GitHub.

## 📊 Monitoring

### View Pipeline Status

- **GitHub Actions Tab**: See all workflow runs
- **PR Checks**: Automatic status on pull requests
- **Commit Status**: Green checkmarks on commits

### Build Artifacts

- Frontend builds are saved for 7 days
- Download from Actions → Workflow Run → Artifacts

### Security Alerts

- Dependabot PRs for vulnerable dependencies
- Trivy scan results in Security tab
- npm audit reports in test logs

## 🎯 Best Practices

1. **Branch Protection**: Require CI to pass before merging
2. **Code Reviews**: Use PR checks to catch issues early
3. **Semantic Versioning**: Tag releases with `v1.0.0` format
4. **Environment Variables**: Never commit secrets
5. **Docker Tags**: Use specific versions in production

## 🔄 Workflow Triggers

| Workflow | Push | PR | Tag | Manual |
|----------|------|----|----|--------|
| CI       | ✅   | ✅ | ❌ | ❌     |
| Deploy   | ✅   | ❌ | ✅ | ✅     |
| Test     | ✅   | ✅ | ❌ | ❌     |
| PR Check | ❌   | ✅ | ❌ | ❌     |

## 🆘 Troubleshooting

### Build Fails

1. Check workflow logs in Actions tab
2. Verify dependencies are up to date
3. Test locally with `npm run build`

### Deployment Fails

1. Verify secrets are configured
2. Check SSH access to server
3. Ensure Docker is running on server
4. Review server logs: `docker compose logs`

### Tests Fail

1. Run tests locally: `npm test`
2. Check service dependencies (MongoDB, Redis)
3. Review test output in workflow logs

## 📈 Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Implement staging environment
- [ ] Add performance benchmarks
- [ ] Set up monitoring/alerting
- [ ] Implement blue-green deployments
- [ ] Add automated rollback on failure

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
