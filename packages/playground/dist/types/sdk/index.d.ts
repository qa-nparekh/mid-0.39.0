import type { DeviceAction } from '@sqaitech/core';
import type { ExecutionOptions, FormValue, PlaygroundConfig, ValidationResult } from '../types';
export declare class PlaygroundSDK {
    private adapter;
    constructor(config: PlaygroundConfig);
    private createAdapter;
    executeAction(actionType: string, value: FormValue, options: ExecutionOptions): Promise<unknown>;
    getActionSpace(context?: unknown): Promise<DeviceAction<unknown>[]>;
    validateStructuredParams(value: FormValue, action: DeviceAction<unknown> | undefined): ValidationResult;
    formatErrorMessage(error: any): string;
    createDisplayContent(value: FormValue, needsStructuredParams: boolean, action: DeviceAction<unknown> | undefined): string;
    get id(): string | undefined;
    checkStatus(): Promise<boolean>;
    overrideConfig(aiConfig: any): Promise<void>;
    getTaskProgress(requestId: string): Promise<{
        tip?: string;
    }>;
    cancelTask(requestId: string): Promise<any>;
    onProgressUpdate(callback: (tip: string) => void): void;
    startProgressPolling(requestId: string): void;
    stopProgressPolling(requestId: string): void;
    cancelExecution(requestId: string): Promise<void>;
    getScreenshot(): Promise<{
        screenshot: string;
        timestamp: number;
    } | null>;
    getInterfaceInfo(): Promise<{
        type: string;
        description?: string;
    } | null>;
}
