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