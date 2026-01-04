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
    BridgeServer: ()=>BridgeServer,
    killRunningServer: ()=>killRunningServer
});
const utils_namespaceObject = require("@sqaitech/core/utils");
const shared_utils_namespaceObject = require("@sqaitech/shared/utils");
const external_socket_io_namespaceObject = require("socket.io");
const external_socket_io_client_namespaceObject = require("socket.io-client");
const external_common_js_namespaceObject = require("./common.js");
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
const killRunningServer = async (port)=>{
    try {
        const client = (0, external_socket_io_client_namespaceObject.io)(`ws://localhost:${port || external_common_js_namespaceObject.DefaultBridgeServerPort}`, {
            query: {
                [external_common_js_namespaceObject.BridgeSignalKill]: 1
            }
        });
        await (0, utils_namespaceObject.sleep)(100);
        await client.close();
    } catch (e) {}
};
class BridgeServer {
    async listen(opts = {}) {
        const { timeout = 30000 } = opts;
        if (this.closeConflictServer) await killRunningServer(this.port);
        return new Promise((resolve, reject)=>{
            if (this.listeningTimerFlag) return reject(new Error('already listening'));
            this.listeningTimerFlag = true;
            this.listeningTimeoutId = timeout ? setTimeout(()=>{
                reject(new Error(`no extension connected after ${timeout}ms (${external_common_js_namespaceObject.BridgeErrorCodeNoClientConnected})`));
            }, timeout) : null;
            this.connectionTipTimer = !timeout || timeout > 3000 ? setTimeout(()=>{
                (0, shared_utils_namespaceObject.logMsg)('waiting for bridge to connect...');
            }, 2000) : null;
            this.io = new external_socket_io_namespaceObject.Server(this.port, {
                maxHttpBufferSize: 104857600
            });
            this.io.httpServer.once('listening', ()=>{
                resolve();
            });
            this.io.httpServer.once('error', (err)=>{
                reject(new Error(`Bridge Listening Error: ${err.message}`));
            });
            this.io.use((socket, next)=>{
                if (this.socket) next(new Error('server already connected by another client'));
                next();
            });
            this.io.on('connection', (socket)=>{
                const url = socket.handshake.url;
                if (url.includes(external_common_js_namespaceObject.BridgeSignalKill)) {
                    console.warn('kill signal received, closing bridge server');
                    return this.close();
                }
                this.connectionLost = false;
                this.connectionLostReason = '';
                this.listeningTimeoutId && clearTimeout(this.listeningTimeoutId);
                this.listeningTimeoutId = null;
                this.connectionTipTimer && clearTimeout(this.connectionTipTimer);
                this.connectionTipTimer = null;
                if (this.socket) {
                    socket.emit(external_common_js_namespaceObject.BridgeEvent.Refused);
                    socket.disconnect();
                    return reject(new Error('server already connected by another client'));
                }
                try {
                    (0, shared_utils_namespaceObject.logMsg)('one client connected');
                    this.socket = socket;
                    const clientVersion = socket.handshake.query.version;
                    (0, shared_utils_namespaceObject.logMsg)(`Bridge connected, cli-side version v0.30.10, browser-side version v${clientVersion}`);
                    socket.on(external_common_js_namespaceObject.BridgeEvent.CallResponse, (params)=>{
                        const id = params.id;
                        const response = params.response;
                        const error = params.error;
                        this.triggerCallResponseCallback(id, error, response);
                    });
                    socket.on('disconnect', (reason)=>{
                        var _this_onDisconnect, _this;
                        this.connectionLost = true;
                        this.connectionLostReason = reason;
                        try {
                            var _this_io;
                            null == (_this_io = this.io) || _this_io.close();
                        } catch (e) {}
                        for(const id in this.calls){
                            const call = this.calls[id];
                            if (!call.responseTime) {
                                const errorMessage = this.connectionLostErrorMsg();
                                this.triggerCallResponseCallback(id, new Error(errorMessage), null);
                            }
                        }
                        null == (_this_onDisconnect = (_this = this).onDisconnect) || _this_onDisconnect.call(_this, reason);
                    });
                    setTimeout(()=>{
                        var _this_onConnect, _this;
                        null == (_this_onConnect = (_this = this).onConnect) || _this_onConnect.call(_this);
                        const payload = {
                            version: "0.30.10"
                        };
                        socket.emit(external_common_js_namespaceObject.BridgeEvent.Connected, payload);
                        Promise.resolve().then(()=>{
                            for(const id in this.calls)if (0 === this.calls[id].callTime) this.emitCall(id);
                        });
                    }, 0);
                } catch (e) {
                    console.error('failed to handle connection event', e);
                    reject(e);
                }
            });
            this.io.on('close', ()=>{
                this.close();
            });
        });
    }
    async triggerCallResponseCallback(id, error, response) {
        const call = this.calls[id];
        if (!call) throw new Error(`call ${id} not found`);
        call.error = error || void 0;
        call.response = response;
        call.responseTime = Date.now();
        call.callback(call.error, response);
    }
    async emitCall(id) {
        const call = this.calls[id];
        if (!call) throw new Error(`call ${id} not found`);
        if (this.connectionLost) {
            const message = `Connection lost, reason: ${this.connectionLostReason}`;
            call.callback(new Error(message), null);
            return;
        }
        if (this.socket) {
            this.socket.emit(external_common_js_namespaceObject.BridgeEvent.Call, {
                id,
                method: call.method,
                args: call.args
            });
            call.callTime = Date.now();
        }
    }
    async call(method, args, timeout = external_common_js_namespaceObject.BridgeCallTimeout) {
        const id = `${this.callId++}`;
        return new Promise((resolve, reject)=>{
            const timeoutId = setTimeout(()=>{
                (0, shared_utils_namespaceObject.logMsg)(`bridge call timeout, id=${id}, method=${method}, args=`, args);
                this.calls[id].error = new Error(`Bridge call timeout after ${timeout}ms: ${method}`);
                reject(this.calls[id].error);
            }, timeout);
            this.calls[id] = {
                method,
                args,
                response: null,
                callTime: 0,
                responseTime: 0,
                callback: (error, response)=>{
                    clearTimeout(timeoutId);
                    if (error) reject(error);
                    else resolve(response);
                }
            };
            this.emitCall(id);
        });
    }
    async close() {
        var _this_io;
        this.listeningTimeoutId && clearTimeout(this.listeningTimeoutId);
        this.connectionTipTimer && clearTimeout(this.connectionTipTimer);
        const closeProcess = null == (_this_io = this.io) ? void 0 : _this_io.close();
        this.io = null;
        return closeProcess;
    }
    constructor(port, onConnect, onDisconnect, closeConflictServer){
        _define_property(this, "port", void 0);
        _define_property(this, "onConnect", void 0);
        _define_property(this, "onDisconnect", void 0);
        _define_property(this, "closeConflictServer", void 0);
        _define_property(this, "callId", void 0);
        _define_property(this, "io", void 0);
        _define_property(this, "socket", void 0);
        _define_property(this, "listeningTimeoutId", void 0);
        _define_property(this, "listeningTimerFlag", void 0);
        _define_property(this, "connectionTipTimer", void 0);
        _define_property(this, "calls", void 0);
        _define_property(this, "connectionLost", void 0);
        _define_property(this, "connectionLostReason", void 0);
        _define_property(this, "connectionLostErrorMsg", void 0);
        this.port = port;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.closeConflictServer = closeConflictServer;
        this.callId = 0;
        this.io = null;
        this.socket = null;
        this.listeningTimeoutId = null;
        this.listeningTimerFlag = false;
        this.connectionTipTimer = null;
        this.calls = {};
        this.connectionLost = false;
        this.connectionLostReason = '';
        this.connectionLostErrorMsg = ()=>`Connection lost, reason: ${this.connectionLostReason}`;
    }
}
exports.BridgeServer = __webpack_exports__.BridgeServer;
exports.killRunningServer = __webpack_exports__.killRunningServer;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "BridgeServer",
    "killRunningServer"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=io-server.js.map