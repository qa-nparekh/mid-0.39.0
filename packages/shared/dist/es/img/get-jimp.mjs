import jimp from "jimp";
import { ifInBrowser, ifInWorker } from "../utils.mjs";
async function getJimp() {
    if (ifInBrowser || ifInWorker) {
        await import("jimp/browser/lib/jimp.js");
        return ('undefined' != typeof window ? window : self).Jimp;
    }
    return jimp;
}
export { getJimp as default };
