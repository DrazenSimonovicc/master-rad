import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import forumRoutes from './routes/forum.routes';
import lessonPlanRoutes from './routes/lessonPlan.routes';
import homeworkRoutes from './routes/homework.routes';
import testRoutes from './routes/test.routes';
import activityRoutes from './routes/activity.routes';
import classScheduleRoutes from './routes/classSchedule.routes';
import announcementRoutes from './routes/announcement.routes';
import operativePlanRoutes from './routes/operativePlan.routes';
import globalPlanRoutes from './routes/globalPlan.routes';
import subjectRoutes from './routes/subject.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow uploads to be served
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes have stricter rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

app.use('/api/', limiter); // Apply to all API routes
app.use('/api/auth/login', authLimiter); // Stricter limit for login
app.use('/api/auth/signup', authLimiter); // Stricter limit for signup

// CORS - Restrict to specific origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3002',
  // Also allow 127.0.0.1 variants for development
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/lesson-plans', lessonPlanRoutes);
app.use('/api/homeworks', homeworkRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/class-schedules', classScheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/operative-plans', operativePlanRoutes);
app.use('/api/global-plans', globalPlanRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;


