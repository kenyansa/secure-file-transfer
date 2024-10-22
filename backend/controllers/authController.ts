import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In-memory users database (for demo purposes)
const users: { username: string; password: string }[] = [];

const JWT_SECRET = 'your_jwt_secret'; // In a real app, store this securely in an environment variable.

// Register a new user
export const registerUser = (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  
  res.status(201).json({ message: 'User registered successfully' });
};

// User login
export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  
  res.status(200).json({ token });
};
