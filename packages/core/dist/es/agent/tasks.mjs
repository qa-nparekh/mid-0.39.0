import { ConversationHistory, findAllMidsceneLocatorField, parseActionParam, plan as index_mjs_plan, uiTarsPlanning } from "../ai-model/index.mjs";
import { Executor } from "../ai-model/action-executor.mjs";
import { sleep as external_utils_mjs_sleep } from "../utils.mjs";
import { SQAI_REPLANNING_CYCLE_LIMIT, globalConfigManager } from "@sqaitech/shared/env";
import { getDebug } from "@sqaitech/shared/logger";
import { assert } from "@sqaitech/shared/utils";
import { taskTitleStr } from "./ui-utils.mjs";
import { matchElementFromCache, matchElementFromPlan, parsePrompt } from "./utils.mjs";
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
const debug = getDebug('device-task-executor');
const defaultReplanningCycleLimit = 10;
const defaultVlmUiTarsReplanningCycleLimit = 40;
function locatePlanForLocate(param) {
    const locate = 'string' == typeof param ? {
        prompt: param
    } : param;
    const locatePlan = {
        type: 'Locate',
        locate,
        param: locate,
        thought: ''
    };
    return locatePlan;
}
class TaskExecutor {
    get page() {
        return this.interface;
    }
    async recordScreenshot(timing) {
        const base64 = await this.interface.screenshotBase64();
        const item = {
            type: 'screenshot',
            ts: Date.now(),
            screenshot: base64,
            timing
        };
        return item;
    }
    prependExecutorWithScreenshot(taskApply, appendAfterExecution = false) {
        const taskWithScreenshot = {
            ...taskApply,
            executor: async (param, context, ...args)=>{
                const recorder = [];
                const { task } = context;
                task.recorder = recorder;
                const shot = await this.recordScreenshot(`before ${task.type}`);
                recorder.push(shot);
                const result = await taskApply.executor(param, context, ...args);
                if (appendAfterExecution) {
                    const shot2 = await this.recordScreenshot('after Action');
                    recorder.push(shot2);
                }
                return result;
            }
        };
        return taskWithScreenshot;
    }
    async convertPlanToExecutable(plans, modelConfig, cacheable) {
        const tasks = [];
        const taskForLocatePlan = (plan, detailedLocateParam, onResult)=>{
            if ('string' == typeof detailedLocateParam) detailedLocateParam = {
                prompt: detailedLocateParam
            };
            if (void 0 !== cacheable) detailedLocateParam = {
                ...detailedLocateParam,
                cacheable
            };
            const taskFind = {
                type: 'Insight',
                subType: 'Locate',
                param: detailedLocateParam,
                thought: plan.thought,
                executor: async (param, taskContext)=>{
                    var _this_taskCache, _locateCacheRecord_cacheContent;
                    const { task } = taskContext;
                    assert((null == param ? void 0 : param.prompt) || (null == param ? void 0 : param.id) || (null == param ? void 0 : param.bbox), `No prompt or id or position or bbox to locate, param=${JSON.stringify(param)}`);
                    let insightDump;
                    let usage;
                    const dumpCollector = (dump)=>{
                        var _dump_taskInfo, _dump_taskInfo1;
                        insightDump = dump;
                        usage = null == dump ? void 0 : null == (_dump_taskInfo = dump.taskInfo) ? void 0 : _dump_taskInfo.usage;
                        task.log = {
                            dump: insightDump
                        };
                        task.usage = usage;
                        if (null == dump ? void 0 : null == (_dump_taskInfo1 = dump.taskInfo) ? void 0 : _dump_taskInfo1.searchAreaUsage) task.searchAreaUsage = dump.taskInfo.searchAreaUsage;
                    };
                    this.insight.onceDumpUpdatedFn = dumpCollector;
                    const shotTime = Date.now();
                    const uiContext = await this.insight.contextRetrieverFn('locate');
                    task.uiContext = uiContext;
                    const recordItem = {
                        type: 'screenshot',
                        ts: shotTime,
                        screenshot: uiContext.screenshotBase64,
                        timing: 'before Insight'
                    };
                    task.recorder = [
                        recordItem
                    ];
                    const elementFromXpath = param.xpath && this.interface.getElementInfoByXpath ? await this.interface.getElementInfoByXpath(param.xpath) : void 0;
                    const userExpectedPathHitFlag = !!elementFromXpath;
                    const cachePrompt = param.prompt;
                    const locateCacheRecord = null == (_this_taskCache = this.taskCache) ? void 0 : _this_taskCache.matchLocateCache(cachePrompt);
                    const cacheEntry = null == locateCacheRecord ? void 0 : null == (_locateCacheRecord_cacheContent = locateCacheRecord.cacheContent) ? void 0 : _locateCacheRecord_cacheContent.cache;
                    const elementFromCache = userExpectedPathHitFlag ? null : await matchElementFromCache(this, cacheEntry, cachePrompt, param.cacheable);
                    const cacheHitFlag = !!elementFromCache;
                    const elementFromPlan = userExpectedPathHitFlag || cacheHitFlag ? void 0 : matchElementFromPlan(param, uiContext.tree);
                    const planHitFlag = !!elementFromPlan;
                    const elementFromAiLocate = userExpectedPathHitFlag || cacheHitFlag || planHitFlag ? void 0 : (await this.insight.locate(param, {
                        context: uiContext
                    }, modelConfig)).element;
                    const aiLocateHitFlag = !!elementFromAiLocate;
                    const element = elementFromXpath || elementFromCache || elementFromPlan || elementFromAiLocate;
                    let currentCacheEntry;
                    if (element && this.taskCache && !cacheHitFlag && (null == param ? void 0 : param.cacheable) !== false) if (this.interface.cacheFeatureForRect) try {
                        const feature = await this.interface.cacheFeatureForRect(element.rect, void 0 !== element.isOrderSensitive ? {
                            _orderSensitive: element.isOrderSensitive
                        } : void 0);
                        if (feature && Object.keys(feature).length > 0) {
                            debug('update cache, prompt: %s, cache: %o', cachePrompt, feature);
                            currentCacheEntry = feature;
                            this.taskCache.updateOrAppendCacheRecord({
                                type: 'locate',
                                prompt: cachePrompt,
                                cache: feature
                            }, locateCacheRecord);
                        } else debug('no cache data returned, skip cache update, prompt: %s', cachePrompt);
                    } catch (error) {
                        debug('cacheFeatureForRect failed: %s', error);
                    }
                    else debug('cacheFeatureForRect is not supported, skip cache update');
                    if (!element) throw new Error(`Element not found: ${param.prompt}`);
                    let hitBy;
                    if (userExpectedPathHitFlag) hitBy = {
                        from: 'User expected path',
                        context: {
                            xpath: param.xpath
                        }
                    };
                    else if (cacheHitFlag) hitBy = {
                        from: 'Cache',
                        context: {
                            cacheEntry,
                            cacheToSave: currentCacheEntry
                        }
                    };
                    else if (planHitFlag) hitBy = {
                        from: 'Planning',
                        context: {
                            id: null == elementFromPlan ? void 0 : elementFromPlan.id,
                            bbox: null == elementFromPlan ? void 0 : elementFromPlan.bbox
                        }
                    };
                    else if (aiLocateHitFlag) hitBy = {
                        from: 'AI model',
                        context: {
                            prompt: param.prompt
                        }
                    };
                    null == onResult || onResult(element);
                    return {
                        output: {
                            element
                        },
                        uiContext,
                        hitBy
                    };
                }
            };
            return taskFind;
        };
        for (const plan of plans)if ('Locate' === plan.type) {
            var _plan_locate, _plan_locate1;
            if (!plan.locate || null === plan.locate || (null == (_plan_locate = plan.locate) ? void 0 : _plan_locate.id) === null || (null == (_plan_locate1 = plan.locate) ? void 0 : _plan_locate1.id) === 'null') {
                debug('Locate action with id is null, will be ignored', plan);
                continue;
            }
            const taskLocate = taskForLocatePlan(plan, plan.locate);
            tasks.push(taskLocate);
        } else if ('Error' === plan.type) {
            var _plan_param;
            const taskActionError = {
                type: 'Action',
                subType: 'Error',
                param: plan.param,
                thought: plan.thought || (null == (_plan_param = plan.param) ? void 0 : _plan_param.thought),
                locate: plan.locate,
                executor: async ()=>{
                    var _plan_param;
                    throw new Error((null == plan ? void 0 : plan.thought) || (null == (_plan_param = plan.param) ? void 0 : _plan_param.thought) || 'error without thought');
                }
            };
            tasks.push(taskActionError);
        } else if ('Finished' === plan.type) {
            const taskActionFinished = {
                type: 'Action',
                subType: 'Finished',
                param: null,
                thought: plan.thought,
                locate: plan.locate,
                executor: async (param)=>{}
            };
            tasks.push(taskActionFinished);
        } else if ('Sleep' === plan.type) {
            const taskActionSleep = {
                type: 'Action',
                subType: 'Sleep',
                param: plan.param,
                thought: plan.thought,
                locate: plan.locate,
                executor: async (taskParam)=>{
                    await external_utils_mjs_sleep((null == taskParam ? void 0 : taskParam.timeMs) || 3000);
                }
            };
            tasks.push(taskActionSleep);
        } else {
            const planType = plan.type;
            const actionSpace = await this.interface.actionSpace();
            const action = actionSpace.find((action)=>action.name === planType);
            const param = plan.param;
            if (!action) throw new Error(`Action type '${planType}' not found`);
            const locateFields = action ? findAllMidsceneLocatorField(action.paramSchema) : [];
            const requiredLocateFields = action ? findAllMidsceneLocatorField(action.paramSchema, true) : [];
            locateFields.forEach((field)=>{
                if (param[field]) {
                    const locatePlan = locatePlanForLocate(param[field]);
                    debug('will prepend locate param for field', `action.type=${planType}`, `param=${JSON.stringify(param[field])}`, `locatePlan=${JSON.stringify(locatePlan)}`);
                    const locateTask = taskForLocatePlan(locatePlan, param[field], (result)=>{
                        param[field] = result;
                    });
                    tasks.push(locateTask);
                } else {
                    assert(!requiredLocateFields.includes(field), `Required locate field '${field}' is not provided for action ${planType}`);
                    debug(`field '${field}' is not provided for action ${planType}`);
                }
            });
            const task = {
                type: 'Action',
                subType: planType,
                thought: plan.thought,
                param: plan.param,
                executor: async (param, context)=>{
                    var _context_element;
                    debug('executing action', planType, param, `context.element.center: ${null == (_context_element = context.element) ? void 0 : _context_element.center}`);
                    const uiContext = await this.insight.contextRetrieverFn('locate');
                    context.task.uiContext = uiContext;
                    requiredLocateFields.forEach((field)=>{
                        assert(param[field], `field '${field}' is required for action ${planType} but not provided. Cannot execute action ${planType}.`);
                    });
                    try {
                        await Promise.all([
                            (async ()=>{
                                if (this.interface.beforeInvokeAction) {
                                    debug('will call "beforeInvokeAction" for interface');
                                    await this.interface.beforeInvokeAction(action.name, param);
                                    debug('called "beforeInvokeAction" for interface');
                                }
                            })(),
                            external_utils_mjs_sleep(200)
                        ]);
                    } catch (originalError) {
                        const originalMessage = (null == originalError ? void 0 : originalError.message) || String(originalError);
                        throw new Error(`error in running beforeInvokeAction for ${action.name}: ${originalMessage}`, {
                            cause: originalError
                        });
                    }
                    if (action.paramSchema) try {
                        param = parseActionParam(param, action.paramSchema);
                    } catch (error) {
                        throw new Error(`Invalid parameters for action ${action.name}: ${error.message}\nParameters: ${JSON.stringify(param)}`, {
                            cause: error
                        });
                    }
                    debug('calling action', action.name);
                    const actionFn = action.call.bind(this.interface);
                    await actionFn(param, context);
                    debug('called action', action.name);
                    await external_utils_mjs_sleep(300);
                    try {
                        if (this.interface.afterInvokeAction) {
                            debug('will call "afterInvokeAction" for interface');
                            await this.interface.afterInvokeAction(action.name, param);
                            debug('called "afterInvokeAction" for interface');
                        }
                    } catch (originalError) {
                        const originalMessage = (null == originalError ? void 0 : originalError.message) || String(originalError);
                        throw new Error(`error in running afterInvokeAction for ${action.name}: ${originalMessage}`, {
                            cause: originalError
                        });
                    }
                    return {
                        output: {
                            success: true,
                            action: planType,
                            param: param
                        }
                    };
                }
            };
            tasks.push(task);
        }
        const wrappedTasks = tasks.map((task, index)=>{
            if ('Action' === task.type) return this.prependExecutorWithScreenshot(task, index === tasks.length - 1);
            return task;
        });
        return {
            tasks: wrappedTasks
        };
    }
    async setupPlanningContext(executorContext) {
        const shotTime = Date.now();
        const uiContext = await this.insight.contextRetrieverFn('locate');
        const recordItem = {
            type: 'screenshot',
            ts: shotTime,
            screenshot: uiContext.screenshotBase64,
            timing: 'before Planning'
        };
        executorContext.task.recorder = [
            recordItem
        ];
        executorContext.task.uiContext = uiContext;
        return {
            uiContext
        };
    }
    async loadYamlFlowAsPlanning(userInstruction, yamlString) {
        const taskExecutor = new Executor(taskTitleStr('Action', userInstruction), {
            onTaskStart: this.onTaskStartCallback
        });
        const task = {
            type: 'Planning',
            subType: 'LoadYaml',
            locate: null,
            param: {
                userInstruction
            },
            executor: async (param, executorContext)=>{
                await this.setupPlanningContext(executorContext);
                return {
                    output: {
                        actions: [],
                        more_actions_needed_by_instruction: false,
                        log: '',
                        yamlString
                    },
                    cache: {
                        hit: true
                    },
                    hitBy: {
                        from: 'Cache',
                        context: {
                            yamlString
                        }
                    }
                };
            }
        };
        await taskExecutor.append(task);
        await taskExecutor.flush();
        return {
            executor: taskExecutor
        };
    }
    createPlanningTask(userInstruction, actionContext, modelConfig) {
        const task = {
            type: 'Planning',
            subType: 'Plan',
            locate: null,
            param: {
                userInstruction
            },
            executor: async (param, executorContext)=>{
                const startTime = Date.now();
                const { uiContext } = await this.setupPlanningContext(executorContext);
                const { vlMode } = modelConfig;
                const uiTarsModelVersion = 'vlm-ui-tars' === vlMode ? modelConfig.uiTarsModelVersion : void 0;
                assert(this.interface.actionSpace, 'actionSpace for device is not implemented');
                const actionSpace = await this.interface.actionSpace();
                debug('actionSpace for this interface is:', actionSpace.map((action)=>action.name).join(', '));
                assert(Array.isArray(actionSpace), 'actionSpace must be an array');
                if (0 === actionSpace.length) console.warn(`ActionSpace for ${this.interface.interfaceType} is empty. This may lead to unexpected behavior.`);
                const planResult = await (uiTarsModelVersion ? uiTarsPlanning : index_mjs_plan)(param.userInstruction, {
                    context: uiContext,
                    actionContext,
                    interfaceType: this.interface.interfaceType,
                    actionSpace,
                    modelConfig,
                    conversationHistory: this.conversationHistory
                });
                debug('planResult', JSON.stringify(planResult, null, 2));
                const { actions, log, more_actions_needed_by_instruction, error, usage, rawResponse, sleep } = planResult;
                executorContext.task.log = {
                    ...executorContext.task.log || {},
                    rawResponse
                };
                executorContext.task.usage = usage;
                const finalActions = actions || [];
                if (sleep) {
                    const timeNow = Date.now();
                    const timeRemaining = sleep - (timeNow - startTime);
                    if (timeRemaining > 0) finalActions.push({
                        type: 'Sleep',
                        param: {
                            timeMs: timeRemaining
                        },
                        locate: null
                    });
                }
                if (0 === finalActions.length) assert(!more_actions_needed_by_instruction || sleep, error ? `Failed to plan: ${error}` : 'No plan found');
                return {
                    output: {
                        actions: finalActions,
                        more_actions_needed_by_instruction,
                        log,
                        yamlFlow: planResult.yamlFlow
                    },
                    cache: {
                        hit: false
                    },
                    uiContext
                };
            }
        };
        return task;
    }
    async runPlans(title, plans, modelConfig) {
        const taskExecutor = new Executor(title, {
            onTaskStart: this.onTaskStartCallback
        });
        const { tasks } = await this.convertPlanToExecutable(plans, modelConfig);
        await taskExecutor.append(tasks);
        const result = await taskExecutor.flush();
        const { output } = result;
        return {
            output,
            executor: taskExecutor
        };
    }
    getReplanningCycleLimit(isVlmUiTars) {
        return this.replanningCycleLimit || globalConfigManager.getEnvConfigInNumber(SQAI_REPLANNING_CYCLE_LIMIT) || (isVlmUiTars ? defaultVlmUiTarsReplanningCycleLimit : defaultReplanningCycleLimit);
    }
    async action(userPrompt, modelConfig, actionContext, cacheable) {
        this.conversationHistory.reset();
        const taskExecutor = new Executor(taskTitleStr('Action', userPrompt), {
            onTaskStart: this.onTaskStartCallback
        });
        let replanCount = 0;
        const yamlFlow = [];
        const replanningCycleLimit = this.getReplanningCycleLimit('vlm-ui-tars' === modelConfig.vlMode);
        while(true){
            if (replanCount > replanningCycleLimit) {
                const errorMsg = `Replanning ${replanningCycleLimit} times, which is more than the limit, please split the task into multiple steps`;
                return this.appendErrorPlan(taskExecutor, errorMsg, modelConfig);
            }
            const planningTask = this.createPlanningTask(userPrompt, actionContext, modelConfig);
            await taskExecutor.append(planningTask);
            const result = await taskExecutor.flush();
            const planResult = null == result ? void 0 : result.output;
            if (taskExecutor.isInErrorState()) return {
                output: planResult,
                executor: taskExecutor
            };
            const plans = planResult.actions || [];
            yamlFlow.push(...planResult.yamlFlow || []);
            let executables;
            try {
                executables = await this.convertPlanToExecutable(plans, modelConfig, cacheable);
                taskExecutor.append(executables.tasks);
            } catch (error) {
                return this.appendErrorPlan(taskExecutor, `Error converting plans to executable tasks: ${error}, plans: ${JSON.stringify(plans)}`, modelConfig);
            }
            await taskExecutor.flush();
            if (taskExecutor.isInErrorState()) return {
                output: void 0,
                executor: taskExecutor
            };
            if (!planResult.more_actions_needed_by_instruction) break;
            replanCount++;
        }
        return {
            output: {
                yamlFlow
            },
            executor: taskExecutor
        };
    }
    createTypeQueryTask(type, demand, modelConfig, opt, multimodalPrompt) {
        const queryTask = {
            type: 'Insight',
            subType: type,
            locate: null,
            param: {
                dataDemand: multimodalPrompt ? {
                    demand,
                    multimodalPrompt
                } : demand
            },
            executor: async (param, taskContext)=>{
                const { task } = taskContext;
                let insightDump;
                const dumpCollector = (dump)=>{
                    insightDump = dump;
                };
                this.insight.onceDumpUpdatedFn = dumpCollector;
                const shotTime = Date.now();
                const uiContext = await this.insight.contextRetrieverFn('extract');
                task.uiContext = uiContext;
                const recordItem = {
                    type: 'screenshot',
                    ts: shotTime,
                    screenshot: uiContext.screenshotBase64,
                    timing: 'before Extract'
                };
                task.recorder = [
                    recordItem
                ];
                const ifTypeRestricted = 'Query' !== type;
                let demandInput = demand;
                let keyOfResult = 'result';
                if (ifTypeRestricted && ('Assert' === type || 'WaitFor' === type)) {
                    keyOfResult = 'StatementIsTruthy';
                    const booleanPrompt = 'Assert' === type ? `Boolean, whether the following statement is true: ${demand}` : `Boolean, the user wants to do some 'wait for' operation, please check whether the following statement is true: ${demand}`;
                    demandInput = {
                        [keyOfResult]: booleanPrompt
                    };
                } else if (ifTypeRestricted) demandInput = {
                    [keyOfResult]: `${type}, ${demand}`
                };
                const { data, usage, thought } = await this.insight.extract(demandInput, modelConfig, opt, multimodalPrompt);
                let outputResult = data;
                if (ifTypeRestricted) if ('string' == typeof data) outputResult = data;
                else if ('WaitFor' === type) outputResult = null == data ? false : data[keyOfResult];
                else if (null == data) outputResult = null;
                else {
                    assert((null == data ? void 0 : data[keyOfResult]) !== void 0, 'No result in query data');
                    outputResult = data[keyOfResult];
                }
                if ('Assert' === type && !outputResult) {
                    task.usage = usage;
                    task.thought = thought;
                    throw new Error(`Assertion failed: ${thought}`);
                }
                return {
                    output: outputResult,
                    log: insightDump,
                    usage,
                    thought
                };
            }
        };
        return queryTask;
    }
    async createTypeQueryExecution(type, demand, modelConfig, opt, multimodalPrompt) {
        const taskExecutor = new Executor(taskTitleStr(type, 'string' == typeof demand ? demand : JSON.stringify(demand)), {
            onTaskStart: this.onTaskStartCallback
        });
        const queryTask = await this.createTypeQueryTask(type, demand, modelConfig, opt, multimodalPrompt);
        await taskExecutor.append(this.prependExecutorWithScreenshot(queryTask));
        const result = await taskExecutor.flush();
        if (!result) throw new Error('result of taskExecutor.flush() is undefined in function createTypeQueryTask');
        const { output, thought } = result;
        return {
            output,
            thought,
            executor: taskExecutor
        };
    }
    async appendErrorPlan(taskExecutor, errorMsg, modelConfig) {
        const errorPlan = {
            type: 'Error',
            param: {
                thought: errorMsg
            },
            locate: null
        };
        const { tasks } = await this.convertPlanToExecutable([
            errorPlan
        ], modelConfig);
        await taskExecutor.append(this.prependExecutorWithScreenshot(tasks[0]));
        await taskExecutor.flush();
        return {
            output: void 0,
            executor: taskExecutor
        };
    }
    async taskForSleep(timeMs, modelConfig) {
        const sleepPlan = {
            type: 'Sleep',
            param: {
                timeMs
            },
            locate: null
        };
        const { tasks: sleepTasks } = await this.convertPlanToExecutable([
            sleepPlan
        ], modelConfig);
        return this.prependExecutorWithScreenshot(sleepTasks[0]);
    }
    async waitFor(assertion, opt, modelConfig) {
        const { textPrompt, multimodalPrompt } = parsePrompt(assertion);
        const description = `waitFor: ${textPrompt}`;
        const taskExecutor = new Executor(taskTitleStr('WaitFor', description), {
            onTaskStart: this.onTaskStartCallback
        });
        const { timeoutMs, checkIntervalMs } = opt;
        assert(assertion, 'No assertion for waitFor');
        assert(timeoutMs, 'No timeoutMs for waitFor');
        assert(checkIntervalMs, 'No checkIntervalMs for waitFor');
        assert(checkIntervalMs <= timeoutMs, `wrong config for waitFor: checkIntervalMs must be less than timeoutMs, config: {checkIntervalMs: ${checkIntervalMs}, timeoutMs: ${timeoutMs}}`);
        const overallStartTime = Date.now();
        let startTime = Date.now();
        let errorThought = '';
        while(Date.now() - overallStartTime < timeoutMs){
            startTime = Date.now();
            const queryTask = await this.createTypeQueryTask('WaitFor', textPrompt, modelConfig, {
                doNotThrowError: true
            }, multimodalPrompt);
            await taskExecutor.append(this.prependExecutorWithScreenshot(queryTask));
            const result = await taskExecutor.flush();
            if (null == result ? void 0 : result.output) return {
                output: void 0,
                executor: taskExecutor
            };
            errorThought = (null == result ? void 0 : result.thought) || !result && `No result from assertion: ${textPrompt}` || `unknown error when waiting for assertion: ${textPrompt}`;
            const now = Date.now();
            if (now - startTime < checkIntervalMs) {
                const timeRemaining = checkIntervalMs - (now - startTime);
                const sleepTask = await this.taskForSleep(timeRemaining, modelConfig);
                await taskExecutor.append(sleepTask);
            }
        }
        return this.appendErrorPlan(taskExecutor, `waitFor timeout: ${errorThought}`, modelConfig);
    }
    constructor(interfaceInstance, insight, opts){
        _define_property(this, "interface", void 0);
        _define_property(this, "insight", void 0);
        _define_property(this, "taskCache", void 0);
        _define_property(this, "conversationHistory", void 0);
        _define_property(this, "onTaskStartCallback", void 0);
        _define_property(this, "replanningCycleLimit", void 0);
        this.interface = interfaceInstance;
        this.insight = insight;
        this.taskCache = opts.taskCache;
        this.onTaskStartCallback = null == opts ? void 0 : opts.onTaskStart;
        this.replanningCycleLimit = opts.replanningCycleLimit;
        this.conversationHistory = new ConversationHistory();
    }
}
export { TaskExecutor, locatePlanForLocate };

//# sourceMappingURL=tasks.mjs.map