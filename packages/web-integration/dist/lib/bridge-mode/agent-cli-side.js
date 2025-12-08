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
    AgentOverChromeBridge: ()=>AgentOverChromeBridge,
    getBridgePageInCliSide: ()=>getBridgePageInCliSide
});
const agent_namespaceObject = require("@sqai/core/agent");
const utils_namespaceObject = require("@sqai/shared/utils");
const external_web_page_js_namespaceObject = require("../web-page.js");
const external_common_js_namespaceObject = require("./common.js");
const external_io_server_js_namespaceObject = require("./io-server.js");
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
const getBridgePageInCliSide = (timeout, closeConflictServer)=>{
    const server = new external_io_server_js_namespaceObject.BridgeServer(external_common_js_namespaceObject.DefaultBridgeServerPort, void 0, void 0, closeConflictServer);
    server.listen({
        timeout
    });
    const bridgeCaller = (method)=>async (...args)=>{
            const response = await server.call(method, args);
            return response;
        };
    const page = {
        showStatusMessage: async (message)=>{
            await server.call(external_common_js_namespaceObject.BridgeEvent.UpdateAgentStatus, [
                message
            ]);
        }
    };
    const proxyPage = new Proxy(page, {
        get (target, prop, receiver) {
            (0, utils_namespaceObject.assert)('string' == typeof prop, 'prop must be a string');
            if ('toJSON' === prop) return ()=>({
                    interfaceType: external_common_js_namespaceObject.BridgePageType
                });
            if ('getContext' === prop) return;
            if ('interfaceType' === prop) return external_common_js_namespaceObject.BridgePageType;
            if ('actionSpace' === prop) return ()=>(0, external_web_page_js_namespaceObject.commonWebActionsForWebPage)(proxyPage);
            if (Object.keys(page).includes(prop)) return page[prop];
            if ('mouse' === prop) {
                const mouse = {
                    click: bridgeCaller(external_common_js_namespaceObject.MouseEvent.Click),
                    wheel: bridgeCaller(external_common_js_namespaceObject.MouseEvent.Wheel),
                    move: bridgeCaller(external_common_js_namespaceObject.MouseEvent.Move),
                    drag: bridgeCaller(external_common_js_namespaceObject.MouseEvent.Drag)
                };
                return mouse;
            }
            if ('keyboard' === prop) {
                const keyboard = {
                    type: bridgeCaller(external_common_js_namespaceObject.KeyboardEvent.Type),
                    press: bridgeCaller(external_common_js_namespaceObject.KeyboardEvent.Press)
                };
                return keyboard;
            }
            if ('destroy' === prop) return async (...args)=>{
                try {
                    const caller = bridgeCaller('destroy');
                    await caller(...args);
                } catch (e) {}
                return server.close();
            };
            return bridgeCaller(prop);
        }
    });
    return proxyPage;
};
class AgentOverChromeBridge extends agent_namespaceObject.Agent {
    async setDestroyOptionsAfterConnect() {
        if (this.destroyAfterDisconnectFlag) this.page.setDestroyOptions({
            closeTab: true
        });
    }
    async connectNewTabWithUrl(url, options) {
        await this.page.connectNewTabWithUrl(url, options);
        await sleep(500);
        await this.setDestroyOptionsAfterConnect();
    }
    async getBrowserTabList() {
        return await this.page.getBrowserTabList();
    }
    async setActiveTabId(tabId) {
        return await this.page.setActiveTabId(Number.parseInt(tabId));
    }
    async connectCurrentTab(options) {
        await this.page.connectCurrentTab(options);
        await sleep(500);
        await this.setDestroyOptionsAfterConnect();
    }
    async aiAction(prompt, options) {
        if (options) console.warn('the `options` parameter of aiAction is not supported in cli side');
        return await super.aiAction(prompt);
    }
    async destroy(closeNewTabsAfterDisconnect) {
        if ('boolean' == typeof closeNewTabsAfterDisconnect) await this.page.setDestroyOptions({
            closeTab: closeNewTabsAfterDisconnect
        });
        await super.destroy();
    }
    constructor(opts){
        const page = getBridgePageInCliSide(null == opts ? void 0 : opts.serverListeningTimeout);
        const originalOnTaskStartTip = null == opts ? void 0 : opts.onTaskStartTip;
        super(page, Object.assign(opts || {}, {
            onTaskStartTip: (tip)=>{
                this.page.showStatusMessage(tip);
                if (originalOnTaskStartTip) null == originalOnTaskStartTip || originalOnTaskStartTip.call(this, tip);
            }
        })), _define_property(this, "destroyAfterDisconnectFlag", void 0);
        this.destroyAfterDisconnectFlag = null == opts ? void 0 : opts.closeNewTabsAfterDisconnect;
    }
}
exports.AgentOverChromeBridge = __webpack_exports__.AgentOverChromeBridge;
exports.getBridgePageInCliSide = __webpack_exports__.getBridgePageInCliSide;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AgentOverChromeBridge",
    "getBridgePageInCliSide"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=agent-cli-side.js.map