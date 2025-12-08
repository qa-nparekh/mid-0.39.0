import { useCallback, useEffect, useRef, useState } from "react";
import { createStorageProvider, detectBestStorageType } from "../component/universal-playground/providers/storage-provider.mjs";
import { WELCOME_MESSAGE_TEMPLATE } from "../utils/constants.mjs";
function usePlaygroundState(playgroundSDK, storage, contextProvider) {
    const [loading, setLoading] = useState(false);
    const [infoList, setInfoList] = useState([]);
    const [actionSpace, setActionSpace] = useState([]);
    const [actionSpaceLoading, setActionSpaceLoading] = useState(true);
    const [uiContextPreview, setUiContextPreview] = useState();
    const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
    const [verticalMode, setVerticalMode] = useState(false);
    const [replayCounter, setReplayCounter] = useState(0);
    const infoListRef = useRef(null);
    const currentRunningIdRef = useRef(null);
    const interruptedFlagRef = useRef({});
    const initializedRef = useRef(false);
    useEffect(()=>{
        const migrateFromOldNamespace = async ()=>{
            const oldStorage = createStorageProvider(detectBestStorageType(), 'playground-default');
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
                ...WELCOME_MESSAGE_TEMPLATE,
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
    useEffect(()=>{
        if ((null == storage ? void 0 : storage.saveMessages) && infoList.length > 1) storage.saveMessages(infoList).catch((error)=>{
            if (error instanceof DOMException && 'QuotaExceededError' === error.name) console.warn('Storage quota exceeded - some messages may not be saved persistently');
            else console.error('Failed to save messages:', error);
        });
    }, [
        infoList,
        storage
    ]);
    useEffect(()=>{
        if (!(null == contextProvider ? void 0 : contextProvider.getUIContext) || uiContextPreview) return;
        contextProvider.getUIContext().then((context)=>setUiContextPreview(context)).catch((error)=>{
            console.error('Failed to get UI context:', error);
        });
    }, [
        contextProvider,
        uiContextPreview
    ]);
    useEffect(()=>{
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
    useEffect(()=>{
        const sizeThreshold = 750;
        setVerticalMode(window.innerWidth < sizeThreshold);
        const handleResize = ()=>{
            setVerticalMode(window.innerWidth < sizeThreshold);
        };
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, []);
    const scrollToBottom = useCallback(()=>{
        setTimeout(()=>{
            if (infoListRef.current) infoListRef.current.scrollTop = infoListRef.current.scrollHeight;
        }, 100);
    }, []);
    const checkIfScrolledToBottom = useCallback(()=>{
        if (infoListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = infoListRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setShowScrollToBottomButton(!isAtBottom);
        }
    }, []);
    const handleScrollToBottom = useCallback(()=>{
        if (infoListRef.current) {
            infoListRef.current.scrollTo({
                top: infoListRef.current.scrollHeight,
                behavior: 'smooth'
            });
            setShowScrollToBottomButton(false);
        }
    }, []);
    useEffect(()=>{
        if (infoList.length > 0) scrollToBottom();
    }, [
        infoList,
        scrollToBottom
    ]);
    useEffect(()=>{
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
    const clearInfoList = useCallback(async ()=>{
        const welcomeMessage = {
            ...WELCOME_MESSAGE_TEMPLATE,
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
    const refreshContext = useCallback(async ()=>{
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
export { usePlaygroundState };
