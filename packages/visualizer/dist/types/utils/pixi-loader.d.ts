import 'pixi.js/unsafe-eval';
import * as PIXI from 'pixi.js';
export declare const loadTexture: (img: string) => Promise<void>;
export declare const getTextureFromCache: (name: string) => PIXI.Texture | undefined;
export declare const getTexture: (name: string) => Promise<PIXI.Texture | undefined>;
