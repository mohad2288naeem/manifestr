import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './lib/data-source';
import { setupSwagger } from './lib/swagger';
import { BaseController } from './controllers/base.controller';
import { AuthController } from './controllers/auth.controller';
import { AIController } from './controllers/ai.controller';
import { DocumentGeneratorController } from './controllers/document.generator.controller';
import { UploadController } from './controllers/upload.controller';
import { VaultController } from './controllers/vault.controller';
import { StyleGuideController } from './controllers/style-guide.controller';

class App {
    public app: Application;
    public port: number = 31981;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || this.port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeControllers();
        setupSwagger(this.app);
    }

    public listen(cb?: () => void) {
        this.app.listen(this.port, cb);
    }

    private initializeMiddlewares() {
        // Configure CORS
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
            : ['http://localhost:5173', 'http://localhost:3000', `http://localhost:${this.port}`];

        this.app.use(
            cors({
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);

                    if (allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        // For development, you might want to allow all:
                        callback(null, true);
                        // callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            })
        );

        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private initializeControllers() {
        const controllers: BaseController[] = [
            new AuthController(),
            new DocumentGeneratorController(),
            new AIController(),
            new UploadController(),
            new VaultController(),
            new StyleGuideController(),
        ];

        controllers.forEach((controller) => {
            this.app.use(controller.basePath, controller.Router());
        });
    }

    private initializeRoutes() {
        /**
         * @openapi
         * /health:
         *   get:
         *     tags: [Health]
         *     summary: Health check endpoint
         *     description: Returns the health status of the application and database connection
         *     responses:
         *       200:
         *         description: Application is healthy and database is connected
         *       503:
         *         description: Application is unhealthy or database is not connected
         */
        this.app.get('/health', async (req: Request, res: Response) => {
            try {
                const isConnected = AppDataSource.isInitialized;
                if (isConnected) {
                    await AppDataSource.query('SELECT 1');
                    return res.json({
                        status: 'success',
                        message: 'Application is healthy',
                        details: { database: 'connected' },
                    });
                } else {
                    return res.status(503).json({
                        status: 'error',
                        message: 'Application is unhealthy',
                        details: { database: 'not connected' },
                    });
                }
            } catch (error) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Database connection error',
                    details: {
                        error: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });

        this.app.get('/', (req: Request, res: Response) => {
            res.send('Manifestr API is running');
        });
    }
}

export default App;
