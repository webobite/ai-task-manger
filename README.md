# Task Manager

A modern task management application built with React, TypeScript, and Tailwind CSS.

## Features

### Task Management
- Create, edit, and delete tasks
- Organize tasks with projects
- Add subtasks to break down complex tasks
- Set task priorities (High, Medium, Low)
- Track task status (Todo, In Progress, Completed, Blocked, On Hold)
- Set due dates and track completion
- Automatic start and end date tracking based on status changes

### Project Organization
- Create and manage multiple projects
- Color-coded project identification
- Project-based task filtering
- Expandable/collapsible project tree view
- Track project progress and task completion

### Views and Layouts
1. **Board View (Default)**
   - Kanban-style board layout
   - Drag-and-drop task management
   - Collapsible status columns
   - Quick status updates

2. **Table View**
   - Sortable columns
   - Customizable column visibility
   - Compact task listing
   - Quick actions menu

3. **Analytics Dashboard**
   - Task metrics and KPIs
   - Status distribution charts
   - Priority distribution visualization
   - Project timeline visualization
   - Interactive Gantt chart with:
     - Project and task timelines
     - Expandable project sections
     - Task and subtask hierarchy
     - Detailed task modal with:
       - Task information
       - Project details
       - Status and priority
       - Dates (Start, End, Due)
       - Subtask progress
   - Comprehensive filtering system:
     - Project-based filtering
     - Time range selection (Today, Week, Month, Quarter, Year)
     - Custom date range
     - Filter chips for active filters

### User Interface
- Modern, clean design
- Responsive layout
- Collapsible sidebar
- Dark/Light theme support
- Smooth animations and transitions
- Interactive tooltips and modals
- Visual progress indicators

### Filtering and Search
- Advanced filtering options:
  - By project
  - By status
  - By priority
  - By due date
  - By time range
  - Custom date ranges
- Filter chips for active filters
- Search tasks across projects
- Save filter preferences

### User Management
- User authentication
- Demo user account
- User preferences
- Logout functionality

## Technical Features
- Built with React and TypeScript
- Tailwind CSS for styling
- State management with Zustand
- React Router for navigation
- Date handling with date-fns
- Chart visualizations with Recharts
- Drag and drop with @hello-pangea/dnd
- Responsive design for all screen sizes

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/task-manager.git
```

2. Install dependencies
```bash
cd task-manager
npm install
```

3. Start the development server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/
│   ├── analytics/
│   │   ├── TaskMetrics.tsx
│   │   ├── TaskProgressCharts.tsx
│   │   └── ProjectGanttChart.tsx
│   ├── auth/
│   ├── layout/
│   └── ...
├── store/
├── types/
├── lib/
└── pages/
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.