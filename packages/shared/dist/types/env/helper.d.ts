import type { IModelConfig } from './types';
export declare const maskConfig: (config: IModelConfig) => {
    [k: string]: any;
};
export declare const parseJson: (key: string, value: string | undefined) => any;
export declare const createAssert: (modelNameKey: string, provider: "process.env" | "modelConfig", modelName?: string) => (value: string | undefined, key: string, modelVendorFlag?: string) => void;
