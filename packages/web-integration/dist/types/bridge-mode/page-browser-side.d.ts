import ChromeExtensionProxyPage from '../chrome-extension/page';
import type { ChromePageDestroyOptions } from '../web-page';
import { type BridgeConnectTabOptions } from './common';
import { BridgeClient } from './io-client';
export declare class ExtensionBridgePageBrowserSide extends ChromeExtensionProxyPage {
    onDisconnect: () => void;
    onLogMessage: (message: string, type: 'log' | 'status') => void;
    bridgeClient: BridgeClient | null;
    private destroyOptions?;
    private newlyCreatedTabIds;
    constructor(onDisconnect?: () => void, onLogMessage?: (message: string, type: 'log' | 'status') => void, forceSameTabNavigation?: boolean);
    private setupBridgeClient;
    connect(): Promise<void>;
    connectNewTabWithUrl(url: string, options?: BridgeConnectTabOptions): Promise<void>;
    connectCurrentTab(options?: BridgeConnectTabOptions): Promise<void>;
    setDestroyOptions(options: ChromePageDestroyOptions): Promise<void>;
    destroy(): Promise<void>;
}
