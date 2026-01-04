import type { Agent } from '@sqaitech/core/agent';
import PlaygroundServer from './server';
export interface LaunchPlaygroundOptions {
    /**
     * Port to start the playground server on
     * @default 5800
     */
    port?: number;
    /**
     * Whether to automatically open the playground in browser
     * @default true
     */
    openBrowser?: boolean;
    /**
     * Custom browser command to open playground
     * @default 'open' on macOS, 'start' on Windows, 'xdg-open' on Linux
     */
    browserCommand?: string;
    /**
     * Whether to show server logs
     * @default true
     */
    verbose?: boolean;
    /**
     * Fixed ID for the playground server instance
     * If provided, the same ID will be used across restarts,
     * allowing chat history to persist
     * @default undefined (generates random UUID)
     */
    id?: string;
    /**
     * Whether to enable CORS (Cross-Origin Resource Sharing)
     * @default false
     */
    enableCors?: boolean;
    /**
     * CORS configuration options
     * @default { origin: '*', credentials: true } when enableCors is true
     */
    corsOptions?: {
        origin?: string | boolean | string[];
        credentials?: boolean;
        methods?: string[];
        allowedHeaders?: string[];
    };
}
export interface LaunchPlaygroundResult {
    /**
     * The playground server instance
     */
    server: PlaygroundServer;
    /**
     * The server port
     */
    port: number;
    /**
     * The server host
     */
    host: string;
    /**
     * Function to gracefully shutdown the playground
     */
    close: () => Promise<void>;
}
/**
 * Create a playground launcher for a specific agent
 *
 * @example
 * ```typescript
 * import { playgroundForAgent } from '@sqaitech/playground';
 * import { SampleDevice, Agent } from '@sqaitech/core';
 *
 * const device = new SampleDevice();
 * const agent = new Agent(device);
 *
 * // Launch playground for the agent
 * const server = await playgroundForAgent(agent).launch();
 *
 * // Launch with CORS enabled
 * const serverWithCors = await playgroundForAgent(agent).launch({
 *   enableCors: true,
 *   corsOptions: {
 *     origin: ['http://localhost:3000', 'http://localhost:8080'],
 *     credentials: true
 *   }
 * });
 *
 * // Later, when you want to shutdown:
 * server.close();
 * ```
 */
export declare function playgroundForAgent(agent: Agent): {
    /**
     * Launch the playground server with optional configuration
     */
    launch(options?: LaunchPlaygroundOptions): Promise<LaunchPlaygroundResult>;
};
