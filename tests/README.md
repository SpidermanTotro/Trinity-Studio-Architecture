# Trinity Studio Architecture - Tests

This directory contains all test files for the Trinity Studio Architecture project.

## Test Structure

```
tests/
├── core/               # Core system tests
│   ├── config-manager.test.js
│   └── module-loader.test.js
├── expansions/         # Expansion module tests
├── integration/        # Integration tests
├── player-experience/  # Player experience feature tests
└── sync/              # Sync system tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
# Core tests
npm run test:core

# Expansion tests
npm run test:expansions

# Integration tests
npm run test:integration
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Writing Tests

### Test Template

```javascript
import { YourClass } from '../../src/path/to/class.js';

describe('YourClass', () => {
  let instance;

  beforeEach(() => {
    instance = new YourClass();
  });

  test('should do something', () => {
    const result = instance.method();
    expect(result).toBe(expected);
  });
});
```

### Best Practices

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Isolation**: Each test should be independent
4. **Mock External Dependencies**: Use mocks for database, network calls
5. **Coverage**: Aim for 80%+ code coverage

## Test Types

### Unit Tests
Test individual functions and classes in isolation.

### Integration Tests
Test how different components work together.

### End-to-End Tests
Test complete workflows from start to finish.

## Mocking

Example of mocking database:

```javascript
jest.mock('../../src/core/database/database-manager.js');

const mockQuery = jest.fn();
DatabaseManager.mockImplementation(() => ({
  query: mockQuery
}));
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Scheduled daily builds

See `.github/workflows/ci-cd.yml` for CI configuration.

## Coverage Reports

Coverage reports are generated in `coverage/` directory.

View HTML report:
```bash
open coverage/lcov-report/index.html
```

## Support

For testing questions:
- Check [development guide](../docs/guides/development.md)
- Open an issue
- Join Discord

---

**Happy Testing!** 🧪
