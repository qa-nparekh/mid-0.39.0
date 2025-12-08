import { findAllMidsceneLocatorField } from "@sqai/core/ai-model";
import { buildDetailedLocateParam } from "@sqai/core/yaml";
const dataExtractionAPIs = [
    'aiQuery',
    'aiBoolean',
    'aiNumber',
    'aiString',
    'aiAsk'
];
const validationAPIs = [
    'aiAssert',
    'aiWaitFor'
];
const noReplayAPIs = [
    ...dataExtractionAPIs,
    ...validationAPIs
];
const formatErrorMessage = (e)=>{
    const errorMessage = (null == e ? void 0 : e.message) || '';
    if (errorMessage.includes('of different extension')) return 'Conflicting extension detected. Please disable the suspicious plugins and refresh the page. Guide: https://midscenejs.com/quick-experience.html#faq';
    if (errorMessage.includes('NOT_IMPLEMENTED_AS_DESIGNED')) return 'Further actions cannot be performed in the current environment';
    return errorMessage || 'Unknown error';
};
async function parseStructuredParams(action, params, options = {}) {
    if (!(null == action ? void 0 : action.paramSchema) || !('shape' in action.paramSchema)) return [
        params.prompt || '',
        options
    ];
    const schema = action.paramSchema;
    const keys = schema && 'shape' in schema ? Object.keys(schema.shape) : [];
    const paramObj = {
        ...options
    };
    keys.forEach((key)=>{
        if (void 0 !== params[key] && null !== params[key] && '' !== params[key]) paramObj[key] = params[key];
    });
    if (schema) {
        const locatorFieldKeys = findAllMidsceneLocatorField(schema);
        locatorFieldKeys.forEach((locateKey)=>{
            const locatePrompt = params[locateKey];
            if (locatePrompt && 'string' == typeof locatePrompt) {
                const detailedLocateParam = buildDetailedLocateParam(locatePrompt, {
                    deepThink: options.deepThink,
                    cacheable: true
                });
                if (detailedLocateParam) paramObj[locateKey] = detailedLocateParam;
            }
        });
    }
    return [
        paramObj
    ];
}
function validateStructuredParams(value, action) {
    if (!value.params) return {
        valid: false,
        errorMessage: 'Parameters are required'
    };
    if (!(null == action ? void 0 : action.paramSchema)) return {
        valid: true
    };
    try {
        var _action_paramSchema;
        const paramsForValidation = {
            ...value.params
        };
        const schema = action.paramSchema;
        if (schema) {
            const locatorFieldKeys = findAllMidsceneLocatorField(schema);
            locatorFieldKeys.forEach((key)=>{
                if ('string' == typeof paramsForValidation[key]) paramsForValidation[key] = {
                    midscene_location_field_flag: true,
                    prompt: paramsForValidation[key],
                    center: [
                        0,
                        0
                    ],
                    rect: {
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0
                    }
                };
            });
        }
        null == (_action_paramSchema = action.paramSchema) || _action_paramSchema.parse(paramsForValidation);
    } catch (error) {
        const zodError = error;
        if (zodError.errors && zodError.errors.length > 0) {
            const errorMessages = zodError.errors.filter((err)=>{
                const path = err.path.join('.');
                return !path.includes('center') && !path.includes('rect') && !path.includes('midscene_location_field_flag');
            }).map((err)=>{
                const field = err.path.join('.');
                return `${field}: ${err.message}`;
            });
            if (errorMessages.length > 0) return {
                valid: false,
                errorMessage: `Validation error: ${errorMessages.join(', ')}`
            };
        } else {
            const errorMsg = error instanceof Error ? error.message : 'Unknown validation error';
            return {
                valid: false,
                errorMessage: `Parameter validation failed: ${errorMsg}`
            };
        }
    }
    return {
        valid: true
    };
}
async function executeAction(activeAgent, actionType, actionSpace, value, options) {
    const action = null == actionSpace ? void 0 : actionSpace.find((a)=>a.interfaceAlias === actionType || a.name === actionType);
    if (action && 'function' == typeof activeAgent.callActionInActionSpace) if (value.params) {
        const parsedParams = await parseStructuredParams(action, value.params, options);
        return await activeAgent.callActionInActionSpace(action.name, parsedParams[0]);
    } else {
        const detailedLocateParam = value.prompt ? buildDetailedLocateParam(value.prompt, {
            deepThink: options.deepThink,
            cacheable: true
        }) : void 0;
        return await activeAgent.callActionInActionSpace(action.name, {
            locate: detailedLocateParam,
            ...options
        });
    }
    {
        const prompt = value.prompt;
        if ('aiAssert' === actionType) {
            var _activeAgent_aiAssert;
            const { pass, thought } = await (null == activeAgent ? void 0 : null == (_activeAgent_aiAssert = activeAgent.aiAssert) ? void 0 : _activeAgent_aiAssert.call(activeAgent, prompt || '', void 0, {
                keepRawResponse: true,
                ...options
            })) || {};
            return {
                pass: pass || false,
                thought: thought || ''
            };
        }
        if (activeAgent && 'function' == typeof activeAgent[actionType]) return await activeAgent[actionType](prompt, options);
        throw new Error(`Unknown action type: ${actionType}`);
    }
}
export { dataExtractionAPIs, executeAction, formatErrorMessage, noReplayAPIs, parseStructuredParams, validateStructuredParams, validationAPIs };

//# sourceMappingURL=common.mjs.map