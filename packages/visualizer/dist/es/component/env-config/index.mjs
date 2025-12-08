import { jsx, jsxs } from "react/jsx-runtime";
import { SettingOutlined } from "@ant-design/icons";
import { Input, Modal, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { useEnvConfig } from "../../store/store.mjs";
function EnvConfig(param) {
    let { showTooltipWhenEmpty = true, showModelName = true, tooltipPlacement = 'bottom', mode = 'icon' } = param;
    const { config, configString, loadConfig, syncFromStorage } = useEnvConfig();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempConfigString, setTempConfigString] = useState(configString);
    const midsceneModelName = config.MIDSCENE_MODEL_NAME;
    const componentRef = useRef(null);
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
    useEffect(()=>{
        if (isModalOpen) setTempConfigString(configString);
    }, [
        isModalOpen,
        configString
    ]);
    return /*#__PURE__*/ jsxs("div", {
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
            /*#__PURE__*/ jsx(Tooltip, {
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
                children: 'icon' === mode ? /*#__PURE__*/ jsx(SettingOutlined, {
                    onClick: showModal
                }) : /*#__PURE__*/ jsx("span", {
                    onClick: showModal,
                    style: {
                        color: '#006AFF',
                        cursor: 'pointer'
                    },
                    children: "set up"
                })
            }),
            /*#__PURE__*/ jsxs(Modal, {
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
                    /*#__PURE__*/ jsx(Input.TextArea, {
                        rows: 7,
                        placeholder: 'OPENAI_API_KEY=sk-...\nMIDSCENE_MODEL_NAME=gpt-4o-2024-08-06\n...',
                        value: tempConfigString,
                        onChange: (e)=>setTempConfigString(e.target.value),
                        style: {
                            whiteSpace: 'nowrap',
                            wordWrap: 'break-word'
                        }
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        children: [
                            /*#__PURE__*/ jsx("p", {
                                children: "The format is KEY=VALUE and separated by new lines."
                            }),
                            /*#__PURE__*/ jsxs("p", {
                                children: [
                                    "These data will be saved ",
                                    /*#__PURE__*/ jsx("strong", {
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
export { EnvConfig };
