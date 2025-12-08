"use strict";
var __webpack_modules__ = {
    "jimp/browser/lib/jimp.js": function(module) {
        module.exports = import("jimp/browser/lib/jimp.js").then(function(module) {
            return module;
        });
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
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
(()=>{
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
        default: ()=>getJimp
    });
    const external_jimp_namespaceObject = require("jimp");
    var external_jimp_default = /*#__PURE__*/ __webpack_require__.n(external_jimp_namespaceObject);
    const external_utils_js_namespaceObject = require("../utils.js");
    async function getJimp() {
        if (external_utils_js_namespaceObject.ifInBrowser || external_utils_js_namespaceObject.ifInWorker) {
            await Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "jimp/browser/lib/jimp.js"));
            return ('undefined' != typeof window ? window : self).Jimp;
        }
        return external_jimp_default();
    }
})();
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
