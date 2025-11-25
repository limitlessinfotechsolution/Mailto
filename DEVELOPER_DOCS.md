# MailO - Enterprise Email Server Platform

**Developer Documentation**

**Version:** 1.0.0  
**Organization:** Limitless Infotech Solution Pvt Ltd.  
**License:** Proprietary - Licensed Under Limitless Infotech Solution Pvt Ltd.  
**Last Updated:** November 25, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Development Guide](#development-guide)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Security](#security)
11. [Contributing](#contributing)
12. [License](#license)

---

## 📖 Project Overview

**MailO** is a comprehensive, self-hosted email server platform designed for enterprises and organizations seeking complete control over their email infrastructure. The platform provides a modern webmail interface, robust backend services, and advanced features including calendar, contacts, tasks, notes, and email campaigns.

### Key Features

- ✉️ **Full Email Server**: SMTP, IMAP, and POP3 support
- 🌐 **Modern Webmail**: React-based responsive interface
- 📅 **Calendar Integration**: Event scheduling and management
- 👥 **Contact Management**: Comprehensive address book
- ✅ **Task Management**: To-do lists and task tracking
- 📝 **Notes**: Quick note-taking functionality
- 📢 **Email Campaigns**: Bulk email marketing tools
- 🔐 **Security**: 2FA, encryption, and secure authentication
- 🎨 **Dark Mode**: User-friendly theme switching
- 🔄 **Real-time Updates**: WebSocket-based notifications
- 📦 **Object Storage**: MinIO S3-compatible storage
- 🚀 **Scalable**: Microservices architecture

### Use Cases

- Corporate email infrastructure
- Educational institutions
- Government organizations
- Privacy-focused businesses
- Multi-tenant email hosting
- White-label email solutions

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   Webmail      │   │   SMTP Server   │   │  IMAP Server   │
│   (React)      │   │   (Port 25)     │   │  (Port 143)    │
│   (Nginx)      │   │                 │   │                │
└───────┬────────┘   └────────┬────────┘   └───────┬────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │   (Express.js)     │
                    │   (Port 5000)      │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   MongoDB      │   │     Redis       │   │     MinIO      │
│   (Database)   │   │    (Cache)      │   │   (Storage)    │
└────────────────┘   └─────────────────┘   └────────────────┘
```

### Component Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Webmail** | React 19, Vite, TailwindCSS | User interface |
| **Backend** | Node.js, Express | REST API & business logic |
| **SMTP** | Custom SMTP server | Outgoing email |
| **IMAP** | Custom IMAP server | Email retrieval |
| **Database** | MongoDB | Metadata storage |
| **Cache** | Redis | Session & caching |
| **Storage** | MinIO | Email & attachment storage |
| **Queue** | BullMQ | Background jobs |

---

## 💻 Technology Stack

### Frontend (Webmail)

```json
{
  "framework": "React 19.2.0",
  "build-tool": "Vite 5.0",
  "styling": "TailwindCSS 3.4",
  "icons": "React Icons 5.5",
  "http-client": "Axios 1.13",
  "real-time": "Socket.IO Client 4.8",
  "rich-text": "React Quill 2.0"
}
```

### Backend

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express 4.18",
  "database": "MongoDB 8.0",
  "cache": "Redis (ioredis 5.8)",
  "queue": "BullMQ 5.64",
  "storage": "MinIO (S3-compatible)",
  "auth": "JWT (jsonwebtoken 9.0)",
  "security": "Helmet 7.1, bcryptjs 2.4",
  "2fa": "Speakeasy 2.0, QRCode 1.5",
  "websocket": "Socket.IO 4.8"
}
```

### Infrastructure

```yaml
containerization: Docker & Docker Compose
web-server: Nginx (Alpine)
ci-cd: GitHub Actions
monitoring: (Planned: Prometheus, Grafana)
logging: Morgan, Winston (planned)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Docker**: v20+ with Docker Compose V2
- **Git**: Latest version
- **MongoDB**: v8.0+ (or use Docker)
- **Redis**: v7+ (or use Docker)
- **MinIO**: Latest (or use Docker)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/limitlessinfotechsolution/mailo.git
cd mailo
```

#### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Or install individually
npm install -w webmail
npm install -w backend
```

#### 3. Environment Configuration

Create `.env` file in the root directory:

```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/mailo?authSource=admin

# Redis
REDIS_URI=redis://localhost:6379

# MinIO (S3-compatible storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_USE_SSL=false
MINIO_BUCKET=mailo-emails

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=localhost
SMTP_PORT=25
IMAP_HOST=localhost
IMAP_PORT=143

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=change-this-password
```

#### 4. Start Development Environment

**Option A: Using Docker (Recommended)**

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Option B: Manual Setup**

```bash
# Terminal 1: Start MongoDB
mongod --dbpath ./data/db

# Terminal 2: Start Redis
redis-server

# Terminal 3: Start MinIO
minio server ./data/minio --console-address ":9001"

# Terminal 4: Start Backend
cd backend
npm run dev

# Terminal 5: Start Webmail
cd webmail
npm run dev
```

#### 5. Access the Application

- **Webmail**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MinIO Console**: http://localhost:9001

### Default Credentials

```
Email: admin@localhost
Password: admin123
```

> ⚠️ **Security Warning**: Change default credentials immediately in production!

---

## 📁 Project Structure

```
mailo/
├── .github/                    # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml             # Main CI pipeline
│   │   ├── deploy.yml         # Deployment automation
│   │   ├── test.yml           # Test suite
│   │   └── pr-checks.yml      # PR validation
│   ├── dependabot.yml         # Dependency updates
│   └── labeler.yml            # Auto-labeling config
│
├── backend/                    # Backend API service
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── worker.js          # Background job processor
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Domain.js
│   │   │   ├── Message.js
│   │   │   ├── Calendar.js
│   │   │   ├── Contact.js
│   │   │   ├── Task.js
│   │   │   ├── Note.js
│   │   │   └── Campaign.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── messages.js
│   │   │   ├── folders.js
│   │   │   ├── calendar.js
│   │   │   ├── contacts.js
│   │   │   ├── tasks.js
│   │   │   ├── notes.js
│   │   │   ├── campaigns.js
│   │   │   ├── admin.js
│   │   │   └── stats.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── utils/             # Utility functions
│   │       ├── jwt.js
│   │       ├── email.js
│   │       └── storage.js
│   ├── Dockerfile
│   └── package.json
│
├── webmail/                    # Frontend React application
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # React entry point
│   │   ├── Login.jsx          # Authentication page
│   │   ├── api.js             # API client
│   │   ├── components/        # React components
│   │   │   ├── Compose.jsx    # Email composer
│   │   │   ├── Calendar.jsx   # Calendar view
│   │   │   ├── Contacts.jsx   # Contact management
│   │   │   ├── Tasks.jsx      # Task management
│   │   │   ├── Notes.jsx      # Notes interface
│   │   │   ├── Campaigns.jsx  # Campaign manager
│   │   │   ├── AdminPanel.jsx # Admin dashboard
│   │   │   └── Settings.jsx   # User settings
│   │   ├── context/           # React context
│   │   │   ├── socket.js
│   │   │   └── SocketContext.jsx
│   │   ├── index.css          # Global styles
│   │   └── App.css
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── nginx.conf             # Nginx configuration
│   ├── Dockerfile
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # TailwindCSS config
│   └── package.json
│
├── smtp/                       # SMTP server (outgoing mail)
│   ├── src/
│   │   └── index.js
│   └── package.json
│
├── imap/                       # IMAP server (incoming mail)
│   ├── src/
│   │   └── index.js
│   └── package.json
│
├── shared/                     # Shared utilities
│   ├── constants.js
│   ├── validators.js
│   └── helpers.js
│
├── docker-compose.yml          # Docker orchestration
├── .dockerignore              # Docker ignore rules
├── .gitignore                 # Git ignore rules
├── .env.example               # Environment template
├── package.json               # Root package.json
├── README.md                  # Project readme
├── DEPLOYMENT.md              # Deployment guide
├── CI_CD_AUTOMATION.md        # CI/CD documentation
└── DEVELOPER_DOCS.md          # This file
```

---

## 🛠️ Development Guide

### Code Style & Standards

#### JavaScript/React

- **ES6+ syntax** with modern features
- **Functional components** with hooks
- **Async/await** for asynchronous operations
- **ESLint** for code quality
- **Prettier** for formatting (recommended)

#### Naming Conventions

```javascript
// Components: PascalCase
const UserProfile = () => { ... }

// Functions: camelCase
const fetchUserData = async () => { ... }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10485760;

// Files: kebab-case or PascalCase
user-profile.jsx
UserProfile.jsx
```

#### Component Structure

```javascript
import { useState, useEffect } from 'react';
import { apiMethod } from './api';

function ComponentName({ prop1, prop2 }) {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### API Development

#### Creating New Endpoints

**1. Define Route** (`backend/src/routes/feature.js`)

```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/feature
router.get('/', authenticate, async (req, res) => {
  try {
    const data = await FeatureModel.find({ userId: req.user._id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/feature
router.post('/', authenticate, async (req, res) => {
  try {
    const item = new FeatureModel({
      ...req.body,
      userId: req.user._id
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

**2. Register Route** (`backend/src/index.js`)

```javascript
import featureRoutes from './routes/feature.js';

app.use('/api/feature', featureRoutes);
```

**3. Add API Client Method** (`webmail/src/api.js`)

```javascript
export const getFeatures = () => api.get('/feature');
export const createFeature = (data) => api.post('/feature', data);
```

### Database Models

#### Creating a New Model

```javascript
// backend/src/models/Feature.js
import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true, // Adds createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
featureSchema.index({ userId: 1, status: 1 });
featureSchema.index({ createdAt: -1 });

// Virtual properties
featureSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Instance methods
featureSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Static methods
featureSchema.statics.findActive = function(userId) {
  return this.find({ userId, status: 'active' });
};

export default mongoose.model('Feature', featureSchema);
```

### Frontend Component Development

#### Creating a New Component

```javascript
// webmail/src/components/FeatureList.jsx
import { useState, useEffect } from 'react';
import { getFeatures, createFeature } from '../api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function FeatureList() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const res = await getFeatures();
      setFeatures(res.data);
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;

    try {
      const res = await createFeature({ title: newFeature });
      setFeatures([...features, res.data]);
      setNewFeature('');
    } catch (error) {
      console.error('Failed to create feature:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Features</h2>
      
      <form onSubmit={handleCreate} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="New feature..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {features.map(feature => (
          <div
            key={feature._id}
            className="p-4 bg-white border rounded flex justify-between items-center"
          >
            <span>{feature.title}</span>
            <button className="text-red-600 hover:text-red-800">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureList;
```

### Testing

#### Unit Tests (Planned)

```javascript
// backend/src/models/__tests__/Feature.test.js
import Feature from '../Feature.js';

describe('Feature Model', () => {
  it('should create a new feature', async () => {
    const feature = new Feature({
      userId: '507f1f77bcf86cd799439011',
      title: 'Test Feature'
    });
    
    await feature.save();
    expect(feature.title).toBe('Test Feature');
    expect(feature.status).toBe('active');
  });
});
```

#### Integration Tests (Planned)

```javascript
// backend/src/routes/__tests__/feature.test.js
import request from 'supertest';
import app from '../../index.js';

describe('Feature API', () => {
  it('GET /api/feature should return features', async () => {
    const response = await request(app)
      .get('/api/feature')
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### Debugging

#### Backend Debugging

```javascript
// Add debug logging
import debug from 'debug';
const log = debug('mailo:feature');

log('Processing feature:', featureId);
```

#### Frontend Debugging

```javascript
// React DevTools
// Redux DevTools (if using Redux)
// Console logging
console.log('State:', state);
console.table(arrayData);
```

---

## 📡 API Documentation

### Authentication

#### POST `/api/auth/login`

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "domain": "example.com"
  }
}
```

#### GET `/api/auth/me`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "domain": "example.com",
  "twoFactorEnabled": false,
  "signature": "Best regards,\nJohn Doe"
}
```

### Messages

#### GET `/api/messages/:folderId`

Get messages in a folder.

**Query Parameters:**
- `q` - Search query (optional)
- `limit` - Number of messages (default: 50)
- `skip` - Pagination offset (default: 0)

**Response:**
```json
[
  {
    "_id": "msg123",
    "from": {
      "name": "John Doe",
      "address": "john@example.com"
    },
    "to": [
      {
        "name": "Jane Smith",
        "address": "jane@example.com"
      }
    ],
    "subject": "Meeting Tomorrow",
    "snippet": "Hi Jane, let's meet tomorrow at 10 AM...",
    "flags": {
      "read": false,
      "starred": false
    },
    "createdAt": "2025-11-25T10:00:00Z"
  }
]
```

#### POST `/api/messages/send`

Send an email.

**Request:**
```json
{
  "to": "recipient@example.com",
  "cc": "cc@example.com",
  "bcc": "bcc@example.com",
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "attachments": [],
  "scheduledAt": "2025-11-25T15:00:00Z"
}
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "scheduledAt": "2025-11-25T15:00:00Z",
  "message": "Email scheduled successfully"
}
```

### Calendar

#### GET `/api/calendar`

Get calendar events.

**Response:**
```json
[
  {
    "_id": "evt123",
    "title": "Team Meeting",
    "description": "Weekly sync",
    "startTime": "2025-11-25T14:00:00Z",
    "endTime": "2025-11-25T15:00:00Z",
    "location": "Conference Room A",
    "attendees": ["user1@example.com", "user2@example.com"],
    "reminder": 15
  }
]
```

#### POST `/api/calendar`

Create a calendar event.

**Request:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "startTime": "2025-11-25T14:00:00Z",
  "endTime": "2025-11-25T15:00:00Z",
  "location": "Conference Room A",
  "attendees": ["user1@example.com"],
  "reminder": 15
}
```

### Admin

#### GET `/api/admin/users`

Get all users (admin only).

**Response:**
```json
[
  {
    "_id": "user123",
    "email": "user@example.com",
    "role": "user",
    "domain": "example.com",
    "createdAt": "2025-11-01T00:00:00Z",
    "lastLogin": "2025-11-25T10:00:00Z"
  }
]
```

#### POST `/api/admin/users`

Create a new user (admin only).

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "user",
  "domain": "example.com"
}
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['user', 'domain_admin', 'super_admin']),
  domain: String (indexed),
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  signature: String,
  quota: Number,
  usedQuota: Number,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  folderId: ObjectId (ref: Folder, indexed),
  messageId: String (unique),
  from: {
    name: String,
    address: String
  },
  to: [{
    name: String,
    address: String
  }],
  cc: [{ name: String, address: String }],
  bcc: [{ name: String, address: String }],
  subject: String,
  text: String,
  html: String,
  snippet: String,
  attachments: [{
    filename: String,
    size: Number,
    contentType: String,
    path: String
  }],
  flags: {
    read: Boolean,
    starred: Boolean,
    flagged: Boolean
  },
  labels: [String],
  snoozedUntil: Date,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Calendar Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: String,
  description: String,
  startTime: Date (indexed),
  endTime: Date,
  location: String,
  attendees: [String],
  reminder: Number,
  recurrence: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚢 Deployment

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy with Docker

```bash
# 1. Clone repository
git clone https://github.com/limitlessinfotechsolution/mailo.git
cd mailo

# 2. Configure environment
cp .env.example .env
nano .env  # Edit configuration

# 3. Build and start
docker compose up -d

# 4. Check status
docker compose ps
docker compose logs -f
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend API port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `REDIS_URI` | Redis connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `MINIO_ENDPOINT` | MinIO endpoint | `localhost` |
| `MINIO_ACCESS_KEY` | MinIO access key | Required |
| `MINIO_SECRET_KEY` | MinIO secret key | Required |

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: 7-day expiration by default
- **Password Hashing**: bcrypt with 10 rounds
- **2FA**: TOTP-based (Google Authenticator compatible)
- **Role-Based Access**: User, Domain Admin, Super Admin

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for configuration
3. **Enable HTTPS** in production
4. **Implement rate limiting** on authentication endpoints
5. **Regular security audits** with `npm audit`
6. **Keep dependencies updated** via Dependabot
7. **Sanitize user inputs** to prevent injection attacks
8. **Use helmet.js** for HTTP headers security

### Vulnerability Scanning

```bash
# NPM audit
npm audit
npm audit fix

# Trivy scan (Docker images)
trivy image mailo-webmail:latest
trivy image mailo-backend:latest
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Message Convention

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Example:**
```
feat(calendar): add recurring events support

Implemented weekly, monthly, and yearly recurrence patterns
for calendar events with customizable end dates.

Closes #123
```

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance optimized

---

## 📄 License

**Copyright © 2025 Limitless Infotech Solution Pvt Ltd.**

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.

**Licensed Under:** Limitless Infotech Solution Pvt Ltd.

For licensing inquiries, contact: licensing@limitlessinfotech.com

---

## 📞 Support & Contact

**Developer Support:**
- Email: dev@limitlessinfotech.com
- Documentation: https://docs.mailo.io
- Issue Tracker: https://github.com/limitlessinfotechsolution/mailo/issues

**Organization:**
- Website: https://limitlessinfotech.com
- Email: info@limitlessinfotech.com

---

## 🗺️ Roadmap

### Current Version (v1.0.0)

- ✅ Core email functionality
- ✅ Webmail interface
- ✅ Calendar, Contacts, Tasks, Notes
- ✅ Email campaigns
- ✅ Admin panel
- ✅ CI/CD automation

### Upcoming Features (v1.1.0)

- [ ] End-to-end encryption (PGP/GPG)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced spam filtering
- [ ] Email templates
- [ ] Shared mailboxes
- [ ] Email rules and filters

### Future Enhancements (v2.0.0)

- [ ] AI-powered email categorization
- [ ] Video conferencing integration
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Plugin system

---

**Last Updated:** November 25, 2025  
**Document Version:** 1.0.0  
**Maintained By:** Limitless Infotech Solution Pvt Ltd.
