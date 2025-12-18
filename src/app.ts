import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import noteRoutes from './routes/note.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

/**
 * Express application setup
 * 
 * MIDDLEWARE ORDER IS CRITICAL:
 * 1. CORS - must be first to handle preflight requests
 * 2. JSON parser - parses request bodies
 * 3. Routes - handle API endpoints
 * 4. 404 handler - catches undefined routes
 * 5. Error handler - catches all errors (must be last)
 */

const app: Application = express();

/**
 * CORS Configuration
 * Allows requests from any origin in development
 * In production, restrict to specific domains
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body parsing middleware
 * - Parses JSON request bodies
 * - 10mb limit to prevent large payloads
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Swagger UI Documentation
 * Access at: http://localhost:3000/api-docs
 * 
 * WHY SWAGGER:
 * - Interactive API testing
 * - Clear documentation for frontend developers
 * - Professional presentation
 * - Industry standard
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Notes API Documentation'
}));

/**
 * API Routes
 * All note-related endpoints are under /api/notes
 * 
 * Available routes:
 * - POST   /api/notes          - Create note
 * - GET    /api/notes          - List notes (with pagination/search)
 * - GET    /api/notes/:id      - Get single note
 * - PUT    /api/notes/:id      - Update note
 * - DELETE /api/notes/:id      - Delete note
 */
app.use('/api/notes', noteRoutes);

/**
 * 404 Handler
 * Catches all requests to undefined routes
 * MUST be placed after all valid routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * Catches all errors from routes and middleware
 * MUST be the last middleware
 * 
 * Error types handled:
 * - Validation errors (400)
 * - Not found errors (404)
 * - Internal server errors (500)
 * - Custom AppError instances
 */
app.use(errorHandler);

export default app;