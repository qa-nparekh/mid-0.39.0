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
    maskConfig: ()=>maskConfig,
    createAssert: ()=>createAssert,
    parseJson: ()=>parseJson
});
const external_utils_js_namespaceObject = require("../utils.js");
const maskKey = (key, maskChar = '*')=>{
    if ('string' != typeof key || 0 === key.length) return key;
    const prefixLen = 3;
    const suffixLen = 3;
    const keepLength = prefixLen + suffixLen;
    if (key.length <= keepLength) return key;
    const prefix = key.substring(0, prefixLen);
    const suffix = key.substring(key.length - suffixLen);
    const maskLength = key.length - keepLength;
    const mask = maskChar.repeat(maskLength);
    return `${prefix}${mask}${suffix}`;
};
const maskConfig = (config)=>Object.fromEntries(Object.entries(config).map(([key, value])=>{
        if ([
            'openaiApiKey',
            'azureOpenaiKey',
            'anthropicApiKey'
        ].includes(key)) return [
            key,
            maskKey(value)
        ];
        if ([
            'openaiExtraConfig',
            'azureExtraConfig'
        ].includes(key)) return [
            key,
            maskKey(JSON.stringify(value))
        ];
        return [
            key,
            value
        ];
    }));
const parseJson = (key, value)=>{
    if (value) try {
        return JSON.parse(value);
    } catch (e) {
        throw new Error(`Failed to parse ${key} as a JSON. ${e.message}`, {
            cause: e
        });
    }
};
const createAssert = (modelNameKey, provider, modelName)=>(value, key, modelVendorFlag)=>{
        if (modelName) if (modelVendorFlag) (0, external_utils_js_namespaceObject.assert)(value, `The ${key} must be a non-empty string because of the ${modelNameKey} is declared as ${modelName} and ${modelVendorFlag} has also been specified in ${provider}, but got: ${value}. Please check your config.`);
        else (0, external_utils_js_namespaceObject.assert)(value, `The ${key} must be a non-empty string because of the ${modelNameKey} is declared as ${modelName} in ${provider}, but got: ${value}. Please check your config.`);
        else (0, external_utils_js_namespaceObject.assert)(value, `The ${key} must be a non-empty string, but got: ${value}. Please check your config.`);
    };
exports.createAssert = __webpack_exports__.createAssert;
exports.maskConfig = __webpack_exports__.maskConfig;
exports.parseJson = __webpack_exports__.parseJson;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "createAssert",
    "maskConfig",
    "parseJson"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
