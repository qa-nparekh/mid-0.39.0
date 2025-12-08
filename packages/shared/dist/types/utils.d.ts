export declare const ifInBrowser: boolean;
export declare const ifInWorker: boolean;
export declare const ifInNode: string | false;
export declare function uuid(): string;
export declare function generateHashId(rect: any, content?: string): string;
/**
 * A utility function that asserts a condition and throws an error with a message if the condition is false.
 *
 * @param condition - The condition to assert
 * @param message - The error message to throw if the condition is false
 * @throws Error with the provided message if the condition is false
 */
export declare function assert(condition: any, message?: string): asserts condition;
type GlobalScope = typeof window | typeof globalThis | typeof self | undefined;
export declare function getGlobalScope(): GlobalScope;
export declare function setIsMcp(value: boolean): void;
export declare function logMsg(...message: Parameters<typeof console.log>): void;
export declare function repeat(times: number, fn: (index: number) => Promise<void>): Promise<void>;
export declare const escapeScriptTag: (html: string) => string;
export declare const antiEscapeScriptTag: (html: string) => string;
export declare function replaceIllegalPathCharsAndSpace(str: string): string;
export {};
