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
    SizeSchema: ()=>SizeSchema,
    TMultimodalPromptSchema: ()=>TMultimodalPromptSchema,
    expandSearchArea: ()=>expandSearchArea,
    AIActionType: ()=>common_AIActionType,
    adaptBbox: ()=>adaptBbox,
    TUserPromptSchema: ()=>TUserPromptSchema,
    findAllMidsceneLocatorField: ()=>findAllMidsceneLocatorField,
    loadActionParam: ()=>loadActionParam,
    fillBboxParam: ()=>fillBboxParam,
    adaptGeminiBbox: ()=>adaptGeminiBbox,
    mergeRects: ()=>mergeRects,
    RectSchema: ()=>RectSchema,
    PointSchema: ()=>PointSchema,
    adaptBboxToRect: ()=>adaptBboxToRect,
    markupImageForLLM: ()=>markupImageForLLM,
    normalized01000: ()=>normalized01000,
    adaptDoubaoBbox: ()=>adaptDoubaoBbox,
    dumpMidsceneLocatorField: ()=>dumpMidsceneLocatorField,
    getMidsceneLocationSchema: ()=>getMidsceneLocationSchema,
    adaptQwenBbox: ()=>adaptQwenBbox,
    buildYamlFlowFromPlans: ()=>buildYamlFlowFromPlans,
    ifMidsceneLocatorField: ()=>ifMidsceneLocatorField,
    parseActionParam: ()=>parseActionParam,
    dumpActionParam: ()=>dumpActionParam,
    warnGPT4oSizeLimit: ()=>warnGPT4oSizeLimit
});
const utils_namespaceObject = require("@sqaitech/shared/utils");
const constants_namespaceObject = require("@sqaitech/shared/constants");
const extractor_namespaceObject = require("@sqaitech/shared/extractor");
const img_namespaceObject = require("@sqaitech/shared/img");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const external_zod_namespaceObject = require("zod");
var common_AIActionType = /*#__PURE__*/ function(AIActionType) {
    AIActionType[AIActionType["ASSERT"] = 0] = "ASSERT";
    AIActionType[AIActionType["INSPECT_ELEMENT"] = 1] = "INSPECT_ELEMENT";
    AIActionType[AIActionType["EXTRACT_DATA"] = 2] = "EXTRACT_DATA";
    AIActionType[AIActionType["PLAN"] = 3] = "PLAN";
    AIActionType[AIActionType["DESCRIBE_ELEMENT"] = 4] = "DESCRIBE_ELEMENT";
    AIActionType[AIActionType["TEXT"] = 5] = "TEXT";
    return AIActionType;
}({});
const defaultBboxSize = 20;
const debugInspectUtils = (0, logger_namespaceObject.getDebug)('ai:common');
function fillBboxParam(locate, width, height, rightLimit, bottomLimit, vlMode) {
    if (locate.bbox_2d && !(null == locate ? void 0 : locate.bbox)) {
        locate.bbox = locate.bbox_2d;
        delete locate.bbox_2d;
    }
    if (null == locate ? void 0 : locate.bbox) locate.bbox = adaptBbox(locate.bbox, width, height, rightLimit, bottomLimit, vlMode);
    return locate;
}
function adaptQwenBbox(bbox) {
    if (bbox.length < 2) {
        const msg = `invalid bbox data for qwen-vl mode: ${JSON.stringify(bbox)} `;
        throw new Error(msg);
    }
    const result = [
        Math.round(bbox[0]),
        Math.round(bbox[1]),
        'number' == typeof bbox[2] ? Math.round(bbox[2]) : Math.round(bbox[0] + defaultBboxSize),
        'number' == typeof bbox[3] ? Math.round(bbox[3]) : Math.round(bbox[1] + defaultBboxSize)
    ];
    return result;
}
function adaptDoubaoBbox(bbox, width, height) {
    (0, utils_namespaceObject.assert)(width > 0 && height > 0, 'width and height must be greater than 0 in doubao mode');
    if ('string' == typeof bbox) {
        (0, utils_namespaceObject.assert)(/^(\d+)\s(\d+)\s(\d+)\s(\d+)$/.test(bbox.trim()), `invalid bbox data string for doubao-vision mode: ${bbox}`);
        const splitted = bbox.split(' ');
        if (4 === splitted.length) return [
            Math.round(Number(splitted[0]) * width / 1000),
            Math.round(Number(splitted[1]) * height / 1000),
            Math.round(Number(splitted[2]) * width / 1000),
            Math.round(Number(splitted[3]) * height / 1000)
        ];
        throw new Error(`invalid bbox data string for doubao-vision mode: ${bbox}`);
    }
    if (Array.isArray(bbox) && Array.isArray(bbox[0])) bbox = bbox[0];
    let bboxList = [];
    if (Array.isArray(bbox) && 'string' == typeof bbox[0]) bbox.forEach((item)=>{
        if ('string' == typeof item && item.includes(',')) {
            const [x, y] = item.split(',');
            bboxList.push(Number(x.trim()), Number(y.trim()));
        } else if ('string' == typeof item && item.includes(' ')) {
            const [x, y] = item.split(' ');
            bboxList.push(Number(x.trim()), Number(y.trim()));
        } else bboxList.push(Number(item));
    });
    else bboxList = bbox;
    if (4 === bboxList.length || 5 === bboxList.length) return [
        Math.round(bboxList[0] * width / 1000),
        Math.round(bboxList[1] * height / 1000),
        Math.round(bboxList[2] * width / 1000),
        Math.round(bboxList[3] * height / 1000)
    ];
    if (6 === bboxList.length || 2 === bboxList.length || 3 === bboxList.length || 7 === bboxList.length) return [
        Math.max(0, Math.round(bboxList[0] * width / 1000) - defaultBboxSize / 2),
        Math.max(0, Math.round(bboxList[1] * height / 1000) - defaultBboxSize / 2),
        Math.min(width, Math.round(bboxList[0] * width / 1000) + defaultBboxSize / 2),
        Math.min(height, Math.round(bboxList[1] * height / 1000) + defaultBboxSize / 2)
    ];
    if (8 === bbox.length) return [
        Math.round(bboxList[0] * width / 1000),
        Math.round(bboxList[1] * height / 1000),
        Math.round(bboxList[4] * width / 1000),
        Math.round(bboxList[5] * height / 1000)
    ];
    const msg = `invalid bbox data for doubao-vision mode: ${JSON.stringify(bbox)} `;
    throw new Error(msg);
}
function adaptBbox(bbox, width, height, rightLimit, bottomLimit, vlMode) {
    let result = [
        0,
        0,
        0,
        0
    ];
    result = 'doubao-vision' === vlMode || 'vlm-ui-tars' === vlMode ? adaptDoubaoBbox(bbox, width, height) : 'gemini' === vlMode ? adaptGeminiBbox(bbox, width, height) : 'qwen3-vl' === vlMode ? normalized01000(bbox, width, height) : adaptQwenBbox(bbox);
    result[2] = Math.min(result[2], rightLimit);
    result[3] = Math.min(result[3], bottomLimit);
    return result;
}
function normalized01000(bbox, width, height) {
    return [
        Math.round(bbox[0] * width / 1000),
        Math.round(bbox[1] * height / 1000),
        Math.round(bbox[2] * width / 1000),
        Math.round(bbox[3] * height / 1000)
    ];
}
function adaptGeminiBbox(bbox, width, height) {
    const left = Math.round(bbox[1] * width / 1000);
    const top = Math.round(bbox[0] * height / 1000);
    const right = Math.round(bbox[3] * width / 1000);
    const bottom = Math.round(bbox[2] * height / 1000);
    return [
        left,
        top,
        right,
        bottom
    ];
}
function adaptBboxToRect(bbox, width, height, offsetX = 0, offsetY = 0, rightLimit = width, bottomLimit = height, vlMode) {
    debugInspectUtils('adaptBboxToRect', bbox, width, height, 'offset', offsetX, offsetY, 'limit', rightLimit, bottomLimit, 'vlMode', vlMode);
    const [left, top, right, bottom] = adaptBbox(bbox, width, height, rightLimit, bottomLimit, vlMode);
    const rectLeft = left;
    const rectTop = top;
    let rectWidth = right - left;
    let rectHeight = bottom - top;
    if (rectLeft + rectWidth > width) rectWidth = width - rectLeft;
    if (rectTop + rectHeight > height) rectHeight = height - rectTop;
    rectWidth = Math.max(1, rectWidth);
    rectHeight = Math.max(1, rectHeight);
    const rect = {
        left: rectLeft + offsetX,
        top: rectTop + offsetY,
        width: rectWidth,
        height: rectHeight
    };
    debugInspectUtils('adaptBboxToRect, result=', rect);
    return rect;
}
let warned = false;
function warnGPT4oSizeLimit(size, modelName) {
    if (warned) return;
    if (modelName.toLowerCase().includes('gpt-4o')) {
        const warningMsg = `GPT-4o has a maximum image input size of 2000x768 or 768x2000, but got ${size.width}x${size.height}. Please set your interface to a smaller resolution. Otherwise, the result may be inaccurate.`;
        if (Math.max(size.width, size.height) > 2000 || Math.min(size.width, size.height) > 768) {
            console.warn(warningMsg);
            warned = true;
        }
    } else if (size.width > 1800 || size.height > 1800) {
        console.warn(`The image size seems too large (${size.width}x${size.height}). It may lead to more token usage, slower response, and inaccurate result.`);
        warned = true;
    }
}
function mergeRects(rects) {
    const minLeft = Math.min(...rects.map((r)=>r.left));
    const minTop = Math.min(...rects.map((r)=>r.top));
    const maxRight = Math.max(...rects.map((r)=>r.left + r.width));
    const maxBottom = Math.max(...rects.map((r)=>r.top + r.height));
    return {
        left: minLeft,
        top: minTop,
        width: maxRight - minLeft,
        height: maxBottom - minTop
    };
}
function expandSearchArea(rect, screenSize, vlMode) {
    const minEdgeSize = 'doubao-vision' === vlMode ? 500 : 300;
    const defaultPadding = 160;
    const paddingSizeHorizontal = rect.width < minEdgeSize ? Math.ceil((minEdgeSize - rect.width) / 2) : defaultPadding;
    const paddingSizeVertical = rect.height < minEdgeSize ? Math.ceil((minEdgeSize - rect.height) / 2) : defaultPadding;
    let newWidth = Math.max(minEdgeSize, rect.width + 2 * paddingSizeHorizontal);
    let newHeight = Math.max(minEdgeSize, rect.height + 2 * paddingSizeVertical);
    let newLeft = rect.left - paddingSizeHorizontal;
    let newTop = rect.top - paddingSizeVertical;
    if (newLeft + newWidth > screenSize.width) newLeft = screenSize.width - newWidth;
    if (newTop + newHeight > screenSize.height) newTop = screenSize.height - newHeight;
    newLeft = Math.max(0, newLeft);
    newTop = Math.max(0, newTop);
    if (newLeft + newWidth > screenSize.width) newWidth = screenSize.width - newLeft;
    if (newTop + newHeight > screenSize.height) newHeight = screenSize.height - newTop;
    rect.left = newLeft;
    rect.top = newTop;
    rect.width = newWidth;
    rect.height = newHeight;
    return rect;
}
async function markupImageForLLM(screenshotBase64, tree, size) {
    const elementsInfo = (0, extractor_namespaceObject.treeToList)(tree);
    const elementsPositionInfoWithoutText = elementsInfo.filter((elementInfo)=>{
        if (elementInfo.attributes.nodeType === constants_namespaceObject.NodeType.TEXT) return false;
        return true;
    });
    const imagePayload = await (0, img_namespaceObject.compositeElementInfoImg)({
        inputImgBase64: screenshotBase64,
        elementsPositionInfo: elementsPositionInfoWithoutText,
        size
    });
    return imagePayload;
}
function buildYamlFlowFromPlans(plans, actionSpace, sleep) {
    const flow = [];
    for (const plan of plans){
        const verb = plan.type;
        const action = actionSpace.find((action)=>action.name === verb);
        if (!action) {
            console.warn(`Cannot convert action ${verb} to yaml flow. Will ignore it.`);
            continue;
        }
        const flowKey = action.interfaceAlias || verb;
        const flowParam = action.paramSchema ? dumpActionParam(plan.param || {}, action.paramSchema) : {};
        const flowItem = {
            [flowKey]: '',
            ...flowParam
        };
        flow.push(flowItem);
    }
    if (sleep) flow.push({
        sleep
    });
    return flow;
}
const PointSchema = external_zod_namespaceObject.z.object({
    left: external_zod_namespaceObject.z.number(),
    top: external_zod_namespaceObject.z.number()
});
const SizeSchema = external_zod_namespaceObject.z.object({
    width: external_zod_namespaceObject.z.number(),
    height: external_zod_namespaceObject.z.number(),
    dpr: external_zod_namespaceObject.z.number().optional()
});
const RectSchema = PointSchema.and(SizeSchema).and(external_zod_namespaceObject.z.object({
    zoom: external_zod_namespaceObject.z.number().optional()
}));
const TMultimodalPromptSchema = external_zod_namespaceObject.z.object({
    images: external_zod_namespaceObject.z.array(external_zod_namespaceObject.z.object({
        name: external_zod_namespaceObject.z.string(),
        url: external_zod_namespaceObject.z.string()
    })).optional(),
    convertHttpImage2Base64: external_zod_namespaceObject.z.boolean().optional()
});
const TUserPromptSchema = external_zod_namespaceObject.z.union([
    external_zod_namespaceObject.z.string(),
    external_zod_namespaceObject.z.object({
        prompt: external_zod_namespaceObject.z.string()
    }).and(TMultimodalPromptSchema.partial())
]);
const locateFieldFlagName = 'SQAI_location_field_flag';
const MidsceneLocationInput = external_zod_namespaceObject.z.object({
    prompt: TUserPromptSchema,
    deepThink: external_zod_namespaceObject.z.boolean().optional(),
    cacheable: external_zod_namespaceObject.z.boolean().optional(),
    xpath: external_zod_namespaceObject.z.union([
        external_zod_namespaceObject.z.string(),
        external_zod_namespaceObject.z.boolean()
    ]).optional()
}).passthrough();
external_zod_namespaceObject.z.object({
    [locateFieldFlagName]: external_zod_namespaceObject.z.literal(true),
    prompt: TUserPromptSchema,
    deepThink: external_zod_namespaceObject.z.boolean().optional(),
    cacheable: external_zod_namespaceObject.z.boolean().optional(),
    xpath: external_zod_namespaceObject.z.boolean().optional(),
    center: external_zod_namespaceObject.z.tuple([
        external_zod_namespaceObject.z.number(),
        external_zod_namespaceObject.z.number()
    ]),
    rect: RectSchema
}).passthrough();
const getMidsceneLocationSchema = ()=>MidsceneLocationInput;
const ifMidsceneLocatorField = (field)=>{
    var _actualField__def, _actualField__def1;
    let actualField = field;
    if ((null == (_actualField__def = actualField._def) ? void 0 : _actualField__def.typeName) === 'ZodOptional') actualField = actualField._def.innerType;
    if ((null == (_actualField__def1 = actualField._def) ? void 0 : _actualField__def1.typeName) === 'ZodObject') {
        const shape = actualField._def.shape();
        if (locateFieldFlagName in shape) return true;
        if ('prompt' in shape && shape.prompt) return true;
    }
    return false;
};
const dumpMidsceneLocatorField = (field)=>{
    (0, utils_namespaceObject.assert)(ifMidsceneLocatorField(field), 'field is not a midscene locator field');
    if ('string' == typeof field) return field;
    if (field && 'object' == typeof field && field.prompt) {
        if ('string' == typeof field.prompt) return field.prompt;
        if ('object' == typeof field.prompt && field.prompt.prompt) return field.prompt.prompt;
    }
    return String(field);
};
const findAllMidsceneLocatorField = (zodType, requiredOnly)=>{
    var _zodObject__def;
    if (!zodType) return [];
    const zodObject = zodType;
    if ((null == (_zodObject__def = zodObject._def) ? void 0 : _zodObject__def.typeName) === 'ZodObject' && zodObject.shape) {
        const keys = Object.keys(zodObject.shape);
        return keys.filter((key)=>{
            const field = zodObject.shape[key];
            if (!ifMidsceneLocatorField(field)) return false;
            if (requiredOnly) {
                var _field__def;
                return (null == (_field__def = field._def) ? void 0 : _field__def.typeName) !== 'ZodOptional';
            }
            return true;
        });
    }
    return [];
};
const dumpActionParam = (jsonObject, zodSchema)=>{
    const locatorFields = findAllMidsceneLocatorField(zodSchema);
    const result = {
        ...jsonObject
    };
    for (const fieldName of locatorFields){
        const fieldValue = result[fieldName];
        if (fieldValue) {
            if ('string' == typeof fieldValue) result[fieldName] = fieldValue;
            else if ('object' == typeof fieldValue) {
                if (fieldValue.prompt) {
                    if ('string' == typeof fieldValue.prompt) result[fieldName] = fieldValue.prompt;
                    else if ('object' == typeof fieldValue.prompt && fieldValue.prompt.prompt) result[fieldName] = fieldValue.prompt.prompt;
                }
            }
        }
    }
    return result;
};
const loadActionParam = (jsonObject, zodSchema)=>{
    const locatorFields = findAllMidsceneLocatorField(zodSchema);
    const result = {
        ...jsonObject
    };
    for (const fieldName of locatorFields){
        const fieldValue = result[fieldName];
        if (fieldValue && 'string' == typeof fieldValue) result[fieldName] = {
            [locateFieldFlagName]: true,
            prompt: fieldValue
        };
    }
    return result;
};
const parseActionParam = (rawParam, zodSchema)=>{
    const param = rawParam ?? {};
    const locateFields = findAllMidsceneLocatorField(zodSchema);
    if (0 === locateFields.length) return zodSchema.parse(param);
    const locateFieldValues = {};
    for (const fieldName of locateFields)if (fieldName in param) locateFieldValues[fieldName] = param[fieldName];
    const paramsForValidation = {};
    for(const key in param)if (locateFields.includes(key)) paramsForValidation[key] = {
        prompt: '_dummy_'
    };
    else paramsForValidation[key] = param[key];
    const validated = zodSchema.parse(paramsForValidation);
    for(const fieldName in locateFieldValues)validated[fieldName] = locateFieldValues[fieldName];
    return validated;
};
exports.AIActionType = __webpack_exports__.AIActionType;
exports.PointSchema = __webpack_exports__.PointSchema;
exports.RectSchema = __webpack_exports__.RectSchema;
exports.SizeSchema = __webpack_exports__.SizeSchema;
exports.TMultimodalPromptSchema = __webpack_exports__.TMultimodalPromptSchema;
exports.TUserPromptSchema = __webpack_exports__.TUserPromptSchema;
exports.adaptBbox = __webpack_exports__.adaptBbox;
exports.adaptBboxToRect = __webpack_exports__.adaptBboxToRect;
exports.adaptDoubaoBbox = __webpack_exports__.adaptDoubaoBbox;
exports.adaptGeminiBbox = __webpack_exports__.adaptGeminiBbox;
exports.adaptQwenBbox = __webpack_exports__.adaptQwenBbox;
exports.buildYamlFlowFromPlans = __webpack_exports__.buildYamlFlowFromPlans;
exports.dumpActionParam = __webpack_exports__.dumpActionParam;
exports.dumpMidsceneLocatorField = __webpack_exports__.dumpMidsceneLocatorField;
exports.expandSearchArea = __webpack_exports__.expandSearchArea;
exports.fillBboxParam = __webpack_exports__.fillBboxParam;
exports.findAllMidsceneLocatorField = __webpack_exports__.findAllMidsceneLocatorField;
exports.getMidsceneLocationSchema = __webpack_exports__.getMidsceneLocationSchema;
exports.ifMidsceneLocatorField = __webpack_exports__.ifMidsceneLocatorField;
exports.loadActionParam = __webpack_exports__.loadActionParam;
exports.markupImageForLLM = __webpack_exports__.markupImageForLLM;
exports.mergeRects = __webpack_exports__.mergeRects;
exports.normalized01000 = __webpack_exports__.normalized01000;
exports.parseActionParam = __webpack_exports__.parseActionParam;
exports.warnGPT4oSizeLimit = __webpack_exports__.warnGPT4oSizeLimit;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AIActionType",
    "PointSchema",
    "RectSchema",
    "SizeSchema",
    "TMultimodalPromptSchema",
    "TUserPromptSchema",
    "adaptBbox",
    "adaptBboxToRect",
    "adaptDoubaoBbox",
    "adaptGeminiBbox",
    "adaptQwenBbox",
    "buildYamlFlowFromPlans",
    "dumpActionParam",
    "dumpMidsceneLocatorField",
    "expandSearchArea",
    "fillBboxParam",
    "findAllMidsceneLocatorField",
    "getMidsceneLocationSchema",
    "ifMidsceneLocatorField",
    "loadActionParam",
    "markupImageForLLM",
    "mergeRects",
    "normalized01000",
    "parseActionParam",
    "warnGPT4oSizeLimit"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=common.js.map