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
    resizeImageForUiTars: ()=>resizeImageForUiTars,
    uiTarsPlanning: ()=>uiTarsPlanning
});
const env_namespaceObject = require("@sqaitech/shared/env");
const img_namespaceObject = require("@sqaitech/shared/img");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const us_keyboard_layout_namespaceObject = require("@sqaitech/shared/us-keyboard-layout");
const utils_namespaceObject = require("@sqaitech/shared/utils");
const action_parser_namespaceObject = require("@ui-tars/action-parser");
const external_common_js_namespaceObject = require("./common.js");
const ui_tars_planning_js_namespaceObject = require("./prompt/ui-tars-planning.js");
const index_js_namespaceObject = require("./service-caller/index.js");
const debug = (0, logger_namespaceObject.getDebug)('ui-tars-planning');
const bboxSize = 10;
const pointToBbox = (point, width, height)=>[
        Math.round(Math.max(point.x - bboxSize / 2, 0)),
        Math.round(Math.max(point.y - bboxSize / 2, 0)),
        Math.round(Math.min(point.x + bboxSize / 2, width)),
        Math.round(Math.min(point.y + bboxSize / 2, height))
    ];
async function uiTarsPlanning(userInstruction, options) {
    const { conversationHistory, context, modelConfig } = options;
    const { uiTarsModelVersion } = modelConfig;
    const systemPrompt = (0, ui_tars_planning_js_namespaceObject.getUiTarsPlanningPrompt)() + userInstruction;
    const imagePayload = await resizeImageForUiTars(context.screenshotBase64, context.size, uiTarsModelVersion);
    conversationHistory.append({
        role: 'user',
        content: [
            {
                type: 'image_url',
                image_url: {
                    url: imagePayload
                }
            }
        ]
    });
    const res = await (0, index_js_namespaceObject.callAIWithStringResponse)([
        {
            role: 'user',
            content: systemPrompt
        },
        ...conversationHistory.snapshot()
    ], external_common_js_namespaceObject.AIActionType.INSPECT_ELEMENT, modelConfig);
    const convertedText = convertBboxToCoordinates(res.content);
    const { size } = context;
    const { parsed } = (0, action_parser_namespaceObject.actionParser)({
        prediction: convertedText,
        factor: [
            1000,
            1000
        ],
        screenContext: {
            width: size.width,
            height: size.height
        },
        modelVer: uiTarsModelVersion
    });
    debug('ui-tars modelVer', uiTarsModelVersion, ', parsed', JSON.stringify(parsed));
    const transformActions = [];
    let shouldContinue = true;
    parsed.forEach((action)=>{
        const actionType = (action.action_type || '').toLowerCase();
        if ('click' === actionType) {
            (0, utils_namespaceObject.assert)(action.action_inputs.start_box, 'start_box is required');
            const point = getPoint(action.action_inputs.start_box, size);
            transformActions.push({
                type: 'Tap',
                param: {
                    locate: {
                        prompt: action.thought || '',
                        bbox: pointToBbox({
                            x: point[0],
                            y: point[1]
                        }, size.width, size.height)
                    }
                }
            });
        } else if ('drag' === actionType) {
            (0, utils_namespaceObject.assert)(action.action_inputs.start_box, 'start_box is required');
            (0, utils_namespaceObject.assert)(action.action_inputs.end_box, 'end_box is required');
            const startPoint = getPoint(action.action_inputs.start_box, size);
            const endPoint = getPoint(action.action_inputs.end_box, size);
            transformActions.push({
                type: 'DragAndDrop',
                param: {
                    from: {
                        prompt: action.thought || '',
                        bbox: pointToBbox({
                            x: startPoint[0],
                            y: startPoint[1]
                        }, size.width, size.height)
                    },
                    to: {
                        prompt: action.thought || '',
                        bbox: pointToBbox({
                            x: endPoint[0],
                            y: endPoint[1]
                        }, size.width, size.height)
                    }
                },
                thought: action.thought || ''
            });
        } else if ('type' === actionType) transformActions.push({
            type: 'Input',
            param: {
                value: action.action_inputs.content
            },
            thought: action.thought || ''
        });
        else if ('scroll' === actionType) transformActions.push({
            type: 'Scroll',
            param: {
                direction: action.action_inputs.direction
            },
            thought: action.thought || ''
        });
        else if ('finished' === actionType) {
            shouldContinue = false;
            transformActions.push({
                type: 'Finished',
                param: {},
                thought: action.thought || ''
            });
        } else if ('hotkey' === actionType) if (action.action_inputs.key) {
            const keys = (0, us_keyboard_layout_namespaceObject.transformHotkeyInput)(action.action_inputs.key);
            transformActions.push({
                type: 'KeyboardPress',
                param: {
                    keyName: keys
                },
                thought: action.thought || ''
            });
        } else console.warn('No key found in action: hotkey. Will not perform action.');
        else if ('wait' === actionType) transformActions.push({
            type: 'Sleep',
            param: {
                timeMs: 1000
            },
            thought: action.thought || ''
        });
    });
    if (0 === transformActions.length) throw new Error(`No actions found, response: ${res.content}`, {
        cause: {
            prediction: res.content,
            parsed
        }
    });
    debug('transformActions', JSON.stringify(transformActions, null, 2));
    const log = (0, ui_tars_planning_js_namespaceObject.getSummary)(res.content);
    conversationHistory.append({
        role: 'assistant',
        content: log
    });
    return {
        actions: transformActions,
        log,
        usage: res.usage,
        rawResponse: JSON.stringify(res.content, void 0, 2),
        more_actions_needed_by_instruction: shouldContinue
    };
}
function convertBboxToCoordinates(text) {
    const pattern = /<bbox>(\d+)\s+(\d+)\s+(\d+)\s+(\d+)<\/bbox>/g;
    function replaceMatch(match, x1, y1, x2, y2) {
        const x1Num = Number.parseInt(x1, 10);
        const y1Num = Number.parseInt(y1, 10);
        const x2Num = Number.parseInt(x2, 10);
        const y2Num = Number.parseInt(y2, 10);
        const x = Math.floor((x1Num + x2Num) / 2);
        const y = Math.floor((y1Num + y2Num) / 2);
        return `(${x},${y})`;
    }
    const cleanedText = text.replace(/\[EOS\]/g, '');
    return cleanedText.replace(pattern, replaceMatch).trim();
}
function getPoint(startBox, size) {
    const [x, y] = JSON.parse(startBox);
    return [
        x * size.width,
        y * size.height
    ];
}
async function resizeImageForUiTars(imageBase64, size, uiTarsVersion) {
    if (uiTarsVersion === env_namespaceObject.UITarsModelVersion.V1_5) {
        debug('ui-tars-v1.5, will check image size', size);
        const currentPixels = size.width * size.height;
        const maxPixels = 12845056;
        if (currentPixels > maxPixels) {
            const resizeFactor = Math.sqrt(maxPixels / currentPixels);
            const newWidth = Math.floor(size.width * resizeFactor);
            const newHeight = Math.floor(size.height * resizeFactor);
            debug('resize image for ui-tars, new width: %s, new height: %s', newWidth, newHeight);
            const resizedImage = await (0, img_namespaceObject.resizeImgBase64)(imageBase64, {
                width: newWidth,
                height: newHeight
            });
            return resizedImage;
        }
    }
    return imageBase64;
}
exports.resizeImageForUiTars = __webpack_exports__.resizeImageForUiTars;
exports.uiTarsPlanning = __webpack_exports__.uiTarsPlanning;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "resizeImageForUiTars",
    "uiTarsPlanning"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=ui-tars-planning.js.map