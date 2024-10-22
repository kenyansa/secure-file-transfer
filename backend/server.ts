import express, { Request, Response } from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes';
import { registerUser, loginUser } from './controllers/authController';

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// File routes
app.use('/api/files', fileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Secure File Transfer App Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
