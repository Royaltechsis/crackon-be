import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Crackon Backend API',
    version: '1.0.0',
    description: 'Auto-generated Swagger documentation for the Crackon Backend API.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
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
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          role: {
            type: 'string',
            description: 'Optional role: customer, artisan, or admin',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      ArtisanProfile: {
        type: 'object',
        properties: {
          bio: { type: 'string' },
          location: { type: 'string' },
          skills: {
            type: 'array',
            items: { type: 'string' },
          },
          phone: { type: 'string' },
          website: { type: 'string' },
          portfolio: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      CreateServiceRequest: {
        type: 'object',
        required: ['title', 'description', 'category', 'price'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          duration: { type: 'string' },
          location: { type: 'string' },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          published: { type: 'boolean' },
        },
      },
      Service: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          duration: { type: 'string' },
          location: { type: 'string' },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          published: { type: 'boolean' },
          artisan: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              profile: { $ref: '#/components/schemas/ArtisanProfile' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Listing: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          budget: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
            },
          },
          duration: { type: 'string' },
          location: { type: 'string' },
          skills: {
            type: 'array',
            items: { type: 'string' },
          },
          customer: { type: 'string' },
          status: {
            type: 'string',
            enum: ['open', 'in-progress', 'completed', 'cancelled'],
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          listing: { type: 'string' },
          artisan: { type: 'string' },
          proposedBudget: { type: 'number' },
          coverLetter: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Milestone: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['pending', 'completed'],
          },
          completedDate: { type: 'string', format: 'date-time' },
        },
      },
      ProjectUpdate: {
        type: 'object',
        properties: {
          artisan: { type: 'string' },
          message: { type: 'string' },
          attachments: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          listing: { type: 'string' },
          customer: { type: 'string' },
          artisan: { type: 'string' },
          application: { type: 'string' },
          agreementBudget: { type: 'number' },
          status: {
            type: 'string',
            enum: ['active', 'in-progress', 'completed', 'cancelled', 'disputed'],
          },
          progress: { type: 'number' },
          startDate: { type: 'string', format: 'date-time' },
          dueDate: { type: 'string', format: 'date-time' },
          completionDate: { type: 'string', format: 'date-time' },
          milestones: {
            type: 'array',
            items: { $ref: '#/components/schemas/Milestone' },
          },
          updates: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProjectUpdate' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/index.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
