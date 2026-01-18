import { AIResponseFormat } from "../../types.mjs";
import { Anthropic } from "@anthropic-ai/sdk";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { OPENAI_MAX_TOKENS, SQAI_API_TYPE, SQAI_LANGSMITH_DEBUG, globalConfigManager } from "@sqaitech/shared/env";
import { parseBase64 } from "@sqaitech/shared/img";
import { getDebug } from "@sqaitech/shared/logger";
import { assert, ifInBrowser } from "@sqaitech/shared/utils";
import { HttpsProxyAgent } from "https-proxy-agent";
import { jsonrepair } from "jsonrepair";
import openai_0, { AzureOpenAI } from "openai";
import { SocksProxyAgent } from "socks-proxy-agent";
import { AIActionType } from "../common.mjs";
import { assertSchema } from "../prompt/assertion.mjs";
import { locatorSchema } from "../prompt/llm-locator.mjs";
import { planSchema } from "../prompt/llm-planning.mjs";
async function createChatClient({ AIActionTypeValue, modelConfig }) {
    const { socksProxy, httpProxy, modelName, openaiBaseURL, openaiApiKey, openaiExtraConfig, openaiUseAzureDeprecated, useAzureOpenai, azureOpenaiScope, azureOpenaiKey, azureOpenaiEndpoint, azureOpenaiApiVersion, azureOpenaiDeployment, azureExtraConfig, useAnthropicSdk, anthropicApiKey, modelDescription, uiTarsModelVersion: uiTarsVersion, vlMode } = modelConfig;
    let openai;
    let proxyAgent;
    const debugProxy = getDebug('ai:call:proxy');
    if (httpProxy) {
        debugProxy('using http proxy', httpProxy);
        proxyAgent = new HttpsProxyAgent(httpProxy);
    } else if (socksProxy) {
        debugProxy('using socks proxy', socksProxy);
        proxyAgent = new SocksProxyAgent(socksProxy);
    }
    if (openaiUseAzureDeprecated) openai = new AzureOpenAI({
        baseURL: openaiBaseURL,
        apiKey: openaiApiKey,
        httpAgent: proxyAgent,
        ...openaiExtraConfig,
        dangerouslyAllowBrowser: true
    });
    else if (useAzureOpenai) {
        let tokenProvider;
        if (azureOpenaiScope) {
            assert(!ifInBrowser, 'Azure OpenAI is not supported in browser with Midscene.');
            const credential = new DefaultAzureCredential();
            tokenProvider = getBearerTokenProvider(credential, azureOpenaiScope);
            openai = new AzureOpenAI({
                azureADTokenProvider: tokenProvider,
                endpoint: azureOpenaiEndpoint,
                apiVersion: azureOpenaiApiVersion,
                deployment: azureOpenaiDeployment,
                ...openaiExtraConfig,
                ...azureExtraConfig
            });
        } else openai = new AzureOpenAI({
            apiKey: azureOpenaiKey,
            endpoint: azureOpenaiEndpoint,
            apiVersion: azureOpenaiApiVersion,
            deployment: azureOpenaiDeployment,
            dangerouslyAllowBrowser: true,
            ...openaiExtraConfig,
            ...azureExtraConfig
        });
    } else if (!useAnthropicSdk) openai = new openai_0({
        baseURL: openaiBaseURL,
        apiKey: openaiApiKey,
        httpAgent: proxyAgent,
        ...openaiExtraConfig,
        defaultHeaders: {
            ...(null == openaiExtraConfig ? void 0 : openaiExtraConfig.defaultHeaders) || {},
            [SQAI_API_TYPE]: AIActionTypeValue.toString()
        },
        dangerouslyAllowBrowser: true
    });
    if (openai && globalConfigManager.getEnvConfigInBoolean(SQAI_LANGSMITH_DEBUG)) {
        if (ifInBrowser) throw new Error('langsmith is not supported in browser');
        console.log('DEBUGGING MODE: langsmith wrapper enabled');
        const { wrapOpenAI } = await import("langsmith/wrappers");
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
    if (useAnthropicSdk) openai = new Anthropic({
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
    const maxTokens = globalConfigManager.getEnvConfigValue(OPENAI_MAX_TOKENS);
    const debugCall = getDebug('ai:call');
    const debugProfileStats = getDebug('ai:profile:stats');
    const debugProfileDetail = getDebug('ai:profile:detail');
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
                assert(result.choices, `invalid response from LLM service: ${JSON.stringify(result)}`);
                content = result.choices[0].message.content;
                usage = result.usage;
            }
            debugCall(`response: ${content}`);
            assert(content, 'empty content');
        } else if ('anthropic' === style) {
            const convertImageContent = (content)=>{
                if ('image_url' === content.type) {
                    const imgBase64 = content.image_url.url;
                    assert(imgBase64, 'image_url is required');
                    const { mimeType, body } = parseBase64(content.image_url.url);
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
            assert(content, 'empty content');
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
        const newError = new Error(`failed to call ${isStreaming ? 'streaming ' : ''}AI model service: ${e.message}. Trouble shooting: https://sqai.tech/model-provider.html`, {
            cause: e
        });
        throw newError;
    }
}
const getResponseFormat = (modelName, AIActionTypeValue)=>{
    let responseFormat;
    if (modelName.includes('gpt-4')) switch(AIActionTypeValue){
        case AIActionType.ASSERT:
            responseFormat = assertSchema;
            break;
        case AIActionType.INSPECT_ELEMENT:
            responseFormat = locatorSchema;
            break;
        case AIActionType.PLAN:
            responseFormat = planSchema;
            break;
        case AIActionType.EXTRACT_DATA:
        case AIActionType.DESCRIBE_ELEMENT:
            responseFormat = {
                type: AIResponseFormat.JSON
            };
            break;
        case AIActionType.TEXT:
            responseFormat = void 0;
            break;
    }
    if ('gpt-4o-2024-05-13' === modelName && AIActionTypeValue !== AIActionType.TEXT) responseFormat = {
        type: AIResponseFormat.JSON
    };
    return responseFormat;
};
async function callAIWithObjectResponse(messages, AIActionTypeValue, modelConfig) {
    const response = await callAI(messages, AIActionTypeValue, modelConfig);
    assert(response, 'empty response');
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
        return JSON.parse(jsonrepair(cleanJsonString));
    } catch (e) {}
    if ('doubao-vision' === vlMode || 'vlm-ui-tars' === vlMode) {
        const jsonString = preprocessDoubaoBboxJson(cleanJsonString);
        return JSON.parse(jsonrepair(jsonString));
    }
    throw Error(`failed to parse json response: ${input}`);
}
export { callAI, callAIWithObjectResponse, callAIWithStringResponse, extractJSONFromCodeBlock, getResponseFormat, preprocessDoubaoBboxJson, safeParseJson };

//# sourceMappingURL=index.mjs.map