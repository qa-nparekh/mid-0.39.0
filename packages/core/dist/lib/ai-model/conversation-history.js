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
    ConversationHistory: ()=>ConversationHistory
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
var _computedKey;
_computedKey = Symbol.iterator;
let _computedKey1 = _computedKey;
class ConversationHistory {
    append(message) {
        if ('user' === message.role) this.pruneOldestUserMessageIfNecessary();
        this.messages.push(message);
    }
    seed(messages) {
        this.reset();
        messages.forEach((message)=>{
            this.append(message);
        });
    }
    reset() {
        this.messages.length = 0;
    }
    snapshot() {
        return [
            ...this.messages
        ];
    }
    get length() {
        return this.messages.length;
    }
    [_computedKey1]() {
        return this.messages[Symbol.iterator]();
    }
    toJSON() {
        return this.snapshot();
    }
    pruneOldestUserMessageIfNecessary() {
        const userMessages = this.messages.filter((item)=>'user' === item.role);
        if (userMessages.length < this.maxUserImageMessages) return;
        const firstUserMessageIndex = this.messages.findIndex((item)=>'user' === item.role);
        if (firstUserMessageIndex >= 0) this.messages.splice(firstUserMessageIndex, 1);
    }
    constructor(options){
        var _options_initialMessages;
        _define_property(this, "maxUserImageMessages", void 0);
        _define_property(this, "messages", []);
        this.maxUserImageMessages = (null == options ? void 0 : options.maxUserImageMessages) ?? 4;
        if (null == options ? void 0 : null == (_options_initialMessages = options.initialMessages) ? void 0 : _options_initialMessages.length) this.seed(options.initialMessages);
    }
}
exports.ConversationHistory = __webpack_exports__.ConversationHistory;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "ConversationHistory"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=conversation-history.js.map