import { create } from "zustand";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports, '__esModule', {
            value: true
        });
    };
})();
var external_zustand_namespaceObject = {};
__webpack_require__.r(external_zustand_namespaceObject);
__webpack_require__.d(external_zustand_namespaceObject, {
    create: ()=>create
});
const { create: store_create } = external_zustand_namespaceObject;
const AUTO_ZOOM_KEY = 'midscene-auto-zoom';
const BACKGROUND_VISIBLE_KEY = 'midscene-background-visible';
const ELEMENTS_VISIBLE_KEY = 'midscene-elements-visible';
const parseBooleanParam = (value)=>{
    if (null === value) return;
    const normalized = value.trim().toLowerCase();
    if ([
        '1',
        'true',
        'yes',
        'on'
    ].includes(normalized)) return true;
    if ([
        '0',
        'false',
        'no',
        'off'
    ].includes(normalized)) return false;
};
const getQueryPreference = (paramName)=>{
    if ('undefined' == typeof window) return;
    const searchParams = new URLSearchParams(window.location.search);
    return parseBooleanParam(searchParams.get(paramName));
};
const useBlackboardPreference = store_create((set)=>{
    const savedAutoZoom = 'false' !== localStorage.getItem(AUTO_ZOOM_KEY);
    const savedBackgroundVisible = 'false' !== localStorage.getItem(BACKGROUND_VISIBLE_KEY);
    const savedElementsVisible = 'false' !== localStorage.getItem(ELEMENTS_VISIBLE_KEY);
    const autoZoomFromQuery = getQueryPreference('focusOnCursor');
    const elementsVisibleFromQuery = getQueryPreference('showElementMarkers');
    return {
        backgroundVisible: savedBackgroundVisible,
        elementsVisible: void 0 === elementsVisibleFromQuery ? savedElementsVisible : elementsVisibleFromQuery,
        autoZoom: void 0 === autoZoomFromQuery ? savedAutoZoom : autoZoomFromQuery,
        setBackgroundVisible: (visible)=>{
            set({
                backgroundVisible: visible
            });
            localStorage.setItem(BACKGROUND_VISIBLE_KEY, visible.toString());
        },
        setElementsVisible: (visible)=>{
            set({
                elementsVisible: visible
            });
            localStorage.setItem(ELEMENTS_VISIBLE_KEY, visible.toString());
        },
        setAutoZoom: (enabled)=>{
            set({
                autoZoom: enabled
            });
            localStorage.setItem(AUTO_ZOOM_KEY, enabled.toString());
        }
    };
});
const CONFIG_KEY = 'midscene-env-config';
const SERVICE_MODE_KEY = 'midscene-service-mode';
const TRACKING_ACTIVE_TAB_KEY = 'midscene-tracking-active-tab';
const DEEP_THINK_KEY = 'midscene-deep-think';
const SCREENSHOT_INCLUDED_KEY = 'midscene-screenshot-included';
const DOM_INCLUDED_KEY = 'midscene-dom-included';
const getConfigStringFromLocalStorage = ()=>{
    const configString = localStorage.getItem(CONFIG_KEY);
    return configString || '';
};
const parseConfig = (configString)=>{
    const lines = configString.split('\n');
    const config = {};
    lines.forEach((line)=>{
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) return;
        const cleanLine = trimmed.replace(/^export\s+/i, '').replace(/;$/, '').trim();
        const match = cleanLine.match(/^(\w+)=(.*)$/);
        if (match) {
            const [, key, value] = match;
            let parsedValue = value.trim();
            if (parsedValue.startsWith("'") && parsedValue.endsWith("'") || parsedValue.startsWith('"') && parsedValue.endsWith('"')) parsedValue = parsedValue.slice(1, -1);
            config[key] = parsedValue;
        }
    });
    return config;
};
const useEnvConfig = store_create((set, get)=>{
    const configString = getConfigStringFromLocalStorage();
    const config = parseConfig(configString);
    const ifInExtension = window.location.href.startsWith('chrome-extension');
    const savedServiceMode = localStorage.getItem(SERVICE_MODE_KEY);
    const savedForceSameTabNavigation = 'false' !== localStorage.getItem(TRACKING_ACTIVE_TAB_KEY);
    const savedDeepThink = 'true' === localStorage.getItem(DEEP_THINK_KEY);
    const savedScreenshotIncluded = 'false' !== localStorage.getItem(SCREENSHOT_INCLUDED_KEY);
    const savedDomIncluded = localStorage.getItem(DOM_INCLUDED_KEY) || 'false';
    return {
        serviceMode: ifInExtension ? 'In-Browser-Extension' : savedServiceMode || 'Server',
        setServiceMode: (serviceMode)=>{
            if (ifInExtension) throw new Error('serviceMode cannot be set in extension');
            set({
                serviceMode
            });
            localStorage.setItem(SERVICE_MODE_KEY, serviceMode);
        },
        config,
        configString,
        setConfig: (config)=>set({
                config
            }),
        loadConfig: (configString)=>{
            const config = parseConfig(configString);
            set({
                config,
                configString
            });
            localStorage.setItem(CONFIG_KEY, configString);
        },
        syncFromStorage: ()=>{
            const latestConfigString = getConfigStringFromLocalStorage();
            const latestConfig = parseConfig(latestConfigString);
            set({
                config: latestConfig,
                configString: latestConfigString
            });
        },
        forceSameTabNavigation: savedForceSameTabNavigation,
        setForceSameTabNavigation: (forceSameTabNavigation)=>{
            set({
                forceSameTabNavigation
            });
            localStorage.setItem(TRACKING_ACTIVE_TAB_KEY, forceSameTabNavigation.toString());
        },
        deepThink: savedDeepThink,
        setDeepThink: (deepThink)=>{
            set({
                deepThink
            });
            localStorage.setItem(DEEP_THINK_KEY, deepThink.toString());
        },
        screenshotIncluded: savedScreenshotIncluded,
        setScreenshotIncluded: (screenshotIncluded)=>{
            set({
                screenshotIncluded
            });
            localStorage.setItem(SCREENSHOT_INCLUDED_KEY, screenshotIncluded.toString());
        },
        domIncluded: 'visible-only' === savedDomIncluded ? 'visible-only' : 'true' === savedDomIncluded,
        setDomIncluded: (domIncluded)=>{
            set({
                domIncluded
            });
            localStorage.setItem(DOM_INCLUDED_KEY, domIncluded.toString());
        },
        popupTab: 'playground',
        setPopupTab: (tab)=>{
            set({
                popupTab: tab
            });
        }
    };
});
export { useBlackboardPreference, useEnvConfig };
