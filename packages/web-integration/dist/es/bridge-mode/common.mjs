const DefaultBridgeServerPort = 3766;
const DefaultLocalEndpoint = `http://127.0.0.1:${DefaultBridgeServerPort}`;
const BridgeCallTimeout = 30000;
var common_BridgeEvent = /*#__PURE__*/ function(BridgeEvent) {
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
var common_MouseEvent = /*#__PURE__*/ function(MouseEvent) {
    MouseEvent["PREFIX"] = "mouse.";
    MouseEvent["Click"] = "mouse.click";
    MouseEvent["Wheel"] = "mouse.wheel";
    MouseEvent["Move"] = "mouse.move";
    MouseEvent["Drag"] = "mouse.drag";
    return MouseEvent;
}({});
var common_KeyboardEvent = /*#__PURE__*/ function(KeyboardEvent) {
    KeyboardEvent["PREFIX"] = "keyboard.";
    KeyboardEvent["Type"] = "keyboard.type";
    KeyboardEvent["Press"] = "keyboard.press";
    return KeyboardEvent;
}({});
const BridgePageType = 'page-over-chrome-extension-bridge';
const BridgeErrorCodeNoClientConnected = 'no-client-connected';
export { BridgeCallTimeout, BridgeErrorCodeNoClientConnected, common_BridgeEvent as BridgeEvent, BridgePageType, BridgeSignalKill, DefaultBridgeServerPort, DefaultLocalEndpoint, common_KeyboardEvent as KeyboardEvent, common_MouseEvent as MouseEvent };

//# sourceMappingURL=common.mjs.map