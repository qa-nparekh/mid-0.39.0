import type { Server } from 'node:http';
import type { Agent as PageAgent } from '@sqaitech/core/agent';
import express from 'express';
import 'dotenv/config';
declare class PlaygroundServer {
    private _app;
    tmpDir: string;
    server?: Server;
    port?: number | null;
    agent: PageAgent;
    staticPath: string;
    taskProgressTips: Record<string, string>;
    id: string;
    private _initialized;
    private agentFactory?;
    private currentTaskId;
    constructor(agent: PageAgent | (() => PageAgent) | (() => Promise<PageAgent>), staticPath?: string, id?: string);
    /**
     * Get the Express app instance for custom configuration
     *
     * IMPORTANT: Add middleware (like CORS) BEFORE calling launch()
     * The routes are initialized when launch() is called, so middleware
     * added after launch() will not affect the API routes.
     *
     * @example
     * ```typescript
     * import cors from 'cors';
     *
     * const server = new PlaygroundServer(agent);
     *
     * // Add CORS middleware before launch
     * server.app.use(cors({
     *   origin: true,
     *   credentials: true,
     *   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
     * }));
     *
     * await server.launch();
     * ```
     */
    get app(): express.Application;
    /**
     * Initialize Express app with all routes and middleware
     * Called automatically by launch() if not already initialized
     */
    private initializeApp;
    filePathForUuid(uuid: string): string;
    saveContextFile(uuid: string, context: string): string;
    /**
     * Recreate agent instance (for cancellation)
     */
    private recreateAgent;
    /**
     * Setup all API routes
     */
    private setupRoutes;
    /**
     * Setup static file serving routes
     */
    private setupStaticRoutes;
    /**
     * Serve HTML with injected port configuration
     */
    private serveHtmlWithPorts;
    /**
     * Launch the server on specified port
     */
    launch(port?: number): Promise<PlaygroundServer>;
    /**
     * Close the server and clean up resources
     */
    close(): Promise<void>;
}
export default PlaygroundServer;
export { PlaygroundServer };
