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
    ScriptPlayer: ()=>ScriptPlayer
});
const external_node_fs_namespaceObject = require("node:fs");
const external_node_path_namespaceObject = require("node:path");
const utils_namespaceObject = require("@sqai/shared/utils");
const common_namespaceObject = require("@sqai/shared/common");
const logger_namespaceObject = require("@sqai/shared/logger");
const external_utils_js_namespaceObject = require("./utils.js");
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
const debug = (0, logger_namespaceObject.getDebug)('yaml-player');
class ScriptPlayer {
    setResult(key, value) {
        const keyToUse = key || this.unnamedResultIndex++;
        if (this.result[keyToUse]) console.warn(`result key ${keyToUse} already exists, will overwrite`);
        this.result[keyToUse] = value;
        return this.flushResult();
    }
    setPlayerStatus(status, error) {
        this.status = status;
        this.errorInSetup = error;
    }
    notifyCurrentTaskStatusChange(taskIndex) {
        const taskIndexToNotify = 'number' == typeof taskIndex ? taskIndex : this.currentTaskIndex;
        if ('number' != typeof taskIndexToNotify) return;
        const taskStatus = this.taskStatusList[taskIndexToNotify];
        if (this.onTaskStatusChange) this.onTaskStatusChange(taskStatus);
    }
    async setTaskStatus(index, statusValue, error) {
        this.taskStatusList[index].status = statusValue;
        if (error) this.taskStatusList[index].error = error;
        this.notifyCurrentTaskStatusChange(index);
    }
    setTaskIndex(taskIndex) {
        this.currentTaskIndex = taskIndex;
    }
    flushResult() {
        if (this.output) {
            const output = (0, external_node_path_namespaceObject.resolve)(process.cwd(), this.output);
            const outputDir = (0, external_node_path_namespaceObject.dirname)(output);
            if (!(0, external_node_fs_namespaceObject.existsSync)(outputDir)) (0, external_node_fs_namespaceObject.mkdirSync)(outputDir, {
                recursive: true
            });
            (0, external_node_fs_namespaceObject.writeFileSync)(output, JSON.stringify(this.result || {}, void 0, 2));
        }
    }
    flushUnstableLogContent() {
        if (this.unstableLogContent) {
            var _this_interfaceAgent;
            const content = null == (_this_interfaceAgent = this.interfaceAgent) ? void 0 : _this_interfaceAgent._unstableLogContent();
            const filePath = (0, external_node_path_namespaceObject.resolve)(process.cwd(), this.unstableLogContent);
            const outputDir = (0, external_node_path_namespaceObject.dirname)(filePath);
            if (!(0, external_node_fs_namespaceObject.existsSync)(outputDir)) (0, external_node_fs_namespaceObject.mkdirSync)(outputDir, {
                recursive: true
            });
            (0, external_node_fs_namespaceObject.writeFileSync)(filePath, JSON.stringify(content, null, 2));
        }
    }
    async playTask(taskStatus, agent) {
        const { flow } = taskStatus;
        (0, utils_namespaceObject.assert)(flow, 'missing flow in task');
        for(const flowItemIndex in flow){
            const currentStep = Number.parseInt(flowItemIndex, 10);
            taskStatus.currentStep = currentStep;
            const flowItem = flow[flowItemIndex];
            debug(`playing step ${flowItemIndex}, flowItem=${JSON.stringify(flowItem)}`);
            if ('aiAction' in flowItem || 'ai' in flowItem) {
                const actionTask = flowItem;
                const prompt = actionTask.aiAction || actionTask.ai;
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for ai (aiAction)');
                await agent.aiAction(prompt, {
                    cacheable: actionTask.cacheable
                });
            } else if ('aiAssert' in flowItem) {
                const assertTask = flowItem;
                const prompt = assertTask.aiAssert;
                const msg = assertTask.errorMessage;
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiAssert');
                const { pass, thought, message } = await agent.aiAssert(prompt, msg, {
                    keepRawResponse: true
                }) || {};
                this.setResult(assertTask.name, {
                    pass,
                    thought,
                    message
                });
                if (!pass) throw new Error(message);
            } else if ('aiQuery' in flowItem) {
                const queryTask = flowItem;
                const prompt = queryTask.aiQuery;
                const options = {
                    domIncluded: queryTask.domIncluded,
                    screenshotIncluded: queryTask.screenshotIncluded
                };
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiQuery');
                const queryResult = await agent.aiQuery(prompt, options);
                this.setResult(queryTask.name, queryResult);
            } else if ('aiNumber' in flowItem) {
                const numberTask = flowItem;
                const prompt = numberTask.aiNumber;
                const options = {
                    domIncluded: numberTask.domIncluded,
                    screenshotIncluded: numberTask.screenshotIncluded
                };
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiNumber');
                const numberResult = await agent.aiNumber(prompt, options);
                this.setResult(numberTask.name, numberResult);
            } else if ('aiString' in flowItem) {
                const stringTask = flowItem;
                const prompt = stringTask.aiString;
                const options = {
                    domIncluded: stringTask.domIncluded,
                    screenshotIncluded: stringTask.screenshotIncluded
                };
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiString');
                const stringResult = await agent.aiString(prompt, options);
                this.setResult(stringTask.name, stringResult);
            } else if ('aiBoolean' in flowItem) {
                const booleanTask = flowItem;
                const prompt = booleanTask.aiBoolean;
                const options = {
                    domIncluded: booleanTask.domIncluded,
                    screenshotIncluded: booleanTask.screenshotIncluded
                };
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiBoolean');
                const booleanResult = await agent.aiBoolean(prompt, options);
                this.setResult(booleanTask.name, booleanResult);
            } else if ('aiAsk' in flowItem) {
                const askTask = flowItem;
                const prompt = askTask.aiAsk;
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiAsk');
                const askResult = await agent.aiAsk(prompt);
                this.setResult(askTask.name, askResult);
            } else if ('aiLocate' in flowItem) {
                const locateTask = flowItem;
                const prompt = locateTask.aiLocate;
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiLocate');
                const locateResult = await agent.aiLocate(prompt, locateTask);
                this.setResult(locateTask.name, locateResult);
            } else if ('aiWaitFor' in flowItem) {
                const waitForTask = flowItem;
                const prompt = waitForTask.aiWaitFor;
                (0, utils_namespaceObject.assert)(prompt, 'missing prompt for aiWaitFor');
                const timeout = waitForTask.timeout;
                await agent.aiWaitFor(prompt, {
                    timeoutMs: timeout
                });
            } else if ('sleep' in flowItem) {
                const sleepTask = flowItem;
                const ms = sleepTask.sleep;
                let msNumber = ms;
                if ('string' == typeof ms) msNumber = Number.parseInt(ms, 10);
                (0, utils_namespaceObject.assert)(msNumber && msNumber > 0, `ms for sleep must be greater than 0, but got ${ms}`);
                await new Promise((resolve)=>setTimeout(resolve, msNumber));
            } else if ("javascript" in flowItem) {
                const evaluateJavaScriptTask = flowItem;
                const result = await agent.evaluateJavaScript(evaluateJavaScriptTask.javascript);
                this.setResult(evaluateJavaScriptTask.name, result);
            } else if ('logScreenshot' in flowItem) {
                const logScreenshotTask = flowItem;
                await agent.logScreenshot(logScreenshotTask.logScreenshot, {
                    content: logScreenshotTask.content || ''
                });
            } else if ('aiInput' in flowItem) {
                const { aiInput, ...inputTask } = flowItem;
                let locatePrompt;
                let value;
                if (inputTask.locate) {
                    value = aiInput || inputTask.value;
                    locatePrompt = inputTask.locate;
                } else {
                    locatePrompt = aiInput || '';
                    value = inputTask.value;
                }
                await agent.callActionInActionSpace('Input', {
                    ...inputTask,
                    ...void 0 !== value ? {
                        value: String(value)
                    } : {},
                    ...locatePrompt ? {
                        locate: (0, external_utils_js_namespaceObject.buildDetailedLocateParam)(locatePrompt, inputTask)
                    } : {}
                });
            } else if ('aiKeyboardPress' in flowItem) {
                const { aiKeyboardPress, ...keyboardPressTask } = flowItem;
                let locatePrompt;
                let keyName;
                if (keyboardPressTask.locate) {
                    keyName = aiKeyboardPress;
                    locatePrompt = keyboardPressTask.locate;
                } else if (keyboardPressTask.keyName) {
                    keyName = keyboardPressTask.keyName;
                    locatePrompt = aiKeyboardPress;
                } else keyName = aiKeyboardPress;
                await agent.callActionInActionSpace('KeyboardPress', {
                    ...keyboardPressTask,
                    ...keyName ? {
                        keyName
                    } : {},
                    ...locatePrompt ? {
                        locate: (0, external_utils_js_namespaceObject.buildDetailedLocateParam)(locatePrompt, keyboardPressTask)
                    } : {}
                });
            } else if ('aiScroll' in flowItem) {
                const { aiScroll, ...scrollTask } = flowItem;
                let locatePrompt;
                locatePrompt = scrollTask.locate ? scrollTask.locate : aiScroll;
                await agent.callActionInActionSpace('Scroll', {
                    ...scrollTask,
                    ...locatePrompt ? {
                        locate: (0, external_utils_js_namespaceObject.buildDetailedLocateParam)(locatePrompt, scrollTask)
                    } : {}
                });
            } else {
                const actionSpace = this.actionSpace;
                let locatePromptShortcut;
                const matchedAction = actionSpace.find((action)=>{
                    const actionInterfaceAlias = action.interfaceAlias;
                    if (actionInterfaceAlias && Object.prototype.hasOwnProperty.call(flowItem, actionInterfaceAlias)) {
                        locatePromptShortcut = flowItem[actionInterfaceAlias];
                        return true;
                    }
                    const keyOfActionInActionSpace = action.name;
                    if (Object.prototype.hasOwnProperty.call(flowItem, keyOfActionInActionSpace)) {
                        locatePromptShortcut = flowItem[keyOfActionInActionSpace];
                        return true;
                    }
                    return false;
                });
                (0, utils_namespaceObject.assert)(matchedAction, `unknown flowItem in yaml: ${JSON.stringify(flowItem)}`);
                (0, utils_namespaceObject.assert)(!(flowItem.prompt && locatePromptShortcut), `conflict locate prompt for item: ${JSON.stringify(flowItem)}`);
                if (locatePromptShortcut) flowItem.prompt = locatePromptShortcut;
                const { locateParam, restParams } = (0, external_utils_js_namespaceObject.buildDetailedLocateParamAndRestParams)(locatePromptShortcut || '', flowItem, [
                    matchedAction.name,
                    matchedAction.interfaceAlias || '_never_mind_'
                ]);
                const flowParams = {
                    ...restParams,
                    locate: locateParam
                };
                debug(`matchedAction: ${matchedAction.name}`, `flowParams: ${JSON.stringify(flowParams, null, 2)}`);
                await agent.callActionInActionSpace(matchedAction.name, flowParams);
            }
        }
        this.reportFile = agent.reportFile;
        await this.flushUnstableLogContent();
    }
    async run() {
        const { target, web, android, ios, tasks } = this.script;
        const webEnv = web || target;
        const androidEnv = android;
        const iosEnv = ios;
        const platform = webEnv || androidEnv || iosEnv;
        this.setPlayerStatus('running');
        let agent = null;
        let freeFn = [];
        try {
            const { agent: newAgent, freeFn: newFreeFn } = await this.setupAgent(platform);
            this.actionSpace = await newAgent.getActionSpace();
            agent = newAgent;
            const originalOnTaskStartTip = agent.onTaskStartTip;
            agent.onTaskStartTip = (tip)=>{
                if ('running' === this.status) this.agentStatusTip = tip;
                null == originalOnTaskStartTip || originalOnTaskStartTip(tip);
            };
            freeFn = [
                ...newFreeFn || [],
                {
                    name: 'restore-agent-onTaskStartTip',
                    fn: ()=>{
                        if (agent) agent.onTaskStartTip = originalOnTaskStartTip;
                    }
                }
            ];
        } catch (e) {
            this.setPlayerStatus('error', e);
            return;
        }
        this.interfaceAgent = agent;
        let taskIndex = 0;
        this.setPlayerStatus('running');
        let errorFlag = false;
        while(taskIndex < tasks.length){
            const taskStatus = this.taskStatusList[taskIndex];
            this.setTaskStatus(taskIndex, 'running');
            this.setTaskIndex(taskIndex);
            try {
                await this.playTask(taskStatus, this.interfaceAgent);
                this.setTaskStatus(taskIndex, 'done');
            } catch (e) {
                this.setTaskStatus(taskIndex, 'error', e);
                if (taskStatus.continueOnError) ;
                else {
                    this.reportFile = agent.reportFile;
                    errorFlag = true;
                    break;
                }
            }
            this.reportFile = null == agent ? void 0 : agent.reportFile;
            taskIndex++;
        }
        if (errorFlag) this.setPlayerStatus('error');
        else this.setPlayerStatus('done');
        this.agentStatusTip = '';
        for (const fn of freeFn)try {
            await fn.fn();
        } catch (e) {}
    }
    constructor(script, setupAgent, onTaskStatusChange, scriptPath){
        var _this_target, _this_target1, _this_target2;
        _define_property(this, "script", void 0);
        _define_property(this, "setupAgent", void 0);
        _define_property(this, "onTaskStatusChange", void 0);
        _define_property(this, "currentTaskIndex", void 0);
        _define_property(this, "taskStatusList", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "reportFile", void 0);
        _define_property(this, "result", void 0);
        _define_property(this, "unnamedResultIndex", void 0);
        _define_property(this, "output", void 0);
        _define_property(this, "unstableLogContent", void 0);
        _define_property(this, "errorInSetup", void 0);
        _define_property(this, "interfaceAgent", void 0);
        _define_property(this, "agentStatusTip", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "actionSpace", void 0);
        _define_property(this, "scriptPath", void 0);
        this.script = script;
        this.setupAgent = setupAgent;
        this.onTaskStatusChange = onTaskStatusChange;
        this.taskStatusList = [];
        this.status = 'init';
        this.unnamedResultIndex = 0;
        this.interfaceAgent = null;
        this.actionSpace = [];
        this.scriptPath = scriptPath;
        this.result = {};
        this.target = script.target || script.web || script.android || script.ios || script.config;
        if (utils_namespaceObject.ifInBrowser || utils_namespaceObject.ifInWorker) {
            this.output = void 0;
            debug('output is undefined in browser or worker');
        } else if (null == (_this_target = this.target) ? void 0 : _this_target.output) {
            this.output = (0, external_node_path_namespaceObject.resolve)(process.cwd(), this.target.output);
            debug('setting output by config.output', this.output);
        } else {
            const scriptName = this.scriptPath ? (0, external_node_path_namespaceObject.basename)(this.scriptPath, '.yaml').replace(/\.(ya?ml)$/i, '') : "script";
            this.output = (0, external_node_path_namespaceObject.join)((0, common_namespaceObject.getMidsceneRunSubDir)('output'), `${scriptName}-${Date.now()}.json`);
            debug("setting output by script path", this.output);
        }
        if (utils_namespaceObject.ifInBrowser || utils_namespaceObject.ifInWorker) this.unstableLogContent = void 0;
        else if ('string' == typeof (null == (_this_target1 = this.target) ? void 0 : _this_target1.unstableLogContent)) this.unstableLogContent = (0, external_node_path_namespaceObject.resolve)(process.cwd(), this.target.unstableLogContent);
        else if ((null == (_this_target2 = this.target) ? void 0 : _this_target2.unstableLogContent) === true) this.unstableLogContent = (0, external_node_path_namespaceObject.join)((0, common_namespaceObject.getMidsceneRunSubDir)('output'), 'unstableLogContent.json');
        this.taskStatusList = (script.tasks || []).map((task, taskIndex)=>{
            var _task_flow;
            return {
                ...task,
                index: taskIndex,
                status: 'init',
                totalSteps: (null == (_task_flow = task.flow) ? void 0 : _task_flow.length) || 0
            };
        });
    }
}
exports.ScriptPlayer = __webpack_exports__.ScriptPlayer;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "ScriptPlayer"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=player.js.map