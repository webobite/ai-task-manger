# Task Manager Backend Service

A RESTful API service built with Express.js, TypeScript, and SQLite to support the Task Manager application.

## Features

- User authentication with JWT
- SQLite database for data persistence
- Environment-based configuration
- RESTful API endpoints
- Input validation using Zod
- TypeScript for type safety
- Comprehensive error handling
- Database migrations
- Automatic database initialization
- OpenAPI/Swagger documentation
- Interactive API explorer

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript knowledge
- Basic SQL understanding

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.ts        # Database connection and utilities
│   │   ├── init.ts         # Database initialization
│   │   └── migrate.ts      # Database migrations
│   ├── routes/
│   │   └── auth.routes.ts  # Authentication routes
│   ├── services/
│   │   └── auth.service.ts # Authentication service
│   ├── middleware/
│   │   └── auth.middleware.ts # Auth middleware
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── config.ts           # Configuration
│   ├── swagger.ts          # API documentation config
│   └── index.ts           # Main application
├── data/                  # Database files (auto-generated)
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── .env.example         # Example environment variables
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
# Development
cp .env.example .env.development
# Production
cp .env.example .env.production
```

4. Initialize the database:
```bash
# Development
npm run init:dev
# Production
npm run init:prod
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations
- `npm run migrate:dev` - Run development migrations
- `npm run migrate:prod` - Run production migrations
- `npm run init:dev` - Initialize development database
- `npm run init:prod` - Initialize production database
- `npm run start:prod` - Start production server from build
- `npm run build:prod` - Build for production with production env
- `npm run swagger-autogen` - Generate OpenAPI documentation

## Environment Variables

```env
PORT=3000                    # Server port
JWT_SECRET=your-secret-key   # JWT signing key
CORS_ORIGIN=http://localhost:5173  # CORS origin
NODE_ENV=development         # Environment (development/production)
DB_PATH=./data/taskmanager.db    # Database file path
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides:

- Interactive API explorer
- Request/response examples
- Schema definitions
- Authentication details
- Error responses

### Accessing Documentation

1. Start the server:
```bash
npm run dev
```

2. Visit the documentation:
```
http://localhost:3000/api-docs
```

### Documentation Features

- Interactive API testing
- Request builder
- Response examples
- Schema validation
- Authentication flow
- Error handling details

### API Endpoints

#### Authentication

```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Routes
All protected routes require the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  userId INTEGER NOT NULL,
  parentId INTEGER,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (parentId) REFERENCES projects (id)
)
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  projectId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects (id),
  FOREIGN KEY (userId) REFERENCES users (id)
)
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow the format:
```json
{
  "error": "Error message here"
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- Environment-based configuration
- Secure error handling

## Development

1. Start the development server:
```bash
npm run dev
```

2. Make changes and the server will automatically reload

3. Run migrations if you modify the database schema:
```bash
npm run migrate:dev
```

## Production Deployment

1. Set up production environment:
```bash
cp .env.example .env.production
# Edit .env.production with secure values
```

2. Build and start:
```bash
npm run build:prod
npm run init:prod
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License. 