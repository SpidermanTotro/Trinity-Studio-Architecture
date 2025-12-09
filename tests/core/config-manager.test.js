import { ConfigManager } from '../../src/core/config/config-manager.js';

describe('ConfigManager', () => {
  test('should load configuration', async () => {
    const config = await ConfigManager.load();
    expect(config).toBeDefined();
    expect(config.server).toBeDefined();
    expect(config.database).toBeDefined();
  });

  test('should have default port', async () => {
    const config = await ConfigManager.load();
    expect(config.server.port).toBe(8085);
  });

  test('should have expansion configuration', async () => {
    const config = await ConfigManager.load();
    expect(config.expansions).toBeDefined();
    expect(typeof config.expansions.vanilla).toBe('boolean');
  });
});
