import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Routes
import authRoutes from './routes/authRoutes'; // Using Prisma version with OTP
import universityRoutes from './routes/universityRoutes';
import postRoutes from './routes/postRoutes';
import replyRoutes from './routes/replyRoutes';
import verificationRoutes from './routes/verificationRoutes';
import testRoutes from './routes/testRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy - needed for rate limiting to work correctly behind nginx
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (SRS: File Storage)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/test', testRoutes); // Test endpoints

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
