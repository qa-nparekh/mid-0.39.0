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
    Page: ()=>Page,
    debugPage: ()=>debugPage,
    forceClosePopup: ()=>forceClosePopup
});
const external_web_element_js_namespaceObject = require("../web-element.js");
const utils_namespaceObject = require("@sqai/core/utils");
const constants_namespaceObject = require("@sqai/shared/constants");
const extractor_namespaceObject = require("@sqai/shared/extractor");
const img_namespaceObject = require("@sqai/shared/img");
const logger_namespaceObject = require("@sqai/shared/logger");
const node_namespaceObject = require("@sqai/shared/node");
const shared_utils_namespaceObject = require("@sqai/shared/utils");
const external_web_page_js_namespaceObject = require("../web-page.js");
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
const debugPage = (0, logger_namespaceObject.getDebug)('web:page');
const sanitizeXpaths = (xpaths)=>{
    if (!Array.isArray(xpaths)) return [];
    return xpaths.filter((xpath)=>'string' == typeof xpath && xpath.length > 0);
};
class Page {
    actionSpace() {
        const defaultActions = (0, external_web_page_js_namespaceObject.commonWebActionsForWebPage)(this);
        const customActions = this.customActions || [];
        return [
            ...defaultActions,
            ...customActions
        ];
    }
    async evaluate(pageFunction, arg) {
        let result;
        debugPage('evaluate function begin');
        this.interfaceType, result = await this.underlyingPage.evaluate(pageFunction, arg);
        debugPage('evaluate function end');
        return result;
    }
    async evaluateJavaScript(script) {
        return this.evaluate(script);
    }
    async waitForNavigation() {
        if (0 === this.waitForNavigationTimeout) return void debugPage('waitForNavigation timeout is 0, skip waiting');
        if ('puppeteer' === this.interfaceType || 'playwright' === this.interfaceType) {
            debugPage('waitForNavigation begin');
            debugPage(`waitForNavigation timeout: ${this.waitForNavigationTimeout}`);
            try {
                await this.underlyingPage.waitForSelector('html', {
                    timeout: this.waitForNavigationTimeout
                });
            } catch (error) {
                console.warn('[midscene:warning] Waiting for the "navigation" has timed out, but Midscene will continue execution. Please check https://midscenejs.com/faq.html#customize-the-network-timeout for more information on customizing the network timeout');
            }
            debugPage('waitForNavigation end');
        }
    }
    async waitForNetworkIdle() {
        if ('puppeteer' === this.interfaceType) {
            if (0 === this.waitForNetworkIdleTimeout) return void debugPage('waitForNetworkIdle timeout is 0, skip waiting');
            try {
                await this.underlyingPage.waitForNetworkIdle({
                    idleTime: 200,
                    concurrency: constants_namespaceObject.DEFAULT_WAIT_FOR_NETWORK_IDLE_CONCURRENCY,
                    timeout: this.waitForNetworkIdleTimeout
                });
            } catch (error) {
                console.warn('[midscene:warning] Waiting for the "network idle" has timed out, but Midscene will continue execution. Please check https://midscenejs.com/faq.html#customize-the-network-timeout for more information on customizing the network timeout');
            }
        }
    }
    async getElementsInfo() {
        await this.waitForNavigation();
        debugPage('getElementsInfo begin');
        const tree = await this.getElementsNodeTree();
        debugPage('getElementsInfo end');
        return (0, extractor_namespaceObject.treeToList)(tree);
    }
    async getXpathsById(id) {
        const elementInfosScriptContent = (0, node_namespaceObject.getElementInfosScriptContent)();
        return this.evaluateJavaScript(`${elementInfosScriptContent}midscene_element_inspector.getXpathsById(${JSON.stringify(id)})`);
    }
    async getXpathsByPoint(point, isOrderSensitive) {
        const elementInfosScriptContent = (0, node_namespaceObject.getElementInfosScriptContent)();
        return this.evaluateJavaScript(`${elementInfosScriptContent}midscene_element_inspector.getXpathsByPoint({left: ${point.left}, top: ${point.top}}, ${isOrderSensitive})`);
    }
    async getElementInfoByXpath(xpath) {
        const elementInfosScriptContent = (0, node_namespaceObject.getElementInfosScriptContent)();
        return this.evaluateJavaScript(`${elementInfosScriptContent}midscene_element_inspector.getElementInfoByXpath(${JSON.stringify(xpath)})`);
    }
    async cacheFeatureForRect(rect, opt) {
        const center = {
            left: Math.floor(rect.left + rect.width / 2),
            top: Math.floor(rect.top + rect.height / 2)
        };
        try {
            const orderSensitive = (null == opt ? void 0 : opt._orderSensitive) ?? false;
            const xpaths = await this.getXpathsByPoint(center, orderSensitive);
            const sanitized = sanitizeXpaths(xpaths);
            if (!sanitized.length) debugPage('cacheFeatureForRect: no xpath found at rect %o', rect);
            return {
                xpaths: sanitized
            };
        } catch (error) {
            debugPage('cacheFeatureForRect failed: %s', error);
            return {
                xpaths: []
            };
        }
    }
    async rectMatchesCacheFeature(feature) {
        const webFeature = feature;
        const xpaths = sanitizeXpaths(webFeature.xpaths);
        for (const xpath of xpaths)try {
            const elementInfo = await this.getElementInfoByXpath(xpath);
            if (null == elementInfo ? void 0 : elementInfo.rect) {
                var _this_viewportSize;
                const matchedRect = {
                    left: elementInfo.rect.left,
                    top: elementInfo.rect.top,
                    width: elementInfo.rect.width,
                    height: elementInfo.rect.height
                };
                if (null == (_this_viewportSize = this.viewportSize) ? void 0 : _this_viewportSize.dpr) matchedRect.dpr = this.viewportSize.dpr;
                return matchedRect;
            }
        } catch (error) {
            debugPage('rectMatchesCacheFeature failed for xpath %s: %s', xpath, error);
        }
        throw new Error('No matching element rect found for the provided cache feature');
    }
    async getElementsNodeTree() {
        await this.waitForNavigation();
        const scripts = await (0, node_namespaceObject.getExtraReturnLogic)(true);
        (0, shared_utils_namespaceObject.assert)(scripts, "scripts should be set before writing report in browser");
        const startTime = Date.now();
        const captureElementSnapshot = await this.evaluate(scripts);
        const endTime = Date.now();
        debugPage(`getElementsNodeTree end, cost: ${endTime - startTime}ms`);
        return captureElementSnapshot;
    }
    async size() {
        if (this.viewportSize) return this.viewportSize;
        const sizeInfo = await this.evaluate(()=>({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                dpr: window.devicePixelRatio
            }));
        this.viewportSize = sizeInfo;
        return sizeInfo;
    }
    async screenshotBase64() {
        const imgType = 'jpeg';
        const quality = 90;
        await this.waitForNavigation();
        const startTime = Date.now();
        debugPage('screenshotBase64 begin');
        let base64;
        if ('puppeteer' === this.interfaceType) {
            const result = await this.underlyingPage.screenshot({
                type: imgType,
                quality,
                encoding: 'base64'
            });
            base64 = (0, img_namespaceObject.createImgBase64ByFormat)(imgType, result);
        } else if ('playwright' === this.interfaceType) {
            const buffer = await this.underlyingPage.screenshot({
                type: imgType,
                quality,
                timeout: 10000
            });
            base64 = (0, img_namespaceObject.createImgBase64ByFormat)(imgType, buffer.toString('base64'));
        } else throw new Error('Unsupported page type for screenshot');
        const endTime = Date.now();
        debugPage(`screenshotBase64 end, cost: ${endTime - startTime}ms`);
        return base64;
    }
    async url() {
        return this.underlyingPage.url();
    }
    describe() {
        const url = this.underlyingPage.url();
        return url || '';
    }
    get mouse() {
        return {
            click: async (x, y, options)=>{
                await this.mouse.move(x, y);
                const { button = 'left', count = 1 } = options || {};
                debugPage(`mouse click ${x}, ${y}, ${button}, ${count}`);
                if (2 === count && 'playwright' === this.interfaceType) await this.underlyingPage.mouse.dblclick(x, y, {
                    button
                });
                else if ('puppeteer' === this.interfaceType) if ('left' === button && 1 === count) await this.underlyingPage.mouse.click(x, y);
                else await this.underlyingPage.mouse.click(x, y, {
                    button,
                    count
                });
                else if ('playwright' === this.interfaceType) this.underlyingPage.mouse.click(x, y, {
                    button,
                    clickCount: count
                });
            },
            wheel: async (deltaX, deltaY)=>{
                debugPage(`mouse wheel ${deltaX}, ${deltaY}`);
                if ('puppeteer' === this.interfaceType) await this.underlyingPage.mouse.wheel({
                    deltaX,
                    deltaY
                });
                else if ('playwright' === this.interfaceType) await this.underlyingPage.mouse.wheel(deltaX, deltaY);
            },
            move: async (x, y)=>{
                this.everMoved = true;
                debugPage(`mouse move to ${x}, ${y}`);
                return this.underlyingPage.mouse.move(x, y);
            },
            drag: async (from, to)=>{
                debugPage(`begin mouse drag from ${from.x}, ${from.y} to ${to.x}, ${to.y}`);
                await this.underlyingPage.mouse.move(from.x, from.y);
                await (0, utils_namespaceObject.sleep)(200);
                await this.underlyingPage.mouse.down();
                await (0, utils_namespaceObject.sleep)(300);
                await this.underlyingPage.mouse.move(to.x, to.y);
                await (0, utils_namespaceObject.sleep)(500);
                await this.underlyingPage.mouse.up();
                await (0, utils_namespaceObject.sleep)(200);
                debugPage(`end mouse drag from ${from.x}, ${from.y} to ${to.x}, ${to.y}`);
            }
        };
    }
    get keyboard() {
        return {
            type: async (text)=>{
                debugPage(`keyboard type ${text}`);
                return this.underlyingPage.keyboard.type(text, {
                    delay: 80
                });
            },
            press: async (action)=>{
                const keys = Array.isArray(action) ? action : [
                    action
                ];
                debugPage('keyboard press', keys);
                for (const k of keys){
                    const commands = k.command ? [
                        k.command
                    ] : [];
                    await this.underlyingPage.keyboard.down(k.key, {
                        commands
                    });
                }
                for (const k of [
                    ...keys
                ].reverse())await this.underlyingPage.keyboard.up(k.key);
            },
            down: async (key)=>{
                debugPage(`keyboard down ${key}`);
                return this.underlyingPage.keyboard.down(key);
            },
            up: async (key)=>{
                debugPage(`keyboard up ${key}`);
                return this.underlyingPage.keyboard.up(key);
            }
        };
    }
    async clearInput(element) {
        if (!element) return void console.warn('No element to clear input');
        const backspace = async ()=>{
            await (0, utils_namespaceObject.sleep)(100);
            await this.keyboard.press([
                {
                    key: 'Backspace'
                }
            ]);
        };
        const isMac = 'darwin' === process.platform;
        debugPage('clearInput begin');
        if (isMac) {
            if ('puppeteer' === this.interfaceType) {
                await this.mouse.click(element.center[0], element.center[1], {
                    count: 3
                });
                await backspace();
            }
            await this.mouse.click(element.center[0], element.center[1]);
            await this.underlyingPage.keyboard.down('Meta');
            await this.underlyingPage.keyboard.press('a');
            await this.underlyingPage.keyboard.up('Meta');
            await backspace();
        } else {
            await this.mouse.click(element.center[0], element.center[1]);
            await this.underlyingPage.keyboard.down('Control');
            await this.underlyingPage.keyboard.press('a');
            await this.underlyingPage.keyboard.up('Control');
            await backspace();
        }
        debugPage('clearInput end');
    }
    async moveToPointBeforeScroll(point) {
        if (point) await this.mouse.move(point.left, point.top);
        else if (!this.everMoved) {
            const size = await this.size();
            const targetX = Math.floor(size.width / 2);
            const targetY = Math.floor(size.height / 2);
            await this.mouse.move(targetX, targetY);
        }
    }
    async scrollUntilTop(startingPoint) {
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(0, -9999999);
    }
    async scrollUntilBottom(startingPoint) {
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(0, 9999999);
    }
    async scrollUntilLeft(startingPoint) {
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(-9999999, 0);
    }
    async scrollUntilRight(startingPoint) {
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(9999999, 0);
    }
    async scrollUp(distance, startingPoint) {
        const innerHeight = await this.evaluate(()=>window.innerHeight);
        const scrollDistance = distance || 0.7 * innerHeight;
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(0, -scrollDistance);
    }
    async scrollDown(distance, startingPoint) {
        const innerHeight = await this.evaluate(()=>window.innerHeight);
        const scrollDistance = distance || 0.7 * innerHeight;
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(0, scrollDistance);
    }
    async scrollLeft(distance, startingPoint) {
        const innerWidth = await this.evaluate(()=>window.innerWidth);
        const scrollDistance = distance || 0.7 * innerWidth;
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(-scrollDistance, 0);
    }
    async scrollRight(distance, startingPoint) {
        const innerWidth = await this.evaluate(()=>window.innerWidth);
        const scrollDistance = distance || 0.7 * innerWidth;
        await this.moveToPointBeforeScroll(startingPoint);
        return this.mouse.wheel(scrollDistance, 0);
    }
    async navigate(url) {
        debugPage(`navigate to ${url}`);
        if ('puppeteer' === this.interfaceType) await this.underlyingPage.goto(url);
        else if ('playwright' === this.interfaceType) await this.underlyingPage.goto(url);
        else throw new Error('Unsupported page type for navigate');
    }
    async beforeInvokeAction(name, param) {
        await Promise.all([
            this.waitForNavigation(),
            this.waitForNetworkIdle()
        ]);
        if (this.onBeforeInvokeAction) await this.onBeforeInvokeAction(name, param);
    }
    async afterInvokeAction(name, param) {
        await Promise.all([
            this.waitForNavigation(),
            this.waitForNetworkIdle()
        ]);
        if (this.onAfterInvokeAction) await this.onAfterInvokeAction(name, param);
    }
    async destroy() {}
    async getContext() {
        return await (0, external_web_element_js_namespaceObject.WebPageContextParser)(this, {});
    }
    async swipe(from, to, duration) {
        const LONG_PRESS_THRESHOLD = 500;
        const MIN_PRESS_THRESHOLD = 150;
        duration = duration || 100;
        if (duration < MIN_PRESS_THRESHOLD) duration = MIN_PRESS_THRESHOLD;
        if (duration > LONG_PRESS_THRESHOLD) duration = LONG_PRESS_THRESHOLD;
        debugPage(`mouse swipe from ${from.x}, ${from.y} to ${to.x}, ${to.y} with duration ${duration}ms`);
        if ('puppeteer' === this.interfaceType) {
            const page = this.underlyingPage;
            await page.mouse.move(from.x, from.y);
            await page.mouse.down({
                button: 'left'
            });
            const steps = 30;
            const delay = duration / steps;
            for(let i = 1; i <= steps; i++){
                const x = from.x + (to.x - from.x) * (i / steps);
                const y = from.y + (to.y - from.y) * (i / steps);
                await page.mouse.move(x, y);
                await new Promise((resolve)=>setTimeout(resolve, delay));
            }
            await page.mouse.up({
                button: 'left'
            });
        } else if ('playwright' === this.interfaceType) {
            const page = this.underlyingPage;
            await page.mouse.move(from.x, from.y);
            await page.mouse.down();
            const steps = 30;
            const delay = duration / steps;
            for(let i = 1; i <= steps; i++){
                const x = from.x + (to.x - from.x) * (i / steps);
                const y = from.y + (to.y - from.y) * (i / steps);
                await page.mouse.move(x, y);
                await page.waitForTimeout(delay);
            }
            await page.mouse.up({
                button: 'left'
            });
        }
    }
    async longPress(x, y, duration) {
        duration = duration || 500;
        const LONG_PRESS_THRESHOLD = 600;
        const MIN_PRESS_THRESHOLD = 300;
        if (duration > LONG_PRESS_THRESHOLD) duration = LONG_PRESS_THRESHOLD;
        if (duration < MIN_PRESS_THRESHOLD) duration = MIN_PRESS_THRESHOLD;
        debugPage(`mouse longPress at ${x}, ${y} for ${duration}ms`);
        if ('puppeteer' === this.interfaceType) {
            const page = this.underlyingPage;
            await page.mouse.move(x, y);
            await page.mouse.down({
                button: 'left'
            });
            await new Promise((res)=>setTimeout(res, duration));
            await page.mouse.up({
                button: 'left'
            });
        } else if ('playwright' === this.interfaceType) {
            const page = this.underlyingPage;
            await page.mouse.move(x, y);
            await page.mouse.down({
                button: 'left'
            });
            await page.waitForTimeout(duration);
            await page.mouse.up({
                button: 'left'
            });
        }
    }
    constructor(underlyingPage, interfaceType, opts){
        _define_property(this, "underlyingPage", void 0);
        _define_property(this, "waitForNavigationTimeout", void 0);
        _define_property(this, "waitForNetworkIdleTimeout", void 0);
        _define_property(this, "viewportSize", void 0);
        _define_property(this, "onBeforeInvokeAction", void 0);
        _define_property(this, "onAfterInvokeAction", void 0);
        _define_property(this, "customActions", void 0);
        _define_property(this, "interfaceType", void 0);
        _define_property(this, "everMoved", false);
        this.underlyingPage = underlyingPage;
        this.interfaceType = interfaceType;
        this.waitForNavigationTimeout = (null == opts ? void 0 : opts.waitForNavigationTimeout) ?? constants_namespaceObject.DEFAULT_WAIT_FOR_NAVIGATION_TIMEOUT;
        this.waitForNetworkIdleTimeout = (null == opts ? void 0 : opts.waitForNetworkIdleTimeout) ?? constants_namespaceObject.DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT;
        this.onBeforeInvokeAction = null == opts ? void 0 : opts.beforeInvokeAction;
        this.onAfterInvokeAction = null == opts ? void 0 : opts.afterInvokeAction;
        this.customActions = null == opts ? void 0 : opts.customActions;
    }
}
function forceClosePopup(page, debugProfile) {
    page.on('popup', async (popup)=>{
        if (!popup) return void console.warn('got a popup event, but the popup is not ready yet, skip');
        const url = await popup.url();
        console.log(`Popup opened: ${url}`);
        if (popup.isClosed()) debugProfile(`popup is already closed, skip close ${url}`);
        else try {
            await popup.close();
        } catch (error) {
            debugProfile(`failed to close popup ${url}, error: ${error}`);
        }
        if (page.isClosed()) debugProfile(`page is already closed, skip goto ${url}`);
        else try {
            await page.goto(url);
        } catch (error) {
            debugProfile(`failed to goto ${url}, error: ${error}`);
        }
    });
}
exports.Page = __webpack_exports__.Page;
exports.debugPage = __webpack_exports__.debugPage;
exports.forceClosePopup = __webpack_exports__.forceClosePopup;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "Page",
    "debugPage",
    "forceClosePopup"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=base-page.js.map