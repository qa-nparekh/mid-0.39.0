import node_assert from "node:assert";
import { getMidsceneLocationSchema, z } from "@sqaitech/core";
import { defineAction, defineActionClearInput, defineActionDoubleClick, defineActionDragAndDrop, defineActionKeyboardPress, defineActionScroll, defineActionTap } from "@sqaitech/core/device";
import { sleep } from "@sqaitech/core/utils";
import { DEFAULT_WDA_PORT } from "@sqaitech/shared/constants";
import { createImgBase64ByFormat } from "@sqaitech/shared/img";
import { getDebug } from "@sqaitech/shared/logger";
import { WDAManager, WebDriverClient } from "@sqaitech/webdriver";
import { Agent } from "@sqaitech/core/agent";
import { exec } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";
import { overrideAIConfig } from "@sqaitech/shared/env";
const debugIOS = getDebug('webdriver:ios');
class IOSWebDriverClient extends WebDriverClient {
    async launchApp(bundleId) {
        this.ensureSession();
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/apps/launch`, {
                bundleId
            });
            debugIOS(`Launched app: ${bundleId}`);
        } catch (error) {
            debugIOS(`Failed to launch app ${bundleId}: ${error}`);
            throw error;
        }
    }
    async activateApp(bundleId) {
        this.ensureSession();
        await this.makeRequest('POST', `/session/${this.sessionId}/wda/apps/activate`, {
            bundleId
        });
    }
    async terminateApp(bundleId) {
        this.ensureSession();
        await this.makeRequest('POST', `/session/${this.sessionId}/wda/apps/terminate`, {
            bundleId
        });
    }
    async openUrl(url) {
        this.ensureSession();
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/url`, {
                url
            });
        } catch (error) {
            debugIOS(`Direct URL opening failed, trying Safari fallback: ${error}`);
            await this.launchApp('com.apple.mobilesafari');
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            await this.makeRequest('POST', `/session/${this.sessionId}/url`, {
                url
            });
        }
    }
    async pressHomeButton() {
        this.ensureSession();
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/pressButton`, {
                name: 'home'
            });
            debugIOS('Home button pressed using hardware key');
        } catch (error) {
            debugIOS(`Failed to press home button: ${error}`);
            throw new Error(`Failed to press home button: ${error}`);
        }
    }
    async appSwitcher() {
        this.ensureSession();
        try {
            const windowSize = await this.getWindowSize();
            debugIOS('Triggering app switcher with slow swipe up gesture');
            const centerX = windowSize.width / 2;
            const startY = windowSize.height - 5;
            const endY = 0.5 * windowSize.height;
            await this.swipe(centerX, startY, centerX, endY, 1500);
            await new Promise((resolve)=>setTimeout(resolve, 800));
        } catch (error) {
            debugIOS(`App switcher failed: ${error}`);
            throw new Error(`Failed to trigger app switcher: ${error}`);
        }
    }
    async pressKey(key) {
        this.ensureSession();
        debugIOS(`Attempting to press key: ${key}`);
        if ('Enter' === key || 'Return' === key || 'return' === key) {
            debugIOS('Handling Enter/Return key for iOS');
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: [
                    '\n'
                ]
            });
            debugIOS('Sent newline character for Enter key');
            await new Promise((resolve)=>setTimeout(resolve, 100));
            return;
        }
        if ('Backspace' === key || 'Delete' === key) try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: [
                    '\b'
                ]
            });
            debugIOS('Sent backspace character');
            return;
        } catch (error) {
            debugIOS(`Backspace failed: ${error}`);
        }
        if ('Space' === key) try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: [
                    ' '
                ]
            });
            debugIOS('Sent space character');
            return;
        } catch (error) {
            debugIOS(`Space key failed: ${error}`);
        }
        const normalizedKey = this.normalizeKeyName(key);
        const iosKeyMap = {
            Tab: '\t',
            ArrowUp: '\uE013',
            ArrowDown: '\uE015',
            ArrowLeft: '\uE012',
            ArrowRight: '\uE014',
            Home: '\uE011',
            End: '\uE010'
        };
        if (iosKeyMap[normalizedKey]) try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: [
                    iosKeyMap[normalizedKey]
                ]
            });
            debugIOS(`Sent WebDriver key code for: ${key}`);
            return;
        } catch (error) {
            debugIOS(`WebDriver key failed for "${key}": ${error}`);
        }
        if (1 === key.length) try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: [
                    key
                ]
            });
            debugIOS(`Sent single character: "${key}"`);
            return;
        } catch (error) {
            debugIOS(`Failed to send character "${key}": ${error}`);
        }
        debugIOS(`Warning: Key "${key}" is not supported on iOS platform`);
        throw new Error(`Key "${key}" is not supported on iOS platform`);
    }
    normalizeKeyName(key) {
        return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    }
    async dismissKeyboard(keyNames) {
        this.ensureSession();
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keyboard/dismiss`, {
                keyNames: keyNames || [
                    'done'
                ]
            });
            debugIOS('Dismissed keyboard using WDA API');
            return true;
        } catch (error) {
            debugIOS(`Failed to dismiss keyboard: ${error}`);
            return false;
        }
    }
    async typeText(text) {
        this.ensureSession();
        try {
            const cleanText = text.trim();
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/keys`, {
                value: cleanText.split('')
            });
            debugIOS(`Typed text: "${text}"`);
        } catch (error) {
            debugIOS(`Failed to type text "${text}": ${error}`);
            throw new Error(`Failed to type text: ${error}`);
        }
    }
    async tap(x, y) {
        this.ensureSession();
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/wda/tap`, {
                x,
                y
            });
            debugIOS(`Tapped at coordinates (${x}, ${y})`);
        } catch (error) {
            debugIOS(`Failed to tap at (${x}, ${y}): ${error}`);
            throw new Error(`Failed to tap at coordinates: ${error}`);
        }
    }
    async swipe(fromX, fromY, toX, toY, duration = 500) {
        this.ensureSession();
        const actions = {
            actions: [
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: {
                        pointerType: 'touch'
                    },
                    actions: [
                        {
                            type: 'pointerMove',
                            duration: 0,
                            x: fromX,
                            y: fromY
                        },
                        {
                            type: 'pointerDown',
                            button: 0
                        },
                        {
                            type: 'pause',
                            duration: 100
                        },
                        {
                            type: 'pointerMove',
                            duration,
                            x: toX,
                            y: toY
                        },
                        {
                            type: 'pointerUp',
                            button: 0
                        }
                    ]
                }
            ]
        };
        await this.makeRequest('POST', `/session/${this.sessionId}/actions`, actions);
        debugIOS(`Swiped using W3C Actions from (${fromX}, ${fromY}) to (${toX}, ${toY}) in ${duration}ms`);
    }
    async longPress(x, y, duration = 1000) {
        this.ensureSession();
        await this.makeRequest('POST', `/session/${this.sessionId}/wda/touchAndHold`, {
            x,
            y,
            duration: duration / 1000
        });
        debugIOS(`Long pressed at coordinates (${x}, ${y}) for ${duration}ms`);
    }
    async doubleTap(x, y) {
        this.ensureSession();
        await this.makeRequest('POST', `/session/${this.sessionId}/wda/doubleTap`, {
            x,
            y
        });
        debugIOS(`Double tapped at coordinates (${x}, ${y})`);
    }
    async tripleTap(x, y) {
        this.ensureSession();
        await this.makeRequest('POST', `/session/${this.sessionId}/wda/tapWithNumberOfTaps`, {
            x,
            y,
            numberOfTaps: 3,
            numberOfTouches: 1
        });
        debugIOS(`Triple tapped at coordinates (${x}, ${y})`);
    }
    async getScreenScale() {
        var _screenResponse_value;
        const screenResponse = await this.makeRequest('GET', '/wda/screen');
        if (null == screenResponse ? void 0 : null == (_screenResponse_value = screenResponse.value) ? void 0 : _screenResponse_value.scale) {
            debugIOS(`Got screen scale from WDA screen endpoint: ${screenResponse.value.scale}`);
            return screenResponse.value.scale;
        }
        debugIOS('No screen scale found in WDA screen response');
        return null;
    }
    async createSession(capabilities) {
        const defaultCapabilities = {
            platformName: 'iOS',
            automationName: 'XCUITest',
            shouldUseSingletonTestManager: false,
            shouldUseTestManagerForVisibilityDetection: false,
            ...capabilities
        };
        const session = await super.createSession(defaultCapabilities);
        await this.setupIOSSession();
        return session;
    }
    async setupIOSSession() {
        if (!this.sessionId) return;
        try {
            await this.makeRequest('POST', `/session/${this.sessionId}/appium/settings`, {
                snapshotMaxDepth: 50,
                elementResponseAttributes: 'type,label,name,value,rect,enabled,visible'
            });
            debugIOS('iOS session configuration applied');
        } catch (error) {
            debugIOS(`Failed to apply iOS session configuration: ${error}`);
        }
    }
}
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
const debugDevice = getDebug('ios:device');
const BackspaceChar = '\u0008';
class IOSDevice {
    actionSpace() {
        const defaultActions = [
            defineActionTap(async (param)=>{
                const element = param.locate;
                node_assert(element, 'Element not found, cannot tap');
                await this.mouseClick(element.center[0], element.center[1]);
            }),
            defineActionDoubleClick(async (param)=>{
                const element = param.locate;
                node_assert(element, 'Element not found, cannot double click');
                await this.doubleTap(element.center[0], element.center[1]);
            }),
            defineAction({
                name: 'Input',
                description: 'Input text into the input field',
                interfaceAlias: 'aiInput',
                paramSchema: z.object({
                    value: z.string().describe('The text to input. Provide the final content for replace/append modes, or an empty string when using clear mode to remove existing text.'),
                    autoDismissKeyboard: z.boolean().optional().describe('If true, the keyboard will be dismissed after the input is completed. Do not set it unless the user asks you to do so.'),
                    mode: z["enum"]([
                        'replace',
                        'clear',
                        'append'
                    ]).default('replace').optional().describe('Input mode: "replace" (default) - clear the field and input the value; "append" - append the value to existing content; "clear" - clear the field without inputting new text.'),
                    locate: getMidsceneLocationSchema().describe('The input field to be filled').optional()
                }),
                call: async (param)=>{
                    var _this_options;
                    const element = param.locate;
                    if (element) {
                        if ('append' !== param.mode) await this.clearInput(element);
                    }
                    if ('clear' === param.mode) return;
                    if (!param || !param.value) return;
                    const autoDismissKeyboard = param.autoDismissKeyboard ?? (null == (_this_options = this.options) ? void 0 : _this_options.autoDismissKeyboard);
                    await this.typeText(param.value, {
                        autoDismissKeyboard
                    });
                }
            }),
            defineActionScroll(async (param)=>{
                const element = param.locate;
                const startingPoint = element ? {
                    left: element.center[0],
                    top: element.center[1]
                } : void 0;
                const scrollToEventName = null == param ? void 0 : param.scrollType;
                if ('untilTop' === scrollToEventName) await this.scrollUntilTop(startingPoint);
                else if ('untilBottom' === scrollToEventName) await this.scrollUntilBottom(startingPoint);
                else if ('untilRight' === scrollToEventName) await this.scrollUntilRight(startingPoint);
                else if ('untilLeft' === scrollToEventName) await this.scrollUntilLeft(startingPoint);
                else if ('once' !== scrollToEventName && scrollToEventName) throw new Error(`Unknown scroll event type: ${scrollToEventName}, param: ${JSON.stringify(param)}`);
                else {
                    if ((null == param ? void 0 : param.direction) !== 'down' && param && param.direction) if ('up' === param.direction) await this.scrollUp(param.distance || void 0, startingPoint);
                    else if ('left' === param.direction) await this.scrollLeft(param.distance || void 0, startingPoint);
                    else if ('right' === param.direction) await this.scrollRight(param.distance || void 0, startingPoint);
                    else throw new Error(`Unknown scroll direction: ${param.direction}`);
                    else await this.scrollDown((null == param ? void 0 : param.distance) || void 0, startingPoint);
                    await sleep(500);
                }
            }),
            defineActionDragAndDrop(async (param)=>{
                const from = param.from;
                const to = param.to;
                node_assert(from, 'missing "from" param for drag and drop');
                node_assert(to, 'missing "to" param for drag and drop');
                await this.swipe(from.center[0], from.center[1], to.center[0], to.center[1]);
            }),
            defineActionKeyboardPress(async (param)=>{
                await this.pressKey(param.keyName);
            }),
            defineAction({
                name: 'IOSHomeButton',
                description: 'Trigger the system "home" operation on iOS devices',
                paramSchema: z.object({}),
                call: async ()=>{
                    await this.home();
                }
            }),
            defineAction({
                name: 'IOSAppSwitcher',
                description: 'Trigger the system "app switcher" operation on iOS devices',
                paramSchema: z.object({}),
                call: async ()=>{
                    await this.appSwitcher();
                }
            }),
            defineAction({
                name: 'IOSLongPress',
                description: 'Trigger a long press on the screen at specified coordinates on iOS devices',
                paramSchema: z.object({
                    duration: z.number().optional().describe('The duration of the long press in milliseconds'),
                    locate: getMidsceneLocationSchema().describe('The element to be long pressed')
                }),
                call: async (param)=>{
                    const element = param.locate;
                    node_assert(element, 'IOSLongPress requires an element to be located');
                    const [x, y] = element.center;
                    await this.longPress(x, y, null == param ? void 0 : param.duration);
                }
            }),
            defineActionClearInput(async (param)=>{
                const element = param.locate;
                node_assert(element, 'Element not found, cannot clear input');
                await this.clearInput(element);
            })
        ];
        const customActions = this.customActions || [];
        return [
            ...defaultActions,
            ...customActions
        ];
    }
    describe() {
        return this.description || `Device ID: ${this.deviceId}`;
    }
    async getConnectedDeviceInfo() {
        return await this.wdaBackend.getDeviceInfo();
    }
    async connect() {
        node_assert(!this.destroyed, `IOSDevice ${this.deviceId} has been destroyed and cannot execute commands`);
        debugDevice(`Connecting to iOS device: ${this.deviceId}`);
        try {
            await this.wdaManager.start();
            await this.wdaBackend.createSession();
            const deviceInfo = await this.wdaBackend.getDeviceInfo();
            if (null == deviceInfo ? void 0 : deviceInfo.udid) {
                this.deviceId = deviceInfo.udid;
                debugDevice(`Updated device ID to real UDID: ${this.deviceId}`);
            }
            const size = await this.getScreenSize();
            this.description = `
UDID: ${this.deviceId}${deviceInfo ? `
Name: ${deviceInfo.name}
Model: ${deviceInfo.model}` : ''}
Type: WebDriverAgent
ScreenSize: ${size.width}x${size.height} (DPR: ${size.scale})
`;
            debugDevice('iOS device connected successfully', this.description);
        } catch (e) {
            debugDevice(`Failed to connect to iOS device: ${e}`);
            throw new Error(`Unable to connect to iOS device ${this.deviceId}: ${e}`);
        }
    }
    async launch(uri) {
        this.uri = uri;
        try {
            debugDevice(`Launching app: ${uri}`);
            if (uri.startsWith('http://') || uri.startsWith('https://') || uri.includes('://')) await this.openUrl(uri);
            else await this.wdaBackend.launchApp(uri);
            debugDevice(`Successfully launched: ${uri}`);
        } catch (error) {
            debugDevice(`Error launching ${uri}: ${error}`);
            throw new Error(`Failed to launch ${uri}: ${error.message}`);
        }
        return this;
    }
    async getElementsInfo() {
        return [];
    }
    async getElementsNodeTree() {
        return {
            node: null,
            children: []
        };
    }
    async initializeDevicePixelRatio() {
        if (this.devicePixelRatioInitialized) return;
        const apiScale = await this.wdaBackend.getScreenScale();
        node_assert(apiScale && apiScale > 0, 'Failed to get device pixel ratio from WebDriverAgent API');
        debugDevice(`Got screen scale from WebDriverAgent API: ${apiScale}`);
        this.devicePixelRatio = apiScale;
        this.devicePixelRatioInitialized = true;
    }
    async getScreenSize() {
        await this.initializeDevicePixelRatio();
        const windowSize = await this.wdaBackend.getWindowSize();
        return {
            width: windowSize.width,
            height: windowSize.height,
            scale: this.devicePixelRatio
        };
    }
    async size() {
        const screenSize = await this.getScreenSize();
        return {
            width: screenSize.width,
            height: screenSize.height,
            dpr: screenSize.scale
        };
    }
    async screenshotBase64() {
        debugDevice('Taking screenshot via WDA');
        try {
            const base64Data = await this.wdaBackend.takeScreenshot();
            const result = createImgBase64ByFormat('png', base64Data);
            debugDevice('Screenshot taken successfully');
            return result;
        } catch (error) {
            debugDevice(`Screenshot failed: ${error}`);
            throw new Error(`Failed to take screenshot: ${error}`);
        }
    }
    async clearInput(element) {
        if (!element) return;
        await this.tap(element.center[0], element.center[1]);
        await sleep(100);
        try {
            await this.tripleTap(element.center[0], element.center[1]);
            await sleep(200);
            await this.wdaBackend.typeText(BackspaceChar);
        } catch (error2) {
            debugDevice(`Method 1 failed, trying method 2: ${error2}`);
            try {
                const backspaces = Array(100).fill(BackspaceChar).join('');
                await this.wdaBackend.typeText(backspaces);
            } catch (error3) {
                debugDevice(`All clear methods failed: ${error3}`);
            }
        }
    }
    async url() {
        return '';
    }
    async tap(x, y) {
        await this.wdaBackend.tap(Math.round(x), Math.round(y));
    }
    async mouseClick(x, y) {
        debugDevice(`mouseClick at coordinates (${x}, ${y})`);
        await this.tap(x, y);
    }
    async doubleTap(x, y) {
        await this.wdaBackend.doubleTap(Math.round(x), Math.round(y));
    }
    async tripleTap(x, y) {
        await this.wdaBackend.tripleTap(Math.round(x), Math.round(y));
    }
    async longPress(x, y, duration = 1000) {
        await this.wdaBackend.longPress(Math.round(x), Math.round(y), duration);
    }
    async swipe(fromX, fromY, toX, toY, duration = 500) {
        await this.wdaBackend.swipe(Math.round(fromX), Math.round(fromY), Math.round(toX), Math.round(toY), duration);
    }
    async typeText(text, options) {
        var _this_options;
        if (!text) return;
        const shouldAutoDismissKeyboard = (null == options ? void 0 : options.autoDismissKeyboard) ?? (null == (_this_options = this.options) ? void 0 : _this_options.autoDismissKeyboard) ?? true;
        debugDevice(`Typing text: "${text}"`);
        try {
            await sleep(200);
            await this.wdaBackend.typeText(text);
            await sleep(300);
        } catch (error) {
            debugDevice(`Failed to type text with WDA: ${error}`);
            throw error;
        }
        if (shouldAutoDismissKeyboard) await this.hideKeyboard();
    }
    async pressKey(key) {
        await this.wdaBackend.pressKey(key);
    }
    async scrollUp(distance, startPoint) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(height / 2)
        };
        const scrollDistance = Math.round(distance || height / 3);
        await this.swipe(start.x, start.y, start.x, start.y + scrollDistance);
    }
    async scrollDown(distance, startPoint) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(height / 2)
        };
        const scrollDistance = Math.round(distance || height / 3);
        await this.swipe(start.x, start.y, start.x, start.y - scrollDistance);
    }
    async scrollLeft(distance, startPoint) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(height / 2)
        };
        const scrollDistance = Math.round(distance || 0.7 * width);
        await this.swipe(start.x, start.y, start.x + scrollDistance, start.y);
    }
    async scrollRight(distance, startPoint) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(height / 2)
        };
        const scrollDistance = Math.round(distance || 0.7 * width);
        await this.swipe(start.x, start.y, start.x - scrollDistance, start.y);
    }
    async scrollUntilTop(startPoint) {
        debugDevice('Using screenshot-based scroll detection for better reliability');
        await this.scrollUntilBoundary('up', startPoint, 1);
    }
    async scrollUntilBottom(startPoint) {
        debugDevice('Using screenshot-based scroll detection for better reliability');
        await this.scrollUntilBoundary('down', startPoint, 1);
    }
    compareScreenshots(screenshot1, screenshot2, tolerancePercent = 2) {
        if (screenshot1 === screenshot2) {
            debugDevice('Screenshots are identical');
            return true;
        }
        const len1 = screenshot1.length;
        const len2 = screenshot2.length;
        debugDevice(`Screenshots differ: length1=${len1}, length2=${len2}`);
        if (Math.abs(len1 - len2) > 0.1 * Math.min(len1, len2)) {
            debugDevice('Screenshots have significant length difference');
            return false;
        }
        if (len1 > 0 && len2 > 0) {
            const minLength = Math.min(len1, len2);
            const sampleSize = Math.min(2000, minLength);
            let diffCount = 0;
            for(let i = 0; i < sampleSize; i++)if (screenshot1[i] !== screenshot2[i]) diffCount++;
            const diffPercent = diffCount / sampleSize * 100;
            debugDevice(`Character differences: ${diffCount}/${sampleSize} (${diffPercent.toFixed(2)}%)`);
            const isSimilar = diffPercent <= tolerancePercent;
            if (isSimilar) debugDevice(`Screenshots are similar enough (${diffPercent.toFixed(2)}% <= ${tolerancePercent}%)`);
            return isSimilar;
        }
        return false;
    }
    async scrollUntilBoundary(direction, startPoint, maxUnchangedCount = 1) {
        const maxAttempts = 20;
        const { width, height } = await this.size();
        let start;
        if (startPoint) start = {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        };
        else switch(direction){
            case 'up':
                start = {
                    x: Math.round(width / 2),
                    y: Math.round(0.2 * height)
                };
                break;
            case 'down':
                start = {
                    x: Math.round(width / 2),
                    y: Math.round(0.8 * height)
                };
                break;
            case 'left':
                start = {
                    x: Math.round(0.8 * width),
                    y: Math.round(height / 2)
                };
                break;
            case 'right':
                start = {
                    x: Math.round(0.2 * width),
                    y: Math.round(height / 2)
                };
                break;
        }
        let lastScreenshot = null;
        let unchangedCount = 0;
        debugDevice(`Starting scroll to ${direction} with content detection`);
        for(let i = 0; i < maxAttempts; i++)try {
            debugDevice(`Scroll attempt ${i + 1}/${maxAttempts}`);
            await sleep(500);
            const currentScreenshot = await this.screenshotBase64();
            if (lastScreenshot && this.compareScreenshots(lastScreenshot, currentScreenshot, 10)) {
                unchangedCount++;
                debugDevice(`Screen content unchanged (${unchangedCount}/${maxUnchangedCount})`);
                if (unchangedCount >= maxUnchangedCount) {
                    debugDevice(`Reached ${direction}: screen content no longer changes`);
                    break;
                }
            } else {
                if (lastScreenshot) debugDevice(`Content changed, resetting counter (was ${unchangedCount})`);
                unchangedCount = 0;
            }
            if (i >= 15 && 0 === unchangedCount) {
                debugDevice(`Too many attempts with dynamic content, stopping scroll to ${direction}`);
                break;
            }
            lastScreenshot = currentScreenshot;
            const scrollDistance = Math.round('left' === direction || 'right' === direction ? 0.6 * width : 0.6 * height);
            debugDevice(`Performing scroll: ${direction}, distance: ${scrollDistance}`);
            switch(direction){
                case 'up':
                    await this.swipe(start.x, start.y, start.x, start.y + scrollDistance, 300);
                    break;
                case 'down':
                    await this.swipe(start.x, start.y, start.x, start.y - scrollDistance, 300);
                    break;
                case 'left':
                    await this.swipe(start.x, start.y, start.x + scrollDistance, start.y, 300);
                    break;
                case 'right':
                    await this.swipe(start.x, start.y, start.x - scrollDistance, start.y, 300);
                    break;
            }
            debugDevice('Waiting for scroll and inertia to complete...');
            await sleep(2000);
        } catch (error) {
            debugDevice(`Error during scroll attempt ${i + 1}: ${error}`);
            await sleep(300);
        }
        debugDevice(`Scroll to ${direction} completed after ${maxAttempts} attempts`);
    }
    async scrollUntilLeft(startPoint) {
        await this.scrollUntilBoundary('left', startPoint, 1);
    }
    async scrollUntilRight(startPoint) {
        await this.scrollUntilBoundary('right', startPoint, 3);
    }
    async home() {
        await this.wdaBackend.pressHomeButton();
    }
    async appSwitcher() {
        try {
            debugDevice('Triggering app switcher with slow swipe up gesture');
            const { width, height } = await this.size();
            const centerX = Math.round(width / 2);
            const startY = Math.round(height - 5);
            const endY = Math.round(0.5 * height);
            await this.wdaBackend.swipe(centerX, startY, centerX, endY, 1500);
            await sleep(800);
        } catch (error) {
            debugDevice(`App switcher failed: ${error}`);
            throw new Error(`Failed to trigger app switcher: ${error}`);
        }
    }
    async hideKeyboard(keyNames) {
        try {
            if (keyNames && keyNames.length > 0) {
                debugDevice(`Using keyNames to dismiss keyboard: ${keyNames.join(', ')}`);
                await this.wdaBackend.dismissKeyboard(keyNames);
                debugDevice('Dismissed keyboard using provided keyNames');
                await sleep(300);
                return true;
            }
            const windowSize = await this.wdaBackend.getWindowSize();
            const centerX = Math.round(windowSize.width / 2);
            const startY = Math.round(0.33 * windowSize.height);
            const endY = Math.round(0.33 * windowSize.height + 10);
            await this.swipe(centerX, startY, centerX, endY, 50);
            debugDevice('Dismissed keyboard with swipe down gesture at screen one-third position');
            await sleep(300);
            return true;
        } catch (error) {
            debugDevice(`Failed to hide keyboard: ${error}`);
            return false;
        }
    }
    async openUrl(url, options) {
        const opts = {
            useSafariAsBackup: true,
            waitTime: 2000,
            ...options
        };
        try {
            debugDevice(`Opening URL: ${url}`);
            await this.wdaBackend.openUrl(url);
            await sleep(opts.waitTime);
            debugDevice(`Successfully opened URL: ${url}`);
        } catch (error) {
            debugDevice(`Direct URL opening failed: ${error}`);
            if (opts.useSafariAsBackup) {
                debugDevice(`Attempting to open URL via Safari: ${url}`);
                await this.openUrlViaSafari(url);
            } else throw new Error(`Failed to open URL: ${error}`);
        }
    }
    async openUrlViaSafari(url) {
        try {
            debugDevice(`Opening URL via Safari: ${url}`);
            await this.wdaBackend.launchApp('com.apple.mobilesafari');
            await sleep(2000);
            await this.typeText(url);
            await sleep(500);
            await this.pressKey('Return');
            await sleep(1000);
            try {
                await sleep(2000);
                debugDevice(`URL opened via Safari: ${url}`);
            } catch (dialogError) {
                debugDevice(`No confirmation dialog or dialog handling failed: ${dialogError}`);
            }
        } catch (error) {
            debugDevice(`Failed to open URL via Safari: ${error}`);
            throw new Error(`Failed to open URL via Safari: ${error}`);
        }
    }
    async destroy() {
        if (this.destroyed) return;
        try {
            await this.wdaBackend.deleteSession();
            await this.wdaManager.stop();
        } catch (error) {
            debugDevice(`Error during cleanup: ${error}`);
        }
        this.destroyed = true;
        debugDevice(`iOS device ${this.deviceId} destroyed`);
    }
    constructor(options){
        _define_property(this, "deviceId", void 0);
        _define_property(this, "devicePixelRatio", 1);
        _define_property(this, "devicePixelRatioInitialized", false);
        _define_property(this, "destroyed", false);
        _define_property(this, "description", void 0);
        _define_property(this, "customActions", void 0);
        _define_property(this, "wdaBackend", void 0);
        _define_property(this, "wdaManager", void 0);
        _define_property(this, "interfaceType", 'ios');
        _define_property(this, "uri", void 0);
        _define_property(this, "options", void 0);
        this.deviceId = 'pending-connection';
        this.options = options;
        this.customActions = null == options ? void 0 : options.customActions;
        const wdaPort = (null == options ? void 0 : options.wdaPort) || DEFAULT_WDA_PORT;
        const wdaHost = (null == options ? void 0 : options.wdaHost) || 'localhost';
        this.wdaBackend = new IOSWebDriverClient({
            port: wdaPort,
            host: wdaHost
        });
        this.wdaManager = WDAManager.getInstance(wdaPort, wdaHost);
    }
}
const execAsync = promisify(exec);
const debugUtils = getDebug('ios:utils');
function checkMacOSPlatform() {
    const currentPlatform = platform();
    return {
        isMacOS: 'darwin' === currentPlatform,
        platform: currentPlatform
    };
}
async function checkIOSEnvironment() {
    try {
        const platformCheck = checkMacOSPlatform();
        if (!platformCheck.isMacOS) return {
            available: false,
            error: `iOS development is only supported on macOS. Current platform: ${platformCheck.platform}`
        };
        const { stdout: xcrunPath } = await execAsync('which xcrun');
        if (!xcrunPath.trim()) return {
            available: false,
            error: 'xcrun not found. Please install Xcode Command Line Tools: xcode-select --install'
        };
        try {
            await execAsync('xcodebuild -version');
        } catch (error) {
            return {
                available: false,
                error: 'xcodebuild not found. Please install Xcode from the App Store'
            };
        }
        debugUtils('iOS environment is available for WebDriverAgent');
        return {
            available: true
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        debugUtils(`iOS environment not available: ${errorMsg}`);
        if (errorMsg.includes('xcrun')) return {
            available: false,
            error: 'Xcode Command Line Tools not properly configured. Please run: sudo xcode-select --reset'
        };
        return {
            available: false,
            error: `iOS development environment not available: ${errorMsg}`
        };
    }
}
const debugAgent = getDebug('ios:agent');
class IOSAgent extends Agent {
    async launch(uri) {
        const device = this.page;
        await device.launch(uri);
    }
}
async function agentFromWebDriverAgent(opts) {
    debugAgent('Creating iOS agent with WebDriverAgent auto-detection');
    const envCheck = await checkIOSEnvironment();
    if (!envCheck.available) throw new Error(`iOS environment not available: ${envCheck.error}`);
    const device = new IOSDevice({
        autoDismissKeyboard: null == opts ? void 0 : opts.autoDismissKeyboard,
        customActions: null == opts ? void 0 : opts.customActions,
        wdaPort: null == opts ? void 0 : opts.wdaPort,
        wdaHost: null == opts ? void 0 : opts.wdaHost,
        useWDA: null == opts ? void 0 : opts.useWDA
    });
    await device.connect();
    return new IOSAgent(device, opts);
}
export { IOSAgent, IOSDevice, IOSWebDriverClient, agentFromWebDriverAgent, checkIOSEnvironment, overrideAIConfig };
