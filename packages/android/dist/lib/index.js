"use strict";
const __rslib_import_meta_url__ = /*#__PURE__*/ function() {
    return 'undefined' == typeof document ? new (require('url'.replace('', ''))).URL('file:' + __filename).href : document.currentScript && document.currentScript.src || new URL('main.js', document.baseURI).href;
}();
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
    getConnectedDevices: ()=>getConnectedDevices,
    agentFromAdbDevice: ()=>agentFromAdbDevice,
    AndroidDevice: ()=>AndroidDevice,
    overrideAIConfig: ()=>env_namespaceObject.overrideAIConfig,
    AndroidAgent: ()=>AndroidAgent
});
const external_node_assert_namespaceObject = require("node:assert");
var external_node_assert_default = /*#__PURE__*/ __webpack_require__.n(external_node_assert_namespaceObject);
const external_node_fs_namespaceObject = require("node:fs");
var external_node_fs_default = /*#__PURE__*/ __webpack_require__.n(external_node_fs_namespaceObject);
const external_node_module_namespaceObject = require("node:module");
const external_node_path_namespaceObject = require("node:path");
var external_node_path_default = /*#__PURE__*/ __webpack_require__.n(external_node_path_namespaceObject);
const core_namespaceObject = require("@sqaitech/core");
const device_namespaceObject = require("@sqaitech/core/device");
const utils_namespaceObject = require("@sqaitech/core/utils");
const env_namespaceObject = require("@sqaitech/shared/env");
const img_namespaceObject = require("@sqaitech/shared/img");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const shared_utils_namespaceObject = require("@sqaitech/shared/utils");
const external_appium_adb_namespaceObject = require("appium-adb");
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
const defaultScrollUntilTimes = 10;
const defaultFastScrollDuration = 100;
const defaultNormalScrollDuration = 1000;
const IME_STRATEGY_ALWAYS_YADB = 'always-yadb';
const IME_STRATEGY_YADB_FOR_NON_ASCII = 'yadb-for-non-ascii';
const debugDevice = (0, logger_namespaceObject.getDebug)('android:device');
class AndroidDevice {
    actionSpace() {
        const defaultActions = [
            (0, device_namespaceObject.defineActionTap)(async (param)=>{
                const element = param.locate;
                external_node_assert_default()(element, 'Element not found, cannot tap');
                await this.mouseClick(element.center[0], element.center[1]);
            }),
            (0, device_namespaceObject.defineActionDoubleClick)(async (param)=>{
                const element = param.locate;
                external_node_assert_default()(element, 'Element not found, cannot double click');
                await this.mouseDoubleClick(element.center[0], element.center[1]);
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'Input',
                description: 'Input text into the input field',
                interfaceAlias: 'aiInput',
                paramSchema: core_namespaceObject.z.object({
                    value: core_namespaceObject.z.string().describe('The text to input. Provide the final content for replace/append modes, or an empty string when using clear mode to remove existing text.'),
                    autoDismissKeyboard: core_namespaceObject.z.boolean().optional().describe('If true, the keyboard will be dismissed after the input is completed. Do not set it unless the user asks you to do so.'),
                    mode: core_namespaceObject.z["enum"]([
                        'replace',
                        'clear',
                        'append'
                    ]).default('replace').optional().describe('Input mode: "replace" (default) - clear the field and input the value; "append" - append the value to existing content; "clear" - clear the field without inputting new text.'),
                    locate: (0, core_namespaceObject.getMidsceneLocationSchema)().describe('The input field to be filled').optional()
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
                    await this.keyboardType(param.value, {
                        autoDismissKeyboard
                    });
                }
            }),
            (0, device_namespaceObject.defineActionScroll)(async (param)=>{
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
                    await (0, utils_namespaceObject.sleep)(500);
                }
            }),
            (0, device_namespaceObject.defineActionDragAndDrop)(async (param)=>{
                const from = param.from;
                const to = param.to;
                external_node_assert_default()(from, 'missing "from" param for drag and drop');
                external_node_assert_default()(to, 'missing "to" param for drag and drop');
                await this.mouseDrag({
                    x: from.center[0],
                    y: from.center[1]
                }, {
                    x: to.center[0],
                    y: to.center[1]
                });
            }),
            (0, device_namespaceObject.defineActionKeyboardPress)(async (param)=>{
                await this.keyboardPress(param.keyName);
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'AndroidBackButton',
                description: 'Trigger the system "back" operation on Android devices',
                paramSchema: core_namespaceObject.z.object({}),
                call: async ()=>{
                    await this.back();
                }
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'AndroidHomeButton',
                description: 'Trigger the system "home" operation on Android devices',
                paramSchema: core_namespaceObject.z.object({}),
                call: async ()=>{
                    await this.home();
                }
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'AndroidRecentAppsButton',
                description: 'Trigger the system "recent apps" operation on Android devices',
                paramSchema: core_namespaceObject.z.object({}),
                call: async ()=>{
                    await this.recentApps();
                }
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'AndroidLongPress',
                description: 'Trigger a long press on the screen at specified coordinates on Android devices',
                paramSchema: core_namespaceObject.z.object({
                    duration: core_namespaceObject.z.number().optional().describe('The duration of the long press in milliseconds'),
                    locate: (0, core_namespaceObject.getMidsceneLocationSchema)().describe('The element to be long pressed')
                }),
                call: async (param)=>{
                    const element = param.locate;
                    if (!element) throw new Error('AndroidLongPress requires an element to be located');
                    const [x, y] = element.center;
                    await this.longPress(x, y, null == param ? void 0 : param.duration);
                }
            }),
            (0, device_namespaceObject.defineAction)({
                name: 'AndroidPull',
                description: 'Trigger pull down to refresh or pull up actions',
                paramSchema: core_namespaceObject.z.object({
                    direction: core_namespaceObject.z["enum"]([
                        'up',
                        'down'
                    ]).describe('The direction to pull'),
                    distance: core_namespaceObject.z.number().optional().describe('The distance to pull (in pixels)'),
                    duration: core_namespaceObject.z.number().optional().describe('The duration of the pull (in milliseconds)'),
                    locate: (0, core_namespaceObject.getMidsceneLocationSchema)().optional().describe('The element to start the pull from (optional)')
                }),
                call: async (param)=>{
                    const element = param.locate;
                    const startPoint = element ? {
                        left: element.center[0],
                        top: element.center[1]
                    } : void 0;
                    if (!param || !param.direction) throw new Error('AndroidPull requires a direction parameter');
                    if ('down' === param.direction) await this.pullDown(startPoint, param.distance, param.duration);
                    else if ('up' === param.direction) await this.pullUp(startPoint, param.distance, param.duration);
                    else throw new Error(`Unknown pull direction: ${param.direction}`);
                }
            }),
            (0, device_namespaceObject.defineActionClearInput)(async (param)=>{
                const element = param.locate;
                external_node_assert_default()(element, 'Element not found, cannot clear input');
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
        return this.description || `DeviceId: ${this.deviceId}`;
    }
    async connect() {
        return this.getAdb();
    }
    async getAdb() {
        if (this.destroyed) throw new Error(`AndroidDevice ${this.deviceId} has been destroyed and cannot execute ADB commands`);
        if (this.adb) return this.createAdbProxy(this.adb);
        if (this.connectingAdb) return this.connectingAdb.then((adb)=>this.createAdbProxy(adb));
        this.connectingAdb = (async ()=>{
            let error = null;
            debugDevice(`Initializing ADB with device ID: ${this.deviceId}`);
            try {
                var _this_options, _this_options1, _this_options2;
                const androidAdbPath = (null == (_this_options = this.options) ? void 0 : _this_options.androidAdbPath) || env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_ADB_PATH);
                const remoteAdbHost = (null == (_this_options1 = this.options) ? void 0 : _this_options1.remoteAdbHost) || env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_ADB_REMOTE_HOST);
                const remoteAdbPort = (null == (_this_options2 = this.options) ? void 0 : _this_options2.remoteAdbPort) || env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_ADB_REMOTE_PORT);
                this.adb = await new external_appium_adb_namespaceObject.ADB({
                    udid: this.deviceId,
                    adbExecTimeout: 60000,
                    executable: androidAdbPath ? {
                        path: androidAdbPath,
                        defaultArgs: []
                    } : void 0,
                    remoteAdbHost: remoteAdbHost || void 0,
                    remoteAdbPort: remoteAdbPort ? Number(remoteAdbPort) : void 0
                });
                const size = await this.getScreenSize();
                this.description = `
DeviceId: ${this.deviceId}
ScreenSize:
${Object.keys(size).filter((key)=>size[key]).map((key)=>`  ${key} size: ${size[key]}${'override' === key && size[key] ? " \u2705" : ''}`).join('\n')}
`;
                debugDevice('ADB initialized successfully', this.description);
                return this.adb;
            } catch (e) {
                debugDevice(`Failed to initialize ADB: ${e}`);
                error = new Error(`Unable to connect to device ${this.deviceId}: ${e}`);
            } finally{
                this.connectingAdb = null;
            }
            if (error) throw error;
            throw new Error('ADB initialization failed unexpectedly');
        })();
        return this.connectingAdb;
    }
    createAdbProxy(adb) {
        return new Proxy(adb, {
            get: (target, prop)=>{
                const originalMethod = target[prop];
                if ('function' != typeof originalMethod) return originalMethod;
                return async (...args)=>{
                    try {
                        debugDevice(`adb ${String(prop)} ${args.join(' ')}`);
                        const result = await originalMethod.apply(target, args);
                        debugDevice(`adb ${String(prop)} ${args.join(' ')} end`);
                        return result;
                    } catch (error) {
                        const methodName = String(prop);
                        const deviceId = this.deviceId;
                        debugDevice(`ADB error with device ${deviceId} when calling ${methodName}: ${error}`);
                        throw new Error(`ADB error with device ${deviceId} when calling ${methodName}, please check https://midscenejs.com/integrate-with-android.html#faq : ${error.message}`, {
                            cause: error
                        });
                    }
                };
            }
        });
    }
    async launch(uri) {
        const adb = await this.getAdb();
        this.uri = uri;
        try {
            debugDevice(`Launching app: ${uri}`);
            if (uri.startsWith('http://') || uri.startsWith('https://') || uri.includes('://')) await adb.startUri(uri);
            else if (uri.includes('/')) {
                const [appPackage, appActivity] = uri.split('/');
                await adb.startApp({
                    pkg: appPackage,
                    activity: appActivity
                });
            } else await adb.activateApp(uri);
            debugDevice(`Successfully launched: ${uri}`);
        } catch (error) {
            debugDevice(`Error launching ${uri}: ${error}`);
            throw new Error(`Failed to launch ${uri}: ${error.message}`, {
                cause: error
            });
        }
        return this;
    }
    async execYadb(keyboardContent) {
        await this.ensureYadb();
        const adb = await this.getAdb();
        await adb.shell(`app_process${this.getDisplayArg()} -Djava.class.path=/data/local/tmp/yadb /data/local/tmp com.ysbing.yadb.Main -keyboard "${keyboardContent}"`);
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
    async getScreenSize() {
        var _this_options, _this_options1;
        const shouldCache = !((null == (_this_options = this.options) ? void 0 : _this_options.alwaysRefreshScreenInfo) ?? false);
        if (shouldCache && this.cachedScreenSize) return this.cachedScreenSize;
        const adb = await this.getAdb();
        if ('number' == typeof (null == (_this_options1 = this.options) ? void 0 : _this_options1.displayId)) try {
            var _this_options2;
            const stdout = await adb.shell('dumpsys display');
            if (null == (_this_options2 = this.options) ? void 0 : _this_options2.usePhysicalDisplayIdForDisplayLookup) {
                const physicalDisplayId = await this.getPhysicalDisplayId();
                if (physicalDisplayId) {
                    const lineRegex = new RegExp(`^.*uniqueId \"local:${physicalDisplayId}\".*$
`, 'm');
                    const lineMatch = stdout.match(lineRegex);
                    if (lineMatch) {
                        const targetLine = lineMatch[0];
                        const realMatch = targetLine.match(/real (\d+) x (\d+)/);
                        const rotationMatch = targetLine.match(/rotation (\d+)/);
                        if (realMatch && rotationMatch) {
                            const width = Number(realMatch[1]);
                            const height = Number(realMatch[2]);
                            const rotation = Number(rotationMatch[1]);
                            const sizeStr = `${width}x${height}`;
                            debugDevice(`Using display info for long ID ${physicalDisplayId}: ${sizeStr}, rotation: ${rotation}`);
                            const result = {
                                override: sizeStr,
                                physical: sizeStr,
                                orientation: rotation
                            };
                            if (shouldCache) this.cachedScreenSize = result;
                            return result;
                        }
                    }
                }
            } else {
                const viewportRegex = new RegExp(`DisplayViewport{[^}]*displayId=${this.options.displayId}[^}]*}`, 'g');
                const match = stdout.match(viewportRegex);
                if (match) {
                    const targetLine = match[0];
                    const physicalFrameMatch = targetLine.match(/physicalFrame=Rect\(\d+, \d+ - (\d+), (\d+)\)/);
                    const orientationMatch = targetLine.match(/orientation=(\d+)/);
                    if (physicalFrameMatch && orientationMatch) {
                        const width = Number(physicalFrameMatch[1]);
                        const height = Number(physicalFrameMatch[2]);
                        const rotation = Number(orientationMatch[1]);
                        const sizeStr = `${width}x${height}`;
                        debugDevice(`Using display info for display ID ${this.options.displayId}: ${sizeStr}, rotation: ${rotation}`);
                        const result = {
                            override: sizeStr,
                            physical: sizeStr,
                            orientation: rotation
                        };
                        if (shouldCache) this.cachedScreenSize = result;
                        return result;
                    }
                }
            }
            debugDevice(`Could not find display info for displayId ${this.options.displayId}`);
        } catch (e) {
            debugDevice(`Failed to get size from display info for display ${this.options.displayId}: ${e}`);
        }
        const stdout = await adb.shell([
            'wm',
            'size'
        ]);
        const size = {
            override: '',
            physical: ''
        };
        const overrideSize = new RegExp(/Override size: ([^\r?\n]+)*/g).exec(stdout);
        if (overrideSize && overrideSize.length >= 2 && overrideSize[1]) {
            debugDevice(`Using Override size: ${overrideSize[1].trim()}`);
            size.override = overrideSize[1].trim();
        }
        const physicalSize = new RegExp(/Physical size: ([^\r?\n]+)*/g).exec(stdout);
        if (physicalSize && physicalSize.length >= 2) {
            debugDevice(`Using Physical size: ${physicalSize[1].trim()}`);
            size.physical = physicalSize[1].trim();
        }
        const orientation = await this.getDisplayOrientation();
        if (size.override || size.physical) {
            const result = {
                ...size,
                orientation
            };
            if (shouldCache) this.cachedScreenSize = result;
            return result;
        }
        throw new Error(`Failed to get screen size, output: ${stdout}`);
    }
    async initializeDevicePixelRatio() {
        if (this.devicePixelRatioInitialized) return;
        const densityNum = await this.getDisplayDensity();
        this.devicePixelRatio = Number(densityNum) / 160;
        debugDevice(`Initialized device pixel ratio: ${this.devicePixelRatio}`);
        this.devicePixelRatioInitialized = true;
    }
    async getDisplayDensity() {
        var _this_options;
        const adb = await this.getAdb();
        if ('number' == typeof (null == (_this_options = this.options) ? void 0 : _this_options.displayId)) try {
            var _this_options1;
            const stdout = await adb.shell('dumpsys display');
            if (null == (_this_options1 = this.options) ? void 0 : _this_options1.usePhysicalDisplayIdForDisplayLookup) {
                const physicalDisplayId = await this.getPhysicalDisplayId();
                if (physicalDisplayId) {
                    const lineRegex = new RegExp(`^.*uniqueId \"local:${physicalDisplayId}\".*$
`, 'm');
                    const lineMatch = stdout.match(lineRegex);
                    if (lineMatch) {
                        const targetLine = lineMatch[0];
                        const densityMatch = targetLine.match(/density (\d+)/);
                        if (densityMatch) {
                            const density = Number(densityMatch[1]);
                            debugDevice(`Using display density for physical ID ${physicalDisplayId}: ${density}`);
                            return density;
                        }
                    }
                }
            } else {
                const displayDeviceRegex = new RegExp(`DisplayDevice:[\\s\\S]*?mDisplayId=${this.options.displayId}[\\s\\S]*?DisplayInfo{[^}]*density (\\d+)`, 'm');
                const deviceBlockMatch = stdout.match(displayDeviceRegex);
                if (deviceBlockMatch) {
                    const density = Number(deviceBlockMatch[1]);
                    debugDevice(`Using display density for display ID ${this.options.displayId}: ${density}`);
                    return density;
                }
            }
        } catch (e) {
            debugDevice(`Failed to get density from display info: ${e}`);
        }
        const density = await adb.getScreenDensity();
        return density ?? 160;
    }
    async getDisplayOrientation() {
        var _this_options;
        const shouldCache = !((null == (_this_options = this.options) ? void 0 : _this_options.alwaysRefreshScreenInfo) ?? false);
        if (shouldCache && null !== this.cachedOrientation) return this.cachedOrientation;
        const adb = await this.getAdb();
        let orientation = 0;
        try {
            const orientationStdout = await adb.shell(`dumpsys${this.getDisplayArg()} input | grep SurfaceOrientation`);
            const orientationMatch = orientationStdout.match(/SurfaceOrientation:\s*(\d)/);
            if (!orientationMatch) throw new Error('Failed to get orientation from input');
            orientation = Number(orientationMatch[1]);
            debugDevice(`Screen orientation: ${orientation}`);
        } catch (e) {
            debugDevice('Failed to get orientation from input, try display');
            try {
                const orientationStdout = await adb.shell(`dumpsys${this.getDisplayArg()} display | grep mCurrentOrientation`);
                const orientationMatch = orientationStdout.match(/mCurrentOrientation=(\d)/);
                if (!orientationMatch) throw new Error('Failed to get orientation from display');
                orientation = Number(orientationMatch[1]);
                debugDevice(`Screen orientation (fallback): ${orientation}`);
            } catch (e2) {
                orientation = 0;
                debugDevice('Failed to get orientation from display, default to 0');
            }
        }
        if (shouldCache) this.cachedOrientation = orientation;
        return orientation;
    }
    async size() {
        var _this_options;
        await this.initializeDevicePixelRatio();
        const screenSize = await this.getScreenSize();
        const match = (screenSize.override || screenSize.physical).match(/(\d+)x(\d+)/);
        if (!match || match.length < 3) throw new Error(`Unable to parse screen size: ${screenSize}`);
        const isLandscape = 1 === screenSize.orientation || 3 === screenSize.orientation;
        const width = Number.parseInt(match[isLandscape ? 2 : 1], 10);
        const height = Number.parseInt(match[isLandscape ? 1 : 2], 10);
        const scale = (null == (_this_options = this.options) ? void 0 : _this_options.screenshotResizeScale) ?? 1 / this.devicePixelRatio;
        this.scalingRatio = scale;
        const logicalWidth = Math.round(width * scale);
        const logicalHeight = Math.round(height * scale);
        return {
            width: logicalWidth,
            height: logicalHeight,
            dpr: this.devicePixelRatio
        };
    }
    adjustCoordinates(x, y) {
        const scale = this.scalingRatio;
        return {
            x: Math.round(x / scale),
            y: Math.round(y / scale)
        };
    }
    calculateScrollEndPoint(start, deltaX, deltaY, maxWidth, maxHeight) {
        const minScrollDistance = 50;
        let actualScrollDistanceX = 0;
        let actualScrollDistanceY = 0;
        if (0 !== deltaX) {
            const maxAvailableX = deltaX > 0 ? maxWidth - start.x : start.x;
            actualScrollDistanceX = Math.min(Math.abs(deltaX), maxAvailableX);
            const minScrollX = Math.min(minScrollDistance, actualScrollDistanceX);
            actualScrollDistanceX = Math.max(minScrollX, actualScrollDistanceX);
        }
        if (0 !== deltaY) {
            const maxAvailableY = deltaY > 0 ? maxHeight - start.y : start.y;
            actualScrollDistanceY = Math.min(Math.abs(deltaY), maxAvailableY);
            const minScrollY = Math.min(minScrollDistance, actualScrollDistanceY);
            actualScrollDistanceY = Math.max(minScrollY, actualScrollDistanceY);
        }
        const endX = Math.round(0 === deltaX ? start.x : deltaX > 0 ? Math.min(maxWidth, start.x + actualScrollDistanceX) : Math.max(0, start.x - actualScrollDistanceX));
        const endY = Math.round(0 === deltaY ? start.y : deltaY > 0 ? Math.min(maxHeight, start.y + actualScrollDistanceY) : Math.max(0, start.y - actualScrollDistanceY));
        return {
            x: endX,
            y: endY
        };
    }
    async screenshotBase64() {
        var _this_options;
        debugDevice('screenshotBase64 begin');
        const adb = await this.getAdb();
        let screenshotBuffer;
        const androidScreenshotPath = `/data/local/tmp/midscene_screenshot_${(0, shared_utils_namespaceObject.uuid)()}.png`;
        const useShellScreencap = 'number' == typeof (null == (_this_options = this.options) ? void 0 : _this_options.displayId);
        try {
            if (useShellScreencap) {
                var _this_options1;
                throw new Error(`Display ${null == (_this_options1 = this.options) ? void 0 : _this_options1.displayId} requires shell screencap`);
            }
            debugDevice('Taking screenshot via adb.takeScreenshot');
            screenshotBuffer = await adb.takeScreenshot(null);
            debugDevice('adb.takeScreenshot completed');
            if (!screenshotBuffer) throw new Error('Failed to capture screenshot: screenshotBuffer is null');
            if (!(0, img_namespaceObject.isValidPNGImageBuffer)(screenshotBuffer)) {
                debugDevice('Invalid image buffer detected: not a valid image format');
                throw new Error('Screenshot buffer has invalid format: could not find valid image signature');
            }
        } catch (error) {
            debugDevice(`Taking screenshot via adb.takeScreenshot failed or was skipped: ${error}`);
            const screenshotPath = (0, utils_namespaceObject.getTmpFile)('png');
            try {
                var _this_options2, _this_options3;
                debugDevice('Fallback: taking screenshot via shell screencap');
                const displayId = (null == (_this_options2 = this.options) ? void 0 : _this_options2.usePhysicalDisplayIdForScreenshot) ? await this.getPhysicalDisplayId() : null == (_this_options3 = this.options) ? void 0 : _this_options3.displayId;
                const displayArg = displayId ? `-d ${displayId}` : '';
                try {
                    await adb.shell(`screencap -p ${displayArg} ${androidScreenshotPath}`.trim());
                    debugDevice('adb.shell screencap completed');
                } catch (screencapError) {
                    debugDevice('screencap failed, using forceScreenshot');
                    await this.forceScreenshot(androidScreenshotPath);
                    debugDevice('forceScreenshot completed');
                }
                debugDevice('Pulling screenshot file from device');
                await adb.pull(androidScreenshotPath, screenshotPath);
                debugDevice(`adb.pull completed, local path: ${screenshotPath}`);
                screenshotBuffer = await external_node_fs_default().promises.readFile(screenshotPath);
            } finally{
                await adb.shell(`rm ${androidScreenshotPath}`);
            }
        }
        debugDevice('Converting to base64');
        const result = (0, img_namespaceObject.createImgBase64ByFormat)('png', screenshotBuffer.toString('base64'));
        debugDevice('screenshotBase64 end');
        return result;
    }
    async clearInput(element) {
        var _this_options;
        if (!element) return;
        await this.ensureYadb();
        const adb = await this.getAdb();
        await this.mouseClick(element.center[0], element.center[1]);
        const IME_STRATEGY = ((null == (_this_options = this.options) ? void 0 : _this_options.imeStrategy) || env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_ANDROID_IME_STRATEGY)) ?? IME_STRATEGY_YADB_FOR_NON_ASCII;
        if (IME_STRATEGY === IME_STRATEGY_YADB_FOR_NON_ASCII) await adb.clearTextField(100);
        else await adb.shell(`app_process${this.getDisplayArg()} -Djava.class.path=/data/local/tmp/yadb /data/local/tmp com.ysbing.yadb.Main -keyboard "~CLEAR~"`);
        if (await adb.isSoftKeyboardPresent()) return;
        await this.mouseClick(element.center[0], element.center[1]);
    }
    async forceScreenshot(path) {
        await this.ensureYadb();
        const adb = await this.getAdb();
        await adb.shell(`app_process -Djava.class.path=/data/local/tmp/yadb /data/local/tmp com.ysbing.yadb.Main -screenshot ${path}`);
    }
    async url() {
        return '';
    }
    async scrollUntilTop(startPoint) {
        if (startPoint) {
            const { height } = await this.size();
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = {
                x: start.x,
                y: Math.round(height)
            };
            await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.mouseDrag(start, end, defaultFastScrollDuration));
            await (0, utils_namespaceObject.sleep)(1000);
            return;
        }
        await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.scroll(0, -9999999, defaultFastScrollDuration));
        await (0, utils_namespaceObject.sleep)(1000);
    }
    async scrollUntilBottom(startPoint) {
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = {
                x: start.x,
                y: 0
            };
            await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.mouseDrag(start, end, defaultFastScrollDuration));
            await (0, utils_namespaceObject.sleep)(1000);
            return;
        }
        await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.scroll(0, 9999999, defaultFastScrollDuration));
        await (0, utils_namespaceObject.sleep)(1000);
    }
    async scrollUntilLeft(startPoint) {
        if (startPoint) {
            const { width } = await this.size();
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = {
                x: Math.round(width),
                y: start.y
            };
            await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.mouseDrag(start, end, defaultFastScrollDuration));
            await (0, utils_namespaceObject.sleep)(1000);
            return;
        }
        await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.scroll(-9999999, 0, defaultFastScrollDuration));
        await (0, utils_namespaceObject.sleep)(1000);
    }
    async scrollUntilRight(startPoint) {
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = {
                x: 0,
                y: start.y
            };
            await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.mouseDrag(start, end, defaultFastScrollDuration));
            await (0, utils_namespaceObject.sleep)(1000);
            return;
        }
        await (0, shared_utils_namespaceObject.repeat)(defaultScrollUntilTimes, ()=>this.scroll(9999999, 0, defaultFastScrollDuration));
        await (0, utils_namespaceObject.sleep)(1000);
    }
    async scrollUp(distance, startPoint) {
        const { height } = await this.size();
        const scrollDistance = Math.round(distance || height);
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = this.calculateScrollEndPoint(start, 0, scrollDistance, 0, height);
            await this.mouseDrag(start, end);
            return;
        }
        await this.scroll(0, -scrollDistance);
    }
    async scrollDown(distance, startPoint) {
        const { height } = await this.size();
        const scrollDistance = Math.round(distance || height);
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = this.calculateScrollEndPoint(start, 0, -scrollDistance, 0, height);
            await this.mouseDrag(start, end);
            return;
        }
        await this.scroll(0, scrollDistance);
    }
    async scrollLeft(distance, startPoint) {
        const { width } = await this.size();
        const scrollDistance = Math.round(distance || width);
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = this.calculateScrollEndPoint(start, scrollDistance, 0, width, 0);
            await this.mouseDrag(start, end);
            return;
        }
        await this.scroll(-scrollDistance, 0);
    }
    async scrollRight(distance, startPoint) {
        const { width } = await this.size();
        const scrollDistance = Math.round(distance || width);
        if (startPoint) {
            const start = {
                x: Math.round(startPoint.left),
                y: Math.round(startPoint.top)
            };
            const end = this.calculateScrollEndPoint(start, -scrollDistance, 0, width, 0);
            await this.mouseDrag(start, end);
            return;
        }
        await this.scroll(scrollDistance, 0);
    }
    async ensureYadb() {
        if (!this.yadbPushed) {
            const adb = await this.getAdb();
            const androidPkgJson = (0, external_node_module_namespaceObject.createRequire)(__rslib_import_meta_url__).resolve('@sqaitech/android/package.json');
            const yadbBin = external_node_path_default().join(external_node_path_default().dirname(androidPkgJson), 'bin', 'yadb');
            await adb.push(yadbBin, '/data/local/tmp');
            this.yadbPushed = true;
        }
    }
    async keyboardType(text, options) {
        var _this_options, _this_options1;
        if (!text) return;
        const adb = await this.getAdb();
        const isChinese = /[\p{Script=Han}\p{sc=Hani}]/u.test(text);
        const IME_STRATEGY = ((null == (_this_options = this.options) ? void 0 : _this_options.imeStrategy) || env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_ANDROID_IME_STRATEGY)) ?? IME_STRATEGY_YADB_FOR_NON_ASCII;
        const shouldAutoDismissKeyboard = (null == options ? void 0 : options.autoDismissKeyboard) ?? (null == (_this_options1 = this.options) ? void 0 : _this_options1.autoDismissKeyboard) ?? true;
        if (IME_STRATEGY === IME_STRATEGY_ALWAYS_YADB || IME_STRATEGY === IME_STRATEGY_YADB_FOR_NON_ASCII && isChinese) await this.execYadb(text);
        else await adb.inputText(text);
        if (true === shouldAutoDismissKeyboard) await this.hideKeyboard(options);
    }
    normalizeKeyName(key) {
        const keyMap = {
            enter: 'Enter',
            backspace: 'Backspace',
            tab: 'Tab',
            escape: 'Escape',
            esc: 'Escape',
            home: 'Home',
            end: 'End',
            arrowup: 'ArrowUp',
            arrowdown: 'ArrowDown',
            arrowleft: 'ArrowLeft',
            arrowright: 'ArrowRight',
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight'
        };
        const lowerKey = key.toLowerCase();
        return keyMap[lowerKey] || key;
    }
    async keyboardPress(key) {
        const keyCodeMap = {
            Enter: 66,
            Backspace: 67,
            Tab: 61,
            ArrowUp: 19,
            ArrowDown: 20,
            ArrowLeft: 21,
            ArrowRight: 22,
            Escape: 111,
            Home: 3,
            End: 123
        };
        const adb = await this.getAdb();
        const normalizedKey = this.normalizeKeyName(key);
        const keyCode = keyCodeMap[normalizedKey];
        if (void 0 !== keyCode) await adb.keyevent(keyCode);
        else if (1 === key.length) {
            const asciiCode = key.toUpperCase().charCodeAt(0);
            if (asciiCode >= 65 && asciiCode <= 90) await adb.keyevent(asciiCode - 36);
        }
    }
    async mouseClick(x, y) {
        const adb = await this.getAdb();
        const { x: adjustedX, y: adjustedY } = this.adjustCoordinates(x, y);
        await adb.shell(`input${this.getDisplayArg()} swipe ${adjustedX} ${adjustedY} ${adjustedX} ${adjustedY} 150`);
    }
    async mouseDoubleClick(x, y) {
        const adb = await this.getAdb();
        const { x: adjustedX, y: adjustedY } = this.adjustCoordinates(x, y);
        const tapCommand = `input${this.getDisplayArg()} tap ${adjustedX} ${adjustedY}`;
        await adb.shell(tapCommand);
        await (0, utils_namespaceObject.sleep)(50);
        await adb.shell(tapCommand);
    }
    async mouseMove() {
        return Promise.resolve();
    }
    async mouseDrag(from, to, duration) {
        const adb = await this.getAdb();
        const { x: fromX, y: fromY } = this.adjustCoordinates(from.x, from.y);
        const { x: toX, y: toY } = this.adjustCoordinates(to.x, to.y);
        const swipeDuration = duration ?? defaultNormalScrollDuration;
        await adb.shell(`input${this.getDisplayArg()} swipe ${fromX} ${fromY} ${toX} ${toY} ${swipeDuration}`);
    }
    async scroll(deltaX, deltaY, duration) {
        if (0 === deltaX && 0 === deltaY) throw new Error('Scroll distance cannot be zero in both directions');
        const { width, height } = await this.size();
        const n = 4;
        const startX = Math.round(deltaX < 0 ? width / n * (n - 1) : width / n);
        const startY = Math.round(deltaY < 0 ? height / n * (n - 1) : height / n);
        const maxNegativeDeltaX = startX;
        const maxPositiveDeltaX = Math.round(width / n * (n - 1));
        const maxNegativeDeltaY = startY;
        const maxPositiveDeltaY = Math.round(height / n * (n - 1));
        deltaX = Math.max(-maxNegativeDeltaX, Math.min(deltaX, maxPositiveDeltaX));
        deltaY = Math.max(-maxNegativeDeltaY, Math.min(deltaY, maxPositiveDeltaY));
        const endX = Math.round(startX - deltaX);
        const endY = Math.round(startY - deltaY);
        const { x: adjustedStartX, y: adjustedStartY } = this.adjustCoordinates(startX, startY);
        const { x: adjustedEndX, y: adjustedEndY } = this.adjustCoordinates(endX, endY);
        const adb = await this.getAdb();
        const swipeDuration = duration ?? defaultNormalScrollDuration;
        await adb.shell(`input${this.getDisplayArg()} swipe ${adjustedStartX} ${adjustedStartY} ${adjustedEndX} ${adjustedEndY} ${swipeDuration}`);
    }
    async destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        try {
            if (this.adb) this.adb = null;
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
        this.connectingAdb = null;
        this.yadbPushed = false;
    }
    async back() {
        const adb = await this.getAdb();
        await adb.shell(`input${this.getDisplayArg()} keyevent 4`);
    }
    async home() {
        const adb = await this.getAdb();
        await adb.shell(`input${this.getDisplayArg()} keyevent 3`);
    }
    async recentApps() {
        const adb = await this.getAdb();
        await adb.shell(`input${this.getDisplayArg()} keyevent 187`);
    }
    async longPress(x, y, duration = 1000) {
        const adb = await this.getAdb();
        const { x: adjustedX, y: adjustedY } = this.adjustCoordinates(x, y);
        await adb.shell(`input${this.getDisplayArg()} swipe ${adjustedX} ${adjustedY} ${adjustedX} ${adjustedY} ${duration}`);
    }
    async pullDown(startPoint, distance, duration = 800) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(0.15 * height)
        };
        const pullDistance = Math.round(distance || 0.5 * height);
        const end = {
            x: start.x,
            y: start.y + pullDistance
        };
        await this.pullDrag(start, end, duration);
        await (0, utils_namespaceObject.sleep)(200);
    }
    async pullDrag(from, to, duration) {
        const adb = await this.getAdb();
        const { x: fromX, y: fromY } = this.adjustCoordinates(from.x, from.y);
        const { x: toX, y: toY } = this.adjustCoordinates(to.x, to.y);
        await adb.shell(`input${this.getDisplayArg()} swipe ${fromX} ${fromY} ${toX} ${toY} ${duration}`);
    }
    async pullUp(startPoint, distance, duration = 600) {
        const { width, height } = await this.size();
        const start = startPoint ? {
            x: Math.round(startPoint.left),
            y: Math.round(startPoint.top)
        } : {
            x: Math.round(width / 2),
            y: Math.round(0.85 * height)
        };
        const pullDistance = Math.round(distance || 0.4 * height);
        const end = {
            x: start.x,
            y: start.y - pullDistance
        };
        await this.pullDrag(start, end, duration);
        await (0, utils_namespaceObject.sleep)(100);
    }
    getDisplayArg() {
        var _this_options;
        return 'number' == typeof (null == (_this_options = this.options) ? void 0 : _this_options.displayId) ? ` -d ${this.options.displayId}` : '';
    }
    async getPhysicalDisplayId() {
        var _this_options;
        if ('number' != typeof (null == (_this_options = this.options) ? void 0 : _this_options.displayId)) return null;
        const adb = await this.getAdb();
        try {
            const stdout = await adb.shell(`dumpsys SurfaceFlinger --display-id ${this.options.displayId}`);
            const regex = new RegExp(`Display (\\d+) \\(HWC display ${this.options.displayId}\\):`);
            const displayMatch = stdout.match(regex);
            if (null == displayMatch ? void 0 : displayMatch[1]) {
                debugDevice(`Found physical display ID: ${displayMatch[1]} for display ID: ${this.options.displayId}`);
                return displayMatch[1];
            }
            debugDevice(`Could not find physical display ID for display ID: ${this.options.displayId}`);
            return null;
        } catch (error) {
            debugDevice(`Error getting physical display ID: ${error}`);
            return null;
        }
    }
    async hideKeyboard(options, timeoutMs = 1000) {
        var _this_options;
        const adb = await this.getAdb();
        const keyboardDismissStrategy = (null == options ? void 0 : options.keyboardDismissStrategy) ?? (null == (_this_options = this.options) ? void 0 : _this_options.keyboardDismissStrategy) ?? 'esc-first';
        const keyboardStatus = await adb.isSoftKeyboardPresent();
        const isKeyboardShown = 'boolean' == typeof keyboardStatus ? keyboardStatus : null == keyboardStatus ? void 0 : keyboardStatus.isKeyboardShown;
        if (!isKeyboardShown) {
            debugDevice('Keyboard has no UI; no closing necessary');
            return false;
        }
        const keyCodes = 'back-first' === keyboardDismissStrategy ? [
            4,
            111
        ] : [
            111,
            4
        ];
        for (const keyCode of keyCodes){
            await adb.keyevent(keyCode);
            const startTime = Date.now();
            const intervalMs = 100;
            while(Date.now() - startTime < timeoutMs){
                await (0, utils_namespaceObject.sleep)(intervalMs);
                const currentStatus = await adb.isSoftKeyboardPresent();
                const isStillShown = 'boolean' == typeof currentStatus ? currentStatus : null == currentStatus ? void 0 : currentStatus.isKeyboardShown;
                if (!isStillShown) {
                    debugDevice(`Keyboard hidden successfully with keycode ${keyCode}`);
                    return true;
                }
            }
            debugDevice(`Keyboard still shown after keycode ${keyCode}, trying next key`);
        }
        console.warn('Warning: Failed to hide the software keyboard after trying both ESC and BACK keys');
        return false;
    }
    constructor(deviceId, options){
        _define_property(this, "deviceId", void 0);
        _define_property(this, "yadbPushed", false);
        _define_property(this, "devicePixelRatio", 1);
        _define_property(this, "devicePixelRatioInitialized", false);
        _define_property(this, "scalingRatio", 1);
        _define_property(this, "adb", null);
        _define_property(this, "connectingAdb", null);
        _define_property(this, "destroyed", false);
        _define_property(this, "description", void 0);
        _define_property(this, "customActions", void 0);
        _define_property(this, "cachedScreenSize", null);
        _define_property(this, "cachedOrientation", null);
        _define_property(this, "interfaceType", 'android');
        _define_property(this, "uri", void 0);
        _define_property(this, "options", void 0);
        external_node_assert_default()(deviceId, 'deviceId is required for AndroidDevice');
        this.deviceId = deviceId;
        this.options = options;
        this.customActions = null == options ? void 0 : options.customActions;
    }
}
const agent_namespaceObject = require("@sqaitech/core/agent");
const debugUtils = (0, logger_namespaceObject.getDebug)('android:utils');
async function getConnectedDevices() {
    try {
        const adb = await external_appium_adb_namespaceObject.ADB.createADB({
            adbExecTimeout: 60000
        });
        const devices = await adb.getConnectedDevices();
        debugUtils(`Found ${devices.length} connected devices: `, devices);
        return devices;
    } catch (error) {
        console.error('Failed to get device list:', error);
        throw new Error(`Unable to get connected Android device list, please check https://midscenejs.com/integrate-with-android.html#faq : ${error.message}`, {
            cause: error
        });
    }
}
const debugAgent = (0, logger_namespaceObject.getDebug)('android:agent');
class AndroidAgent extends agent_namespaceObject.Agent {
    async launch(uri) {
        const device = this.page;
        await device.launch(uri);
    }
    async runAdbShell(command) {
        const adb = await this.page.getAdb();
        return await adb.shell(command);
    }
}
async function agentFromAdbDevice(deviceId, opts) {
    if (!deviceId) {
        const devices = await getConnectedDevices();
        deviceId = devices[0].udid;
        debugAgent('deviceId not specified, will use the first device (id = %s)', deviceId);
    }
    const device = new AndroidDevice(deviceId, {
        autoDismissKeyboard: null == opts ? void 0 : opts.autoDismissKeyboard,
        androidAdbPath: null == opts ? void 0 : opts.androidAdbPath,
        remoteAdbHost: null == opts ? void 0 : opts.remoteAdbHost,
        remoteAdbPort: null == opts ? void 0 : opts.remoteAdbPort,
        imeStrategy: null == opts ? void 0 : opts.imeStrategy,
        displayId: null == opts ? void 0 : opts.displayId,
        usePhysicalDisplayIdForScreenshot: null == opts ? void 0 : opts.usePhysicalDisplayIdForScreenshot,
        usePhysicalDisplayIdForDisplayLookup: null == opts ? void 0 : opts.usePhysicalDisplayIdForDisplayLookup,
        screenshotResizeScale: null == opts ? void 0 : opts.screenshotResizeScale,
        alwaysRefreshScreenInfo: null == opts ? void 0 : opts.alwaysRefreshScreenInfo
    });
    await device.connect();
    return new AndroidAgent(device, opts);
}
exports.AndroidAgent = __webpack_exports__.AndroidAgent;
exports.AndroidDevice = __webpack_exports__.AndroidDevice;
exports.agentFromAdbDevice = __webpack_exports__.agentFromAdbDevice;
exports.getConnectedDevices = __webpack_exports__.getConnectedDevices;
exports.overrideAIConfig = __webpack_exports__.overrideAIConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AndroidAgent",
    "AndroidDevice",
    "agentFromAdbDevice",
    "getConnectedDevices",
    "overrideAIConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
