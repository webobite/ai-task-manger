# AI Task Manager

A modern task management application built with React, TypeScript, and Tailwind CSS. Features a Kanban board view, advanced filtering, and project organization capabilities.

## Features

### Task Management
- ✨ Create, edit, and delete tasks
- 📅 Set due dates and priorities
- 🔄 Support for recurring tasks
- 📝 Rich task descriptions
- ✅ Mark tasks as complete
- 📋 Subtask support with single-level nesting

### Project Organization
- 📂 Multiple project support
- 📌 Default project for unorganized tasks
- 🗂️ Task grouping by projects
- 🔄 Move tasks between projects
- 🗑️ Project deletion with task reassignment
- 🔍 Expandable/collapsible project tree
- 🎯 Quick project navigation

### Views and Filtering
- 📊 Kanban board view (Default)
  - Drag-and-drop task management
  - Status columns: To Do, In Progress, Done
  - Optional columns: On Hold, Blocked
  - Collapsible sections
  - Smooth scrolling

- 📋 Table view with advanced features:
  - Column sorting (click headers to sort)
  - Expandable subtasks
  - Quick actions
  - Compact layout
  - Status indicators

- 🔍 Advanced filtering and search:
  - Global search across tasks
  - Filter by project
  - Filter by priority
  - Filter by status
  - Filter by due date
    - Preset filters (Today, Tomorrow, This Week)
    - Custom date range
  - Multiple filter combinations
  - Clear filter option

### Task Features
- 🏷️ Priority levels (High, Medium, Low)
- 📊 Status tracking
  - Todo
  - In Progress
  - On Hold
  - Blocked
  - Done
- 📅 Due date management
- 🔄 Recurring task patterns
- 📱 Responsive design
- 🌳 Subtask support
  - Single-level nesting
  - Subtask progress tracking
  - Bulk subtask management

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-task-manager.git
   cd ai-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Project Structure

```
src/
├── components/         # React components
│   ├── layout/        # Layout components
│   ├── ui/            # Reusable UI components
│   └── analytics/     # Analytics components
├── store/             # Zustand store definitions
├── types/             # TypeScript type definitions
├── lib/              # Utility functions
└── main.tsx          # Application entry point
```

## Usage

### Task Management

1. **Creating a Task**:
   - Click the "New Task" button
   - Fill in task details (title, description, due date, etc.)
   - Select a project and priority
   - Optionally add subtasks
   - Optionally set up recurrence

2. **Using the Kanban Board**:
   - Drag and drop tasks between status columns
   - Click "Show Optional Columns" to view On Hold and Blocked statuses
   - Edit or delete tasks using hover actions

3. **Using the Table View**:
   - Click column headers to sort tasks
   - Expand/collapse subtasks using arrow icons
   - Quick edit and delete actions
   - Search and filter tasks as needed

4. **Managing Projects**:
   - Use the project tree in the sidebar
   - Expand/collapse all projects with one click
   - Add new projects with the + button
   - Delete projects (tasks move to Default Project)
   - Organize tasks by dragging between projects

5. **Filtering Tasks**:
   - Use the filter button to show filter options
   - Combine multiple filters
   - Use custom date range for specific time periods
   - Use global search to find tasks quickly

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/) 

## Backend API Requirements

### Authentication Endpoints
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/refresh-token
```

### Project Endpoints
```http
GET /api/projects
GET /api/projects/{projectId}
POST /api/projects
PUT /api/projects/{projectId}
DELETE /api/projects/{projectId}
GET /api/projects/{projectId}/tasks
POST /api/projects/{projectId}/tasks
```

### Task Endpoints
```http
GET /api/tasks
GET /api/tasks/{taskId}
POST /api/tasks
PUT /api/tasks/{taskId}
DELETE /api/tasks/{taskId}
GET /api/tasks/{taskId}/subtasks
POST /api/tasks/{taskId}/subtasks
PUT /api/tasks/batch-update
DELETE /api/tasks/batch-delete
```

### Task Status Updates
```http
PUT /api/tasks/{taskId}/status
PUT /api/tasks/{taskId}/complete
PUT /api/tasks/{taskId}/priority
```

### Task Filtering & Search
```http
GET /api/tasks/search?q={searchQuery}
GET /api/tasks/filter
POST /api/tasks/filter (for complex filters)
GET /api/tasks/due-today
GET /api/tasks/due-this-week
GET /api/tasks/overdue
```

### User Preferences
```http
GET /api/preferences
PUT /api/preferences
GET /api/preferences/view-settings
PUT /api/preferences/view-settings
```

### Analytics
```http
GET /api/analytics/task-completion
GET /api/analytics/project-progress
GET /api/analytics/productivity-metrics
```

### Expected Request/Response Examples

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "projectId": "string",
  "priority": "high" | "medium" | "low",
  "status": "todo" | "in-progress" | "hold" | "blocked" | "done",
  "dueDate": "ISO-8601 string",
  "parentTaskId": "string" | null,
  "recurrence": {
    "type": "daily" | "weekly" | "monthly",
    "interval": number
  } | null
}
```

#### Task Response
```typescript
{
  "id": "string",
  "title": "string",
  "description": "string",
  "projectId": "string",
  "priority": "high" | "medium" | "low",
  "status": "todo" | "in-progress" | "hold" | "blocked" | "done",
  "dueDate": "ISO-8601 string",
  "completed": boolean,
  "parentTaskId": "string" | null,
  "hasSubtasks": boolean,
  "completedSubtasks": number,
  "totalSubtasks": number,
  "recurrence": {
    "type": "daily" | "weekly" | "monthly",
    "interval": number
  } | null,
  "createdAt": "ISO-8601 string",
  "updatedAt": "ISO-8601 string"
}
```

#### Filter Tasks
```http
POST /api/tasks/filter
Content-Type: application/json

{
  "projectId": "string" | "all",
  "priority": "high" | "medium" | "low" | "all",
  "status": "todo" | "in-progress" | "hold" | "blocked" | "done" | "all",
  "dueDate": {
    "type": "today" | "tomorrow" | "this-week" | "overdue" | "custom",
    "startDate": "ISO-8601 string", // for custom range
    "endDate": "ISO-8601 string"    // for custom range
  },
  "searchQuery": "string",
  "sortBy": "dueDate" | "priority" | "status" | "title",
  "sortDirection": "asc" | "desc",
  "page": number,
  "limit": number
}
```

### Data Models

#### Project
```typescript
{
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
}
```

#### Task
```typescript
{
  id: string;
  title: string;
  description?: string;
  projectId: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'hold' | 'blocked' | 'done';
  dueDate: string;
  completed: boolean;
  parentTaskId?: string;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

#### User Preferences
```typescript
{
  id: string;
  userId: string;
  defaultProjectId: string;
  defaultView: 'board' | 'table';
  showCompletedTasks: boolean;
  showOptionalColumns: boolean;
  taskSortPreference: {
    field: string;
    direction: 'asc' | 'desc';
  };
  theme: 'light' | 'dark' | 'system';
}
```

### API Response Format
All API responses follow this standard format:
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Codes
Common error codes returned by the API:
```typescript
{
  UNAUTHORIZED: 'User is not authenticated',
  FORBIDDEN: 'User does not have permission',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Invalid input data',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error'
}
```

## Authentication

### User Registration Requirements
```typescript
interface RegistrationData {
  email: string;        // Required, must be valid email format
  password: string;     // Required, min 8 chars, 1 uppercase, 1 number, 1 special char
  confirmPassword: string; // Must match password
  fullName: string;     // Required, 2-50 chars
  username: string;     // Required, 3-20 chars, alphanumeric and underscore only
  acceptTerms: boolean; // Must be true
}
```

### Login Requirements
```typescript
interface LoginData {
  email: string;        // Required, must be valid email
  password: string;     // Required
  rememberMe?: boolean; // Optional
}
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Maximum 64 characters

### Authentication Features
- Email/Password authentication
- Remember me functionality
- Password reset via email
- Email verification
- Session management
- Automatic token refresh
- Secure password storage (backend)
- Rate limiting for login attempts
- Account lockout after failed attempts

### Protected Routes
The following routes require authentication:
- `/dashboard`
- `/tasks`
- `/projects`
- `/settings`
- `/analytics`

### Session Management
- JWT-based authentication
- Token expiration: 1 hour
- Refresh token expiration: 7 days
- Automatic token refresh
- Multiple device support
- Session invalidation on logout

### Security Features
- CSRF protection
- XSS protection
- Secure HTTP-only cookies
- Rate limiting
- Input validation
- Password hashing (backend)
- Session fixation protection

## Demo Access

### Demo Credentials
```
Email: demo@example.com
Password: demo123
```

### Quick Demo
Click the "demo account" button on the login page for instant access without entering credentials.

### Demo Features
- Pre-loaded sample tasks and projects
- All features accessible
- No data persistence (resets on logout)
- No registration required
- Instant access

### Demo Limitations
- Cannot create new users
- Data is not persisted between sessions
- Some features may be simulated
- API endpoints are mocked

## Production Setup

### Authentication
For production deployment, the application requires a backend API server. The frontend will automatically switch to API mode when:
- Using non-demo credentials
- Environment variable `VITE_API_URL` is set
- Valid JWT token is present

### Data Handling
- **Demo Mode**:
  - Uses mock data from `src/lib/mockData.ts`
  - In-memory state management
  - No persistence between sessions
  - Simulated API responses

- **Production Mode**:
  - Real API integration
  - Data persistence
  - User-specific data
  - Real-time updates
  - Full CRUD operations

### API Integration
To switch to production mode:

1. Set environment variables:
   ```env
   VITE_API_URL=your_api_url
   VITE_API_VERSION=v1
   ```

2. Update API configuration:
   ```typescript
   // src/config/api.ts
   export const API_CONFIG = {
     BASE_URL: import.meta.env.VITE_API_URL || '/api',
     VERSION: import.meta.env.VITE_API_VERSION || 'v1',
     TIMEOUT: 30000,
   };
   ```

3. Implement real authentication:
   ```typescript
   // src/services/auth.ts
   export const login = async (credentials) => {
     const response = await api.post('/auth/login', credentials);
     return response.data;
   };
   ```