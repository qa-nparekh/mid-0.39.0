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
    staticAgentFromContext: ()=>staticAgentFromContext,
    actionNameForType: ()=>actionNameForType,
    isRunButtonEnabled: ()=>isRunButtonEnabled,
    getPlaceholderForType: ()=>getPlaceholderForType
});
const static_namespaceObject = require("@sqaitech/web/static");
const external_types_js_namespaceObject = require("../types.js");
const actionNameForType = (type)=>{
    const typeWithoutAi = type.startsWith('ai') ? type.slice(2) : type;
    if (typeWithoutAi.startsWith('IOS')) return typeWithoutAi.substring(3).replace(/([A-Z])/g, ' $1').replace(/^/, 'IOS').trim();
    const fullName = typeWithoutAi.replace(/([A-Z])/g, ' $1').trim();
    const words = fullName.split(' ');
    if (words.length > 3) return words.slice(-3).join(' ');
    return fullName;
};
const staticAgentFromContext = (context)=>{
    const page = new static_namespaceObject.StaticPage(context);
    return new static_namespaceObject.StaticPageAgent(page);
};
const getPlaceholderForType = (type)=>{
    if ('aiQuery' === type) return 'What do you want to query?';
    if ('aiAssert' === type) return 'What do you want to assert?';
    if ('aiTap' === type) return 'What element do you want to tap?';
    if ('aiDoubleClick' === type) return 'What element do you want to double-click?';
    if ('aiHover' === type) return 'What element do you want to hover over?';
    if ('aiInput' === type) return 'Format: <value> | <element>\nExample: hello world | search box';
    if ('aiRightClick' === type) return 'What element do you want to right-click?';
    if ('aiKeyboardPress' === type) return 'Format: <key> | <element (optional)>\nExample: Enter | text field';
    if ('aiScroll' === type) return 'Format: <direction> <amount> | <element (optional)>\nExample: down 500 | main content';
    if ('aiLocate' === type) return 'What element do you want to locate?';
    if ('aiBoolean' === type) return 'What do you want to check (returns true/false)?';
    if ('aiNumber' === type) return 'What number do you want to extract?';
    if ('aiString' === type) return 'What text do you want to extract?';
    if ('aiAsk' === type) return 'What do you want to ask?';
    if ('aiWaitFor' === type) return 'What condition do you want to wait for?';
    return 'What do you want to do?';
};
const isRunButtonEnabled = (runButtonEnabled, needsStructuredParams, params, actionSpace, selectedType, promptValue)=>{
    if (!runButtonEnabled) return false;
    const needsAnyInput = (()=>{
        if (actionSpace) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if (action) {
                if (!action.paramSchema) return false;
                if ('object' == typeof action.paramSchema && 'shape' in action.paramSchema) {
                    const shape = action.paramSchema.shape || {};
                    const shapeKeys = Object.keys(shape);
                    return shapeKeys.length > 0;
                }
            }
        }
        return true;
    })();
    if (!needsAnyInput) return true;
    if (needsStructuredParams) {
        const currentParams = params || {};
        const action = null == actionSpace ? void 0 : actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
        if ((null == action ? void 0 : action.paramSchema) && (0, external_types_js_namespaceObject.isZodObjectSchema)(action.paramSchema)) {
            const schema = action.paramSchema;
            const shape = schema.shape || {};
            return Object.keys(shape).every((key)=>{
                const field = shape[key];
                const { isOptional } = (0, external_types_js_namespaceObject.unwrapZodType)(field);
                const value = currentParams[key];
                return isOptional || void 0 !== value && '' !== value && null !== value;
            });
        }
        return true;
    }
    return promptValue.trim().length > 0;
};
exports.actionNameForType = __webpack_exports__.actionNameForType;
exports.getPlaceholderForType = __webpack_exports__.getPlaceholderForType;
exports.isRunButtonEnabled = __webpack_exports__.isRunButtonEnabled;
exports.staticAgentFromContext = __webpack_exports__.staticAgentFromContext;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "actionNameForType",
    "getPlaceholderForType",
    "isRunButtonEnabled",
    "staticAgentFromContext"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
