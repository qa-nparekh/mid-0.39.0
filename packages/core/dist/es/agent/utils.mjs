import { elementByPositionWithElementInfo } from "../ai-model/index.mjs";
import { uploadTestInfoToServer } from "../utils.mjs";
import { NodeType } from "@sqai/shared/constants";
import { SQAI_REPORT_TAG_NAME, globalConfigManager } from "@sqai/shared/env";
import { generateElementByPosition, getNodeFromCacheList } from "@sqai/shared/extractor";
import { getDebug } from "@sqai/shared/logger";
import { assert, logMsg, uuid } from "@sqai/shared/utils";
import dayjs from "dayjs";
import { debug } from "./task-cache.mjs";
const debugProfile = getDebug('web:tool:profile');
async function commonContextParser(interfaceInstance, _opt) {
    var _interfaceInstance_describe;
    assert(interfaceInstance, 'interfaceInstance is required');
    debugProfile("Getting interface description");
    const description = (null == (_interfaceInstance_describe = interfaceInstance.describe) ? void 0 : _interfaceInstance_describe.call(interfaceInstance)) || '';
    debugProfile("Interface description end");
    debugProfile('Uploading test info to server');
    uploadTestInfoToServer({
        testUrl: description,
        serverUrl: _opt.uploadServerUrl
    });
    debugProfile('UploadTestInfoToServer end');
    const screenshotBase64 = await interfaceInstance.screenshotBase64();
    assert(screenshotBase64, 'screenshotBase64 is required');
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
    const reportTagName = globalConfigManager.getEnvConfigValue(SQAI_REPORT_TAG_NAME);
    const dateTimeInFileName = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const uniqueId = uuid().substring(0, 8);
    return `${reportTagName || tag}-${dateTimeInFileName}-${uniqueId}`;
}
function printReportMsg(filepath) {
    logMsg(`Midscene - report file updated: ${filepath}`);
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
        taskFile = uuid();
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
    if (planLocateParam.id) return getNodeFromCacheList(planLocateParam.id);
    if (planLocateParam.bbox) {
        const centerPosition = {
            x: Math.floor((planLocateParam.bbox[0] + planLocateParam.bbox[2]) / 2),
            y: Math.floor((planLocateParam.bbox[1] + planLocateParam.bbox[3]) / 2)
        };
        let element = elementByPositionWithElementInfo(tree, centerPosition);
        if (!element) element = generateElementByPosition(centerPosition);
        return element;
    }
}
async function matchElementFromCache(taskExecutor, cacheEntry, cachePrompt, cacheable) {
    var _taskExecutor_taskCache;
    if (!cacheEntry) return;
    if (false === cacheable) return void debug('cache disabled for prompt: %s', cachePrompt);
    if (!(null == (_taskExecutor_taskCache = taskExecutor.taskCache) ? void 0 : _taskExecutor_taskCache.isCacheResultUsed)) return;
    if (!taskExecutor.interface.rectMatchesCacheFeature) return void debug('interface does not implement rectMatchesCacheFeature, skip cache');
    try {
        const rect = await taskExecutor.interface.rectMatchesCacheFeature(cacheEntry);
        const element = {
            id: uuid(),
            center: [
                Math.round(rect.left + rect.width / 2),
                Math.round(rect.top + rect.height / 2)
            ],
            rect,
            xpaths: [],
            attributes: {
                nodeType: NodeType.POSITION
            }
        };
        debug('cache hit, prompt: %s', cachePrompt);
        return element;
    } catch (error) {
        debug('rectMatchesCacheFeature error: %s', error);
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
const getMidsceneVersion = ()=>"0.30.9";
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
export { commonContextParser, generateCacheId, getCurrentExecutionFile, getMidsceneVersion, getReportFileName, matchElementFromCache, matchElementFromPlan, parsePrompt, printReportMsg, trimContextByViewport };

//# sourceMappingURL=utils.mjs.map