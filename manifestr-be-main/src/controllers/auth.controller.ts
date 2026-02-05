import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AppDataSource } from '../lib/data-source';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superrefreshsecret';

interface ApiResponse {
    status: "success" | "error";
    message: string;
    details: any;
}

export class AuthController extends BaseController {
    public basePath = '/auth';

    protected initializeRoutes(): void {
        /**
         * @openapi
         * /auth/signup:
         *   post:
         *     tags: [Auth]
         *     summary: Register a new user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password, first_name, last_name]
         *             properties:
         *               email: { type: string, format: email }
         *               password: { type: string, minLength: 8 }
         *               first_name: { type: string }
         *               last_name: { type: string }
         *               dob: { type: string, format: date }
         *               country: { type: string }
         *               gender: { type: string }
         *               promotional_emails: { type: boolean }
         *     responses:
         *       201:
         *         description: User created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         *       400:
         *         description: Missing required fields
         *       409:
         *         description: User already exists
         * 
         * /auth/login:
         *   post:
         *     tags: [Auth]
         *     summary: Log in with email and password
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password]
         *             properties:
         *               email: { type: string, format: email }
         *               password: { type: string }
         *     responses:
         *       200:
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         *       401:
         *         description: Invalid credentials
         * 
         * /auth/refresh-token:
         *   post:
         *     tags: [Auth]
         *     summary: Refresh access token using rotation
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               refreshToken: { type: string }
         *     responses:
         *       200:
         *         description: Token refreshed
         *       401:
         *         description: No token provided
         *       403:
         *         description: Invalid or expired token
         * 
         * /auth/sessions:
         *   get:
         *     tags: [Auth]
         *     summary: List active device sessions
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of sessions
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         * 
         * /auth/sessions/revoke:
         *   post:
         *     tags: [Auth]
         *     summary: Revoke a specific session
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [sessionId]
         *             properties:
         *               sessionId: { type: number }
         *     responses:
         *       200:
         *         description: Session revoked
         * 
         * /auth/onboarding:
         *   post:
         *     tags: [Auth]
         *     summary: Submit user onboarding details
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [expertise, job_title, industry, goal, work_style, problems]
         *             properties:
         *               expertise: { type: string }
         *               job_title: { type: string }
         *               industry: { type: string }
         *               goal: { type: string, description: "Comma separated values" }
         *               work_style: { type: string, enum: [Team, Solo] }
         *               problems: { type: string, description: "Comma separated values" }
         *     responses:
         *       200:
         *         description: Onboarding completed
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         * 
         * /auth/me:
         *   get:
         *     tags: [Auth]
         *     summary: Get current user profile
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: User profile
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         */
        this.routes = [
            { verb: 'POST', path: '/signup', handler: this.signup },
            { verb: 'POST', path: '/login', handler: this.login },
            { verb: 'POST', path: '/refresh-token', handler: this.refreshToken },
            { verb: 'GET', path: '/sessions', handler: this.getSessions },
            { verb: 'POST', path: '/onboarding', handler: this.submitOnboarding },
            { verb: 'GET', path: '/me', handler: this.getMe },
            { verb: 'GET', path: '/sessions', handler: this.getSessions },
            { verb: 'POST', path: '/sessions/revoke', handler: this.revokeSession },
        ];
    }

    private sendResponse(res: Response, statusCode: number, status: "success" | "error", message: string, details: any = null) {
        const response: ApiResponse = { status, message, details };
        return res.status(statusCode).json(response);
    }

    // ... (signup, login, refreshToken methods remain the same) ...

    private submitOnboarding = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return this.sendResponse(res, 401, 'error', 'Unauthorized');

            const token = authHeader.split(' ')[1];
            const decoded: any = jwt.verify(token, JWT_SECRET);

            const { expertise, job_title, industry, goal, work_style, problems } = req.body;

            if (!expertise || !job_title || !industry || !goal || !work_style || !problems) {
                console.log('There is an error', expertise, job_title, industry, goal, work_style, problems)
                return this.sendResponse(res, 400, 'error', 'Missing required fields');
            }

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { id: decoded.userId } });

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            user.expertise = expertise;
            user.job_title = job_title;
            user.industry = industry;
            user.goal = goal; // Stored as comma-separated string (frontend handles splitting)
            user.work_style = work_style;
            user.problems = problems; // Stored as comma-separated string
            user.onboarding_completed = true;

            await userRepo.save(user);

            return this.sendResponse(res, 200, 'success', 'Onboarding completed', { user: this.sanitizeUser(user) });

        } catch (error) {
            console.error(error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private getMe = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return this.sendResponse(res, 401, 'error', 'Unauthorized');

            const token = authHeader.split(' ')[1];
            const decoded: any = jwt.verify(token, JWT_SECRET);

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { id: decoded.userId } });

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            return this.sendResponse(res, 200, 'success', 'User profile retrieved', { user: this.sanitizeUser(user) });

        } catch (error) {
            return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
        }
    };

    private signup = async (req: Request, res: Response) => {
        try {
            const { email, password, first_name, last_name, dob, country, gender, promotional_emails } = req.body;

            if (!email || !password || !first_name || !last_name) {
                return this.sendResponse(res, 400, 'error', 'Missing required fields');
            }

            const userRepo = AppDataSource.getRepository(User);
            const existingUser = await userRepo.findOne({ where: { email } });

            if (existingUser) {
                return this.sendResponse(res, 409, 'error', 'User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = userRepo.create({
                email,
                password_hash: hashedPassword,
                first_name,
                last_name,
                dob,
                country,
                gender,
                promotional_emails,
                wins_balance: 100
            });

            await userRepo.save(user);

            const { accessToken, refreshToken } = await this.createSession(user, req);

            // Set cookie for refresh token
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

            return this.sendResponse(res, 201, 'success', 'User created successfully', {
                user: this.sanitizeUser(user),
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error(error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return this.sendResponse(res, 400, 'error', 'Email and password are required');
            }

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                return this.sendResponse(res, 401, 'error', 'Invalid credentials');
            }

            const { accessToken, refreshToken } = await this.createSession(user, req);

            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

            return this.sendResponse(res, 200, 'success', 'Login successful', {
                user: this.sanitizeUser(user),
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.error(error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

            if (!refreshToken) {
                return this.sendResponse(res, 401, 'error', 'No refresh token provided');
            }

            try {
                jwt.verify(refreshToken, REFRESH_SECRET);
            } catch (err) {
                return this.sendResponse(res, 403, 'error', 'Invalid refresh token signature');
            }

            const tokenRepo = AppDataSource.getRepository(RefreshToken);
            const storedToken = await tokenRepo.findOne({ where: { token: refreshToken }, relations: ['user'] });

            if (!storedToken || storedToken.revoked || storedToken.expires_at < new Date()) {
                return this.sendResponse(res, 403, 'error', 'Invalid or expired session');
            }

            // Revoke the old token (Rotation)
            storedToken.revoked = true;
            await tokenRepo.save(storedToken);

            // Create new session/token
            const { accessToken, refreshToken: newRefreshToken } = await this.createSession(storedToken.user, req);

            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

            return this.sendResponse(res, 200, 'success', 'Token refreshed', { accessToken, refreshToken: newRefreshToken });

        } catch (error) {
            console.error(error);
            return this.sendResponse(res, 500, 'error', 'Internal server error');
        }
    };

    private getSessions = async (req: Request, res: Response) => {
        try {
            // NOTE: In a real middleware-protected route, req.user would be set.
            // For now, we assume the user must provide valid access token in header to verify identity manually if middleware isn't global.
            // Simplified: Expect userId from query or decode token here for demonstration.
            const authHeader = req.headers.authorization;
            if (!authHeader) return this.sendResponse(res, 401, 'error', 'Unauthorized');

            const token = authHeader.split(' ')[1];
            const decoded: any = jwt.verify(token, JWT_SECRET);

            const tokenRepo = AppDataSource.getRepository(RefreshToken);
            const sessions = await tokenRepo.find({
                where: { user: { id: decoded.userId }, revoked: false },
                order: { last_active: 'DESC' }
            });

            return this.sendResponse(res, 200, 'success', 'Active sessions retrieved', { sessions });

        } catch (error) {
            return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
        }
    };

    private revokeSession = async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.body;
            if (!sessionId) return this.sendResponse(res, 400, 'error', 'Session ID required');

            const tokenRepo = AppDataSource.getRepository(RefreshToken);
            const session = await tokenRepo.findOne({ where: { id: sessionId } });

            if (!session) return this.sendResponse(res, 404, 'error', 'Session not found');

            session.revoked = true;
            await tokenRepo.save(session);

            return this.sendResponse(res, 200, 'success', 'Session revoked');

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error');
        }
    }

    // --- Helpers ---

    private async createSession(user: User, req: Request) {
        const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

        const tokenRepo = AppDataSource.getRepository(RefreshToken);
        const deviceName = req.headers['x-device-name'] as string || this.parseDeviceName(req.headers['user-agent']);
        const ipAddress = (req.ip || req.socket.remoteAddress || '').replace('::ffff:', '');

        const session = tokenRepo.create({
            user,
            token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            device_name: deviceName,
            ip_address: ipAddress,
            user_agent: req.headers['user-agent'] || 'Unknown',
            last_active: new Date()
        });

        await tokenRepo.save(session);

        return { accessToken, refreshToken };
    }

    private parseDeviceName(userAgent: string | undefined): string {
        if (!userAgent) return 'Unknown Device';
        if (userAgent.includes('iPhone')) return 'iPhone';
        if (userAgent.includes('iPad')) return 'iPad';
        if (userAgent.includes('Android')) return 'Android Device';
        if (userAgent.includes('Macintosh')) return 'Mac';
        if (userAgent.includes('Windows')) return 'Windows PC';
        return 'Browser';
    }

    private sanitizeUser(user: User) {
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}
