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
    PlaywrightAgent: ()=>PlaywrightAgent,
    overrideAIConfig: ()=>env_namespaceObject.overrideAIConfig,
    PlaywrightWebPage: ()=>external_page_js_namespaceObject.WebPage,
    PlaywrightAiFixture: ()=>external_ai_fixture_js_namespaceObject.PlaywrightAiFixture
});
const agent_namespaceObject = require("@sqai/core/agent");
const external_page_js_namespaceObject = require("./page.js");
const external_ai_fixture_js_namespaceObject = require("./ai-fixture.js");
const env_namespaceObject = require("@sqai/shared/env");
const logger_namespaceObject = require("@sqai/shared/logger");
const base_page_js_namespaceObject = require("../puppeteer/base-page.js");
const debug = (0, logger_namespaceObject.getDebug)('playwright:agent');
class PlaywrightAgent extends agent_namespaceObject.Agent {
    async waitForNetworkIdle(timeout = 1000) {
        await this.page.underlyingPage.waitForLoadState('networkidle', {
            timeout
        });
    }
    constructor(page, opts){
        const webPage = new external_page_js_namespaceObject.WebPage(page, opts);
        super(webPage, opts);
        const { forceSameTabNavigation = true } = opts ?? {};
        if (forceSameTabNavigation) (0, base_page_js_namespaceObject.forceClosePopup)(page, debug);
    }
}
exports.PlaywrightAgent = __webpack_exports__.PlaywrightAgent;
exports.PlaywrightAiFixture = __webpack_exports__.PlaywrightAiFixture;
exports.PlaywrightWebPage = __webpack_exports__.PlaywrightWebPage;
exports.overrideAIConfig = __webpack_exports__.overrideAIConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "PlaywrightAgent",
    "PlaywrightAiFixture",
    "PlaywrightWebPage",
    "overrideAIConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map