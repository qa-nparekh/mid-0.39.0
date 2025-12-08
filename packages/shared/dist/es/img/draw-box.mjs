import get_jimp from "./get-jimp.mjs";
import { bufferFromBase64 } from "./info.mjs";
import { saveBase64Image } from "./transform.mjs";
async function drawBoxOnImage(options) {
    const { inputImgBase64, rect } = options;
    const color = {
        r: 255,
        g: 0,
        b: 0,
        a: 255
    };
    const Jimp = await get_jimp();
    const imageBuffer = await bufferFromBase64(inputImgBase64);
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
    await saveBase64Image({
        base64Data: imgBase64,
        outputPath
    });
}
export { drawBoxOnImage, savePositionImg };
