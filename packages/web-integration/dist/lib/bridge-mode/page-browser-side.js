"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
    ExtensionBridgePageBrowserSide: ()=>ExtensionBridgePageBrowserSide
});
const utils_namespaceObject = require("@sqaitech/shared/utils");
const page_js_namespaceObject = require("../chrome-extension/page.js");
var page_js_default = /*#__PURE__*/ __webpack_require__.n(page_js_namespaceObject);
const external_common_js_namespaceObject = require("./common.js");
const external_io_client_js_namespaceObject = require("./io-client.js");
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
class ExtensionBridgePageBrowserSide extends page_js_default() {
    async setupBridgeClient() {
        this.bridgeClient = new external_io_client_js_namespaceObject.BridgeClient(`ws://localhost:${external_common_js_namespaceObject.DefaultBridgeServerPort}`, async (method, args)=>{
            console.log('bridge call from cli side', method, args);
            if (method === external_common_js_namespaceObject.BridgeEvent.ConnectNewTabWithUrl) return this.connectNewTabWithUrl.apply(this, args);
            if (method === external_common_js_namespaceObject.BridgeEvent.GetBrowserTabList) return this.getBrowserTabList.apply(this, args);
            if (method === external_common_js_namespaceObject.BridgeEvent.SetActiveTabId) return this.setActiveTabId.apply(this, args);
            if (method === external_common_js_namespaceObject.BridgeEvent.ConnectCurrentTab) return this.connectCurrentTab.apply(this, args);
            if (method === external_common_js_namespaceObject.BridgeEvent.UpdateAgentStatus) return this.onLogMessage(args[0], 'status');
            const tabId = await this.getActiveTabId();
            if (!tabId || 0 === tabId) throw new Error('no tab is connected');
            if (method.startsWith(external_common_js_namespaceObject.MouseEvent.PREFIX)) {
                const actionName = method.split('.')[1];
                return this.mouse[actionName].apply(this.mouse, args);
            }
            if (method.startsWith(external_common_js_namespaceObject.KeyboardEvent.PREFIX)) {
                const actionName = method.split('.')[1];
                return this.keyboard[actionName].apply(this.keyboard, args);
            }
            if (!this[method]) return void console.warn('method not found', method);
            try {
                const result = await this[method](...args);
                return result;
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                console.error('error calling method', method, args, e);
                this.onLogMessage(`Error calling method: ${method}, ${errorMessage}`, 'log');
                throw new Error(errorMessage, {
                    cause: e
                });
            }
        }, ()=>this.destroy());
        await this.bridgeClient.connect();
        this.onLogMessage(`Bridge connected, cli-side version v${this.bridgeClient.serverVersion}, browser-side version v0.5.0`, 'log');
    }
    async connect() {
        return await this.setupBridgeClient();
    }
    async connectNewTabWithUrl(url, options = {
        forceSameTabNavigation: true
    }) {
        const tab = await chrome.tabs.create({
            url
        });
        const tabId = tab.id;
        (0, utils_namespaceObject.assert)(tabId, 'failed to get tabId after creating a new tab');
        this.onLogMessage(`Creating new tab: ${url}`, 'log');
        this.newlyCreatedTabIds.push(tabId);
        if (null == options ? void 0 : options.forceSameTabNavigation) this.forceSameTabNavigation = true;
        await this.setActiveTabId(tabId);
    }
    async connectCurrentTab(options = {
        forceSameTabNavigation: true
    }) {
        var _tabs_, _tabs_1;
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        const tabId = null == (_tabs_ = tabs[0]) ? void 0 : _tabs_.id;
        (0, utils_namespaceObject.assert)(tabId, 'failed to get tabId');
        this.onLogMessage(`Connected to current tab: ${null == (_tabs_1 = tabs[0]) ? void 0 : _tabs_1.url}`, 'log');
        if (null == options ? void 0 : options.forceSameTabNavigation) this.forceSameTabNavigation = true;
        await this.setActiveTabId(tabId);
    }
    async setDestroyOptions(options) {
        this.destroyOptions = options;
    }
    async destroy() {
        var _this_destroyOptions;
        if ((null == (_this_destroyOptions = this.destroyOptions) ? void 0 : _this_destroyOptions.closeTab) && this.newlyCreatedTabIds.length > 0) {
            this.onLogMessage('Closing all newly created tabs by bridge...', 'log');
            for (const tabId of this.newlyCreatedTabIds)await chrome.tabs.remove(tabId);
            this.newlyCreatedTabIds = [];
        }
        await super.destroy();
        if (this.bridgeClient) {
            this.bridgeClient.disconnect();
            this.bridgeClient = null;
            this.onDisconnect();
        }
    }
    constructor(onDisconnect = ()=>{}, onLogMessage = ()=>{}, forceSameTabNavigation = true){
        super(forceSameTabNavigation), _define_property(this, "onDisconnect", void 0), _define_property(this, "onLogMessage", void 0), _define_property(this, "bridgeClient", void 0), _define_property(this, "destroyOptions", void 0), _define_property(this, "newlyCreatedTabIds", void 0), this.onDisconnect = onDisconnect, this.onLogMessage = onLogMessage, this.bridgeClient = null, this.newlyCreatedTabIds = [];
    }
}
exports.ExtensionBridgePageBrowserSide = __webpack_exports__.ExtensionBridgePageBrowserSide;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "ExtensionBridgePageBrowserSide"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=page-browser-side.js.map