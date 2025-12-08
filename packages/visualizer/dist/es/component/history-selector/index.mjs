import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button, Input, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import icons_close from "../../icons/close.mjs";
import icons_history from "../../icons/history.mjs";
import magnifying_glass from "../../icons/magnifying-glass.mjs";
import { useHistoryStore } from "../../store/history.mjs";
import "./index.css";
const { Text } = Typography;
const HistorySelector = (param)=>{
    let { onSelect, history, currentType } = param;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const clearHistory = useHistoryStore((state)=>state.clearHistory);
    const modalRef = useRef(null);
    const groupedHistory = useMemo(()=>{
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
    useEffect(()=>{
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
        return /*#__PURE__*/ jsxs("div", {
            className: "history-group",
            children: [
                /*#__PURE__*/ jsx("div", {
                    className: "history-group-title",
                    children: title
                }),
                items.map((item, index)=>/*#__PURE__*/ jsx("div", {
                        className: "history-item",
                        onClick: ()=>handleHistoryClick(item),
                        children: item.prompt
                    }, `${item.timestamp}-${index}`))
            ]
        }, title);
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "history-selector-wrapper",
        children: [
            /*#__PURE__*/ jsx("div", {
                className: "selector-trigger",
                onClick: ()=>setIsModalOpen(true),
                children: /*#__PURE__*/ jsx(icons_history, {
                    width: 24,
                    height: 24
                })
            }),
            isModalOpen && /*#__PURE__*/ jsx("div", {
                className: "history-modal-overlay",
                ref: modalRef,
                children: /*#__PURE__*/ jsxs("div", {
                    className: "history-modal-container",
                    children: [
                        /*#__PURE__*/ jsxs("div", {
                            className: "history-modal-header",
                            children: [
                                /*#__PURE__*/ jsxs(Text, {
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
                                /*#__PURE__*/ jsx(Button, {
                                    size: "small",
                                    type: "text",
                                    icon: /*#__PURE__*/ jsx(icons_close, {
                                        width: 16,
                                        height: 16
                                    }),
                                    onClick: ()=>setIsModalOpen(false),
                                    className: "close-button"
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsx("div", {
                            className: "history-search-section",
                            children: /*#__PURE__*/ jsxs("div", {
                                className: "search-input-wrapper",
                                children: [
                                    /*#__PURE__*/ jsx(Input, {
                                        placeholder: "Search",
                                        value: searchText,
                                        onChange: (e)=>setSearchText(e.target.value),
                                        prefix: /*#__PURE__*/ jsx(magnifying_glass, {
                                            width: 18,
                                            height: 18
                                        }),
                                        className: "search-input",
                                        allowClear: true
                                    }),
                                    /*#__PURE__*/ jsx(Button, {
                                        type: "link",
                                        onClick: handleClearHistory,
                                        className: "clear-button",
                                        disabled: 0 === history.length,
                                        children: "Clear"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx("div", {
                            className: "history-content",
                            children: 0 === history.length ? /*#__PURE__*/ jsx("div", {
                                className: "no-results",
                                children: /*#__PURE__*/ jsx(Text, {
                                    type: "secondary",
                                    children: "No history record"
                                })
                            }) : /*#__PURE__*/ jsxs(Fragment, {
                                children: [
                                    renderHistoryGroup('Last 7 days', groupedHistory.recent7Days),
                                    renderHistoryGroup('Last 1 year', groupedHistory.recent1Year),
                                    renderHistoryGroup('Earlier', groupedHistory.older),
                                    searchText && 0 === groupedHistory.recent7Days.length && 0 === groupedHistory.recent1Year.length && 0 === groupedHistory.older.length && /*#__PURE__*/ jsx("div", {
                                        className: "no-results",
                                        children: /*#__PURE__*/ jsx(Text, {
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
export { HistorySelector };
