import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Check if the decoded token is a JwtPayload and contains the email
      if (typeof decoded === 'object' && decoded !== null && 'email' in decoded) {
        req.user = decoded as JwtPayload & { email: string }; // Safely cast with email field
        next();
      } else {
        return res.sendStatus(403); 
      }
    });
  } else {
    res.sendStatus(401); 
  }
};
