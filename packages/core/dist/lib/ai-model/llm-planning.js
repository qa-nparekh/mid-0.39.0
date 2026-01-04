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
    plan: ()=>plan
});
const img_namespaceObject = require("@sqaitech/shared/img");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const utils_namespaceObject = require("@sqaitech/shared/utils");
const external_common_js_namespaceObject = require("./common.js");
const llm_planning_js_namespaceObject = require("./prompt/llm-planning.js");
const util_js_namespaceObject = require("./prompt/util.js");
const index_js_namespaceObject = require("./service-caller/index.js");
const debug = (0, logger_namespaceObject.getDebug)('planning');
async function plan(userInstruction, opts) {
    var _opts_conversationHistory, _planFromAI_action;
    const { context, modelConfig, conversationHistory } = opts;
    const { screenshotBase64, size } = context;
    const { modelName, vlMode } = modelConfig;
    const { description: pageDescription, elementById } = await (0, util_js_namespaceObject.describeUserPage)(context, {
        vlMode
    });
    const systemPrompt = await (0, llm_planning_js_namespaceObject.systemPromptToTaskPlanning)({
        actionSpace: opts.actionSpace,
        vlMode: vlMode
    });
    let imagePayload = screenshotBase64;
    let imageWidth = size.width;
    let imageHeight = size.height;
    const rightLimit = imageWidth;
    const bottomLimit = imageHeight;
    if ('qwen-vl' === vlMode) {
        const paddedResult = await (0, img_namespaceObject.paddingToMatchBlockByBase64)(imagePayload);
        imageWidth = paddedResult.width;
        imageHeight = paddedResult.height;
        imagePayload = paddedResult.imageBase64;
    } else if ('qwen3-vl' === vlMode) ;
    else if (!vlMode) imagePayload = await (0, external_common_js_namespaceObject.markupImageForLLM)(screenshotBase64, context.tree, {
        width: imageWidth,
        height: imageHeight
    });
    (0, external_common_js_namespaceObject.warnGPT4oSizeLimit)(size, modelName);
    const historyLog = (null == (_opts_conversationHistory = opts.conversationHistory) ? void 0 : _opts_conversationHistory.snapshot()) || [];
    const knowledgeContext = opts.actionContext ? [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: `<high_priority_knowledge>${opts.actionContext}</high_priority_knowledge>`
                }
            ]
        }
    ] : [];
    const instruction = [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: `<user_instruction>${userInstruction}</user_instruction>`
                }
            ]
        }
    ];
    const msgs = [
        {
            role: 'system',
            content: systemPrompt
        },
        ...knowledgeContext,
        ...instruction,
        ...historyLog,
        {
            role: 'user',
            content: [
                {
                    type: 'image_url',
                    image_url: {
                        url: imagePayload,
                        detail: 'high'
                    }
                },
                ...vlMode ? [] : [
                    {
                        type: 'text',
                        text: pageDescription
                    }
                ]
            ]
        }
    ];
    const { content, usage } = await (0, index_js_namespaceObject.callAIWithObjectResponse)(msgs, external_common_js_namespaceObject.AIActionType.PLAN, modelConfig);
    const rawResponse = JSON.stringify(content, void 0, 2);
    const planFromAI = content;
    const actions = ((null == (_planFromAI_action = planFromAI.action) ? void 0 : _planFromAI_action.type) ? [
        planFromAI.action
    ] : planFromAI.actions) || [];
    const returnValue = {
        ...planFromAI,
        actions,
        rawResponse,
        usage,
        yamlFlow: (0, external_common_js_namespaceObject.buildYamlFlowFromPlans)(actions, opts.actionSpace, planFromAI.sleep)
    };
    (0, utils_namespaceObject.assert)(planFromAI, "can't get plans from AI");
    actions.forEach((action)=>{
        const type = action.type;
        const actionInActionSpace = opts.actionSpace.find((action)=>action.name === type);
        debug('actionInActionSpace matched', actionInActionSpace);
        const locateFields = actionInActionSpace ? (0, external_common_js_namespaceObject.findAllMidsceneLocatorField)(actionInActionSpace.paramSchema) : [];
        debug('locateFields', locateFields);
        locateFields.forEach((field)=>{
            const locateResult = action.param[field];
            if (locateResult) if (vlMode) action.param[field] = (0, external_common_js_namespaceObject.fillBboxParam)(locateResult, imageWidth, imageHeight, rightLimit, bottomLimit, vlMode);
            else {
                const element = elementById(locateResult);
                if (element) action.param[field].id = element.id;
            }
        });
    });
    (0, utils_namespaceObject.assert)(!planFromAI.error, `Failed to plan actions: ${planFromAI.error}`);
    if (0 === actions.length && returnValue.more_actions_needed_by_instruction && !returnValue.sleep) console.warn('No actions planned for the prompt, but model said more actions are needed:', userInstruction);
    null == conversationHistory || conversationHistory.append({
        role: 'assistant',
        content: [
            {
                type: 'text',
                text: rawResponse
            }
        ]
    });
    null == conversationHistory || conversationHistory.append({
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'I have finished the action previously planned'
            }
        ]
    });
    return returnValue;
}
exports.plan = __webpack_exports__.plan;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "plan"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=llm-planning.js.map