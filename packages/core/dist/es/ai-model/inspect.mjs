import { cropByRect, paddingToMatchBlockByBase64, preProcessImageUrl } from "@sqai/shared/img";
import { getDebug } from "@sqai/shared/logger";
import { assert } from "@sqai/shared/utils";
import { AIActionType, adaptBboxToRect, expandSearchArea, markupImageForLLM, mergeRects } from "./common.mjs";
import { extractDataQueryPrompt, systemPromptToExtract } from "./prompt/extraction.mjs";
import { findElementPrompt, systemPromptToLocateElement } from "./prompt/llm-locator.mjs";
import { sectionLocatorInstruction, systemPromptToLocateSection } from "./prompt/llm-section-locator.mjs";
import { describeUserPage, distance, distanceThreshold, elementByPositionWithElementInfo } from "./prompt/util.mjs";
import { callAIWithObjectResponse } from "./service-caller/index.mjs";
const debugInspect = getDebug('ai:inspect');
const debugSection = getDebug('ai:section');
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
            const base64 = await preProcessImageUrl(item.url, !!multimodalPrompt.convertHttpImage2Base64);
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
    const { description, elementById, insertElementByPosition } = await describeUserPage(context, {
        vlMode
    });
    assert(targetElementDescription, "cannot find the target element description");
    const userInstructionPrompt = findElementPrompt({
        pageDescription: description,
        targetElementDescription: extraTextFromUserPrompt(targetElementDescription)
    });
    const systemPrompt = systemPromptToLocateElement(vlMode);
    let imagePayload = screenshotBase64;
    let imageWidth = context.size.width;
    let imageHeight = context.size.height;
    let originalImageWidth = imageWidth;
    let originalImageHeight = imageHeight;
    if (options.searchConfig) {
        var _options_searchConfig_rect, _options_searchConfig_rect1;
        assert(options.searchConfig.rect, 'searchArea is provided but its rect cannot be found. Failed to locate element');
        assert(options.searchConfig.imageBase64, 'searchArea is provided but its imageBase64 cannot be found. Failed to locate element');
        imagePayload = options.searchConfig.imageBase64;
        imageWidth = null == (_options_searchConfig_rect = options.searchConfig.rect) ? void 0 : _options_searchConfig_rect.width;
        imageHeight = null == (_options_searchConfig_rect1 = options.searchConfig.rect) ? void 0 : _options_searchConfig_rect1.height;
        originalImageWidth = imageWidth;
        originalImageHeight = imageHeight;
    } else if ('qwen-vl' === vlMode) {
        const paddedResult = await paddingToMatchBlockByBase64(imagePayload);
        imageWidth = paddedResult.width;
        imageHeight = paddedResult.height;
        imagePayload = paddedResult.imageBase64;
    } else if ('qwen3-vl' === vlMode) ;
    else if (!vlMode) imagePayload = await markupImageForLLM(screenshotBase64, context.tree, context.size);
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
    const res = await callAIFn(msgs, AIActionType.INSPECT_ELEMENT, modelConfig);
    const rawResponse = JSON.stringify(res.content);
    let resRect;
    let matchedElements = 'elements' in res.content ? res.content.elements : [];
    let errors = 'errors' in res.content ? res.content.errors : [];
    try {
        if ('bbox' in res.content && Array.isArray(res.content.bbox)) {
            var _options_searchConfig_rect2, _options_searchConfig, _options_searchConfig_rect3, _options_searchConfig1;
            resRect = adaptBboxToRect(res.content.bbox, imageWidth, imageHeight, null == (_options_searchConfig = options.searchConfig) ? void 0 : null == (_options_searchConfig_rect2 = _options_searchConfig.rect) ? void 0 : _options_searchConfig_rect2.left, null == (_options_searchConfig1 = options.searchConfig) ? void 0 : null == (_options_searchConfig_rect3 = _options_searchConfig1.rect) ? void 0 : _options_searchConfig_rect3.top, originalImageWidth, originalImageHeight, vlMode);
            debugInspect('resRect', resRect);
            const rectCenter = {
                x: resRect.left + resRect.width / 2,
                y: resRect.top + resRect.height / 2
            };
            let element = elementByPositionWithElementInfo(context.tree, rectCenter);
            const distanceToCenter = element ? distance({
                x: element.center[0],
                y: element.center[1]
            }, rectCenter) : 0;
            if (!element || distanceToCenter > distanceThreshold) element = insertElementByPosition(rectCenter);
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
    const systemPrompt = systemPromptToLocateSection(vlMode);
    const sectionLocatorInstructionText = sectionLocatorInstruction({
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
    const result = await callAIWithObjectResponse(msgs, AIActionType.EXTRACT_DATA, modelConfig);
    let sectionRect;
    const sectionBbox = result.content.bbox;
    if (sectionBbox) {
        const targetRect = adaptBboxToRect(sectionBbox, context.size.width, context.size.height, 0, 0, context.size.width, context.size.height, vlMode);
        debugSection('original targetRect %j', targetRect);
        const referenceBboxList = result.content.references_bbox || [];
        debugSection('referenceBboxList %j', referenceBboxList);
        const referenceRects = referenceBboxList.filter((bbox)=>Array.isArray(bbox)).map((bbox)=>adaptBboxToRect(bbox, context.size.width, context.size.height, 0, 0, context.size.width, context.size.height, vlMode));
        debugSection('referenceRects %j', referenceRects);
        const mergedRect = mergeRects([
            targetRect,
            ...referenceRects
        ]);
        debugSection('mergedRect %j', mergedRect);
        sectionRect = expandSearchArea(mergedRect, context.size, vlMode);
        debugSection('expanded sectionRect %j', sectionRect);
    }
    let imageBase64 = screenshotBase64;
    if (sectionRect) {
        const croppedResult = await cropByRect(screenshotBase64, sectionRect, 'qwen-vl' === vlMode);
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
    const systemPrompt = systemPromptToExtract();
    const { screenshotBase64 } = context;
    const { description, elementById } = await describeUserPage(context, {
        truncateTextLength: 200,
        filterNonTextContent: false,
        visibleOnly: false,
        domIncluded: null == extractOption ? void 0 : extractOption.domIncluded,
        vlMode
    });
    const extractDataPromptText = extractDataQueryPrompt(description, dataQuery);
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
    const result = await callAIWithObjectResponse(msgs, AIActionType.EXTRACT_DATA, modelConfig);
    return {
        parseResult: result.content,
        elementById,
        usage: result.usage
    };
}
export { AiExtractElementInfo, AiLocateElement, AiLocateSection };

//# sourceMappingURL=inspect.mjs.map