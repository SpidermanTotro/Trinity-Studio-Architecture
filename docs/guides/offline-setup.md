# Setting Up Offline Mode

This guide explains how to set up and run Trinity Studio Architecture in offline mode for solo or small group play.

## Overview

Offline mode allows you to run a private World of Warcraft server on your local machine or LAN without internet connectivity. This is perfect for:

- Solo gameplay and testing
- Small group (family/friends) servers
- Development and debugging
- Learning server administration

## Prerequisites

- Trinity Studio Architecture installed
- MySQL/MariaDB database server
- At least 8GB RAM (16GB recommended)
- 50GB+ free disk space
- WoW client matching your chosen expansion

## Initial Setup

### 1. Configure for Offline Mode

Create or edit `config/offline.json`:

```json
{
  "server": {
    "mode": "offline",
    "host": "127.0.0.1",
    "port": 8085,
    "realm": {
      "name": "My Offline Realm",
      "address": "127.0.0.1",
      "port": 8085
    }
  },
  "database": {
    "host": "localhost",
    "user": "trinity",
    "password": "trinity"
  },
  "features": {
    "aiDebugger": true,
    "liveReload": true,
    "levelScaling": true
  },
  "offline": {
    "autoSave": true,
    "saveInterval": 300000,
    "allowMultipleCharacters": true,
    "characterSlots": 50
  }
}
```

### 2. Initialize Offline Database

```bash
# Run the offline setup script
npm run setup:offline

# This will:
# - Create necessary databases
# - Set up default accounts
# - Configure realm settings
# - Import base world data
```

### 3. Create Admin Account

```bash
# Using the CLI tool
node scripts/create-account.js --username admin --password password --access 3

# Or manually via MySQL:
mysql -u trinity -p trinity_auth
```

```sql
INSERT INTO account (username, sha_pass_hash, expansion) 
VALUES ('admin', SHA1(CONCAT(UPPER('admin'), ':', UPPER('password'))), 2);

INSERT INTO account_access (id, gmlevel, RealmID) 
VALUES (LAST_INSERT_ID(), 3, -1);
```

## Starting the Server

### Standard Start

```bash
npm run start:offline
```

### With Live Reload (for development)

```bash
npm run dev -- --mode=offline
```

### Specific Expansion

```bash
# Start with only WotLK enabled
npm start -- --mode=offline --expansion=wotlk
```

## Client Configuration

### 1. Modify realmlist.wtf

Navigate to your WoW client folder and edit `Data/enUS/realmlist.wtf` (or appropriate locale):

```
set realmlist 127.0.0.1
```

### 2. Optional: Disable Warden (Anti-Cheat)

For smoother offline experience, you can disable Warden:

In `config/offline.json`:
```json
{
  "security": {
    "enableWarden": false
  }
}
```

## Character Management

### Creating Characters

1. Launch WoW client
2. Login with your admin account
3. Create characters normally

### GM Commands

Once in-game with a GM account, you can use various commands:

```
.help                    # List all commands
.character level 80      # Set your level to 80
.learn all               # Learn all spells
.modify money 1000000    # Add gold (in copper)
.teleport Ironforge      # Teleport to location
.appear PlayerName       # Teleport to player
.summon PlayerName       # Summon player to you
```

### Account Management

```bash
# List all accounts
node scripts/list-accounts.js

# Change account password
node scripts/change-password.js --username admin --password newpass

# Grant GM level
node scripts/set-gmlevel.js --username player --level 1
```

## Syncing with Online Server

If you want to transfer characters between offline and online mode:

### Offline to Online

```bash
# Export character data
npm run sync:to-online -- --character=CharacterName

# This will:
# - Validate character data
# - Check for exploits/modifications
# - Create encrypted backup
# - Prepare for import to online server
```

### Online to Offline

```bash
# Import character from online
npm run sync:to-offline -- --character=CharacterName

# Requires:
# - Character export file from online server
# - Valid authentication token
```

### Security Considerations

The sync system includes:
- Data integrity validation
- Anti-cheat verification
- Progress consistency checks
- Encryption of transferred data

## Performance Optimization

### For Solo Play

```json
{
  "performance": {
    "cacheEnabled": true,
    "cacheTTL": 7200,
    "workers": 1,
    "compression": false
  }
}
```

### For Small Group (2-10 players)

```json
{
  "performance": {
    "cacheEnabled": true,
    "cacheTTL": 3600,
    "workers": 2,
    "compression": true
  },
  "database": {
    "connectionLimit": 5
  }
}
```

### For LAN Party (10-50 players)

```json
{
  "performance": {
    "cacheEnabled": true,
    "cacheTTL": 1800,
    "workers": 4,
    "compression": true
  },
  "database": {
    "connectionLimit": 20
  }
}
```

## Customization

### Enable All Expansions

```bash
# Edit config/offline.json
{
  "expansions": {
    "vanilla": true,
    "tbc": true,
    "wotlk": true,
    "cataclysm": true,
    "mop": true,
    "wod": true,
    "legion": true,
    "bfa": true,
    "shadowlands": true,
    "dragonflight": true
  }
}
```

### Custom Rates

```json
{
  "rates": {
    "experience": 2.0,     # 2x XP gain
    "drop": 1.5,           # 1.5x drop rate
    "money": 2.0,          # 2x gold gain
    "reputation": 3.0      # 3x reputation gain
  }
}
```

### Enable Testing Features

```json
{
  "testing": {
    "instantMaxLevel": false,
    "unlockAllFlightPaths": true,
    "freeRespecs": true,
    "noDeathPenalty": true
  }
}
```

## Backup and Restore

### Automatic Backups

Configured in `config/offline.json`:

```json
{
  "backup": {
    "enabled": true,
    "interval": 86400000,  # Daily (in milliseconds)
    "location": "./backups",
    "retention": 7          # Keep 7 days of backups
  }
}
```

### Manual Backup

```bash
# Backup all databases
npm run backup:create

# Backup specific database
npm run backup:create -- --database=characters

# Backup includes:
# - Character data
# - World state
# - Configuration
# - Custom scripts
```

### Restore from Backup

```bash
# List available backups
npm run backup:list

# Restore latest backup
npm run backup:restore

# Restore specific backup
npm run backup:restore -- --file=backup-2024-12-09.sql
```

## Troubleshooting

### Server won't start

1. Check database connection:
```bash
mysql -u trinity -p
# Try connecting to verify credentials
```

2. Check port availability:
```bash
netstat -an | grep 8085
# Ensure port is not already in use
```

3. Check logs:
```bash
tail -f logs/combined.log
```

### Can't connect with client

1. Verify realmlist:
```bash
cat /path/to/wow/Data/enUS/realmlist.wtf
# Should show: set realmlist 127.0.0.1
```

2. Check firewall:
```bash
# Windows
netsh advfirewall firewall add rule name="Trinity" dir=in action=allow protocol=TCP localport=8085

# Linux
sudo ufw allow 8085/tcp
```

3. Verify server is running:
```bash
curl http://localhost:8085/health
```

### Character data lost

1. Check auto-save configuration
2. Restore from backup:
```bash
npm run backup:restore -- --type=characters
```

### Performance issues

1. Reduce worker count
2. Disable unnecessary expansions
3. Lower cache TTL
4. Check system resources:
```bash
# Check CPU and memory
top
# or
htop
```

## Advanced Configuration

### Custom Scripts

Place custom scripts in `src/expansions/[expansion]/scripts/`:

```javascript
// src/expansions/wotlk/scripts/custom-npc.js
export class CustomNPC {
  onGossipHello(player, npc) {
    player.sendGossipMenu("Hello, adventurer!");
  }
}
```

### Custom Quests

```bash
# Use the quest editor
npm run quest-editor

# Or edit directly in database
mysql -u trinity -p trinity_world
```

### Database Modifications

Always backup before modifying:

```bash
npm run backup:create

# Then modify
mysql -u trinity -p trinity_world < custom_changes.sql
```

## Network Play (LAN)

### Server Configuration

```json
{
  "server": {
    "host": "0.0.0.0",  # Listen on all interfaces
    "realm": {
      "address": "192.168.1.100"  # Your LAN IP
    }
  }
}
```

### Client Configuration

On other computers in your LAN, set `realmlist.wtf` to your server's LAN IP:

```
set realmlist 192.168.1.100
```

### Router Configuration (if needed)

Forward port 8085 TCP to your server's IP.

## Support

For issues or questions:

- Check [troubleshooting guide](troubleshooting.md)
- Review [FAQ](faq.md)
- Open an issue on GitHub
- Join our Discord community

## Next Steps

- [Configure expansions](expansion-configuration.md)
- [Use the Quest Editor](quest-editor.md)
- [Set up AI Debugger](ai-debugger.md)
- [Extract retail data](data-extraction.md)

---

**Happy adventuring in your offline realm!** 🎮
