import { overrideAIConfig } from "@sqai/shared/env";
import { uuid } from "@sqai/shared/utils";
import { executeAction, parseStructuredParams } from "../common.mjs";
import { BasePlaygroundAdapter } from "./base.mjs";
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
class LocalExecutionAdapter extends BasePlaygroundAdapter {
    get id() {
        return this._id;
    }
    setProgressCallback(callback) {
        this.progressCallback = void 0;
        this.progressCallback = callback;
    }
    cleanup(requestId) {
        delete this.taskProgressTips[requestId];
    }
    async parseStructuredParams(action, params, options) {
        return await parseStructuredParams(action, params, options);
    }
    formatErrorMessage(error) {
        const errorMessage = (null == error ? void 0 : error.message) || '';
        if (errorMessage.includes('of different extension')) return 'Conflicting extension detected. Please disable the suspicious plugins and refresh the page. Guide: https://midscenejs.com/quick-experience.html#faq';
        return this.formatBasicErrorMessage(error);
    }
    async getActionSpace(context) {
        var _this_agent;
        if (null == (_this_agent = this.agent) ? void 0 : _this_agent.getActionSpace) return await this.agent.getActionSpace();
        if (this.agent && 'interface' in this.agent && 'object' == typeof this.agent.interface) {
            const page = this.agent.interface;
            if (null == page ? void 0 : page.actionSpace) return await page.actionSpace();
        }
        if (context && 'object' == typeof context && 'actionSpace' in context) {
            const contextPage = context;
            return await contextPage.actionSpace();
        }
        return [];
    }
    async checkStatus() {
        return true;
    }
    async overrideConfig(aiConfig) {
        overrideAIConfig(aiConfig);
    }
    async executeAction(actionType, value, options) {
        const actionSpace = await this.getActionSpace();
        let originalOnTaskStartTip;
        if (options.requestId && this.agent) {
            this.currentRequestId = options.requestId;
            originalOnTaskStartTip = this.agent.onTaskStartTip;
            this.agent.onTaskStartTip = (tip)=>{
                if (this.currentRequestId !== options.requestId) return;
                this.taskProgressTips[options.requestId] = tip;
                if (this.progressCallback) this.progressCallback(tip);
                if ('function' == typeof originalOnTaskStartTip) originalOnTaskStartTip(tip);
            };
        }
        try {
            const result = await executeAction(this.agent, actionType, actionSpace, value, options);
            const response = {
                result,
                dump: null,
                reportHTML: null,
                error: null
            };
            try {
                if (this.agent.dumpDataString) {
                    const dumpString = this.agent.dumpDataString();
                    if (dumpString) response.dump = JSON.parse(dumpString);
                }
                if (this.agent.reportHTMLString) response.reportHTML = this.agent.reportHTMLString() || null;
                if (this.agent.writeOutActionDumps) this.agent.writeOutActionDumps();
            } catch (error) {
                console.error('Failed to get dump/reportHTML from agent:', error);
            }
            this.agent.resetDump();
            return response;
        } finally{
            if (options.requestId) {
                this.cleanup(options.requestId);
                if (this.agent) this.agent.onTaskStartTip = originalOnTaskStartTip;
            }
        }
    }
    async getTaskProgress(requestId) {
        return {
            tip: this.taskProgressTips[requestId] || void 0
        };
    }
    async cancelTask(_requestId) {
        if (!this.agent) return {
            error: 'No active agent found for this requestId'
        };
        try {
            var _this_agent_destroy, _this_agent;
            await (null == (_this_agent_destroy = (_this_agent = this.agent).destroy) ? void 0 : _this_agent_destroy.call(_this_agent));
            return {
                success: true
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Failed to cancel agent: ${errorMessage}`);
            return {
                error: `Failed to cancel: ${errorMessage}`
            };
        }
    }
    async getInterfaceInfo() {
        var _this_agent;
        if (!(null == (_this_agent = this.agent) ? void 0 : _this_agent.interface)) return null;
        try {
            var _this_agent_interface_describe, _this_agent_interface;
            const type = this.agent.interface.interfaceType || 'Unknown';
            const description = (null == (_this_agent_interface_describe = (_this_agent_interface = this.agent.interface).describe) ? void 0 : _this_agent_interface_describe.call(_this_agent_interface)) || void 0;
            return {
                type,
                description
            };
        } catch (error) {
            console.error('Failed to get interface info:', error);
            return null;
        }
    }
    constructor(agent){
        super(), _define_property(this, "agent", void 0), _define_property(this, "taskProgressTips", {}), _define_property(this, "progressCallback", void 0), _define_property(this, "_id", void 0), _define_property(this, "currentRequestId", void 0);
        this.agent = agent;
        this._id = uuid();
    }
}
export { LocalExecutionAdapter };

//# sourceMappingURL=local-execution.mjs.map