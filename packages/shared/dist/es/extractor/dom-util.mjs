import { NodeType } from "../constants/index.mjs";
import { generateHashId } from "../utils.mjs";
function isFormElement(node) {
    return node instanceof HTMLElement && ('input' === node.tagName.toLowerCase() || 'textarea' === node.tagName.toLowerCase() || 'select' === node.tagName.toLowerCase() || 'option' === node.tagName.toLowerCase());
}
function isButtonElement(node) {
    return node instanceof HTMLElement && 'button' === node.tagName.toLowerCase();
}
function isAElement(node) {
    return node instanceof HTMLElement && 'a' === node.tagName.toLowerCase();
}
function isSvgElement(node) {
    return node instanceof SVGElement;
}
function isImgElement(node) {
    if (!includeBaseElement(node) && node instanceof Element) {
        const computedStyle = window.getComputedStyle(node);
        const backgroundImage = computedStyle.getPropertyValue('background-image');
        if ('none' !== backgroundImage) return true;
    }
    if (isIconfont(node)) return true;
    return node instanceof HTMLElement && 'img' === node.tagName.toLowerCase() || node instanceof SVGElement && 'svg' === node.tagName.toLowerCase();
}
function isIconfont(node) {
    if (node instanceof Element) {
        const computedStyle = window.getComputedStyle(node);
        const fontFamilyValue = computedStyle.fontFamily || '';
        return fontFamilyValue.toLowerCase().indexOf('iconfont') >= 0;
    }
    return false;
}
function isNotContainerElement(node) {
    return isTextElement(node) || isIconfont(node) || isImgElement(node) || isButtonElement(node) || isAElement(node) || isFormElement(node);
}
function isTextElement(node) {
    var _node_nodeName_toLowerCase, _node_nodeName;
    if (node instanceof Element) {
        var _node_childNodes;
        if ((null == node ? void 0 : null == (_node_childNodes = node.childNodes) ? void 0 : _node_childNodes.length) === 1 && (null == node ? void 0 : node.childNodes[0]) instanceof Text) return true;
    }
    return (null == (_node_nodeName = node.nodeName) ? void 0 : null == (_node_nodeName_toLowerCase = _node_nodeName.toLowerCase) ? void 0 : _node_nodeName_toLowerCase.call(_node_nodeName)) === '#text' && !isIconfont(node);
}
function isContainerElement(node) {
    if (!(node instanceof HTMLElement)) return false;
    if (includeBaseElement(node)) return false;
    const computedStyle = window.getComputedStyle(node);
    const backgroundColor = computedStyle.getPropertyValue('background-color');
    if (backgroundColor) return true;
    return false;
}
function includeBaseElement(node) {
    if (!(node instanceof HTMLElement)) return false;
    if (node.innerText) return true;
    const includeList = [
        'svg',
        'button',
        'input',
        'textarea',
        'select',
        'option',
        'img',
        'a'
    ];
    for (const tagName of includeList){
        const element = node.querySelectorAll(tagName);
        if (element.length > 0) return true;
    }
    return false;
}
function generateElementByPosition(position) {
    const rect = {
        left: Math.max(position.x - 4, 0),
        top: Math.max(position.y - 4, 0),
        width: 8,
        height: 8
    };
    const id = generateHashId(rect);
    const element = {
        id,
        attributes: {
            nodeType: NodeType.POSITION
        },
        rect,
        content: '',
        center: [
            position.x,
            position.y
        ]
    };
    return element;
}
export { generateElementByPosition, isAElement, isButtonElement, isContainerElement, isFormElement, isImgElement, isNotContainerElement, isSvgElement, isTextElement };
