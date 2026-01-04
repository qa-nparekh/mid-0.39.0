import type { DeviceAction, Point, UIContext } from '@sqaitech/core';
import type { AbstractInterface } from '@sqaitech/core/device';
type WebUIContext = UIContext & {
    screenshotBase64?: string;
    size: {
        width: number;
        height: number;
        dpr?: number;
    };
};
export default class StaticPage implements AbstractInterface {
    interfaceType: string;
    private uiContext;
    constructor(uiContext: WebUIContext);
    actionSpace(): DeviceAction[];
    evaluateJavaScript<T = unknown>(script: string): Promise<T>;
    getElementsInfo(): Promise<never>;
    getElementsNodeTree(): Promise<never>;
    getXpathsById(id: string): Promise<never>;
    getXpathsByPoint(point: Point): Promise<never>;
    getElementInfoByXpath(xpath: string): Promise<never>;
    size(): Promise<{
        dpr: number;
        width: number;
        height: number;
    }>;
    screenshotBase64(): Promise<string>;
    url(): Promise<string>;
    scrollUntilTop(startingPoint?: Point): Promise<never>;
    scrollUntilBottom(startingPoint?: Point): Promise<never>;
    scrollUntilLeft(startingPoint?: Point): Promise<never>;
    scrollUntilRight(startingPoint?: Point): Promise<never>;
    scrollUp(distance?: number, startingPoint?: Point): Promise<never>;
    scrollDown(distance?: number, startingPoint?: Point): Promise<never>;
    scrollLeft(distance?: number, startingPoint?: Point): Promise<never>;
    scrollRight(distance?: number, startingPoint?: Point): Promise<never>;
    clearInput(): Promise<never>;
    mouse: {
        click: () => never;
        wheel: () => never;
        move: () => never;
        drag: () => never;
    };
    keyboard: {
        type: () => never;
        press: () => never;
    };
    destroy(): Promise<void>;
    getContext(): Promise<UIContext>;
    updateContext(newContext: WebUIContext): void;
}
export {};
