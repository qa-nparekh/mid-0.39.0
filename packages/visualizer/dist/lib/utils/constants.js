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
    BLANK_RESULT: ()=>BLANK_RESULT,
    WELCOME_MESSAGE_TEMPLATE: ()=>WELCOME_MESSAGE_TEMPLATE,
    apiMetadata: ()=>apiMetadata,
    deepThinkTip: ()=>deepThinkTip,
    defaultMainButtons: ()=>defaultMainButtons,
    domIncludedTip: ()=>domIncludedTip,
    screenshotIncludedTip: ()=>screenshotIncludedTip,
    trackingTip: ()=>trackingTip
});
const trackingTip = 'limit popup to current tab';
const deepThinkTip = 'deep think';
const screenshotIncludedTip = 'include screenshot in request';
const domIncludedTip = 'include DOM info in request';
const apiMetadata = {
    aiAction: {
        group: 'interaction',
        title: 'Auto Planning: plan the steps and execute'
    },
    aiTap: {
        group: 'interaction',
        title: 'Click an element'
    },
    aiDoubleClick: {
        group: 'interaction',
        title: 'Double-click an element'
    },
    aiHover: {
        group: 'interaction',
        title: 'Hover over an element'
    },
    aiInput: {
        group: 'interaction',
        title: 'Input text into an element'
    },
    aiRightClick: {
        group: 'interaction',
        title: 'Right-click an element'
    },
    aiKeyboardPress: {
        group: 'interaction',
        title: 'Press keyboard keys'
    },
    aiScroll: {
        group: 'interaction',
        title: 'Scroll the page or element'
    },
    aiLocate: {
        group: 'interaction',
        title: 'Locate an element on the page'
    },
    aiQuery: {
        group: 'extraction',
        title: 'Extract data directly from the UI'
    },
    aiBoolean: {
        group: 'extraction',
        title: 'Get true/false answer'
    },
    aiNumber: {
        group: 'extraction',
        title: 'Extract numeric value'
    },
    aiString: {
        group: 'extraction',
        title: 'Extract text value'
    },
    aiAsk: {
        group: 'extraction',
        title: 'Ask a question about the UI'
    },
    aiAssert: {
        group: 'validation',
        title: 'Assert a condition is true'
    },
    aiWaitFor: {
        group: 'validation',
        title: 'Wait for a condition to be met'
    }
};
const defaultMainButtons = [
    'aiAction',
    'aiTap',
    'aiQuery',
    'aiAssert'
];
const WELCOME_MESSAGE_TEMPLATE = {
    type: 'system',
    content: `
      Welcome to Midscene.js Playground!
      
      This is a panel for experimenting and testing Midscene.js features. You can use natural language instructions to operate the web page, such as clicking buttons, filling in forms, querying information, etc.
      
      Please enter your instructions in the input box below to start experiencing.
    `,
    loading: false,
    result: void 0,
    replayScriptsInfo: null,
    replayCounter: 0,
    loadingProgressText: '',
    verticalMode: false
};
const BLANK_RESULT = {
    result: void 0,
    dump: null,
    reportHTML: null,
    error: null
};
exports.BLANK_RESULT = __webpack_exports__.BLANK_RESULT;
exports.WELCOME_MESSAGE_TEMPLATE = __webpack_exports__.WELCOME_MESSAGE_TEMPLATE;
exports.apiMetadata = __webpack_exports__.apiMetadata;
exports.deepThinkTip = __webpack_exports__.deepThinkTip;
exports.defaultMainButtons = __webpack_exports__.defaultMainButtons;
exports.domIncludedTip = __webpack_exports__.domIncludedTip;
exports.screenshotIncludedTip = __webpack_exports__.screenshotIncludedTip;
exports.trackingTip = __webpack_exports__.trackingTip;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "BLANK_RESULT",
    "WELCOME_MESSAGE_TEMPLATE",
    "apiMetadata",
    "deepThinkTip",
    "defaultMainButtons",
    "domIncludedTip",
    "screenshotIncludedTip",
    "trackingTip"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
