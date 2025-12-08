import { getMidsceneLocationSchema } from "../ai-model/index.mjs";
import { z } from "zod";
class AbstractInterface {
}
const defineAction = (config)=>config;
const actionTapParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be tapped')
});
const defineActionTap = (call)=>defineAction({
        name: 'Tap',
        description: 'Tap the element',
        interfaceAlias: 'aiTap',
        paramSchema: actionTapParamSchema,
        call
    });
const actionRightClickParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be right clicked')
});
const defineActionRightClick = (call)=>defineAction({
        name: 'RightClick',
        description: 'Right click the element',
        interfaceAlias: 'aiRightClick',
        paramSchema: actionRightClickParamSchema,
        call
    });
const actionDoubleClickParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be double clicked')
});
const defineActionDoubleClick = (call)=>defineAction({
        name: 'DoubleClick',
        description: 'Double click the element',
        interfaceAlias: 'aiDoubleClick',
        paramSchema: actionDoubleClickParamSchema,
        call
    });
const actionHoverParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be hovered')
});
const defineActionHover = (call)=>defineAction({
        name: 'Hover',
        description: 'Move the mouse to the element',
        interfaceAlias: 'aiHover',
        paramSchema: actionHoverParamSchema,
        call
    });
const actionInputParamSchema = z.object({
    value: z.union([
        z.string(),
        z.number()
    ]).transform((val)=>String(val)).describe('The text to input. Provide the final content for replace/append modes, or an empty string when using clear mode to remove existing text.'),
    locate: getMidsceneLocationSchema().describe('The element to be input').optional(),
    mode: z["enum"]([
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
const actionKeyboardPressParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be clicked before pressing the key').optional(),
    keyName: z.string().describe("The key to be pressed. Use '+' for key combinations, e.g., 'Control+A', 'Shift+Enter'")
});
const defineActionKeyboardPress = (call)=>defineAction({
        name: 'KeyboardPress',
        description: 'Press a key or key combination, like "Enter", "Tab", "Escape", or "Control+A", "Shift+Enter". Do not use this to type text.',
        interfaceAlias: 'aiKeyboardPress',
        paramSchema: actionKeyboardPressParamSchema,
        call
    });
const actionScrollParamSchema = z.object({
    direction: z["enum"]([
        'down',
        'up',
        'right',
        'left'
    ]).default('down').describe('The direction to scroll'),
    scrollType: z["enum"]([
        'once',
        'untilBottom',
        'untilTop',
        'untilRight',
        'untilLeft'
    ]).default('once').describe('The scroll type'),
    distance: z.number().nullable().optional().describe('The distance in pixels to scroll'),
    locate: getMidsceneLocationSchema().optional().describe('The element to be scrolled')
});
const defineActionScroll = (call)=>defineAction({
        name: 'Scroll',
        description: 'Scroll the page or an element. The direction to scroll, the scroll type, and the distance to scroll. The distance is the number of pixels to scroll. If not specified, use `down` direction, `once` scroll type, and `null` distance.',
        interfaceAlias: 'aiScroll',
        paramSchema: actionScrollParamSchema,
        call
    });
const actionDragAndDropParamSchema = z.object({
    from: getMidsceneLocationSchema().describe('The position to be dragged'),
    to: getMidsceneLocationSchema().describe('The position to be dropped')
});
const defineActionDragAndDrop = (call)=>defineAction({
        name: 'DragAndDrop',
        description: 'Drag and drop the element',
        interfaceAlias: 'aiDragAndDrop',
        paramSchema: actionDragAndDropParamSchema,
        call
    });
const ActionLongPressParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The element to be long pressed'),
    duration: z.number().default(500).optional().describe('Long press duration in milliseconds')
});
const defineActionLongPress = (call)=>defineAction({
        name: 'LongPress',
        description: 'Long press the element',
        paramSchema: ActionLongPressParamSchema,
        call
    });
const ActionSwipeParamSchema = z.object({
    start: getMidsceneLocationSchema().optional().describe('Starting point of the swipe gesture, if not specified, the center of the page will be used'),
    direction: z["enum"]([
        'up',
        'down',
        'left',
        'right'
    ]).optional().describe('The direction to swipe (required when using distance). The direction means the direction of the finger swipe.'),
    distance: z.number().optional().describe('The distance in pixels to swipe (mutually exclusive with end)'),
    end: getMidsceneLocationSchema().optional().describe('Ending point of the swipe gesture (mutually exclusive with distance)'),
    duration: z.number().default(300).describe('Duration of the swipe gesture in milliseconds'),
    repeat: z.number().optional().describe('The number of times to repeat the swipe gesture. 1 for default, 0 for infinite (e.g. endless swipe until the end of the page)')
});
const defineActionSwipe = (call)=>defineAction({
        name: 'Swipe',
        description: 'Perform a swipe gesture. You must specify either "end" (target location) or "distance" + "direction" - they are mutually exclusive. Use "end" for precise location-based swipes, or "distance" + "direction" for relative movement.',
        paramSchema: ActionSwipeParamSchema,
        call
    });
const actionClearInputParamSchema = z.object({
    locate: getMidsceneLocationSchema().describe('The input field to be cleared')
});
const defineActionClearInput = (call)=>defineAction({
        name: 'ClearInput',
        description: 'Clear the text content of an input field',
        interfaceAlias: 'aiClearInput',
        paramSchema: actionClearInputParamSchema,
        call
    });
export { AbstractInterface, ActionLongPressParamSchema, ActionSwipeParamSchema, actionClearInputParamSchema, actionDoubleClickParamSchema, actionDragAndDropParamSchema, actionHoverParamSchema, actionInputParamSchema, actionKeyboardPressParamSchema, actionRightClickParamSchema, actionScrollParamSchema, actionTapParamSchema, defineAction, defineActionClearInput, defineActionDoubleClick, defineActionDragAndDrop, defineActionHover, defineActionInput, defineActionKeyboardPress, defineActionLongPress, defineActionRightClick, defineActionScroll, defineActionSwipe, defineActionTap };

//# sourceMappingURL=index.mjs.map