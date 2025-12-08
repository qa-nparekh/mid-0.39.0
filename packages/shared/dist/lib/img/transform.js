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
    preProcessImageUrl: ()=>preProcessImageUrl,
    localImg2Base64: ()=>localImg2Base64,
    paddingToMatchBlock: ()=>paddingToMatchBlock,
    zoomForGPT4o: ()=>zoomForGPT4o,
    cropByRect: ()=>cropByRect,
    resizeAndConvertImgBuffer: ()=>resizeAndConvertImgBuffer,
    saveBase64Image: ()=>saveBase64Image,
    createImgBase64ByFormat: ()=>createImgBase64ByFormat,
    httpImg2Base64: ()=>httpImg2Base64,
    jimpToBase64: ()=>jimpToBase64,
    parseBase64: ()=>parseBase64,
    jimpFromBase64: ()=>jimpFromBase64,
    resizeImgBase64: ()=>resizeImgBase64,
    paddingToMatchBlockByBase64: ()=>paddingToMatchBlockByBase64
});
const external_node_assert_namespaceObject = require("node:assert");
var external_node_assert_default = /*#__PURE__*/ __webpack_require__.n(external_node_assert_namespaceObject);
const external_node_buffer_namespaceObject = require("node:buffer");
const external_node_fs_namespaceObject = require("node:fs");
const external_node_path_namespaceObject = require("node:path");
var external_node_path_default = /*#__PURE__*/ __webpack_require__.n(external_node_path_namespaceObject);
const external_logger_js_namespaceObject = require("../logger.js");
const external_utils_js_namespaceObject = require("../utils.js");
const external_get_jimp_js_namespaceObject = require("./get-jimp.js");
var external_get_jimp_js_default = /*#__PURE__*/ __webpack_require__.n(external_get_jimp_js_namespaceObject);
const external_get_photon_js_namespaceObject = require("./get-photon.js");
var external_get_photon_js_default = /*#__PURE__*/ __webpack_require__.n(external_get_photon_js_namespaceObject);
const external_get_sharp_js_namespaceObject = require("./get-sharp.js");
var external_get_sharp_js_default = /*#__PURE__*/ __webpack_require__.n(external_get_sharp_js_namespaceObject);
const imgDebug = (0, external_logger_js_namespaceObject.getDebug)('img');
async function saveBase64Image(options) {
    const { base64Data, outputPath } = options;
    const { body } = parseBase64(base64Data);
    const imageBuffer = external_node_buffer_namespaceObject.Buffer.from(body, 'base64');
    const Jimp = await external_get_jimp_js_default()();
    const image = await Jimp.read(imageBuffer);
    await image.writeAsync(outputPath);
}
async function resizeAndConvertImgBuffer(inputFormat, inputData, newSize) {
    if ('string' == typeof inputData) throw Error('inputData is base64, use resizeImgBase64 instead');
    external_node_assert_default()(newSize && newSize.width > 0 && newSize.height > 0, 'newSize must be positive');
    const resizeStartTime = Date.now();
    imgDebug(`resizeImg start, target size: ${newSize.width}x${newSize.height}`);
    if (external_utils_js_namespaceObject.ifInNode) try {
        const Sharp = await external_get_sharp_js_default()();
        const metadata = await Sharp(inputData).metadata();
        const { width: originalWidth, height: originalHeight } = metadata;
        if (!originalWidth || !originalHeight) throw Error('Undefined width or height from the input image.');
        if (newSize.width === originalWidth && newSize.height === originalHeight) return {
            buffer: inputData,
            format: inputFormat
        };
        const resizedBuffer = await Sharp(inputData).resize(newSize.width, newSize.height).jpeg({
            quality: 90
        }).toBuffer();
        const resizeEndTime = Date.now();
        imgDebug(`resizeImg done (Sharp), target size: ${newSize.width}x${newSize.height}, cost: ${resizeEndTime - resizeStartTime}ms`);
        return {
            buffer: resizedBuffer,
            format: 'jpeg'
        };
    } catch (error) {
        imgDebug('Sharp failed, falling back to Photon:', error);
    }
    const { PhotonImage, SamplingFilter, resize } = await external_get_photon_js_default()();
    const inputBytes = new Uint8Array(inputData);
    const inputImage = PhotonImage.new_from_byteslice(inputBytes);
    const originalWidth = inputImage.get_width();
    const originalHeight = inputImage.get_height();
    if (!originalWidth || !originalHeight) {
        inputImage.free();
        throw Error('Undefined width or height from the input image.');
    }
    if (newSize.width === originalWidth && newSize.height === originalHeight) {
        inputImage.free();
        return {
            buffer: inputData,
            format: inputFormat
        };
    }
    const outputImage = resize(inputImage, newSize.width, newSize.height, SamplingFilter.CatmullRom);
    const outputBytes = outputImage.get_bytes_jpeg(90);
    const resizedBuffer = external_node_buffer_namespaceObject.Buffer.from(outputBytes);
    inputImage.free();
    outputImage.free();
    const resizeEndTime = Date.now();
    imgDebug(`resizeImg done (Photon), target size: ${newSize.width}x${newSize.height}, cost: ${resizeEndTime - resizeStartTime}ms`);
    return {
        buffer: resizedBuffer,
        format: 'jpeg'
    };
}
const createImgBase64ByFormat = (format, body)=>`data:image/${format};base64,${body}`;
async function resizeImgBase64(inputBase64, newSize) {
    const { body, mimeType } = parseBase64(inputBase64);
    const imageBuffer = external_node_buffer_namespaceObject.Buffer.from(body, 'base64');
    const { buffer, format } = await resizeAndConvertImgBuffer(mimeType.split('/')[1], imageBuffer, newSize);
    return createImgBase64ByFormat(format, buffer.toString('base64'));
}
function zoomForGPT4o(originalWidth, originalHeight) {
    const maxWidth = 2048;
    const maxHeight = 768;
    let newWidth = originalWidth;
    let newHeight = originalHeight;
    const aspectRatio = originalWidth / originalHeight;
    if (originalWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
    }
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }
    return {
        width: Math.round(newWidth),
        height: Math.round(newHeight)
    };
}
async function jimpFromBase64(base64) {
    const Jimp = await external_get_jimp_js_default()();
    const { body } = parseBase64(base64);
    const imageBuffer = external_node_buffer_namespaceObject.Buffer.from(body, 'base64');
    return Jimp.read(imageBuffer);
}
async function paddingToMatchBlock(image, blockSize = 28) {
    const { width, height } = image.bitmap;
    const targetWidth = Math.ceil(width / blockSize) * blockSize;
    const targetHeight = Math.ceil(height / blockSize) * blockSize;
    if (targetWidth === width && targetHeight === height) return {
        width,
        height,
        image
    };
    const Jimp = await external_get_jimp_js_default()();
    const paddedImage = new Jimp(targetWidth, targetHeight, 0xffffffff);
    paddedImage.composite(image, 0, 0);
    return {
        width: targetWidth,
        height: targetHeight,
        image: paddedImage
    };
}
async function paddingToMatchBlockByBase64(imageBase64, blockSize = 28) {
    const jimpImage = await jimpFromBase64(imageBase64);
    const paddedResult = await paddingToMatchBlock(jimpImage, blockSize);
    return {
        width: paddedResult.width,
        height: paddedResult.height,
        imageBase64: await jimpToBase64(paddedResult.image)
    };
}
async function cropByRect(imageBase64, rect, paddingImage) {
    const jimpImage = await jimpFromBase64(imageBase64);
    const { left, top, width, height } = rect;
    jimpImage.crop(left, top, width, height);
    if (paddingImage) {
        const paddedResult = await paddingToMatchBlock(jimpImage);
        return {
            width: paddedResult.width,
            height: paddedResult.height,
            imageBase64: await jimpToBase64(paddedResult.image)
        };
    }
    return {
        width: jimpImage.bitmap.width,
        height: jimpImage.bitmap.height,
        imageBase64: await jimpToBase64(jimpImage)
    };
}
async function jimpToBase64(image) {
    const Jimp = await external_get_jimp_js_default()();
    return image.getBase64Async(Jimp.MIME_JPEG);
}
const httpImg2Base64 = async (url)=>{
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
    const contentType = response.headers.get('content-type');
    if (!contentType) throw new Error(`Failed to fetch image: ${url}`);
    external_node_assert_default()(contentType.startsWith('image/'), `The url ${url} is not a image, because of content-type in header is ${contentType}.`);
    const buffer = external_node_buffer_namespaceObject.Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
};
const localImg2Base64 = (imgPath, withoutHeader = false)=>{
    const body = (0, external_node_fs_namespaceObject.readFileSync)(imgPath).toString('base64');
    if (withoutHeader) return body;
    const type = external_node_path_default().extname(imgPath).slice(1);
    const finalType = 'svg' === type ? 'svg+xml' : type || 'jpg';
    return `data:image/${finalType};base64,${body}`;
};
const preProcessImageUrl = async (url, convertHttpImage2Base64)=>{
    if ('string' != typeof url) throw new Error(`url must be a string, but got ${url} with type ${typeof url}`);
    if (url.startsWith('data:')) return url;
    if (!(url.startsWith('http://') || url.startsWith('https://'))) return await localImg2Base64(url);
    if (!convertHttpImage2Base64) return url;
    return await httpImg2Base64(url);
};
const parseBase64 = (fullBase64String)=>{
    try {
        const separator = ';base64,';
        const index = fullBase64String.indexOf(separator);
        if (-1 === index) throw new Error('Invalid base64 string');
        return {
            mimeType: fullBase64String.slice(5, index),
            body: fullBase64String.slice(index + separator.length)
        };
    } catch (e) {
        throw new Error(`parseBase64 fail because intput is not a valid base64 string: ${fullBase64String}`, {
            cause: e
        });
    }
};
exports.createImgBase64ByFormat = __webpack_exports__.createImgBase64ByFormat;
exports.cropByRect = __webpack_exports__.cropByRect;
exports.httpImg2Base64 = __webpack_exports__.httpImg2Base64;
exports.jimpFromBase64 = __webpack_exports__.jimpFromBase64;
exports.jimpToBase64 = __webpack_exports__.jimpToBase64;
exports.localImg2Base64 = __webpack_exports__.localImg2Base64;
exports.paddingToMatchBlock = __webpack_exports__.paddingToMatchBlock;
exports.paddingToMatchBlockByBase64 = __webpack_exports__.paddingToMatchBlockByBase64;
exports.parseBase64 = __webpack_exports__.parseBase64;
exports.preProcessImageUrl = __webpack_exports__.preProcessImageUrl;
exports.resizeAndConvertImgBuffer = __webpack_exports__.resizeAndConvertImgBuffer;
exports.resizeImgBase64 = __webpack_exports__.resizeImgBase64;
exports.saveBase64Image = __webpack_exports__.saveBase64Image;
exports.zoomForGPT4o = __webpack_exports__.zoomForGPT4o;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "createImgBase64ByFormat",
    "cropByRect",
    "httpImg2Base64",
    "jimpFromBase64",
    "jimpToBase64",
    "localImg2Base64",
    "paddingToMatchBlock",
    "paddingToMatchBlockByBase64",
    "parseBase64",
    "preProcessImageUrl",
    "resizeAndConvertImgBuffer",
    "resizeImgBase64",
    "saveBase64Image",
    "zoomForGPT4o"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
