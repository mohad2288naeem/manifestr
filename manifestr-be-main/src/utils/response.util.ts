import { Response } from 'express';

export type ResponseStatus = 'success' | 'error';

export interface ApiResponse {
    status: ResponseStatus;
    message: string;
    details?: any;
}

export class ResponseUtil {
    static success(res: Response, message: string, details?: any, statusCode: number = 200): Response {
        return res.status(statusCode).json({
            status: 'success' as const,
            message,
            details: details !== undefined ? details : null,
        });
    }

    static error(res: Response, message: string, details?: any, statusCode: number = 500): Response {
        return res.status(statusCode).json({
            status: 'error' as const,
            message,
            details: details !== undefined ? details : null,
        });
    }

    // Convenience methods for common status codes
    static badRequest(res: Response, message: string, details?: any): Response {
        return this.error(res, message, details, 400);
    }

    static unauthorized(res: Response, message: string, details?: any): Response {
        return this.error(res, message, details, 401);
    }

    static conflict(res: Response, message: string, details?: any): Response {
        return this.error(res, message, details, 409);
    }

    static internalError(res: Response, message: string = 'Internal server error', details?: any): Response {
        return this.error(res, message, details, 500);
    }

    static serviceUnavailable(res: Response, message: string, details?: any): Response {
        return this.error(res, message, details, 503);
    }
}

