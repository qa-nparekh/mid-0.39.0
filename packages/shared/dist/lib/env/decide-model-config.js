"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    decideModelConfigFromEnv: ()=>decideModelConfigFromEnv,
    decideModelConfigFromIntentConfig: ()=>decideModelConfigFromIntentConfig,
    decideOpenaiSdkConfig: ()=>decideOpenaiSdkConfig
});
const external_constants_js_namespaceObject = require("./constants.js");
const external_logger_js_namespaceObject = require("../logger.js");
const external_utils_js_namespaceObject = require("../utils.js");
const external_helper_js_namespaceObject = require("./helper.js");
const external_init_debug_js_namespaceObject = require("./init-debug.js");
const external_parse_js_namespaceObject = require("./parse.js");
const KEYS_MAP = {
    VQA: external_constants_js_namespaceObject.VQA_MODEL_CONFIG_KEYS,
    grounding: external_constants_js_namespaceObject.GROUNDING_MODEL_CONFIG_KEYS,
    planning: external_constants_js_namespaceObject.PLANNING_MODEL_CONFIG_KEYS,
    default: external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS
};
const decideOpenaiSdkConfig = ({ keys, provider, valueAssert })=>{
    (0, external_init_debug_js_namespaceObject.initDebugConfig)();
    const debugLog = (0, external_logger_js_namespaceObject.getDebug)('ai:config');
    const socksProxy = provider[keys.socksProxy];
    const httpProxy = provider[keys.httpProxy];
    const vlMode = provider[keys.vlMode];
    debugLog('enter decideOpenaiSdkConfig with keys:', keys);
    if (provider[keys.openaiUseAzureDeprecated]) {
        debugLog(`provider has ${keys.openaiUseAzureDeprecated} with value${provider[keys.openaiUseAzureDeprecated]}`);
        const openaiBaseURL = provider[keys.openaiBaseURL];
        const openaiApiKey = provider[keys.openaiApiKey];
        const openaiExtraConfig = (0, external_helper_js_namespaceObject.parseJson)(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
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
        const azureExtraConfig = (0, external_helper_js_namespaceObject.parseJson)(keys.azureExtraConfig, provider[keys.azureExtraConfig]);
        const openaiExtraConfig = (0, external_helper_js_namespaceObject.parseJson)(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
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
        const openaiExtraConfig = (0, external_helper_js_namespaceObject.parseJson)(keys.openaiExtraConfig, provider[keys.openaiExtraConfig]);
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
    const debugLog = (0, external_logger_js_namespaceObject.getDebug)('ai:config');
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
        (0, external_utils_js_namespaceObject.assert)(intentConfig[external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS.modelName], `The return value of agent.modelConfig do not have a valid value with key ${external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS.modelName}.`);
        return external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS;
    })();
    const result = decideOpenaiSdkConfig({
        keys: chosenKeys,
        provider: intentConfig,
        valueAssert: (0, external_helper_js_namespaceObject.createAssert)(chosenKeys.modelName, 'modelConfig', candidateModelNameFromConfig)
    });
    const { vlMode, uiTarsVersion } = (0, external_parse_js_namespaceObject.parseVlModeAndUiTarsModelVersionFromRawValue)(result.vlModeRaw);
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
    debugLog(`decideModelConfig result by agent.modelConfig() with intent ${intent}:`, (0, external_helper_js_namespaceObject.maskConfig)(finalResult));
    return finalResult;
};
const decideModelConfigFromEnv = (intent, allEnvConfig)=>{
    (0, external_init_debug_js_namespaceObject.initDebugConfig)();
    const debugLog = (0, external_logger_js_namespaceObject.getDebug)('ai:config');
    const keysForEnv = 'default' === intent ? external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS_LEGACY : KEYS_MAP[intent];
    if ('default' !== intent && allEnvConfig[keysForEnv.modelName]) {
        const modelName = allEnvConfig[keysForEnv.modelName];
        debugLog(`Got intent ${intent} corresponding modelName ${modelName} by key ${keysForEnv.modelName} from globalConfig, will get other config by intent.`);
        const result = decideOpenaiSdkConfig({
            keys: keysForEnv,
            provider: allEnvConfig,
            valueAssert: (0, external_helper_js_namespaceObject.createAssert)(keysForEnv.modelName, 'process.env', modelName)
        });
        const { vlMode, uiTarsVersion } = (0, external_parse_js_namespaceObject.parseVlModeAndUiTarsModelVersionFromRawValue)(result.vlModeRaw);
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
        debugLog(`decideModelConfig result by process.env with intent ${intent}:`, (0, external_helper_js_namespaceObject.maskConfig)(finalResult));
        return finalResult;
    }
    debugLog(`decideModelConfig as legacy logic with intent ${intent}.`);
    const result = decideOpenaiSdkConfig({
        keys: external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS_LEGACY,
        provider: allEnvConfig,
        valueAssert: (0, external_helper_js_namespaceObject.createAssert)(external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS_LEGACY.modelName, 'process.env')
    });
    const { vlMode, uiTarsVersion } = (0, external_parse_js_namespaceObject.parseVlModeAndUiTarsFromGlobalConfig)(allEnvConfig);
    const modelDescription = getModelDescription(vlMode, uiTarsVersion);
    const finalResult = {
        ...result,
        modelName: allEnvConfig[external_constants_js_namespaceObject.DEFAULT_MODEL_CONFIG_KEYS_LEGACY.modelName] || 'gpt-4o',
        vlMode,
        uiTarsModelVersion: uiTarsVersion,
        modelDescription,
        from: 'legacy-env',
        intent
    };
    debugLog(`decideModelConfig result by legacy logic with intent ${intent}:`, (0, external_helper_js_namespaceObject.maskConfig)(finalResult));
    return finalResult;
};
exports.decideModelConfigFromEnv = __webpack_exports__.decideModelConfigFromEnv;
exports.decideModelConfigFromIntentConfig = __webpack_exports__.decideModelConfigFromIntentConfig;
exports.decideOpenaiSdkConfig = __webpack_exports__.decideOpenaiSdkConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "decideModelConfigFromEnv",
    "decideModelConfigFromIntentConfig",
    "decideOpenaiSdkConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
