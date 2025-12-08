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
    EnvConfig: ()=>EnvConfig
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const icons_namespaceObject = require("@ant-design/icons");
const external_antd_namespaceObject = require("antd");
const external_react_namespaceObject = require("react");
const store_js_namespaceObject = require("../../store/store.js");
function EnvConfig(param) {
    let { showTooltipWhenEmpty = true, showModelName = true, tooltipPlacement = 'bottom', mode = 'icon' } = param;
    const { config, configString, loadConfig, syncFromStorage } = (0, store_js_namespaceObject.useEnvConfig)();
    const [isModalOpen, setIsModalOpen] = (0, external_react_namespaceObject.useState)(false);
    const [tempConfigString, setTempConfigString] = (0, external_react_namespaceObject.useState)(configString);
    const midsceneModelName = config.MIDSCENE_MODEL_NAME;
    const componentRef = (0, external_react_namespaceObject.useRef)(null);
    const showModal = (e)=>{
        syncFromStorage();
        setIsModalOpen(true);
        e.preventDefault();
        e.stopPropagation();
    };
    const handleOk = ()=>{
        setIsModalOpen(false);
        loadConfig(tempConfigString);
    };
    const handleCancel = ()=>{
        setIsModalOpen(false);
    };
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (isModalOpen) setTempConfigString(configString);
    }, [
        isModalOpen,
        configString
    ]);
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            alignItems: 'center',
            height: '100%',
            minHeight: '32px'
        },
        ref: componentRef,
        children: [
            showModelName ? midsceneModelName : null,
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Tooltip, {
                title: "Please set up your environment variables before using.",
                placement: tooltipPlacement,
                align: {
                    offset: [
                        -10,
                        5
                    ]
                },
                getPopupContainer: ()=>componentRef.current,
                open: isModalOpen ? false : showTooltipWhenEmpty ? 0 === Object.keys(config).length : void 0,
                children: 'icon' === mode ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.SettingOutlined, {
                    onClick: showModal
                }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                    onClick: showModal,
                    style: {
                        color: '#006AFF',
                        cursor: 'pointer'
                    },
                    children: "set up"
                })
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(external_antd_namespaceObject.Modal, {
                title: "Model Env Config",
                open: isModalOpen,
                onOk: handleOk,
                onCancel: handleCancel,
                okText: "Save",
                style: {
                    width: '800px',
                    height: '100%',
                    marginTop: '10%'
                },
                destroyOnClose: true,
                maskClosable: true,
                centered: true,
                children: [
                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Input.TextArea, {
                        rows: 7,
                        placeholder: 'OPENAI_API_KEY=sk-...\nMIDSCENE_MODEL_NAME=gpt-4o-2024-08-06\n...',
                        value: tempConfigString,
                        onChange: (e)=>setTempConfigString(e.target.value),
                        style: {
                            whiteSpace: 'nowrap',
                            wordWrap: 'break-word'
                        }
                    }),
                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("p", {
                                children: "The format is KEY=VALUE and separated by new lines."
                            }),
                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("p", {
                                children: [
                                    "These data will be saved ",
                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("strong", {
                                        children: "locally in your browser"
                                    }),
                                    "."
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
exports.EnvConfig = __webpack_exports__.EnvConfig;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "EnvConfig"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
