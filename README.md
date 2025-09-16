# ERP User Management System Backend

A secure, multi-tenant backend system for managing users within companies with role-based access control. Built with Express.js, MySQL, and JWT authentication.

## 🚀 Features

- **Multi-tenant Architecture**: Each company manages its own users independently
- **Role-based Access Control**: Different roles (CA, SM, FM, EM) with specific permissions
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Pagination**: Efficient data retrieval with pagination support
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **Comprehensive Testing**: Jest test suite with high coverage
- **Soft Delete Support**: Users can be marked as deleted without permanent removal

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erp-user-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=erp_user_management

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Set up the database**
   ```bash
   # Create database and tables
   mysql -u root -p < database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📚 API Documentation

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "JohnDoe@techcorp.net",
  "password": "password123"
}
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
      "email": "JohnDoe@techcorp.net",
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

### User Management

#### GET /users
Get all users for the current user's company with pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

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

#### POST /users
Create a new user (CA role only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "newuser@techcorp.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Doe",
  "role_id": 2
}
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

#### GET /users/me
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

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

### Roles

#### GET /roles
Get all available roles in the system.

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
      }
    ],
    "total": 4
  }
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Role-based Access Control**: Different permissions for different roles
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers middleware

## 🏗️ Database Schema

### Tables

1. **companies**: Company information
2. **roles**: Available roles with permissions
3. **users**: User accounts with company and role associations

### Sample Data

The system comes with sample data:
- 3 companies (TechCorp Inc., RetailMax Ltd., FinanceHub LLC)
- 4 roles (CA, SM, FM, EM)
- 3 sample admin users (one per company)

**Default Admin Credentials:**
- Email: `admin@techcorp.com`, Password: `password123`
- Email: `admin@retailmax.com`, Password: `password123`
- Email: `admin@financehub.com`, Password: `password123`

## 🧪 Testing

The project includes comprehensive tests:

- **Authentication Tests**: Login functionality
- **User Management Tests**: CRUD operations and role-based access
- **Role Tests**: Role retrieval functionality

Run tests with:
```bash
npm test
```

## 📁 Project Structure

```
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
│   └── roleController.js     # Role management logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   └── roles.js             # Role routes
├── tests/
│   ├── auth.test.js         # Authentication tests
│   ├── users.test.js        # User management tests
│   ├── roles.test.js        # Role tests
│   └── setup.js             # Test setup
├── database/
│   └── schema.sql           # Database schema
├── server.js                # Main application file
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest configuration
├── env.example              # Environment variables example
└── README.md               # This file
```

## 🚀 Deployment

1. **Set production environment variables**
2. **Install dependencies**: `npm install --production`
3. **Run database migrations**: `mysql -u root -p < database/schema.sql`
4. **Start the server**: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Submit a pull request


## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team. 
