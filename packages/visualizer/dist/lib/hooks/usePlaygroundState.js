"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    usePlaygroundState: ()=>usePlaygroundState
});
const external_react_namespaceObject = require("react");
const storage_provider_js_namespaceObject = require("../component/universal-playground/providers/storage-provider.js");
const constants_js_namespaceObject = require("../utils/constants.js");
function usePlaygroundState(playgroundSDK, storage, contextProvider) {
    const [loading, setLoading] = (0, external_react_namespaceObject.useState)(false);
    const [infoList, setInfoList] = (0, external_react_namespaceObject.useState)([]);
    const [actionSpace, setActionSpace] = (0, external_react_namespaceObject.useState)([]);
    const [actionSpaceLoading, setActionSpaceLoading] = (0, external_react_namespaceObject.useState)(true);
    const [uiContextPreview, setUiContextPreview] = (0, external_react_namespaceObject.useState)();
    const [showScrollToBottomButton, setShowScrollToBottomButton] = (0, external_react_namespaceObject.useState)(false);
    const [verticalMode, setVerticalMode] = (0, external_react_namespaceObject.useState)(false);
    const [replayCounter, setReplayCounter] = (0, external_react_namespaceObject.useState)(0);
    const infoListRef = (0, external_react_namespaceObject.useRef)(null);
    const currentRunningIdRef = (0, external_react_namespaceObject.useRef)(null);
    const interruptedFlagRef = (0, external_react_namespaceObject.useRef)({});
    const initializedRef = (0, external_react_namespaceObject.useRef)(false);
    (0, external_react_namespaceObject.useEffect)(()=>{
        const migrateFromOldNamespace = async ()=>{
            const oldStorage = (0, storage_provider_js_namespaceObject.createStorageProvider)((0, storage_provider_js_namespaceObject.detectBestStorageType)(), 'playground-default');
            try {
                if (null == oldStorage ? void 0 : oldStorage.loadMessages) {
                    const oldMessages = await oldStorage.loadMessages();
                    if (oldMessages.length > 1) {
                        console.log('Found data in old namespace, migrating...');
                        if (null == storage ? void 0 : storage.saveMessages) await storage.saveMessages(oldMessages);
                        if (oldStorage.clearMessages) await oldStorage.clearMessages();
                        return oldMessages;
                    }
                }
            } catch (error) {
                console.debug('No data found in old namespace:', error);
            }
            return [];
        };
        const initializeMessages = async ()=>{
            const welcomeMessage = {
                ...constants_js_namespaceObject.WELCOME_MESSAGE_TEMPLATE,
                id: 'welcome',
                timestamp: new Date()
            };
            if (null == storage ? void 0 : storage.loadMessages) try {
                let storedMessages = await storage.loadMessages();
                if (0 === storedMessages.length) storedMessages = await migrateFromOldNamespace();
                const hasWelcomeMessage = storedMessages.some((msg)=>'welcome' === msg.id);
                hasWelcomeMessage ? setInfoList(storedMessages) : setInfoList([
                    welcomeMessage,
                    ...storedMessages
                ]);
            } catch (error) {
                console.error('Failed to load messages:', error);
                setInfoList([
                    welcomeMessage
                ]);
            }
            else setInfoList([
                welcomeMessage
            ]);
        };
        if (storage && !initializedRef.current) {
            initializedRef.current = true;
            initializeMessages();
        } else if (!storage && 0 === infoList.length) initializeMessages();
    }, [
        storage
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if ((null == storage ? void 0 : storage.saveMessages) && infoList.length > 1) storage.saveMessages(infoList).catch((error)=>{
            if (error instanceof DOMException && 'QuotaExceededError' === error.name) console.warn('Storage quota exceeded - some messages may not be saved persistently');
            else console.error('Failed to save messages:', error);
        });
    }, [
        infoList,
        storage
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (!(null == contextProvider ? void 0 : contextProvider.getUIContext) || uiContextPreview) return;
        contextProvider.getUIContext().then((context)=>setUiContextPreview(context)).catch((error)=>{
            console.error('Failed to get UI context:', error);
        });
    }, [
        contextProvider,
        uiContextPreview
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        const loadActionSpace = async ()=>{
            setActionSpaceLoading(true);
            try {
                var _contextProvider_getUIContext;
                if (!playgroundSDK) return void setActionSpace([]);
                const context = uiContextPreview || await (null == contextProvider ? void 0 : null == (_contextProvider_getUIContext = contextProvider.getUIContext) ? void 0 : _contextProvider_getUIContext.call(contextProvider));
                const space = await playgroundSDK.getActionSpace(context);
                setActionSpace(space || []);
            } catch (error) {
                console.error('Failed to load action space:', error);
                setActionSpace([]);
            } finally{
                setActionSpaceLoading(false);
            }
        };
        loadActionSpace();
    }, [
        playgroundSDK,
        uiContextPreview,
        contextProvider
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        const sizeThreshold = 750;
        setVerticalMode(window.innerWidth < sizeThreshold);
        const handleResize = ()=>{
            setVerticalMode(window.innerWidth < sizeThreshold);
        };
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, []);
    const scrollToBottom = (0, external_react_namespaceObject.useCallback)(()=>{
        setTimeout(()=>{
            if (infoListRef.current) infoListRef.current.scrollTop = infoListRef.current.scrollHeight;
        }, 100);
    }, []);
    const checkIfScrolledToBottom = (0, external_react_namespaceObject.useCallback)(()=>{
        if (infoListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = infoListRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setShowScrollToBottomButton(!isAtBottom);
        }
    }, []);
    const handleScrollToBottom = (0, external_react_namespaceObject.useCallback)(()=>{
        if (infoListRef.current) {
            infoListRef.current.scrollTo({
                top: infoListRef.current.scrollHeight,
                behavior: 'smooth'
            });
            setShowScrollToBottomButton(false);
        }
    }, []);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (infoList.length > 0) scrollToBottom();
    }, [
        infoList,
        scrollToBottom
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        const container = infoListRef.current;
        if (container) {
            container.addEventListener('scroll', checkIfScrolledToBottom);
            checkIfScrolledToBottom();
            return ()=>{
                container.removeEventListener('scroll', checkIfScrolledToBottom);
            };
        }
    }, [
        checkIfScrolledToBottom
    ]);
    const clearInfoList = (0, external_react_namespaceObject.useCallback)(async ()=>{
        const welcomeMessage = {
            ...constants_js_namespaceObject.WELCOME_MESSAGE_TEMPLATE,
            id: 'welcome',
            timestamp: new Date()
        };
        setInfoList([
            welcomeMessage
        ]);
        if (null == storage ? void 0 : storage.clearMessages) try {
            await storage.clearMessages();
        } catch (error) {
            console.error('Failed to clear stored messages:', error);
        }
    }, [
        storage
    ]);
    const refreshContext = (0, external_react_namespaceObject.useCallback)(async ()=>{
        if (null == contextProvider ? void 0 : contextProvider.refreshContext) try {
            const newContext = await contextProvider.refreshContext();
            setUiContextPreview(newContext);
        } catch (error) {
            console.error('Failed to refresh context:', error);
        }
    }, [
        contextProvider
    ]);
    return {
        loading,
        setLoading,
        infoList,
        setInfoList,
        actionSpace,
        actionSpaceLoading,
        uiContextPreview,
        setUiContextPreview,
        showScrollToBottomButton,
        verticalMode,
        replayCounter,
        setReplayCounter,
        infoListRef,
        currentRunningIdRef,
        interruptedFlagRef,
        clearInfoList,
        refreshContext,
        handleScrollToBottom,
        scrollToBottom
    };
}
exports.usePlaygroundState = __webpack_exports__.usePlaygroundState;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "usePlaygroundState"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
