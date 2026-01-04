import type { DeviceAction } from '@sqaitech/core';
import type { ExecutionOptions, FormValue, PlaygroundAgent } from '../types';
import { BasePlaygroundAdapter } from './base';
export declare class LocalExecutionAdapter extends BasePlaygroundAdapter {
    private agent;
    private taskProgressTips;
    private progressCallback?;
    private readonly _id;
    private currentRequestId?;
    constructor(agent: PlaygroundAgent);
    get id(): string;
    setProgressCallback(callback: (tip: string) => void): void;
    private cleanup;
    parseStructuredParams(action: DeviceAction<unknown>, params: Record<string, unknown>, options: ExecutionOptions): Promise<unknown[]>;
    formatErrorMessage(error: any): string;
    getActionSpace(context?: unknown): Promise<DeviceAction<unknown>[]>;
    checkStatus(): Promise<boolean>;
    overrideConfig(aiConfig: Record<string, unknown>): Promise<void>;
    executeAction(actionType: string, value: FormValue, options: ExecutionOptions): Promise<unknown>;
    getTaskProgress(requestId: string): Promise<{
        tip?: string;
    }>;
    cancelTask(_requestId: string): Promise<{
        error?: string;
        success?: boolean;
    }>;
    getInterfaceInfo(): Promise<{
        type: string;
        description?: string;
    } | null>;
}
