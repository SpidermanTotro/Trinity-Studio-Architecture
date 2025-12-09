# Data Extraction Guide

This guide explains how to extract data from retail World of Warcraft clients and import it into Trinity Studio Architecture.

## Overview

The data extraction tools allow you to:
- Extract zones, NPCs, quests, items, and spells from retail clients
- Transform retail data into TrinityCore-compatible format
- Import extracted data into your server

## Prerequisites

- Retail WoW client installed
- Node.js >= 18.x
- Sufficient disk space (extracted data can be large)
- Trinity Studio Architecture installed

## Configuration

### 1. Set Retail Client Path

Edit `config/default.json`:

```json
{
  "dataExtraction": {
    "retailClientPath": "C:/Program Files (x86)/World of Warcraft/_retail_",
    "outputDirectory": "data/extracted",
    "enableAutoImport": false,
    "transformers": {
      "zones": true,
      "npcs": true,
      "quests": true,
      "items": true,
      "spells": true
    }
  }
}
```

### 2. Verify Client Files

Ensure your retail client has the following directories:
- `DBFilesClient/` - Contains DBC files
- `Interface/` - Contains interface data
- `Data/` - Contains MPQ archives

## Extraction Process

### Extract All Data

```bash
npm run extract:all
```

This will extract all supported data types.

### Extract Specific Data Types

#### Zones and Areas

```bash
npm run extract:zones
```

Extracts:
- Zone information (names, levels, faction)
- Area data
- Map coordinates
- Exploration data

Output: `data/extracted/zones.json`

#### NPCs and Creatures

```bash
npm run extract:npcs
```

Extracts:
- Creature templates
- NPC names and titles
- Level ranges
- Faction information
- Vendor data
- Trainer data

Output: `data/extracted/npcs.json`

#### Quests

```bash
npm run extract:quests
```

Extracts:
- Quest templates
- Quest objectives
- Quest chains
- Rewards
- Requirements

Output: `data/extracted/quests.json`

#### Items

```bash
npm run extract:items
```

Extracts:
- Item templates
- Stats and bonuses
- Requirements
- Item sets
- Vendor prices

Output: `data/extracted/items.json`

#### Spells and Abilities

```bash
npm run extract:spells
```

Extracts:
- Spell data
- Effects
- Requirements
- Cooldowns

Output: `data/extracted/spells.json`

## Data Transformation

After extraction, data needs to be transformed for TrinityCore compatibility.

### Automatic Transformation

The extraction tools automatically transform data using built-in transformers:

```javascript
// Example transformation
{
  "retail": {
    "npc_id": 12345,
    "display_id": 54321,
    "name": "Example NPC"
  },
  "trinity": {
    "entry": 12345,
    "modelid1": 54321,
    "name": "Example NPC",
    "subname": "",
    "minlevel": 80,
    "maxlevel": 80
  }
}
```

### Custom Transformers

Create custom transformers in `tools/data-extraction/transformers/`:

```javascript
export class CustomTransformer {
  transform(retailData) {
    return {
      // Your transformation logic
    };
  }
}
```

## Importing Data

### Manual Import

```bash
# Import zones
node tools/data-extraction/import.js --type=zones --file=data/extracted/zones.json

# Import NPCs
node tools/data-extraction/import.js --type=npcs --file=data/extracted/npcs.json

# Import quests
node tools/data-extraction/import.js --type=quests --file=data/extracted/quests.json
```

### Auto-Import

Enable auto-import in configuration:

```json
{
  "dataExtraction": {
    "enableAutoImport": true
  }
}
```

With auto-import enabled, data is automatically imported after extraction.

## File Formats

### Zone Data Format

```json
{
  "zones": [
    {
      "id": 1,
      "name": "Dun Morogh",
      "areaType": 0,
      "flags": 0,
      "minLevel": 1,
      "maxLevel": 10,
      "faction": 0
    }
  ]
}
```

### NPC Data Format

```json
{
  "npcs": [
    {
      "entry": 1,
      "name": "Hogger",
      "subname": "The Gnoll King",
      "minlevel": 11,
      "maxlevel": 11,
      "faction": 14,
      "npcflag": 0,
      "rank": 2
    }
  ]
}
```

### Quest Data Format

```json
{
  "quests": [
    {
      "id": 1,
      "title": "A New Threat",
      "objectives": "Kill 10 Murlocs",
      "level": 5,
      "minLevel": 3,
      "questLevel": 5,
      "type": 0,
      "requiredRaces": 0,
      "requiredClasses": 0,
      "rewardXP": 250,
      "rewardGold": 50
    }
  ]
}
```

## Advanced Features

### Filtering Data

Extract only specific items:

```bash
# Extract only level 80 NPCs
node tools/data-extraction/extract-npcs.js --min-level=80 --max-level=80

# Extract only epic items
node tools/data-extraction/extract-items.js --quality=epic
```

### Batch Processing

Process multiple extractions:

```bash
# Create batch file
cat > batch-extract.sh << EOF
npm run extract:zones
npm run extract:npcs
npm run extract:quests
npm run extract:items
EOF

chmod +x batch-extract.sh
./batch-extract.sh
```

### Data Validation

Validate extracted data before import:

```bash
node tools/data-extraction/validate.js --file=data/extracted/npcs.json
```

## Troubleshooting

### Extraction Fails

**Problem**: Extraction fails with "Cannot read DBC files"

**Solution**:
1. Verify retail client path is correct
2. Ensure DBC files exist in `DBFilesClient/`
3. Check file permissions

### Invalid Data Format

**Problem**: Imported data doesn't work correctly

**Solution**:
1. Validate data format matches TrinityCore schema
2. Run validation tool
3. Check transformation logs

### Missing Dependencies

**Problem**: "Module not found" errors

**Solution**:
```bash
npm install
```

### Performance Issues

**Problem**: Extraction is very slow

**Solution**:
1. Extract specific data types instead of all
2. Use filtering to reduce data volume
3. Increase Node.js memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run extract:all
```

## Best Practices

1. **Backup First**: Always backup your database before importing
2. **Test Incrementally**: Test small data sets before full import
3. **Validate Data**: Always validate before importing
4. **Version Control**: Keep extracted data in version control
5. **Document Changes**: Note any custom modifications

## Example Workflow

Complete workflow for extracting and importing quest data:

```bash
# 1. Configure
vim config/default.json

# 2. Extract quests
npm run extract:quests

# 3. Validate
node tools/data-extraction/validate.js --file=data/extracted/quests.json

# 4. Backup database
npm run backup:create

# 5. Import
node tools/data-extraction/import.js --type=quests --file=data/extracted/quests.json

# 6. Verify in-game
npm start
```

## Data Sources

Trinity Studio supports extracting from:
- Retail WoW (current version)
- Classic WoW
- The Burning Crusade Classic
- Wrath of the Lich King Classic

## Legal Notice

**Important**: Extracting data from WoW clients may violate Blizzard's Terms of Service. This tool is provided for educational purposes only. Use at your own risk.

## Additional Resources

- [DBC File Format Documentation](https://wowdev.wiki/DBC)
- [TrinityCore Database Documentation](https://trinitycore.info/en/database)
- [WoW Dev Wiki](https://wowdev.wiki/)

## Support

For extraction-related issues:
- Check [FAQ](faq.md)
- Open an issue on GitHub
- Join our Discord community

---

**Last Updated**: 2024-12-09
