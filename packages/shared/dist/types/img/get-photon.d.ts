export default function getPhoton(): Promise<{
    PhotonImage: typeof import('@silvia-odwyer/photon-node').PhotonImage;
    SamplingFilter: typeof import('@silvia-odwyer/photon-node').SamplingFilter;
    resize: typeof import('@silvia-odwyer/photon-node').resize;
    crop: typeof import('@silvia-odwyer/photon-node').crop;
    open_image: typeof import('@silvia-odwyer/photon-node').open_image;
    base64_to_image: typeof import('@silvia-odwyer/photon-node').base64_to_image;
}>;
