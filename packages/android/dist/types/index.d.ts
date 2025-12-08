import { AbstractInterface } from '@sqai/core/device';
import { ADB } from 'appium-adb';
import { Agent } from '@sqai/core/agent';
import { AgentOpt } from '@sqai/core/agent';
import { Device } from 'appium-adb';
import { DeviceAction } from '@sqai/core';
import type { ElementInfo } from '@sqai/shared/extractor';
import { InterfaceType } from '@sqai/core';
import { overrideAIConfig } from '@sqai/shared/env';
import { Point } from '@sqai/core';
import { Size } from '@sqai/core';

export declare function agentFromAdbDevice(deviceId?: string, opts?: AndroidAgentOpt & AndroidDeviceOpt): Promise<AndroidAgent>;

export declare class AndroidAgent extends Agent<AndroidDevice> {
    launch(uri: string): Promise<void>;
    runAdbShell(command: string): Promise<string>;
}

declare type AndroidAgentOpt = AgentOpt;

export declare class AndroidDevice implements AbstractInterface {
    private deviceId;
    private yadbPushed;
    private devicePixelRatio;
    private devicePixelRatioInitialized;
    private scalingRatio;
    private adb;
    private connectingAdb;
    private destroyed;
    private description;
    private customActions?;
    private cachedScreenSize;
    private cachedOrientation;
    interfaceType: InterfaceType;
    uri: string | undefined;
    options?: AndroidDeviceOpt;
    actionSpace(): DeviceAction<any>[];
    constructor(deviceId: string, options?: AndroidDeviceOpt);
    describe(): string;
    connect(): Promise<ADB>;
    getAdb(): Promise<ADB>;
    private createAdbProxy;
    launch(uri: string): Promise<AndroidDevice>;
    execYadb(keyboardContent: string): Promise<void>;
    getElementsInfo(): Promise<ElementInfo[]>;
    getElementsNodeTree(): Promise<any>;
    getScreenSize(): Promise<{
        override: string;
        physical: string;
        orientation: number;
    }>;
    private initializeDevicePixelRatio;
    getDisplayDensity(): Promise<number>;
    getDisplayOrientation(): Promise<number>;
    size(): Promise<Size>;
    private adjustCoordinates;
    /**
     * Calculate the end point for scroll operations based on start point, scroll delta, and screen boundaries.
     * This method ensures that scroll operations stay within screen bounds and maintain a minimum scroll distance
     * for effective scrolling gestures on Android devices.
     *
     * @param start - The starting point of the scroll gesture
     * @param deltaX - The horizontal scroll distance (positive = scroll right, negative = scroll left)
     * @param deltaY - The vertical scroll distance (positive = scroll down, negative = scroll up)
     * @param maxWidth - The maximum width boundary (screen width)
     * @param maxHeight - The maximum height boundary (screen height)
     * @returns The calculated end point for the scroll gesture
     */
    private calculateScrollEndPoint;
    screenshotBase64(): Promise<string>;
    clearInput(element: ElementInfo): Promise<void>;
    forceScreenshot(path: string): Promise<void>;
    url(): Promise<string>;
    scrollUntilTop(startPoint?: Point): Promise<void>;
    scrollUntilBottom(startPoint?: Point): Promise<void>;
    scrollUntilLeft(startPoint?: Point): Promise<void>;
    scrollUntilRight(startPoint?: Point): Promise<void>;
    scrollUp(distance?: number, startPoint?: Point): Promise<void>;
    scrollDown(distance?: number, startPoint?: Point): Promise<void>;
    scrollLeft(distance?: number, startPoint?: Point): Promise<void>;
    scrollRight(distance?: number, startPoint?: Point): Promise<void>;
    ensureYadb(): Promise<void>;
    keyboardType(text: string, options?: AndroidDeviceInputOpt): Promise<void>;
    private normalizeKeyName;
    keyboardPress(key: string): Promise<void>;
    mouseClick(x: number, y: number): Promise<void>;
    mouseDoubleClick(x: number, y: number): Promise<void>;
    mouseMove(): Promise<void>;
    mouseDrag(from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }, duration?: number): Promise<void>;
    scroll(deltaX: number, deltaY: number, duration?: number): Promise<void>;
    destroy(): Promise<void>;
    back(): Promise<void>;
    home(): Promise<void>;
    recentApps(): Promise<void>;
    longPress(x: number, y: number, duration?: number): Promise<void>;
    pullDown(startPoint?: Point, distance?: number, duration?: number): Promise<void>;
    pullDrag(from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }, duration: number): Promise<void>;
    pullUp(startPoint?: Point, distance?: number, duration?: number): Promise<void>;
    private getDisplayArg;
    getPhysicalDisplayId(): Promise<string | null>;
    hideKeyboard(options?: AndroidDeviceInputOpt, timeoutMs?: number): Promise<boolean>;
}

declare type AndroidDeviceInputOpt = {
    autoDismissKeyboard?: boolean;
    keyboardDismissStrategy?: 'esc-first' | 'back-first';
};

declare type AndroidDeviceOpt = {
    androidAdbPath?: string;
    remoteAdbHost?: string;
    remoteAdbPort?: number;
    imeStrategy?: ImeStrategy;
    displayId?: number;
    usePhysicalDisplayIdForScreenshot?: boolean;
    usePhysicalDisplayIdForDisplayLookup?: boolean;
    customActions?: DeviceAction<any>[];
    screenshotResizeScale?: number;
    alwaysRefreshScreenInfo?: boolean;
} & AndroidDeviceInputOpt;

export declare function getConnectedDevices(): Promise<Device[]>;

declare const IME_STRATEGY_ALWAYS_YADB: "always-yadb";

declare const IME_STRATEGY_YADB_FOR_NON_ASCII: "yadb-for-non-ascii";

declare type ImeStrategy = typeof IME_STRATEGY_ALWAYS_YADB | typeof IME_STRATEGY_YADB_FOR_NON_ASCII;

export { overrideAIConfig }

export { }
