import type { AgentOpt, DeviceAction, Rect, UIContext, WebElementInfo } from '@sqai/core';
import type { AbstractInterface } from '@sqai/core/device';
import type { NodeType } from '@sqai/shared/constants';
import type ChromeExtensionProxyPage from './chrome-extension/page';
import type { PlaywrightWebPage } from './playwright';
import type { PuppeteerWebPage } from './puppeteer';
import type { StaticPage } from './static';
export type { WebElementInfo };
export type WebPageAgentOpt = AgentOpt & WebPageOpt;
export type WebPageOpt = {
    waitForNavigationTimeout?: number;
    waitForNetworkIdleTimeout?: number;
    forceSameTabNavigation?: boolean;
    beforeInvokeAction?: () => Promise<void>;
    afterInvokeAction?: () => Promise<void>;
    customActions?: DeviceAction<any>[];
};
export type WebPage = PlaywrightWebPage | PuppeteerWebPage | StaticPage | ChromeExtensionProxyPage;
export declare class WebElementInfoImpl implements WebElementInfo {
    content: string;
    rect: Rect;
    center: [number, number];
    id: string;
    indexId: number;
    attributes: {
        nodeType: NodeType;
        [key: string]: string;
    };
    xpaths?: string[];
    isVisible: boolean;
    constructor({ content, rect, id, attributes, indexId, xpaths, isVisible, }: {
        content: string;
        rect: Rect;
        id: string;
        attributes: {
            nodeType: NodeType;
            [key: string]: string;
        };
        indexId: number;
        xpaths?: string[];
        isVisible: boolean;
    });
}
export declare function WebPageContextParser(page: AbstractInterface, _opt: {
    uploadServerUrl?: string;
}): Promise<UIContext>;
export declare const limitOpenNewTabScript = "\nif (!window.__MIDSCENE_NEW_TAB_INTERCEPTOR_INITIALIZED__) {\n  window.__MIDSCENE_NEW_TAB_INTERCEPTOR_INITIALIZED__ = true;\n\n  // Intercept the window.open method (only once)\n  window.open = function(url) {\n    console.log('Blocked window.open:', url);\n    window.location.href = url;\n    return null;\n  };\n\n  // Block all a tag clicks with target=\"_blank\" (only once)\n  document.addEventListener('click', function(e) {\n    const target = e.target.closest('a');\n    if (target && target.target === '_blank') {\n      e.preventDefault();\n      console.log('Blocked new tab:', target.href);\n      window.location.href = target.href;\n      target.removeAttribute('target');\n    }\n  }, true);\n}\n";
