import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Notes API Server Started');
  console.log('=================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log('=================================');
});