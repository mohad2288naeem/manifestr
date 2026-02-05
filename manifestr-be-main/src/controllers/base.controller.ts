import { RequestHandler, Router as ExpressRouter } from 'express';

export interface RouteDefinition {
    verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handler: RequestHandler | RequestHandler[];
    middlewares?: RequestHandler[];
}

export abstract class BaseController {
    public abstract basePath: string;
    public routes: RouteDefinition[];

    private isInitialized = false;

    constructor() {
        this.routes = [];
    }

    protected abstract initializeRoutes(): void;

    public Router() {
        if (!this.isInitialized) {
            this.initializeRoutes();
            this.isInitialized = true;
        }

        const router = ExpressRouter();

        const methodMap: { [key: string]: Function } = {
            get: router.get,
            post: router.post,
            put: router.put,
            delete: router.delete,
            patch: router.patch,
        };

        this.routes.forEach((route: RouteDefinition) => {
            const method = route.verb.toLowerCase();
            if (methodMap[method]) {
                const handlers = Array.isArray(route.handler) ? route.handler : [route.handler];
                const middlewares = route.middlewares || [];
                // Ensure path starts with / and remove basePath if present
                let path = route.path.startsWith('/') ? route.path : `/${route.path}`;
                if (path.startsWith(this.basePath)) {
                    path = path.replace(this.basePath, '');
                }
                // Ensure path starts with / after replacement
                if (!path.startsWith('/')) {
                    path = `/${path}`;
                }
                methodMap[method].call(router, path, ...middlewares, ...handlers);
            }
        });
        return router;
    }
}
