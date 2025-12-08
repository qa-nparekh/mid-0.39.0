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
    getXpathsByPoint: ()=>getXpathsByPoint,
    getNodeInfoByXpath: ()=>getNodeInfoByXpath,
    getElementInfoByXpath: ()=>getElementInfoByXpath,
    getXpathsById: ()=>getXpathsById,
    getElementXpath: ()=>getElementXpath
});
const external_dom_util_js_namespaceObject = require("./dom-util.js");
const external_util_js_namespaceObject = require("./util.js");
const external_web_extractor_js_namespaceObject = require("./web-extractor.js");
const getElementXpathIndex = (element)=>{
    let index = 1;
    let prev = element.previousElementSibling;
    while(prev){
        if (prev.nodeName.toLowerCase() === element.nodeName.toLowerCase()) index++;
        prev = prev.previousElementSibling;
    }
    return index;
};
const normalizeXpathText = (text)=>{
    if ('string' != typeof text) return '';
    return text.replace(/\s+/g, ' ').trim();
};
const buildCurrentElementXpath = (element, isOrderSensitive, isLeafElement)=>{
    var _element_textContent;
    const parentPath = element.parentNode ? getElementXpath(element.parentNode, isOrderSensitive) : '';
    const prefix = parentPath ? `${parentPath}/` : '/';
    const tagName = element.nodeName.toLowerCase();
    const textContent = null == (_element_textContent = element.textContent) ? void 0 : _element_textContent.trim();
    if (isOrderSensitive) {
        const index = getElementXpathIndex(element);
        return `${prefix}${tagName}[${index}]`;
    }
    if (isLeafElement && textContent) return `${prefix}${tagName}[normalize-space()="${normalizeXpathText(textContent)}"]`;
    const index = getElementXpathIndex(element);
    return `${prefix}${tagName}[${index}]`;
};
const getElementXpath = (element, isOrderSensitive = false, isLeafElement = false)=>{
    if (element.nodeType === Node.TEXT_NODE) {
        const parentNode = element.parentNode;
        if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
            var _element_textContent;
            const parentXPath = getElementXpath(parentNode, isOrderSensitive, true);
            const textContent = null == (_element_textContent = element.textContent) ? void 0 : _element_textContent.trim();
            if (textContent) return `${parentXPath}/text()[normalize-space()="${normalizeXpathText(textContent)}"]`;
            return `${parentXPath}/text()`;
        }
        return '';
    }
    if (element.nodeType !== Node.ELEMENT_NODE) return '';
    const el = element;
    if (el === document.documentElement) return '/html';
    if (el === document.body) return '/html/body';
    if ((0, external_dom_util_js_namespaceObject.isSvgElement)(el)) {
        let parent = el.parentNode;
        while(parent && parent.nodeType === Node.ELEMENT_NODE){
            if (!(0, external_dom_util_js_namespaceObject.isSvgElement)(parent)) return getElementXpath(parent, isOrderSensitive, isLeafElement);
            parent = parent.parentNode;
        }
        return getElementXpath(el.parentNode, isOrderSensitive, isLeafElement);
    }
    return buildCurrentElementXpath(el, isOrderSensitive, isLeafElement);
};
function getXpathsById(id) {
    const node = (0, external_util_js_namespaceObject.getNodeFromCacheList)(id);
    if (!node) return null;
    const fullXPath = getElementXpath(node, false, true);
    return [
        fullXPath
    ];
}
function getXpathsByPoint(point, isOrderSensitive) {
    const element = document.elementFromPoint(point.left, point.top);
    if (!element) return null;
    const fullXPath = getElementXpath(element, isOrderSensitive, true);
    return [
        fullXPath
    ];
}
function getNodeInfoByXpath(xpath) {
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (1 !== xpathResult.snapshotLength) return null;
    const node = xpathResult.snapshotItem(0);
    return node;
}
function getElementInfoByXpath(xpath) {
    const node = getNodeInfoByXpath(xpath);
    if (!node) return null;
    if (node instanceof HTMLElement) {
        const rect = (0, external_util_js_namespaceObject.getRect)(node, 1, window);
        const isVisible = (0, external_util_js_namespaceObject.isElementPartiallyInViewport)(rect, window, document, 1);
        if (!isVisible) node.scrollIntoView({
            behavior: 'instant',
            block: 'center'
        });
    }
    return (0, external_web_extractor_js_namespaceObject.collectElementInfo)(node, window, document, 1, {
        left: 0,
        top: 0
    }, true);
}
exports.getElementInfoByXpath = __webpack_exports__.getElementInfoByXpath;
exports.getElementXpath = __webpack_exports__.getElementXpath;
exports.getNodeInfoByXpath = __webpack_exports__.getNodeInfoByXpath;
exports.getXpathsById = __webpack_exports__.getXpathsById;
exports.getXpathsByPoint = __webpack_exports__.getXpathsByPoint;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "getElementInfoByXpath",
    "getElementXpath",
    "getNodeInfoByXpath",
    "getXpathsById",
    "getXpathsByPoint"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
