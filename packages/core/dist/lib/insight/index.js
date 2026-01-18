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
    default: ()=>Insight
});
const common_js_namespaceObject = require("../ai-model/common.js");
const index_js_namespaceObject = require("../ai-model/index.js");
const inspect_js_namespaceObject = require("../ai-model/inspect.js");
const describe_js_namespaceObject = require("../ai-model/prompt/describe.js");
const env_namespaceObject = require("@sqaitech/shared/env");
const img_namespaceObject = require("@sqaitech/shared/img");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const utils_namespaceObject = require("@sqaitech/shared/utils");
const external_utils_js_namespaceObject = require("./utils.js");
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
const debug = (0, logger_namespaceObject.getDebug)('ai:insight');
class Insight {
    async locate(query, opt, modelConfig) {
        var _parseResult_errors;
        const queryPrompt = 'string' == typeof query ? query : query.prompt;
        (0, utils_namespaceObject.assert)(queryPrompt, 'query is required for locate');
        const dumpSubscriber = this.onceDumpUpdatedFn;
        this.onceDumpUpdatedFn = void 0;
        (0, utils_namespaceObject.assert)('object' == typeof query, 'query should be an object for locate');
        const globalDeepThinkSwitch = env_namespaceObject.globalConfigManager.getEnvConfigInBoolean(env_namespaceObject.SQAI_FORCE_DEEP_THINK);
        if (globalDeepThinkSwitch) debug('globalDeepThinkSwitch', globalDeepThinkSwitch);
        let searchAreaPrompt;
        if (query.deepThink || globalDeepThinkSwitch) searchAreaPrompt = query.prompt;
        const { vlMode } = modelConfig;
        if (searchAreaPrompt && !vlMode) {
            console.warn('The "deepThink" feature is not supported with multimodal LLM. Please config VL model for SQAI. https://sqai.tech/choose-a-model');
            searchAreaPrompt = void 0;
        }
        const context = (null == opt ? void 0 : opt.context) || await this.contextRetrieverFn('locate');
        let searchArea;
        let searchAreaRawResponse;
        let searchAreaUsage;
        let searchAreaResponse;
        if (searchAreaPrompt) {
            searchAreaResponse = await (0, inspect_js_namespaceObject.AiLocateSection)({
                context,
                sectionDescription: searchAreaPrompt,
                modelConfig
            });
            (0, utils_namespaceObject.assert)(searchAreaResponse.rect, `cannot find search area for "${searchAreaPrompt}"${searchAreaResponse.error ? `: ${searchAreaResponse.error}` : ''}`);
            searchAreaRawResponse = searchAreaResponse.rawResponse;
            searchAreaUsage = searchAreaResponse.usage;
            searchArea = searchAreaResponse.rect;
        }
        const startTime = Date.now();
        const { parseResult, rect, elementById, rawResponse, usage, isOrderSensitive } = await (0, index_js_namespaceObject.AiLocateElement)({
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
        (0, external_utils_js_namespaceObject.emitInsightDump)({
            ...dumpData,
            matchedElement: elements
        }, dumpSubscriber);
        if (errorLog) throw new Error(errorLog);
        (0, utils_namespaceObject.assert)(elements.length <= 1, `locate: multiple elements found, length = ${elements.length}`);
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
        (0, utils_namespaceObject.assert)('object' == typeof dataDemand || 'string' == typeof dataDemand, `dataDemand should be object or string, but get ${typeof dataDemand}`);
        const dumpSubscriber = this.onceDumpUpdatedFn;
        this.onceDumpUpdatedFn = void 0;
        const context = await this.contextRetrieverFn('extract');
        const startTime = Date.now();
        const { parseResult, usage } = await (0, index_js_namespaceObject.AiExtractElementInfo)({
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
        (0, external_utils_js_namespaceObject.emitInsightDump)({
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
        (0, utils_namespaceObject.assert)(target, 'target is required for insight.describe');
        const context = await this.contextRetrieverFn('describe');
        const { screenshotBase64, size } = context;
        (0, utils_namespaceObject.assert)(screenshotBase64, 'screenshot is required for insight.describe');
        const { vlMode } = modelConfig;
        const systemPrompt = (0, describe_js_namespaceObject.elementDescriberInstruction)();
        const defaultRectSize = 30;
        const targetRect = Array.isArray(target) ? {
            left: Math.floor(target[0] - defaultRectSize / 2),
            top: Math.floor(target[1] - defaultRectSize / 2),
            width: defaultRectSize,
            height: defaultRectSize
        } : target;
        let imagePayload = await (0, img_namespaceObject.compositeElementInfoImg)({
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
            const searchArea = (0, common_js_namespaceObject.expandSearchArea)(targetRect, context.size, vlMode);
            debug('describe: set searchArea', searchArea);
            const croppedResult = await (0, img_namespaceObject.cropByRect)(imagePayload, searchArea, 'qwen-vl' === vlMode);
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
        const res = await callAIFn(msgs, common_js_namespaceObject.AIActionType.DESCRIBE_ELEMENT, modelConfig);
        const { content } = res;
        (0, utils_namespaceObject.assert)(!content.error, `describe failed: ${content.error}`);
        (0, utils_namespaceObject.assert)(content.description, 'failed to describe the element');
        return content;
    }
    constructor(context, opt){
        _define_property(this, "contextRetrieverFn", void 0);
        _define_property(this, "aiVendorFn", index_js_namespaceObject.callAIWithObjectResponse);
        _define_property(this, "onceDumpUpdatedFn", void 0);
        _define_property(this, "taskInfo", void 0);
        (0, utils_namespaceObject.assert)(context, 'context is required for Insight');
        if ('function' == typeof context) this.contextRetrieverFn = context;
        else this.contextRetrieverFn = ()=>Promise.resolve(context);
        if (void 0 !== (null == opt ? void 0 : opt.aiVendorFn)) this.aiVendorFn = opt.aiVendorFn;
        if (void 0 !== (null == opt ? void 0 : opt.taskInfo)) this.taskInfo = opt.taskInfo;
    }
}
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map