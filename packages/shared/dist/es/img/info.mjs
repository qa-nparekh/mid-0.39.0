import node_assert from "node:assert";
import { Buffer } from "node:buffer";
import get_jimp from "./get-jimp.mjs";
async function imageInfo(image) {
    const Jimp = await get_jimp();
    let jimpImage;
    if ('string' == typeof image) jimpImage = await Jimp.read(image);
    else if (Buffer.isBuffer(image)) jimpImage = await Jimp.read(image);
    else if (image instanceof Jimp) jimpImage = image;
    else throw new Error('Invalid image input: must be a string path or a Buffer');
    const { width, height } = jimpImage.bitmap;
    node_assert(width && height, `Invalid image: ${'string' == typeof image ? image : 'Buffer'}`);
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
    return Buffer.from(base64Data, 'base64');
}
function isValidPNGImageBuffer(buffer) {
    if (!buffer || buffer.length < 8) return false;
    const isPNG = 0x89 === buffer[0] && 0x50 === buffer[1] && 0x4e === buffer[2] && 0x47 === buffer[3];
    return isPNG;
}
export { bufferFromBase64, imageInfo, imageInfoOfBase64, isValidPNGImageBuffer };
