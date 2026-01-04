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
    defaultViewportHeight: ()=>defaultViewportHeight,
    defaultViewportScale: ()=>defaultViewportScale,
    launchPuppeteerPage: ()=>launchPuppeteerPage,
    puppeteerAgentForTarget: ()=>puppeteerAgentForTarget,
    defaultWaitForNetworkIdleTimeout: ()=>defaultWaitForNetworkIdleTimeout,
    defaultUA: ()=>defaultUA,
    defaultViewportWidth: ()=>defaultViewportWidth
});
const external_node_fs_namespaceObject = require("node:fs");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const utils_namespaceObject = require("@sqaitech/shared/utils");
const external_index_js_namespaceObject = require("./index.js");
const constants_namespaceObject = require("@sqaitech/shared/constants");
const external_puppeteer_namespaceObject = require("puppeteer");
var external_puppeteer_default = /*#__PURE__*/ __webpack_require__.n(external_puppeteer_namespaceObject);
const defaultUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
const defaultViewportWidth = 1440;
const defaultViewportHeight = 768;
const defaultViewportScale = 'darwin' === process.platform ? 2 : 1;
const defaultWaitForNetworkIdleTimeout = constants_namespaceObject.DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT;
const launcherDebug = (0, logger_namespaceObject.getDebug)('puppeteer:launcher');
async function launchPuppeteerPage(target, preference, browser) {
    var _target_waitForNetworkIdle;
    (0, utils_namespaceObject.assert)(target.url, 'url is required');
    const freeFn = [];
    const ua = target.userAgent || defaultUA;
    let width = defaultViewportWidth;
    let preferMaximizedWindow = true;
    if (target.viewportWidth) {
        preferMaximizedWindow = false;
        (0, utils_namespaceObject.assert)('number' == typeof target.viewportWidth, 'viewportWidth must be a number');
        width = Number.parseInt(target.viewportWidth, 10);
        (0, utils_namespaceObject.assert)(width > 0, `viewportWidth must be greater than 0, but got ${width}`);
    }
    let height = defaultViewportHeight;
    if (target.viewportHeight) {
        preferMaximizedWindow = false;
        (0, utils_namespaceObject.assert)('number' == typeof target.viewportHeight, 'viewportHeight must be a number');
        height = Number.parseInt(target.viewportHeight, 10);
        (0, utils_namespaceObject.assert)(height > 0, `viewportHeight must be greater than 0, but got ${height}`);
    }
    let dpr = defaultViewportScale;
    if (target.viewportScale) {
        preferMaximizedWindow = false;
        (0, utils_namespaceObject.assert)('number' == typeof target.viewportScale, 'viewportScale must be a number');
        dpr = Number.parseInt(target.viewportScale, 10);
        (0, utils_namespaceObject.assert)(dpr > 0, `viewportScale must be greater than 0, but got ${dpr}`);
    }
    const viewportConfig = {
        width,
        height,
        deviceScaleFactor: dpr
    };
    const headed = (null == preference ? void 0 : preference.headed) || (null == preference ? void 0 : preference.keepWindow);
    preferMaximizedWindow = preferMaximizedWindow && !!headed;
    if (headed && '1' === process.env.CI) console.warn('you are probably running headed mode in CI, this will usually fail.');
    const isWindows = 'win32' === process.platform;
    const args = [
        ...isWindows ? [] : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        '--disable-features=HttpsFirstBalancedModeAutoEnable',
        '--disable-features=PasswordLeakDetection',
        '--disable-save-password-bubble',
        `--user-agent="${ua}"`,
        preferMaximizedWindow ? '--start-maximized' : `--window-size=${width},${height + 200}`
    ];
    launcherDebug('launching browser with viewport, headed', headed, 'viewport', viewportConfig, 'args', args, 'preference', preference);
    let browserInstance = browser;
    if (!browserInstance) {
        browserInstance = await external_puppeteer_default().launch({
            headless: !(null == preference ? void 0 : preference.headed),
            defaultViewport: viewportConfig,
            args,
            acceptInsecureCerts: target.acceptInsecureCerts
        });
        freeFn.push({
            name: 'puppeteer_browser',
            fn: ()=>{
                if (!(null == preference ? void 0 : preference.keepWindow)) if (isWindows) setTimeout(()=>{
                    null == browserInstance || browserInstance.close();
                }, 800);
                else null == browserInstance || browserInstance.close();
            }
        });
    }
    const page = await browserInstance.newPage();
    if (target.cookie) {
        const cookieFileContent = (0, external_node_fs_namespaceObject.readFileSync)(target.cookie, 'utf-8');
        await browserInstance.setCookie(...JSON.parse(cookieFileContent));
    }
    if (ua) await page.setUserAgent(ua);
    if (viewportConfig) await page.setViewport(viewportConfig);
    const waitForNetworkIdleTimeout = 'number' == typeof (null == (_target_waitForNetworkIdle = target.waitForNetworkIdle) ? void 0 : _target_waitForNetworkIdle.timeout) ? target.waitForNetworkIdle.timeout : defaultWaitForNetworkIdleTimeout;
    try {
        launcherDebug('goto', target.url);
        await page.goto(target.url);
        if (waitForNetworkIdleTimeout > 0) {
            launcherDebug('waitForNetworkIdle', waitForNetworkIdleTimeout);
            await page.waitForNetworkIdle({
                timeout: waitForNetworkIdleTimeout
            });
        }
    } catch (e) {
        var _target_waitForNetworkIdle1, _target_waitForNetworkIdle2;
        if ('boolean' == typeof (null == (_target_waitForNetworkIdle1 = target.waitForNetworkIdle) ? void 0 : _target_waitForNetworkIdle1.continueOnNetworkIdleError) && !(null == (_target_waitForNetworkIdle2 = target.waitForNetworkIdle) ? void 0 : _target_waitForNetworkIdle2.continueOnNetworkIdleError)) {
            const newError = new Error(`failed to wait for network idle: ${e}`, {
                cause: e
            });
            throw newError;
        }
        const newMessage = `failed to wait for network idle after ${waitForNetworkIdleTimeout}ms, but the script will continue.`;
        console.warn(newMessage);
    }
    return {
        page,
        freeFn
    };
}
async function puppeteerAgentForTarget(target, preference, browser) {
    const { page, freeFn } = await launchPuppeteerPage(target, preference, browser);
    const agent = new external_index_js_namespaceObject.PuppeteerAgent(page, {
        autoPrintReportMsg: false,
        testId: null == preference ? void 0 : preference.testId,
        cache: null == preference ? void 0 : preference.cache,
        aiActionContext: target.aiActionContext,
        forceSameTabNavigation: void 0 !== target.forceSameTabNavigation ? target.forceSameTabNavigation : true
    });
    freeFn.push({
        name: 'midscene_puppeteer_agent',
        fn: ()=>agent.destroy()
    });
    return {
        agent,
        freeFn
    };
}
exports.defaultUA = __webpack_exports__.defaultUA;
exports.defaultViewportHeight = __webpack_exports__.defaultViewportHeight;
exports.defaultViewportScale = __webpack_exports__.defaultViewportScale;
exports.defaultViewportWidth = __webpack_exports__.defaultViewportWidth;
exports.defaultWaitForNetworkIdleTimeout = __webpack_exports__.defaultWaitForNetworkIdleTimeout;
exports.launchPuppeteerPage = __webpack_exports__.launchPuppeteerPage;
exports.puppeteerAgentForTarget = __webpack_exports__.puppeteerAgentForTarget;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "defaultUA",
    "defaultViewportHeight",
    "defaultViewportScale",
    "defaultViewportWidth",
    "defaultWaitForNetworkIdleTimeout",
    "launchPuppeteerPage",
    "puppeteerAgentForTarget"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=agent-launcher.js.map