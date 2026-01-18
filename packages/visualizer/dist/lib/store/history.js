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
    useHistoryStore: ()=>useHistoryStore
});
const external_zustand_namespaceObject = require("zustand");
const { create } = external_zustand_namespaceObject;
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
const useHistoryStore = create((set, get)=>({
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
exports.useHistoryStore = __webpack_exports__.useHistoryStore;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "useHistoryStore"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
