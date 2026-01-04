import { type WebPageAgentOpt } from '../web-element';
import type { DeviceAction, ElementCacheFeature, ElementTreeNode, Point, Rect, Size, UIContext } from '@sqaitech/core';
import type { AbstractInterface } from '@sqaitech/core/device';
import type { ElementInfo } from '@sqaitech/shared/extractor';
import { type DebugFunction } from '@sqaitech/shared/logger';
import type { Page as PlaywrightPage } from 'playwright';
import type { Page as PuppeteerPage } from 'puppeteer';
import { type KeyInput, type MouseButton } from '../web-page';
export declare const debugPage: DebugFunction;
export declare class Page<AgentType extends 'puppeteer' | 'playwright', InterfaceType extends PuppeteerPage | PlaywrightPage> implements AbstractInterface {
    underlyingPage: InterfaceType;
    protected waitForNavigationTimeout: number;
    protected waitForNetworkIdleTimeout: number;
    private viewportSize?;
    private onBeforeInvokeAction?;
    private onAfterInvokeAction?;
    private customActions?;
    interfaceType: AgentType;
    actionSpace(): DeviceAction[];
    private evaluate;
    constructor(underlyingPage: InterfaceType, interfaceType: AgentType, opts?: WebPageAgentOpt);
    evaluateJavaScript<T = any>(script: string): Promise<T>;
    waitForNavigation(): Promise<void>;
    waitForNetworkIdle(): Promise<void>;
    getElementsInfo(): Promise<ElementInfo[]>;
    getXpathsById(id: string): Promise<any>;
    getXpathsByPoint(point: Point, isOrderSensitive: boolean): Promise<any>;
    getElementInfoByXpath(xpath: string): Promise<any>;
    cacheFeatureForRect(rect: Rect, opt?: {
        _orderSensitive: boolean;
    }): Promise<ElementCacheFeature>;
    rectMatchesCacheFeature(feature: ElementCacheFeature): Promise<Rect>;
    getElementsNodeTree(): Promise<ElementTreeNode<ElementInfo>>;
    size(): Promise<Size>;
    screenshotBase64(): Promise<string>;
    url(): Promise<string>;
    describe(): string;
    get mouse(): {
        click: (x: number, y: number, options?: {
            button?: MouseButton;
            count?: number;
        }) => Promise<void>;
        wheel: (deltaX: number, deltaY: number) => Promise<void>;
        move: (x: number, y: number) => Promise<void>;
        drag: (from: {
            x: number;
            y: number;
        }, to: {
            x: number;
            y: number;
        }) => Promise<void>;
    };
    get keyboard(): {
        type: (text: string) => Promise<void>;
        press: (action: {
            key: KeyInput;
            command?: string;
        } | {
            key: KeyInput;
            command?: string;
        }[]) => Promise<void>;
        down: (key: KeyInput) => Promise<void>;
        up: (key: KeyInput) => Promise<void>;
    };
    clearInput(element: ElementInfo): Promise<void>;
    private everMoved;
    private moveToPointBeforeScroll;
    scrollUntilTop(startingPoint?: Point): Promise<void>;
    scrollUntilBottom(startingPoint?: Point): Promise<void>;
    scrollUntilLeft(startingPoint?: Point): Promise<void>;
    scrollUntilRight(startingPoint?: Point): Promise<void>;
    scrollUp(distance?: number, startingPoint?: Point): Promise<void>;
    scrollDown(distance?: number, startingPoint?: Point): Promise<void>;
    scrollLeft(distance?: number, startingPoint?: Point): Promise<void>;
    scrollRight(distance?: number, startingPoint?: Point): Promise<void>;
    navigate(url: string): Promise<void>;
    beforeInvokeAction(name: string, param: any): Promise<void>;
    afterInvokeAction(name: string, param: any): Promise<void>;
    destroy(): Promise<void>;
    getContext(): Promise<UIContext>;
    swipe(from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }, duration?: number): Promise<void>;
    longPress(x: number, y: number, duration?: number): Promise<void>;
}
export declare function forceClosePopup(page: PuppeteerPage | PlaywrightPage, debugProfile: DebugFunction): void;
