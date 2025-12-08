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
    AgentContextProvider: ()=>AgentContextProvider,
    BaseContextProvider: ()=>BaseContextProvider,
    NoOpContextProvider: ()=>NoOpContextProvider,
    StaticContextProvider: ()=>StaticContextProvider
});
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
class BaseContextProvider {
    async refreshContext() {
        this.cachedContext = void 0;
        return await this.getUIContext();
    }
    constructor(){
        _define_property(this, "cachedContext", void 0);
    }
}
class AgentContextProvider extends BaseContextProvider {
    async getUIContext() {
        if (this.cachedContext) return this.cachedContext;
        const agent = this.getAgent();
        if (!(null == agent ? void 0 : agent.getUIContext)) throw new Error('Agent does not support getUIContext');
        const context = await agent.getUIContext();
        this.cachedContext = context;
        return context;
    }
    constructor(getAgent, options){
        super(), _define_property(this, "getAgent", void 0), _define_property(this, "options", void 0), this.getAgent = getAgent, this.options = options;
    }
}
class StaticContextProvider extends BaseContextProvider {
    async getUIContext() {
        return this.context;
    }
    async refreshContext() {
        return this.context;
    }
    constructor(context){
        super(), _define_property(this, "context", void 0), this.context = context;
    }
}
class NoOpContextProvider {
    async getUIContext() {
        throw new Error('Context preview is disabled');
    }
    async refreshContext() {
        throw new Error('Context preview is disabled');
    }
}
exports.AgentContextProvider = __webpack_exports__.AgentContextProvider;
exports.BaseContextProvider = __webpack_exports__.BaseContextProvider;
exports.NoOpContextProvider = __webpack_exports__.NoOpContextProvider;
exports.StaticContextProvider = __webpack_exports__.StaticContextProvider;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "AgentContextProvider",
    "BaseContextProvider",
    "NoOpContextProvider",
    "StaticContextProvider"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
