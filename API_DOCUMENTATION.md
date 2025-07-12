# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techcorp.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@techcorp.com",
      "first_name": "John",
      "last_name": "Admin",
      "company_id": 1,
      "company_name": "TechCorp Inc.",
      "role_id": 1,
      "role_name": "CA"
    }
  }
}
```

## User Management

### GET /users
Get all users for the current user's company with pagination.

**Request:**
```bash
curl -X GET "http://localhost:3000/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "email": "admin@techcorp.com",
        "first_name": "John",
        "last_name": "Admin",
        "company_id": 1,
        "company_name": "TechCorp Inc.",
        "role_id": 1,
        "role_name": "CA",
        "created_by": null,
        "created_by_name": null,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_users": 1,
      "limit": 10,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

### POST /users
Create a new user (CA role only).

**Request:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "newuser@techcorp.com",
    "password": "password123",
    "first_name": "Jane",
    "last_name": "Doe",
    "role_id": 2
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "newuser@techcorp.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "company_id": 1,
    "company_name": "TechCorp Inc.",
    "role_id": 2,
    "role_name": "SM"
  }
}
```

### GET /users/me
Get current user's profile.

**Request:**
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "admin@techcorp.com",
    "first_name": "John",
    "last_name": "Admin",
    "company_id": 1,
    "company_name": "TechCorp Inc.",
    "role_id": 1,
    "role_name": "CA",
    "created_by": null,
    "created_by_name": null,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Roles

### GET /roles
Get all available roles in the system.

**Request:**
```bash
curl -X GET http://localhost:3000/roles
```

**Response:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "CA",
        "description": "Company Admin - Full access to manage users within company",
        "permissions": {
          "manage_users": true,
          "view_reports": true,
          "admin_access": true
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "SM",
        "description": "Store Manager - Manage store operations",
        "permissions": {
          "manage_store": true,
          "view_reports": true,
          "manage_inventory": true
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 3,
        "name": "FM",
        "description": "Finance Manager - Handle financial operations",
        "permissions": {
          "manage_finance": true,
          "view_reports": true,
          "approve_expenses": true
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 4,
        "name": "EM",
        "description": "Employee - Basic access",
        "permissions": {
          "view_reports": false,
          "basic_access": true
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 4
  }
}
```

## Health Check

### GET /health
Check if the API is running.

**Request:**
```bash
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "message": "ERP User Management API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Testing Examples

### Complete Workflow Example

1. **Login to get token:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techcorp.com",
    "password": "password123"
  }'
```

2. **Get current user profile:**
```bash
# Replace YOUR_JWT_TOKEN with the token from step 1
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Get all roles:**
```bash
curl -X GET http://localhost:3000/roles
```

4. **Create a new user:**
```bash
# Replace YOUR_JWT_TOKEN with the token from step 1
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "manager@techcorp.com",
    "password": "password123",
    "first_name": "Store",
    "last_name": "Manager",
    "role_id": 2
  }'
```

5. **Get all users:**
```bash
# Replace YOUR_JWT_TOKEN with the token from step 1
curl -X GET "http://localhost:3000/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Permission Errors
```json
{
  "success": false,
  "message": "Access denied. Required role: CA"
}
```

### Not Found Errors
```json
{
  "success": false,
  "message": "Route not found"
}
```

## Sample Data

The system comes with pre-configured sample data:

### Companies
- TechCorp Inc. (ID: 1)
- RetailMax Ltd. (ID: 2)
- FinanceHub LLC (ID: 3)

### Roles
- CA (Company Admin) - ID: 1
- SM (Store Manager) - ID: 2
- FM (Finance Manager) - ID: 3
- EM (Employee) - ID: 4

### Sample Users
- admin@techcorp.com (Password: password123) - CA role
- admin@retailmax.com (Password: password123) - CA role
- admin@financehub.com (Password: password123) - CA role

## Testing with Postman

1. Import the following collection into Postman:

```json
{
  "info": {
    "name": "ERP User Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@techcorp.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users/me",
              "host": ["{{baseUrl}}"],
              "path": ["users", "me"]
            }
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"newuser@techcorp.com\",\n  \"password\": \"password123\",\n  \"first_name\": \"Jane\",\n  \"last_name\": \"Doe\",\n  \"role_id\": 2\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users",
              "host": ["{{baseUrl}}"],
              "path": ["users"]
            }
          }
        }
      ]
    },
    {
      "name": "Roles",
      "item": [
        {
          "name": "Get All Roles",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/roles",
              "host": ["{{baseUrl}}"],
              "path": ["roles"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

2. Set up environment variables:
   - `baseUrl`: http://localhost:3000
   - `token`: (will be set after login)

3. Run the Login request and copy the token from the response
4. Set the `token` environment variable with the copied token
5. Run other requests to test the API 