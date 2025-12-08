import { assert } from "../utils.mjs";
const maskKey = (key, maskChar = '*')=>{
    if ('string' != typeof key || 0 === key.length) return key;
    const prefixLen = 3;
    const suffixLen = 3;
    const keepLength = prefixLen + suffixLen;
    if (key.length <= keepLength) return key;
    const prefix = key.substring(0, prefixLen);
    const suffix = key.substring(key.length - suffixLen);
    const maskLength = key.length - keepLength;
    const mask = maskChar.repeat(maskLength);
    return `${prefix}${mask}${suffix}`;
};
const maskConfig = (config)=>Object.fromEntries(Object.entries(config).map(([key, value])=>{
        if ([
            'openaiApiKey',
            'azureOpenaiKey',
            'anthropicApiKey'
        ].includes(key)) return [
            key,
            maskKey(value)
        ];
        if ([
            'openaiExtraConfig',
            'azureExtraConfig'
        ].includes(key)) return [
            key,
            maskKey(JSON.stringify(value))
        ];
        return [
            key,
            value
        ];
    }));
const parseJson = (key, value)=>{
    if (value) try {
        return JSON.parse(value);
    } catch (e) {
        throw new Error(`Failed to parse ${key} as a JSON. ${e.message}`, {
            cause: e
        });
    }
};
const createAssert = (modelNameKey, provider, modelName)=>(value, key, modelVendorFlag)=>{
        if (modelName) modelVendorFlag ? assert(value, `The ${key} must be a non-empty string because of the ${modelNameKey} is declared as ${modelName} and ${modelVendorFlag} has also been specified in ${provider}, but got: ${value}. Please check your config.`) : assert(value, `The ${key} must be a non-empty string because of the ${modelNameKey} is declared as ${modelName} in ${provider}, but got: ${value}. Please check your config.`);
        else assert(value, `The ${key} must be a non-empty string, but got: ${value}. Please check your config.`);
    };
export { createAssert, maskConfig, parseJson };
