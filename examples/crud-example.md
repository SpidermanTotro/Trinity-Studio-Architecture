# Example: Basic CRUD Application

This example demonstrates a complete CRUD (Create, Read, Update, Delete) application built using the Trinity Studio Architecture.

## Overview

A simple user management system with:
- User registration and authentication
- User profile management
- RESTful API
- Validation and error handling

## Project Structure

```
crud-example/
├── src/
│   ├── presentation/
│   │   └── api/
│   │       ├── routes/
│   │       │   └── userRoutes.js
│   │       ├── controllers/
│   │       │   └── userController.js
│   │       └── middleware/
│   │           ├── auth.js
│   │           └── errorHandler.js
│   ├── business/
│   │   ├── services/
│   │   │   └── userService.js
│   │   ├── models/
│   │   │   └── user.js
│   │   └── validators/
│   │       └── userValidator.js
│   └── data/
│       ├── repositories/
│       │   └── userRepository.js
│       ├── entities/
│       │   └── userEntity.js
│       └── config/
│           └── database.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
└── README.md
```

## Installation

```bash
# Install dependencies
npm install express pg bcrypt jsonwebtoken joi

# Set up database
createdb trinity_crud

# Run migrations
npm run migrate

# Start the application
npm start
```

## API Endpoints

### Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### User Management

```bash
# Get all users
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>"

# Get user by ID
curl http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer <token>"

# Update user
curl -X PUT http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'

# Delete user
curl -X DELETE http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer <token>"
```

## Code Examples

### Presentation Layer: User Controller

```javascript
// src/presentation/api/controllers/userController.js
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async getAll(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const users = await this.userService.getAllUsers({ limit, offset });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
```

### Business Layer: User Service

```javascript
// src/business/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository, validator) {
    this.userRepo = userRepository;
    this.validator = validator;
  }

  async createUser(userData) {
    // Validate
    const { error } = this.validator.validateCreate(userData);
    if (error) throw new ValidationError(error.details[0].message);

    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.userRepo.create({
      ...userData,
      password: hashedPassword,
    });

    // Remove password from response
    delete user.password;
    return user;
  }

  async getAllUsers(options) {
    return await this.userRepo.findAll(options);
  }

  async getUserById(id) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    
    delete user.password;
    return user;
  }

  async updateUser(id, updateData) {
    const { error } = this.validator.validateUpdate(updateData);
    if (error) throw new ValidationError(error.details[0].message);

    const user = await this.userRepo.update(id, updateData);
    if (!user) throw new NotFoundError('User not found');
    
    delete user.password;
    return user;
  }

  async deleteUser(id) {
    const result = await this.userRepo.delete(id);
    if (!result) throw new NotFoundError('User not found');
    return result;
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    delete user.password;
    return { user, token };
  }
}

module.exports = UserService;
```

### Data Layer: User Repository

```javascript
// src/data/repositories/userRepository.js
class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async create(userData) {
    const query = `
      INSERT INTO users (email, name, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      userData.email,
      userData.name,
      userData.password,
      userData.role || 'user',
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async findAll(options = {}) {
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    const query = `
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await this.db.query(query, [limit, offset]);
    return result.rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.db.query(query, [email]);
    return result.rows[0];
  }

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    fields.push('updated_at = NOW()');
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await this.db.query(query, [id]);
    return result.rows.length > 0;
  }
}

module.exports = UserRepository;
```

## Testing

### Unit Test Example

```javascript
// tests/unit/userService.test.js
const UserService = require('../../src/business/services/userService');

describe('UserService', () => {
  let userService;
  let mockRepo;
  let mockValidator;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockValidator = {
      validateCreate: jest.fn(),
      validateUpdate: jest.fn(),
    };

    userService = new UserService(mockRepo, mockValidator);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockValidator.validateCreate.mockReturnValue({ error: null });
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: 1, ...userData });

      const result = await userService.createUser(userData);

      expect(result.email).toBe(userData.email);
      expect(result.password).toBeUndefined();
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {
      mockValidator.validateCreate.mockReturnValue({ error: null });
      mockRepo.findByEmail.mockResolvedValue({ id: 1 });

      await expect(
        userService.createUser({ email: 'existing@example.com' })
      ).rejects.toThrow('User already exists');
    });
  });
});
```

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

## Environment Variables

```bash
# .env.example
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=trinity_crud
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_secret_key_here
JWT_EXPIRY=24h
```

## Running the Example

```bash
# 1. Clone and navigate
cd examples/crud

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Create database
createdb trinity_crud

# 5. Run migrations
npm run migrate

# 6. Start application
npm start

# 7. Run tests
npm test
```

## Next Steps

1. Add pagination and filtering
2. Implement caching with Redis
3. Add role-based access control
4. Implement file upload
5. Add email verification
6. Create admin dashboard
7. Add logging and monitoring
8. Deploy to production

## Conclusion

This example demonstrates the Trinity Studio Architecture in action with a simple but complete CRUD application. The clear separation of concerns makes the code easy to understand, test, and maintain.
