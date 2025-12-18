import app from './app';

/**
 * Server configuration and startup
 * 
 * Separating server.ts from app.ts allows:
 * - Testing app without starting server
 * - Multiple server instances (testing, staging)
 * - Different port configurations
 */

const PORT = process.env.PORT || 3000;

/**
 * Start Express server
 * 
 * STARTUP SEQUENCE:
 * 1. Load environment variables
 * 2. Initialize Express app
 * 3. Start listening on port
 * 4. Log server information
 */
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Notes API Server Started');
  console.log('=================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📝 API Endpoints: http://localhost:${PORT}/api/notes`);
  console.log('=================================');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Press CTRL+C to stop');
  console.log('=================================');
});

/**
 * Graceful shutdown handler
 * Ensures clean server shutdown on SIGTERM/SIGINT
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});