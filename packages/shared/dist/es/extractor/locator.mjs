import { isSvgElement } from "./dom-util.mjs";
import { getNodeFromCacheList, getRect, isElementPartiallyInViewport } from "./util.mjs";
import { collectElementInfo } from "./web-extractor.mjs";
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
    if (isSvgElement(el)) {
        let parent = el.parentNode;
        while(parent && parent.nodeType === Node.ELEMENT_NODE){
            if (!isSvgElement(parent)) return getElementXpath(parent, isOrderSensitive, isLeafElement);
            parent = parent.parentNode;
        }
        return getElementXpath(el.parentNode, isOrderSensitive, isLeafElement);
    }
    return buildCurrentElementXpath(el, isOrderSensitive, isLeafElement);
};
function getXpathsById(id) {
    const node = getNodeFromCacheList(id);
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
        const rect = getRect(node, 1, window);
        const isVisible = isElementPartiallyInViewport(rect, window, document, 1);
        if (!isVisible) node.scrollIntoView({
            behavior: 'instant',
            block: 'center'
        });
    }
    return collectElementInfo(node, window, document, 1, {
        left: 0,
        top: 0
    }, true);
}
export { getElementInfoByXpath, getElementXpath, getNodeInfoByXpath, getXpathsById, getXpathsByPoint };
