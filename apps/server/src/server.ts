import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import workoutsRouter, { seedWorkouts } from './routes/workouts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseMode: process.env.MOCK_DB === 'true' ? 'Demo Mode (In-Memory Array)' : 'Production MongoDB',
    timestamp: new Date()
  });
});

// Database Connection Helper
const connectDatabase = async () => {
  if (!MONGODB_URI) {
    console.warn('\n======================================================');
    console.warn('WARNING: MONGODB_URI environment variable not detected.');
    console.warn('Starting fitnessArena server in DEMO MODE (In-Memory).');
    console.warn('======================================================\n');
    process.env.MOCK_DB = 'true';
    return;
  }

  try {
    // Attempt Mongoose connection with a short timeout to prevent hanging the startup
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB successfully!');
    process.env.MOCK_DB = 'false';
    
    // Seed standard workout classes
    await seedWorkouts();
  } catch (error) {
    console.warn('\n======================================================');
    console.warn('WARNING: Failed to connect to MongoDB server.');
    console.warn('Details:', (error as Error).message);
    console.warn('Starting fitnessArena server in DEMO MODE (In-Memory).');
    console.warn('======================================================\n');
    process.env.MOCK_DB = 'true';
  }
};

// Start Server
app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`[fitnessArena Server] running on http://localhost:${PORT}`);
  console.log(`Database Mode: ${process.env.MOCK_DB === 'true' ? 'DEMO' : 'MONGODB'}`);
});
