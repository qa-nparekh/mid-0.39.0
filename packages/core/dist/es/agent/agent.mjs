import { Insight } from "../index.mjs";
import js_yaml from "js-yaml";
import { getVersion, groupedActionDumpFileExt, processCacheConfig, reportHTMLContent, stringifyDumpData, writeLogFile } from "../utils.mjs";
import { ScriptPlayer, buildDetailedLocateParam, parseYamlScript } from "../yaml/index.mjs";
import { ModelConfigManager, globalModelConfigManager } from "@sqaitech/shared/env";
import { imageInfoOfBase64, resizeImgBase64 } from "@sqaitech/shared/img";
import { getDebug } from "@sqaitech/shared/logger";
import { assert } from "@sqaitech/shared/utils";
import { TaskCache } from "./task-cache.mjs";
import { TaskExecutor, locatePlanForLocate } from "./tasks.mjs";
import { locateParamStr, paramStr, taskTitleStr, typeStr } from "./ui-utils.mjs";
import { commonContextParser, getReportFileName, parsePrompt, printReportMsg, trimContextByViewport } from "./utils.mjs";
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
const debug = getDebug('agent');
const distanceOfTwoPoints = (p1, p2)=>{
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    return Math.round(Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2));
};
const includedInRect = (point, rect)=>{
    const [x, y] = point;
    const { left, top, width, height } = rect;
    return x >= left && x <= left + width && y >= top && y <= top + height;
};
const defaultInsightExtractOption = {
    domIncluded: false,
    screenshotIncluded: true
};
const CACHE_STRATEGIES = [
    'read-only',
    'read-write',
    'write-only'
];
const isValidCacheStrategy = (strategy)=>CACHE_STRATEGIES.some((value)=>value === strategy);
const CACHE_STRATEGY_VALUES = CACHE_STRATEGIES.map((value)=>`"${value}"`).join(', ');
class Agent {
    get page() {
        return this.interface;
    }
    ensureVLModelWarning() {
        if (!this.hasWarnedNonVLModel && 'puppeteer' !== this.interface.interfaceType && 'playwright' !== this.interface.interfaceType && 'static' !== this.interface.interfaceType && 'chrome-extension-proxy' !== this.interface.interfaceType && 'page-over-chrome-extension-bridge' !== this.interface.interfaceType) {
            this.modelConfigManager.throwErrorIfNonVLModel();
            this.hasWarnedNonVLModel = true;
        }
    }
    async getScreenshotScale(context) {
        if (void 0 !== this.screenshotScale) return this.screenshotScale;
        if (!this.screenshotScalePromise) this.screenshotScalePromise = (async ()=>{
            var _context_size;
            const pageWidth = null == (_context_size = context.size) ? void 0 : _context_size.width;
            assert(pageWidth && pageWidth > 0, `Invalid page width when computing screenshot scale: ${pageWidth}`);
            const { width: screenshotWidth } = await imageInfoOfBase64(context.screenshotBase64);
            assert(Number.isFinite(screenshotWidth) && screenshotWidth > 0, `Invalid screenshot width when computing screenshot scale: ${screenshotWidth}`);
            const computedScale = screenshotWidth / pageWidth;
            assert(Number.isFinite(computedScale) && computedScale > 0, `Invalid computed screenshot scale: ${computedScale}`);
            debug(`Computed screenshot scale ${computedScale} from screenshot width ${screenshotWidth} and page width ${pageWidth}`);
            return computedScale;
        })();
        try {
            this.screenshotScale = await this.screenshotScalePromise;
            return this.screenshotScale;
        } finally{
            this.screenshotScalePromise = void 0;
        }
    }
    async getActionSpace() {
        return this.interface.actionSpace();
    }
    async getUIContext(action) {
        this.ensureVLModelWarning();
        if (this.frozenUIContext) {
            debug('Using frozen page context for action:', action);
            return this.frozenUIContext;
        }
        let context;
        if (this.interface.getContext) {
            debug('Using page.getContext for action:', action);
            context = await this.interface.getContext();
        } else {
            debug('Using commonContextParser for action:', action);
            context = await commonContextParser(this.interface, {
                uploadServerUrl: this.modelConfigManager.getUploadTestServerUrl()
            });
        }
        const computedScreenshotScale = await this.getScreenshotScale(context);
        if (1 !== computedScreenshotScale) {
            const scaleForLog = Number.parseFloat(computedScreenshotScale.toFixed(4));
            debug(`Applying computed screenshot scale: ${scaleForLog} (resize to logical size)`);
            const targetWidth = Math.round(context.size.width);
            const targetHeight = Math.round(context.size.height);
            debug(`Resizing screenshot to ${targetWidth}x${targetHeight}`);
            context.screenshotBase64 = await resizeImgBase64(context.screenshotBase64, {
                width: targetWidth,
                height: targetHeight
            });
        } else debug(`screenshot scale=${computedScreenshotScale}`);
        return context;
    }
    async _snapshotContext() {
        return await this.getUIContext('locate');
    }
    async setAIActionContext(prompt) {
        if (this.opts.aiActionContext) console.warn('aiActionContext is already set, and it is called again, will override the previous setting');
        this.opts.aiActionContext = prompt;
    }
    resetDump() {
        this.dump = {
            sdkVersion: getVersion(),
            groupName: this.opts.groupName,
            groupDescription: this.opts.groupDescription,
            executions: [],
            modelBriefs: []
        };
        return this.dump;
    }
    appendExecutionDump(execution) {
        const trimmedExecution = trimContextByViewport(execution);
        const currentDump = this.dump;
        currentDump.executions.push(trimmedExecution);
    }
    dumpDataString() {
        this.dump.groupName = this.opts.groupName;
        this.dump.groupDescription = this.opts.groupDescription;
        return stringifyDumpData(this.dump);
    }
    reportHTMLString() {
        return reportHTMLContent(this.dumpDataString());
    }
    writeOutActionDumps() {
        if (this.destroyed) throw new Error('PageAgent has been destroyed. Cannot update report file.');
        const { generateReport, autoPrintReportMsg } = this.opts;
        this.reportFile = writeLogFile({
            fileName: this.reportFileName,
            fileExt: groupedActionDumpFileExt,
            fileContent: this.dumpDataString(),
            type: 'dump',
            generateReport
        });
        debug('writeOutActionDumps', this.reportFile);
        if (generateReport && autoPrintReportMsg && this.reportFile) printReportMsg(this.reportFile);
    }
    async callbackOnTaskStartTip(task) {
        const param = paramStr(task);
        const tip = param ? `${typeStr(task)} - ${param}` : typeStr(task);
        if (this.onTaskStartTip) await this.onTaskStartTip(tip);
    }
    async afterTaskRunning(executor, doNotThrowError = false) {
        const executionDump = executor.dump();
        if (this.opts.aiActionContext) executionDump.aiActionContext = this.opts.aiActionContext;
        this.appendExecutionDump(executionDump);
        try {
            if (this.onDumpUpdate) this.onDumpUpdate(this.dumpDataString());
        } catch (error) {
            console.error('Error in onDumpUpdate', error);
        }
        this.writeOutActionDumps();
        if (executor.isInErrorState() && !doNotThrowError) {
            const errorTask = executor.latestErrorTask();
            throw new Error(`${null == errorTask ? void 0 : errorTask.errorMessage}\n${null == errorTask ? void 0 : errorTask.errorStack}`, {
                cause: null == errorTask ? void 0 : errorTask.error
            });
        }
    }
    async callActionInActionSpace(type, opt) {
        debug('callActionInActionSpace', type, ',', opt);
        const actionPlan = {
            type: type,
            param: opt || {},
            thought: ''
        };
        debug('actionPlan', actionPlan);
        const plans = [
            actionPlan
        ].filter(Boolean);
        const title = taskTitleStr(type, locateParamStr((null == opt ? void 0 : opt.locate) || {}));
        const modelConfig = this.modelConfigManager.getModelConfig('grounding');
        const { output, executor } = await this.taskExecutor.runPlans(title, plans, modelConfig);
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiTap(locatePrompt, opt) {
        assert(locatePrompt, 'missing locate prompt for tap');
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
        return this.callActionInActionSpace('Tap', {
            locate: detailedLocateParam
        });
    }
    async aiRightClick(locatePrompt, opt) {
        assert(locatePrompt, 'missing locate prompt for right click');
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
        return this.callActionInActionSpace('RightClick', {
            locate: detailedLocateParam
        });
    }
    async aiDoubleClick(locatePrompt, opt) {
        assert(locatePrompt, 'missing locate prompt for double click');
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
        return this.callActionInActionSpace('DoubleClick', {
            locate: detailedLocateParam
        });
    }
    async aiHover(locatePrompt, opt) {
        assert(locatePrompt, 'missing locate prompt for hover');
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
        return this.callActionInActionSpace('Hover', {
            locate: detailedLocateParam
        });
    }
    async aiInput(locatePromptOrValue, locatePromptOrOpt, optOrUndefined) {
        let value;
        let locatePrompt;
        let opt;
        if ('object' == typeof locatePromptOrOpt && null !== locatePromptOrOpt && 'value' in locatePromptOrOpt) {
            locatePrompt = locatePromptOrValue;
            const optWithValue = locatePromptOrOpt;
            value = optWithValue.value;
            opt = optWithValue;
        } else {
            value = locatePromptOrValue;
            locatePrompt = locatePromptOrOpt;
            opt = {
                ...optOrUndefined,
                value
            };
        }
        assert('string' == typeof value || 'number' == typeof value, 'input value must be a string or number, use empty string if you want to clear the input');
        assert(locatePrompt, 'missing locate prompt for input');
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
        return this.callActionInActionSpace('Input', {
            ...opt || {},
            locate: detailedLocateParam
        });
    }
    async aiKeyboardPress(locatePromptOrKeyName, locatePromptOrOpt, optOrUndefined) {
        let keyName;
        let locatePrompt;
        let opt;
        if ('object' == typeof locatePromptOrOpt && null !== locatePromptOrOpt && 'keyName' in locatePromptOrOpt) {
            locatePrompt = locatePromptOrKeyName;
            opt = locatePromptOrOpt;
        } else {
            keyName = locatePromptOrKeyName;
            locatePrompt = locatePromptOrOpt;
            opt = {
                ...optOrUndefined || {},
                keyName
            };
        }
        assert(null == opt ? void 0 : opt.keyName, 'missing keyName for keyboard press');
        const detailedLocateParam = locatePrompt ? buildDetailedLocateParam(locatePrompt, opt) : void 0;
        return this.callActionInActionSpace('KeyboardPress', {
            ...opt || {},
            locate: detailedLocateParam
        });
    }
    async aiScroll(locatePromptOrScrollParam, locatePromptOrOpt, optOrUndefined) {
        let scrollParam;
        let locatePrompt;
        let opt;
        if ('object' == typeof locatePromptOrOpt && ('direction' in locatePromptOrOpt || 'scrollType' in locatePromptOrOpt || 'distance' in locatePromptOrOpt)) {
            locatePrompt = locatePromptOrScrollParam;
            opt = locatePromptOrOpt;
        } else {
            scrollParam = locatePromptOrScrollParam;
            locatePrompt = locatePromptOrOpt;
            opt = {
                ...optOrUndefined || {},
                ...scrollParam || {}
            };
        }
        const detailedLocateParam = buildDetailedLocateParam(locatePrompt || '', opt);
        return this.callActionInActionSpace('Scroll', {
            ...opt || {},
            locate: detailedLocateParam
        });
    }
    async aiAction(taskPrompt, opt) {
        var _this_taskCache, _this_taskCache1;
        const modelConfig = this.modelConfigManager.getModelConfig('planning');
        const cacheable = null == opt ? void 0 : opt.cacheable;
        const isVlmUiTars = 'vlm-ui-tars' === modelConfig.vlMode;
        const matchedCache = isVlmUiTars || false === cacheable ? void 0 : null == (_this_taskCache = this.taskCache) ? void 0 : _this_taskCache.matchPlanCache(taskPrompt);
        if (matchedCache && (null == (_this_taskCache1 = this.taskCache) ? void 0 : _this_taskCache1.isCacheResultUsed)) {
            var _matchedCache_cacheContent, _matchedCache_cacheContent1;
            const { executor } = await this.taskExecutor.loadYamlFlowAsPlanning(taskPrompt, null == (_matchedCache_cacheContent = matchedCache.cacheContent) ? void 0 : _matchedCache_cacheContent.yamlWorkflow);
            await this.afterTaskRunning(executor);
            debug('matched cache, will call .runYaml to run the action');
            const yaml = null == (_matchedCache_cacheContent1 = matchedCache.cacheContent) ? void 0 : _matchedCache_cacheContent1.yamlWorkflow;
            return this.runYaml(yaml);
        }
        const { output, executor } = await this.taskExecutor.action(taskPrompt, modelConfig, this.opts.aiActionContext, cacheable);
        if (this.taskCache && (null == output ? void 0 : output.yamlFlow) && false !== cacheable) {
            const yamlContent = {
                tasks: [
                    {
                        name: taskPrompt,
                        flow: output.yamlFlow
                    }
                ]
            };
            const yamlFlowStr = js_yaml.dump(yamlContent);
            this.taskCache.updateOrAppendCacheRecord({
                type: 'plan',
                prompt: taskPrompt,
                yamlWorkflow: yamlFlowStr
            }, matchedCache);
        }
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiQuery(demand, opt = defaultInsightExtractOption) {
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const { output, executor } = await this.taskExecutor.createTypeQueryExecution('Query', demand, modelConfig, opt);
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiBoolean(prompt, opt = defaultInsightExtractOption) {
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const { textPrompt, multimodalPrompt } = parsePrompt(prompt);
        const { output, executor } = await this.taskExecutor.createTypeQueryExecution('Boolean', textPrompt, modelConfig, opt, multimodalPrompt);
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiNumber(prompt, opt = defaultInsightExtractOption) {
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const { textPrompt, multimodalPrompt } = parsePrompt(prompt);
        const { output, executor } = await this.taskExecutor.createTypeQueryExecution('Number', textPrompt, modelConfig, opt, multimodalPrompt);
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiString(prompt, opt = defaultInsightExtractOption) {
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const { textPrompt, multimodalPrompt } = parsePrompt(prompt);
        const { output, executor } = await this.taskExecutor.createTypeQueryExecution('String', textPrompt, modelConfig, opt, multimodalPrompt);
        await this.afterTaskRunning(executor);
        return output;
    }
    async aiAsk(prompt, opt = defaultInsightExtractOption) {
        return this.aiString(prompt, opt);
    }
    async describeElementAtPoint(center, opt) {
        const { verifyPrompt = true, retryLimit = 3 } = opt || {};
        let success = false;
        let retryCount = 0;
        let resultPrompt = '';
        let deepThink = (null == opt ? void 0 : opt.deepThink) || false;
        let verifyResult;
        while(!success && retryCount < retryLimit){
            if (retryCount >= 2) deepThink = true;
            debug('aiDescribe', center, 'verifyPrompt', verifyPrompt, 'retryCount', retryCount, 'deepThink', deepThink);
            const modelConfig = this.modelConfigManager.getModelConfig('grounding');
            const text = await this.insight.describe(center, modelConfig, {
                deepThink
            });
            debug('aiDescribe text', text);
            assert(text.description, `failed to describe element at [${center}]`);
            resultPrompt = text.description;
            verifyResult = await this.verifyLocator(resultPrompt, deepThink ? {
                deepThink: true
            } : void 0, center, opt);
            if (verifyResult.pass) success = true;
            else retryCount++;
        }
        return {
            prompt: resultPrompt,
            deepThink,
            verifyResult
        };
    }
    async verifyLocator(prompt, locateOpt, expectCenter, verifyLocateOption) {
        debug('verifyLocator', prompt, locateOpt, expectCenter, verifyLocateOption);
        const { center: verifyCenter, rect: verifyRect } = await this.aiLocate(prompt, locateOpt);
        const distance = distanceOfTwoPoints(expectCenter, verifyCenter);
        const included = includedInRect(expectCenter, verifyRect);
        const pass = distance <= ((null == verifyLocateOption ? void 0 : verifyLocateOption.centerDistanceThreshold) || 20) || included;
        const verifyResult = {
            pass,
            rect: verifyRect,
            center: verifyCenter,
            centerDistance: distance
        };
        debug('aiDescribe verifyResult', verifyResult);
        return verifyResult;
    }
    async aiLocate(prompt, opt) {
        const locateParam = buildDetailedLocateParam(prompt, opt);
        assert(locateParam, 'cannot get locate param for aiLocate');
        const locatePlan = locatePlanForLocate(locateParam);
        const plans = [
            locatePlan
        ];
        const modelConfig = this.modelConfigManager.getModelConfig('grounding');
        const { executor, output } = await this.taskExecutor.runPlans(taskTitleStr('Locate', locateParamStr(locateParam)), plans, modelConfig);
        await this.afterTaskRunning(executor);
        const { element } = output;
        const dprValue = await this.interface.size().dpr;
        const dprEntry = dprValue ? {
            dpr: dprValue
        } : {};
        return {
            rect: null == element ? void 0 : element.rect,
            center: null == element ? void 0 : element.center,
            ...dprEntry
        };
    }
    async aiAssert(assertion, msg, opt) {
        var _executor_latestErrorTask;
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const insightOpt = {
            domIncluded: (null == opt ? void 0 : opt.domIncluded) ?? defaultInsightExtractOption.domIncluded,
            screenshotIncluded: (null == opt ? void 0 : opt.screenshotIncluded) ?? defaultInsightExtractOption.screenshotIncluded,
            doNotThrowError: null == opt ? void 0 : opt.doNotThrowError
        };
        const { textPrompt, multimodalPrompt } = parsePrompt(assertion);
        const { output, executor, thought } = await this.taskExecutor.createTypeQueryExecution('Assert', textPrompt, modelConfig, insightOpt, multimodalPrompt);
        await this.afterTaskRunning(executor, true);
        const message = output ? void 0 : `Assertion failed: ${msg || ('string' == typeof assertion ? assertion : assertion.prompt)}\nReason: ${thought || (null == (_executor_latestErrorTask = executor.latestErrorTask()) ? void 0 : _executor_latestErrorTask.error) || '(no_reason)'}`;
        if (null == opt ? void 0 : opt.keepRawResponse) return {
            pass: output,
            thought,
            message
        };
        if (!output) throw new Error(message);
    }
    async aiWaitFor(assertion, opt) {
        const modelConfig = this.modelConfigManager.getModelConfig('VQA');
        const { executor } = await this.taskExecutor.waitFor(assertion, {
            timeoutMs: (null == opt ? void 0 : opt.timeoutMs) || 15000,
            checkIntervalMs: (null == opt ? void 0 : opt.checkIntervalMs) || 3000
        }, modelConfig);
        await this.afterTaskRunning(executor, true);
        if (executor.isInErrorState()) {
            const errorTask = executor.latestErrorTask();
            throw new Error(`${null == errorTask ? void 0 : errorTask.error}\n${null == errorTask ? void 0 : errorTask.errorStack}`);
        }
    }
    async ai(taskPrompt, type = 'action') {
        if ('action' === type) return this.aiAction(taskPrompt);
        if ('query' === type) return this.aiQuery(taskPrompt);
        if ('assert' === type) return this.aiAssert(taskPrompt);
        if ('tap' === type) return this.aiTap(taskPrompt);
        if ('rightClick' === type) return this.aiRightClick(taskPrompt);
        if ('doubleClick' === type) return this.aiDoubleClick(taskPrompt);
        throw new Error(`Unknown type: ${type}, only support 'action', 'query', 'assert', 'tap', 'rightClick', 'doubleClick'`);
    }
    async runYaml(yamlScriptContent) {
        const script = parseYamlScript(yamlScriptContent, 'yaml');
        const player = new ScriptPlayer(script, async ()=>({
                agent: this,
                freeFn: []
            }));
        await player.run();
        if ('error' === player.status) {
            const errors = player.taskStatusList.filter((task)=>'error' === task.status).map((task)=>{
                var _task_error;
                return `task - ${task.name}: ${null == (_task_error = task.error) ? void 0 : _task_error.message}`;
            }).join('\n');
            throw new Error(`Error(s) occurred in running yaml script:\n${errors}`);
        }
        return {
            result: player.result
        };
    }
    async evaluateJavaScript(script) {
        assert(this.interface.evaluateJavaScript, 'evaluateJavaScript is not supported in current agent');
        return this.interface.evaluateJavaScript(script);
    }
    async destroy() {
        var _this_interface_destroy, _this_interface;
        if (this.destroyed) return;
        await (null == (_this_interface_destroy = (_this_interface = this.interface).destroy) ? void 0 : _this_interface_destroy.call(_this_interface));
        this.resetDump();
        this.destroyed = true;
    }
    async logScreenshot(title, opt) {
        const base64 = await this.interface.screenshotBase64();
        const now = Date.now();
        const recorder = [
            {
                type: 'screenshot',
                ts: now,
                screenshot: base64
            }
        ];
        const task = {
            type: 'Log',
            subType: 'Screenshot',
            status: 'finished',
            recorder,
            timing: {
                start: now,
                end: now,
                cost: 0
            },
            param: {
                content: (null == opt ? void 0 : opt.content) || ''
            },
            executor: async ()=>{}
        };
        const executionDump = {
            logTime: now,
            name: `Log - ${title || 'untitled'}`,
            description: (null == opt ? void 0 : opt.content) || '',
            tasks: [
                task
            ]
        };
        if (this.opts.aiActionContext) executionDump.aiActionContext = this.opts.aiActionContext;
        this.appendExecutionDump(executionDump);
        try {
            var _this_onDumpUpdate, _this;
            null == (_this_onDumpUpdate = (_this = this).onDumpUpdate) || _this_onDumpUpdate.call(_this, this.dumpDataString());
        } catch (error) {
            console.error('Failed to update dump', error);
        }
        this.writeOutActionDumps();
    }
    _unstableLogContent() {
        const { groupName, groupDescription, executions } = this.dump;
        const newExecutions = Array.isArray(executions) ? executions.map((execution)=>{
            const { tasks, ...restExecution } = execution;
            let newTasks = tasks;
            if (Array.isArray(tasks)) newTasks = tasks.map((task)=>{
                const { uiContext, log, ...restTask } = task;
                return restTask;
            });
            return {
                ...restExecution,
                ...newTasks ? {
                    tasks: newTasks
                } : {}
            };
        }) : [];
        return {
            groupName,
            groupDescription,
            executions: newExecutions
        };
    }
    async freezePageContext() {
        debug('Freezing page context');
        const context = await this._snapshotContext();
        context._isFrozen = true;
        this.frozenUIContext = context;
        debug('Page context frozen successfully');
    }
    async unfreezePageContext() {
        debug('Unfreezing page context');
        this.frozenUIContext = void 0;
        debug('Page context unfrozen successfully');
    }
    processCacheConfig(opts) {
        if (true === opts.cache) throw new Error('cache: true requires an explicit cache ID. Please provide:\nExample: cache: { id: "my-cache-id" }');
        if (opts.cache && 'object' == typeof opts.cache && null !== opts.cache && !opts.cache.id) throw new Error('cache configuration requires an explicit id.\nExample: cache: { id: "my-cache-id" }');
        const cacheConfig = processCacheConfig(opts.cache, opts.cacheId || opts.testId || 'default');
        if (!cacheConfig) return null;
        if ('object' == typeof cacheConfig && null !== cacheConfig) {
            const id = cacheConfig.id;
            const rawStrategy = cacheConfig.strategy;
            let strategyValue;
            if (void 0 === rawStrategy) strategyValue = 'read-write';
            else if ('string' == typeof rawStrategy) strategyValue = rawStrategy;
            else throw new Error(`cache.strategy must be a string when provided, but received type ${typeof rawStrategy}`);
            if (!isValidCacheStrategy(strategyValue)) throw new Error(`cache.strategy must be one of ${CACHE_STRATEGY_VALUES}, but received "${strategyValue}"`);
            const isReadOnly = 'read-only' === strategyValue;
            const isWriteOnly = 'write-only' === strategyValue;
            return {
                id,
                enabled: !isWriteOnly,
                readOnly: isReadOnly,
                writeOnly: isWriteOnly
            };
        }
        return null;
    }
    async flushCache(options) {
        if (!this.taskCache) throw new Error('Cache is not configured');
        this.taskCache.flushCacheToFile(options);
    }
    constructor(interfaceInstance, opts){
        _define_property(this, "interface", void 0);
        _define_property(this, "insight", void 0);
        _define_property(this, "dump", void 0);
        _define_property(this, "reportFile", void 0);
        _define_property(this, "reportFileName", void 0);
        _define_property(this, "taskExecutor", void 0);
        _define_property(this, "opts", void 0);
        _define_property(this, "dryMode", false);
        _define_property(this, "onTaskStartTip", void 0);
        _define_property(this, "taskCache", void 0);
        _define_property(this, "onDumpUpdate", void 0);
        _define_property(this, "destroyed", false);
        _define_property(this, "modelConfigManager", void 0);
        _define_property(this, "frozenUIContext", void 0);
        _define_property(this, "hasWarnedNonVLModel", false);
        _define_property(this, "screenshotScale", void 0);
        _define_property(this, "screenshotScalePromise", void 0);
        this.interface = interfaceInstance;
        this.opts = Object.assign({
            generateReport: true,
            autoPrintReportMsg: true,
            groupName: 'SQAI Report',
            groupDescription: ''
        }, opts || {});
        if ((null == opts ? void 0 : opts.modelConfig) && 'function' != typeof (null == opts ? void 0 : opts.modelConfig)) throw new Error(`opts.modelConfig must be one of function or undefined, but got ${typeof (null == opts ? void 0 : opts.modelConfig)}`);
        this.modelConfigManager = (null == opts ? void 0 : opts.modelConfig) ? new ModelConfigManager(opts.modelConfig) : globalModelConfigManager;
        this.onTaskStartTip = this.opts.onTaskStartTip;
        this.insight = new Insight(async (action)=>this.getUIContext(action));
        const cacheConfigObj = this.processCacheConfig(opts || {});
        if (cacheConfigObj) this.taskCache = new TaskCache(cacheConfigObj.id, cacheConfigObj.enabled, void 0, {
            readOnly: cacheConfigObj.readOnly,
            writeOnly: cacheConfigObj.writeOnly
        });
        this.taskExecutor = new TaskExecutor(this.interface, this.insight, {
            taskCache: this.taskCache,
            onTaskStart: this.callbackOnTaskStartTip.bind(this),
            replanningCycleLimit: this.opts.replanningCycleLimit
        });
        this.dump = this.resetDump();
        this.reportFileName = (null == opts ? void 0 : opts.reportFileName) || getReportFileName((null == opts ? void 0 : opts.testId) || this.interface.interfaceType || 'web');
    }
}
const createAgent = (interfaceInstance, opts)=>new Agent(interfaceInstance, opts);
export { Agent, createAgent };

//# sourceMappingURL=agent.mjs.map