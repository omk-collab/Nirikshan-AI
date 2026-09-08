import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import similarRoutes from './routes/similarRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares (Section 53)
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Nirikshan-AI Backend Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
  });
});

// Mount Routes (Section 44)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/similarity', similarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  Nirikshan-AI Backend running on port ${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================`);
  });
};

startServer();

export default app;
