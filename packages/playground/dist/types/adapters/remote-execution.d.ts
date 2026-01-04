import type { DeviceAction } from '@sqaitech/core';
import type { ExecutionOptions, FormValue, ValidationResult } from '../types';
import { BasePlaygroundAdapter } from './base';
export declare class RemoteExecutionAdapter extends BasePlaygroundAdapter {
    private serverUrl?;
    private progressPolling;
    private progressCallback?;
    private _id?;
    constructor(serverUrl: string);
    get id(): string | undefined;
    validateParams(value: FormValue, action: DeviceAction<unknown> | undefined): ValidationResult;
    parseStructuredParams(action: DeviceAction<unknown>, params: Record<string, unknown>, options: ExecutionOptions): Promise<unknown[]>;
    formatErrorMessage(error: any): string;
    executeAction(actionType: string, value: FormValue, options: ExecutionOptions): Promise<unknown>;
    private executeViaServer;
    private buildOptionalPayloadParams;
    getActionSpace(context?: unknown): Promise<DeviceAction<unknown>[]>;
    checkStatus(): Promise<boolean>;
    overrideConfig(aiConfig: Record<string, unknown>): Promise<void>;
    getTaskProgress(requestId: string): Promise<{
        tip?: string;
    }>;
    cancelTask(requestId: string): Promise<{
        error?: string;
        success?: boolean;
    }>;
    setProgressCallback(callback: (tip: string) => void): void;
    private startProgressPolling;
    private stopProgressPolling;
    getScreenshot(): Promise<{
        screenshot: string;
        timestamp: number;
    } | null>;
    getInterfaceInfo(): Promise<{
        type: string;
        description?: string;
    } | null>;
}
