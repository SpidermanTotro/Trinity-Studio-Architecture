# Trinity Studio Architecture

**A Complete World of Warcraft Emulator System Supporting All Expansions**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/SpidermanTotro/Trinity-Studio-Architecture)

Trinity Studio Architecture is a comprehensive, modular emulator framework designed to support every World of Warcraft expansion from Vanilla through Retail (Dragonflight and beyond). This system provides real-time AI debugging, retail data extraction, live programming capabilities, and seamless offline/online mode support.

## 🌟 Key Features

### Core Capabilities
- **Modular Expansion System**: Each WoW expansion (Vanilla, TBC, WotLK, Cataclysm, MoP, WoD, Legion, BfA, Shadowlands, Dragonflight) runs independently or as interconnected modules
- **Expansion Toggles**: Enable/disable specific expansions on demand
- **Retail Data Extraction**: Extract and transform data from retail WoW versions
- **Real-time AI Debugger**: Monitor NPCs, dungeons, quests, and scripts with live error detection
- **Live Programming Interface**: Hot-swap scripts without server restarts
- **Offline/Online Sync**: Seamless character progression between modes
- **Enhanced Player Experience**: Dynamic level scaling, custom quests, and modernized features

### Advanced Tools
- **Admin Dashboard**: Web-based interface for monitoring server health, player activity, and error logs
- **Quest/NPC Editor**: Visual editors for easy content customization
- **Combat Log Analyzer**: Real-time analysis of combat mechanics
- **Data Transformation Pipeline**: Standardize retail data for TrinityCore compatibility

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- Python >= 3.9
- MySQL/MariaDB >= 10.6
- Git

### Basic Installation

```bash
# Clone the repository
git clone https://github.com/SpidermanTotro/Trinity-Studio-Architecture.git
cd Trinity-Studio-Architecture

# Install dependencies
npm install

# Configure your setup
cp config/default.example.json config/default.json
# Edit config/default.json with your settings

# Initialize the database
npm run db:init

# Start the server
npm start
```

## 🏗️ Architecture Overview

Trinity Studio Architecture is built on a modular, scalable design:

```
Trinity Studio Architecture
│
├── Core System
│   ├── Module Loader
│   ├── Configuration Manager
│   └── Database Abstraction
│
├── Expansion Modules
│   ├── Vanilla (1.x)
│   ├── The Burning Crusade (2.x)
│   ├── Wrath of the Lich King (3.x)
│   ├── Cataclysm (4.x)
│   ├── Mists of Pandaria (5.x)
│   ├── Warlords of Draenor (6.x)
│   ├── Legion (7.x)
│   ├── Battle for Azeroth (8.x)
│   ├── Shadowlands (9.x)
│   └── Dragonflight (10.x+)
│
├── AI Debugger
│   ├── NPC Behavior Monitor
│   ├── Quest Validator
│   ├── Script Analyzer
│   └── Admin Dashboard
│
├── Data Extraction Tools
│   ├── Retail Client Parser
│   ├── Data Transformer
│   └── Import/Export Utilities
│
├── Live Programming Interface
│   ├── Hot-Swap System
│   ├── Script Reloader
│   └── Live Process Viewer
│
└── Player Experience
    ├── Level Scaling Engine
    ├── Quest Editor
    ├── NPC Editor
    └── Custom Content Framework
```

## 📦 Installation

### Detailed Setup Guide

1. **System Requirements**
   - CPU: 4+ cores recommended
   - RAM: 8GB minimum, 16GB+ recommended
   - Storage: 50GB+ for full expansion support
   - OS: Linux (recommended), Windows, macOS

2. **Database Setup**
   ```bash
   # Create databases
   mysql -u root -p < scripts/create_databases.sql
   
   # Import base data
   npm run db:import
   ```

3. **Expansion Configuration**
   ```bash
   # Enable specific expansions
   npm run config:expansions
   ```

4. **First Run**
   ```bash
   # Start with default configuration
   npm start
   
   # Or start specific expansion
   npm run start:wotlk
   ```

## ⚙️ Configuration

### Expansion Toggles

Edit `config/expansions.json` to enable/disable expansions:

```json
{
  "vanilla": true,
  "tbc": true,
  "wotlk": true,
  "cataclysm": false,
  "mop": false,
  "wod": false,
  "legion": false,
  "bfa": false,
  "shadowlands": false,
  "dragonflight": false
}
```

### Server Configuration

Main configuration in `config/default.json`:

```json
{
  "server": {
    "port": 8085,
    "host": "0.0.0.0",
    "mode": "online"
  },
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "trinity",
    "password": "trinity"
  },
  "features": {
    "aiDebugger": true,
    "liveReload": true,
    "levelScaling": true
  }
}
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architecture Guide](docs/architecture/overview.md)** - System design and components
- **[API Documentation](docs/api/README.md)** - API reference and endpoints
- **[Deployment Guide](docs/deployment/README.md)** - Production deployment instructions
- **[Developer Guide](docs/guides/development.md)** - Contributing and development setup
- **[Offline Mode Guide](docs/guides/offline-setup.md)** - Setting up offline servers
- **[Data Extraction Guide](docs/guides/data-extraction.md)** - Extracting retail WoW data
- **[AI Debugger Guide](docs/guides/ai-debugger.md)** - Using the debugging tools

## 🔧 Development

### Project Structure

```
Trinity-Studio-Architecture/
├── src/                      # Source code
│   ├── core/                 # Core system components
│   ├── expansions/           # Expansion modules
│   ├── ai-debugger/          # AI debugging system
│   ├── data-extraction/      # Data extraction tools
│   ├── live-programming/     # Live reload & hot-swap
│   ├── sync/                 # Offline/online sync
│   └── player-experience/    # Player enhancement features
├── tools/                    # Development tools
│   ├── data-extraction/      # Data extraction utilities
│   ├── quest-editor/         # Quest editor GUI
│   ├── npc-editor/           # NPC editor GUI
│   └── debugger-dashboard/   # Admin dashboard
├── config/                   # Configuration files
├── docs/                     # Documentation
├── tests/                    # Test suites
├── scripts/                  # Utility scripts
└── .github/                  # GitHub Actions CI/CD
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:core
npm run test:expansions
npm run test:integration

# Run with coverage
npm run test:coverage
```

### Building

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Watch mode
npm run build:watch
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Ensure CI/CD passes

## 🎮 Features In-Depth

### AI Debugger

The real-time AI debugger provides:
- **NPC Behavior Tracking**: Monitor AI decisions and pathfinding
- **Quest Validation**: Automatic quest chain verification
- **Script Analysis**: Detect script errors before runtime
- **Performance Metrics**: Real-time server performance data
- **Admin Dashboard**: Web UI for system monitoring

Access at: `http://localhost:8085/debugger`

### Data Extraction

Extract data from retail WoW clients:
```bash
# Extract all data
npm run extract:all

# Extract specific data
npm run extract:zones
npm run extract:npcs
npm run extract:quests
npm run extract:items
```

### Live Programming

Update scripts without restarting:
```bash
# Enable live reload
npm run dev:live

# Or use the API
curl -X POST http://localhost:8085/api/reload/script/npc_12345
```

### Offline Mode

Set up a local server for solo/small group play:
```bash
# Generate offline configuration
npm run setup:offline

# Start offline server
npm run start:offline

# Sync to online (when ready)
npm run sync:to-online
```

## 📊 Performance & Scalability

Trinity Studio Architecture is designed for:
- **Small Servers**: 1-50 concurrent players
- **Medium Servers**: 50-500 concurrent players
- **Large Servers**: 500-5000+ concurrent players

Performance optimizations include:
- Modular loading (only load enabled expansions)
- Database query optimization
- Caching layers
- Load balancing support
- Horizontal scaling capabilities

## 🔒 Security

- Secure character transfer mechanisms
- Data integrity validation
- SQL injection protection
- Rate limiting
- Authentication & authorization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TrinityCore team for the foundational emulator framework
- WoW emulation community for continuous support
- Contributors and testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/discussions)
- **Documentation**: [Wiki](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/wiki)

## 🗺️ Roadmap

### Current Version (1.0.0)
- ✅ Core modular system
- ✅ Basic expansion support
- ✅ AI debugger framework
- ✅ Data extraction tools

### Upcoming (1.1.0)
- 🔄 Enhanced level scaling
- 🔄 Advanced quest editor
- 🔄 Performance optimizations
- 🔄 Extended retail support

### Future (2.0.0)
- 📅 Machine learning for AI improvements
- 📅 Cloud deployment templates
- 📅 Multi-realm support
- 📅 Enhanced graphics modernization

---

**Made with ❤️ by the Trinity Studio Architecture team**
