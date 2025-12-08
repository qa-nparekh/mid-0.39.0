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
    safeOverrideAIConfig: ()=>safeOverrideAIConfig,
    useSafeOverrideAIConfig: ()=>useSafeOverrideAIConfig
});
const env_namespaceObject = require("@sqai/shared/env");
const external_antd_namespaceObject = require("antd");
function safeOverrideAIConfig(newConfig) {
    let extendMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false, showErrorMessage = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
    try {
        (0, env_namespaceObject.overrideAIConfig)(newConfig, extendMode);
        return true;
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Failed to override AI config:', err);
        if (showErrorMessage) external_antd_namespaceObject.message.error(`Failed to apply AI configuration: ${err.message}`);
        return false;
    }
}
function useSafeOverrideAIConfig() {
    const applyConfig = function(newConfig) {
        let extendMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false, showErrorMessage = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
        return safeOverrideAIConfig(newConfig, extendMode, showErrorMessage);
    };
    return {
        applyConfig
    };
}
exports.safeOverrideAIConfig = __webpack_exports__.safeOverrideAIConfig;
exports.useSafeOverrideAIConfig = __webpack_exports__.useSafeOverrideAIConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "safeOverrideAIConfig",
    "useSafeOverrideAIConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
