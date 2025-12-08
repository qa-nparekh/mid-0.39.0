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
    PlaygroundSDK: ()=>PlaygroundSDK
});
const constants_namespaceObject = require("@sqai/shared/constants");
const local_execution_js_namespaceObject = require("../adapters/local-execution.js");
const remote_execution_js_namespaceObject = require("../adapters/remote-execution.js");
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
class PlaygroundSDK {
    createAdapter(type, serverUrl, agent) {
        switch(type){
            case 'local-execution':
                if (!agent) throw new Error('Agent is required for local execution');
                return new local_execution_js_namespaceObject.LocalExecutionAdapter(agent);
            case 'remote-execution':
                {
                    const finalServerUrl = serverUrl || ('undefined' != typeof window && window.location.protocol.includes('http') ? window.location.origin : `http://localhost:${constants_namespaceObject.PLAYGROUND_SERVER_PORT}`);
                    return new remote_execution_js_namespaceObject.RemoteExecutionAdapter(finalServerUrl);
                }
            default:
                throw new Error(`Unsupported execution type: ${type}`);
        }
    }
    async executeAction(actionType, value, options) {
        const result = await this.adapter.executeAction(actionType, value, options);
        if (options.requestId) this.stopProgressPolling(options.requestId);
        return result;
    }
    async getActionSpace(context) {
        return this.adapter.getActionSpace(context);
    }
    validateStructuredParams(value, action) {
        return this.adapter.validateParams(value, action);
    }
    formatErrorMessage(error) {
        return this.adapter.formatErrorMessage(error);
    }
    createDisplayContent(value, needsStructuredParams, action) {
        return this.adapter.createDisplayContent(value, needsStructuredParams, action);
    }
    get id() {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.id;
        if (this.adapter instanceof local_execution_js_namespaceObject.LocalExecutionAdapter) return this.adapter.id;
    }
    async checkStatus() {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.checkStatus();
        return true;
    }
    async overrideConfig(aiConfig) {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.overrideConfig(aiConfig);
    }
    async getTaskProgress(requestId) {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.getTaskProgress(requestId);
        if (this.adapter instanceof local_execution_js_namespaceObject.LocalExecutionAdapter) return this.adapter.getTaskProgress(requestId);
        return {
            tip: void 0
        };
    }
    async cancelTask(requestId) {
        this.stopProgressPolling(requestId);
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.cancelTask(requestId);
        return {
            error: 'Cancel task not supported in local execution mode'
        };
    }
    onProgressUpdate(callback) {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) this.adapter.setProgressCallback(callback);
        else if (this.adapter instanceof local_execution_js_namespaceObject.LocalExecutionAdapter) this.adapter.setProgressCallback(callback);
    }
    startProgressPolling(requestId) {
        console.warn('startProgressPolling is deprecated - polling is now automatic');
    }
    stopProgressPolling(requestId) {
        console.warn('stopProgressPolling is deprecated - polling cleanup is now automatic');
    }
    async cancelExecution(requestId) {
        this.stopProgressPolling(requestId);
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) await this.adapter.cancelTask(requestId);
        else if (this.adapter instanceof local_execution_js_namespaceObject.LocalExecutionAdapter) console.warn('Local execution cancellation not fully implemented');
    }
    async getScreenshot() {
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.getScreenshot();
        return null;
    }
    async getInterfaceInfo() {
        if (this.adapter instanceof local_execution_js_namespaceObject.LocalExecutionAdapter) return this.adapter.getInterfaceInfo();
        if (this.adapter instanceof remote_execution_js_namespaceObject.RemoteExecutionAdapter) return this.adapter.getInterfaceInfo();
        return null;
    }
    constructor(config){
        _define_property(this, "adapter", void 0);
        this.adapter = this.createAdapter(config.type, config.serverUrl, config.agent);
    }
}
exports.PlaygroundSDK = __webpack_exports__.PlaygroundSDK;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "PlaygroundSDK"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map