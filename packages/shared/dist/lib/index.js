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
    createPlaygroundCopyPlugin: ()=>copy_static_js_namespaceObject.createPlaygroundCopyPlugin,
    createCopyStaticPlugin: ()=>copy_static_js_namespaceObject.createCopyStaticPlugin,
    default: ()=>src
});
const copy_static_js_namespaceObject = require("./build/copy-static.js");
const src = {};
exports.createCopyStaticPlugin = __webpack_exports__.createCopyStaticPlugin;
exports.createPlaygroundCopyPlugin = __webpack_exports__.createPlaygroundCopyPlugin;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "createCopyStaticPlugin",
    "createPlaygroundCopyPlugin",
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
