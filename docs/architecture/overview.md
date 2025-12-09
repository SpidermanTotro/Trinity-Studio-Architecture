# Trinity Studio Architecture - System Architecture

## Overview

Trinity Studio Architecture is built on a modular, scalable architecture designed to support multiple World of Warcraft expansions simultaneously while providing advanced debugging, monitoring, and live programming capabilities.

## Core Architecture Principles

### 1. Modularity
- Each expansion is an independent, pluggable module
- Modules can be enabled/disabled without affecting others
- Shared core services used by all modules

### 2. Scalability
- Horizontal scaling support
- Database connection pooling
- Efficient resource management
- Caching layers

### 3. Maintainability
- Clear separation of concerns
- Consistent coding standards
- Comprehensive logging
- Extensive documentation

### 4. Extensibility
- Plugin system for custom features
- Event-driven architecture
- Hooks and callbacks
- API-first design

## System Components

### Core System

```
┌─────────────────────────────────────────────────┐
│              Core System Layer                  │
├─────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐          │
│  │  Config Mgr   │  │  Module Loader│          │
│  └───────────────┘  └───────────────┘          │
│  ┌───────────────┐  ┌───────────────┐          │
│  │  Database Mgr │  │  Logger       │          │
│  └───────────────┘  └───────────────┘          │
└─────────────────────────────────────────────────┘
```

#### Configuration Manager
- Loads and validates configuration files
- Manages environment variables
- Handles runtime configuration updates
- Supports multiple configuration sources

#### Module Loader
- Dynamically loads expansion modules
- Manages module lifecycle
- Handles dependencies between modules
- Provides module isolation

#### Database Manager
- Manages database connections
- Connection pooling
- Query optimization
- Transaction management
- Multi-database support (auth, characters, world)

#### Logger
- Centralized logging system
- Multiple log levels (error, warn, info, debug)
- File and console output
- Log rotation and archival

### Expansion Modules

Each expansion module follows a consistent interface:

```javascript
class ExpansionModule {
  constructor(config)
  async initialize()
  async loadContent()
  getInfo()
  shutdown()
}
```

#### Module Structure
```
src/expansions/[expansion-name]/
├── index.js              # Main module entry point
├── content/              # Expansion-specific content
│   ├── zones.js
│   ├── npcs.js
│   ├── quests.js
│   ├── items.js
│   └── spells.js
├── scripts/              # Custom scripts
│   ├── npc-scripts.js
│   ├── quest-scripts.js
│   └── spell-scripts.js
└── data/                 # Static data files
    └── metadata.json
```

### AI Debugger System

```
┌─────────────────────────────────────────────────┐
│              AI Debugger System                 │
├─────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐          │
│  │  NPC Monitor  │  │  Quest Valid. │          │
│  └───────────────┘  └───────────────┘          │
│  ┌───────────────┐  ┌───────────────┐          │
│  │ Script Analyzer│  │ Metrics Coll. │          │
│  └───────────────┘  └───────────────┘          │
│  ┌─────────────────────────────────┐            │
│  │     Admin Dashboard (Web UI)     │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

#### Components

**NPC Monitor**
- Tracks active NPCs
- Monitors AI behavior
- Detects pathfinding issues
- Reports errors in real-time

**Quest Validator**
- Validates quest chains
- Checks quest objectives
- Verifies rewards and requirements
- Detects broken quests

**Script Analyzer**
- Static analysis of scripts
- Performance profiling
- Security checks
- Best practice validation

**Metrics Collector**
- System performance metrics
- Player activity tracking
- Resource usage monitoring
- Custom metrics support

**Admin Dashboard**
- Real-time monitoring interface
- Error log viewer
- Performance graphs
- System status indicators

### Data Extraction System

```
┌─────────────────────────────────────────────────┐
│          Data Extraction Pipeline               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Retail Client → Parser → Transformer → Output │
│                     ↓           ↓               │
│                 Validator  Standardizer         │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Extraction Flow

1. **Client Data Parser**: Reads retail WoW client files
2. **Data Validator**: Validates extracted data
3. **Transformer**: Converts to standard format
4. **Standardizer**: Adapts for TrinityCore
5. **Output**: Saves to database or files

#### Supported Data Types
- Zones and areas
- NPCs and creatures
- Quests and objectives
- Items and equipment
- Spells and abilities
- Game objects

### Live Programming Interface

```
┌─────────────────────────────────────────────────┐
│        Live Programming System                  │
├─────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐          │
│  │ File Watcher  │→│ Hot-Swap Mgr  │          │
│  └───────────────┘  └───────────────┘          │
│         ↓                   ↓                   │
│  ┌───────────────┐  ┌───────────────┐          │
│  │ Script Reload │  │ Process View  │          │
│  └───────────────┘  └───────────────┘          │
└─────────────────────────────────────────────────┘
```

#### Features

**File Watcher**
- Monitors script directories
- Detects file changes
- Triggers reload events

**Hot-Swap Manager**
- Swaps scripts without restart
- Validates new scripts
- Rollback support

**Script Reloader**
- Reloads modified scripts
- Maintains state where possible
- Notifies dependent systems

**Process Viewer**
- Live combat log viewer
- NPC behavior tracking
- Internal process monitoring

### Offline/Online Sync System

```
┌─────────────────────────────────────────────────┐
│          Synchronization System                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Offline Server ←→ Sync Engine ←→ Online Server │
│                         ↓                       │
│                  Validation &                   │
│                  Encryption                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Sync Components

**Character Data Sync**
- Progress synchronization
- Inventory management
- Achievement tracking
- Quest completion

**Security**
- Data encryption
- Integrity validation
- Anti-cheat measures
- Audit logging

## Data Flow

### Request Flow

```
Client Request
    ↓
Express Server
    ↓
Route Handler
    ↓
Module Controller
    ↓
Database Manager
    ↓
Response
```

### Event Flow

```
Game Event
    ↓
Event Emitter
    ↓
Event Listeners
    ├→ AI Debugger
    ├→ Metrics Collector
    ├→ Logger
    └→ Module Handlers
```

## Database Schema

### Multi-Database Architecture

```
trinity_auth          # Authentication data
├── accounts
├── account_access
└── session_keys

trinity_characters    # Character data
├── characters
├── character_inventory
├── character_skills
└── character_quests

trinity_world         # World data
├── creature
├── creature_template
├── gameobject
├── quest_template
└── item_template
```

### Per-Expansion Databases

Each expansion can have its own world database:
- `trinity_world_vanilla`
- `trinity_world_tbc`
- `trinity_world_wotlk`
- etc.

## API Architecture

### RESTful API Design

```
/api
├── /info              # System information
├── /modules           # Module management
│   └── /:name/toggle  # Toggle module
├── /reload            # Hot-reload endpoints
│   └── /script/:id    # Reload specific script
└── /debugger          # AI Debugger API
    ├── /status        # System status
    ├── /metrics       # Performance metrics
    ├── /npcs          # NPC data
    ├── /quests        # Quest data
    └── /logs          # System logs
```

### WebSocket API

```
ws://host:port
├── ping/pong          # Connection health
├── subscribe          # Subscribe to channels
├── events             # Real-time events
└── metrics            # Live metrics stream
```

## Security Architecture

### Multi-Layer Security

1. **Network Layer**
   - Rate limiting
   - DDoS protection
   - IP whitelisting

2. **Application Layer**
   - JWT authentication
   - RBAC authorization
   - Input validation

3. **Data Layer**
   - SQL injection prevention
   - Prepared statements
   - Data encryption

4. **Transfer Layer**
   - HTTPS/WSS
   - End-to-end encryption
   - Secure character sync

## Performance Optimization

### Caching Strategy

```
┌─────────────────────────────────────────────────┐
│            Caching Architecture                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Application Cache (In-Memory)                  │
│         ↓                                       │
│  Database Query Cache                           │
│         ↓                                       │
│  Static Content CDN                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Load Balancing

```
              Load Balancer
                   ↓
       ┌──────────┬──────────┬──────────┐
       ↓          ↓          ↓          ↓
    Server 1  Server 2  Server 3  Server 4
       ↓          ↓          ↓          ↓
              Database Cluster
```

## Deployment Architecture

### Development Environment
- Single server
- SQLite or MySQL
- Hot-reload enabled
- Debug logging

### Production Environment
- Multi-server cluster
- MySQL cluster with replication
- Load balancer
- Production logging
- Monitoring and alerts

### Docker Deployment

```yaml
services:
  - trinity-server (multiple instances)
  - mysql-master
  - mysql-slaves (replicas)
  - redis (caching)
  - nginx (load balancer)
```

## Monitoring and Observability

### Metrics Collection
- Server performance
- Database queries
- API response times
- Error rates
- Player activity

### Logging
- Centralized log aggregation
- Log levels and filtering
- Log rotation
- Real-time log streaming

### Alerting
- Performance thresholds
- Error rate spikes
- Resource exhaustion
- Security events

## Future Architecture Enhancements

### Planned Improvements
1. Microservices architecture
2. Service mesh implementation
3. GraphQL API layer
4. Machine learning integration
5. Real-time analytics
6. Cloud-native deployment
7. Kubernetes orchestration
8. Distributed tracing

---

For more detailed information on specific components, see:
- [API Documentation](../api/README.md)
- [Development Guide](../guides/development.md)
- [Deployment Guide](../deployment/README.md)
