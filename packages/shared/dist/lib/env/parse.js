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
    parseVlModeAndUiTarsFromGlobalConfig: ()=>parseVlModeAndUiTarsFromGlobalConfig,
    parseVlModeAndUiTarsModelVersionFromRawValue: ()=>parseVlModeAndUiTarsModelVersionFromRawValue
});
const external_types_js_namespaceObject = require("./types.js");
const parseVlModeAndUiTarsModelVersionFromRawValue = (vlModeRaw)=>{
    if (!vlModeRaw) return {
        vlMode: void 0,
        uiTarsVersion: void 0
    };
    if (!external_types_js_namespaceObject.VL_MODE_RAW_VALID_VALUES.includes(vlModeRaw)) throw new Error(`the value ${vlModeRaw} is not a valid VL_MODE value, must be one of ${external_types_js_namespaceObject.VL_MODE_RAW_VALID_VALUES}`);
    const raw = vlModeRaw;
    if ('vlm-ui-tars' === raw) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: external_types_js_namespaceObject.UITarsModelVersion.V1_0
    };
    if ('vlm-ui-tars-doubao' === raw || 'vlm-ui-tars-doubao-1.5' === raw) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: external_types_js_namespaceObject.UITarsModelVersion.DOUBAO_1_5_20B
    };
    return {
        vlMode: raw,
        uiTarsVersion: void 0
    };
};
const parseVlModeAndUiTarsFromGlobalConfig = (provider)=>{
    const isDoubao = provider[external_types_js_namespaceObject.SQAI_USE_DOUBAO_VISION];
    const isQwen = provider[external_types_js_namespaceObject.SQAI_USE_QWEN_VL];
    const isQwen3 = provider[external_types_js_namespaceObject.SQAI_USE_QWEN3_VL];
    const isUiTars = provider[external_types_js_namespaceObject.SQAI_USE_VLM_UI_TARS];
    const isGemini = provider[external_types_js_namespaceObject.SQAI_USE_GEMINI];
    const enabledModes = [
        isDoubao && external_types_js_namespaceObject.SQAI_USE_DOUBAO_VISION,
        isQwen && external_types_js_namespaceObject.SQAI_USE_QWEN_VL,
        isQwen3 && external_types_js_namespaceObject.SQAI_USE_QWEN3_VL,
        isUiTars && external_types_js_namespaceObject.SQAI_USE_VLM_UI_TARS,
        isGemini && external_types_js_namespaceObject.SQAI_USE_GEMINI
    ].filter(Boolean);
    if (enabledModes.length > 1) throw new Error(`Only one vision mode can be enabled at a time. Currently enabled modes: ${enabledModes.join(', ')}. Please disable all but one mode.`);
    if (isQwen3) return {
        vlMode: 'qwen3-vl',
        uiTarsVersion: void 0
    };
    if (isQwen) return {
        vlMode: 'qwen-vl',
        uiTarsVersion: void 0
    };
    if (isDoubao) return {
        vlMode: 'doubao-vision',
        uiTarsVersion: void 0
    };
    if (isGemini) return {
        vlMode: 'gemini',
        uiTarsVersion: void 0
    };
    if (isUiTars) if ('1' === isUiTars) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: external_types_js_namespaceObject.UITarsModelVersion.V1_0
    };
    else if ('DOUBAO' === isUiTars || 'DOUBAO-1.5' === isUiTars) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: external_types_js_namespaceObject.UITarsModelVersion.DOUBAO_1_5_20B
    };
    else return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: `${isUiTars}`
    };
    return {
        vlMode: void 0,
        uiTarsVersion: void 0
    };
};
exports.parseVlModeAndUiTarsFromGlobalConfig = __webpack_exports__.parseVlModeAndUiTarsFromGlobalConfig;
exports.parseVlModeAndUiTarsModelVersionFromRawValue = __webpack_exports__.parseVlModeAndUiTarsModelVersionFromRawValue;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "parseVlModeAndUiTarsFromGlobalConfig",
    "parseVlModeAndUiTarsModelVersionFromRawValue"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
