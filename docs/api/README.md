# Trinity Studio Architecture - API Documentation

## Overview

Trinity Studio Architecture provides a comprehensive RESTful API and WebSocket interface for managing and monitoring the WoW emulator system.

## Base URL

```
http://localhost:8085/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Core Endpoints

### System Information

#### GET /api/info

Get system information and status.

**Response:**
```json
{
  "name": "Trinity Studio Architecture",
  "version": "1.0.0",
  "mode": "online",
  "expansions": ["vanilla", "tbc", "wotlk"],
  "features": {
    "aiDebugger": true,
    "liveReload": true,
    "levelScaling": true
  }
}
```

#### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-09T17:36:00.867Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Module Management

#### GET /api/modules

Get status of all loaded modules.

**Response:**
```json
{
  "vanilla": {
    "loaded": true,
    "version": "1.12.1",
    "name": "Classic/Vanilla"
  },
  "wotlk": {
    "loaded": true,
    "version": "3.3.5a",
    "name": "Wrath of the Lich King"
  }
}
```

#### POST /api/modules/:name/toggle

Toggle a specific expansion module.

**Parameters:**
- `name` (path): Module name (e.g., "vanilla", "wotlk")

**Response:**
```json
{
  "name": "wotlk",
  "enabled": false
}
```

### Live Reload

#### POST /api/reload/script/:scriptId

Reload a specific script without server restart.

**Parameters:**
- `scriptId` (path): Script identifier

**Response:**
```json
{
  "success": true,
  "message": "Script reloaded",
  "scriptId": "npc_12345",
  "timestamp": "2024-12-09T17:36:00.867Z"
}
```

## AI Debugger API

### GET /api/debugger/status

Get debugger system status.

**Response:**
```json
{
  "status": "online",
  "uptime": 7200,
  "monitors": {
    "npc": {
      "activeNPCs": 150,
      "errors": 2
    },
    "quest": {
      "validated": 1234,
      "errors": 5
    },
    "script": {
      "analyzed": 89,
      "issues": 3
    }
  }
}
```

### GET /api/debugger/metrics

Get current system metrics.

**Response:**
```json
{
  "activePlayers": 25,
  "cpuUsage": 45.2,
  "memoryUsage": 2048.5,
  "timestamp": "2024-12-09T17:36:00.867Z"
}
```

### GET /api/debugger/npcs

Get tracked NPC data.

**Query Parameters:**
- `limit` (optional): Maximum number of results (default: 100)

**Response:**
```json
[
  {
    "id": 12345,
    "name": "Example NPC",
    "state": "idle",
    "position": { "x": 100, "y": 200, "z": 50 },
    "lastUpdate": "2024-12-09T17:36:00.867Z"
  }
]
```

### GET /api/debugger/quests/errors

Get quest validation errors.

**Response:**
```json
[
  {
    "questId": 1234,
    "errors": [
      {
        "field": "objectives",
        "message": "Quest must have at least one objective"
      }
    ],
    "timestamp": "2024-12-09T17:36:00.867Z"
  }
]
```

### GET /api/debugger/scripts/issues

Get script analysis issues.

**Response:**
```json
[
  {
    "scriptId": "spell_12345",
    "issues": [
      {
        "type": "performance",
        "severity": "medium",
        "message": "Script is very long, consider splitting into modules"
      }
    ],
    "timestamp": "2024-12-09T17:36:00.867Z"
  }
]
```

### GET /api/debugger/logs

Get system logs.

**Query Parameters:**
- `level` (optional): Filter by log level (error, warn, info, debug)
- `limit` (optional): Maximum number of results (default: 100)

**Response:**
```json
[
  {
    "level": "info",
    "message": "Server started successfully",
    "timestamp": "2024-12-09T17:36:00.867Z"
  }
]
```

## WebSocket API

### Connection

```javascript
const ws = new WebSocket('ws://localhost:8085');

ws.onopen = () => {
  console.log('Connected to Trinity Studio');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Message Types

#### Ping/Pong

```javascript
// Send ping
ws.send(JSON.stringify({ type: 'ping' }));

// Receive pong
{
  "type": "pong",
  "timestamp": "2024-12-09T17:36:00.867Z"
}
```

#### Subscribe to Channel

```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  payload: {
    channel: 'metrics'
  }
}));
```

#### Real-time Events

```javascript
{
  "type": "event",
  "channel": "metrics",
  "data": {
    "cpuUsage": 45.2,
    "memoryUsage": 2048.5
  },
  "timestamp": "2024-12-09T17:36:00.867Z"
}
```

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes
- **Headers**: Rate limit info is included in response headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Get system info
const response = await axios.get('http://localhost:8085/api/info');
console.log(response.data);

// Reload script
await axios.post('http://localhost:8085/api/reload/script/npc_12345', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

### Python

```python
import requests

# Get system info
response = requests.get('http://localhost:8085/api/info')
data = response.json()
print(data)

# Reload script
headers = {'Authorization': 'Bearer YOUR_JWT_TOKEN'}
response = requests.post(
    'http://localhost:8085/api/reload/script/npc_12345',
    headers=headers
)
```

### cURL

```bash
# Get system info
curl http://localhost:8085/api/info

# Reload script
curl -X POST http://localhost:8085/api/reload/script/npc_12345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get debugger status
curl http://localhost:8085/api/debugger/status
```

## SDK Libraries

Official SDKs are available for popular languages:

- **JavaScript**: `npm install @trinity-studio/sdk`
- **Python**: `pip install trinity-studio-sdk`
- **PHP**: `composer require trinity-studio/sdk`

## Webhook Support

Configure webhooks to receive real-time notifications:

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["player.login", "server.error", "quest.complete"],
  "secret": "your-webhook-secret"
}
```

## API Versioning

The API follows semantic versioning. Version is included in response headers:

```
X-API-Version: 1.0.0
```

## Support

For API support:
- [GitHub Issues](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/issues)
- [Documentation](https://trinity-studio.example.com/docs)
- [Discord Community](https://discord.gg/trinity-studio)

---

**Last Updated**: 2024-12-09
