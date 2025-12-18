import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI configuration
 * 
 * WHY SWAGGER:
 * - Auto-generated API documentation
 * - Interactive testing interface
 * - Clear API contract for frontend developers
 * - Professional presentation
 * - Industry standard
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API - DanAds Internship Task',
      version: '1.0.0',
      description: `
        A RESTful API for managing notes with full CRUD operations.
        
        **Features:**
        - Create, read, update, and delete notes
        - Pagination support for listing notes
        - Keyword search in titles and content
        - Input validation with detailed error messages
        - Centralized error handling
        - Timestamps in Uzbekistan timezone (UTC+5)
        
        **Technical Stack:**
        - Node.js + Express
        - TypeScript
        - express-validator for validation
        - Swagger for documentation
      `,
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Notes',
        description: 'Note management endpoints'
      }
    ],
    paths: {
      '/api/notes': {
        post: {
          tags: ['Notes'],
          summary: 'Create a new note',
          description: 'Creates a new note with title and content',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateNoteDto'
                },
                example: {
                  title: 'Meeting Notes',
                  content: 'Discussed Q4 goals and project timeline'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Note created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '500': {
              $ref: '#/components/responses/InternalServerError'
            }
          }
        },
        get: {
          tags: ['Notes'],
          summary: 'Get all notes with pagination and search',
          description: 'Retrieves a paginated list of notes with optional search functionality',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number (default: 1)',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1
              }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page (default: 10, max: 100)',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10
              }
            },
            {
              name: 'search',
              in: 'query',
              description: 'Search keyword in title or content',
              required: false,
              schema: {
                type: 'string',
                maxLength: 100
              }
            }
          ],
          responses: {
            '200': {
              description: 'Notes retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PaginatedResponse'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '500': {
              $ref: '#/components/responses/InternalServerError'
            }
          }
        }
      },
      '/api/notes/{id}': {
        get: {
          tags: ['Notes'],
          summary: 'Get a single note by ID',
          description: 'Retrieves a specific note by its UUID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Note UUID',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Note retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '404': {
              $ref: '#/components/responses/NotFound'
            },
            '500': {
              $ref: '#/components/responses/InternalServerError'
            }
          }
        },
        patch: {
          tags: ['Notes'],
          summary: 'Update a note (partial update)',
          description: 'Updates an existing note. Only provided fields will be updated.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Note UUID',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateNoteDto'
                },
                example: {
                  title: 'Updated Meeting Notes'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Note updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '404': {
              $ref: '#/components/responses/NotFound'
            },
            '500': {
              $ref: '#/components/responses/InternalServerError'
            }
          }
        },
        delete: {
          tags: ['Notes'],
          summary: 'Delete a note',
          description: 'Deletes a note and returns the deleted note data',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Note UUID',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Note deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '404': {
              $ref: '#/components/responses/NotFound'
            },
            '500': {
              $ref: '#/components/responses/InternalServerError'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the note',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Note title',
              example: 'Meeting Notes'
            },
            content: {
              type: 'string',
              maxLength: 10000,
              description: 'Note content',
              example: 'Discussed Q4 goals and project timeline'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp in Uzbekistan timezone (UTC+5)',
              example: '2024-12-18T15:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp in Uzbekistan timezone (UTC+5)',
              example: '2024-12-18T15:30:00.000Z'
            }
          }
        },
        CreateNoteDto: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Note title (3-100 characters)',
              example: 'Meeting Notes'
            },
            content: {
              type: 'string',
              maxLength: 10000,
              description: 'Note content (max 10000 characters)',
              example: 'Discussed Q4 goals and project timeline'
            }
          }
        },
        UpdateNoteDto: {
          type: 'object',
          minProperties: 1,
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Updated note title (optional)',
              example: 'Updated Meeting Notes'
            },
            content: {
              type: 'string',
              maxLength: 10000,
              description: 'Updated note content (optional)',
              example: 'Updated content with new information'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              $ref: '#/components/schemas/Note'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Notes retrieved successfully'
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Note'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 50
                },
                totalPages: {
                  type: 'integer',
                  example: 5
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            },
            statusCode: {
              type: 'integer',
              example: 400
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'title'
                  },
                  message: {
                    type: 'string',
                    example: 'Title must be between 3 and 100 characters'
                  },
                  value: {
                    type: 'string',
                    example: 'ab'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Note with id 123 not found',
                statusCode: 404
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Internal Server Error',
                message: 'Something went wrong on the server',
                statusCode: 500
              }
            }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);