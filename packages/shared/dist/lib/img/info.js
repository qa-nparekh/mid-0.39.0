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
    isValidPNGImageBuffer: ()=>isValidPNGImageBuffer,
    bufferFromBase64: ()=>bufferFromBase64,
    imageInfo: ()=>imageInfo,
    imageInfoOfBase64: ()=>imageInfoOfBase64
});
const external_node_assert_namespaceObject = require("node:assert");
var external_node_assert_default = /*#__PURE__*/ __webpack_require__.n(external_node_assert_namespaceObject);
const external_node_buffer_namespaceObject = require("node:buffer");
const external_get_jimp_js_namespaceObject = require("./get-jimp.js");
var external_get_jimp_js_default = /*#__PURE__*/ __webpack_require__.n(external_get_jimp_js_namespaceObject);
async function imageInfo(image) {
    const Jimp = await external_get_jimp_js_default()();
    let jimpImage;
    if ('string' == typeof image) jimpImage = await Jimp.read(image);
    else if (external_node_buffer_namespaceObject.Buffer.isBuffer(image)) jimpImage = await Jimp.read(image);
    else if (image instanceof Jimp) jimpImage = image;
    else throw new Error('Invalid image input: must be a string path or a Buffer');
    const { width, height } = jimpImage.bitmap;
    external_node_assert_default()(width && height, `Invalid image: ${'string' == typeof image ? image : 'Buffer'}`);
    return {
        width,
        height,
        jimpImage
    };
}
async function imageInfoOfBase64(imageBase64) {
    const buffer = await bufferFromBase64(imageBase64);
    return imageInfo(buffer);
}
async function bufferFromBase64(imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    return external_node_buffer_namespaceObject.Buffer.from(base64Data, 'base64');
}
function isValidPNGImageBuffer(buffer) {
    if (!buffer || buffer.length < 8) return false;
    const isPNG = 0x89 === buffer[0] && 0x50 === buffer[1] && 0x4e === buffer[2] && 0x47 === buffer[3];
    return isPNG;
}
exports.bufferFromBase64 = __webpack_exports__.bufferFromBase64;
exports.imageInfo = __webpack_exports__.imageInfo;
exports.imageInfoOfBase64 = __webpack_exports__.imageInfoOfBase64;
exports.isValidPNGImageBuffer = __webpack_exports__.isValidPNGImageBuffer;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "bufferFromBase64",
    "imageInfo",
    "imageInfoOfBase64",
    "isValidPNGImageBuffer"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
