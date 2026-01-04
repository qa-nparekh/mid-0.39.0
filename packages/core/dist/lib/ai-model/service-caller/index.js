"use strict";
var __webpack_modules__ = {
    "langsmith/wrappers": function(module) {
        module.exports = import("langsmith/wrappers").then(function(module) {
            return module;
        });
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
(()=>{
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
        extractJSONFromCodeBlock: ()=>extractJSONFromCodeBlock,
        callAIWithStringResponse: ()=>callAIWithStringResponse,
        preprocessDoubaoBboxJson: ()=>preprocessDoubaoBboxJson,
        callAIWithObjectResponse: ()=>callAIWithObjectResponse,
        getResponseFormat: ()=>getResponseFormat,
        safeParseJson: ()=>safeParseJson,
        callAI: ()=>callAI
    });
    const external_types_js_namespaceObject = require("../../types.js");
    const sdk_namespaceObject = require("@anthropic-ai/sdk");
    const identity_namespaceObject = require("@azure/identity");
    const env_namespaceObject = require("@sqaitech/shared/env");
    const img_namespaceObject = require("@sqaitech/shared/img");
    const logger_namespaceObject = require("@sqaitech/shared/logger");
    const utils_namespaceObject = require("@sqaitech/shared/utils");
    const external_https_proxy_agent_namespaceObject = require("https-proxy-agent");
    const external_jsonrepair_namespaceObject = require("jsonrepair");
    const external_openai_namespaceObject = require("openai");
    var external_openai_default = /*#__PURE__*/ __webpack_require__.n(external_openai_namespaceObject);
    const external_socks_proxy_agent_namespaceObject = require("socks-proxy-agent");
    const external_common_js_namespaceObject = require("../common.js");
    const assertion_js_namespaceObject = require("../prompt/assertion.js");
    const llm_locator_js_namespaceObject = require("../prompt/llm-locator.js");
    const llm_planning_js_namespaceObject = require("../prompt/llm-planning.js");
    async function createChatClient({ AIActionTypeValue, modelConfig }) {
        const { socksProxy, httpProxy, modelName, openaiBaseURL, openaiApiKey, openaiExtraConfig, openaiUseAzureDeprecated, useAzureOpenai, azureOpenaiScope, azureOpenaiKey, azureOpenaiEndpoint, azureOpenaiApiVersion, azureOpenaiDeployment, azureExtraConfig, useAnthropicSdk, anthropicApiKey, modelDescription, uiTarsModelVersion: uiTarsVersion, vlMode } = modelConfig;
        let openai;
        let proxyAgent;
        const debugProxy = (0, logger_namespaceObject.getDebug)('ai:call:proxy');
        if (httpProxy) {
            debugProxy('using http proxy', httpProxy);
            proxyAgent = new external_https_proxy_agent_namespaceObject.HttpsProxyAgent(httpProxy);
        } else if (socksProxy) {
            debugProxy('using socks proxy', socksProxy);
            proxyAgent = new external_socks_proxy_agent_namespaceObject.SocksProxyAgent(socksProxy);
        }
        if (openaiUseAzureDeprecated) openai = new external_openai_namespaceObject.AzureOpenAI({
            baseURL: openaiBaseURL,
            apiKey: openaiApiKey,
            httpAgent: proxyAgent,
            ...openaiExtraConfig,
            dangerouslyAllowBrowser: true
        });
        else if (useAzureOpenai) {
            let tokenProvider;
            if (azureOpenaiScope) {
                (0, utils_namespaceObject.assert)(!utils_namespaceObject.ifInBrowser, 'Azure OpenAI is not supported in browser with Midscene.');
                const credential = new identity_namespaceObject.DefaultAzureCredential();
                tokenProvider = (0, identity_namespaceObject.getBearerTokenProvider)(credential, azureOpenaiScope);
                openai = new external_openai_namespaceObject.AzureOpenAI({
                    azureADTokenProvider: tokenProvider,
                    endpoint: azureOpenaiEndpoint,
                    apiVersion: azureOpenaiApiVersion,
                    deployment: azureOpenaiDeployment,
                    ...openaiExtraConfig,
                    ...azureExtraConfig
                });
            } else openai = new external_openai_namespaceObject.AzureOpenAI({
                apiKey: azureOpenaiKey,
                endpoint: azureOpenaiEndpoint,
                apiVersion: azureOpenaiApiVersion,
                deployment: azureOpenaiDeployment,
                dangerouslyAllowBrowser: true,
                ...openaiExtraConfig,
                ...azureExtraConfig
            });
        } else if (!useAnthropicSdk) openai = new (external_openai_default())({
            baseURL: openaiBaseURL,
            apiKey: openaiApiKey,
            httpAgent: proxyAgent,
            ...openaiExtraConfig,
            defaultHeaders: {
                ...(null == openaiExtraConfig ? void 0 : openaiExtraConfig.defaultHeaders) || {},
                [env_namespaceObject.SQAI_API_TYPE]: AIActionTypeValue.toString()
            },
            dangerouslyAllowBrowser: true
        });
        if (openai && env_namespaceObject.globalConfigManager.getEnvConfigInBoolean(env_namespaceObject.SQAI_LANGSMITH_DEBUG)) {
            if (utils_namespaceObject.ifInBrowser) throw new Error('langsmith is not supported in browser');
            console.log('DEBUGGING MODE: langsmith wrapper enabled');
            const { wrapOpenAI } = await Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "langsmith/wrappers"));
            openai = wrapOpenAI(openai);
        }
        if (void 0 !== openai) return {
            completion: openai.chat.completions,
            style: 'openai',
            modelName,
            modelDescription,
            uiTarsVersion,
            vlMode
        };
        if (useAnthropicSdk) openai = new sdk_namespaceObject.Anthropic({
            apiKey: anthropicApiKey,
            httpAgent: proxyAgent,
            dangerouslyAllowBrowser: true
        });
        if (void 0 !== openai && openai.messages) return {
            completion: openai.messages,
            style: 'anthropic',
            modelName,
            modelDescription,
            uiTarsVersion,
            vlMode
        };
        throw new Error('Openai SDK or Anthropic SDK is not initialized');
    }
    async function callAI(messages, AIActionTypeValue, modelConfig, options) {
        const { completion, style, modelName, modelDescription, uiTarsVersion, vlMode } = await createChatClient({
            AIActionTypeValue,
            modelConfig
        });
        const responseFormat = getResponseFormat(modelName, AIActionTypeValue);
        const maxTokens = env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.OPENAI_MAX_TOKENS);
        const debugCall = (0, logger_namespaceObject.getDebug)('ai:call');
        const debugProfileStats = (0, logger_namespaceObject.getDebug)('ai:profile:stats');
        const debugProfileDetail = (0, logger_namespaceObject.getDebug)('ai:profile:detail');
        const startTime = Date.now();
        const isStreaming = (null == options ? void 0 : options.stream) && (null == options ? void 0 : options.onChunk);
        let content;
        let accumulated = '';
        let usage;
        let timeCost;
        const commonConfig = {
            temperature: 'vlm-ui-tars' === vlMode ? 0.0 : 0.1,
            stream: !!isStreaming,
            max_tokens: 'number' == typeof maxTokens ? maxTokens : Number.parseInt(maxTokens || '2048', 10),
            ...'qwen-vl' === vlMode || 'qwen3-vl' === vlMode ? {
                vl_high_resolution_images: true
            } : {}
        };
        try {
            if ('openai' === style) {
                debugCall(`sending ${isStreaming ? 'streaming ' : ''}request to ${modelName}`);
                if (isStreaming) {
                    const stream = await completion.create({
                        model: modelName,
                        messages,
                        response_format: responseFormat,
                        ...commonConfig
                    }, {
                        stream: true
                    });
                    for await (const chunk of stream){
                        var _chunk_choices__delta, _chunk_choices_, _chunk_choices, _chunk_choices__delta1, _chunk_choices_1, _chunk_choices1, _chunk_choices_2, _chunk_choices2;
                        const content = (null == (_chunk_choices = chunk.choices) ? void 0 : null == (_chunk_choices_ = _chunk_choices[0]) ? void 0 : null == (_chunk_choices__delta = _chunk_choices_.delta) ? void 0 : _chunk_choices__delta.content) || '';
                        const reasoning_content = (null == (_chunk_choices1 = chunk.choices) ? void 0 : null == (_chunk_choices_1 = _chunk_choices1[0]) ? void 0 : null == (_chunk_choices__delta1 = _chunk_choices_1.delta) ? void 0 : _chunk_choices__delta1.reasoning_content) || '';
                        if (chunk.usage) usage = chunk.usage;
                        if (content || reasoning_content) {
                            accumulated += content;
                            const chunkData = {
                                content,
                                reasoning_content,
                                accumulated,
                                isComplete: false,
                                usage: void 0
                            };
                            options.onChunk(chunkData);
                        }
                        if (null == (_chunk_choices2 = chunk.choices) ? void 0 : null == (_chunk_choices_2 = _chunk_choices2[0]) ? void 0 : _chunk_choices_2.finish_reason) {
                            timeCost = Date.now() - startTime;
                            if (!usage) {
                                const estimatedTokens = Math.max(1, Math.floor(accumulated.length / 4));
                                usage = {
                                    prompt_tokens: estimatedTokens,
                                    completion_tokens: estimatedTokens,
                                    total_tokens: 2 * estimatedTokens
                                };
                            }
                            const finalChunk = {
                                content: '',
                                accumulated,
                                reasoning_content: '',
                                isComplete: true,
                                usage: {
                                    prompt_tokens: usage.prompt_tokens ?? 0,
                                    completion_tokens: usage.completion_tokens ?? 0,
                                    total_tokens: usage.total_tokens ?? 0,
                                    time_cost: timeCost ?? 0,
                                    model_name: modelName,
                                    model_description: modelDescription,
                                    intent: modelConfig.intent
                                }
                            };
                            options.onChunk(finalChunk);
                            break;
                        }
                    }
                    content = accumulated;
                    debugProfileStats(`streaming model, ${modelName}, mode, ${vlMode || 'default'}, cost-ms, ${timeCost}`);
                } else {
                    var _result_usage, _result_usage1, _result_usage2;
                    const result = await completion.create({
                        model: modelName,
                        messages,
                        response_format: responseFormat,
                        ...commonConfig
                    });
                    timeCost = Date.now() - startTime;
                    debugProfileStats(`model, ${modelName}, mode, ${vlMode || 'default'}, ui-tars-version, ${uiTarsVersion}, prompt-tokens, ${(null == (_result_usage = result.usage) ? void 0 : _result_usage.prompt_tokens) || ''}, completion-tokens, ${(null == (_result_usage1 = result.usage) ? void 0 : _result_usage1.completion_tokens) || ''}, total-tokens, ${(null == (_result_usage2 = result.usage) ? void 0 : _result_usage2.total_tokens) || ''}, cost-ms, ${timeCost}, requestId, ${result._request_id || ''}`);
                    debugProfileDetail(`model usage detail: ${JSON.stringify(result.usage)}`);
                    (0, utils_namespaceObject.assert)(result.choices, `invalid response from LLM service: ${JSON.stringify(result)}`);
                    content = result.choices[0].message.content;
                    usage = result.usage;
                }
                debugCall(`response: ${content}`);
                (0, utils_namespaceObject.assert)(content, 'empty content');
            } else if ('anthropic' === style) {
                const convertImageContent = (content)=>{
                    if ('image_url' === content.type) {
                        const imgBase64 = content.image_url.url;
                        (0, utils_namespaceObject.assert)(imgBase64, 'image_url is required');
                        const { mimeType, body } = (0, img_namespaceObject.parseBase64)(content.image_url.url);
                        return {
                            source: {
                                type: 'base64',
                                media_type: mimeType,
                                data: body
                            },
                            type: 'image'
                        };
                    }
                    return content;
                };
                if (isStreaming) {
                    const stream = await completion.create({
                        model: modelName,
                        system: 'You are a versatile professional in software UI automation',
                        messages: messages.map((m)=>({
                                role: 'user',
                                content: Array.isArray(m.content) ? m.content.map(convertImageContent) : m.content
                            })),
                        response_format: responseFormat,
                        ...commonConfig
                    });
                    for await (const chunk of stream){
                        var _chunk_delta;
                        const content = (null == (_chunk_delta = chunk.delta) ? void 0 : _chunk_delta.text) || '';
                        if (content) {
                            accumulated += content;
                            const chunkData = {
                                content,
                                accumulated,
                                reasoning_content: '',
                                isComplete: false,
                                usage: void 0
                            };
                            options.onChunk(chunkData);
                        }
                        if ('message_stop' === chunk.type) {
                            timeCost = Date.now() - startTime;
                            const anthropicUsage = chunk.usage;
                            const finalChunk = {
                                content: '',
                                accumulated,
                                reasoning_content: '',
                                isComplete: true,
                                usage: anthropicUsage ? {
                                    prompt_tokens: anthropicUsage.input_tokens ?? 0,
                                    completion_tokens: anthropicUsage.output_tokens ?? 0,
                                    total_tokens: (anthropicUsage.input_tokens ?? 0) + (anthropicUsage.output_tokens ?? 0),
                                    time_cost: timeCost ?? 0,
                                    model_name: modelName,
                                    model_description: modelDescription,
                                    intent: modelConfig.intent
                                } : void 0
                            };
                            options.onChunk(finalChunk);
                            break;
                        }
                    }
                    content = accumulated;
                } else {
                    const result = await completion.create({
                        model: modelName,
                        system: 'You are a versatile professional in software UI automation',
                        messages: messages.map((m)=>({
                                role: 'user',
                                content: Array.isArray(m.content) ? m.content.map(convertImageContent) : m.content
                            })),
                        response_format: responseFormat,
                        ...commonConfig
                    });
                    timeCost = Date.now() - startTime;
                    content = result.content[0].text;
                    usage = result.usage;
                }
                (0, utils_namespaceObject.assert)(content, 'empty content');
            }
            if (isStreaming && !usage) {
                const estimatedTokens = Math.max(1, Math.floor((content || '').length / 4));
                usage = {
                    prompt_tokens: estimatedTokens,
                    completion_tokens: estimatedTokens,
                    total_tokens: 2 * estimatedTokens
                };
            }
            return {
                content: content || '',
                usage: usage ? {
                    prompt_tokens: usage.prompt_tokens ?? 0,
                    completion_tokens: usage.completion_tokens ?? 0,
                    total_tokens: usage.total_tokens ?? 0,
                    time_cost: timeCost ?? 0,
                    model_name: modelName,
                    model_description: modelDescription,
                    intent: modelConfig.intent
                } : void 0,
                isStreamed: !!isStreaming
            };
        } catch (e) {
            console.error(' call AI error', e);
            const newError = new Error(`failed to call ${isStreaming ? 'streaming ' : ''}AI model service: ${e.message}. Trouble shooting: https://midscenejs.com/model-provider.html`, {
                cause: e
            });
            throw newError;
        }
    }
    const getResponseFormat = (modelName, AIActionTypeValue)=>{
        let responseFormat;
        if (modelName.includes('gpt-4')) switch(AIActionTypeValue){
            case external_common_js_namespaceObject.AIActionType.ASSERT:
                responseFormat = assertion_js_namespaceObject.assertSchema;
                break;
            case external_common_js_namespaceObject.AIActionType.INSPECT_ELEMENT:
                responseFormat = llm_locator_js_namespaceObject.locatorSchema;
                break;
            case external_common_js_namespaceObject.AIActionType.PLAN:
                responseFormat = llm_planning_js_namespaceObject.planSchema;
                break;
            case external_common_js_namespaceObject.AIActionType.EXTRACT_DATA:
            case external_common_js_namespaceObject.AIActionType.DESCRIBE_ELEMENT:
                responseFormat = {
                    type: external_types_js_namespaceObject.AIResponseFormat.JSON
                };
                break;
            case external_common_js_namespaceObject.AIActionType.TEXT:
                responseFormat = void 0;
                break;
        }
        if ('gpt-4o-2024-05-13' === modelName && AIActionTypeValue !== external_common_js_namespaceObject.AIActionType.TEXT) responseFormat = {
            type: external_types_js_namespaceObject.AIResponseFormat.JSON
        };
        return responseFormat;
    };
    async function callAIWithObjectResponse(messages, AIActionTypeValue, modelConfig) {
        const response = await callAI(messages, AIActionTypeValue, modelConfig);
        (0, utils_namespaceObject.assert)(response, 'empty response');
        const vlMode = modelConfig.vlMode;
        const jsonContent = safeParseJson(response.content, vlMode);
        return {
            content: jsonContent,
            usage: response.usage
        };
    }
    async function callAIWithStringResponse(msgs, AIActionTypeValue, modelConfig) {
        const { content, usage } = await callAI(msgs, AIActionTypeValue, modelConfig);
        return {
            content,
            usage
        };
    }
    function extractJSONFromCodeBlock(response) {
        try {
            const jsonMatch = response.match(/^\s*(\{[\s\S]*\})\s*$/);
            if (jsonMatch) return jsonMatch[1];
            const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (codeBlockMatch) return codeBlockMatch[1];
            const jsonLikeMatch = response.match(/\{[\s\S]*\}/);
            if (jsonLikeMatch) return jsonLikeMatch[0];
        } catch  {}
        return response;
    }
    function preprocessDoubaoBboxJson(input) {
        if (input.includes('bbox')) while(/\d+\s+\d+/.test(input))input = input.replace(/(\d+)\s+(\d+)/g, '$1,$2');
        return input;
    }
    function safeParseJson(input, vlMode) {
        const cleanJsonString = extractJSONFromCodeBlock(input);
        if (null == cleanJsonString ? void 0 : cleanJsonString.match(/\((\d+),(\d+)\)/)) {
            var _cleanJsonString_match;
            return null == (_cleanJsonString_match = cleanJsonString.match(/\((\d+),(\d+)\)/)) ? void 0 : _cleanJsonString_match.slice(1).map(Number);
        }
        try {
            return JSON.parse(cleanJsonString);
        } catch  {}
        try {
            return JSON.parse((0, external_jsonrepair_namespaceObject.jsonrepair)(cleanJsonString));
        } catch (e) {}
        if ('doubao-vision' === vlMode || 'vlm-ui-tars' === vlMode) {
            const jsonString = preprocessDoubaoBboxJson(cleanJsonString);
            return JSON.parse((0, external_jsonrepair_namespaceObject.jsonrepair)(jsonString));
        }
        throw Error(`failed to parse json response: ${input}`);
    }
})();
exports.callAI = __webpack_exports__.callAI;
exports.callAIWithObjectResponse = __webpack_exports__.callAIWithObjectResponse;
exports.callAIWithStringResponse = __webpack_exports__.callAIWithStringResponse;
exports.extractJSONFromCodeBlock = __webpack_exports__.extractJSONFromCodeBlock;
exports.getResponseFormat = __webpack_exports__.getResponseFormat;
exports.preprocessDoubaoBboxJson = __webpack_exports__.preprocessDoubaoBboxJson;
exports.safeParseJson = __webpack_exports__.safeParseJson;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "callAI",
    "callAIWithObjectResponse",
    "callAIWithStringResponse",
    "extractJSONFromCodeBlock",
    "getResponseFormat",
    "preprocessDoubaoBboxJson",
    "safeParseJson"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map