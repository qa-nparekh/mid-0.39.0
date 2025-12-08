import type { GlobalConfigManager } from './global-config-manager';
import type { IModelConfig, TIntent, TModelConfigFn } from './types';
export type TIntentConfigMap = Record<TIntent, ReturnType<TModelConfigFn> | undefined>;
export declare class ModelConfigManager {
    private modelConfigMap;
    private isolatedMode;
    private globalConfigManager;
    constructor(modelConfigFn?: TModelConfigFn);
    private calcIntentConfigMap;
    private calcModelConfigMapBaseOnIntent;
    private calcModelConfigMapBaseOnEnv;
    /**
     * should only be called by GlobalConfigManager
     */
    clearModelConfigMap(): void;
    /**
     * if isolatedMode is true, modelConfigMap was initialized in constructor and can't be changed
     * if isolatedMode is false, modelConfigMap can be changed by process.env so we need to recalculate it when it's undefined
     */
    getModelConfig(intent: TIntent): IModelConfig;
    getUploadTestServerUrl(): string | undefined;
    registerGlobalConfigManager(globalConfigManager: GlobalConfigManager): void;
    throwErrorIfNonVLModel(intent?: TIntent): void;
}
