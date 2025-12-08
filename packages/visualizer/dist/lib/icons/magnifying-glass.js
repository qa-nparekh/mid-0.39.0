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
    default: ()=>magnifying_glass
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgMagnifyingGlass = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 19,
        height: 19,
        fill: "none",
        viewBox: "0 0 19 19",
        ...props,
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("g", {
                stroke: "#000",
                strokeLinejoin: "round",
                strokeOpacity: 0.65,
                strokeWidth: 1.5,
                clipPath: "url(#magnifying-glass_svg__a)",
                children: [
                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                        d: "M8.397 14.29a6.375 6.375 0 1 0 0-12.75 6.375 6.375 0 0 0 0 12.75Z"
                    }),
                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                        strokeLinecap: "round",
                        d: "M10.519 5.42a3 3 0 0 0-2.122-.88 3 3 0 0 0-2.121.88M12.98 12.499l3.182 3.182"
                    })
                ]
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("defs", {
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("clipPath", {
                    id: "magnifying-glass_svg__a",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                        fill: "#fff",
                        d: "M.522.04h18v18h-18z"
                    })
                })
            })
        ]
    });
const magnifying_glass = SvgMagnifyingGlass;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
