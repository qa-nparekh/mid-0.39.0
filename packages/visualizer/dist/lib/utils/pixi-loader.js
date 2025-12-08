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
    getTexture: ()=>getTexture,
    getTextureFromCache: ()=>getTextureFromCache,
    loadTexture: ()=>loadTexture
});
require("pixi.js/unsafe-eval");
const external_pixi_js_namespaceObject = require("pixi.js");
const globalTextureMap = new Map();
const loadTexture = async (img)=>{
    if (globalTextureMap.has(img)) return;
    return external_pixi_js_namespaceObject.Assets.load(img).then((texture)=>{
        globalTextureMap.set(img, texture);
    });
};
const getTextureFromCache = (name)=>globalTextureMap.get(name);
const getTexture = async (name)=>{
    if (globalTextureMap.has(name)) return globalTextureMap.get(name);
    await loadTexture(name);
    return globalTextureMap.get(name);
};
exports.getTexture = __webpack_exports__.getTexture;
exports.getTextureFromCache = __webpack_exports__.getTextureFromCache;
exports.loadTexture = __webpack_exports__.loadTexture;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "getTexture",
    "getTextureFromCache",
    "loadTexture"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
