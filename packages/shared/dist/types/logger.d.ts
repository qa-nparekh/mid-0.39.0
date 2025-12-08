export type DebugFunction = (...args: unknown[]) => void;
export declare function getDebug(topic: string): DebugFunction;
export declare function enableDebug(topic: string): void;
export declare function cleanupLogStreams(): void;
