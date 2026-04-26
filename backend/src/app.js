const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../.env');
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log('ℹ️ No .env file found — using system environment variables');
} else {
  console.log('📁 Loaded .env from:', envPath);
}

console.log('🔍 MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduHub API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `Duplicate value for '${field}'` });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format' });
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is undefined — check backend/.env file');
  process.exit(1);
}

// Log the MongoDB host (without credentials) for debugging
try {
  const url = new URL(MONGO_URI);
  console.log('🔗 Connecting to MongoDB host:', url.hostname);
} catch (e) {
  console.log('🔗 Connecting to MongoDB...');
}

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   Health check → /api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('❌ Full error:', JSON.stringify(err, null, 2));
    process.exit(1);
  });

module.exports = app;