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
    IndexedDBStorageProvider: ()=>external_indexeddb_storage_provider_js_namespaceObject.IndexedDBStorageProvider,
    StorageType: ()=>storage_provider_StorageType,
    detectBestStorageType: ()=>detectBestStorageType,
    IndexedDBMemoryStorageProvider: ()=>external_indexeddb_storage_provider_js_namespaceObject.MemoryStorageProvider,
    IndexedDBNoOpStorageProvider: ()=>external_indexeddb_storage_provider_js_namespaceObject.NoOpStorageProvider,
    LocalStorageProvider: ()=>LocalStorageProvider,
    NoOpStorageProvider: ()=>NoOpStorageProvider,
    createStorageProvider: ()=>createStorageProvider,
    MemoryStorageProvider: ()=>MemoryStorageProvider
});
const external_indexeddb_storage_provider_js_namespaceObject = require("./indexeddb-storage-provider.js");
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class LocalStorageProvider {
    checkStorageSpace() {
        try {
            const testKey = 'storage-test';
            const testData = 'x'.repeat(102400);
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    async saveMessages(messages) {
        try {
            if (!this.checkStorageSpace()) {
                console.warn('Low storage space detected, clearing old data...');
                await this.handleQuotaExceeded();
            }
            const messagesToSave = messages.slice(-this.maxStorageItems);
            const lightMessages = messagesToSave.map((msg)=>({
                    ...msg,
                    result: void 0
                }));
            const messageData = JSON.stringify(lightMessages);
            localStorage.setItem(this.messagesKey, messageData);
        } catch (error) {
            if (error instanceof DOMException && 'QuotaExceededError' === error.name) {
                console.warn('LocalStorage quota exceeded, attempting to clear old data and retry...');
                await this.handleQuotaExceeded();
                try {
                    const recentMessages = messages.slice(-10);
                    const lightRecentMessages = recentMessages.map((msg)=>({
                            ...msg,
                            result: void 0
                        }));
                    const messageData = JSON.stringify(lightRecentMessages);
                    localStorage.setItem(this.messagesKey, messageData);
                    console.info('Successfully saved recent messages after clearing storage');
                } catch (retryError) {
                    console.error('Failed to save even after clearing storage:', retryError);
                    await this.clearMessages();
                }
            } else console.error('Failed to save messages to localStorage:', error);
        }
    }
    async loadMessages() {
        try {
            const stored = localStorage.getItem(this.messagesKey);
            if (!stored) return [];
            const messages = JSON.parse(stored);
            const restoredMessages = await Promise.all(messages.map(async (msg)=>{
                if ('result' === msg.type && msg.id) {
                    const resultKey = `${this.resultsKey}-${msg.id}`;
                    const storedResult = localStorage.getItem(resultKey);
                    if (storedResult) try {
                        const resultItem = JSON.parse(storedResult);
                        return {
                            ...msg,
                            ...resultItem
                        };
                    } catch (e) {
                        console.warn('Failed to parse stored result:', e);
                    }
                }
                return msg;
            }));
            return restoredMessages;
        } catch (error) {
            console.error('Failed to load messages from localStorage:', error);
            return [];
        }
    }
    async clearMessages() {
        try {
            localStorage.removeItem(this.messagesKey);
            const keys = Object.keys(localStorage);
            keys.forEach((key)=>{
                if (key.startsWith(this.resultsKey)) localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Failed to clear messages from localStorage:', error);
        }
    }
    async saveResult(id, result) {
        try {
            const resultKey = `${this.resultsKey}-${id}`;
            localStorage.setItem(resultKey, JSON.stringify(result));
        } catch (error) {
            if (error instanceof DOMException && 'QuotaExceededError' === error.name) {
                console.warn('LocalStorage quota exceeded when saving result, clearing old results...');
                await this.handleQuotaExceeded();
                try {
                    const resultKey = `${this.resultsKey}-${id}`;
                    localStorage.setItem(resultKey, JSON.stringify(result));
                } catch (retryError) {
                    console.error('Failed to save result even after clearing storage:', retryError);
                }
            } else console.error('Failed to save result to localStorage:', error);
        }
    }
    async handleQuotaExceeded() {
        try {
            const keys = Object.keys(localStorage);
            const resultKeys = keys.filter((key)=>key.startsWith(this.resultsKey));
            const keysToRemove = resultKeys.slice(0, Math.max(1, Math.floor(resultKeys.length / 2)));
            keysToRemove.forEach((key)=>{
                localStorage.removeItem(key);
            });
            console.info(`Cleared ${keysToRemove.length} old result entries to free up storage space`);
            const playgroundKeys = keys.filter((key)=>key.includes('playground') || key.includes('agent') || key.startsWith('midscene'));
            if (playgroundKeys.length > 10) {
                const additionalKeysToRemove = playgroundKeys.slice(0, Math.floor(playgroundKeys.length / 3));
                additionalKeysToRemove.forEach((key)=>{
                    if (key !== this.messagesKey) localStorage.removeItem(key);
                });
                console.info(`Cleared ${additionalKeysToRemove.length} additional playground-related entries`);
            }
        } catch (error) {
            console.error('Failed to handle quota exceeded:', error);
        }
    }
    constructor(namespace = 'playground'){
        _define_property(this, "messagesKey", void 0);
        _define_property(this, "resultsKey", void 0);
        _define_property(this, "maxStorageItems", 50);
        this.messagesKey = `${namespace}-messages`;
        this.resultsKey = `${namespace}-results`;
    }
}
class MemoryStorageProvider {
    async saveMessages(messages) {
        this.messages = [
            ...messages
        ];
    }
    async loadMessages() {
        return [
            ...this.messages
        ];
    }
    async clearMessages() {
        this.messages = [];
        this.results.clear();
    }
    async saveResult(id, result) {
        this.results.set(id, result);
    }
    constructor(){
        _define_property(this, "messages", []);
        _define_property(this, "results", new Map());
    }
}
class NoOpStorageProvider {
    async saveMessages(_messages) {}
    async loadMessages() {
        return [];
    }
    async clearMessages() {}
    async saveResult(_id, _result) {}
}
var storage_provider_StorageType = /*#__PURE__*/ function(StorageType) {
    StorageType["INDEXEDDB"] = "indexeddb";
    StorageType["LOCALSTORAGE"] = "localStorage";
    StorageType["MEMORY"] = "memory";
    StorageType["NONE"] = "none";
    return StorageType;
}({});
function createStorageProvider() {
    let type = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "indexeddb", namespace = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'playground';
    switch(type){
        case "indexeddb":
            if ('undefined' != typeof indexedDB) return new external_indexeddb_storage_provider_js_namespaceObject.IndexedDBStorageProvider(namespace);
            console.warn('IndexedDB not available, falling back to localStorage');
            return createStorageProvider("localStorage", namespace);
        case "localStorage":
            if ('undefined' != typeof localStorage) return new LocalStorageProvider(namespace);
            console.warn('localStorage not available, falling back to memory storage');
            return createStorageProvider("memory", namespace);
        case "memory":
            return new MemoryStorageProvider();
        case "none":
            return new NoOpStorageProvider();
        default:
            throw new Error(`Unknown storage type: ${type}`);
    }
}
function detectBestStorageType() {
    if ('undefined' != typeof indexedDB) try {
        indexedDB.open('test', 1).onerror = ()=>{};
        return "indexeddb";
    } catch (e) {}
    if ('undefined' != typeof localStorage) try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return "localStorage";
    } catch (e) {}
    return "memory";
}
exports.IndexedDBMemoryStorageProvider = __webpack_exports__.IndexedDBMemoryStorageProvider;
exports.IndexedDBNoOpStorageProvider = __webpack_exports__.IndexedDBNoOpStorageProvider;
exports.IndexedDBStorageProvider = __webpack_exports__.IndexedDBStorageProvider;
exports.LocalStorageProvider = __webpack_exports__.LocalStorageProvider;
exports.MemoryStorageProvider = __webpack_exports__.MemoryStorageProvider;
exports.NoOpStorageProvider = __webpack_exports__.NoOpStorageProvider;
exports.StorageType = __webpack_exports__.StorageType;
exports.createStorageProvider = __webpack_exports__.createStorageProvider;
exports.detectBestStorageType = __webpack_exports__.detectBestStorageType;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "IndexedDBMemoryStorageProvider",
    "IndexedDBNoOpStorageProvider",
    "IndexedDBStorageProvider",
    "LocalStorageProvider",
    "MemoryStorageProvider",
    "NoOpStorageProvider",
    "StorageType",
    "createStorageProvider",
    "detectBestStorageType"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
