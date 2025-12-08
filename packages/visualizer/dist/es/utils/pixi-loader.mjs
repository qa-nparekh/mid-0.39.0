import "pixi.js/unsafe-eval";
import { Assets } from "pixi.js";
const globalTextureMap = new Map();
const loadTexture = async (img)=>{
    if (globalTextureMap.has(img)) return;
    return Assets.load(img).then((texture)=>{
        globalTextureMap.set(img, texture);
    });
};
const getTextureFromCache = (name)=>globalTextureMap.get(name);
const getTexture = async (name)=>{
    if (globalTextureMap.has(name)) return globalTextureMap.get(name);
    await loadTexture(name);
    return globalTextureMap.get(name);
};
export { getTexture, getTextureFromCache, loadTexture };
