import express, { Application } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.config'
import noteRoutes from './routes/note.routes'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'
import 'dotenv/config'

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Notes API Documentation'
}))

app.use('/api/notes', noteRoutes)

app.use(notFoundHandler)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log('=================================')
  console.log('🚀 Notes API Server Started')
  console.log('=================================')
  console.log(`📡 Server running on: http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  console.log('=================================')
})