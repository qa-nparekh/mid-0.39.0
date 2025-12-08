import node_assert from "node:assert";
import get_jimp from "./get-jimp.mjs";
import { bufferFromBase64, imageInfoOfBase64 } from "./index.mjs";
let cachedFont = null;
const loadFonts = async ()=>{
    const Jimp = await get_jimp();
    try {
        const fonts = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
        return fonts;
    } catch (error) {
        console.warn('Error loading font, will try to load online fonts', error);
        const onlineFonts = 'https://cdn.jsdelivr.net/npm/jimp-compact@0.16.1-2/fonts/open-sans/open-sans-16-white/open-sans-16-white.fnt';
        const fonts = await Jimp.loadFont(onlineFonts);
        return fonts;
    }
};
const createSvgOverlay = async (elements, imageWidth, imageHeight, boxPadding = 5, borderThickness = 2, prompt)=>{
    const Jimp = await get_jimp();
    const image = new Jimp(imageWidth, imageHeight, 0x00000000);
    const colors = [
        {
            rect: 0xc62300ff,
            text: 0xffffffff
        },
        {
            rect: 0x0000ffff,
            text: 0xffffffff
        },
        {
            rect: 0x8b4513ff,
            text: 0xffffffff
        },
        {
            rect: 0x3e7b27ff,
            text: 0xffffffff
        },
        {
            rect: 0x500073ff,
            text: 0xffffffff
        }
    ];
    if (prompt) try {
        cachedFont = cachedFont || await loadFonts();
        const promptPadding = 10;
        const promptMargin = 20;
        const promptHeight = 30;
        const promptY = imageHeight - promptHeight - promptMargin;
        image.scan(0, promptY, imageWidth, promptHeight, (x, y, idx)=>{
            image.bitmap.data[idx + 0] = 0x00;
            image.bitmap.data[idx + 1] = 0x00;
            image.bitmap.data[idx + 2] = 0x00;
            image.bitmap.data[idx + 3] = 0xcc;
        });
        image.print(cachedFont, promptPadding, promptY, {
            text: prompt,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, imageWidth - 2 * promptPadding, promptHeight);
    } catch (error) {
        console.error('Error drawing prompt text', error);
    }
    for(let index = 0; index < elements.length; index++){
        const element = elements[index];
        const color = colors[index % colors.length];
        const paddedLeft = Math.max(0, element.rect.left - boxPadding);
        const paddedTop = Math.max(0, element.rect.top - boxPadding);
        const paddedWidth = Math.min(imageWidth - paddedLeft, element.rect.width + 2 * boxPadding);
        const paddedHeight = Math.min(imageHeight - paddedTop, element.rect.height + 2 * boxPadding);
        const paddedRect = {
            left: paddedLeft,
            top: paddedTop,
            width: paddedWidth,
            height: paddedHeight
        };
        image.scan(paddedRect.left, paddedRect.top, paddedRect.width, paddedRect.height, (x, y, idx)=>{
            if (x >= paddedRect.left && x < paddedRect.left + borderThickness || x <= paddedRect.left + paddedRect.width - 1 && x > paddedRect.left + paddedRect.width - borderThickness || y >= paddedRect.top && y < paddedRect.top + borderThickness || y <= paddedRect.top + paddedRect.height - 1 && y > paddedRect.top + paddedRect.height - borderThickness) {
                image.bitmap.data[idx + 0] = color.rect >> 24 & 0xff;
                image.bitmap.data[idx + 1] = color.rect >> 16 & 0xff;
                image.bitmap.data[idx + 2] = color.rect >> 8 & 0xff;
                image.bitmap.data[idx + 3] = 0xff & color.rect;
            }
        });
        const indexId = element.indexId;
        if ('number' != typeof indexId) continue;
        const textWidth = 8 * indexId.toString().length;
        const textHeight = 12;
        const rectWidth = textWidth + 5;
        const rectHeight = textHeight + 4;
        let rectX = paddedRect.left - rectWidth;
        let rectY = paddedRect.top + paddedRect.height / 2 - textHeight / 2 - 2;
        const checkOverlap = (x, y)=>elements.slice(0, index).some((otherElement)=>x < otherElement.rect.left + otherElement.rect.width && x + rectWidth > otherElement.rect.left && y < otherElement.rect.top + otherElement.rect.height && y + rectHeight > otherElement.rect.top);
        const isWithinBounds = (x, y)=>x >= 0 && x + rectWidth <= imageWidth && y >= 0 && y + rectHeight <= imageHeight;
        if (checkOverlap(rectX, rectY) || !isWithinBounds(rectX, rectY)) if (!checkOverlap(paddedRect.left, paddedRect.top - rectHeight - 2) && isWithinBounds(paddedRect.left, paddedRect.top - rectHeight - 2)) {
            rectX = paddedRect.left;
            rectY = paddedRect.top - rectHeight - 2;
        } else if (!checkOverlap(paddedRect.left, paddedRect.top + paddedRect.height + 2) && isWithinBounds(paddedRect.left, paddedRect.top + paddedRect.height + 2)) {
            rectX = paddedRect.left;
            rectY = paddedRect.top + paddedRect.height + 2;
        } else if (!checkOverlap(paddedRect.left + paddedRect.width + 2, paddedRect.top) && isWithinBounds(paddedRect.left + paddedRect.width + 2, paddedRect.top)) {
            rectX = paddedRect.left + paddedRect.width + 2;
            rectY = paddedRect.top;
        } else {
            rectX = paddedRect.left;
            rectY = paddedRect.top + 2;
        }
        image.scan(rectX, rectY, rectWidth, rectHeight, (x, y, idx)=>{
            image.bitmap.data[idx + 0] = color.rect >> 24 & 0xff;
            image.bitmap.data[idx + 1] = color.rect >> 16 & 0xff;
            image.bitmap.data[idx + 2] = color.rect >> 8 & 0xff;
            image.bitmap.data[idx + 3] = 0xff & color.rect;
        });
        try {
            cachedFont = cachedFont || await loadFonts();
        } catch (error) {
            console.error('Error loading font', error);
        }
        image.print(cachedFont, rectX, rectY, {
            text: indexId.toString(),
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, rectWidth, rectHeight);
    }
    return image;
};
const compositeElementInfoImg = async (options)=>{
    node_assert(options.inputImgBase64, 'inputImgBase64 is required');
    let width = 0;
    let height = 0;
    let jimpImage;
    const Jimp = await get_jimp();
    if (options.size) {
        width = options.size.width;
        height = options.size.height;
    }
    if (width && height) {
        const imageBuffer = await bufferFromBase64(options.inputImgBase64);
        jimpImage = await Jimp.read(imageBuffer);
        const imageBitmap = jimpImage.bitmap;
        if (imageBitmap.width !== width || imageBitmap.height !== height) jimpImage.resize(width, height, Jimp.RESIZE_NEAREST_NEIGHBOR);
    } else {
        const info = await imageInfoOfBase64(options.inputImgBase64);
        width = info.width;
        height = info.height;
        jimpImage = info.jimpImage;
    }
    if (!width || !height) throw Error('Image processing failed because width or height is undefined');
    const { elementsPositionInfo, prompt } = options;
    const result = await Promise.resolve(jimpImage).then(async (image)=>{
        const svgOverlay = await createSvgOverlay(elementsPositionInfo, width, height, options.annotationPadding, options.borderThickness, prompt);
        const svgImage = await Jimp.read(svgOverlay);
        const compositeImage = await image.composite(svgImage, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1
        });
        return compositeImage;
    }).then(async (compositeImage)=>{
        compositeImage.quality(90);
        const base64 = await compositeImage.getBase64Async(Jimp.MIME_JPEG);
        return base64;
    }).catch((error)=>{
        throw error;
    });
    return result;
};
const processImageElementInfo = async (options)=>{
    const base64Image = options.inputImgBase64.split(';base64,').pop();
    node_assert(base64Image, 'base64Image is undefined');
    const [compositeElementInfoImgBase64, compositeElementInfoImgWithoutTextBase64] = await Promise.all([
        compositeElementInfoImg({
            inputImgBase64: options.inputImgBase64,
            elementsPositionInfo: options.elementsPositionInfo
        }),
        compositeElementInfoImg({
            inputImgBase64: options.inputImgBase64,
            elementsPositionInfo: options.elementsPositionInfoWithoutText
        })
    ]);
    return {
        compositeElementInfoImgBase64,
        compositeElementInfoImgWithoutTextBase64
    };
};
export { compositeElementInfoImg, processImageElementInfo };
