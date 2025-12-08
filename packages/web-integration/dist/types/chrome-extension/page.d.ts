import type { ElementTreeNode, Point, Size, UIContext } from '@sqai/core';
import type { AbstractInterface, DeviceAction } from '@sqai/core/device';
import type { ElementInfo } from '@sqai/shared/extractor';
import { type KeyInput, type MouseButton } from '../web-page';
export default class ChromeExtensionProxyPage implements AbstractInterface {
    interfaceType: string;
    forceSameTabNavigation: boolean;
    private viewportSize?;
    private activeTabId;
    private tabIdOfDebuggerAttached;
    private attachingDebugger;
    private destroyed;
    private isMobileEmulation;
    _continueWhenFailedToAttachDebugger: boolean;
    constructor(forceSameTabNavigation: boolean);
    actionSpace(): DeviceAction[];
    setActiveTabId(tabId: number): Promise<void>;
    getActiveTabId(): Promise<number | null>;
    /**
     * Get a list of current tabs
     * @returns {Promise<Array<{id: number, title: string, url: string}>>}
     */
    getBrowserTabList(): Promise<{
        id: string;
        title: string;
        url: string;
        currentActiveTab: boolean;
    }[]>;
    getTabIdOrConnectToCurrentTab(): Promise<number>;
    private attachDebugger;
    private showMousePointer;
    private hideMousePointer;
    private detachDebugger;
    private enableWaterFlowAnimation;
    private disableWaterFlowAnimation;
    private sendCommandToDebugger;
    private getPageContentByCDP;
    evaluateJavaScript(script: string): Promise<any>;
    beforeInvokeAction(): Promise<void>;
    private waitUntilNetworkIdle;
    getElementsInfo(): Promise<ElementInfo[]>;
    getXpathsById(id: string): Promise<any>;
    getXpathsByPoint(point: Point, isOrderSensitive: boolean): Promise<any>;
    getElementInfoByXpath(xpath: string): Promise<any>;
    getElementsNodeTree(): Promise<ElementTreeNode<ElementInfo>>;
    getContext(): Promise<UIContext>;
    size(): Promise<Size>;
    screenshotBase64(): Promise<string>;
    url(): Promise<string>;
    scrollUntilTop(startingPoint?: Point): Promise<void>;
    scrollUntilBottom(startingPoint?: Point): Promise<void>;
    scrollUntilLeft(startingPoint?: Point): Promise<void>;
    scrollUntilRight(startingPoint?: Point): Promise<void>;
    scrollUp(distance?: number, startingPoint?: Point): Promise<void>;
    scrollDown(distance?: number, startingPoint?: Point): Promise<void>;
    scrollLeft(distance?: number, startingPoint?: Point): Promise<void>;
    scrollRight(distance?: number, startingPoint?: Point): Promise<void>;
    clearInput(element: ElementInfo): Promise<void>;
    private latestMouseX;
    private latestMouseY;
    mouse: {
        click: (x: number, y: number, options?: {
            button?: MouseButton;
            count?: number;
        }) => Promise<void>;
        wheel: (deltaX: number, deltaY: number, startX?: number, startY?: number) => Promise<void>;
        move: (x: number, y: number) => Promise<void>;
        drag: (from: {
            x: number;
            y: number;
        }, to: {
            x: number;
            y: number;
        }) => Promise<void>;
    };
    keyboard: {
        type: (text: string) => Promise<void>;
        press: (action: {
            key: KeyInput;
            command?: string;
        } | {
            key: KeyInput;
            command?: string;
        }[]) => Promise<void>;
    };
    destroy(): Promise<void>;
    longPress(x: number, y: number, duration?: number): Promise<void>;
    swipe(from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }, duration?: number): Promise<void>;
}
