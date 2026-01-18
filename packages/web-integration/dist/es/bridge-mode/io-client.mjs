import { assert } from "@sqaitech/shared/utils";
import { io } from "socket.io-client";
import { BridgeEvent } from "./common.mjs";
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class BridgeClient {
    async connect() {
        return new Promise((resolve, reject)=>{
            this.socket = io(this.endpoint, {
                reconnection: false,
                query: {
                    version: "0.5.0"
                }
            });
            const timeout = setTimeout(()=>{
                try {
                    var _this_socket, _this_socket1;
                    null == (_this_socket = this.socket) || _this_socket.offAny();
                    null == (_this_socket1 = this.socket) || _this_socket1.close();
                } catch (e) {
                    console.warn('got error when offing socket', e);
                }
                this.socket = null;
                reject(new Error('failed to connect to bridge server after timeout'));
            }, 1000);
            this.socket.on('disconnect', (reason)=>{
                var _this_onDisconnect, _this;
                this.socket = null;
                null == (_this_onDisconnect = (_this = this).onDisconnect) || _this_onDisconnect.call(_this);
            });
            this.socket.on('connect_error', (e)=>{
                console.error('bridge-connect-error', e);
                reject(new Error(e || 'bridge connect error'));
            });
            this.socket.on(BridgeEvent.Connected, (payload)=>{
                clearTimeout(timeout);
                this.serverVersion = (null == payload ? void 0 : payload.version) || 'unknown';
                resolve(this.socket);
            });
            this.socket.on(BridgeEvent.Refused, (e)=>{
                console.error('bridge-refused', e);
                try {
                    var _this_socket;
                    null == (_this_socket = this.socket) || _this_socket.disconnect();
                } catch (e) {}
                reject(new Error(e || 'bridge refused'));
            });
            this.socket.on(BridgeEvent.Call, (call)=>{
                const id = call.id;
                assert(void 0 !== id, 'call id is required');
                (async ()=>{
                    var _this_socket;
                    let response;
                    try {
                        response = await this.onBridgeCall(call.method, call.args);
                    } catch (e) {
                        var _this_socket1;
                        const errorContent = `Error from bridge client when calling, method: ${call.method}, args: ${call.args}, error: ${(null == e ? void 0 : e.message) || e}\n${(null == e ? void 0 : e.stack) || ''}`;
                        console.error(errorContent);
                        return null == (_this_socket1 = this.socket) ? void 0 : _this_socket1.emit(BridgeEvent.CallResponse, {
                            id,
                            error: errorContent
                        });
                    }
                    null == (_this_socket = this.socket) || _this_socket.emit(BridgeEvent.CallResponse, {
                        id,
                        response
                    });
                })();
            });
        });
    }
    disconnect() {
        var _this_socket;
        null == (_this_socket = this.socket) || _this_socket.disconnect();
        this.socket = null;
    }
    constructor(endpoint, onBridgeCall, onDisconnect){
        _define_property(this, "endpoint", void 0);
        _define_property(this, "onBridgeCall", void 0);
        _define_property(this, "onDisconnect", void 0);
        _define_property(this, "socket", void 0);
        _define_property(this, "serverVersion", void 0);
        this.endpoint = endpoint;
        this.onBridgeCall = onBridgeCall;
        this.onDisconnect = onDisconnect;
        this.socket = null;
        this.serverVersion = null;
    }
}
export { BridgeClient };

//# sourceMappingURL=io-client.mjs.map