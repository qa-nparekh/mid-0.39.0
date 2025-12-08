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
    drawBoxOnImage: ()=>drawBoxOnImage,
    savePositionImg: ()=>savePositionImg
});
const external_get_jimp_js_namespaceObject = require("./get-jimp.js");
var external_get_jimp_js_default = /*#__PURE__*/ __webpack_require__.n(external_get_jimp_js_namespaceObject);
const external_info_js_namespaceObject = require("./info.js");
const external_transform_js_namespaceObject = require("./transform.js");
async function drawBoxOnImage(options) {
    const { inputImgBase64, rect } = options;
    const color = {
        r: 255,
        g: 0,
        b: 0,
        a: 255
    };
    const Jimp = await external_get_jimp_js_default()();
    const imageBuffer = await (0, external_info_js_namespaceObject.bufferFromBase64)(inputImgBase64);
    const image = await Jimp.read(imageBuffer);
    const centerX = rect.x;
    const centerY = rect.y;
    const radius = 5;
    image.scan(Math.floor(centerX - radius), Math.floor(centerY - radius), 2 * radius, 2 * radius, (x, y, idx)=>{
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (distance <= radius) {
            image.bitmap.data[idx + 0] = color.r;
            image.bitmap.data[idx + 1] = color.g;
            image.bitmap.data[idx + 2] = color.b;
            image.bitmap.data[idx + 3] = color.a;
        }
    });
    image.quality(90);
    const resultBase64 = await image.getBase64Async(Jimp.MIME_JPEG);
    return resultBase64;
}
async function savePositionImg(options) {
    const { inputImgBase64, rect, outputPath } = options;
    const imgBase64 = await drawBoxOnImage({
        inputImgBase64,
        rect
    });
    await (0, external_transform_js_namespaceObject.saveBase64Image)({
        base64Data: imgBase64,
        outputPath
    });
}
exports.drawBoxOnImage = __webpack_exports__.drawBoxOnImage;
exports.savePositionImg = __webpack_exports__.savePositionImg;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "drawBoxOnImage",
    "savePositionImg"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
