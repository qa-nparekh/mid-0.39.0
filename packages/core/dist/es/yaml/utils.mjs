import { getDebug } from "@sqaitech/shared/logger";
import { assert } from "@sqaitech/shared/utils";
import js_yaml from "js-yaml";
const debugUtils = getDebug('yaml:utils');
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
    const obj = js_yaml.load(interpolatedContent, {
        schema: js_yaml.JSON_SCHEMA
    });
    const pathTip = filePath ? `, failed to load ${filePath}` : '';
    assert(obj.tasks, `property "tasks" is required in yaml script ${pathTip}`);
    assert(Array.isArray(obj.tasks), `property "tasks" must be an array in yaml script, but got ${obj.tasks}`);
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
export { buildDetailedLocateParam, buildDetailedLocateParamAndRestParams, interpolateEnvVars, parseYamlScript };

//# sourceMappingURL=utils.mjs.map