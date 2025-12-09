import { Logger } from '../core/utils/logger.js';

export class LevelScalingEngine {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('LevelScaling');
    this.enabled = config?.features?.levelScaling || false;
  }

  /**
   * Scale NPC level based on player level
   */
  scaleNPCLevel(npcBaseLevel, playerLevel, options = {}) {
    if (!this.enabled) {
      return npcBaseLevel;
    }

    const {
      minLevel = Math.max(1, playerLevel - 5),
      maxLevel = Math.min(80, playerLevel + 5),
      scalingFactor = 1.0
    } = options;

    // Calculate scaled level
    let scaledLevel = Math.round(playerLevel * scalingFactor);
    
    // Apply bounds
    scaledLevel = Math.max(minLevel, Math.min(maxLevel, scaledLevel));

    this.logger.debug(`Scaled NPC from level ${npcBaseLevel} to ${scaledLevel} for player level ${playerLevel}`);

    return scaledLevel;
  }

  /**
   * Scale NPC stats based on level
   */
  scaleNPCStats(baseStats, originalLevel, scaledLevel) {
    if (originalLevel === scaledLevel) {
      return baseStats;
    }

    const levelDifference = scaledLevel - originalLevel;
    const scalingMultiplier = 1 + (levelDifference * 0.1); // 10% per level

    return {
      health: Math.round(baseStats.health * scalingMultiplier),
      mana: Math.round(baseStats.mana * scalingMultiplier),
      armor: Math.round(baseStats.armor * scalingMultiplier),
      damage: Math.round(baseStats.damage * scalingMultiplier),
      experience: Math.round(baseStats.experience * scalingMultiplier)
    };
  }

  /**
   * Scale quest rewards based on player level
   */
  scaleQuestRewards(baseRewards, questLevel, playerLevel) {
    if (!this.enabled || questLevel === playerLevel) {
      return baseRewards;
    }

    const levelDifference = playerLevel - questLevel;
    const experienceMultiplier = this.getExperienceMultiplier(levelDifference);
    const goldMultiplier = this.getGoldMultiplier(playerLevel);

    return {
      experience: Math.round(baseRewards.experience * experienceMultiplier),
      gold: Math.round(baseRewards.gold * goldMultiplier),
      items: baseRewards.items // Items don't scale
    };
  }

  /**
   * Get experience multiplier based on level difference
   */
  getExperienceMultiplier(levelDifference) {
    if (levelDifference > 5) return 0.1; // Very low XP for trivial quests
    if (levelDifference > 0) return 1 - (levelDifference * 0.1);
    if (levelDifference < -5) return 1.5; // Bonus for higher level quests
    return 1.0;
  }

  /**
   * Get gold multiplier based on player level
   */
  getGoldMultiplier(playerLevel) {
    // Gold scales linearly with level
    return Math.max(1, playerLevel / 10);
  }

  /**
   * Scale zone difficulty based on player level
   */
  scaleZoneDifficulty(zoneName, playerLevel) {
    const zoneScaling = {
      mode: 'dynamic',
      minLevel: Math.max(1, playerLevel - 10),
      maxLevel: Math.min(80, playerLevel + 10),
      recommendedLevel: playerLevel
    };

    this.logger.debug(`Zone ${zoneName} scaled for level ${playerLevel}`);

    return zoneScaling;
  }

  /**
   * Enable or disable level scaling
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    this.logger.info(`Level scaling ${enabled ? 'enabled' : 'disabled'}`);
  }
}
