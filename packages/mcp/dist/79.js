"use strict";
exports.ids = [
    "79"
];
exports.modules = {
    "../../node_modules/.pnpm/puppeteer-core@24.2.0_bufferutil@4.0.9_utf-8-validate@6.0.5/node_modules/puppeteer-core/lib/esm/puppeteer/common/BrowserWebSocketTransport.js": function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, {
            BrowserWebSocketTransport: ()=>BrowserWebSocketTransport
        });
        class BrowserWebSocketTransport {
            static create(url) {
                return new Promise((resolve, reject)=>{
                    const ws = new WebSocket(url);
                    ws.addEventListener('open', ()=>resolve(new BrowserWebSocketTransport(ws)));
                    ws.addEventListener('error', reject);
                });
            }
            #ws;
            onmessage;
            onclose;
            constructor(ws){
                this.#ws = ws;
                this.#ws.addEventListener('message', (event)=>{
                    if (this.onmessage) this.onmessage.call(null, event.data);
                });
                this.#ws.addEventListener('close', ()=>{
                    if (this.onclose) this.onclose.call(null);
                });
                this.#ws.addEventListener('error', ()=>{});
            }
            send(message) {
                this.#ws.send(message);
            }
            close() {
                this.#ws.close();
            }
        }
    }
};
