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
    usePlaygroundExecution: ()=>usePlaygroundExecution
});
const external_react_namespaceObject = require("react");
const store_js_namespaceObject = require("../store/store.js");
const playground_namespaceObject = require("@sqai/playground");
const constants_js_namespaceObject = require("../utils/constants.js");
const replay_scripts_js_namespaceObject = require("../utils/replay-scripts.js");
function usePlaygroundExecution(playgroundSDK, storage, actionSpace, loading, setLoading, infoList, setInfoList, replayCounter, setReplayCounter, verticalMode, currentRunningIdRef, interruptedFlagRef) {
    const { deepThink, screenshotIncluded, domIncluded } = (0, store_js_namespaceObject.useEnvConfig)();
    const handleRun = (0, external_react_namespaceObject.useCallback)(async (value)=>{
        if (!playgroundSDK) return void console.warn('PlaygroundSDK is not available');
        const thisRunningId = Date.now();
        const actionType = value.type;
        const displayContent = `${value.type}: ${value.prompt || JSON.stringify(value.params)}`;
        const userItem = {
            id: `user-${Date.now()}`,
            type: 'user',
            content: displayContent,
            timestamp: new Date()
        };
        setInfoList((prev)=>[
                ...prev,
                userItem
            ]);
        setLoading(true);
        const result = {
            ...constants_js_namespaceObject.BLANK_RESULT
        };
        const systemItem = {
            id: `system-${thisRunningId}`,
            type: 'system',
            content: '',
            timestamp: new Date(),
            loading: true,
            loadingProgressText: ''
        };
        setInfoList((prev)=>[
                ...prev,
                systemItem
            ]);
        try {
            currentRunningIdRef.current = thisRunningId;
            interruptedFlagRef.current[thisRunningId] = false;
            if (playgroundSDK.onProgressUpdate) playgroundSDK.onProgressUpdate(()=>{});
            if (playgroundSDK.onProgressUpdate) playgroundSDK.onProgressUpdate((tip)=>{
                if (interruptedFlagRef.current[thisRunningId]) return;
                setInfoList((prev)=>{
                    const lastItem = prev[prev.length - 1];
                    if (lastItem && 'progress' === lastItem.type && lastItem.content === tip) return prev;
                    const progressItem = {
                        id: `progress-${thisRunningId}-${Date.now()}`,
                        type: 'progress',
                        content: tip,
                        timestamp: new Date()
                    };
                    return [
                        ...prev,
                        progressItem
                    ];
                });
            });
            result.result = await playgroundSDK.executeAction(actionType, value, {
                requestId: thisRunningId.toString(),
                deepThink,
                screenshotIncluded,
                domIncluded
            });
            if ('object' == typeof result.result && null !== result.result) {
                const resultObj = result.result;
                if (resultObj.dump) result.dump = resultObj.dump;
                if (resultObj.reportHTML) result.reportHTML = resultObj.reportHTML;
                if (resultObj.error) result.error = resultObj.error;
                if (void 0 !== resultObj.result) result.result = resultObj.result;
            }
        } catch (e) {
            result.error = (null == e ? void 0 : e.message) || String(e);
            console.error('Playground execution error:', e);
        }
        if (interruptedFlagRef.current[thisRunningId]) return;
        setLoading(false);
        currentRunningIdRef.current = null;
        let replayInfo = null;
        let counter = replayCounter;
        if ((null == result ? void 0 : result.dump) && !playground_namespaceObject.noReplayAPIs.includes(actionType)) {
            const info = (0, replay_scripts_js_namespaceObject.allScriptsFromDump)(result.dump);
            setReplayCounter((c)=>c + 1);
            replayInfo = info;
            counter = replayCounter + 1;
        }
        setInfoList((prev)=>prev.map((item)=>item.id === `system-${thisRunningId}` ? {
                    ...item,
                    content: '',
                    loading: false,
                    loadingProgressText: ''
                } : item));
        const resultItem = {
            id: `result-${thisRunningId}`,
            type: 'result',
            content: 'Execution result',
            timestamp: new Date(),
            result: result,
            loading: false,
            replayScriptsInfo: replayInfo,
            replayCounter: counter,
            loadingProgressText: '',
            verticalMode: verticalMode
        };
        setInfoList((prev)=>[
                ...prev,
                resultItem
            ]);
        if (null == storage ? void 0 : storage.saveResult) try {
            await storage.saveResult(resultItem.id, resultItem);
        } catch (error) {
            console.error('Failed to save result:', error);
        }
        const separatorItem = {
            id: `separator-${thisRunningId}`,
            type: 'separator',
            content: 'New Session',
            timestamp: new Date()
        };
        setInfoList((prev)=>[
                ...prev,
                separatorItem
            ]);
    }, [
        playgroundSDK,
        storage,
        actionSpace,
        setLoading,
        setInfoList,
        replayCounter,
        setReplayCounter,
        verticalMode,
        currentRunningIdRef,
        interruptedFlagRef,
        deepThink,
        screenshotIncluded,
        domIncluded
    ]);
    const handleStop = (0, external_react_namespaceObject.useCallback)(async ()=>{
        const thisRunningId = currentRunningIdRef.current;
        if (thisRunningId && playgroundSDK && playgroundSDK.cancelExecution) try {
            await playgroundSDK.cancelExecution(thisRunningId.toString());
            interruptedFlagRef.current[thisRunningId] = true;
            setLoading(false);
            if (playgroundSDK.onProgressUpdate) playgroundSDK.onProgressUpdate(()=>{});
            setInfoList((prev)=>prev.map((item)=>item.id === `system-${thisRunningId}` && item.loading ? {
                        ...item,
                        content: 'Operation stopped',
                        loading: false,
                        loadingProgressText: ''
                    } : item));
            const separatorItem = {
                id: `separator-${thisRunningId}`,
                type: 'separator',
                content: 'New Session',
                timestamp: new Date()
            };
            setInfoList((prev)=>[
                    ...prev,
                    separatorItem
                ]);
        } catch (error) {
            console.error('Failed to stop execution:', error);
        }
    }, [
        playgroundSDK,
        currentRunningIdRef,
        interruptedFlagRef,
        setLoading,
        setInfoList
    ]);
    const canStop = loading && !!currentRunningIdRef.current && !!playgroundSDK && !!playgroundSDK.cancelExecution;
    return {
        handleRun,
        handleStop,
        canStop
    };
}
exports.usePlaygroundExecution = __webpack_exports__.usePlaygroundExecution;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "usePlaygroundExecution"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
