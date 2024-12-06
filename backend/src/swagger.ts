import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version,
      description: 'API documentation for Task Manager application',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.taskmanager.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        TaskHistory: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'History entry ID',
            },
            taskId: {
              type: 'integer',
              description: 'Task ID',
            },
            actionType: {
              type: 'string',
              enum: [
                'Created',
                'Updated',
                'StatusChanged',
                'SubtaskAdded',
                'SubtaskCompleted',
                'SubtaskRemoved',
                'PriorityChanged',
                'DueDateChanged',
                'ProjectChanged'
              ],
              description: 'Type of action performed',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the action was performed',
            },
            changes: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field that was changed',
                },
                oldValue: {
                  type: 'string',
                  description: 'Previous value',
                  nullable: true,
                },
                newValue: {
                  type: 'string',
                  description: 'New value',
                  nullable: true,
                },
              },
              description: 'Details of what changed',
            },
            userId: {
              type: 'integer',
              description: 'User who performed the action',
            },
            userName: {
              type: 'string',
              description: 'Name of the user who performed the action',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'Project ID',
            },
            name: {
              type: 'string',
              description: 'Project name',
            },
            description: {
              type: 'string',
              description: 'Project description',
            },
            color: {
              type: 'string',
              description: 'Project color',
            },
            parentId: {
              type: 'integer',
              description: 'Parent project ID',
              nullable: true,
            },
            userId: {
              type: 'integer',
              description: 'User ID who owns the project',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Project creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Project last update timestamp',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId', 'status', 'priority'],
          properties: {
            id: {
              type: 'integer',
              description: 'Task ID',
            },
            title: {
              type: 'string',
              description: 'Task title',
            },
            description: {
              type: 'string',
              description: 'Task description',
              nullable: true,
            },
            projectId: {
              type: 'integer',
              description: 'Project ID the task belongs to',
            },
            status: {
              type: 'string',
              enum: ['TODO', 'IN_PROGRESS', 'DONE'],
              description: 'Task status',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date',
              nullable: true,
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task start date',
              nullable: true,
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task end date',
              nullable: true,
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status',
              default: false,
            },
            userId: {
              type: 'integer',
              description: 'User ID who owns the task',
            },
            subtasks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Subtask',
              },
              description: 'List of subtasks',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp',
            },
          },
        },
        Subtask: {
          type: 'object',
          required: ['title', 'taskId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Subtask ID',
            },
            taskId: {
              type: 'integer',
              description: 'Parent task ID',
            },
            title: {
              type: 'string',
              description: 'Subtask title',
            },
            completed: {
              type: 'boolean',
              description: 'Subtask completion status',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Subtask creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Subtask last update timestamp',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              minLength: 6,
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            token: {
              type: 'string',
              description: 'JWT token',
            },
          },
        },
      },
    },
    paths: {
      '/projects': {
        post: {
          tags: ['Projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Project created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            400: {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Projects'],
          summary: 'Get all projects',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of projects',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Project',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}': {
        get: {
          tags: ['Projects'],
          summary: 'Get a project by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Project ID',
            },
          ],
          responses: {
            200: {
              description: 'Project details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Projects'],
          summary: 'Update a project',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Project updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Projects'],
          summary: 'Delete a project',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Project ID',
            },
          ],
          responses: {
            200: {
              description: 'Project deleted successfully',
            },
            404: {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/tasks': {
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Task created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            400: {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Task',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/project/{projectId}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get tasks by project ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'projectId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Project ID',
            },
          ],
          responses: {
            200: {
              description: 'List of tasks for the project',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Task',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get a task by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
          ],
          responses: {
            200: {
              description: 'Task details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Task updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Task',
                  },
                },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
          ],
          responses: {
            200: {
              description: 'Task deleted successfully',
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/{taskId}/subtasks': {
        post: {
          tags: ['Subtasks'],
          summary: 'Create a new subtask',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Subtask',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Subtask created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Subtask',
                  },
                },
              },
            },
            400: {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/{taskId}/subtasks/{subtaskId}': {
        put: {
          tags: ['Subtasks'],
          summary: 'Update a subtask',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
            {
              name: 'subtaskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Subtask ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Subtask',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Subtask updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Subtask',
                  },
                },
              },
            },
            404: {
              description: 'Subtask not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Subtasks'],
          summary: 'Delete a subtask',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
            {
              name: 'subtaskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Subtask ID',
            },
          ],
          responses: {
            200: {
              description: 'Subtask deleted successfully',
            },
            404: {
              description: 'Subtask not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/tasks/{taskId}/history': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task history',
          description: 'Retrieve the complete history of changes made to a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'Task ID',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 20,
              },
              description: 'Maximum number of history entries to return',
            },
            {
              name: 'offset',
              in: 'query',
              required: false,
              schema: {
                type: 'integer',
                minimum: 0,
                default: 0,
              },
              description: 'Number of history entries to skip',
            },
            {
              name: 'actionType',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: [
                  'Created',
                  'Updated',
                  'StatusChanged',
                  'SubtaskAdded',
                  'SubtaskCompleted',
                  'SubtaskRemoved',
                  'PriorityChanged',
                  'DueDateChanged',
                  'ProjectChanged'
                ],
              },
              description: 'Filter history by action type',
            },
            {
              name: 'startDate',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
              },
              description: 'Filter history entries after this date',
            },
            {
              name: 'endDate',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
              },
              description: 'Filter history entries before this date',
            },
          ],
          responses: {
            200: {
              description: 'Task history retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'integer',
                        description: 'Total number of history entries',
                      },
                      limit: {
                        type: 'integer',
                        description: 'Number of entries per page',
                      },
                      offset: {
                        type: 'integer',
                        description: 'Current offset',
                      },
                      history: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/TaskHistory',
                        },
                        description: 'List of task history entries',
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 