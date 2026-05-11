import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import blockRoutes from './routes/blockRoutes';
import userRoutes from './routes/userRoutes';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blocks', blockRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
