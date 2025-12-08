import { NodeType } from '../constants';
export declare function isFormElement(node: globalThis.Node): boolean;
export declare function isButtonElement(node: globalThis.Node): node is globalThis.HTMLButtonElement;
export declare function isAElement(node: globalThis.Node): node is globalThis.HTMLButtonElement;
export declare function isSvgElement(node: globalThis.Node): node is globalThis.SVGSVGElement;
export declare function isImgElement(node: globalThis.Node): node is globalThis.HTMLImageElement;
export declare function isNotContainerElement(node: globalThis.Node): boolean;
export declare function isTextElement(node: globalThis.Node): node is globalThis.HTMLTextAreaElement;
export declare function isContainerElement(node: globalThis.Node): node is globalThis.HTMLElement;
export declare function generateElementByPosition(position: {
    x: number;
    y: number;
}): {
    id: string;
    attributes: {
        nodeType: NodeType;
    };
    rect: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    content: string;
    center: number[];
};
