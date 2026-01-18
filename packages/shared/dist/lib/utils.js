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
    generateHashId: ()=>generateHashId,
    logMsg: ()=>logMsg,
    uuid: ()=>uuid,
    ifInWorker: ()=>ifInWorker,
    ifInNode: ()=>ifInNode,
    escapeScriptTag: ()=>escapeScriptTag,
    antiEscapeScriptTag: ()=>antiEscapeScriptTag,
    repeat: ()=>repeat,
    setIsMcp: ()=>setIsMcp,
    ifInBrowser: ()=>ifInBrowser,
    replaceIllegalPathCharsAndSpace: ()=>replaceIllegalPathCharsAndSpace,
    assert: ()=>assert,
    getGlobalScope: ()=>getGlobalScope
});
const external_js_sha256_namespaceObject = require("js-sha256");
const external_uuid_namespaceObject = require("uuid");
var _process_versions;
const ifInBrowser = 'undefined' != typeof window;
const ifInWorker = 'undefined' != typeof WorkerGlobalScope;
const ifInNode = 'undefined' != typeof process && (null == (_process_versions = process.versions) ? void 0 : _process_versions.node);
function uuid() {
    return (0, external_uuid_namespaceObject.v4)();
}
const hashMap = {};
function generateHashId(rect, content = '') {
    const combined = JSON.stringify({
        content,
        rect
    });
    let sliceLength = 5;
    let slicedHash = '';
    const hashHex = external_js_sha256_namespaceObject.sha256.create().update(combined).hex();
    const toLetters = (hex)=>hex.split('').map((char)=>{
            const code = Number.parseInt(char, 16);
            return String.fromCharCode(97 + code % 26);
        }).join('');
    const hashLetters = toLetters(hashHex);
    while(sliceLength < hashLetters.length - 1){
        slicedHash = hashLetters.slice(0, sliceLength);
        if (hashMap[slicedHash] && hashMap[slicedHash] !== combined) {
            sliceLength++;
            continue;
        }
        hashMap[slicedHash] = combined;
        break;
    }
    return slicedHash;
}
function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}
function getGlobalScope() {
    if ('undefined' != typeof window) return window;
    if ('undefined' != typeof globalThis) return globalThis;
    if ('undefined' != typeof self) return self;
}
let isMcp = false;
function setIsMcp(value) {
    isMcp = value;
}
function logMsg(...message) {
    if (!isMcp) console.log(...message);
}
async function repeat(times, fn) {
    for(let i = 0; i < times; i++)await fn(i);
}
const utils_REGEXP_LT = /</g;
const utils_REGEXP_GT = />/g;
const REGEXP_LT_ESCAPE = '__sqai_lt__';
const REGEXP_GT_ESCAPE = '__sqai_gt__';
const escapeScriptTag = (html)=>html.replace(utils_REGEXP_LT, REGEXP_LT_ESCAPE).replace(utils_REGEXP_GT, REGEXP_GT_ESCAPE);
const antiEscapeScriptTag = (html)=>{
    const REGEXP_LT = new RegExp(REGEXP_LT_ESCAPE, 'g');
    const REGEXP_GT = new RegExp(REGEXP_GT_ESCAPE, 'g');
    return html.replace(REGEXP_LT, '<').replace(REGEXP_GT, '>');
};
function replaceIllegalPathCharsAndSpace(str) {
    return str.replace(/[:*?"<>| ]/g, '-');
}
exports.antiEscapeScriptTag = __webpack_exports__.antiEscapeScriptTag;
exports.assert = __webpack_exports__.assert;
exports.escapeScriptTag = __webpack_exports__.escapeScriptTag;
exports.generateHashId = __webpack_exports__.generateHashId;
exports.getGlobalScope = __webpack_exports__.getGlobalScope;
exports.ifInBrowser = __webpack_exports__.ifInBrowser;
exports.ifInNode = __webpack_exports__.ifInNode;
exports.ifInWorker = __webpack_exports__.ifInWorker;
exports.logMsg = __webpack_exports__.logMsg;
exports.repeat = __webpack_exports__.repeat;
exports.replaceIllegalPathCharsAndSpace = __webpack_exports__.replaceIllegalPathCharsAndSpace;
exports.setIsMcp = __webpack_exports__.setIsMcp;
exports.uuid = __webpack_exports__.uuid;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "antiEscapeScriptTag",
    "assert",
    "escapeScriptTag",
    "generateHashId",
    "getGlobalScope",
    "ifInBrowser",
    "ifInNode",
    "ifInWorker",
    "logMsg",
    "repeat",
    "replaceIllegalPathCharsAndSpace",
    "setIsMcp",
    "uuid"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
