# Business Logic Layer

This directory contains all business logic layer components including:

## Structure

```
business/
├── services/         # Business services
├── models/           # Domain models
├── validators/       # Business validators
├── workflows/        # Business workflows
└── middleware/       # Business middleware
```

## Responsibilities

- Implement business rules
- Process business transactions
- Coordinate between layers
- Handle authentication and authorization
- Manage workflows
- Transform and validate data

## Design Patterns

Common patterns used in this layer:

- **Service Pattern**: Encapsulate business logic
- **Domain Model Pattern**: Rich domain objects
- **Repository Pattern**: Abstract data access
- **Factory Pattern**: Object creation
- **Strategy Pattern**: Varying algorithms
- **Observer Pattern**: Event handling

## Best Practices

1. Keep business logic independent of frameworks
2. Use dependency injection
3. Implement comprehensive validation
4. Handle errors gracefully
5. Log all business operations
6. Write thorough unit tests
7. Document business rules clearly

## Example Service

```javascript
// Example User Service
class UserService {
  constructor(userRepository, emailService, validator) {
    this.userRepo = userRepository;
    this.emailService = emailService;
    this.validator = validator;
  }

  async createUser(userData) {
    // Validate input
    const validationResult = this.validator.validate(userData);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors);
    }

    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);
    
    // Create user
    const user = await this.userRepo.create({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId, updateData) {
    // Validate update data
    const validationResult = this.validator.validateUpdate(updateData);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors);
    }

    // Check user exists
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user
    const updatedUser = await this.userRepo.update(userId, {
      ...updateData,
      updatedAt: new Date(),
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepo.delete(userId);
    return { success: true };
  }

  async hashPassword(password) {
    // Implementation of password hashing using bcrypt
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}

export default UserService;
```

## Example Domain Model

```javascript
// Example User Domain Model
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.name = data.name;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  hasRole(role) {
    return this.role === role;
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  canEdit(resource) {
    if (this.isAdmin()) return true;
    return resource.ownerId === this.id;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default User;
```

## Example Validator

```javascript
// Example User Validator
class UserValidator {
  validate(userData) {
    const errors = [];

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Invalid email address');
    }

    if (!userData.password || userData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateUpdate(updateData) {
    const errors = [];

    if (updateData.email && !this.isValidEmail(updateData.email)) {
      errors.push('Invalid email address');
    }

    if (updateData.password && updateData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default UserValidator;
```
