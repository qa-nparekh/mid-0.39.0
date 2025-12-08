import { IndexedDBManager, createCleanupFunction, withErrorHandling } from "@sqai/shared/baseDB";
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
const DB_NAME = 'midscene_playground';
const DB_VERSION = 1;
const MESSAGES_STORE = 'playground_messages';
const RESULTS_STORE = 'playground_results';
const MAX_STORED_MESSAGES = 100;
const MAX_STORED_RESULTS = 50;
class IndexedDBStorageProvider {
    async saveMessages(messages) {
        await withErrorHandling(async ()=>{
            await this.dbManager.clear(MESSAGES_STORE);
            const messagesToSave = messages.slice(-MAX_STORED_MESSAGES);
            await Promise.all(messagesToSave.map((msg, index)=>{
                const lightMessage = {
                    ...msg,
                    result: void 0
                };
                const data = {
                    id: msg.id || `msg-${index}`,
                    data: lightMessage,
                    timestamp: msg.timestamp ? msg.timestamp.getTime() : Date.now() + index
                };
                return this.dbManager.put(MESSAGES_STORE, data);
            }));
        }, 'Failed to save messages to IndexedDB', void 0, this.messagesCleanup);
    }
    async loadMessages() {
        const result = await withErrorHandling(async ()=>{
            const messages = await this.dbManager.getAll(MESSAGES_STORE, true);
            if (0 === messages.length) return [];
            return Promise.all(messages.map(async (msg)=>{
                const item = msg.data;
                const restoredItem = {
                    ...item,
                    timestamp: new Date(item.timestamp)
                };
                if ('result' === item.type && item.id) {
                    const fullResult = await this.loadResult(item.id);
                    if (fullResult) {
                        restoredItem.result = fullResult.result;
                        restoredItem.replayScriptsInfo = fullResult.replayScriptsInfo;
                        restoredItem.replayCounter = fullResult.replayCounter;
                        restoredItem.verticalMode = fullResult.verticalMode;
                    }
                }
                return restoredItem;
            }));
        }, 'Failed to load messages from IndexedDB', [], this.messagesCleanup);
        return result || [];
    }
    async clearMessages() {
        await withErrorHandling(async ()=>{
            await Promise.all([
                this.dbManager.clear(MESSAGES_STORE),
                this.dbManager.clear(RESULTS_STORE)
            ]);
        }, 'Failed to clear messages from IndexedDB');
    }
    async saveResult(id, result) {
        await withErrorHandling(async ()=>{
            const compressedResult = this.compressResultForStorage(result);
            const data = {
                id,
                data: compressedResult,
                timestamp: Date.now(),
                size: JSON.stringify(compressedResult).length
            };
            await this.dbManager.put(RESULTS_STORE, data);
        }, 'Failed to save result to IndexedDB', void 0, this.resultsCleanup);
    }
    async loadResult(id) {
        const result = await withErrorHandling(async ()=>{
            const data = await this.dbManager.get(RESULTS_STORE, id);
            return (null == data ? void 0 : data.data) || null;
        }, 'Failed to load result from IndexedDB', null);
        return result || null;
    }
    compressResultForStorage(result) {
        var _result_result_dump, _result_result;
        if (!(null == (_result_result = result.result) ? void 0 : null == (_result_result_dump = _result_result.dump) ? void 0 : _result_result_dump.executions)) return result;
        const compressedExecutions = result.result.dump.executions.map((execution)=>{
            var _execution_tasks;
            return {
                ...execution,
                tasks: (null == (_execution_tasks = execution.tasks) ? void 0 : _execution_tasks.map((task)=>{
                    var _task_recorder;
                    var _this_compressScreenshotIfNeeded;
                    return {
                        ...task,
                        uiContext: task.uiContext ? {
                            ...task.uiContext,
                            screenshotBase64: null != (_this_compressScreenshotIfNeeded = this.compressScreenshotIfNeeded(task.uiContext.screenshotBase64)) ? _this_compressScreenshotIfNeeded : task.uiContext.screenshotBase64
                        } : task.uiContext,
                        recorder: null == (_task_recorder = task.recorder) ? void 0 : _task_recorder.map((record)=>({
                                ...record,
                                screenshot: this.compressScreenshotIfNeeded(record.screenshot)
                            }))
                    };
                })) || []
            };
        });
        return {
            ...result,
            result: {
                ...result.result,
                dump: {
                    ...result.result.dump,
                    executions: compressedExecutions
                }
            }
        };
    }
    compressScreenshotIfNeeded(screenshot) {
        if (!screenshot) return screenshot;
        if (screenshot.length > 1048576) {
            const sizeKB = Math.round(screenshot.length / 1024);
            return `[COMPRESSED: ${sizeKB}KB screenshot removed for storage]`;
        }
        return screenshot;
    }
    async getStorageStats() {
        const result = await withErrorHandling(async ()=>{
            const [messageCount, resultCount] = await Promise.all([
                this.dbManager.count(MESSAGES_STORE),
                this.dbManager.count(RESULTS_STORE)
            ]);
            return {
                messageCount,
                resultCount
            };
        }, 'Failed to get storage statistics', {
            messageCount: 0,
            resultCount: 0
        });
        return result || {
            messageCount: 0,
            resultCount: 0
        };
    }
    async cleanup() {
        await Promise.all([
            this.messagesCleanup(),
            this.resultsCleanup()
        ]);
    }
    constructor(namespace = 'playground'){
        _define_property(this, "dbManager", void 0);
        _define_property(this, "namespace", void 0);
        _define_property(this, "messagesCleanup", void 0);
        _define_property(this, "resultsCleanup", void 0);
        this.namespace = namespace;
        this.dbManager = new IndexedDBManager(`${DB_NAME}_${namespace}`, DB_VERSION, [
            {
                name: MESSAGES_STORE,
                keyPath: 'id'
            },
            {
                name: RESULTS_STORE,
                keyPath: 'id'
            }
        ]);
        this.messagesCleanup = createCleanupFunction(this.dbManager, MESSAGES_STORE, MAX_STORED_MESSAGES);
        this.resultsCleanup = createCleanupFunction(this.dbManager, RESULTS_STORE, MAX_STORED_RESULTS);
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
export { IndexedDBStorageProvider, MemoryStorageProvider, NoOpStorageProvider };
