import { Logger } from '../core/utils/logger.js';

export class CustomContentManager {
  constructor() {
    this.logger = new Logger('CustomContent');
    this.customQuests = new Map();
    this.customNPCs = new Map();
    this.customItems = new Map();
  }

  /**
   * Register a custom quest
   */
  registerQuest(quest) {
    this.logger.info(`Registering custom quest: ${quest.name} (ID: ${quest.id})`);

    // Validate quest structure
    if (!this.validateQuest(quest)) {
      throw new Error(`Invalid quest structure for quest ID ${quest.id}`);
    }

    this.customQuests.set(quest.id, {
      ...quest,
      custom: true,
      dateAdded: new Date()
    });

    return quest.id;
  }

  /**
   * Validate quest structure
   */
  validateQuest(quest) {
    const required = ['id', 'name', 'level', 'objectives', 'rewards'];
    return required.every(field => quest.hasOwnProperty(field));
  }

  /**
   * Register a custom NPC
   */
  registerNPC(npc) {
    this.logger.info(`Registering custom NPC: ${npc.name} (ID: ${npc.id})`);

    if (!this.validateNPC(npc)) {
      throw new Error(`Invalid NPC structure for NPC ID ${npc.id}`);
    }

    this.customNPCs.set(npc.id, {
      ...npc,
      custom: true,
      dateAdded: new Date()
    });

    return npc.id;
  }

  /**
   * Validate NPC structure
   */
  validateNPC(npc) {
    const required = ['id', 'name', 'level', 'faction'];
    return required.every(field => npc.hasOwnProperty(field));
  }

  /**
   * Register a custom item
   */
  registerItem(item) {
    this.logger.info(`Registering custom item: ${item.name} (ID: ${item.id})`);

    if (!this.validateItem(item)) {
      throw new Error(`Invalid item structure for item ID ${item.id}`);
    }

    this.customItems.set(item.id, {
      ...item,
      custom: true,
      dateAdded: new Date()
    });

    return item.id;
  }

  /**
   * Validate item structure
   */
  validateItem(item) {
    const required = ['id', 'name', 'quality', 'itemLevel'];
    return required.every(field => item.hasOwnProperty(field));
  }

  /**
   * Get custom quest by ID
   */
  getQuest(questId) {
    return this.customQuests.get(questId);
  }

  /**
   * Get custom NPC by ID
   */
  getNPC(npcId) {
    return this.customNPCs.get(npcId);
  }

  /**
   * Get custom item by ID
   */
  getItem(itemId) {
    return this.customItems.get(itemId);
  }

  /**
   * List all custom quests
   */
  listQuests() {
    return Array.from(this.customQuests.values());
  }

  /**
   * List all custom NPCs
   */
  listNPCs() {
    return Array.from(this.customNPCs.values());
  }

  /**
   * List all custom items
   */
  listItems() {
    return Array.from(this.customItems.values());
  }

  /**
   * Export custom content to JSON
   */
  exportContent() {
    return {
      quests: Array.from(this.customQuests.entries()),
      npcs: Array.from(this.customNPCs.entries()),
      items: Array.from(this.customItems.entries()),
      exportDate: new Date()
    };
  }

  /**
   * Import custom content from JSON
   */
  importContent(contentData) {
    let imported = { quests: 0, npcs: 0, items: 0 };

    if (contentData.quests) {
      contentData.quests.forEach(([id, quest]) => {
        this.customQuests.set(id, quest);
        imported.quests++;
      });
    }

    if (contentData.npcs) {
      contentData.npcs.forEach(([id, npc]) => {
        this.customNPCs.set(id, npc);
        imported.npcs++;
      });
    }

    if (contentData.items) {
      contentData.items.forEach(([id, item]) => {
        this.customItems.set(id, item);
        imported.items++;
      });
    }

    this.logger.info(`Imported ${imported.quests} quests, ${imported.npcs} NPCs, ${imported.items} items`);
    return imported;
  }
}
