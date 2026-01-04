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
    playgroundForAgent: ()=>playgroundForAgent
});
const external_node_child_process_namespaceObject = require("node:child_process");
const constants_namespaceObject = require("@sqaitech/shared/constants");
const external_cors_namespaceObject = require("cors");
var external_cors_default = /*#__PURE__*/ __webpack_require__.n(external_cors_namespaceObject);
const external_server_js_namespaceObject = require("./server.js");
var external_server_js_default = /*#__PURE__*/ __webpack_require__.n(external_server_js_namespaceObject);
function playgroundForAgent(agent) {
    return {
        async launch (options = {}) {
            const { port = constants_namespaceObject.PLAYGROUND_SERVER_PORT, openBrowser = true, browserCommand, verbose = true, id, enableCors = false, corsOptions = {
                origin: '*',
                credentials: true
            } } = options;
            const webPage = agent.interface;
            if (!webPage) throw new Error('Agent must have an interface property');
            if (verbose) {
                console.log("\uD83D\uDE80 Starting Midscene Playground...");
                console.log(`\u{1F4F1} Agent: ${agent.constructor.name}`);
                console.log(`\u{1F5A5}\u{FE0F} Page: ${webPage.constructor.name}`);
                console.log(`\u{1F310} Port: ${port}`);
                if (enableCors) console.log("\uD83D\uDD13 CORS enabled");
            }
            const server = new (external_server_js_default())(agent, void 0, id);
            if (enableCors) server.app.use(external_cors_default()(corsOptions));
            const launchedServer = await server.launch(port);
            if (verbose) console.log(`\u{2705} Playground server started on port ${port}`);
            const url = `http://127.0.0.1:${port}`;
            if (openBrowser) await openInBrowser(url, browserCommand, verbose);
            return {
                server: launchedServer,
                port,
                host: '127.0.0.1',
                close: async ()=>{
                    if (verbose) console.log("\uD83D\uDED1 Shutting down Midscene Playground...");
                    try {
                        await launchedServer.close();
                        if (verbose) console.log("\u2705 Playground shutdown complete");
                    } catch (error) {
                        if (verbose) console.error("\u274C Error during playground shutdown:", error);
                        throw error;
                    }
                }
            };
        }
    };
}
async function openInBrowser(url, customCommand, verbose = true) {
    return new Promise((resolve, reject)=>{
        let command;
        let args;
        if (customCommand) {
            command = customCommand;
            args = [
                url
            ];
        } else switch(process.platform){
            case 'darwin':
                command = 'open';
                args = [
                    url
                ];
                break;
            case 'win32':
                command = 'start';
                args = [
                    '',
                    url
                ];
                break;
            default:
                command = 'xdg-open';
                args = [
                    url
                ];
                break;
        }
        if (verbose) console.log(`\u{1F310} Opening browser: ${command} ${args.join(' ')}`);
        const child = (0, external_node_child_process_namespaceObject.spawn)(command, args, {
            detached: true,
            stdio: 'ignore'
        });
        child.on('error', (error)=>{
            if (verbose) {
                console.warn("\u26A0\uFE0F  Failed to open browser automatically:", error.message);
                console.log(`\u{1F310} Please open manually: ${url}`);
            }
            resolve();
        });
        child.on('close', ()=>{
            resolve();
        });
        child.unref();
    });
}
exports.playgroundForAgent = __webpack_exports__.playgroundForAgent;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "playgroundForAgent"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=launcher.js.map