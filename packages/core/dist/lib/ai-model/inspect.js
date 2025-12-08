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
    AiLocateElement: ()=>AiLocateElement,
    AiLocateSection: ()=>AiLocateSection,
    AiExtractElementInfo: ()=>AiExtractElementInfo
});
const img_namespaceObject = require("@sqai/shared/img");
const logger_namespaceObject = require("@sqai/shared/logger");
const utils_namespaceObject = require("@sqai/shared/utils");
const external_common_js_namespaceObject = require("./common.js");
const extraction_js_namespaceObject = require("./prompt/extraction.js");
const llm_locator_js_namespaceObject = require("./prompt/llm-locator.js");
const llm_section_locator_js_namespaceObject = require("./prompt/llm-section-locator.js");
const util_js_namespaceObject = require("./prompt/util.js");
const index_js_namespaceObject = require("./service-caller/index.js");
const debugInspect = (0, logger_namespaceObject.getDebug)('ai:inspect');
const debugSection = (0, logger_namespaceObject.getDebug)('ai:section');
const extraTextFromUserPrompt = (prompt)=>{
    if ('string' == typeof prompt) return prompt;
    return prompt.prompt;
};
const promptsToChatParam = async (multimodalPrompt)=>{
    var _multimodalPrompt_images;
    const msgs = [];
    if (null == multimodalPrompt ? void 0 : null == (_multimodalPrompt_images = multimodalPrompt.images) ? void 0 : _multimodalPrompt_images.length) {
        msgs.push({
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: 'Next, I will provide all the reference images.'
                }
            ]
        });
        for (const item of multimodalPrompt.images){
            const base64 = await (0, img_namespaceObject.preProcessImageUrl)(item.url, !!multimodalPrompt.convertHttpImage2Base64);
            msgs.push({
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `reference image ${item.name}:`
                    }
                ]
            });
            msgs.push({
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: base64,
                            detail: 'high'
                        }
                    }
                ]
            });
        }
    }
    return msgs;
};
async function AiLocateElement(options) {
    const { context, targetElementDescription, callAIFn, modelConfig } = options;
    const { vlMode } = modelConfig;
    const { screenshotBase64 } = context;
    const { description, elementById, insertElementByPosition } = await (0, util_js_namespaceObject.describeUserPage)(context, {
        vlMode
    });
    (0, utils_namespaceObject.assert)(targetElementDescription, "cannot find the target element description");
    const userInstructionPrompt = (0, llm_locator_js_namespaceObject.findElementPrompt)({
        pageDescription: description,
        targetElementDescription: extraTextFromUserPrompt(targetElementDescription)
    });
    const systemPrompt = (0, llm_locator_js_namespaceObject.systemPromptToLocateElement)(vlMode);
    let imagePayload = screenshotBase64;
    let imageWidth = context.size.width;
    let imageHeight = context.size.height;
    let originalImageWidth = imageWidth;
    let originalImageHeight = imageHeight;
    if (options.searchConfig) {
        var _options_searchConfig_rect, _options_searchConfig_rect1;
        (0, utils_namespaceObject.assert)(options.searchConfig.rect, 'searchArea is provided but its rect cannot be found. Failed to locate element');
        (0, utils_namespaceObject.assert)(options.searchConfig.imageBase64, 'searchArea is provided but its imageBase64 cannot be found. Failed to locate element');
        imagePayload = options.searchConfig.imageBase64;
        imageWidth = null == (_options_searchConfig_rect = options.searchConfig.rect) ? void 0 : _options_searchConfig_rect.width;
        imageHeight = null == (_options_searchConfig_rect1 = options.searchConfig.rect) ? void 0 : _options_searchConfig_rect1.height;
        originalImageWidth = imageWidth;
        originalImageHeight = imageHeight;
    } else if ('qwen-vl' === vlMode) {
        const paddedResult = await (0, img_namespaceObject.paddingToMatchBlockByBase64)(imagePayload);
        imageWidth = paddedResult.width;
        imageHeight = paddedResult.height;
        imagePayload = paddedResult.imageBase64;
    } else if ('qwen3-vl' === vlMode) ;
    else if (!vlMode) imagePayload = await (0, external_common_js_namespaceObject.markupImageForLLM)(screenshotBase64, context.tree, context.size);
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
                },
                {
                    type: 'text',
                    text: userInstructionPrompt
                }
            ]
        }
    ];
    if ('string' != typeof targetElementDescription) {
        const addOns = await promptsToChatParam({
            images: targetElementDescription.images,
            convertHttpImage2Base64: targetElementDescription.convertHttpImage2Base64
        });
        msgs.push(...addOns);
    }
    const res = await callAIFn(msgs, external_common_js_namespaceObject.AIActionType.INSPECT_ELEMENT, modelConfig);
    const rawResponse = JSON.stringify(res.content);
    let resRect;
    let matchedElements = 'elements' in res.content ? res.content.elements : [];
    let errors = 'errors' in res.content ? res.content.errors : [];
    try {
        if ('bbox' in res.content && Array.isArray(res.content.bbox)) {
            var _options_searchConfig_rect2, _options_searchConfig, _options_searchConfig_rect3, _options_searchConfig1;
            resRect = (0, external_common_js_namespaceObject.adaptBboxToRect)(res.content.bbox, imageWidth, imageHeight, null == (_options_searchConfig = options.searchConfig) ? void 0 : null == (_options_searchConfig_rect2 = _options_searchConfig.rect) ? void 0 : _options_searchConfig_rect2.left, null == (_options_searchConfig1 = options.searchConfig) ? void 0 : null == (_options_searchConfig_rect3 = _options_searchConfig1.rect) ? void 0 : _options_searchConfig_rect3.top, originalImageWidth, originalImageHeight, vlMode);
            debugInspect('resRect', resRect);
            const rectCenter = {
                x: resRect.left + resRect.width / 2,
                y: resRect.top + resRect.height / 2
            };
            let element = (0, util_js_namespaceObject.elementByPositionWithElementInfo)(context.tree, rectCenter);
            const distanceToCenter = element ? (0, util_js_namespaceObject.distance)({
                x: element.center[0],
                y: element.center[1]
            }, rectCenter) : 0;
            if (!element || distanceToCenter > util_js_namespaceObject.distanceThreshold) element = insertElementByPosition(rectCenter);
            if (element) {
                matchedElements = [
                    element
                ];
                errors = [];
            }
        }
    } catch (e) {
        const msg = e instanceof Error ? `Failed to parse bbox: ${e.message}` : 'unknown error in locate';
        if (errors && (null == errors ? void 0 : errors.length) !== 0) errors.push(`(${msg})`);
        else errors = [
            msg
        ];
    }
    return {
        rect: resRect,
        parseResult: {
            elements: matchedElements,
            errors
        },
        rawResponse,
        elementById,
        usage: res.usage,
        isOrderSensitive: 'object' == typeof res.content && null !== res.content && 'isOrderSensitive' in res.content ? res.content.isOrderSensitive : void 0
    };
}
async function AiLocateSection(options) {
    const { context, sectionDescription, modelConfig } = options;
    const { vlMode } = modelConfig;
    const { screenshotBase64 } = context;
    const systemPrompt = (0, llm_section_locator_js_namespaceObject.systemPromptToLocateSection)(vlMode);
    const sectionLocatorInstructionText = (0, llm_section_locator_js_namespaceObject.sectionLocatorInstruction)({
        sectionDescription: extraTextFromUserPrompt(sectionDescription)
    });
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
                        url: screenshotBase64,
                        detail: 'high'
                    }
                },
                {
                    type: 'text',
                    text: sectionLocatorInstructionText
                }
            ]
        }
    ];
    if ('string' != typeof sectionDescription) {
        const addOns = await promptsToChatParam({
            images: sectionDescription.images,
            convertHttpImage2Base64: sectionDescription.convertHttpImage2Base64
        });
        msgs.push(...addOns);
    }
    const result = await (0, index_js_namespaceObject.callAIWithObjectResponse)(msgs, external_common_js_namespaceObject.AIActionType.EXTRACT_DATA, modelConfig);
    let sectionRect;
    const sectionBbox = result.content.bbox;
    if (sectionBbox) {
        const targetRect = (0, external_common_js_namespaceObject.adaptBboxToRect)(sectionBbox, context.size.width, context.size.height, 0, 0, context.size.width, context.size.height, vlMode);
        debugSection('original targetRect %j', targetRect);
        const referenceBboxList = result.content.references_bbox || [];
        debugSection('referenceBboxList %j', referenceBboxList);
        const referenceRects = referenceBboxList.filter((bbox)=>Array.isArray(bbox)).map((bbox)=>(0, external_common_js_namespaceObject.adaptBboxToRect)(bbox, context.size.width, context.size.height, 0, 0, context.size.width, context.size.height, vlMode));
        debugSection('referenceRects %j', referenceRects);
        const mergedRect = (0, external_common_js_namespaceObject.mergeRects)([
            targetRect,
            ...referenceRects
        ]);
        debugSection('mergedRect %j', mergedRect);
        sectionRect = (0, external_common_js_namespaceObject.expandSearchArea)(mergedRect, context.size, vlMode);
        debugSection('expanded sectionRect %j', sectionRect);
    }
    let imageBase64 = screenshotBase64;
    if (sectionRect) {
        const croppedResult = await (0, img_namespaceObject.cropByRect)(screenshotBase64, sectionRect, 'qwen-vl' === vlMode);
        imageBase64 = croppedResult.imageBase64;
        sectionRect.width = croppedResult.width;
        sectionRect.height = croppedResult.height;
    }
    return {
        rect: sectionRect,
        imageBase64,
        error: result.content.error,
        rawResponse: JSON.stringify(result.content),
        usage: result.usage
    };
}
async function AiExtractElementInfo(options) {
    const { dataQuery, context, extractOption, multimodalPrompt, modelConfig } = options;
    const { vlMode } = modelConfig;
    const systemPrompt = (0, extraction_js_namespaceObject.systemPromptToExtract)();
    const { screenshotBase64 } = context;
    const { description, elementById } = await (0, util_js_namespaceObject.describeUserPage)(context, {
        truncateTextLength: 200,
        filterNonTextContent: false,
        visibleOnly: false,
        domIncluded: null == extractOption ? void 0 : extractOption.domIncluded,
        vlMode
    });
    const extractDataPromptText = (0, extraction_js_namespaceObject.extractDataQueryPrompt)(description, dataQuery);
    const userContent = [];
    if ((null == extractOption ? void 0 : extractOption.screenshotIncluded) !== false) userContent.push({
        type: 'image_url',
        image_url: {
            url: screenshotBase64,
            detail: 'high'
        }
    });
    userContent.push({
        type: 'text',
        text: extractDataPromptText
    });
    const msgs = [
        {
            role: 'system',
            content: systemPrompt
        },
        {
            role: 'user',
            content: userContent
        }
    ];
    if (multimodalPrompt) {
        const addOns = await promptsToChatParam({
            images: multimodalPrompt.images,
            convertHttpImage2Base64: multimodalPrompt.convertHttpImage2Base64
        });
        msgs.push(...addOns);
    }
    const result = await (0, index_js_namespaceObject.callAIWithObjectResponse)(msgs, external_common_js_namespaceObject.AIActionType.EXTRACT_DATA, modelConfig);
    return {
        parseResult: result.content,
        elementById,
        usage: result.usage
    };
}
exports.AiExtractElementInfo = __webpack_exports__.AiExtractElementInfo;
exports.AiLocateElement = __webpack_exports__.AiLocateElement;
exports.AiLocateSection = __webpack_exports__.AiLocateSection;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AiExtractElementInfo",
    "AiLocateElement",
    "AiLocateSection"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=inspect.js.map