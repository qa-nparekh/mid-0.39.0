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
    WebElementInfoImpl: ()=>WebElementInfoImpl,
    WebPageContextParser: ()=>WebPageContextParser,
    limitOpenNewTabScript: ()=>limitOpenNewTabScript
});
const extractor_namespaceObject = require("@sqaitech/shared/extractor");
const logger_namespaceObject = require("@sqaitech/shared/logger");
const agent_namespaceObject = require("@sqaitech/core/agent");
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
class WebElementInfoImpl {
    constructor({ content, rect, id, attributes, indexId, xpaths, isVisible }){
        _define_property(this, "content", void 0);
        _define_property(this, "rect", void 0);
        _define_property(this, "center", void 0);
        _define_property(this, "id", void 0);
        _define_property(this, "indexId", void 0);
        _define_property(this, "attributes", void 0);
        _define_property(this, "xpaths", void 0);
        _define_property(this, "isVisible", void 0);
        this.content = content;
        this.rect = rect;
        this.center = [
            Math.floor(rect.left + rect.width / 2),
            Math.floor(rect.top + rect.height / 2)
        ];
        this.id = id;
        this.attributes = attributes;
        this.indexId = indexId;
        this.xpaths = xpaths;
        this.isVisible = isVisible;
    }
}
const debug = (0, logger_namespaceObject.getDebug)('web:parse-context');
async function WebPageContextParser(page, _opt) {
    var _page_getElementsNodeTree;
    const basicContext = await (0, agent_namespaceObject.commonContextParser)(page, {
        uploadServerUrl: _opt.uploadServerUrl
    });
    debug('will traverse element tree');
    const tree = await (null == (_page_getElementsNodeTree = page.getElementsNodeTree) ? void 0 : _page_getElementsNodeTree.call(page)) || {
        node: null,
        children: []
    };
    const webTree = (0, extractor_namespaceObject.traverseTree)(tree, (elementInfo)=>{
        const { rect, id, content, attributes, indexId, isVisible } = elementInfo;
        return new WebElementInfoImpl({
            rect,
            id,
            content,
            attributes,
            indexId,
            isVisible
        });
    });
    debug('traverse element tree end');
    return {
        ...basicContext,
        tree: webTree
    };
}
const limitOpenNewTabScript = `
if (!window.__MIDSCENE_NEW_TAB_INTERCEPTOR_INITIALIZED__) {
  window.__MIDSCENE_NEW_TAB_INTERCEPTOR_INITIALIZED__ = true;

  // Intercept the window.open method (only once)
  window.open = function(url) {
    console.log('Blocked window.open:', url);
    window.location.href = url;
    return null;
  };

  // Block all a tag clicks with target="_blank" (only once)
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && target.target === '_blank') {
      e.preventDefault();
      console.log('Blocked new tab:', target.href);
      window.location.href = target.href;
      target.removeAttribute('target');
    }
  }, true);
}
`;
exports.WebElementInfoImpl = __webpack_exports__.WebElementInfoImpl;
exports.WebPageContextParser = __webpack_exports__.WebPageContextParser;
exports.limitOpenNewTabScript = __webpack_exports__.limitOpenNewTabScript;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "WebElementInfoImpl",
    "WebPageContextParser",
    "limitOpenNewTabScript"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=web-element.js.map