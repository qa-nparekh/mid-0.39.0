import { paddingToMatchBlockByBase64 } from "@sqai/shared/img";
import { getDebug } from "@sqai/shared/logger";
import { assert } from "@sqai/shared/utils";
import { AIActionType, buildYamlFlowFromPlans, fillBboxParam, findAllMidsceneLocatorField, markupImageForLLM, warnGPT4oSizeLimit } from "./common.mjs";
import { systemPromptToTaskPlanning } from "./prompt/llm-planning.mjs";
import { describeUserPage } from "./prompt/util.mjs";
import { callAIWithObjectResponse } from "./service-caller/index.mjs";
const debug = getDebug('planning');
async function plan(userInstruction, opts) {
    var _opts_conversationHistory, _planFromAI_action;
    const { context, modelConfig, conversationHistory } = opts;
    const { screenshotBase64, size } = context;
    const { modelName, vlMode } = modelConfig;
    const { description: pageDescription, elementById } = await describeUserPage(context, {
        vlMode
    });
    const systemPrompt = await systemPromptToTaskPlanning({
        actionSpace: opts.actionSpace,
        vlMode: vlMode
    });
    let imagePayload = screenshotBase64;
    let imageWidth = size.width;
    let imageHeight = size.height;
    const rightLimit = imageWidth;
    const bottomLimit = imageHeight;
    if ('qwen-vl' === vlMode) {
        const paddedResult = await paddingToMatchBlockByBase64(imagePayload);
        imageWidth = paddedResult.width;
        imageHeight = paddedResult.height;
        imagePayload = paddedResult.imageBase64;
    } else if ('qwen3-vl' === vlMode) ;
    else if (!vlMode) imagePayload = await markupImageForLLM(screenshotBase64, context.tree, {
        width: imageWidth,
        height: imageHeight
    });
    warnGPT4oSizeLimit(size, modelName);
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
    const { content, usage } = await callAIWithObjectResponse(msgs, AIActionType.PLAN, modelConfig);
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
        yamlFlow: buildYamlFlowFromPlans(actions, opts.actionSpace, planFromAI.sleep)
    };
    assert(planFromAI, "can't get plans from AI");
    actions.forEach((action)=>{
        const type = action.type;
        const actionInActionSpace = opts.actionSpace.find((action)=>action.name === type);
        debug('actionInActionSpace matched', actionInActionSpace);
        const locateFields = actionInActionSpace ? findAllMidsceneLocatorField(actionInActionSpace.paramSchema) : [];
        debug('locateFields', locateFields);
        locateFields.forEach((field)=>{
            const locateResult = action.param[field];
            if (locateResult) if (vlMode) action.param[field] = fillBboxParam(locateResult, imageWidth, imageHeight, rightLimit, bottomLimit, vlMode);
            else {
                const element = elementById(locateResult);
                if (element) action.param[field].id = element.id;
            }
        });
    });
    assert(!planFromAI.error, `Failed to plan actions: ${planFromAI.error}`);
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
export { plan };

//# sourceMappingURL=llm-planning.mjs.map