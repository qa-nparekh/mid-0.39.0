import { Agent } from "@sqai/core/agent";
import { assert } from "@sqai/shared/utils";
import { commonWebActionsForWebPage } from "../web-page.mjs";
import { BridgeEvent, BridgePageType, DefaultBridgeServerPort, KeyboardEvent, MouseEvent } from "./common.mjs";
import { BridgeServer } from "./io-server.mjs";
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
    const server = new BridgeServer(DefaultBridgeServerPort, void 0, void 0, closeConflictServer);
    server.listen({
        timeout
    });
    const bridgeCaller = (method)=>async (...args)=>{
            const response = await server.call(method, args);
            return response;
        };
    const page = {
        showStatusMessage: async (message)=>{
            await server.call(BridgeEvent.UpdateAgentStatus, [
                message
            ]);
        }
    };
    const proxyPage = new Proxy(page, {
        get (target, prop, receiver) {
            assert('string' == typeof prop, 'prop must be a string');
            if ('toJSON' === prop) return ()=>({
                    interfaceType: BridgePageType
                });
            if ('getContext' === prop) return;
            if ('interfaceType' === prop) return BridgePageType;
            if ('actionSpace' === prop) return ()=>commonWebActionsForWebPage(proxyPage);
            if (Object.keys(page).includes(prop)) return page[prop];
            if ('mouse' === prop) {
                const mouse = {
                    click: bridgeCaller(MouseEvent.Click),
                    wheel: bridgeCaller(MouseEvent.Wheel),
                    move: bridgeCaller(MouseEvent.Move),
                    drag: bridgeCaller(MouseEvent.Drag)
                };
                return mouse;
            }
            if ('keyboard' === prop) {
                const keyboard = {
                    type: bridgeCaller(KeyboardEvent.Type),
                    press: bridgeCaller(KeyboardEvent.Press)
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
class AgentOverChromeBridge extends Agent {
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
export { AgentOverChromeBridge, getBridgePageInCliSide };

//# sourceMappingURL=agent-cli-side.mjs.map