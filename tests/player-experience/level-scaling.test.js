import { LevelScalingEngine } from '../../src/player-experience/level-scaling-engine.js';

describe('LevelScalingEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new LevelScalingEngine({ features: { levelScaling: true } });
  });

  test('should scale NPC level to player level', () => {
    const scaled = engine.scaleNPCLevel(10, 50);
    expect(scaled).toBeGreaterThan(10);
    expect(scaled).toBeLessThanOrEqual(55);
  });

  test('should not scale when disabled', () => {
    engine.setEnabled(false);
    const scaled = engine.scaleNPCLevel(10, 50);
    expect(scaled).toBe(10);
  });

  test('should scale NPC stats correctly', () => {
    const baseStats = {
      health: 1000,
      mana: 500,
      armor: 100,
      damage: 50,
      experience: 100
    };

    const scaled = engine.scaleNPCStats(baseStats, 10, 20);
    expect(scaled.health).toBeGreaterThan(baseStats.health);
    expect(scaled.damage).toBeGreaterThan(baseStats.damage);
  });

  test('should scale quest rewards', () => {
    const baseRewards = {
      experience: 1000,
      gold: 100,
      items: []
    };

    const scaled = engine.scaleQuestRewards(baseRewards, 10, 20);
    expect(scaled.experience).toBeGreaterThan(0);
    expect(scaled.gold).toBeGreaterThan(0);
  });
});
