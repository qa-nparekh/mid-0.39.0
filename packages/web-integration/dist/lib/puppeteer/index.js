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
    PuppeteerAgent: ()=>PuppeteerAgent,
    overrideAIConfig: ()=>env_namespaceObject.overrideAIConfig,
    PuppeteerWebPage: ()=>external_page_js_namespaceObject.PuppeteerWebPage
});
const agent_namespaceObject = require("@sqaitech/core/agent");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const external_base_page_js_namespaceObject = require("./base-page.js");
const external_page_js_namespaceObject = require("./page.js");
const env_namespaceObject = require("@sqaitech/shared/env");
const debug = (0, logger_namespaceObject.getDebug)('puppeteer:agent');
class PuppeteerAgent extends agent_namespaceObject.Agent {
    constructor(page, opts){
        const webPage = new external_page_js_namespaceObject.PuppeteerWebPage(page, opts);
        super(webPage, opts);
        const { forceSameTabNavigation = true } = opts ?? {};
        if (forceSameTabNavigation) (0, external_base_page_js_namespaceObject.forceClosePopup)(page, debug);
    }
}
exports.PuppeteerAgent = __webpack_exports__.PuppeteerAgent;
exports.PuppeteerWebPage = __webpack_exports__.PuppeteerWebPage;
exports.overrideAIConfig = __webpack_exports__.overrideAIConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "PuppeteerAgent",
    "PuppeteerWebPage",
    "overrideAIConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map