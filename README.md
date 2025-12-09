# Trinity Studio Architecture

**SKELETON IMPLEMENTATION - MVP Version**

Trinity Studio is an AI-powered development automation platform for TrinityCore WoW server development. This repository contains the minimal viable product (MVP) skeleton that demonstrates the core automation loop:

**Runtime Reporting → AI Suggestions → PR Composition → CI/Playtest**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Trinity Studio MVP                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  TrinityCore Plugin (C++)                                    │
│  ├─ Reports unknown packets                                 │
│  ├─ Sends runtime data to DevHub                            │
│  └─ Applies AI-suggested patches                            │
│                         │                                    │
│                         ▼                                    │
│  DevHub (Docker Compose)                                     │
│  ├─ PostgreSQL (task storage)                               │
│  ├─ Redis (caching & queues)                                │
│  ├─ API Service (Node.js/TypeScript)                        │
│  │   ├─ Task management                                     │
│  │   └─ GitHub PR composition                               │
│  └─ AI Helper Service (TypeScript)                          │
│      ├─ Code suggestions                                    │
│      ├─ Opcode analysis                                     │
│      └─ Chat assistance                                     │
│                         │                                    │
│                         ▼                                    │
│  DevStudio (Electron)                                        │
│  └─ Desktop interface for DevHub                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Docker & Docker Compose** (for local DevHub services)
- **C++ Compiler** (GCC/Clang for TrinityCore plugin)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SpidermanTotro/Trinity-Studio-Architecture.git
   cd Trinity-Studio-Architecture
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

### Running Locally

#### Option 1: Run with Docker Compose (Recommended)

```bash
# Start all DevHub services (Postgres, Redis, API, AI Helper)
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

Services will be available at:
- **API**: http://localhost:3000
- **AI Helper**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

#### Option 2: Run Services Individually (Development)

```bash
# Terminal 1: Start API
npm run dev:api

# Terminal 2: Start AI Helper
npm run dev:ai-helper

# Terminal 3: Start Electron Studio (launches all services)
npm run dev:studio
```

#### Option 3: Run Electron DevStudio (Auto-starts services)

```bash
npm run dev
```

This will:
1. Start the API service on port 3000
2. Start the AI Helper service on port 3001
3. Launch Electron window pointing to the API

### Building for Production

```bash
# Build all services
npm run build

# Build individual services
npm run build:api
npm run build:ai-helper
```

---

## 📁 Repository Structure

```
Trinity-Studio-Architecture/
├── trinity-core-dev/              # TrinityCore Plugin (C++)
│   ├── TrinityStudioPlugin.h     # Plugin header
│   └── TrinityStudioPlugin.cpp   # Plugin implementation (stub)
│
├── devhub/                        # DevHub Services
│   ├── docker-compose.yml        # Docker orchestration
│   ├── api/                      # API Service (Node.js + TypeScript)
│   │   ├── src/
│   │   │   └── index.ts         # Express server with endpoints
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   └── ai-helper/                # AI Helper Service (TypeScript)
│       ├── src/
│       │   └── index.ts         # AI endpoints with placeholders
│       ├── package.json
│       ├── tsconfig.json
│       └── Dockerfile
│
├── devstudio/                     # Electron Desktop App
│   ├── main.js                   # Electron main process
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── mvp-ci.yml           # CI workflow for PR builds
│
├── package.json                  # Root workspace configuration
└── README.md                     # This file
```

---

## 🔌 TrinityCore Plugin

### Building the Plugin

```bash
cd trinity-core-dev

# Compile (example with g++)
g++ -std=c++17 -c TrinityStudioPlugin.cpp -o TrinityStudioPlugin.o

# Note: Actual integration with TrinityCore requires linking against
# TrinityCore libraries and registering as a server plugin
```

### Plugin API Methods

- `OnStudioRegister()` - Register plugin with DevHub on server startup
- `ReportUnknownPacket(packetHex)` - Send unknown packet data to DevHub for AI analysis
- `ApplySuggestedPatch(filePath, patch)` - Apply AI-generated code patches
- `RequestServerSnapshot()` - Capture current server state for debugging

### Environment Variables

Set `DEVHUB_API_URL` to point to your DevHub API:
```bash
export DEVHUB_API_URL=http://localhost:3000
```

---

## 🌐 DevHub API Endpoints

### API Service (Port 3000)

- **GET /** - Health check / status
- **GET /health** - Detailed health check
- **POST /tasks** - Create automation task
  ```json
  {
    "type": "unknown_packet",
    "data": { "packetHex": "..." },
    "timestamp": 1234567890
  }
  ```
- **POST /github/create-pr** - Create GitHub pull request
  ```json
  {
    "owner": "repo-owner",
    "repo": "repo-name",
    "branchName": "feature/new-feature",
    "title": "PR Title",
    "body": "PR Description",
    "changes": [
      { "path": "file.cpp", "content": "..." }
    ]
  }
  ```

### AI Helper Service (Port 3001)

- **GET /** - Health check / status
- **POST /chat** - Chat with AI assistant
  ```json
  {
    "messages": [
      { "role": "user", "content": "How do I implement opcode 0x123?" }
    ],
    "context": "TrinityCore development"
  }
  ```
- **POST /code-suggest** - Get code suggestions
  ```json
  {
    "prompt": "Implement packet handler for opcode 0x123",
    "language": "cpp",
    "file": "WorldSession.cpp"
  }
  ```
- **POST /opcode-analyze** - Analyze unknown packet
  ```json
  {
    "packetHex": "0A1B2C3D...",
    "direction": "client_to_server"
  }
  ```

---

## 🔐 Security & Secrets Management

### ⚠️ IMPORTANT: Do NOT Commit Secrets!

This is a skeleton implementation with placeholder values. **Never commit real API keys, passwords, or private keys to the repository.**

### Recommended Secrets Management

#### For Local Development

Create a `.env` file in `devhub/api/` and `devhub/ai-helper/`:

```bash
# devhub/api/.env
DATABASE_URL=postgresql://trinity_user:YOUR_PASSWORD@localhost:5432/trinity_devhub
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem
GITHUB_APP_INSTALLATION_ID=your_installation_id

# devhub/ai-helper/.env
OPENAI_API_KEY=sk-your-real-key-here
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

**Add `.env` to `.gitignore`** (already configured)

#### For Production

Use one of:
- **GitHub Secrets** (for GitHub Actions)
- **HashiCorp Vault**
- **AWS Secrets Manager**
- **Azure Key Vault**
- **Docker Secrets**

### PII Redaction

The AI Helper service includes basic PII redaction for:
- Email addresses
- IP addresses
- Player names (heuristic-based)

**Always review data before sending to external LLMs!**

Set `ENABLE_PII_REDACTION=true` in production.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run API tests only
npm run test --workspace=devhub/api

# Run AI Helper tests only
npm run test --workspace=devhub/ai-helper
```

**Note**: Tests are skeleton implementations in MVP. Expand with proper test coverage.

---

## 🔄 GitHub Actions CI

The repository includes a CI workflow (`.github/workflows/mvp-ci.yml`) that:
- Runs on pull requests
- Installs dependencies
- Builds API and AI Helper services
- Runs tests

**No secrets are included in the workflow file.** Configure GitHub Secrets for production CI/CD.

---

## 📊 Development Workflow

1. **TrinityCore Plugin** reports runtime data (unknown packets, errors)
2. **DevHub API** receives reports and creates tasks
3. **AI Helper** analyzes data and generates suggestions
4. **DevHub API** composes GitHub PR with suggested changes
5. **CI Pipeline** builds and tests changes
6. **Manual Review** and merge (playtest validation)

---

## 🛠️ Troubleshooting

### Docker Compose issues

```bash
# Reset all containers and volumes
npm run docker:down
docker volume prune
npm run docker:up
```

### Port conflicts

If ports 3000, 3001, 5432, or 6379 are in use, modify `docker-compose.yml` or stop conflicting services.

### Node.js version

Ensure Node.js >= 18.0.0:
```bash
node --version
```

### TypeScript build errors

```bash
# Clean and rebuild
npm run clean --workspace=devhub/api
npm run build --workspace=devhub/api
```

---

## 🗺️ Roadmap (Post-MVP)

- [ ] Implement real GitHub App authentication
- [ ] Add PostgreSQL schema and migrations
- [ ] Implement Redis task queue processing
- [ ] Add real LLM integration (OpenAI/Anthropic)
- [ ] Build frontend UI for DevStudio
- [ ] Add comprehensive test coverage
- [ ] Implement authentication & authorization
- [ ] Add webhook handlers for GitHub events
- [ ] Implement playtest automation
- [ ] Add monitoring and observability

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

This is a skeleton MVP. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit pull request

---

## ⚡ Quick Reference

```bash
# Development
npm run dev                  # Start everything with Electron
npm run dev:api             # Just API
npm run dev:ai-helper       # Just AI Helper

# Docker
npm run docker:up           # Start all services
npm run docker:down         # Stop all services
npm run docker:logs         # View logs

# Building
npm run build              # Build all
npm run build:api          # Build API only
npm run build:ai-helper    # Build AI Helper only

# Testing
npm test                   # Run all tests
```

---

**Note**: This is a SKELETON implementation. All placeholders must be replaced with real implementations before production use. See individual service READMEs for more details.
