import { ifInBrowser, ifInNode, ifInWorker } from "../utils.mjs";
let photonModule = null;
let isInitialized = false;
async function getPhoton() {
    if (photonModule && isInitialized) return photonModule;
    try {
        if (ifInBrowser || ifInWorker) {
            const photon = await import("@silvia-odwyer/photon");
            if ('function' == typeof photon.default) await photon.default();
            photonModule = photon;
        } else if (ifInNode) photonModule = await import("@silvia-odwyer/photon-node");
        if (!photonModule.PhotonImage || !photonModule.PhotonImage.new_from_byteslice) throw new Error('PhotonImage.new_from_byteslice is not available');
        isInitialized = true;
        return photonModule;
    } catch (error) {
        throw new Error(`Failed to load photon module: ${error instanceof Error ? error.message : String(error)}`);
    }
}
export { getPhoton as default };
