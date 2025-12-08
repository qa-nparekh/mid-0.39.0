import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve as external_node_path_resolve } from "node:path";
import { assert, ifInBrowser, ifInWorker } from "@sqai/shared/utils";
import { getMidsceneRunSubDir } from "@sqai/shared/common";
import { getDebug } from "@sqai/shared/logger";
import { buildDetailedLocateParam, buildDetailedLocateParamAndRestParams } from "./utils.mjs";
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
const debug = getDebug('yaml-player');
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
            const output = external_node_path_resolve(process.cwd(), this.output);
            const outputDir = dirname(output);
            if (!existsSync(outputDir)) mkdirSync(outputDir, {
                recursive: true
            });
            writeFileSync(output, JSON.stringify(this.result || {}, void 0, 2));
        }
    }
    flushUnstableLogContent() {
        if (this.unstableLogContent) {
            var _this_interfaceAgent;
            const content = null == (_this_interfaceAgent = this.interfaceAgent) ? void 0 : _this_interfaceAgent._unstableLogContent();
            const filePath = external_node_path_resolve(process.cwd(), this.unstableLogContent);
            const outputDir = dirname(filePath);
            if (!existsSync(outputDir)) mkdirSync(outputDir, {
                recursive: true
            });
            writeFileSync(filePath, JSON.stringify(content, null, 2));
        }
    }
    async playTask(taskStatus, agent) {
        const { flow } = taskStatus;
        assert(flow, 'missing flow in task');
        for(const flowItemIndex in flow){
            const currentStep = Number.parseInt(flowItemIndex, 10);
            taskStatus.currentStep = currentStep;
            const flowItem = flow[flowItemIndex];
            debug(`playing step ${flowItemIndex}, flowItem=${JSON.stringify(flowItem)}`);
            if ('aiAction' in flowItem || 'ai' in flowItem) {
                const actionTask = flowItem;
                const prompt = actionTask.aiAction || actionTask.ai;
                assert(prompt, 'missing prompt for ai (aiAction)');
                await agent.aiAction(prompt, {
                    cacheable: actionTask.cacheable
                });
            } else if ('aiAssert' in flowItem) {
                const assertTask = flowItem;
                const prompt = assertTask.aiAssert;
                const msg = assertTask.errorMessage;
                assert(prompt, 'missing prompt for aiAssert');
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
                assert(prompt, 'missing prompt for aiQuery');
                const queryResult = await agent.aiQuery(prompt, options);
                this.setResult(queryTask.name, queryResult);
            } else if ('aiNumber' in flowItem) {
                const numberTask = flowItem;
                const prompt = numberTask.aiNumber;
                const options = {
                    domIncluded: numberTask.domIncluded,
                    screenshotIncluded: numberTask.screenshotIncluded
                };
                assert(prompt, 'missing prompt for aiNumber');
                const numberResult = await agent.aiNumber(prompt, options);
                this.setResult(numberTask.name, numberResult);
            } else if ('aiString' in flowItem) {
                const stringTask = flowItem;
                const prompt = stringTask.aiString;
                const options = {
                    domIncluded: stringTask.domIncluded,
                    screenshotIncluded: stringTask.screenshotIncluded
                };
                assert(prompt, 'missing prompt for aiString');
                const stringResult = await agent.aiString(prompt, options);
                this.setResult(stringTask.name, stringResult);
            } else if ('aiBoolean' in flowItem) {
                const booleanTask = flowItem;
                const prompt = booleanTask.aiBoolean;
                const options = {
                    domIncluded: booleanTask.domIncluded,
                    screenshotIncluded: booleanTask.screenshotIncluded
                };
                assert(prompt, 'missing prompt for aiBoolean');
                const booleanResult = await agent.aiBoolean(prompt, options);
                this.setResult(booleanTask.name, booleanResult);
            } else if ('aiAsk' in flowItem) {
                const askTask = flowItem;
                const prompt = askTask.aiAsk;
                assert(prompt, 'missing prompt for aiAsk');
                const askResult = await agent.aiAsk(prompt);
                this.setResult(askTask.name, askResult);
            } else if ('aiLocate' in flowItem) {
                const locateTask = flowItem;
                const prompt = locateTask.aiLocate;
                assert(prompt, 'missing prompt for aiLocate');
                const locateResult = await agent.aiLocate(prompt, locateTask);
                this.setResult(locateTask.name, locateResult);
            } else if ('aiWaitFor' in flowItem) {
                const waitForTask = flowItem;
                const prompt = waitForTask.aiWaitFor;
                assert(prompt, 'missing prompt for aiWaitFor');
                const timeout = waitForTask.timeout;
                await agent.aiWaitFor(prompt, {
                    timeoutMs: timeout
                });
            } else if ('sleep' in flowItem) {
                const sleepTask = flowItem;
                const ms = sleepTask.sleep;
                let msNumber = ms;
                if ('string' == typeof ms) msNumber = Number.parseInt(ms, 10);
                assert(msNumber && msNumber > 0, `ms for sleep must be greater than 0, but got ${ms}`);
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
                        locate: buildDetailedLocateParam(locatePrompt, inputTask)
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
                        locate: buildDetailedLocateParam(locatePrompt, keyboardPressTask)
                    } : {}
                });
            } else if ('aiScroll' in flowItem) {
                const { aiScroll, ...scrollTask } = flowItem;
                let locatePrompt;
                locatePrompt = scrollTask.locate ? scrollTask.locate : aiScroll;
                await agent.callActionInActionSpace('Scroll', {
                    ...scrollTask,
                    ...locatePrompt ? {
                        locate: buildDetailedLocateParam(locatePrompt, scrollTask)
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
                assert(matchedAction, `unknown flowItem in yaml: ${JSON.stringify(flowItem)}`);
                assert(!(flowItem.prompt && locatePromptShortcut), `conflict locate prompt for item: ${JSON.stringify(flowItem)}`);
                if (locatePromptShortcut) flowItem.prompt = locatePromptShortcut;
                const { locateParam, restParams } = buildDetailedLocateParamAndRestParams(locatePromptShortcut || '', flowItem, [
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
        if (ifInBrowser || ifInWorker) {
            this.output = void 0;
            debug('output is undefined in browser or worker');
        } else if (null == (_this_target = this.target) ? void 0 : _this_target.output) {
            this.output = external_node_path_resolve(process.cwd(), this.target.output);
            debug('setting output by config.output', this.output);
        } else {
            const scriptName = this.scriptPath ? basename(this.scriptPath, '.yaml').replace(/\.(ya?ml)$/i, '') : "script";
            this.output = join(getMidsceneRunSubDir('output'), `${scriptName}-${Date.now()}.json`);
            debug("setting output by script path", this.output);
        }
        if (ifInBrowser || ifInWorker) this.unstableLogContent = void 0;
        else if ('string' == typeof (null == (_this_target1 = this.target) ? void 0 : _this_target1.unstableLogContent)) this.unstableLogContent = external_node_path_resolve(process.cwd(), this.target.unstableLogContent);
        else if ((null == (_this_target2 = this.target) ? void 0 : _this_target2.unstableLogContent) === true) this.unstableLogContent = join(getMidsceneRunSubDir('output'), 'unstableLogContent.json');
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
export { ScriptPlayer };

//# sourceMappingURL=player.mjs.map