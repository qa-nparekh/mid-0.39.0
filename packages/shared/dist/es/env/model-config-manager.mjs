import { decideModelConfigFromEnv, decideModelConfigFromIntentConfig } from "./decide-model-config.mjs";
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
const ALL_INTENTS = [
    'VQA',
    'default',
    'grounding',
    'planning'
];
class ModelConfigManager {
    calcIntentConfigMap(modelConfigFn) {
        const intentConfigMap = {
            VQA: void 0,
            default: void 0,
            grounding: void 0,
            planning: void 0
        };
        for (const i of ALL_INTENTS){
            const result = modelConfigFn({
                intent: i
            });
            if (!result) throw new Error(`The agent has an option named modelConfig is a function, but it return ${result} when call with intent ${i}, which should be a object.`);
            intentConfigMap[i] = result;
        }
        return intentConfigMap;
    }
    calcModelConfigMapBaseOnIntent(intentConfigMap) {
        const modelConfigMap = {
            VQA: void 0,
            default: void 0,
            grounding: void 0,
            planning: void 0
        };
        for (const i of ALL_INTENTS){
            const result = decideModelConfigFromIntentConfig(i, intentConfigMap[i]);
            modelConfigMap[i] = result;
        }
        return modelConfigMap;
    }
    calcModelConfigMapBaseOnEnv(allEnvConfig) {
        const modelConfigMap = {
            VQA: void 0,
            default: void 0,
            grounding: void 0,
            planning: void 0
        };
        for (const i of ALL_INTENTS){
            const result = decideModelConfigFromEnv(i, allEnvConfig);
            modelConfigMap[i] = result;
        }
        return modelConfigMap;
    }
    clearModelConfigMap() {
        if (this.isolatedMode) throw new Error('ModelConfigManager work in isolated mode, so clearModelConfigMap should not be called');
        this.modelConfigMap = void 0;
    }
    getModelConfig(intent) {
        if (this.isolatedMode) {
            if (!this.modelConfigMap) throw new Error('modelConfigMap is not initialized in isolated mode, which should not happen');
            return this.modelConfigMap[intent];
        }
        if (!this.modelConfigMap) {
            if (!this.globalConfigManager) throw new Error('globalConfigManager is not registered, which should not happen');
            this.modelConfigMap = this.calcModelConfigMapBaseOnEnv(this.globalConfigManager.getAllEnvConfig());
        }
        return this.modelConfigMap[intent];
    }
    getUploadTestServerUrl() {
        const { openaiExtraConfig } = this.getModelConfig('default');
        const serverUrl = null == openaiExtraConfig ? void 0 : openaiExtraConfig.REPORT_SERVER_URL;
        return serverUrl;
    }
    registerGlobalConfigManager(globalConfigManager) {
        this.globalConfigManager = globalConfigManager;
    }
    throwErrorIfNonVLModel(intent = 'grounding') {
        const modelConfig = this.getModelConfig(intent);
        if (!modelConfig.vlMode) throw new Error('No visual language model (VL model) detected for the current scenario. Element localization may be inaccurate. Please verify your model configuration. Learn more: https://sqai.tech/choose-a-model');
    }
    constructor(modelConfigFn){
        _define_property(this, "modelConfigMap", void 0);
        _define_property(this, "isolatedMode", false);
        _define_property(this, "globalConfigManager", void 0);
        if (modelConfigFn) {
            this.isolatedMode = true;
            const intentConfigMap = this.calcIntentConfigMap(modelConfigFn);
            this.modelConfigMap = this.calcModelConfigMapBaseOnIntent(intentConfigMap);
        }
    }
}
export { ModelConfigManager };
