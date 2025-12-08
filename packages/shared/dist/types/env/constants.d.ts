interface IModelConfigKeys {
    modelName: string;
    /**
     * proxy
     */
    socksProxy: string;
    httpProxy: string;
    /**
     * OpenAI
     */
    openaiBaseURL: string;
    openaiApiKey: string;
    openaiExtraConfig: string;
    /**
     * Azure
     */
    openaiUseAzureDeprecated: string;
    useAzureOpenai: string;
    azureOpenaiScope: string;
    azureOpenaiKey: string;
    azureOpenaiEndpoint: string;
    azureOpenaiApiVersion: string;
    azureOpenaiDeployment: string;
    azureExtraConfig: string;
    /**
     * Anthropic
     */
    useAnthropicSdk: string;
    anthropicApiKey: string;
    /**
     * Extra
     */
    vlMode: string;
}
export declare const VQA_MODEL_CONFIG_KEYS: IModelConfigKeys;
export declare const GROUNDING_MODEL_CONFIG_KEYS: IModelConfigKeys;
export declare const PLANNING_MODEL_CONFIG_KEYS: IModelConfigKeys;
export declare const DEFAULT_MODEL_CONFIG_KEYS: IModelConfigKeys;
export declare const DEFAULT_MODEL_CONFIG_KEYS_LEGACY: IModelConfigKeys;
export {};
