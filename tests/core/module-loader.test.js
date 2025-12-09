import { ModuleLoader } from '../../src/core/modules/module-loader.js';

describe('ModuleLoader', () => {
  let loader;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      expansions: {
        vanilla: true,
        tbc: false,
        wotlk: true
      },
      expansionsData: {
        vanilla: { version: '1.12.1', name: 'Classic/Vanilla' },
        tbc: { version: '2.4.3', name: 'The Burning Crusade' },
        wotlk: { version: '3.3.5a', name: 'Wrath of the Lich King' }
      }
    };
    loader = new ModuleLoader(mockConfig);
  });

  test('should initialize with config', () => {
    expect(loader).toBeDefined();
    expect(loader.config).toEqual(mockConfig);
  });

  test('should load enabled modules', async () => {
    await loader.loadModules();
    const loaded = loader.getLoadedModules();
    expect(loaded).toContain('vanilla');
    expect(loaded).toContain('wotlk');
    expect(loaded).not.toContain('tbc');
  });

  test('should return module status', async () => {
    await loader.loadModules();
    const status = loader.getModuleStatus();
    expect(status.vanilla).toBeDefined();
    expect(status.vanilla.version).toBe('1.12.1');
  });
});
