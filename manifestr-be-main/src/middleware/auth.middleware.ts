import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Invalid token format'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Invalid or expired token'
        });
    }
};
