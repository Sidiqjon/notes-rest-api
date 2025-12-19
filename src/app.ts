import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import noteRoutes from './routes/note.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Notes API Documentation'
}));

app.use('/api/notes', noteRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;