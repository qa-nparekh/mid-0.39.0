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
    interpolateEnvVars: ()=>interpolateEnvVars,
    parseYamlScript: ()=>parseYamlScript,
    buildDetailedLocateParam: ()=>buildDetailedLocateParam,
    buildDetailedLocateParamAndRestParams: ()=>buildDetailedLocateParamAndRestParams
});
const logger_namespaceObject = require("@sqai/shared/logger");
const utils_namespaceObject = require("@sqai/shared/utils");
const external_js_yaml_namespaceObject = require("js-yaml");
var external_js_yaml_default = /*#__PURE__*/ __webpack_require__.n(external_js_yaml_namespaceObject);
const debugUtils = (0, logger_namespaceObject.getDebug)('yaml:utils');
function interpolateEnvVars(content) {
    const lines = content.split('\n');
    const processedLines = lines.map((line)=>{
        const trimmedLine = line.trimStart();
        if (trimmedLine.startsWith('#')) return line;
        return line.replace(/\$\{([^}]+)\}/g, (_, envVar)=>{
            const value = process.env[envVar.trim()];
            if (void 0 === value) throw new Error(`Environment variable "${envVar.trim()}" is not defined`);
            return value;
        });
    });
    return processedLines.join('\n');
}
function parseYamlScript(content, filePath) {
    let processedContent = content;
    if (-1 !== content.indexOf('android') && content.match(/deviceId:\s*(\d+)/)) {
        let matchedDeviceId;
        processedContent = content.replace(/deviceId:\s*(\d+)/g, (match, deviceId)=>{
            matchedDeviceId = deviceId;
            return `deviceId: '${deviceId}'`;
        });
        console.warn(`please use string-style deviceId in yaml script, for example: deviceId: "${matchedDeviceId}"`);
    }
    const interpolatedContent = interpolateEnvVars(processedContent);
    const obj = external_js_yaml_default().load(interpolatedContent, {
        schema: external_js_yaml_default().JSON_SCHEMA
    });
    const pathTip = filePath ? `, failed to load ${filePath}` : '';
    (0, utils_namespaceObject.assert)(obj.tasks, `property "tasks" is required in yaml script ${pathTip}`);
    (0, utils_namespaceObject.assert)(Array.isArray(obj.tasks), `property "tasks" must be an array in yaml script, but got ${obj.tasks}`);
    return obj;
}
function buildDetailedLocateParam(locatePrompt, opt) {
    debugUtils('will call buildDetailedLocateParam', locatePrompt, opt);
    let prompt = locatePrompt || (null == opt ? void 0 : opt.prompt) || (null == opt ? void 0 : opt.locate);
    let deepThink = false;
    let cacheable = true;
    let xpath;
    if ('object' == typeof opt && null !== opt) {
        deepThink = opt.deepThink ?? false;
        cacheable = opt.cacheable ?? true;
        xpath = opt.xpath;
        if (locatePrompt && opt.prompt && locatePrompt !== opt.prompt) console.warn('conflict prompt for item', locatePrompt, opt, 'maybe you put the prompt in the wrong place');
        prompt = prompt || opt.prompt;
    }
    if (!prompt) return void debugUtils('no prompt, will return undefined in buildDetailedLocateParam', opt);
    return {
        prompt,
        deepThink,
        cacheable,
        xpath
    };
}
function buildDetailedLocateParamAndRestParams(locatePrompt, opt, excludeKeys = []) {
    const locateParam = buildDetailedLocateParam(locatePrompt, opt);
    const restParams = {};
    if ('object' == typeof opt && null !== opt) {
        const allKeys = Object.keys(opt);
        const locateParamKeys = Object.keys(locateParam || {});
        for (const key of allKeys)if (!locateParamKeys.includes(key) && !excludeKeys.includes(key) && 'locate' !== key) restParams[key] = opt[key];
    }
    return {
        locateParam,
        restParams
    };
}
exports.buildDetailedLocateParam = __webpack_exports__.buildDetailedLocateParam;
exports.buildDetailedLocateParamAndRestParams = __webpack_exports__.buildDetailedLocateParamAndRestParams;
exports.interpolateEnvVars = __webpack_exports__.interpolateEnvVars;
exports.parseYamlScript = __webpack_exports__.parseYamlScript;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "buildDetailedLocateParam",
    "buildDetailedLocateParamAndRestParams",
    "interpolateEnvVars",
    "parseYamlScript"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=utils.js.map