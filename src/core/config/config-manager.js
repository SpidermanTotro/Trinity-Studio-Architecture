import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ConfigManager {
  static async load() {
    const configPath = path.join(process.cwd(), 'config', 'default.json');
    const examplePath = path.join(process.cwd(), 'config', 'default.example.json');

    try {
      // Check if config exists, if not copy from example
      try {
        await fs.access(configPath);
      } catch {
        console.log('Config file not found, copying from example...');
        await fs.copyFile(examplePath, configPath);
      }

      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      // Load expansions config
      const expansionsPath = path.join(process.cwd(), 'config', 'expansions.json');
      const expansionsContent = await fs.readFile(expansionsPath, 'utf-8');
      const expansions = JSON.parse(expansionsContent);

      // Merge expansion data with enabled flags from main config
      Object.keys(config.expansions).forEach(key => {
        if (expansions[key]) {
          expansions[key].enabled = config.expansions[key];
        }
      });

      config.expansionsData = expansions;

      // Apply environment variable overrides
      if (process.env.PORT) {
        config.server.port = parseInt(process.env.PORT);
      }

      if (process.env.DB_HOST) {
        config.database.host = process.env.DB_HOST;
      }

      if (process.env.DB_USER) {
        config.database.user = process.env.DB_USER;
      }

      if (process.env.DB_PASSWORD) {
        config.database.password = process.env.DB_PASSWORD;
      }

      // Parse command line arguments
      const args = process.argv.slice(2);
      args.forEach(arg => {
        if (arg.startsWith('--mode=')) {
          config.server.mode = arg.split('=')[1];
        }
        if (arg.startsWith('--expansion=')) {
          const expansion = arg.split('=')[1];
          // Enable only specified expansion
          Object.keys(config.expansions).forEach(key => {
            config.expansions[key] = (key === expansion);
          });
        }
        if (arg === '--live-reload') {
          config.features.liveReload = true;
        }
      });

      return config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  static async save(config) {
    const configPath = path.join(process.cwd(), 'config', 'default.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  static async updateExpansion(expansionName, enabled) {
    const config = await this.load();
    config.expansions[expansionName] = enabled;
    await this.save(config);
    return config;
  }
}
