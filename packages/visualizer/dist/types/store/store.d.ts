import * as Z from 'zustand';
export declare const useBlackboardPreference: Z.UseBoundStore<Z.StoreApi<{
    backgroundVisible: boolean;
    elementsVisible: boolean;
    autoZoom: boolean;
    setBackgroundVisible: (visible: boolean) => void;
    setElementsVisible: (visible: boolean) => void;
    setAutoZoom: (enabled: boolean) => void;
}>>;
/**
 * Service Mode
 *
 * - Server: use a node server to run the code
 * - In-Browser: use browser's fetch API to run the code
 * - In-Browser-Extension: use browser's fetch API to run the code, but the page is running in the extension context
 */
export type ServiceModeType = 'Server' | 'In-Browser' | 'In-Browser-Extension';
export declare const useEnvConfig: Z.UseBoundStore<Z.StoreApi<{
    serviceMode: ServiceModeType;
    setServiceMode: (serviceMode: ServiceModeType) => void;
    config: Record<string, string>;
    configString: string;
    setConfig: (config: Record<string, string>) => void;
    loadConfig: (configString: string) => void;
    syncFromStorage: () => void;
    forceSameTabNavigation: boolean;
    setForceSameTabNavigation: (forceSameTabNavigation: boolean) => void;
    deepThink: boolean;
    setDeepThink: (deepThink: boolean) => void;
    screenshotIncluded: boolean;
    setScreenshotIncluded: (screenshotIncluded: boolean) => void;
    domIncluded: boolean | "visible-only";
    setDomIncluded: (domIncluded: boolean | "visible-only") => void;
    popupTab: "playground" | "bridge" | "recorder";
    setPopupTab: (tab: "playground" | "bridge" | "recorder") => void;
}>>;
