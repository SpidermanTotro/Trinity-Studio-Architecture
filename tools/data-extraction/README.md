# Data Extraction Tools - README

## Overview

This directory contains tools for extracting data from retail World of Warcraft clients and transforming it for use with Trinity Studio Architecture.

## Tools Included

### 1. Extract All Data
```bash
npm run extract:all
```

Extracts all supported data types from the retail client.

### 2. Zone Extractor
```bash
npm run extract:zones
```

Extracts zone and area information.

### 3. NPC Extractor
```bash
npm run extract:npcs
```

Extracts NPC and creature data.

### 4. Quest Extractor
```bash
npm run extract:quests
```

Extracts quest data and quest chains.

### 5. Item Extractor
```bash
npm run extract:items
```

Extracts item data and statistics.

## Configuration

Set the retail client path in your config:

```json
{
  "dataExtraction": {
    "retailClientPath": "/path/to/retail/wow",
    "outputDirectory": "data/extracted"
  }
}
```

## Output Format

Extracted data is saved in standardized JSON format, ready for import into TrinityCore databases.

## Usage Guide

See the [Data Extraction Guide](../../docs/guides/data-extraction.md) for detailed instructions.
