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
    defineActionSwipe: ()=>defineActionSwipe,
    actionRightClickParamSchema: ()=>actionRightClickParamSchema,
    ActionSwipeParamSchema: ()=>ActionSwipeParamSchema,
    actionDoubleClickParamSchema: ()=>actionDoubleClickParamSchema,
    defineAction: ()=>defineAction,
    AbstractInterface: ()=>AbstractInterface,
    defineActionLongPress: ()=>defineActionLongPress,
    defineActionTap: ()=>defineActionTap,
    defineActionDragAndDrop: ()=>defineActionDragAndDrop,
    actionTapParamSchema: ()=>actionTapParamSchema,
    actionKeyboardPressParamSchema: ()=>actionKeyboardPressParamSchema,
    defineActionHover: ()=>defineActionHover,
    actionScrollParamSchema: ()=>actionScrollParamSchema,
    actionDragAndDropParamSchema: ()=>actionDragAndDropParamSchema,
    defineActionClearInput: ()=>defineActionClearInput,
    defineActionRightClick: ()=>defineActionRightClick,
    ActionLongPressParamSchema: ()=>ActionLongPressParamSchema,
    actionClearInputParamSchema: ()=>actionClearInputParamSchema,
    actionInputParamSchema: ()=>actionInputParamSchema,
    defineActionDoubleClick: ()=>defineActionDoubleClick,
    defineActionKeyboardPress: ()=>defineActionKeyboardPress,
    defineActionScroll: ()=>defineActionScroll,
    actionHoverParamSchema: ()=>actionHoverParamSchema,
    defineActionInput: ()=>defineActionInput
});
const index_js_namespaceObject = require("../ai-model/index.js");
const external_zod_namespaceObject = require("zod");
class AbstractInterface {
}
const defineAction = (config)=>config;
const actionTapParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be tapped')
});
const defineActionTap = (call)=>defineAction({
        name: 'Tap',
        description: 'Tap the element',
        interfaceAlias: 'aiTap',
        paramSchema: actionTapParamSchema,
        call
    });
const actionRightClickParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be right clicked')
});
const defineActionRightClick = (call)=>defineAction({
        name: 'RightClick',
        description: 'Right click the element',
        interfaceAlias: 'aiRightClick',
        paramSchema: actionRightClickParamSchema,
        call
    });
const actionDoubleClickParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be double clicked')
});
const defineActionDoubleClick = (call)=>defineAction({
        name: 'DoubleClick',
        description: 'Double click the element',
        interfaceAlias: 'aiDoubleClick',
        paramSchema: actionDoubleClickParamSchema,
        call
    });
const actionHoverParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be hovered')
});
const defineActionHover = (call)=>defineAction({
        name: 'Hover',
        description: 'Move the mouse to the element',
        interfaceAlias: 'aiHover',
        paramSchema: actionHoverParamSchema,
        call
    });
const actionInputParamSchema = external_zod_namespaceObject.z.object({
    value: external_zod_namespaceObject.z.union([
        external_zod_namespaceObject.z.string(),
        external_zod_namespaceObject.z.number()
    ]).transform((val)=>String(val)).describe('The text to input. Provide the final content for replace/append modes, or an empty string when using clear mode to remove existing text.'),
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be input').optional(),
    mode: external_zod_namespaceObject.z["enum"]([
        'replace',
        'clear',
        'append'
    ]).default('replace').optional().describe('Input mode: "replace" (default) - clear the field and input the value; "append" - append the value to existing content; "clear" - clear the field without inputting new text.')
});
const defineActionInput = (call)=>defineAction({
        name: 'Input',
        description: 'Input the value into the element',
        interfaceAlias: 'aiInput',
        paramSchema: actionInputParamSchema,
        call
    });
const actionKeyboardPressParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be clicked before pressing the key').optional(),
    keyName: external_zod_namespaceObject.z.string().describe("The key to be pressed. Use '+' for key combinations, e.g., 'Control+A', 'Shift+Enter'")
});
const defineActionKeyboardPress = (call)=>defineAction({
        name: 'KeyboardPress',
        description: 'Press a key or key combination, like "Enter", "Tab", "Escape", or "Control+A", "Shift+Enter". Do not use this to type text.',
        interfaceAlias: 'aiKeyboardPress',
        paramSchema: actionKeyboardPressParamSchema,
        call
    });
const actionScrollParamSchema = external_zod_namespaceObject.z.object({
    direction: external_zod_namespaceObject.z["enum"]([
        'down',
        'up',
        'right',
        'left'
    ]).default('down').describe('The direction to scroll'),
    scrollType: external_zod_namespaceObject.z["enum"]([
        'once',
        'untilBottom',
        'untilTop',
        'untilRight',
        'untilLeft'
    ]).default('once').describe('The scroll type'),
    distance: external_zod_namespaceObject.z.number().nullable().optional().describe('The distance in pixels to scroll'),
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().optional().describe('The element to be scrolled')
});
const defineActionScroll = (call)=>defineAction({
        name: 'Scroll',
        description: 'Scroll the page or an element. The direction to scroll, the scroll type, and the distance to scroll. The distance is the number of pixels to scroll. If not specified, use `down` direction, `once` scroll type, and `null` distance.',
        interfaceAlias: 'aiScroll',
        paramSchema: actionScrollParamSchema,
        call
    });
const actionDragAndDropParamSchema = external_zod_namespaceObject.z.object({
    from: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The position to be dragged'),
    to: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The position to be dropped')
});
const defineActionDragAndDrop = (call)=>defineAction({
        name: 'DragAndDrop',
        description: 'Drag and drop the element',
        interfaceAlias: 'aiDragAndDrop',
        paramSchema: actionDragAndDropParamSchema,
        call
    });
const ActionLongPressParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The element to be long pressed'),
    duration: external_zod_namespaceObject.z.number().default(500).optional().describe('Long press duration in milliseconds')
});
const defineActionLongPress = (call)=>defineAction({
        name: 'LongPress',
        description: 'Long press the element',
        paramSchema: ActionLongPressParamSchema,
        call
    });
const ActionSwipeParamSchema = external_zod_namespaceObject.z.object({
    start: (0, index_js_namespaceObject.getMidsceneLocationSchema)().optional().describe('Starting point of the swipe gesture, if not specified, the center of the page will be used'),
    direction: external_zod_namespaceObject.z["enum"]([
        'up',
        'down',
        'left',
        'right'
    ]).optional().describe('The direction to swipe (required when using distance). The direction means the direction of the finger swipe.'),
    distance: external_zod_namespaceObject.z.number().optional().describe('The distance in pixels to swipe (mutually exclusive with end)'),
    end: (0, index_js_namespaceObject.getMidsceneLocationSchema)().optional().describe('Ending point of the swipe gesture (mutually exclusive with distance)'),
    duration: external_zod_namespaceObject.z.number().default(300).describe('Duration of the swipe gesture in milliseconds'),
    repeat: external_zod_namespaceObject.z.number().optional().describe('The number of times to repeat the swipe gesture. 1 for default, 0 for infinite (e.g. endless swipe until the end of the page)')
});
const defineActionSwipe = (call)=>defineAction({
        name: 'Swipe',
        description: 'Perform a swipe gesture. You must specify either "end" (target location) or "distance" + "direction" - they are mutually exclusive. Use "end" for precise location-based swipes, or "distance" + "direction" for relative movement.',
        paramSchema: ActionSwipeParamSchema,
        call
    });
const actionClearInputParamSchema = external_zod_namespaceObject.z.object({
    locate: (0, index_js_namespaceObject.getMidsceneLocationSchema)().describe('The input field to be cleared')
});
const defineActionClearInput = (call)=>defineAction({
        name: 'ClearInput',
        description: 'Clear the text content of an input field',
        interfaceAlias: 'aiClearInput',
        paramSchema: actionClearInputParamSchema,
        call
    });
exports.AbstractInterface = __webpack_exports__.AbstractInterface;
exports.ActionLongPressParamSchema = __webpack_exports__.ActionLongPressParamSchema;
exports.ActionSwipeParamSchema = __webpack_exports__.ActionSwipeParamSchema;
exports.actionClearInputParamSchema = __webpack_exports__.actionClearInputParamSchema;
exports.actionDoubleClickParamSchema = __webpack_exports__.actionDoubleClickParamSchema;
exports.actionDragAndDropParamSchema = __webpack_exports__.actionDragAndDropParamSchema;
exports.actionHoverParamSchema = __webpack_exports__.actionHoverParamSchema;
exports.actionInputParamSchema = __webpack_exports__.actionInputParamSchema;
exports.actionKeyboardPressParamSchema = __webpack_exports__.actionKeyboardPressParamSchema;
exports.actionRightClickParamSchema = __webpack_exports__.actionRightClickParamSchema;
exports.actionScrollParamSchema = __webpack_exports__.actionScrollParamSchema;
exports.actionTapParamSchema = __webpack_exports__.actionTapParamSchema;
exports.defineAction = __webpack_exports__.defineAction;
exports.defineActionClearInput = __webpack_exports__.defineActionClearInput;
exports.defineActionDoubleClick = __webpack_exports__.defineActionDoubleClick;
exports.defineActionDragAndDrop = __webpack_exports__.defineActionDragAndDrop;
exports.defineActionHover = __webpack_exports__.defineActionHover;
exports.defineActionInput = __webpack_exports__.defineActionInput;
exports.defineActionKeyboardPress = __webpack_exports__.defineActionKeyboardPress;
exports.defineActionLongPress = __webpack_exports__.defineActionLongPress;
exports.defineActionRightClick = __webpack_exports__.defineActionRightClick;
exports.defineActionScroll = __webpack_exports__.defineActionScroll;
exports.defineActionSwipe = __webpack_exports__.defineActionSwipe;
exports.defineActionTap = __webpack_exports__.defineActionTap;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AbstractInterface",
    "ActionLongPressParamSchema",
    "ActionSwipeParamSchema",
    "actionClearInputParamSchema",
    "actionDoubleClickParamSchema",
    "actionDragAndDropParamSchema",
    "actionHoverParamSchema",
    "actionInputParamSchema",
    "actionKeyboardPressParamSchema",
    "actionRightClickParamSchema",
    "actionScrollParamSchema",
    "actionTapParamSchema",
    "defineAction",
    "defineActionClearInput",
    "defineActionDoubleClick",
    "defineActionDragAndDrop",
    "defineActionHover",
    "defineActionInput",
    "defineActionKeyboardPress",
    "defineActionLongPress",
    "defineActionRightClick",
    "defineActionScroll",
    "defineActionSwipe",
    "defineActionTap"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map