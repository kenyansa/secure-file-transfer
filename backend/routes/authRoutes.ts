import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {authMiddleware} from '../middleware/authMiddleware';  // To protect routes

const router = express.Router();

// Secret key for JWT (You should store this in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// In-memory storage for users (for demo purposes)
let users: { [key: string]: { username: string; email: string; password: string } } = {};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        if (users[email]) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to in-memory storage
        users[email] = {
            username,
            email,
            password: hashedPassword
        };

        // Create a payload for JWT token
        const payload = {
            user: {
                email // using email as unique identifier
            }
        };

        // Sign the JWT token and send it to the user
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = users[email];
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a payload for JWT token
        const payload = {
            user: {
                email // using email as unique identifier
            }
        };

        // Sign the JWT token and send it to the user
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/auth/user
// @desc    Get logged-in user details
// @access  Private
router.get('/user', authMiddleware, async (req: Request, res: Response) => {
    try {
        // req.user is set by the authMiddleware
        const user = users[req.user.email]; // Access user by email
        if (user) {
            const { password, ...userData } = user; // Exclude password
            res.json(userData);
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
