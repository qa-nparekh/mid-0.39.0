"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
    ConfigSelector: ()=>ConfigSelector
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const external_antd_namespaceObject = require("antd");
const setting_js_namespaceObject = require("../../icons/setting.js");
var setting_js_default = /*#__PURE__*/ __webpack_require__.n(setting_js_namespaceObject);
const store_js_namespaceObject = require("../../store/store.js");
const constants_js_namespaceObject = require("../../utils/constants.js");
const ConfigSelector = (param)=>{
    let { showDeepThinkOption = false, enableTracking = false, showDataExtractionOptions = false, hideDomAndScreenshotOptions = false } = param;
    const forceSameTabNavigation = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.forceSameTabNavigation);
    const setForceSameTabNavigation = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.setForceSameTabNavigation);
    const deepThink = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.deepThink);
    const setDeepThink = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.setDeepThink);
    const screenshotIncluded = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.screenshotIncluded);
    const setScreenshotIncluded = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.setScreenshotIncluded);
    const domIncluded = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.domIncluded);
    const setDomIncluded = (0, store_js_namespaceObject.useEnvConfig)((state)=>state.setDomIncluded);
    if (!enableTracking && !showDeepThinkOption && !showDataExtractionOptions) return null;
    const configItems = buildConfigItems();
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: "selector-trigger",
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Dropdown, {
            menu: {
                items: configItems
            },
            trigger: [
                'click'
            ],
            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(setting_js_default(), {
                width: 24,
                height: 24
            })
        })
    });
    function buildConfigItems() {
        const items = [];
        if (enableTracking) items.push({
            label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Checkbox, {
                onChange: (e)=>setForceSameTabNavigation(e.target.checked),
                checked: forceSameTabNavigation,
                children: constants_js_namespaceObject.trackingTip
            }),
            key: 'track-config'
        });
        if (showDeepThinkOption) items.push({
            label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Checkbox, {
                onChange: (e)=>{
                    setDeepThink(e.target.checked);
                },
                checked: deepThink,
                children: constants_js_namespaceObject.deepThinkTip
            }),
            key: 'deep-think-config'
        });
        if (showDataExtractionOptions && !hideDomAndScreenshotOptions) {
            items.push({
                label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Checkbox, {
                    onChange: (e)=>{
                        setScreenshotIncluded(e.target.checked);
                    },
                    checked: screenshotIncluded,
                    children: constants_js_namespaceObject.screenshotIncludedTip
                }),
                key: 'screenshot-included-config'
            });
            items.push({
                label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                    style: {
                        padding: '4px 0'
                    },
                    children: [
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                            style: {
                                marginBottom: '4px',
                                fontSize: '14px'
                            },
                            children: constants_js_namespaceObject.domIncludedTip
                        }),
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(external_antd_namespaceObject.Radio.Group, {
                            size: "small",
                            value: domIncluded,
                            onChange: (e)=>setDomIncluded(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Radio, {
                                    value: false,
                                    children: "Off"
                                }),
                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Radio, {
                                    value: true,
                                    children: "All"
                                }),
                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Radio, {
                                    value: 'visible-only',
                                    children: "Visible only"
                                })
                            ]
                        })
                    ]
                }),
                key: 'dom-included-config'
            });
        }
        return items;
    }
};
exports.ConfigSelector = __webpack_exports__.ConfigSelector;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "ConfigSelector"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
