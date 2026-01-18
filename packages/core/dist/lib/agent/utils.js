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
    commonContextParser: ()=>commonContextParser,
    getSqaiVersion: ()=>getSqaiVersion,
    matchElementFromPlan: ()=>matchElementFromPlan,
    getReportFileName: ()=>getReportFileName,
    trimContextByViewport: ()=>trimContextByViewport,
    matchElementFromCache: ()=>matchElementFromCache,
    printReportMsg: ()=>printReportMsg,
    generateCacheId: ()=>generateCacheId,
    getMidsceneVersion: ()=>getMidsceneVersion,
    getCurrentExecutionFile: ()=>getCurrentExecutionFile,
    parsePrompt: ()=>parsePrompt
});
const index_js_namespaceObject = require("../ai-model/index.js");
const external_utils_js_namespaceObject = require("../utils.js");
const constants_namespaceObject = require("@sqaitech/shared/constants");
const env_namespaceObject = require("@sqaitech/shared/env");
const extractor_namespaceObject = require("@sqaitech/shared/extractor");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const utils_namespaceObject = require("@sqaitech/shared/utils");
const external_dayjs_namespaceObject = require("dayjs");
var external_dayjs_default = /*#__PURE__*/ __webpack_require__.n(external_dayjs_namespaceObject);
const external_task_cache_js_namespaceObject = require("./task-cache.js");
const debugProfile = (0, logger_namespaceObject.getDebug)('web:tool:profile');
async function commonContextParser(interfaceInstance, _opt) {
    var _interfaceInstance_describe;
    (0, utils_namespaceObject.assert)(interfaceInstance, 'interfaceInstance is required');
    debugProfile("Getting interface description");
    const description = (null == (_interfaceInstance_describe = interfaceInstance.describe) ? void 0 : _interfaceInstance_describe.call(interfaceInstance)) || '';
    debugProfile("Interface description end");
    debugProfile('Uploading test info to server');
    (0, external_utils_js_namespaceObject.uploadTestInfoToServer)({
        testUrl: description,
        serverUrl: _opt.uploadServerUrl
    });
    debugProfile('UploadTestInfoToServer end');
    const screenshotBase64 = await interfaceInstance.screenshotBase64();
    (0, utils_namespaceObject.assert)(screenshotBase64, 'screenshotBase64 is required');
    const size = await interfaceInstance.size();
    debugProfile(`size: ${size.width}x${size.height} dpr: ${size.dpr}`);
    return {
        tree: {
            node: null,
            children: []
        },
        size,
        screenshotBase64: screenshotBase64
    };
}
function getReportFileName(tag = 'web') {
    const reportTagName = env_namespaceObject.globalConfigManager.getEnvConfigValue(env_namespaceObject.SQAI_REPORT_TAG_NAME);
    const dateTimeInFileName = external_dayjs_default()().format('YYYY-MM-DD_HH-mm-ss');
    const uniqueId = (0, utils_namespaceObject.uuid)().substring(0, 8);
    return `${reportTagName || tag}-${dateTimeInFileName}-${uniqueId}`;
}
function printReportMsg(filepath) {
    (0, utils_namespaceObject.logMsg)(`Midscene - report file updated: ${filepath}`);
}
function getCurrentExecutionFile(trace) {
    const error = new Error();
    const stackTrace = trace || error.stack;
    const pkgDir = process.cwd() || '';
    if (stackTrace) {
        const stackLines = stackTrace.split('\n');
        for (const line of stackLines)if (line.includes('.spec.') || line.includes('.test.') || line.includes('.ts') || line.includes('.js')) {
            const match = line.match(/(?:at\s+)?(.*?\.(?:spec|test)\.[jt]s)/);
            if (null == match ? void 0 : match[1]) {
                const targetFileName = match[1].replace(pkgDir, '').trim().replace('at ', '');
                return targetFileName;
            }
        }
    }
    return false;
}
const testFileIndex = new Map();
function generateCacheId(fileName) {
    let taskFile = fileName || getCurrentExecutionFile();
    if (!taskFile) {
        taskFile = (0, utils_namespaceObject.uuid)();
        console.warn('Midscene - using random UUID for cache id. Cache may be invalid.');
    }
    if (testFileIndex.has(taskFile)) {
        const currentIndex = testFileIndex.get(taskFile);
        if (void 0 !== currentIndex) testFileIndex.set(taskFile, currentIndex + 1);
    } else testFileIndex.set(taskFile, 1);
    return `${taskFile}-${testFileIndex.get(taskFile)}`;
}
function matchElementFromPlan(planLocateParam, tree) {
    if (!planLocateParam) return;
    if (planLocateParam.id) return (0, extractor_namespaceObject.getNodeFromCacheList)(planLocateParam.id);
    if (planLocateParam.bbox) {
        const centerPosition = {
            x: Math.floor((planLocateParam.bbox[0] + planLocateParam.bbox[2]) / 2),
            y: Math.floor((planLocateParam.bbox[1] + planLocateParam.bbox[3]) / 2)
        };
        let element = (0, index_js_namespaceObject.elementByPositionWithElementInfo)(tree, centerPosition);
        if (!element) element = (0, extractor_namespaceObject.generateElementByPosition)(centerPosition);
        return element;
    }
}
async function matchElementFromCache(taskExecutor, cacheEntry, cachePrompt, cacheable) {
    var _taskExecutor_taskCache;
    if (!cacheEntry) return;
    if (false === cacheable) return void (0, external_task_cache_js_namespaceObject.debug)('cache disabled for prompt: %s', cachePrompt);
    if (!(null == (_taskExecutor_taskCache = taskExecutor.taskCache) ? void 0 : _taskExecutor_taskCache.isCacheResultUsed)) return;
    if (!taskExecutor.interface.rectMatchesCacheFeature) return void (0, external_task_cache_js_namespaceObject.debug)('interface does not implement rectMatchesCacheFeature, skip cache');
    try {
        const rect = await taskExecutor.interface.rectMatchesCacheFeature(cacheEntry);
        const element = {
            id: (0, utils_namespaceObject.uuid)(),
            center: [
                Math.round(rect.left + rect.width / 2),
                Math.round(rect.top + rect.height / 2)
            ],
            rect,
            xpaths: [],
            attributes: {
                nodeType: constants_namespaceObject.NodeType.POSITION
            }
        };
        (0, external_task_cache_js_namespaceObject.debug)('cache hit, prompt: %s', cachePrompt);
        return element;
    } catch (error) {
        (0, external_task_cache_js_namespaceObject.debug)('rectMatchesCacheFeature error: %s', error);
        return;
    }
}
function trimContextByViewport(execution) {
    function filterVisibleTree(node) {
        if (!node) return null;
        const filteredChildren = Array.isArray(node.children) ? node.children.map(filterVisibleTree).filter((child)=>null !== child) : [];
        if (node.node && true === node.node.isVisible) return {
            ...node,
            children: filteredChildren
        };
        if (filteredChildren.length > 0) return {
            node: null,
            children: filteredChildren
        };
        return null;
    }
    return {
        ...execution,
        tasks: Array.isArray(execution.tasks) ? execution.tasks.map((task)=>{
            var _task_uiContext;
            const newTask = {
                ...task
            };
            if (null == (_task_uiContext = task.uiContext) ? void 0 : _task_uiContext.tree) newTask.uiContext = {
                ...task.uiContext,
                tree: filterVisibleTree(task.uiContext.tree) || {
                    node: null,
                    children: []
                }
            };
            return newTask;
        }) : execution.tasks
    };
}
const getMidsceneVersion = ()=>"0.5.0";
const getSqaiVersion = getMidsceneVersion;
const parsePrompt = (prompt)=>{
    if ('string' == typeof prompt) return {
        textPrompt: prompt,
        multimodalPrompt: void 0
    };
    return {
        textPrompt: prompt.prompt,
        multimodalPrompt: prompt.images ? {
            images: prompt.images,
            convertHttpImage2Base64: !!prompt.convertHttpImage2Base64
        } : void 0
    };
};
exports.commonContextParser = __webpack_exports__.commonContextParser;
exports.generateCacheId = __webpack_exports__.generateCacheId;
exports.getCurrentExecutionFile = __webpack_exports__.getCurrentExecutionFile;
exports.getMidsceneVersion = __webpack_exports__.getMidsceneVersion;
exports.getReportFileName = __webpack_exports__.getReportFileName;
exports.getSqaiVersion = __webpack_exports__.getSqaiVersion;
exports.matchElementFromCache = __webpack_exports__.matchElementFromCache;
exports.matchElementFromPlan = __webpack_exports__.matchElementFromPlan;
exports.parsePrompt = __webpack_exports__.parsePrompt;
exports.printReportMsg = __webpack_exports__.printReportMsg;
exports.trimContextByViewport = __webpack_exports__.trimContextByViewport;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "commonContextParser",
    "generateCacheId",
    "getCurrentExecutionFile",
    "getMidsceneVersion",
    "getReportFileName",
    "getSqaiVersion",
    "matchElementFromCache",
    "matchElementFromPlan",
    "parsePrompt",
    "printReportMsg",
    "trimContextByViewport"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=utils.js.map