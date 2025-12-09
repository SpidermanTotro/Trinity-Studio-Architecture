import { Logger } from '../core/utils/logger.js';
import crypto from 'crypto';

export class SyncManager {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('SyncManager');
  }

  async syncCharacterToOnline(characterId) {
    this.logger.info(`Syncing character ${characterId} to online mode...`);

    try {
      // Validate character data
      const characterData = await this.getCharacterData(characterId);
      const validation = await this.validateCharacter(characterData);

      if (!validation.valid) {
        throw new Error(`Character validation failed: ${validation.errors.join(', ')}`);
      }

      // Encrypt character data
      const encryptedData = this.encryptData(characterData);

      // Create transfer package
      const transferPackage = {
        characterId,
        data: encryptedData,
        checksum: this.calculateChecksum(characterData),
        timestamp: new Date(),
        version: '1.0.0'
      };

      this.logger.info(`Character ${characterId} ready for online sync`);
      return transferPackage;
    } catch (error) {
      this.logger.error(`Failed to sync character ${characterId}:`, error.message);
      throw error;
    }
  }

  async syncCharacterToOffline(transferPackage) {
    this.logger.info(`Syncing character to offline mode...`);

    try {
      // Decrypt data
      const characterData = this.decryptData(transferPackage.data);

      // Validate checksum
      const calculatedChecksum = this.calculateChecksum(characterData);
      if (calculatedChecksum !== transferPackage.checksum) {
        throw new Error('Checksum validation failed - data may be corrupted');
      }

      // Validate character integrity
      const validation = await this.validateCharacter(characterData);
      if (!validation.valid) {
        throw new Error(`Character validation failed: ${validation.errors.join(', ')}`);
      }

      // Import character data
      await this.importCharacter(characterData);

      this.logger.info('Character imported successfully');
      return { success: true, characterId: characterData.id };
    } catch (error) {
      this.logger.error('Failed to import character:', error.message);
      throw error;
    }
  }

  async validateCharacter(characterData) {
    const errors = [];

    // Basic validation
    if (!characterData.id) errors.push('Missing character ID');
    if (!characterData.name) errors.push('Missing character name');
    if (!characterData.level || characterData.level < 1 || characterData.level > 80) {
      errors.push('Invalid character level');
    }

    // Integrity checks
    if (characterData.gold < 0) errors.push('Invalid gold amount');
    if (characterData.gold > 999999999) errors.push('Gold amount exceeds maximum');

    // Item validation
    if (characterData.inventory) {
      characterData.inventory.forEach((item, index) => {
        if (item.count < 0 || item.count > 255) {
          errors.push(`Invalid item count at slot ${index}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  encryptData(data) {
    if (!this.config.sync.encryptTransfers) {
      return JSON.stringify(data);
    }

    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.config.security.jwtSecret, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      iv: iv.toString('hex')
    };
  }

  decryptData(encryptedData) {
    if (typeof encryptedData === 'string') {
      return JSON.parse(encryptedData);
    }

    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.config.security.jwtSecret, 'salt', 32);
    const iv = Buffer.from(encryptedData.iv, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  calculateChecksum(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  async getCharacterData(characterId) {
    // This would fetch from database in real implementation
    return {
      id: characterId,
      name: 'TestCharacter',
      level: 80,
      gold: 10000,
      inventory: [],
      quests: [],
      achievements: []
    };
  }

  async importCharacter(characterData) {
    // This would import to database in real implementation
    this.logger.debug(`Importing character: ${characterData.name}`);
  }
}
