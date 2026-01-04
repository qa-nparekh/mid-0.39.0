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
var __webpack_exports__ = {};
const playground_namespaceObject = require("@sqaitech/playground");
const external_cors_namespaceObject = require("cors");
var external_cors_default = /*#__PURE__*/ __webpack_require__.n(external_cors_namespaceObject);
const index_js_namespaceObject = require("./static/index.js");
require("dotenv/config");
const page = new index_js_namespaceObject.StaticPage({
    tree: {
        node: null,
        children: []
    },
    size: {
        width: 800,
        height: 600
    },
    screenshotBase64: ''
});
const agent = new index_js_namespaceObject.StaticPageAgent(page);
const server = new playground_namespaceObject.PlaygroundServer(agent);
server.app.use(external_cors_default()({
    origin: '*',
    credentials: true
}));
Promise.resolve().then(()=>server.launch()).then(()=>{
    console.log(`Midscene playground server is running on http://localhost:${server.port}`);
});
for(var __webpack_i__ in __webpack_exports__)exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=bin.js.map