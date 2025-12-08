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
    DEFAULT_MODEL_CONFIG_KEYS_LEGACY: ()=>DEFAULT_MODEL_CONFIG_KEYS_LEGACY,
    VQA_MODEL_CONFIG_KEYS: ()=>VQA_MODEL_CONFIG_KEYS,
    DEFAULT_MODEL_CONFIG_KEYS: ()=>DEFAULT_MODEL_CONFIG_KEYS,
    PLANNING_MODEL_CONFIG_KEYS: ()=>PLANNING_MODEL_CONFIG_KEYS,
    GROUNDING_MODEL_CONFIG_KEYS: ()=>GROUNDING_MODEL_CONFIG_KEYS
});
const external_types_js_namespaceObject = require("./types.js");
const VQA_MODEL_CONFIG_KEYS = {
    modelName: external_types_js_namespaceObject.SQAI_VQA_MODEL_NAME,
    socksProxy: external_types_js_namespaceObject.SQAI_VQA_OPENAI_SOCKS_PROXY,
    httpProxy: external_types_js_namespaceObject.SQAI_VQA_OPENAI_HTTP_PROXY,
    openaiBaseURL: external_types_js_namespaceObject.SQAI_VQA_OPENAI_BASE_URL,
    openaiApiKey: external_types_js_namespaceObject.SQAI_VQA_OPENAI_API_KEY,
    openaiExtraConfig: external_types_js_namespaceObject.SQAI_VQA_OPENAI_INIT_CONFIG_JSON,
    openaiUseAzureDeprecated: external_types_js_namespaceObject.SQAI_VQA_OPENAI_USE_AZURE,
    useAzureOpenai: external_types_js_namespaceObject.SQAI_VQA_USE_AZURE_OPENAI,
    azureOpenaiScope: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_SCOPE,
    azureOpenaiKey: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_KEY,
    azureOpenaiEndpoint: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_ENDPOINT,
    azureOpenaiApiVersion: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_API_VERSION,
    azureOpenaiDeployment: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_DEPLOYMENT,
    azureExtraConfig: external_types_js_namespaceObject.SQAI_VQA_AZURE_OPENAI_INIT_CONFIG_JSON,
    useAnthropicSdk: external_types_js_namespaceObject.SQAI_VQA_USE_ANTHROPIC_SDK,
    anthropicApiKey: external_types_js_namespaceObject.SQAI_VQA_ANTHROPIC_API_KEY,
    vlMode: external_types_js_namespaceObject.SQAI_VQA_VL_MODE
};
const GROUNDING_MODEL_CONFIG_KEYS = {
    modelName: external_types_js_namespaceObject.SQAI_GROUNDING_MODEL_NAME,
    socksProxy: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_SOCKS_PROXY,
    httpProxy: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_HTTP_PROXY,
    openaiBaseURL: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_BASE_URL,
    openaiApiKey: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_API_KEY,
    openaiExtraConfig: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_INIT_CONFIG_JSON,
    openaiUseAzureDeprecated: external_types_js_namespaceObject.SQAI_GROUNDING_OPENAI_USE_AZURE,
    useAzureOpenai: external_types_js_namespaceObject.SQAI_GROUNDING_USE_AZURE_OPENAI,
    azureOpenaiScope: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_SCOPE,
    azureOpenaiKey: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_KEY,
    azureOpenaiEndpoint: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_ENDPOINT,
    azureOpenaiApiVersion: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_API_VERSION,
    azureOpenaiDeployment: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_DEPLOYMENT,
    azureExtraConfig: external_types_js_namespaceObject.SQAI_GROUNDING_AZURE_OPENAI_INIT_CONFIG_JSON,
    useAnthropicSdk: external_types_js_namespaceObject.SQAI_GROUNDING_USE_ANTHROPIC_SDK,
    anthropicApiKey: external_types_js_namespaceObject.SQAI_GROUNDING_ANTHROPIC_API_KEY,
    vlMode: external_types_js_namespaceObject.SQAI_GROUNDING_VL_MODE
};
const PLANNING_MODEL_CONFIG_KEYS = {
    modelName: external_types_js_namespaceObject.SQAI_PLANNING_MODEL_NAME,
    socksProxy: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_SOCKS_PROXY,
    httpProxy: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_HTTP_PROXY,
    openaiBaseURL: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_BASE_URL,
    openaiApiKey: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_API_KEY,
    openaiExtraConfig: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_INIT_CONFIG_JSON,
    openaiUseAzureDeprecated: external_types_js_namespaceObject.SQAI_PLANNING_OPENAI_USE_AZURE,
    useAzureOpenai: external_types_js_namespaceObject.SQAI_PLANNING_USE_AZURE_OPENAI,
    azureOpenaiScope: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_SCOPE,
    azureOpenaiKey: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_KEY,
    azureOpenaiEndpoint: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_ENDPOINT,
    azureOpenaiApiVersion: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_API_VERSION,
    azureOpenaiDeployment: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_DEPLOYMENT,
    azureExtraConfig: external_types_js_namespaceObject.SQAI_PLANNING_AZURE_OPENAI_INIT_CONFIG_JSON,
    useAnthropicSdk: external_types_js_namespaceObject.SQAI_PLANNING_USE_ANTHROPIC_SDK,
    anthropicApiKey: external_types_js_namespaceObject.SQAI_PLANNING_ANTHROPIC_API_KEY,
    vlMode: external_types_js_namespaceObject.SQAI_PLANNING_VL_MODE
};
const DEFAULT_MODEL_CONFIG_KEYS = {
    modelName: external_types_js_namespaceObject.SQAI_MODEL_NAME,
    socksProxy: external_types_js_namespaceObject.SQAI_OPENAI_SOCKS_PROXY,
    httpProxy: external_types_js_namespaceObject.SQAI_OPENAI_HTTP_PROXY,
    openaiBaseURL: external_types_js_namespaceObject.SQAI_OPENAI_BASE_URL,
    openaiApiKey: external_types_js_namespaceObject.SQAI_OPENAI_API_KEY,
    openaiExtraConfig: external_types_js_namespaceObject.SQAI_OPENAI_INIT_CONFIG_JSON,
    openaiUseAzureDeprecated: external_types_js_namespaceObject.SQAI_OPENAI_USE_AZURE,
    useAzureOpenai: external_types_js_namespaceObject.SQAI_USE_AZURE_OPENAI,
    azureOpenaiScope: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_SCOPE,
    azureOpenaiKey: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_KEY,
    azureOpenaiEndpoint: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_ENDPOINT,
    azureOpenaiApiVersion: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_API_VERSION,
    azureOpenaiDeployment: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_DEPLOYMENT,
    azureExtraConfig: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_INIT_CONFIG_JSON,
    useAnthropicSdk: external_types_js_namespaceObject.SQAI_USE_ANTHROPIC_SDK,
    anthropicApiKey: external_types_js_namespaceObject.SQAI_ANTHROPIC_API_KEY,
    vlMode: external_types_js_namespaceObject.SQAI_VL_MODE
};
const DEFAULT_MODEL_CONFIG_KEYS_LEGACY = {
    modelName: external_types_js_namespaceObject.SQAI_MODEL_NAME,
    socksProxy: external_types_js_namespaceObject.SQAI_OPENAI_SOCKS_PROXY,
    httpProxy: external_types_js_namespaceObject.SQAI_OPENAI_HTTP_PROXY,
    openaiBaseURL: external_types_js_namespaceObject.OPENAI_BASE_URL,
    openaiApiKey: external_types_js_namespaceObject.OPENAI_API_KEY,
    openaiExtraConfig: external_types_js_namespaceObject.SQAI_OPENAI_INIT_CONFIG_JSON,
    openaiUseAzureDeprecated: external_types_js_namespaceObject.OPENAI_USE_AZURE,
    useAzureOpenai: external_types_js_namespaceObject.SQAI_USE_AZURE_OPENAI,
    azureOpenaiScope: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_SCOPE,
    azureOpenaiKey: external_types_js_namespaceObject.AZURE_OPENAI_KEY,
    azureOpenaiEndpoint: external_types_js_namespaceObject.AZURE_OPENAI_ENDPOINT,
    azureOpenaiApiVersion: external_types_js_namespaceObject.AZURE_OPENAI_API_VERSION,
    azureOpenaiDeployment: external_types_js_namespaceObject.AZURE_OPENAI_DEPLOYMENT,
    azureExtraConfig: external_types_js_namespaceObject.SQAI_AZURE_OPENAI_INIT_CONFIG_JSON,
    useAnthropicSdk: external_types_js_namespaceObject.SQAI_USE_ANTHROPIC_SDK,
    anthropicApiKey: external_types_js_namespaceObject.ANTHROPIC_API_KEY,
    vlMode: 'DEFAULT_MODEL_CONFIG_KEYS has no vlMode key'
};
exports.DEFAULT_MODEL_CONFIG_KEYS = __webpack_exports__.DEFAULT_MODEL_CONFIG_KEYS;
exports.DEFAULT_MODEL_CONFIG_KEYS_LEGACY = __webpack_exports__.DEFAULT_MODEL_CONFIG_KEYS_LEGACY;
exports.GROUNDING_MODEL_CONFIG_KEYS = __webpack_exports__.GROUNDING_MODEL_CONFIG_KEYS;
exports.PLANNING_MODEL_CONFIG_KEYS = __webpack_exports__.PLANNING_MODEL_CONFIG_KEYS;
exports.VQA_MODEL_CONFIG_KEYS = __webpack_exports__.VQA_MODEL_CONFIG_KEYS;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "DEFAULT_MODEL_CONFIG_KEYS",
    "DEFAULT_MODEL_CONFIG_KEYS_LEGACY",
    "GROUNDING_MODEL_CONFIG_KEYS",
    "PLANNING_MODEL_CONFIG_KEYS",
    "VQA_MODEL_CONFIG_KEYS"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
