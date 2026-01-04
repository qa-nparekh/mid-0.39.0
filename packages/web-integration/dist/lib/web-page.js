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
    getKeyCommands: ()=>getKeyCommands,
    commonWebActionsForWebPage: ()=>commonWebActionsForWebPage,
    AbstractWebPage: ()=>AbstractWebPage
});
const external_node_assert_namespaceObject = require("node:assert");
var external_node_assert_default = /*#__PURE__*/ __webpack_require__.n(external_node_assert_namespaceObject);
const device_namespaceObject = require("@sqaitech/core/device");
const utils_namespaceObject = require("@sqaitech/core/utils");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const us_keyboard_layout_namespaceObject = require("@sqaitech/shared/us-keyboard-layout");
const debug = (0, logger_namespaceObject.getDebug)('web:page');
function normalizeKeyInputs(value) {
    const inputs = Array.isArray(value) ? value : [
        value
    ];
    const result = [];
    for (const input of inputs){
        if ('string' != typeof input) {
            result.push(input);
            continue;
        }
        const trimmed = input.trim();
        if (!trimmed) {
            result.push(input);
            continue;
        }
        let normalized = trimmed;
        if (normalized.length > 1 && normalized.includes('+')) normalized = normalized.replace(/\s*\+\s*/g, ' ');
        if (/\s/.test(normalized)) normalized = normalized.replace(/\s+/g, ' ');
        const transformed = (0, us_keyboard_layout_namespaceObject.transformHotkeyInput)(normalized);
        if (1 === transformed.length && '' === transformed[0] && '' !== trimmed) {
            result.push(input);
            continue;
        }
        if (0 === transformed.length) {
            result.push(input);
            continue;
        }
        result.push(...transformed);
    }
    return result;
}
function getKeyCommands(value) {
    const keys = normalizeKeyInputs(value);
    return keys.reduce((acc, k)=>{
        const includeMeta = keys.includes('Meta') || keys.includes('Control');
        if (includeMeta && ('a' === k || 'A' === k)) return acc.concat([
            {
                key: k,
                command: 'SelectAll'
            }
        ]);
        if (includeMeta && ('c' === k || 'C' === k)) return acc.concat([
            {
                key: k,
                command: 'Copy'
            }
        ]);
        if (includeMeta && ('v' === k || 'V' === k)) return acc.concat([
            {
                key: k,
                command: 'Paste'
            }
        ]);
        return acc.concat([
            {
                key: k
            }
        ]);
    }, []);
}
class AbstractWebPage extends device_namespaceObject.AbstractInterface {
    get mouse() {
        return {
            click: async (x, y, options)=>{},
            wheel: async (deltaX, deltaY)=>{},
            move: async (x, y)=>{},
            drag: async (from, to)=>{}
        };
    }
    get keyboard() {
        return {
            type: async (text)=>{},
            press: async (action)=>{}
        };
    }
    async clearInput(element) {}
}
const commonWebActionsForWebPage = (page)=>[
        (0, device_namespaceObject.defineActionTap)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot tap');
            await page.mouse.click(element.center[0], element.center[1], {
                button: 'left'
            });
        }),
        (0, device_namespaceObject.defineActionRightClick)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot right click');
            await page.mouse.click(element.center[0], element.center[1], {
                button: 'right'
            });
        }),
        (0, device_namespaceObject.defineActionDoubleClick)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot double click');
            await page.mouse.click(element.center[0], element.center[1], {
                button: 'left',
                count: 2
            });
        }),
        (0, device_namespaceObject.defineActionHover)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot hover');
            await page.mouse.move(element.center[0], element.center[1]);
        }),
        (0, device_namespaceObject.defineActionInput)(async (param)=>{
            const element = param.locate;
            if (element && 'append' !== param.mode) await page.clearInput(element);
            if ('clear' === param.mode) return;
            if (!param || !param.value) return;
            await page.keyboard.type(param.value);
        }),
        (0, device_namespaceObject.defineActionKeyboardPress)(async (param)=>{
            const element = param.locate;
            if (element) await page.mouse.click(element.center[0], element.center[1], {
                button: 'left'
            });
            const keys = getKeyCommands(param.keyName);
            await page.keyboard.press(keys);
        }),
        (0, device_namespaceObject.defineActionScroll)(async (param)=>{
            const element = param.locate;
            const startingPoint = element ? {
                left: element.center[0],
                top: element.center[1]
            } : void 0;
            const scrollToEventName = null == param ? void 0 : param.scrollType;
            if ('untilTop' === scrollToEventName) await page.scrollUntilTop(startingPoint);
            else if ('untilBottom' === scrollToEventName) await page.scrollUntilBottom(startingPoint);
            else if ('untilRight' === scrollToEventName) await page.scrollUntilRight(startingPoint);
            else if ('untilLeft' === scrollToEventName) await page.scrollUntilLeft(startingPoint);
            else if ('once' !== scrollToEventName && scrollToEventName) throw new Error(`Unknown scroll event type: ${scrollToEventName}, param: ${JSON.stringify(param)}`);
            else {
                if ((null == param ? void 0 : param.direction) !== 'down' && param && param.direction) if ('up' === param.direction) await page.scrollUp(param.distance || void 0, startingPoint);
                else if ('left' === param.direction) await page.scrollLeft(param.distance || void 0, startingPoint);
                else if ('right' === param.direction) await page.scrollRight(param.distance || void 0, startingPoint);
                else throw new Error(`Unknown scroll direction: ${param.direction}`);
                else await page.scrollDown((null == param ? void 0 : param.distance) || void 0, startingPoint);
                await (0, utils_namespaceObject.sleep)(500);
            }
        }),
        (0, device_namespaceObject.defineActionDragAndDrop)(async (param)=>{
            const from = param.from;
            const to = param.to;
            external_node_assert_default()(from, 'missing "from" param for drag and drop');
            external_node_assert_default()(to, 'missing "to" param for drag and drop');
            await page.mouse.drag({
                x: from.center[0],
                y: from.center[1]
            }, {
                x: to.center[0],
                y: to.center[1]
            });
        }),
        (0, device_namespaceObject.defineActionLongPress)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot long press');
            const duration = null == param ? void 0 : param.duration;
            await page.longPress(element.center[0], element.center[1], duration);
        }),
        (0, device_namespaceObject.defineActionSwipe)(async (param)=>{
            const { width, height } = await page.size();
            const { start, end } = param;
            const startPoint = start ? {
                x: start.center[0],
                y: start.center[1]
            } : {
                x: width / 2,
                y: height / 2
            };
            let endPoint;
            if (end) endPoint = {
                x: end.center[0],
                y: end.center[1]
            };
            else if (param.distance) {
                const direction = param.direction;
                if (!direction) throw new Error('direction is required for swipe gesture');
                endPoint = {
                    x: startPoint.x + ('right' === direction ? param.distance : 'left' === direction ? -param.distance : 0),
                    y: startPoint.y + ('down' === direction ? param.distance : 'up' === direction ? -param.distance : 0)
                };
            } else throw new Error('Either end or distance must be specified for swipe gesture');
            endPoint.x = Math.max(0, Math.min(endPoint.x, width));
            endPoint.y = Math.max(0, Math.min(endPoint.y, height));
            const duration = param.duration;
            debug(`swipe from ${startPoint.x}, ${startPoint.y} to ${endPoint.x}, ${endPoint.y} with duration ${duration}ms, repeat is set to ${param.repeat}`);
            let repeat = 'number' == typeof param.repeat ? param.repeat : 1;
            if (0 === repeat) repeat = 10;
            for(let i = 0; i < repeat; i++)await page.swipe(startPoint, endPoint, duration);
        }),
        (0, device_namespaceObject.defineActionClearInput)(async (param)=>{
            const element = param.locate;
            external_node_assert_default()(element, 'Element not found, cannot clear input');
            await page.clearInput(element);
        })
    ];
exports.AbstractWebPage = __webpack_exports__.AbstractWebPage;
exports.commonWebActionsForWebPage = __webpack_exports__.commonWebActionsForWebPage;
exports.getKeyCommands = __webpack_exports__.getKeyCommands;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AbstractWebPage",
    "commonWebActionsForWebPage",
    "getKeyCommands"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=web-page.js.map