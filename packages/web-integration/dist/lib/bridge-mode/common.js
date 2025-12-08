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
    BridgeCallTimeout: ()=>BridgeCallTimeout,
    BridgeErrorCodeNoClientConnected: ()=>BridgeErrorCodeNoClientConnected,
    BridgeEvent: ()=>BridgeEvent,
    BridgePageType: ()=>BridgePageType,
    BridgeSignalKill: ()=>BridgeSignalKill,
    DefaultBridgeServerPort: ()=>DefaultBridgeServerPort,
    DefaultLocalEndpoint: ()=>DefaultLocalEndpoint,
    KeyboardEvent: ()=>KeyboardEvent,
    MouseEvent: ()=>MouseEvent
});
const DefaultBridgeServerPort = 3766;
const DefaultLocalEndpoint = `http://127.0.0.1:${DefaultBridgeServerPort}`;
const BridgeCallTimeout = 30000;
var BridgeEvent = /*#__PURE__*/ function(BridgeEvent) {
    BridgeEvent["Call"] = "bridge-call";
    BridgeEvent["CallResponse"] = "bridge-call-response";
    BridgeEvent["UpdateAgentStatus"] = "bridge-update-agent-status";
    BridgeEvent["Message"] = "bridge-message";
    BridgeEvent["Connected"] = "bridge-connected";
    BridgeEvent["Refused"] = "bridge-refused";
    BridgeEvent["ConnectNewTabWithUrl"] = "connectNewTabWithUrl";
    BridgeEvent["ConnectCurrentTab"] = "connectCurrentTab";
    BridgeEvent["GetBrowserTabList"] = "getBrowserTabList";
    BridgeEvent["SetDestroyOptions"] = "setDestroyOptions";
    BridgeEvent["SetActiveTabId"] = "setActiveTabId";
    return BridgeEvent;
}({});
const BridgeSignalKill = 'MIDSCENE_BRIDGE_SIGNAL_KILL';
var MouseEvent = /*#__PURE__*/ function(MouseEvent) {
    MouseEvent["PREFIX"] = "mouse.";
    MouseEvent["Click"] = "mouse.click";
    MouseEvent["Wheel"] = "mouse.wheel";
    MouseEvent["Move"] = "mouse.move";
    MouseEvent["Drag"] = "mouse.drag";
    return MouseEvent;
}({});
var KeyboardEvent = /*#__PURE__*/ function(KeyboardEvent) {
    KeyboardEvent["PREFIX"] = "keyboard.";
    KeyboardEvent["Type"] = "keyboard.type";
    KeyboardEvent["Press"] = "keyboard.press";
    return KeyboardEvent;
}({});
const BridgePageType = 'page-over-chrome-extension-bridge';
const BridgeErrorCodeNoClientConnected = 'no-client-connected';
exports.BridgeCallTimeout = __webpack_exports__.BridgeCallTimeout;
exports.BridgeErrorCodeNoClientConnected = __webpack_exports__.BridgeErrorCodeNoClientConnected;
exports.BridgeEvent = __webpack_exports__.BridgeEvent;
exports.BridgePageType = __webpack_exports__.BridgePageType;
exports.BridgeSignalKill = __webpack_exports__.BridgeSignalKill;
exports.DefaultBridgeServerPort = __webpack_exports__.DefaultBridgeServerPort;
exports.DefaultLocalEndpoint = __webpack_exports__.DefaultLocalEndpoint;
exports.KeyboardEvent = __webpack_exports__.KeyboardEvent;
exports.MouseEvent = __webpack_exports__.MouseEvent;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "BridgeCallTimeout",
    "BridgeErrorCodeNoClientConnected",
    "BridgeEvent",
    "BridgePageType",
    "BridgeSignalKill",
    "DefaultBridgeServerPort",
    "DefaultLocalEndpoint",
    "KeyboardEvent",
    "MouseEvent"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=common.js.map