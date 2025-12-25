import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import apiRoutes from './routes/api.routes';

const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow citizen and admin frontends
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'MyFamilyLink Privacy-Preserving Aid Distribution Engine',
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    app.listen(PORT, () => {
      console.log('\n🚀 ════════════════════════════════════════════════════════');
      console.log(`   MyFamilyLink Backend Server`);
      console.log(`   Privacy-Preserving Aid Distribution Engine`);
      console.log('   ════════════════════════════════════════════════════════');
      console.log(`   🌐 Server running on: http://localhost:${PORT}`);
      console.log(`   📊 Health check: http://localhost:${PORT}/health`);
      console.log(`   🔐 Privacy Mode: Active (Zero-Knowledge Simulation)`);
      console.log('   ════════════════════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
