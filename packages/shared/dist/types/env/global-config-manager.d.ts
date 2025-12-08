import type { ModelConfigManager } from './model-config-manager';
import { BOOLEAN_ENV_KEYS, GLOBAL_ENV_KEYS, NUMBER_ENV_KEYS, STRING_ENV_KEYS } from './types';
import { MODEL_ENV_KEYS } from './types';
/**
 * Collect global configs from process.env, overrideAIConfig, etc.
 * And provider methods to get merged config value
 */
export declare class GlobalConfigManager {
    private override;
    private keysHaveBeenRead;
    private globalModelConfigManager;
    constructor();
    /**
     * recalculate allEnvConfig every time because process.env can be updated any time
     */
    getAllEnvConfig(): Record<string, string | undefined>;
    getEnvConfigValue(key: (typeof STRING_ENV_KEYS)[number]): string | undefined;
    /**
     * read number only from process.env
     */
    getEnvConfigInNumber(key: (typeof NUMBER_ENV_KEYS)[number]): number;
    /**
     * read boolean only from process.env
     */
    getEnvConfigInBoolean(key: (typeof BOOLEAN_ENV_KEYS)[number]): boolean;
    registerModelConfigManager(globalModelConfigManager: ModelConfigManager): void;
    /**
     * for overrideAIConfig
     * can only override keys in MODEL_ENV_KEYS
     */
    overrideAIConfig(newConfig: Partial<Record<(typeof GLOBAL_ENV_KEYS)[number] | (typeof MODEL_ENV_KEYS)[number], string>>, extendMode?: boolean): void;
}
