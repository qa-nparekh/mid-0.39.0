import { DEFAULT_MODEL_CONFIG_KEYS, DEFAULT_MODEL_CONFIG_KEYS_LEGACY, GROUNDING_MODEL_CONFIG_KEYS, PLANNING_MODEL_CONFIG_KEYS, VQA_MODEL_CONFIG_KEYS } from "./constants.mjs";
import { getDebug } from "../logger.mjs";
import { assert } from "../utils.mjs";
import { createAssert, maskConfig, parseJson } from "./helper.mjs";
import { initDebugConfig } from "./init-debug.mjs";
import { parseVlModeAndUiTarsFromGlobalConfig, parseVlModeAndUiTarsModelVersionFromRawValue } from "./parse.mjs";
const KEYS_MAP = {
    VQA: VQA_MODEL_CONFIG_KEYS,
    grounding: GROUNDING_MODEL_CONFIG_KEYS,
    planning: PLANNING_MODEL_CONFIG_KEYS,
    default: DEFAULT_MODEL_CONFIG_KEYS
};
const decideOpenaiSdkConfig = ({ keys, provider, valueAssert })=>{
    initDebugConfig();
    const debugLog = getDebug('ai:config');
    const socksProxy = provider[keys.socksProxy];
    const httpProxy = provider[keys.httpProxy];
    const vlMode = provider[keys.vlMode];
    debugLog('enter decideOpenaiSdkConfig with keys:', keys);
    if (provider[keys.openaiUseAzureDeprecated]) {
        debugLog(`provider has ${keys.openaiUseAzureDeprecated} with value${provider[keys.openaiUseAzureDeprecated]}`);
        const openaiBaseURL = provider[keys.openaiBaseURL];
        const openaiApiKey = provider[keys.openaiApiKey];
        const openaiExtraConfig = parseJson(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
        valueAssert(openaiApiKey, keys.openaiApiKey, keys.openaiUseAzureDeprecated);
        return {
            socksProxy,
            httpProxy,
            vlModeRaw: vlMode,
            openaiUseAzureDeprecated: true,
            openaiApiKey,
            openaiBaseURL,
            openaiExtraConfig
        };
    }
    if (provider[keys.useAzureOpenai]) {
        debugLog(`provider has ${keys.useAzureOpenai} with value ${provider[keys.useAzureOpenai]}`);
        const azureOpenaiScope = provider[keys.azureOpenaiScope];
        const azureOpenaiKey = provider[keys.azureOpenaiKey];
        const azureOpenaiEndpoint = provider[keys.azureOpenaiEndpoint];
        const azureOpenaiDeployment = provider[keys.azureOpenaiDeployment];
        const azureOpenaiApiVersion = provider[keys.azureOpenaiApiVersion];
        const azureExtraConfig = parseJson(keys.azureExtraConfig, provider[keys.azureExtraConfig]);
        const openaiExtraConfig = parseJson(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
        valueAssert(azureOpenaiKey, keys.azureOpenaiKey, keys.useAzureOpenai);
        return {
            socksProxy,
            httpProxy,
            vlModeRaw: vlMode,
            useAzureOpenai: true,
            azureOpenaiScope,
            azureOpenaiKey,
            azureOpenaiEndpoint,
            azureOpenaiDeployment,
            azureOpenaiApiVersion,
            azureExtraConfig,
            openaiExtraConfig
        };
    }
    if (provider[keys.useAnthropicSdk]) {
        debugLog(`provider has ${keys.useAnthropicSdk} with value ${provider[keys.useAnthropicSdk]}`);
        const anthropicApiKey = provider[keys.anthropicApiKey];
        valueAssert(anthropicApiKey, keys.anthropicApiKey, keys.useAnthropicSdk);
        return {
            socksProxy,
            httpProxy,
            useAnthropicSdk: true,
            anthropicApiKey
        };
    }
    {
        debugLog('provider has no specific model SDK declared');
        const openaiBaseURL = provider[keys.openaiBaseURL];
        const openaiApiKey = provider[keys.openaiApiKey];
        const openaiExtraConfig = parseJson(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
        valueAssert(openaiApiKey, keys.openaiApiKey);
        return {
            socksProxy,
            httpProxy,
            vlModeRaw: vlMode,
            openaiBaseURL,
            openaiApiKey,
            openaiExtraConfig
        };
    }
};
const getModelDescription = (vlMode, uiTarsVersion)=>{
    if (vlMode) if (uiTarsVersion) return `UI-TARS=${uiTarsVersion}`;
    else return `${vlMode} mode`;
    return '';
};
const decideModelConfigFromIntentConfig = (intent, intentConfig)=>{
    const debugLog = getDebug('ai:config');
    debugLog('decideModelConfig base on agent.modelConfig()');
    const keysForFn = KEYS_MAP[intent];
    const candidateModelNameFromConfig = intentConfig[keysForFn.modelName];
    debugLog('Got modelName from modelConfigFn', candidateModelNameFromConfig);
    const chosenKeys = (()=>{
        if (candidateModelNameFromConfig) {
            debugLog('query modelConfig from fn by intent got corresponding modelName, will get other corresponding keys');
            return keysForFn;
        }
        debugLog('query modelConfig from fn by intent got no corresponding modelName, will get other keys by default');
        assert(intentConfig[DEFAULT_MODEL_CONFIG_KEYS.modelName], `The return value of agent.modelConfig do not have a valid value with key ${DEFAULT_MODEL_CONFIG_KEYS.modelName}.`);
        return DEFAULT_MODEL_CONFIG_KEYS;
    })();
    const result = decideOpenaiSdkConfig({
        keys: chosenKeys,
        provider: intentConfig,
        valueAssert: createAssert(chosenKeys.modelName, 'modelConfig', candidateModelNameFromConfig)
    });
    const { vlMode, uiTarsVersion } = parseVlModeAndUiTarsModelVersionFromRawValue(result.vlModeRaw);
    const modelDescription = getModelDescription(vlMode, uiTarsVersion);
    const finalResult = {
        ...result,
        modelName: intentConfig[chosenKeys.modelName],
        vlMode,
        uiTarsModelVersion: uiTarsVersion,
        modelDescription,
        from: 'modelConfig',
        intent
    };
    debugLog(`decideModelConfig result by agent.modelConfig() with intent ${intent}:`, maskConfig(finalResult));
    return finalResult;
};
const decideModelConfigFromEnv = (intent, allEnvConfig)=>{
    initDebugConfig();
    const debugLog = getDebug('ai:config');
    const keysForEnv = 'default' === intent ? DEFAULT_MODEL_CONFIG_KEYS_LEGACY : KEYS_MAP[intent];
    if ('default' !== intent && allEnvConfig[keysForEnv.modelName]) {
        const modelName = allEnvConfig[keysForEnv.modelName];
        debugLog(`Got intent ${intent} corresponding modelName ${modelName} by key ${keysForEnv.modelName} from globalConfig, will get other config by intent.`);
        const result = decideOpenaiSdkConfig({
            keys: keysForEnv,
            provider: allEnvConfig,
            valueAssert: createAssert(keysForEnv.modelName, 'process.env', modelName)
        });
        const { vlMode, uiTarsVersion } = parseVlModeAndUiTarsModelVersionFromRawValue(result.vlModeRaw);
        const modelDescription = getModelDescription(vlMode, uiTarsVersion);
        const finalResult = {
            ...result,
            modelName,
            vlMode,
            uiTarsModelVersion: uiTarsVersion,
            modelDescription,
            from: 'env',
            intent
        };
        debugLog(`decideModelConfig result by process.env with intent ${intent}:`, maskConfig(finalResult));
        return finalResult;
    }
    debugLog(`decideModelConfig as legacy logic with intent ${intent}.`);
    const result = decideOpenaiSdkConfig({
        keys: DEFAULT_MODEL_CONFIG_KEYS_LEGACY,
        provider: allEnvConfig,
        valueAssert: createAssert(DEFAULT_MODEL_CONFIG_KEYS_LEGACY.modelName, 'process.env')
    });
    const { vlMode, uiTarsVersion } = parseVlModeAndUiTarsFromGlobalConfig(allEnvConfig);
    const modelDescription = getModelDescription(vlMode, uiTarsVersion);
    const finalResult = {
        ...result,
        modelName: allEnvConfig[DEFAULT_MODEL_CONFIG_KEYS_LEGACY.modelName] || 'gpt-4o',
        vlMode,
        uiTarsModelVersion: uiTarsVersion,
        modelDescription,
        from: 'legacy-env',
        intent
    };
    debugLog(`decideModelConfig result by legacy logic with intent ${intent}:`, maskConfig(finalResult));
    return finalResult;
};
export { decideModelConfigFromEnv, decideModelConfigFromIntentConfig, decideOpenaiSdkConfig };
