import { imageInfoOfBase64 } from "../../image/index.mjs";
import { NodeType } from "@sqaitech/shared/constants";
import { descriptionOfTree, generateElementByPosition, treeToList } from "@sqaitech/shared/extractor";
import { assert } from "@sqaitech/shared/utils";
function describeSize(size) {
    return `${size.width} x ${size.height}`;
}
function describeElement(elements) {
    const sliceLength = 80;
    return elements.map((item)=>[
            item.id,
            item.rect.left,
            item.rect.top,
            item.rect.left + item.rect.width,
            item.rect.top + item.rect.height,
            item.content.length > sliceLength ? `${item.content.slice(0, sliceLength)}...` : item.content
        ].join(', ')).join('\n');
}
const distanceThreshold = 16;
function elementByPositionWithElementInfo(treeRoot, position, options) {
    const requireStrictDistance = (null == options ? void 0 : options.requireStrictDistance) ?? true;
    const filterPositionElements = (null == options ? void 0 : options.filterPositionElements) ?? false;
    assert(void 0 !== position, 'position is required for query');
    const matchingElements = [];
    function dfs(node) {
        if (null == node ? void 0 : node.node) {
            const item = node.node;
            if (item.rect.left <= position.x && position.x <= item.rect.left + item.rect.width && item.rect.top <= position.y && position.y <= item.rect.top + item.rect.height) {
                var _item_attributes;
                if (!(filterPositionElements && (null == (_item_attributes = item.attributes) ? void 0 : _item_attributes.nodeType) === NodeType.POSITION) && item.isVisible) matchingElements.push(item);
            }
        }
        for (const child of node.children)dfs(child);
    }
    dfs(treeRoot);
    if (0 === matchingElements.length) return;
    const element = matchingElements.reduce((smallest, current)=>{
        const smallestArea = smallest.rect.width * smallest.rect.height;
        const currentArea = current.rect.width * current.rect.height;
        return currentArea < smallestArea ? current : smallest;
    });
    const distanceToCenter = distance({
        x: element.center[0],
        y: element.center[1]
    }, position);
    if (requireStrictDistance) return distanceToCenter <= distanceThreshold ? element : void 0;
    return element;
}
function distance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}
const samplePageDescription = `
And the page is described as follows:
====================
The size of the page: 1280 x 720
Some of the elements are marked with a rectangle in the screenshot corresponding to the markerId, some are not.

Description of all the elements in screenshot:
<div id="969f1637" markerId="1" left="100" top="100" width="100" height="100"> // The markerId indicated by the rectangle label in the screenshot
  <h4 id="b211ecb2" markerId="5" left="150" top="150" width="90" height="60">
    The username is accepted
  </h4>
  ...many more
</div>
====================
`;
async function describeUserPage(context, opt) {
    const { screenshotBase64 } = context;
    let width;
    let height;
    if (context.size) ({ width, height } = context.size);
    else {
        const imgSize = await imageInfoOfBase64(screenshotBase64);
        ({ width, height } = imgSize);
    }
    const treeRoot = context.tree;
    const idElementMap = {};
    const flatElements = treeToList(treeRoot);
    if ((null == opt ? void 0 : opt.domIncluded) === true && flatElements.length >= 5000) console.warn('The number of elements is too large, it may cause the prompt to be too long, please use domIncluded: "visible-only" to reduce the number of elements');
    flatElements.forEach((element)=>{
        idElementMap[element.id] = element;
        if (void 0 !== element.indexId) idElementMap[`${element.indexId}`] = element;
    });
    let pageDescription = '';
    const visibleOnly = (null == opt ? void 0 : opt.domIncluded) === 'visible-only' ? true : (null == opt ? void 0 : opt.visibleOnly) ?? false;
    const resolvedVlMode = null == opt ? void 0 : opt.vlMode;
    const shouldIncludeDOM = (null == opt ? void 0 : opt.domIncluded) || !resolvedVlMode;
    if (shouldIncludeDOM) {
        const contentTree = await descriptionOfTree(treeRoot, null == opt ? void 0 : opt.truncateTextLength, null == opt ? void 0 : opt.filterNonTextContent, visibleOnly);
        const sizeDescription = describeSize({
            width,
            height
        });
        pageDescription = `The size of the page: ${sizeDescription} \n The page elements tree:\n${contentTree}`;
    }
    return {
        description: pageDescription,
        elementById (idOrIndexId) {
            assert(void 0 !== idOrIndexId, 'id is required for query');
            const item = idElementMap[`${idOrIndexId}`];
            return item;
        },
        elementByPosition (position, size) {
            return elementByPositionWithElementInfo(treeRoot, position);
        },
        insertElementByPosition (position) {
            const element = generateElementByPosition(position);
            treeRoot.children.push({
                node: element,
                children: []
            });
            flatElements.push(element);
            idElementMap[element.id] = element;
            return element;
        },
        size: {
            width,
            height
        }
    };
}
export { describeElement, describeSize, describeUserPage, distance, distanceThreshold, elementByPositionWithElementInfo, samplePageDescription };

//# sourceMappingURL=util.mjs.map