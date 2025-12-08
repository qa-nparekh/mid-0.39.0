export declare function drawBoxOnImage(options: {
    inputImgBase64: string;
    rect: {
        x: number;
        y: number;
    };
}): Promise<string>;
export declare function savePositionImg(options: {
    inputImgBase64: string;
    rect: {
        x: number;
        y: number;
    };
    outputPath: string;
}): Promise<void>;
