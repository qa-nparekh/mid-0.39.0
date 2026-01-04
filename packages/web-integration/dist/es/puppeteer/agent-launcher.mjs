import { readFileSync } from "node:fs";
import { getDebug } from "@sqaitech/shared/logger";
import { assert } from "@sqaitech/shared/utils";
import { PuppeteerAgent } from "./index.mjs";
import { DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT } from "@sqaitech/shared/constants";
import puppeteer from "puppeteer";
const defaultUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
const defaultViewportWidth = 1440;
const defaultViewportHeight = 768;
const defaultViewportScale = 'darwin' === process.platform ? 2 : 1;
const defaultWaitForNetworkIdleTimeout = DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT;
const launcherDebug = getDebug('puppeteer:launcher');
async function launchPuppeteerPage(target, preference, browser) {
    var _target_waitForNetworkIdle;
    assert(target.url, 'url is required');
    const freeFn = [];
    const ua = target.userAgent || defaultUA;
    let width = defaultViewportWidth;
    let preferMaximizedWindow = true;
    if (target.viewportWidth) {
        preferMaximizedWindow = false;
        assert('number' == typeof target.viewportWidth, 'viewportWidth must be a number');
        width = Number.parseInt(target.viewportWidth, 10);
        assert(width > 0, `viewportWidth must be greater than 0, but got ${width}`);
    }
    let height = defaultViewportHeight;
    if (target.viewportHeight) {
        preferMaximizedWindow = false;
        assert('number' == typeof target.viewportHeight, 'viewportHeight must be a number');
        height = Number.parseInt(target.viewportHeight, 10);
        assert(height > 0, `viewportHeight must be greater than 0, but got ${height}`);
    }
    let dpr = defaultViewportScale;
    if (target.viewportScale) {
        preferMaximizedWindow = false;
        assert('number' == typeof target.viewportScale, 'viewportScale must be a number');
        dpr = Number.parseInt(target.viewportScale, 10);
        assert(dpr > 0, `viewportScale must be greater than 0, but got ${dpr}`);
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
        browserInstance = await puppeteer.launch({
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
        const cookieFileContent = readFileSync(target.cookie, 'utf-8');
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
    const agent = new PuppeteerAgent(page, {
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
export { defaultUA, defaultViewportHeight, defaultViewportScale, defaultViewportWidth, defaultWaitForNetworkIdleTimeout, launchPuppeteerPage, puppeteerAgentForTarget };

//# sourceMappingURL=agent-launcher.mjs.map