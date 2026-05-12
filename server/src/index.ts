import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import blockRoutes from './routes/blockRoutes';
import authRoutes  from './routes/authRoutes';
import userRoutes  from './routes/userRoutes';

dotenv.config({ path: path.join(__dirname, '../../.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blocks', blockRoutes);
app.use('/api/auth',   authRoutes);
app.use('/api/users',  userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
