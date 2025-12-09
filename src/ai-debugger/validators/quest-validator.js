export class QuestValidator {
  constructor() {
    this.validated = 0;
    this.errors = [];
    this.active = false;
  }

  start() {
    this.active = true;
    console.log('Quest Validator started');
  }

  stop() {
    this.active = false;
  }

  getStatus() {
    return {
      validated: this.validated,
      errors: this.errors.length
    };
  }

  getErrors() {
    return this.errors;
  }

  validateQuest(questId, questData) {
    this.validated++;
    
    // Basic validation logic
    const errors = [];
    
    if (!questData.name) {
      errors.push({ field: 'name', message: 'Quest name is required' });
    }
    
    if (!questData.objectives || questData.objectives.length === 0) {
      errors.push({ field: 'objectives', message: 'Quest must have at least one objective' });
    }

    if (errors.length > 0) {
      this.errors.push({
        questId,
        errors,
        timestamp: new Date()
      });
    }

    return errors.length === 0;
  }
}
