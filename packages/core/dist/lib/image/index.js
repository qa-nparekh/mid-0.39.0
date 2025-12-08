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
    saveBase64Image: ()=>img_namespaceObject.saveBase64Image,
    httpImg2Base64: ()=>img_namespaceObject.httpImg2Base64,
    localImg2Base64: ()=>img_namespaceObject.localImg2Base64,
    zoomForGPT4o: ()=>img_namespaceObject.zoomForGPT4o,
    imageInfoOfBase64: ()=>img_namespaceObject.imageInfoOfBase64,
    imageInfo: ()=>img_namespaceObject.imageInfo,
    resizeAndConvertImgBuffer: ()=>img_namespaceObject.resizeAndConvertImgBuffer
});
const img_namespaceObject = require("@sqai/shared/img");
exports.httpImg2Base64 = __webpack_exports__.httpImg2Base64;
exports.imageInfo = __webpack_exports__.imageInfo;
exports.imageInfoOfBase64 = __webpack_exports__.imageInfoOfBase64;
exports.localImg2Base64 = __webpack_exports__.localImg2Base64;
exports.resizeAndConvertImgBuffer = __webpack_exports__.resizeAndConvertImgBuffer;
exports.saveBase64Image = __webpack_exports__.saveBase64Image;
exports.zoomForGPT4o = __webpack_exports__.zoomForGPT4o;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "httpImg2Base64",
    "imageInfo",
    "imageInfoOfBase64",
    "localImg2Base64",
    "resizeAndConvertImgBuffer",
    "saveBase64Image",
    "zoomForGPT4o"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map