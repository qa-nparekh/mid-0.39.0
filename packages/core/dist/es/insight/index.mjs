import { AIActionType, expandSearchArea } from "../ai-model/common.mjs";
import { AiExtractElementInfo, AiLocateElement, callAIWithObjectResponse } from "../ai-model/index.mjs";
import { AiLocateSection } from "../ai-model/inspect.mjs";
import { elementDescriberInstruction } from "../ai-model/prompt/describe.mjs";
import { SQAI_FORCE_DEEP_THINK, globalConfigManager } from "@sqai/shared/env";
import { compositeElementInfoImg, cropByRect } from "@sqai/shared/img";
import { getDebug } from "@sqai/shared/logger";
import { assert } from "@sqai/shared/utils";
import { emitInsightDump } from "./utils.mjs";
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
const debug = getDebug('ai:insight');
class Insight {
    async locate(query, opt, modelConfig) {
        var _parseResult_errors;
        const queryPrompt = 'string' == typeof query ? query : query.prompt;
        assert(queryPrompt, 'query is required for locate');
        const dumpSubscriber = this.onceDumpUpdatedFn;
        this.onceDumpUpdatedFn = void 0;
        assert('object' == typeof query, 'query should be an object for locate');
        const globalDeepThinkSwitch = globalConfigManager.getEnvConfigInBoolean(SQAI_FORCE_DEEP_THINK);
        if (globalDeepThinkSwitch) debug('globalDeepThinkSwitch', globalDeepThinkSwitch);
        let searchAreaPrompt;
        if (query.deepThink || globalDeepThinkSwitch) searchAreaPrompt = query.prompt;
        const { vlMode } = modelConfig;
        if (searchAreaPrompt && !vlMode) {
            console.warn('The "deepThink" feature is not supported with multimodal LLM. Please config VL model for Midscene. https://midscenejs.com/choose-a-model');
            searchAreaPrompt = void 0;
        }
        const context = (null == opt ? void 0 : opt.context) || await this.contextRetrieverFn('locate');
        let searchArea;
        let searchAreaRawResponse;
        let searchAreaUsage;
        let searchAreaResponse;
        if (searchAreaPrompt) {
            searchAreaResponse = await AiLocateSection({
                context,
                sectionDescription: searchAreaPrompt,
                modelConfig
            });
            assert(searchAreaResponse.rect, `cannot find search area for "${searchAreaPrompt}"${searchAreaResponse.error ? `: ${searchAreaResponse.error}` : ''}`);
            searchAreaRawResponse = searchAreaResponse.rawResponse;
            searchAreaUsage = searchAreaResponse.usage;
            searchArea = searchAreaResponse.rect;
        }
        const startTime = Date.now();
        const { parseResult, rect, elementById, rawResponse, usage, isOrderSensitive } = await AiLocateElement({
            callAIFn: this.aiVendorFn,
            context,
            targetElementDescription: queryPrompt,
            searchConfig: searchAreaResponse,
            modelConfig
        });
        const timeCost = Date.now() - startTime;
        const taskInfo = {
            ...this.taskInfo ? this.taskInfo : {},
            durationMs: timeCost,
            rawResponse: JSON.stringify(rawResponse),
            formatResponse: JSON.stringify(parseResult),
            usage,
            searchArea,
            searchAreaRawResponse,
            searchAreaUsage
        };
        let errorLog;
        if (null == (_parseResult_errors = parseResult.errors) ? void 0 : _parseResult_errors.length) errorLog = `AI model failed to locate: \n${parseResult.errors.join('\n')}`;
        const dumpData = {
            type: 'locate',
            userQuery: {
                element: queryPrompt
            },
            matchedElement: [],
            matchedRect: rect,
            data: null,
            taskInfo,
            deepThink: !!searchArea,
            error: errorLog
        };
        const elements = [];
        (parseResult.elements || []).forEach((item)=>{
            if ('id' in item) {
                const element = elementById(null == item ? void 0 : item.id);
                if (!element) return void console.warn(`locate: cannot find element id=${item.id}. Maybe an unstable response from AI model`);
                elements.push(element);
            }
        });
        emitInsightDump({
            ...dumpData,
            matchedElement: elements
        }, dumpSubscriber);
        if (errorLog) throw new Error(errorLog);
        assert(elements.length <= 1, `locate: multiple elements found, length = ${elements.length}`);
        if (1 === elements.length) return {
            element: {
                id: elements[0].id,
                indexId: elements[0].indexId,
                center: elements[0].center,
                rect: elements[0].rect,
                xpaths: elements[0].xpaths || [],
                attributes: elements[0].attributes,
                isOrderSensitive
            },
            rect
        };
        return {
            element: null,
            rect
        };
    }
    async extract(dataDemand, modelConfig, opt, multimodalPrompt) {
        var _parseResult_errors;
        assert('object' == typeof dataDemand || 'string' == typeof dataDemand, `dataDemand should be object or string, but get ${typeof dataDemand}`);
        const dumpSubscriber = this.onceDumpUpdatedFn;
        this.onceDumpUpdatedFn = void 0;
        const context = await this.contextRetrieverFn('extract');
        const startTime = Date.now();
        const { parseResult, usage } = await AiExtractElementInfo({
            context,
            dataQuery: dataDemand,
            multimodalPrompt,
            extractOption: opt,
            modelConfig
        });
        const timeCost = Date.now() - startTime;
        const taskInfo = {
            ...this.taskInfo ? this.taskInfo : {},
            durationMs: timeCost,
            rawResponse: JSON.stringify(parseResult)
        };
        let errorLog;
        if (null == (_parseResult_errors = parseResult.errors) ? void 0 : _parseResult_errors.length) errorLog = `AI response error: \n${parseResult.errors.join('\n')}`;
        const dumpData = {
            type: 'extract',
            userQuery: {
                dataDemand
            },
            matchedElement: [],
            data: null,
            taskInfo,
            error: errorLog
        };
        const { data, thought } = parseResult || {};
        emitInsightDump({
            ...dumpData,
            data
        }, dumpSubscriber);
        if (errorLog && !data && !(null == opt ? void 0 : opt.doNotThrowError)) throw new Error(errorLog);
        return {
            data,
            thought,
            usage
        };
    }
    async describe(target, modelConfig, opt) {
        assert(target, 'target is required for insight.describe');
        const context = await this.contextRetrieverFn('describe');
        const { screenshotBase64, size } = context;
        assert(screenshotBase64, 'screenshot is required for insight.describe');
        const { vlMode } = modelConfig;
        const systemPrompt = elementDescriberInstruction();
        const defaultRectSize = 30;
        const targetRect = Array.isArray(target) ? {
            left: Math.floor(target[0] - defaultRectSize / 2),
            top: Math.floor(target[1] - defaultRectSize / 2),
            width: defaultRectSize,
            height: defaultRectSize
        } : target;
        let imagePayload = await compositeElementInfoImg({
            inputImgBase64: screenshotBase64,
            size,
            elementsPositionInfo: [
                {
                    rect: targetRect
                }
            ],
            borderThickness: 3
        });
        if (null == opt ? void 0 : opt.deepThink) {
            const searchArea = expandSearchArea(targetRect, context.size, vlMode);
            debug('describe: set searchArea', searchArea);
            const croppedResult = await cropByRect(imagePayload, searchArea, 'qwen-vl' === vlMode);
            imagePayload = croppedResult.imageBase64;
        }
        const msgs = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: imagePayload,
                            detail: 'high'
                        }
                    }
                ]
            }
        ];
        const callAIFn = this.aiVendorFn;
        const res = await callAIFn(msgs, AIActionType.DESCRIBE_ELEMENT, modelConfig);
        const { content } = res;
        assert(!content.error, `describe failed: ${content.error}`);
        assert(content.description, 'failed to describe the element');
        return content;
    }
    constructor(context, opt){
        _define_property(this, "contextRetrieverFn", void 0);
        _define_property(this, "aiVendorFn", callAIWithObjectResponse);
        _define_property(this, "onceDumpUpdatedFn", void 0);
        _define_property(this, "taskInfo", void 0);
        assert(context, 'context is required for Insight');
        if ('function' == typeof context) this.contextRetrieverFn = context;
        else this.contextRetrieverFn = ()=>Promise.resolve(context);
        if (void 0 !== (null == opt ? void 0 : opt.aiVendorFn)) this.aiVendorFn = opt.aiVendorFn;
        if (void 0 !== (null == opt ? void 0 : opt.taskInfo)) this.taskInfo = opt.taskInfo;
    }
}
export { Insight as default };

//# sourceMappingURL=index.mjs.map