import { SyncManager } from '../../src/sync/sync-manager.js';

describe('SyncManager', () => {
  let syncManager;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      sync: {
        encryptTransfers: true,
        validateIntegrity: true
      },
      security: {
        jwtSecret: 'test-secret-key'
      }
    };
    syncManager = new SyncManager(mockConfig);
  });

  test('should validate character data', async () => {
    const validCharacter = {
      id: 1,
      name: 'TestCharacter',
      level: 80,
      gold: 1000,
      inventory: []
    };

    const validation = await syncManager.validateCharacter(validCharacter);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should detect invalid character data', async () => {
    const invalidCharacter = {
      id: 1,
      name: 'TestCharacter',
      level: 200, // Invalid level
      gold: -1000, // Invalid gold
      inventory: []
    };

    const validation = await syncManager.validateCharacter(invalidCharacter);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  test('should encrypt and decrypt data', () => {
    const data = { test: 'data', number: 123 };
    const encrypted = syncManager.encryptData(data);
    const decrypted = syncManager.decryptData(encrypted);
    expect(decrypted).toEqual(data);
  });

  test('should calculate checksum', () => {
    const data = { test: 'data' };
    const checksum1 = syncManager.calculateChecksum(data);
    const checksum2 = syncManager.calculateChecksum(data);
    expect(checksum1).toBe(checksum2);
  });
});
