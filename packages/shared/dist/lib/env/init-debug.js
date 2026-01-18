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
    initDebugConfig: ()=>initDebugConfig
});
const external_logger_js_namespaceObject = require("../logger.js");
const external_basic_js_namespaceObject = require("./basic.js");
const external_types_js_namespaceObject = require("./types.js");
const initDebugConfig = ()=>{
    const shouldPrintTiming = (0, external_basic_js_namespaceObject.getBasicEnvValue)(external_types_js_namespaceObject.SQAI_DEBUG_AI_PROFILE);
    let debugConfig = '';
    if (shouldPrintTiming) {
        console.warn('SQAI_DEBUG_AI_PROFILE is deprecated, use DEBUG=sqai:ai:profile instead');
        debugConfig = 'ai:profile';
    }
    const shouldPrintAIResponse = (0, external_basic_js_namespaceObject.getBasicEnvValue)(external_types_js_namespaceObject.SQAI_DEBUG_AI_RESPONSE);
    if (shouldPrintAIResponse) {
        console.warn('SQAI_DEBUG_AI_RESPONSE is deprecated, use DEBUG=sqai:ai:response instead');
        debugConfig = debugConfig ? 'ai:*' : 'ai:call';
    }
    if (debugConfig) (0, external_logger_js_namespaceObject.enableDebug)(debugConfig);
};
exports.initDebugConfig = __webpack_exports__.initDebugConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "initDebugConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
