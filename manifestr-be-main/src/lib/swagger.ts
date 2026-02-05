import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Manifestr API',
        version: '1.0.0',
    },
    servers: [
        { url: 'http://localhost:31981' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        enum: ['success', 'error'],
                    },
                    message: {
                        type: 'string',
                    },
                    details: {
                        type: 'object',
                        nullable: true,
                    },
                },
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: ['src/app.ts', 'src/controllers/*.ts'],
};

export function setupSwagger(app: Application) {
    const swaggerSpec = swaggerJSDoc(options as any);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

