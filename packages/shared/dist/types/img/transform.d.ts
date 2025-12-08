import { Buffer } from 'node:buffer';
import type Jimp from 'jimp';
import type { Rect } from '../types';
/**
/**
 * Saves a Base64-encoded image to a file
 *
 * @param options - An object containing the Base64-encoded image data and the output file path
 * @param options.base64Data - The Base64-encoded image data
 * @param options.outputPath - The path where the image will be saved
 * @throws Error if there is an error during the saving process
 */
export declare function saveBase64Image(options: {
    base64Data: string;
    outputPath: string;
}): Promise<void>;
/**
 * Resizes an image from Buffer, maybe return a new format
 * - If the image is Resized, the returned format will be jpg.
 * - If the image is not Resized, it will return to its original format.
 * @returns { buffer: resized buffer, format: the new format}
 */
export declare function resizeAndConvertImgBuffer(inputFormat: string, inputData: Buffer, newSize: {
    width: number;
    height: number;
}): Promise<{
    buffer: Buffer;
    format: string;
}>;
export declare const createImgBase64ByFormat: (format: string, body: string) => string;
export declare function resizeImgBase64(inputBase64: string, newSize: {
    width: number;
    height: number;
}): Promise<string>;
/**
 * Calculates new dimensions for an image while maintaining its aspect ratio.
 *
 * This function is designed to resize an image to fit within a specified maximum width and height
 * while maintaining the original aspect ratio. If the original width or height exceeds the maximum
 * dimensions, the image will be scaled down to fit.
 *
 * @param {number} originalWidth - The original width of the image.
 * @param {number} originalHeight - The original height of the image.
 * @returns {Object} An object containing the new width and height.
 * @throws {Error} Throws an error if the width or height is not a positive number.
 */
export declare function zoomForGPT4o(originalWidth: number, originalHeight: number): {
    width: number;
    height: number;
};
export declare function jimpFromBase64(base64: string): Promise<Jimp>;
export declare function paddingToMatchBlock(image: Jimp, blockSize?: number): Promise<{
    width: number;
    height: number;
    image: Jimp;
}>;
export declare function paddingToMatchBlockByBase64(imageBase64: string, blockSize?: number): Promise<{
    width: number;
    height: number;
    imageBase64: string;
}>;
export declare function cropByRect(imageBase64: string, rect: Rect, paddingImage: boolean): Promise<{
    width: number;
    height: number;
    imageBase64: string;
}>;
export declare function jimpToBase64(image: Jimp): Promise<string>;
export declare const httpImg2Base64: (url: string) => Promise<string>;
/**
 * Convert image file to base64 string
 * Because this method is synchronous, the npm package `sharp` cannot be used to detect the file type.
 * TODO: convert to webp to reduce base64 size.
 */
export declare const localImg2Base64: (imgPath: string, withoutHeader?: boolean) => string;
/**
 * PreProcess image url to ensure image is accessible to LLM.
 * @param url - The url of the image, it can be a http url or a base64 string or a file path
 * @param convertHttpImage2Base64 - Whether to convert http image to base64, if true, the http image will be converted to base64, otherwise, the http image will be returned as is
 * @returns The base64 string of the image (when convertHttpImage2Base64 is true or url is a file path) or the http image url
 */
export declare const preProcessImageUrl: (url: string, convertHttpImage2Base64: boolean) => Promise<string>;
/**
 * parse base64 string to get mimeType and body
 */
export declare const parseBase64: (fullBase64String: string) => {
    mimeType: string;
    body: string;
};
