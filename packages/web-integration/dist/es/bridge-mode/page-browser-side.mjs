import { assert } from "@sqai/shared/utils";
import page from "../chrome-extension/page.mjs";
import { BridgeEvent, DefaultBridgeServerPort, KeyboardEvent, MouseEvent } from "./common.mjs";
import { BridgeClient } from "./io-client.mjs";
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
class ExtensionBridgePageBrowserSide extends page {
    async setupBridgeClient() {
        this.bridgeClient = new BridgeClient(`ws://localhost:${DefaultBridgeServerPort}`, async (method, args)=>{
            console.log('bridge call from cli side', method, args);
            if (method === BridgeEvent.ConnectNewTabWithUrl) return this.connectNewTabWithUrl.apply(this, args);
            if (method === BridgeEvent.GetBrowserTabList) return this.getBrowserTabList.apply(this, args);
            if (method === BridgeEvent.SetActiveTabId) return this.setActiveTabId.apply(this, args);
            if (method === BridgeEvent.ConnectCurrentTab) return this.connectCurrentTab.apply(this, args);
            if (method === BridgeEvent.UpdateAgentStatus) return this.onLogMessage(args[0], 'status');
            const tabId = await this.getActiveTabId();
            if (!tabId || 0 === tabId) throw new Error('no tab is connected');
            if (method.startsWith(MouseEvent.PREFIX)) {
                const actionName = method.split('.')[1];
                return this.mouse[actionName].apply(this.mouse, args);
            }
            if (method.startsWith(KeyboardEvent.PREFIX)) {
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
        this.onLogMessage(`Bridge connected, cli-side version v${this.bridgeClient.serverVersion}, browser-side version v0.30.9`, 'log');
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
        assert(tabId, 'failed to get tabId after creating a new tab');
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
        assert(tabId, 'failed to get tabId');
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
export { ExtensionBridgePageBrowserSide };

//# sourceMappingURL=page-browser-side.mjs.map