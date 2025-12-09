# API Documentation

## Overview

This document describes the API endpoints and communication protocols for the Trinity Studio Architecture.

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.example.com
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Get Token

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Users API

### Get All Users

**Endpoint**: `GET /users`

**Query Parameters**:
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `orderBy` (optional): Sort field (default: created_at)

**Response**:
```json
{
  "users": [
    {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

### Get User by ID

**Endpoint**: `GET /users/:id`

**Response**:
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-02T00:00:00Z"
}
```

### Create User

**Endpoint**: `POST /users`

**Request**:
```json
{
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "id": "124",
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "role": "user",
  "createdAt": "2025-01-03T00:00:00Z"
}
```

### Update User

**Endpoint**: `PUT /users/:id`

**Request**:
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com"
}
```

**Response**:
```json
{
  "id": "124",
  "email": "janesmith@example.com",
  "name": "Jane Smith",
  "role": "user",
  "updatedAt": "2025-01-04T00:00:00Z"
}
```

### Delete User

**Endpoint**: `DELETE /users/:id`

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

- `400 BAD_REQUEST`: Invalid request data
- `401 UNAUTHORIZED`: Missing or invalid authentication
- `403 FORBIDDEN`: Insufficient permissions
- `404 NOT_FOUND`: Resource not found
- `409 CONFLICT`: Resource conflict (e.g., duplicate email)
- `422 VALIDATION_ERROR`: Validation failed
- `500 INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are rate-limited:

- **Authenticated**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## Pagination

List endpoints support pagination:

**Query Parameters**:
- `limit`: Number of items per page (max: 100)
- `offset`: Number of items to skip

**Response Headers**:
```
X-Total-Count: 250
X-Page-Limit: 10
X-Page-Offset: 20
```

## Versioning

API version is included in the URL:

```
/api/v1/users
/api/v2/users
```

Current version: `v1`

## WebSocket API

For real-time updates, connect to:

```
ws://localhost:3000/ws
```

**Events**:
- `user.created`: New user created
- `user.updated`: User updated
- `user.deleted`: User deleted

**Message Format**:
```json
{
  "event": "user.created",
  "data": {
    "id": "125",
    "email": "realtime@example.com",
    "name": "Real Time User"
  },
  "timestamp": "2025-01-05T00:00:00Z"
}
```

## GraphQL API (Optional)

**Endpoint**: `POST /graphql`

**Query Example**:
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    role
    posts {
      id
      title
      content
    }
  }
}
```

**Mutation Example**:
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
  }
}
```

## Best Practices

1. Always validate input data
2. Use HTTPS in production
3. Implement proper error handling
4. Cache responses when appropriate
5. Use compression (gzip)
6. Log all API requests
7. Monitor API performance
8. Version your APIs
9. Document all changes
10. Test thoroughly
