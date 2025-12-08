"use strict";
var __webpack_modules__ = {
    "@silvia-odwyer/photon": function(module) {
        module.exports = import("@silvia-odwyer/photon").then(function(module) {
            return module;
        });
    },
    "@silvia-odwyer/photon-node": function(module) {
        module.exports = import("@silvia-odwyer/photon-node").then(function(module) {
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
        default: ()=>getPhoton
    });
    const external_utils_js_namespaceObject = require("../utils.js");
    let photonModule = null;
    let isInitialized = false;
    async function getPhoton() {
        if (photonModule && isInitialized) return photonModule;
        try {
            if (external_utils_js_namespaceObject.ifInBrowser || external_utils_js_namespaceObject.ifInWorker) {
                const photon = await Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "@silvia-odwyer/photon"));
                if ('function' == typeof photon.default) await photon.default();
                photonModule = photon;
            } else if (external_utils_js_namespaceObject.ifInNode) photonModule = await Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "@silvia-odwyer/photon-node"));
            if (!photonModule.PhotonImage || !photonModule.PhotonImage.new_from_byteslice) throw new Error('PhotonImage.new_from_byteslice is not available');
            isInitialized = true;
            return photonModule;
        } catch (error) {
            throw new Error(`Failed to load photon module: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
})();
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
