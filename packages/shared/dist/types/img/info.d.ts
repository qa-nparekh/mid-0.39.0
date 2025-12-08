import { Buffer } from 'node:buffer';
import type Jimp from 'jimp';
import type { Size } from '../types';
export interface ImageInfo extends Size {
    jimpImage: Jimp;
}
/**
 * Retrieves the dimensions of an image asynchronously
 *
 * @param image - The image data, which can be a string path or a buffer
 * @returns A Promise that resolves to an object containing the width and height of the image
 * @throws Error if the image data is invalid
 */
export declare function imageInfo(image: string | Buffer | Jimp): Promise<ImageInfo>;
/**
 * Retrieves the dimensions of an image from a base64-encoded string
 *
 * @param imageBase64 - The base64-encoded image data
 * @returns A Promise that resolves to an object containing the width and height of the image
 * @throws Error if the image data is invalid
 */
export declare function imageInfoOfBase64(imageBase64: string): Promise<ImageInfo>;
export declare function bufferFromBase64(imageBase64: string): Promise<Buffer>;
/**
 * Check if the Buffer is a valid PNG image
 * @param buffer The Buffer to check
 * @returns true if the Buffer is a valid PNG image, otherwise false
 */
export declare function isValidPNGImageBuffer(buffer: Buffer): boolean;
