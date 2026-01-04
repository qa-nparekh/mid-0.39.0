import { AbstractInterface } from '@sqaitech/core/device';
import { Agent } from '@sqaitech/core/agent';
import { AgentOpt } from '@sqaitech/core/agent';
import { DeviceAction } from '@sqaitech/core';
import type { ElementInfo } from '@sqaitech/shared/extractor';
import { InterfaceType } from '@sqaitech/core';
import { overrideAIConfig } from '@sqaitech/shared/env';
import { Point } from '@sqaitech/core';
import { Size } from '@sqaitech/core';
import { WebDriverClient } from '@sqaitech/webdriver';

export declare function agentFromWebDriverAgent(opts?: IOSAgentOpt & IOSDeviceOpt): Promise<IOSAgent>;

export declare function checkIOSEnvironment(): Promise<{
    available: boolean;
    error?: string;
}>;

export declare class IOSAgent extends Agent<IOSDevice> {
    launch(uri: string): Promise<void>;
}

declare type IOSAgentOpt = AgentOpt;

export declare class IOSDevice implements AbstractInterface {
    private deviceId;
    private devicePixelRatio;
    private devicePixelRatioInitialized;
    private destroyed;
    private description;
    private customActions?;
    private wdaBackend;
    private wdaManager;
    interfaceType: InterfaceType;
    uri: string | undefined;
    options?: IOSDeviceOpt;
    actionSpace(): DeviceAction<any>[];
    constructor(options?: IOSDeviceOpt);
    describe(): string;
    getConnectedDeviceInfo(): Promise<{
        udid: string;
        name: string;
        model: string;
    } | null>;
    connect(): Promise<void>;
    launch(uri: string): Promise<IOSDevice>;
    getElementsInfo(): Promise<ElementInfo[]>;
    getElementsNodeTree(): Promise<any>;
    private initializeDevicePixelRatio;
    getScreenSize(): Promise<{
        width: number;
        height: number;
        scale: number;
    }>;
    size(): Promise<Size>;
    screenshotBase64(): Promise<string>;
    clearInput(element: ElementInfo): Promise<void>;
    url(): Promise<string>;
    tap(x: number, y: number): Promise<void>;
    mouseClick(x: number, y: number): Promise<void>;
    doubleTap(x: number, y: number): Promise<void>;
    tripleTap(x: number, y: number): Promise<void>;
    longPress(x: number, y: number, duration?: number): Promise<void>;
    swipe(fromX: number, fromY: number, toX: number, toY: number, duration?: number): Promise<void>;
    typeText(text: string, options?: IOSDeviceInputOpt): Promise<void>;
    pressKey(key: string): Promise<void>;
    scrollUp(distance?: number, startPoint?: Point): Promise<void>;
    scrollDown(distance?: number, startPoint?: Point): Promise<void>;
    scrollLeft(distance?: number, startPoint?: Point): Promise<void>;
    scrollRight(distance?: number, startPoint?: Point): Promise<void>;
    scrollUntilTop(startPoint?: Point): Promise<void>;
    scrollUntilBottom(startPoint?: Point): Promise<void>;
    private compareScreenshots;
    private scrollUntilBoundary;
    scrollUntilLeft(startPoint?: Point): Promise<void>;
    scrollUntilRight(startPoint?: Point): Promise<void>;
    home(): Promise<void>;
    appSwitcher(): Promise<void>;
    hideKeyboard(keyNames?: string[]): Promise<boolean>;
    /**
     * Open a URL using WebDriverAgent
     * @param url The URL to open (supports http://, https://, and custom schemes)
     * @param options Configuration options for URL opening
     */
    openUrl(url: string, options?: {
        useSafariAsBackup?: boolean;
        waitTime?: number;
    }): Promise<void>;
    /**
     * Open a URL via Safari (backup method for real devices)
     * @param url The URL to open
     */
    openUrlViaSafari(url: string): Promise<void>;
    destroy(): Promise<void>;
}

declare type IOSDeviceInputOpt = {
    autoDismissKeyboard?: boolean;
};

declare type IOSDeviceOpt = {
    deviceId?: string;
    customActions?: DeviceAction<any>[];
    wdaPort?: number;
    wdaHost?: string;
    useWDA?: boolean;
} & IOSDeviceInputOpt;

export declare class IOSWebDriverClient extends WebDriverClient {
    launchApp(bundleId: string): Promise<void>;
    activateApp(bundleId: string): Promise<void>;
    terminateApp(bundleId: string): Promise<void>;
    openUrl(url: string): Promise<void>;
    pressHomeButton(): Promise<void>;
    appSwitcher(): Promise<void>;
    pressKey(key: string): Promise<void>;
    private normalizeKeyName;
    dismissKeyboard(keyNames?: string[]): Promise<boolean>;
    typeText(text: string): Promise<void>;
    tap(x: number, y: number): Promise<void>;
    swipe(fromX: number, fromY: number, toX: number, toY: number, duration?: number): Promise<void>;
    longPress(x: number, y: number, duration?: number): Promise<void>;
    doubleTap(x: number, y: number): Promise<void>;
    tripleTap(x: number, y: number): Promise<void>;
    getScreenScale(): Promise<number | null>;
    createSession(capabilities?: any): Promise<any>;
    private setupIOSSession;
}

export { overrideAIConfig }

export { }
