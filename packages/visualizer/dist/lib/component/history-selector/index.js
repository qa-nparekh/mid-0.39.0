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
    HistorySelector: ()=>HistorySelector
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const external_antd_namespaceObject = require("antd");
const external_react_namespaceObject = require("react");
const close_js_namespaceObject = require("../../icons/close.js");
var close_js_default = /*#__PURE__*/ __webpack_require__.n(close_js_namespaceObject);
const history_js_namespaceObject = require("../../icons/history.js");
var history_js_default = /*#__PURE__*/ __webpack_require__.n(history_js_namespaceObject);
const magnifying_glass_js_namespaceObject = require("../../icons/magnifying-glass.js");
var magnifying_glass_js_default = /*#__PURE__*/ __webpack_require__.n(magnifying_glass_js_namespaceObject);
const external_store_history_js_namespaceObject = require("../../store/history.js");
require("./index.css");
const { Text } = external_antd_namespaceObject.Typography;
const HistorySelector = (param)=>{
    let { onSelect, history, currentType } = param;
    const [isModalOpen, setIsModalOpen] = (0, external_react_namespaceObject.useState)(false);
    const [searchText, setSearchText] = (0, external_react_namespaceObject.useState)('');
    const clearHistory = (0, external_store_history_js_namespaceObject.useHistoryStore)((state)=>state.clearHistory);
    const modalRef = (0, external_react_namespaceObject.useRef)(null);
    const groupedHistory = (0, external_react_namespaceObject.useMemo)(()=>{
        const now = Date.now();
        const sevenDaysAgo = now - 604800000;
        const oneYearAgo = now - 31536000000;
        const filteredHistory = history.filter((item)=>item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        const groups = {
            recent7Days: filteredHistory.filter((item)=>item.timestamp >= sevenDaysAgo),
            recent1Year: filteredHistory.filter((item)=>item.timestamp < sevenDaysAgo && item.timestamp >= oneYearAgo),
            older: filteredHistory.filter((item)=>item.timestamp < oneYearAgo)
        };
        return groups;
    }, [
        history,
        searchText
    ]);
    const handleHistoryClick = (item)=>{
        onSelect(item);
        setIsModalOpen(false);
    };
    const handleClearHistory = ()=>{
        clearHistory(currentType);
        setSearchText('');
        setIsModalOpen(false);
    };
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (!isModalOpen) return;
        const handleClickOutside = (event)=>{
            if (modalRef.current && !modalRef.current.contains(event.target)) setIsModalOpen(false);
        };
        const timer = setTimeout(()=>{
            document.addEventListener('click', handleClickOutside);
        }, 100);
        return ()=>{
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [
        isModalOpen
    ]);
    const renderHistoryGroup = (title, items)=>{
        if (0 === items.length) return null;
        return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
            className: "history-group",
            children: [
                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "history-group-title",
                    children: title
                }),
                items.map((item, index)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                        className: "history-item",
                        onClick: ()=>handleHistoryClick(item),
                        children: item.prompt
                    }, `${item.timestamp}-${index}`))
            ]
        }, title);
    };
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
        className: "history-selector-wrapper",
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "selector-trigger",
                onClick: ()=>setIsModalOpen(true),
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(history_js_default(), {
                    width: 24,
                    height: 24
                })
            }),
            isModalOpen && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "history-modal-overlay",
                ref: modalRef,
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                    className: "history-modal-container",
                    children: [
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                            className: "history-modal-header",
                            children: [
                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(Text, {
                                    strong: true,
                                    style: {
                                        fontSize: '16px'
                                    },
                                    children: [
                                        "History (",
                                        history.length,
                                        ")"
                                    ]
                                }),
                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Button, {
                                    size: "small",
                                    type: "text",
                                    icon: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(close_js_default(), {
                                        width: 16,
                                        height: 16
                                    }),
                                    onClick: ()=>setIsModalOpen(false),
                                    className: "close-button"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                            className: "history-search-section",
                            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                className: "search-input-wrapper",
                                children: [
                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Input, {
                                        placeholder: "Search",
                                        value: searchText,
                                        onChange: (e)=>setSearchText(e.target.value),
                                        prefix: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(magnifying_glass_js_default(), {
                                            width: 18,
                                            height: 18
                                        }),
                                        className: "search-input",
                                        allowClear: true
                                    }),
                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Button, {
                                        type: "link",
                                        onClick: handleClearHistory,
                                        className: "clear-button",
                                        disabled: 0 === history.length,
                                        children: "Clear"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                            className: "history-content",
                            children: 0 === history.length ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                className: "no-results",
                                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(Text, {
                                    type: "secondary",
                                    children: "No history record"
                                })
                            }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(jsx_runtime_namespaceObject.Fragment, {
                                children: [
                                    renderHistoryGroup('Last 7 days', groupedHistory.recent7Days),
                                    renderHistoryGroup('Last 1 year', groupedHistory.recent1Year),
                                    renderHistoryGroup('Earlier', groupedHistory.older),
                                    searchText && 0 === groupedHistory.recent7Days.length && 0 === groupedHistory.recent1Year.length && 0 === groupedHistory.older.length && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                        className: "no-results",
                                        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(Text, {
                                            type: "secondary",
                                            children: "No matching history record"
                                        })
                                    })
                                ]
                            })
                        })
                    ]
                })
            })
        ]
    });
};
exports.HistorySelector = __webpack_exports__.HistorySelector;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "HistorySelector"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
