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
    Executor: ()=>Executor
});
const utils_namespaceObject = require("@sqaitech/shared/utils");
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
class Executor {
    markTaskAsPending(task) {
        return {
            status: 'pending',
            ...task
        };
    }
    async append(task) {
        var _this_latestErrorTask, _this_latestErrorTask1;
        (0, utils_namespaceObject.assert)('error' !== this.status, `executor is in error state, cannot append task\nerror=${null == (_this_latestErrorTask = this.latestErrorTask()) ? void 0 : _this_latestErrorTask.error}\n${null == (_this_latestErrorTask1 = this.latestErrorTask()) ? void 0 : _this_latestErrorTask1.errorStack}`);
        if (Array.isArray(task)) this.tasks.push(...task.map((item)=>this.markTaskAsPending(item)));
        else this.tasks.push(this.markTaskAsPending(task));
        if ('running' !== this.status) this.status = 'pending';
    }
    async flush() {
        if ('init' === this.status && this.tasks.length > 0) console.warn('illegal state for executor, status is init but tasks are not empty');
        (0, utils_namespaceObject.assert)('running' !== this.status, 'executor is already running');
        (0, utils_namespaceObject.assert)('completed' !== this.status, 'executor is already completed');
        (0, utils_namespaceObject.assert)('error' !== this.status, 'executor is in error state');
        const nextPendingIndex = this.tasks.findIndex((task)=>'pending' === task.status);
        if (nextPendingIndex < 0) return;
        this.status = 'running';
        let taskIndex = nextPendingIndex;
        let successfullyCompleted = true;
        let previousFindOutput;
        while(taskIndex < this.tasks.length){
            const task = this.tasks[taskIndex];
            (0, utils_namespaceObject.assert)('pending' === task.status, `task status should be pending, but got: ${task.status}`);
            task.timing = {
                start: Date.now()
            };
            try {
                task.status = 'running';
                try {
                    if (this.onTaskStart) await this.onTaskStart(task);
                } catch (e) {
                    console.error('error in onTaskStart', e);
                }
                (0, utils_namespaceObject.assert)([
                    'Insight',
                    'Action',
                    'Planning'
                ].indexOf(task.type) >= 0, `unsupported task type: ${task.type}`);
                const { executor, param } = task;
                (0, utils_namespaceObject.assert)(executor, `executor is required for task type: ${task.type}`);
                let returnValue;
                const executorContext = {
                    task,
                    element: null == previousFindOutput ? void 0 : previousFindOutput.element
                };
                if ('Insight' === task.type) {
                    (0, utils_namespaceObject.assert)('Locate' === task.subType || 'Query' === task.subType || 'Assert' === task.subType || 'WaitFor' === task.subType || 'Boolean' === task.subType || 'Number' === task.subType || 'String' === task.subType, `unsupported insight subType: ${task.subType}`);
                    returnValue = await task.executor(param, executorContext);
                    if ('Locate' === task.subType) previousFindOutput = null == returnValue ? void 0 : returnValue.output;
                } else if ('Action' === task.type || 'Planning' === task.type) returnValue = await task.executor(param, executorContext);
                else {
                    console.warn(`unsupported task type: ${task.type}, will try to execute it directly`);
                    returnValue = await task.executor(param, executorContext);
                }
                Object.assign(task, returnValue);
                task.status = 'finished';
                task.timing.end = Date.now();
                task.timing.cost = task.timing.end - task.timing.start;
                taskIndex++;
            } catch (e) {
                successfullyCompleted = false;
                task.error = e;
                task.errorMessage = (null == e ? void 0 : e.message) || ('string' == typeof e ? e : 'error-without-message');
                task.errorStack = e.stack;
                task.status = 'failed';
                task.timing.end = Date.now();
                task.timing.cost = task.timing.end - task.timing.start;
                break;
            }
        }
        for(let i = taskIndex + 1; i < this.tasks.length; i++)this.tasks[i].status = 'cancelled';
        if (successfullyCompleted) this.status = 'completed';
        else this.status = 'error';
        if (this.tasks.length) {
            const outputIndex = Math.min(taskIndex, this.tasks.length - 1);
            const { thought, output } = this.tasks[outputIndex];
            return {
                thought,
                output
            };
        }
    }
    isInErrorState() {
        return 'error' === this.status;
    }
    latestErrorTask() {
        if ('error' !== this.status) return null;
        const errorTaskIndex = this.tasks.findIndex((task)=>'failed' === task.status);
        if (errorTaskIndex >= 0) return this.tasks[errorTaskIndex];
        return null;
    }
    dump() {
        const dumpData = {
            logTime: Date.now(),
            name: this.name,
            tasks: this.tasks
        };
        return dumpData;
    }
    constructor(name, options){
        _define_property(this, "name", void 0);
        _define_property(this, "tasks", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "onTaskStart", void 0);
        this.status = (null == options ? void 0 : options.tasks) && options.tasks.length > 0 ? 'pending' : 'init';
        this.name = name;
        this.tasks = ((null == options ? void 0 : options.tasks) || []).map((item)=>this.markTaskAsPending(item));
        this.onTaskStart = null == options ? void 0 : options.onTaskStart;
    }
}
exports.Executor = __webpack_exports__.Executor;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "Executor"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=action-executor.js.map