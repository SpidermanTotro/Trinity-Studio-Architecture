# Data Layer

This directory contains all data layer components including:

## Structure

```
data/
├── repositories/     # Data repositories
├── entities/         # Data entities/models
├── migrations/       # Database migrations
├── seeders/          # Database seeders
└── config/           # Database configuration
```

## Responsibilities

- Data persistence and retrieval
- Database operations (CRUD)
- Query optimization
- Transaction management
- Data caching
- Schema migrations

## Design Patterns

Common patterns used in this layer:

- **Repository Pattern**: Abstract data access
- **Unit of Work**: Manage transactions
- **Data Mapper**: Map between database and domain objects
- **Active Record**: Objects with persistence logic
- **CQRS**: Separate read and write operations

## Best Practices

1. Use parameterized queries to prevent SQL injection
2. Implement connection pooling
3. Use indexes for performance
4. Handle transactions properly
5. Implement retry logic for transient failures
6. Cache frequently accessed data
7. Monitor query performance

## Example Repository

```javascript
// Example User Repository
class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to find user', error);
    }
  }

  async findByEmail(email) {
    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to find user by email', error);
    }
  }

  async findAll(options = {}) {
    try {
      const { limit = 10, offset = 0, orderBy = 'created_at' } = options;
      
      const result = await this.db.query(
        `SELECT * FROM users 
         ORDER BY ${orderBy} DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch users', error);
    }
  }

  async create(userData) {
    try {
      const result = await this.db.query(
        `INSERT INTO users (email, name, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userData.email,
          userData.name,
          userData.password,
          userData.role || 'user',
          new Date(),
          new Date(),
        ]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create user', error);
    }
  }

  async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      });

      fields.push(`updated_at = $${paramCount}`);
      values.push(new Date());
      values.push(id);

      const result = await this.db.query(
        `UPDATE users 
         SET ${fields.join(', ')}
         WHERE id = $${paramCount + 1}
         RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to update user', error);
    }
  }

  async delete(id) {
    try {
      await this.db.query(
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      return true;
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  async count() {
    try {
      const result = await this.db.query('SELECT COUNT(*) FROM users');
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to count users', error);
    }
  }
}

export default UserRepository;
```

## Example Entity

```javascript
// Example User Entity
class UserEntity {
  static tableName = 'users';
  
  static schema = {
    id: { type: 'uuid', primaryKey: true },
    email: { type: 'string', unique: true, required: true },
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    role: { type: 'string', default: 'user' },
    created_at: { type: 'timestamp', default: 'now()' },
    updated_at: { type: 'timestamp', default: 'now()' },
  };

  static indexes = [
    { fields: ['email'], unique: true },
    { fields: ['created_at'] },
  ];

  static relations = {
    posts: {
      type: 'hasMany',
      model: 'Post',
      foreignKey: 'user_id',
    },
    profile: {
      type: 'hasOne',
      model: 'Profile',
      foreignKey: 'user_id',
    },
  };
}

export default UserEntity;
```

## Example Migration

```javascript
// Example Migration: Create Users Table
export async function up(db) {
  await db.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('role').defaultTo('user');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    
    table.index('email');
    table.index('created_at');
  });
}

export async function down(db) {
  await db.schema.dropTable('users');
}
```

## Database Configuration

```javascript
// Example database configuration
const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'trinity_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
  },
  
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 5,
      max: 30,
    },
  },
};

export default config;
```

## Query Optimization Tips

1. **Use Indexes**: Create indexes on frequently queried columns
2. **Limit Results**: Always use pagination for large datasets
3. **Avoid N+1 Queries**: Use joins or batch loading
4. **Use Connection Pooling**: Reuse database connections
5. **Cache Results**: Cache frequently accessed data
6. **Monitor Slow Queries**: Log and optimize slow queries
7. **Use Prepared Statements**: Prevent SQL injection and improve performance
