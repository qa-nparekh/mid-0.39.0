import { parseStructuredParams } from "../common.mjs";
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
class RemoteExecutionAdapter extends BasePlaygroundAdapter {
    get id() {
        return this._id;
    }
    validateParams(value, action) {
        if (!(null == action ? void 0 : action.paramSchema)) return {
            valid: true
        };
        const needsStructuredParams = this.actionNeedsStructuredParams(action);
        if (!needsStructuredParams) return {
            valid: true
        };
        if (!value.params) return {
            valid: false,
            errorMessage: 'Parameters are required'
        };
        if (action.paramSchema && 'object' == typeof action.paramSchema) {
            const schema = action.paramSchema;
            if (schema.shape || 'ZodObject' === schema.type) {
                const shape = schema.shape || {};
                const missingFields = Object.keys(shape).filter((key)=>{
                    var _fieldDef__def, _fieldDef__def1;
                    const fieldDef = shape[key];
                    const isOptional = (null == fieldDef ? void 0 : fieldDef.isOptional) || (null == fieldDef ? void 0 : null == (_fieldDef__def = fieldDef._def) ? void 0 : _fieldDef__def.innerType) || (null == fieldDef ? void 0 : null == (_fieldDef__def1 = fieldDef._def) ? void 0 : _fieldDef__def1.typeName) === 'ZodOptional';
                    return !isOptional && (void 0 === value.params[key] || '' === value.params[key]);
                });
                if (missingFields.length > 0) return {
                    valid: false,
                    errorMessage: `Missing required parameters: ${missingFields.join(', ')}`
                };
            }
        }
        return {
            valid: true
        };
    }
    async parseStructuredParams(action, params, options) {
        return await parseStructuredParams(action, params, options);
    }
    formatErrorMessage(error) {
        const message = (null == error ? void 0 : error.message) || '';
        const androidErrors = [
            {
                keyword: 'adb',
                message: 'ADB connection error. Please ensure device is connected and USB debugging is enabled.'
            },
            {
                keyword: 'UIAutomator',
                message: 'UIAutomator error. Please ensure the UIAutomator server is running on the device.'
            }
        ];
        const androidError = androidErrors.find(({ keyword })=>message.includes(keyword));
        if (androidError) return androidError.message;
        return this.formatBasicErrorMessage(error);
    }
    async executeAction(actionType, value, options) {
        if (this.serverUrl && 'undefined' != typeof window) return this.executeViaServer(actionType, value, options);
        throw new Error('Remote execution adapter requires server URL for execution');
    }
    async executeViaServer(actionType, value, options) {
        const payload = {
            type: actionType,
            prompt: value.prompt,
            ...this.buildOptionalPayloadParams(options, value)
        };
        if (options.context) payload.context = options.context;
        if (options.requestId && this.progressCallback) this.startProgressPolling(options.requestId, this.progressCallback);
        try {
            const response = await fetch(`${this.serverUrl}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text().catch(()=>'Unknown error');
                throw new Error(`Server request failed (${response.status}): ${errorText}`);
            }
            const result = await response.json();
            if (options.requestId) this.stopProgressPolling(options.requestId);
            return result;
        } catch (error) {
            if (options.requestId) this.stopProgressPolling(options.requestId);
            console.error('Execute via server failed:', error);
            throw error;
        }
    }
    buildOptionalPayloadParams(options, value) {
        const optionalParams = {};
        const optionalFields = [
            {
                key: 'requestId',
                value: options.requestId
            },
            {
                key: 'deepThink',
                value: options.deepThink
            },
            {
                key: 'screenshotIncluded',
                value: options.screenshotIncluded
            },
            {
                key: 'domIncluded',
                value: options.domIncluded
            },
            {
                key: 'params',
                value: value.params
            }
        ];
        optionalFields.forEach(({ key, value })=>{
            if (null != value && '' !== value) optionalParams[key] = value;
        });
        return optionalParams;
    }
    async getActionSpace(context) {
        if (this.serverUrl && 'undefined' != typeof window) try {
            const response = await fetch(`${this.serverUrl}/action-space`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    context
                })
            });
            if (!response.ok) throw new Error(`Failed to get action space: ${response.statusText}`);
            const result = await response.json();
            return Array.isArray(result) ? result : [];
        } catch (error) {
            console.error('Failed to get action space from server:', error);
        }
        if (context && 'object' == typeof context && 'actionSpace' in context) try {
            const actionSpaceMethod = context.actionSpace;
            const result = await actionSpaceMethod();
            return Array.isArray(result) ? result : [];
        } catch (error) {
            console.error('Failed to get action space from context:', error);
        }
        return [];
    }
    async checkStatus() {
        if (!this.serverUrl) return false;
        try {
            const res = await fetch(`${this.serverUrl}/status`);
            if (200 === res.status) {
                try {
                    const data = await res.json();
                    if (data.id && 'string' == typeof data.id) this._id = data.id;
                } catch (jsonError) {
                    console.debug('Failed to parse status response:', jsonError);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Server status check failed:', error);
            return false;
        }
    }
    async overrideConfig(aiConfig) {
        if (!this.serverUrl) throw new Error('Server URL not configured');
        try {
            const response = await fetch(`${this.serverUrl}/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    aiConfig
                })
            });
            if (!response.ok) throw new Error(`Failed to override server config: ${response.statusText}`);
        } catch (error) {
            console.error('Failed to override server config:', error);
            throw error;
        }
    }
    async getTaskProgress(requestId) {
        if (!this.serverUrl) return {
            tip: void 0
        };
        if (!(null == requestId ? void 0 : requestId.trim())) {
            console.warn('Invalid requestId provided for task progress');
            return {
                tip: void 0
            };
        }
        try {
            const response = await fetch(`${this.serverUrl}/task-progress/${encodeURIComponent(requestId)}`);
            if (!response.ok) {
                console.warn(`Task progress request failed: ${response.statusText}`);
                return {
                    tip: void 0
                };
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to poll task progress:', error);
            return {
                tip: void 0
            };
        }
    }
    async cancelTask(requestId) {
        this.stopProgressPolling(requestId);
        if (!this.serverUrl) return {
            error: 'No server URL configured'
        };
        if (!(null == requestId ? void 0 : requestId.trim())) return {
            error: 'Invalid request ID'
        };
        try {
            const res = await fetch(`${this.serverUrl}/cancel/${encodeURIComponent(requestId)}`, {
                method: 'POST'
            });
            if (!res.ok) return {
                error: `Cancel request failed: ${res.statusText}`
            };
            const result = await res.json();
            return {
                success: true,
                ...result
            };
        } catch (error) {
            console.error('Failed to cancel task:', error);
            return {
                error: 'Failed to cancel task'
            };
        }
    }
    setProgressCallback(callback) {
        this.progressCallback = callback;
    }
    startProgressPolling(requestId, callback) {
        if (this.progressPolling.has(requestId)) return;
        let lastTip = '';
        const interval = setInterval(async ()=>{
            try {
                var _progress_tip_trim, _progress_tip;
                const progress = await this.getTaskProgress(requestId);
                if ((null == progress ? void 0 : null == (_progress_tip = progress.tip) ? void 0 : null == (_progress_tip_trim = _progress_tip.trim) ? void 0 : _progress_tip_trim.call(_progress_tip)) && progress.tip !== lastTip) {
                    lastTip = progress.tip;
                    callback(progress.tip);
                }
            } catch (error) {
                console.debug('Progress polling error:', error);
            }
        }, 500);
        this.progressPolling.set(requestId, interval);
    }
    stopProgressPolling(requestId) {
        const interval = this.progressPolling.get(requestId);
        if (interval) {
            clearInterval(interval);
            this.progressPolling.delete(requestId);
        }
    }
    async getScreenshot() {
        if (!this.serverUrl) return null;
        try {
            const response = await fetch(`${this.serverUrl}/screenshot`);
            if (!response.ok) {
                console.warn(`Screenshot request failed: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to get screenshot:', error);
            return null;
        }
    }
    async getInterfaceInfo() {
        if (!this.serverUrl) return null;
        try {
            const response = await fetch(`${this.serverUrl}/interface-info`);
            if (!response.ok) {
                console.warn(`Interface info request failed: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to get interface info:', error);
            return null;
        }
    }
    constructor(serverUrl){
        super(), _define_property(this, "serverUrl", void 0), _define_property(this, "progressPolling", new Map()), _define_property(this, "progressCallback", void 0), _define_property(this, "_id", void 0);
        this.serverUrl = serverUrl;
    }
}
export { RemoteExecutionAdapter };

//# sourceMappingURL=remote-execution.mjs.map