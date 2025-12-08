import type { IModelConfig, TIntent } from './types';
import { DEFAULT_MODEL_CONFIG_KEYS, DEFAULT_MODEL_CONFIG_KEYS_LEGACY, GROUNDING_MODEL_CONFIG_KEYS, PLANNING_MODEL_CONFIG_KEYS, VQA_MODEL_CONFIG_KEYS } from './constants';
type TModelConfigKeys = typeof VQA_MODEL_CONFIG_KEYS | typeof GROUNDING_MODEL_CONFIG_KEYS | typeof PLANNING_MODEL_CONFIG_KEYS | typeof DEFAULT_MODEL_CONFIG_KEYS | typeof DEFAULT_MODEL_CONFIG_KEYS_LEGACY;
/**
 * Choose OpenAI SDK config, such as OpenAI, AzureOpenAI, AnthropicSDK, etc.
 */
export declare const decideOpenaiSdkConfig: ({ keys, provider, valueAssert, }: {
    keys: TModelConfigKeys;
    provider: Record<string, string | undefined>;
    valueAssert: (value: string | undefined, key: string, modelVendorFlag?: string) => void;
}) => Omit<IModelConfig, "modelName" | "from" | "vlMode" | "uiTarsVersion" | "modelDescription" | "intent">;
export declare const decideModelConfigFromIntentConfig: (intent: TIntent, intentConfig: Record<string, string | undefined>) => IModelConfig;
export declare const decideModelConfigFromEnv: (intent: TIntent, allEnvConfig: Record<string, string | undefined>) => IModelConfig;
export {};
