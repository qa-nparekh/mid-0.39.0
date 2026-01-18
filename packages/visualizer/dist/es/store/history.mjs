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
const { create: history_create } = external_zustand_namespaceObject;
const HISTORY_KEY = 'sqai-prompt-history-v2';
const LAST_SELECTED_TYPE_KEY = 'sqai-last-selected-type';
const getHistoryFromLocalStorage = ()=>{
    const historyString = localStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : {};
};
const getLastSelectedType = ()=>localStorage.getItem(LAST_SELECTED_TYPE_KEY) || 'aiAction';
const setLastSelectedType = (type)=>{
    localStorage.setItem(LAST_SELECTED_TYPE_KEY, type);
};
const useHistoryStore = history_create((set, get)=>({
        history: getHistoryFromLocalStorage(),
        lastSelectedType: getLastSelectedType(),
        clearHistory: (type)=>{
            const newHistory = {
                ...get().history
            };
            delete newHistory[type];
            set({
                history: newHistory
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        },
        addHistory: (historyItem)=>{
            const { type } = historyItem;
            const currentHistory = get().history;
            const typeHistory = currentHistory[type] || [];
            const stringifiedNewItem = JSON.stringify({
                prompt: historyItem.prompt,
                params: historyItem.params
            });
            const newTypeHistory = [
                historyItem,
                ...typeHistory.filter((h)=>{
                    const stringifiedOldItem = JSON.stringify({
                        prompt: h.prompt,
                        params: h.params
                    });
                    return stringifiedOldItem !== stringifiedNewItem;
                })
            ];
            if (newTypeHistory.length > 10) newTypeHistory.length = 10;
            const newHistory = {
                ...currentHistory,
                [type]: newTypeHistory
            };
            set({
                history: newHistory
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        },
        getHistoryForType: (type)=>get().history[type] || [],
        setLastSelectedType: (type)=>{
            set({
                lastSelectedType: type
            });
            setLastSelectedType(type);
        }
    }));
export { useHistoryStore };
