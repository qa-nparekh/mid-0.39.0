"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
    timeCostStrElement: ()=>misc_index_js_namespaceObject.timeCostStrElement,
    StorageType: ()=>storage_provider_js_namespaceObject.StorageType,
    actionNameForType: ()=>playground_utils_js_namespaceObject.actionNameForType,
    PlaygroundResultView: ()=>playground_result_index_js_namespaceObject.PlaygroundResultView,
    timeStr: ()=>external_utils_index_js_namespaceObject.timeStr,
    EnvConfig: ()=>index_js_namespaceObject.EnvConfig,
    allScriptsFromDump: ()=>replay_scripts_js_namespaceObject.allScriptsFromDump,
    LocalStorageProvider: ()=>storage_provider_js_namespaceObject.LocalStorageProvider,
    UniversalPlaygroundDefault: ()=>universal_playground_index_js_default(),
    generateAnimationScripts: ()=>replay_scripts_js_namespaceObject.generateAnimationScripts,
    ShinyText: ()=>shiny_text_index_js_default(),
    getPlaceholderForType: ()=>playground_utils_js_namespaceObject.getPlaceholderForType,
    staticAgentFromContext: ()=>playground_utils_js_namespaceObject.staticAgentFromContext,
    useSafeOverrideAIConfig: ()=>useSafeOverrideAIConfig_js_namespaceObject.useSafeOverrideAIConfig,
    useServerValid: ()=>useServerValid_js_namespaceObject.useServerValid,
    ServiceModeControl: ()=>service_mode_control_index_js_namespaceObject.ServiceModeControl,
    BaseContextProvider: ()=>context_provider_js_namespaceObject.BaseContextProvider,
    colorForName: ()=>color_js_namespaceObject.colorForName,
    safeOverrideAIConfig: ()=>useSafeOverrideAIConfig_js_namespaceObject.safeOverrideAIConfig,
    Logo: ()=>logo_index_js_namespaceObject.Logo,
    UniversalPlayground: ()=>universal_playground_index_js_namespaceObject.UniversalPlayground,
    IndexedDBStorageProvider: ()=>storage_provider_js_namespaceObject.IndexedDBStorageProvider,
    NavActions: ()=>nav_actions_index_js_namespaceObject.NavActions,
    detectBestStorageType: ()=>storage_provider_js_namespaceObject.detectBestStorageType,
    useEnvConfig: ()=>store_js_namespaceObject.useEnvConfig,
    NoOpStorageProvider: ()=>storage_provider_js_namespaceObject.NoOpStorageProvider,
    ContextPreview: ()=>context_preview_index_js_namespaceObject.ContextPreview,
    PromptInput: ()=>prompt_input_index_js_namespaceObject.PromptInput,
    StaticContextProvider: ()=>context_provider_js_namespaceObject.StaticContextProvider,
    Blackboard: ()=>blackboard_index_js_namespaceObject.Blackboard,
    Player: ()=>player_index_js_namespaceObject.Player,
    AgentContextProvider: ()=>context_provider_js_namespaceObject.AgentContextProvider,
    EnvConfigReminder: ()=>env_config_reminder_index_js_namespaceObject.EnvConfigReminder,
    filterBase64Value: ()=>external_utils_index_js_namespaceObject.filterBase64Value,
    NoOpContextProvider: ()=>context_provider_js_namespaceObject.NoOpContextProvider,
    highlightColorForType: ()=>color_js_namespaceObject.highlightColorForType,
    createStorageProvider: ()=>storage_provider_js_namespaceObject.createStorageProvider,
    globalThemeConfig: ()=>color_js_namespaceObject.globalThemeConfig,
    MemoryStorageProvider: ()=>storage_provider_js_namespaceObject.MemoryStorageProvider,
    iconForStatus: ()=>misc_index_js_namespaceObject.iconForStatus
});
require("./component/playground/index.css");
require("./component/universal-playground/index.css");
const replay_scripts_js_namespaceObject = require("./utils/replay-scripts.js");
const store_js_namespaceObject = require("./store/store.js");
const color_js_namespaceObject = require("./utils/color.js");
const index_js_namespaceObject = require("./component/env-config/index.js");
const env_config_reminder_index_js_namespaceObject = require("./component/env-config-reminder/index.js");
const nav_actions_index_js_namespaceObject = require("./component/nav-actions/index.js");
const logo_index_js_namespaceObject = require("./component/logo/index.js");
const misc_index_js_namespaceObject = require("./component/misc/index.js");
const useServerValid_js_namespaceObject = require("./hooks/useServerValid.js");
const useSafeOverrideAIConfig_js_namespaceObject = require("./hooks/useSafeOverrideAIConfig.js");
const playground_result_index_js_namespaceObject = require("./component/playground-result/index.js");
const service_mode_control_index_js_namespaceObject = require("./component/service-mode-control/index.js");
const context_preview_index_js_namespaceObject = require("./component/context-preview/index.js");
const prompt_input_index_js_namespaceObject = require("./component/prompt-input/index.js");
const player_index_js_namespaceObject = require("./component/player/index.js");
const blackboard_index_js_namespaceObject = require("./component/blackboard/index.js");
const playground_utils_js_namespaceObject = require("./utils/playground-utils.js");
const external_utils_index_js_namespaceObject = require("./utils/index.js");
const shiny_text_index_js_namespaceObject = require("./component/shiny-text/index.js");
var shiny_text_index_js_default = /*#__PURE__*/ __webpack_require__.n(shiny_text_index_js_namespaceObject);
const universal_playground_index_js_namespaceObject = require("./component/universal-playground/index.js");
var universal_playground_index_js_default = /*#__PURE__*/ __webpack_require__.n(universal_playground_index_js_namespaceObject);
const storage_provider_js_namespaceObject = require("./component/universal-playground/providers/storage-provider.js");
const context_provider_js_namespaceObject = require("./component/universal-playground/providers/context-provider.js");
exports.AgentContextProvider = __webpack_exports__.AgentContextProvider;
exports.BaseContextProvider = __webpack_exports__.BaseContextProvider;
exports.Blackboard = __webpack_exports__.Blackboard;
exports.ContextPreview = __webpack_exports__.ContextPreview;
exports.EnvConfig = __webpack_exports__.EnvConfig;
exports.EnvConfigReminder = __webpack_exports__.EnvConfigReminder;
exports.IndexedDBStorageProvider = __webpack_exports__.IndexedDBStorageProvider;
exports.LocalStorageProvider = __webpack_exports__.LocalStorageProvider;
exports.Logo = __webpack_exports__.Logo;
exports.MemoryStorageProvider = __webpack_exports__.MemoryStorageProvider;
exports.NavActions = __webpack_exports__.NavActions;
exports.NoOpContextProvider = __webpack_exports__.NoOpContextProvider;
exports.NoOpStorageProvider = __webpack_exports__.NoOpStorageProvider;
exports.Player = __webpack_exports__.Player;
exports.PlaygroundResultView = __webpack_exports__.PlaygroundResultView;
exports.PromptInput = __webpack_exports__.PromptInput;
exports.ServiceModeControl = __webpack_exports__.ServiceModeControl;
exports.ShinyText = __webpack_exports__.ShinyText;
exports.StaticContextProvider = __webpack_exports__.StaticContextProvider;
exports.StorageType = __webpack_exports__.StorageType;
exports.UniversalPlayground = __webpack_exports__.UniversalPlayground;
exports.UniversalPlaygroundDefault = __webpack_exports__.UniversalPlaygroundDefault;
exports.actionNameForType = __webpack_exports__.actionNameForType;
exports.allScriptsFromDump = __webpack_exports__.allScriptsFromDump;
exports.colorForName = __webpack_exports__.colorForName;
exports.createStorageProvider = __webpack_exports__.createStorageProvider;
exports.detectBestStorageType = __webpack_exports__.detectBestStorageType;
exports.filterBase64Value = __webpack_exports__.filterBase64Value;
exports.generateAnimationScripts = __webpack_exports__.generateAnimationScripts;
exports.getPlaceholderForType = __webpack_exports__.getPlaceholderForType;
exports.globalThemeConfig = __webpack_exports__.globalThemeConfig;
exports.highlightColorForType = __webpack_exports__.highlightColorForType;
exports.iconForStatus = __webpack_exports__.iconForStatus;
exports.safeOverrideAIConfig = __webpack_exports__.safeOverrideAIConfig;
exports.staticAgentFromContext = __webpack_exports__.staticAgentFromContext;
exports.timeCostStrElement = __webpack_exports__.timeCostStrElement;
exports.timeStr = __webpack_exports__.timeStr;
exports.useEnvConfig = __webpack_exports__.useEnvConfig;
exports.useSafeOverrideAIConfig = __webpack_exports__.useSafeOverrideAIConfig;
exports.useServerValid = __webpack_exports__.useServerValid;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AgentContextProvider",
    "BaseContextProvider",
    "Blackboard",
    "ContextPreview",
    "EnvConfig",
    "EnvConfigReminder",
    "IndexedDBStorageProvider",
    "LocalStorageProvider",
    "Logo",
    "MemoryStorageProvider",
    "NavActions",
    "NoOpContextProvider",
    "NoOpStorageProvider",
    "Player",
    "PlaygroundResultView",
    "PromptInput",
    "ServiceModeControl",
    "ShinyText",
    "StaticContextProvider",
    "StorageType",
    "UniversalPlayground",
    "UniversalPlaygroundDefault",
    "actionNameForType",
    "allScriptsFromDump",
    "colorForName",
    "createStorageProvider",
    "detectBestStorageType",
    "filterBase64Value",
    "generateAnimationScripts",
    "getPlaceholderForType",
    "globalThemeConfig",
    "highlightColorForType",
    "iconForStatus",
    "safeOverrideAIConfig",
    "staticAgentFromContext",
    "timeCostStrElement",
    "timeStr",
    "useEnvConfig",
    "useSafeOverrideAIConfig",
    "useServerValid"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
