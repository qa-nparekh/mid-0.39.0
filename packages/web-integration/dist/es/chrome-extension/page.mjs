import { WebPageContextParser, limitOpenNewTabScript } from "../web-element.mjs";
import { treeToList } from "@sqaitech/shared/extractor";
import { createImgBase64ByFormat } from "@sqaitech/shared/img";
import { assert } from "@sqaitech/shared/utils";
import { commonWebActionsForWebPage } from "../web-page.mjs";
import { CdpKeyboard } from "./cdpInput.mjs";
import { getHtmlElementScript, injectStopWaterFlowAnimation, injectWaterFlowAnimation } from "./dynamic-scripts.mjs";
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
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
class ChromeExtensionProxyPage {
    actionSpace() {
        return commonWebActionsForWebPage(this);
    }
    async setActiveTabId(tabId) {
        if (this.activeTabId) throw new Error(`Active tab id is already set, which is ${this.activeTabId}, cannot set it to ${tabId}`);
        await chrome.tabs.update(tabId, {
            active: true
        });
        this.activeTabId = tabId;
    }
    async getActiveTabId() {
        return this.activeTabId;
    }
    async getBrowserTabList() {
        const tabs = await chrome.tabs.query({
            currentWindow: true
        });
        return tabs.map((tab)=>({
                id: `${tab.id}`,
                title: tab.title,
                url: tab.url,
                currentActiveTab: tab.active
            })).filter((tab)=>tab.id && tab.title && tab.url);
    }
    async getTabIdOrConnectToCurrentTab() {
        if (this.activeTabId) return this.activeTabId;
        const tabId = await chrome.tabs.query({
            active: true,
            currentWindow: true
        }).then((tabs)=>{
            var _tabs_;
            return null == (_tabs_ = tabs[0]) ? void 0 : _tabs_.id;
        });
        this.activeTabId = tabId || 0;
        return this.activeTabId;
    }
    async attachDebugger() {
        assert(!this.destroyed, 'Page is destroyed');
        if (this.attachingDebugger) return void await this.attachingDebugger;
        this.attachingDebugger = (async ()=>{
            const url = await this.url();
            let error = null;
            if (url.startsWith('chrome://')) throw new Error('Cannot attach debugger to chrome:// pages, please use Midscene in a normal page with http://, https:// or file://');
            try {
                const currentTabId = await this.getTabIdOrConnectToCurrentTab();
                if (this.tabIdOfDebuggerAttached === currentTabId) return;
                if (this.tabIdOfDebuggerAttached && this.tabIdOfDebuggerAttached !== currentTabId) {
                    console.log('detach the previous tab', this.tabIdOfDebuggerAttached, '->', currentTabId);
                    try {
                        await this.detachDebugger(this.tabIdOfDebuggerAttached);
                    } catch (error) {
                        console.error('Failed to detach debugger', error);
                    }
                }
                console.log('attaching debugger', currentTabId);
                try {
                    await chrome.debugger.attach({
                        tabId: currentTabId
                    }, '1.3');
                } catch (e) {
                    if (this._continueWhenFailedToAttachDebugger) console.warn("Failed to attach debugger, but the script will continue as if the debugger is attached since the _continueWhenFailedToAttachDebugger is true", e);
                    else throw e;
                }
                await sleep(500);
                this.tabIdOfDebuggerAttached = currentTabId;
                await this.enableWaterFlowAnimation();
            } catch (e) {
                console.error('Failed to attach debugger', e);
                error = e;
            } finally{
                this.attachingDebugger = null;
            }
            if (error) throw error;
        })();
        await this.attachingDebugger;
    }
    async showMousePointer(x, y) {
        const pointerScript = `(() => {
      if(typeof window.midsceneWaterFlowAnimation !== 'undefined') {
        window.midsceneWaterFlowAnimation.enable();
        window.midsceneWaterFlowAnimation.showMousePointer(${x}, ${y});
      } else {
        console.log('midsceneWaterFlowAnimation is not defined');
      }
    })()`;
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `${pointerScript}`
        });
    }
    async hideMousePointer() {
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `(() => {
        if(typeof window.midsceneWaterFlowAnimation !== 'undefined') {
          window.midsceneWaterFlowAnimation.hideMousePointer();
        }
      })()`
        });
    }
    async detachDebugger(tabId) {
        const tabIdToDetach = tabId || this.tabIdOfDebuggerAttached;
        console.log('detaching debugger', tabIdToDetach);
        if (!tabIdToDetach) return void console.warn('No tab id to detach');
        try {
            await this.disableWaterFlowAnimation(tabIdToDetach);
            await sleep(200);
        } catch (error) {
            console.warn('Failed to disable water flow animation', error);
        }
        try {
            await chrome.debugger.detach({
                tabId: tabIdToDetach
            });
        } catch (error) {
            console.warn('Failed to detach debugger', error);
        }
        this.tabIdOfDebuggerAttached = null;
    }
    async enableWaterFlowAnimation() {
        if (this.forceSameTabNavigation) await chrome.debugger.sendCommand({
            tabId: this.tabIdOfDebuggerAttached
        }, 'Runtime.evaluate', {
            expression: limitOpenNewTabScript
        });
        const script = await injectWaterFlowAnimation();
        await chrome.debugger.sendCommand({
            tabId: this.tabIdOfDebuggerAttached
        }, 'Runtime.evaluate', {
            expression: script
        });
    }
    async disableWaterFlowAnimation(tabId) {
        const script = await injectStopWaterFlowAnimation();
        await chrome.debugger.sendCommand({
            tabId
        }, 'Runtime.evaluate', {
            expression: script
        });
    }
    async sendCommandToDebugger(command, params) {
        await this.attachDebugger();
        assert(this.tabIdOfDebuggerAttached, 'Debugger is not attached');
        this.enableWaterFlowAnimation();
        return await chrome.debugger.sendCommand({
            tabId: this.tabIdOfDebuggerAttached
        }, command, params);
    }
    async getPageContentByCDP() {
        const script = await getHtmlElementScript();
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: script
        });
        const expression = ()=>{
            window.midscene_element_inspector.setNodeHashCacheListOnWindow();
            const tree = window.midscene_element_inspector.webExtractNodeTree();
            return {
                tree,
                size: {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight,
                    dpr: window.devicePixelRatio
                }
            };
        };
        const returnValue = await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `(${expression.toString()})()`,
            returnByValue: true
        });
        if (!returnValue.result.value) {
            var _returnValue_exceptionDetails_exception, _returnValue_exceptionDetails;
            const errorDescription = (null == (_returnValue_exceptionDetails = returnValue.exceptionDetails) ? void 0 : null == (_returnValue_exceptionDetails_exception = _returnValue_exceptionDetails.exception) ? void 0 : _returnValue_exceptionDetails_exception.description) || '';
            if (!errorDescription) console.error('returnValue from cdp', returnValue);
            throw new Error(`Failed to get page content from page, error: ${errorDescription}`);
        }
        return returnValue.result.value;
    }
    async evaluateJavaScript(script) {
        return this.sendCommandToDebugger('Runtime.evaluate', {
            expression: script
        });
    }
    async beforeInvokeAction() {
        try {
            await this.waitUntilNetworkIdle();
        } catch (error) {}
    }
    async waitUntilNetworkIdle() {
        const timeout = 10000;
        const startTime = Date.now();
        let lastReadyState = '';
        while(Date.now() - startTime < timeout){
            const result = await this.sendCommandToDebugger('Runtime.evaluate', {
                expression: 'document.readyState'
            });
            lastReadyState = result.result.value;
            if ('complete' === lastReadyState) return void await new Promise((resolve)=>setTimeout(resolve, 300));
            await new Promise((resolve)=>setTimeout(resolve, 300));
        }
        throw new Error(`Failed to wait until network idle, last readyState: ${lastReadyState}`);
    }
    async getElementsInfo() {
        const tree = await this.getElementsNodeTree();
        return treeToList(tree);
    }
    async getXpathsById(id) {
        const script = await getHtmlElementScript();
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: script
        });
        const result = await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `window.midscene_element_inspector.getXpathsById(${JSON.stringify(id)})`,
            returnByValue: true
        });
        return result.result.value;
    }
    async getXpathsByPoint(point, isOrderSensitive) {
        const script = await getHtmlElementScript();
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: script
        });
        const result = await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `window.midscene_element_inspector.getXpathsByPoint({left: ${point.left}, top: ${point.top}}, ${isOrderSensitive})`,
            returnByValue: true
        });
        return result.result.value;
    }
    async getElementInfoByXpath(xpath) {
        const script = await getHtmlElementScript();
        await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: script
        });
        const result = await this.sendCommandToDebugger('Runtime.evaluate', {
            expression: `window.midscene_element_inspector.getElementInfoByXpath(${JSON.stringify(xpath)})`,
            returnByValue: true
        });
        return result.result.value;
    }
    async getElementsNodeTree() {
        await this.hideMousePointer();
        const content = await this.getPageContentByCDP();
        if (null == content ? void 0 : content.size) this.viewportSize = content.size;
        return (null == content ? void 0 : content.tree) || {
            node: null,
            children: []
        };
    }
    async getContext() {
        return await WebPageContextParser(this, {});
    }
    async size() {
        if (this.viewportSize) return this.viewportSize;
        const content = await this.getPageContentByCDP();
        return content.size;
    }
    async screenshotBase64() {
        await this.hideMousePointer();
        const format = 'jpeg';
        const base64 = await this.sendCommandToDebugger('Page.captureScreenshot', {
            format,
            quality: 90
        });
        return createImgBase64ByFormat(format, base64.data);
    }
    async url() {
        const tabId = await this.getTabIdOrConnectToCurrentTab();
        const url = await chrome.tabs.get(tabId).then((tab)=>tab.url);
        return url || '';
    }
    async scrollUntilTop(startingPoint) {
        if (startingPoint) await this.mouse.move(startingPoint.left, startingPoint.top);
        return this.mouse.wheel(0, -9999999);
    }
    async scrollUntilBottom(startingPoint) {
        if (startingPoint) await this.mouse.move(startingPoint.left, startingPoint.top);
        return this.mouse.wheel(0, 9999999);
    }
    async scrollUntilLeft(startingPoint) {
        if (startingPoint) await this.mouse.move(startingPoint.left, startingPoint.top);
        return this.mouse.wheel(-9999999, 0);
    }
    async scrollUntilRight(startingPoint) {
        if (startingPoint) await this.mouse.move(startingPoint.left, startingPoint.top);
        return this.mouse.wheel(9999999, 0);
    }
    async scrollUp(distance, startingPoint) {
        const { height } = await this.size();
        const scrollDistance = distance || 0.7 * height;
        return this.mouse.wheel(0, -scrollDistance, null == startingPoint ? void 0 : startingPoint.left, null == startingPoint ? void 0 : startingPoint.top);
    }
    async scrollDown(distance, startingPoint) {
        const { height } = await this.size();
        const scrollDistance = distance || 0.7 * height;
        return this.mouse.wheel(0, scrollDistance, null == startingPoint ? void 0 : startingPoint.left, null == startingPoint ? void 0 : startingPoint.top);
    }
    async scrollLeft(distance, startingPoint) {
        const { width } = await this.size();
        const scrollDistance = distance || 0.7 * width;
        return this.mouse.wheel(-scrollDistance, 0, null == startingPoint ? void 0 : startingPoint.left, null == startingPoint ? void 0 : startingPoint.top);
    }
    async scrollRight(distance, startingPoint) {
        const { width } = await this.size();
        const scrollDistance = distance || 0.7 * width;
        return this.mouse.wheel(scrollDistance, 0, null == startingPoint ? void 0 : startingPoint.left, null == startingPoint ? void 0 : startingPoint.top);
    }
    async clearInput(element) {
        if (!element) return void console.warn('No element to clear input');
        await this.mouse.click(element.center[0], element.center[1]);
        await this.sendCommandToDebugger('Input.dispatchKeyEvent', {
            type: 'keyDown',
            commands: [
                'selectAll'
            ]
        });
        await this.sendCommandToDebugger('Input.dispatchKeyEvent', {
            type: 'keyUp',
            commands: [
                'selectAll'
            ]
        });
        await sleep(100);
        await this.keyboard.press({
            key: 'Backspace'
        });
    }
    async destroy() {
        this.activeTabId = null;
        await this.detachDebugger();
        this.destroyed = true;
    }
    async longPress(x, y, duration) {
        duration = duration || 500;
        const LONG_PRESS_THRESHOLD = 600;
        const MIN_PRESS_THRESHOLD = 300;
        if (duration > LONG_PRESS_THRESHOLD) duration = LONG_PRESS_THRESHOLD;
        if (duration < MIN_PRESS_THRESHOLD) duration = MIN_PRESS_THRESHOLD;
        await this.mouse.move(x, y);
        if (null === this.isMobileEmulation) {
            var _result_result;
            const result = await this.sendCommandToDebugger('Runtime.evaluate', {
                expression: `(() => {
          return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        })()`,
                returnByValue: true
            });
            this.isMobileEmulation = null == result ? void 0 : null == (_result_result = result.result) ? void 0 : _result_result.value;
        }
        if (this.isMobileEmulation) {
            const touchPoints = [
                {
                    x: Math.round(x),
                    y: Math.round(y)
                }
            ];
            await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                type: 'touchStart',
                touchPoints,
                modifiers: 0
            });
            await new Promise((res)=>setTimeout(res, duration));
            await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: [],
                modifiers: 0
            });
        } else {
            await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                type: 'mousePressed',
                x,
                y,
                button: 'left',
                clickCount: 1
            });
            await new Promise((res)=>setTimeout(res, duration));
            await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                type: 'mouseReleased',
                x,
                y,
                button: 'left',
                clickCount: 1
            });
        }
        this.latestMouseX = x;
        this.latestMouseY = y;
    }
    async swipe(from, to, duration) {
        const LONG_PRESS_THRESHOLD = 500;
        const MIN_PRESS_THRESHOLD = 150;
        duration = duration || 300;
        if (duration < MIN_PRESS_THRESHOLD) duration = MIN_PRESS_THRESHOLD;
        if (duration > LONG_PRESS_THRESHOLD) duration = LONG_PRESS_THRESHOLD;
        if (null === this.isMobileEmulation) {
            var _result_result;
            const result = await this.sendCommandToDebugger('Runtime.evaluate', {
                expression: `(() => {
          return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        })()`,
                returnByValue: true
            });
            this.isMobileEmulation = null == result ? void 0 : null == (_result_result = result.result) ? void 0 : _result_result.value;
        }
        const steps = 30;
        const delay = duration / steps;
        if (this.isMobileEmulation) {
            await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                type: 'touchStart',
                touchPoints: [
                    {
                        x: Math.round(from.x),
                        y: Math.round(from.y)
                    }
                ],
                modifiers: 0
            });
            for(let i = 1; i <= steps; i++){
                const x = from.x + (to.x - from.x) * (i / steps);
                const y = from.y + (to.y - from.y) * (i / steps);
                await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                    type: 'touchMove',
                    touchPoints: [
                        {
                            x: Math.round(x),
                            y: Math.round(y)
                        }
                    ],
                    modifiers: 0
                });
                await new Promise((res)=>setTimeout(res, delay));
            }
            await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: [],
                modifiers: 0
            });
        } else {
            await this.mouse.move(from.x, from.y);
            await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                type: 'mousePressed',
                x: from.x,
                y: from.y,
                button: 'left',
                clickCount: 1
            });
            for(let i = 1; i <= steps; i++){
                const x = from.x + (to.x - from.x) * (i / steps);
                const y = from.y + (to.y - from.y) * (i / steps);
                await this.mouse.move(x, y);
                await new Promise((res)=>setTimeout(res, delay));
            }
            await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                type: 'mouseReleased',
                x: to.x,
                y: to.y,
                button: 'left',
                clickCount: 1
            });
        }
        this.latestMouseX = to.x;
        this.latestMouseY = to.y;
    }
    constructor(forceSameTabNavigation){
        _define_property(this, "interfaceType", 'chrome-extension-proxy');
        _define_property(this, "forceSameTabNavigation", void 0);
        _define_property(this, "viewportSize", void 0);
        _define_property(this, "activeTabId", null);
        _define_property(this, "tabIdOfDebuggerAttached", null);
        _define_property(this, "attachingDebugger", null);
        _define_property(this, "destroyed", false);
        _define_property(this, "isMobileEmulation", null);
        _define_property(this, "_continueWhenFailedToAttachDebugger", false);
        _define_property(this, "latestMouseX", 100);
        _define_property(this, "latestMouseY", 100);
        _define_property(this, "mouse", {
            click: async (x, y, options)=>{
                const { button = 'left', count = 1 } = options || {};
                await this.mouse.move(x, y);
                if (null === this.isMobileEmulation) {
                    var _result_result;
                    const result = await this.sendCommandToDebugger('Runtime.evaluate', {
                        expression: `(() => {
            return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
          })()`,
                        returnByValue: true
                    });
                    this.isMobileEmulation = null == result ? void 0 : null == (_result_result = result.result) ? void 0 : _result_result.value;
                }
                if (this.isMobileEmulation && 'left' === button) {
                    const touchPoints = [
                        {
                            x: Math.round(x),
                            y: Math.round(y)
                        }
                    ];
                    await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                        type: 'touchStart',
                        touchPoints,
                        modifiers: 0
                    });
                    await this.sendCommandToDebugger('Input.dispatchTouchEvent', {
                        type: 'touchEnd',
                        touchPoints: [],
                        modifiers: 0
                    });
                } else for(let i = 0; i < count; i++){
                    await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                        type: 'mousePressed',
                        x,
                        y,
                        button,
                        clickCount: 1
                    });
                    await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                        type: 'mouseReleased',
                        x,
                        y,
                        button,
                        clickCount: 1
                    });
                    await sleep(50);
                }
            },
            wheel: async (deltaX, deltaY, startX, startY)=>{
                const finalX = startX || this.latestMouseX;
                const finalY = startY || this.latestMouseY;
                await this.showMousePointer(finalX, finalY);
                await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                    type: 'mouseWheel',
                    x: finalX,
                    y: finalY,
                    deltaX,
                    deltaY
                });
                this.latestMouseX = finalX;
                this.latestMouseY = finalY;
            },
            move: async (x, y)=>{
                await this.showMousePointer(x, y);
                await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                    type: 'mouseMoved',
                    x,
                    y
                });
                this.latestMouseX = x;
                this.latestMouseY = y;
            },
            drag: async (from, to)=>{
                await this.mouse.move(from.x, from.y);
                await sleep(200);
                await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                    type: 'mousePressed',
                    x: from.x,
                    y: from.y,
                    button: 'left',
                    clickCount: 1
                });
                await sleep(300);
                await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                    type: 'mouseMoved',
                    x: to.x,
                    y: to.y
                });
                await sleep(500);
                await this.sendCommandToDebugger('Input.dispatchMouseEvent', {
                    type: 'mouseReleased',
                    x: to.x,
                    y: to.y,
                    button: 'left',
                    clickCount: 1
                });
                await sleep(200);
                await this.mouse.move(to.x, to.y);
            }
        });
        _define_property(this, "keyboard", {
            type: async (text)=>{
                const cdpKeyboard = new CdpKeyboard({
                    send: this.sendCommandToDebugger.bind(this)
                });
                await cdpKeyboard.type(text, {
                    delay: 0
                });
            },
            press: async (action)=>{
                const cdpKeyboard = new CdpKeyboard({
                    send: this.sendCommandToDebugger.bind(this)
                });
                const keys = Array.isArray(action) ? action : [
                    action
                ];
                for (const k of keys){
                    const commands = k.command ? [
                        k.command
                    ] : [];
                    await cdpKeyboard.down(k.key, {
                        commands
                    });
                }
                for (const k of [
                    ...keys
                ].reverse())await cdpKeyboard.up(k.key);
            }
        });
        this.forceSameTabNavigation = forceSameTabNavigation;
    }
}
export { ChromeExtensionProxyPage as default };

//# sourceMappingURL=page.mjs.map