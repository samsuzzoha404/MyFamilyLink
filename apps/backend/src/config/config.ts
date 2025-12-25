import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // URLs
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  citizenUrl: process.env.CITIZEN_URL || 'http://localhost:5174',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  sessionSecret: process.env.SESSION_SECRET || 'change-this-session-secret',
  
  // MyKad NFC
  mykadApiKey: process.env.MYKAD_API_KEY || '',
  mykadApiUrl: process.env.MYKAD_API_URL || '',
  
  // Zero-Knowledge Proofs
  zkVerifierUrl: process.env.ZK_VERIFIER_URL || 'http://localhost:8080',
  zkProverUrl: process.env.ZK_PROVER_URL || 'http://localhost:8081',
  
  // Email
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};
