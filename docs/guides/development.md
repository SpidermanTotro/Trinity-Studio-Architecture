# Development Guide

Welcome to the Trinity Studio Architecture development guide!

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** or **MariaDB** >= 10.6
- **Git**
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/SpidermanTotro/Trinity-Studio-Architecture.git
cd Trinity-Studio-Architecture

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Copy configuration
cp config/default.example.json config/default.json

# Edit configuration files
vim config/default.json
vim .env

# Initialize database
npm run db:init

# Run tests
npm test

# Start development server
npm run dev
```

## Project Structure

```
Trinity-Studio-Architecture/
├── src/                      # Source code
│   ├── core/                 # Core system
│   │   ├── config/           # Configuration management
│   │   ├── database/         # Database layer
│   │   ├── modules/          # Module loader
│   │   └── utils/            # Utilities
│   ├── expansions/           # Expansion modules
│   │   ├── vanilla/
│   │   ├── tbc/
│   │   ├── wotlk/
│   │   └── ...
│   ├── ai-debugger/          # AI debugging system
│   ├── data-extraction/      # Data extraction tools
│   ├── live-programming/     # Hot-reload system
│   ├── sync/                 # Offline/online sync
│   └── player-experience/    # Player features
├── tools/                    # Development tools
├── config/                   # Configuration files
├── docs/                     # Documentation
├── tests/                    # Test files
├── scripts/                  # Utility scripts
└── .github/                  # GitHub Actions
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit files and ensure:
- Code follows style guide
- Tests are written
- Documentation is updated

### 3. Run Tests

```bash
# All tests
npm test

# Specific suite
npm run test:core

# With coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### 4. Lint Code

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Style

### JavaScript Style

```javascript
// Use ES6+ features
import { ConfigManager } from './config/config-manager.js';

// Use const/let, not var
const config = await ConfigManager.load();
let counter = 0;

// Arrow functions for short functions
const double = (x) => x * 2;

// Async/await over callbacks
async function loadData() {
  const data = await fetchData();
  return data;
}

// Destructuring
const { name, version } = config;

// Template literals
const message = `Hello ${name}!`;

// Object shorthand
const obj = { name, version };
```

### Naming Conventions

- **Variables/Functions**: camelCase (`getUserData`)
- **Classes**: PascalCase (`ConfigManager`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CONNECTIONS`)
- **Private**: Prefix with underscore (`_privateMethod`)
- **Files**: kebab-case (`config-manager.js`)

### Comments

```javascript
/**
 * Load configuration from file
 * @param {string} path - Configuration file path
 * @returns {Promise<Object>} Configuration object
 */
async function loadConfig(path) {
  // Implementation
}

// Single-line comments for simple explanations
const port = process.env.PORT || 8085; // Default port
```

## Testing

### Unit Tests

Test individual functions:

```javascript
import { calculateDamage } from '../combat.js';

describe('calculateDamage', () => {
  test('should calculate basic damage', () => {
    const damage = calculateDamage(100, 50);
    expect(damage).toBe(50);
  });

  test('should apply armor reduction', () => {
    const damage = calculateDamage(100, 50, 25);
    expect(damage).toBeLessThan(50);
  });
});
```

### Integration Tests

Test component interactions:

```javascript
import { ModuleLoader } from '../core/modules/module-loader.js';
import { ConfigManager } from '../core/config/config-manager.js';

describe('Module Loading', () => {
  test('should load enabled expansions', async () => {
    const config = await ConfigManager.load();
    const loader = new ModuleLoader(config);
    await loader.loadModules();
    
    expect(loader.getLoadedModules()).toContain('vanilla');
  });
});
```

### Mocking

```javascript
jest.mock('../database/database-manager.js');

const mockQuery = jest.fn().mockResolvedValue([{ id: 1 }]);
DatabaseManager.mockImplementation(() => ({
  query: mockQuery
}));
```

## Adding New Features

### New Expansion Module

1. Create directory: `src/expansions/new-expansion/`
2. Create `index.js`:

```javascript
import { Logger } from '../../core/utils/logger.js';

export class NewExpansion {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('NewExpansion');
  }

  async initialize() {
    this.logger.info('Initializing...');
    // Implementation
  }

  getInfo() {
    return {
      name: 'New Expansion',
      version: '1.0.0'
    };
  }
}

export default NewExpansion;
```

3. Add to `config/expansions.json`
4. Write tests in `tests/expansions/`

### New API Endpoint

1. Add route in `src/core/index.js`:

```javascript
this.app.get('/api/new-endpoint', async (req, res) => {
  try {
    const data = await someFunction();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

2. Document in `docs/api/README.md`
3. Write tests

### New Tool

1. Create in `tools/new-tool/`
2. Add README
3. Add npm script to `package.json`
4. Document in `docs/guides/`

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Trinity Studio",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/core/index.js",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

```javascript
import { Logger } from '../core/utils/logger.js';

const logger = new Logger('MyModule');

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Console Debugging

```javascript
console.log('Variable:', variable);
console.table(arrayOfObjects);
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

## Performance

### Profiling

```bash
# Start with profiler
node --prof src/core/index.js

# Generate readable output
node --prof-process isolate-*.log > profile.txt
```

### Memory Leaks

```bash
# Check for memory leaks
node --inspect src/core/index.js

# Open chrome://inspect in Chrome
# Take heap snapshots
```

### Optimization Tips

1. Use async/await properly
2. Avoid blocking operations
3. Use database connection pooling
4. Implement caching
5. Use indexes on database queries

## Database Development

### Migrations

Create migration in `scripts/database/migrations/`:

```javascript
export async function up(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS new_table (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function down(db) {
  await db.query('DROP TABLE IF EXISTS new_table');
}
```

### Queries

Use prepared statements:

```javascript
const result = await db.execute(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);
```

## Documentation

### Code Documentation

Use JSDoc:

```javascript
/**
 * Calculate experience reward
 * @param {number} questLevel - Quest level
 * @param {number} playerLevel - Player level
 * @returns {number} Experience points
 */
function calculateXP(questLevel, playerLevel) {
  // Implementation
}
```

### Markdown Documentation

- Use clear headings
- Include code examples
- Add diagrams when helpful
- Keep it up-to-date

## CI/CD

### GitHub Actions

Workflows run on:
- Push to main/develop
- Pull requests
- Scheduled (daily)

Check `.github/workflows/ci-cd.yml`

### Pre-commit Hooks

Install Husky:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm test"
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with import errors

**Solution**: Ensure you're using ES modules correctly:
```javascript
import { something } from './file.js'; // Include .js
```

**Issue**: Database connection fails

**Solution**: Check MySQL is running:
```bash
sudo systemctl status mysql
```

**Issue**: Port already in use

**Solution**: Find and kill process:
```bash
lsof -i :8085
kill -9 PID
```

## Tools & Extensions

### Recommended VS Code Extensions

- ESLint
- Prettier
- GitLens
- Docker
- REST Client
- MySQL

### Useful Commands

```bash
# Find TODO comments
grep -r "TODO" src/

# Count lines of code
find src -name "*.js" | xargs wc -l

# Check dependencies
npm outdated

# Update dependencies
npm update

# Audit security
npm audit
```

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TrinityCore Documentation](https://trinitycore.info/)

## Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Search existing GitHub issues
- **Discord**: Join our community
- **Stack Overflow**: Tag with `trinity-studio`

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Happy Coding!** 💻
