import { jsx, jsxs } from "react/jsx-runtime";
import { BorderOutlined, DownOutlined, SendOutlined } from "@ant-design/icons";
import "./index.css";
import { Button, Dropdown, Form, Input, Radio, Tooltip } from "antd";
import react, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistoryStore } from "../../store/history.mjs";
import { extractDefaultValue, isLocateField, isZodObjectSchema, unwrapZodType } from "../../types.mjs";
import { apiMetadata, defaultMainButtons } from "../../utils/constants.mjs";
import { actionNameForType, getPlaceholderForType, isRunButtonEnabled as playground_utils_mjs_isRunButtonEnabled } from "../../utils/playground-utils.mjs";
import { ConfigSelector } from "../config-selector/index.mjs";
import { BooleanField, EnumField, LocateField, NumberField, TextField } from "../form-field/index.mjs";
import { HistorySelector } from "../history-selector/index.mjs";
const { TextArea } = Input;
const PromptInput = (param)=>{
    let { runButtonEnabled, form, serviceMode, selectedType, dryMode, stoppable, loading, onRun, onStop, clearPromptAfterRun = true, actionSpace, hideDomAndScreenshotOptions = false } = param;
    const [hoveringSettings, setHoveringSettings] = useState(false);
    const [promptValue, setPromptValue] = useState('');
    const placeholder = getPlaceholderForType(selectedType);
    const textAreaRef = useRef(null);
    const modeRadioGroupRef = useRef(null);
    const params = Form.useWatch('params', form);
    const lastHistoryRef = useRef(null);
    const history = useHistoryStore((state)=>state.history);
    const lastSelectedType = useHistoryStore((state)=>state.lastSelectedType);
    const addHistory = useHistoryStore((state)=>state.addHistory);
    const setLastSelectedType = useHistoryStore((state)=>state.setLastSelectedType);
    const historyForSelectedType = useMemo(()=>history[selectedType] || [], [
        history,
        selectedType
    ]);
    const needsStructuredParams = useMemo(()=>{
        if (actionSpace) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if (!(null == action ? void 0 : action.paramSchema)) return false;
            if (isZodObjectSchema(action.paramSchema)) {
                const schema = action.paramSchema;
                const shape = schema.shape || {};
                const shapeKeys = Object.keys(shape);
                return shapeKeys.length > 0;
            }
            return true;
        }
        return false;
    }, [
        selectedType,
        actionSpace
    ]);
    const needsAnyInput = useMemo(()=>{
        if (actionSpace && actionSpace.length > 0) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if (action) {
                if (action.paramSchema && isZodObjectSchema(action.paramSchema)) {
                    const schema = action.paramSchema;
                    const shape = schema.shape || {};
                    const hasRequiredFields = Object.keys(shape).some((key)=>{
                        const field = shape[key];
                        const { isOptional } = unwrapZodType(field);
                        return !isOptional;
                    });
                    return hasRequiredFields;
                }
                return !!action.paramSchema;
            }
        }
        return true;
    }, [
        selectedType,
        actionSpace
    ]);
    const showDataExtractionOptions = useMemo(()=>{
        const dataExtractionMethods = [
            'aiQuery',
            'aiBoolean',
            'aiNumber',
            'aiString',
            'aiAsk',
            'aiAssert'
        ];
        return dataExtractionMethods.includes(selectedType);
    }, [
        selectedType
    ]);
    const showDeepThinkOption = useMemo(()=>{
        if ('aiLocate' === selectedType) return true;
        if (actionSpace) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if ((null == action ? void 0 : action.paramSchema) && isZodObjectSchema(action.paramSchema)) {
                const schema = action.paramSchema;
                const shape = schema.shape || {};
                const hasLocateField = Object.keys(shape).some((key)=>{
                    const field = shape[key];
                    const { actualField } = unwrapZodType(field);
                    return isLocateField(actualField);
                });
                return hasLocateField;
            }
        }
        return false;
    }, [
        selectedType,
        actionSpace
    ]);
    const hasConfigOptions = useMemo(()=>{
        const hasTracking = 'In-Browser-Extension' === serviceMode;
        const hasDeepThink = showDeepThinkOption;
        const hasDataExtraction = showDataExtractionOptions && !hideDomAndScreenshotOptions;
        return hasTracking || hasDeepThink || hasDataExtraction;
    }, [
        serviceMode,
        showDeepThinkOption,
        showDataExtractionOptions,
        hideDomAndScreenshotOptions
    ]);
    const availableDropdownMethods = useMemo(()=>{
        const metadataMethods = Object.keys(apiMetadata);
        if (!actionSpace || 0 === actionSpace.length) return metadataMethods;
        const availableMethods = actionSpace.map((action)=>action.interfaceAlias || action.name);
        const finalMethods = new Set();
        metadataMethods.forEach((method)=>{
            const methodInfo = apiMetadata[method];
            if ((null == methodInfo ? void 0 : methodInfo.group) === 'extraction' || (null == methodInfo ? void 0 : methodInfo.group) === 'validation') finalMethods.add(method);
            else if (availableMethods.includes(method)) finalMethods.add(method);
        });
        availableMethods.forEach((method)=>{
            finalMethods.add(method);
        });
        return Array.from(finalMethods);
    }, [
        actionSpace
    ]);
    const getDefaultParams = useCallback(()=>{
        if (!needsStructuredParams || !actionSpace) return {};
        const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
        if ((null == action ? void 0 : action.paramSchema) && isZodObjectSchema(action.paramSchema)) {
            const defaultParams = {};
            const schema = action.paramSchema;
            const shape = schema.shape || {};
            Object.keys(shape).forEach((key)=>{
                const field = shape[key];
                const defaultValue = extractDefaultValue(field);
                if (void 0 !== defaultValue) defaultParams[key] = defaultValue;
            });
            return defaultParams;
        }
        return {};
    }, [
        selectedType,
        needsStructuredParams,
        actionSpace
    ]);
    useEffect(()=>{
        if (!form.getFieldValue('type') && lastSelectedType) form.setFieldValue('type', lastSelectedType);
    }, [
        form,
        lastSelectedType
    ]);
    useEffect(()=>{
        if (selectedType && selectedType !== lastSelectedType) setLastSelectedType(selectedType);
    }, [
        selectedType,
        lastSelectedType,
        setLastSelectedType
    ]);
    const scrollToSelectedItem = useCallback(()=>{
        const container = modeRadioGroupRef.current;
        if (!container) return;
        let targetElement = null;
        const selectedRadioButton = container.querySelector('.ant-radio-button-wrapper-checked');
        const dropdownButton = container.querySelector('.more-apis-button.selected-from-dropdown');
        if (selectedRadioButton) targetElement = selectedRadioButton;
        else if (dropdownButton) targetElement = dropdownButton;
        if (targetElement) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            const targetLeft = targetRect.left - containerRect.left + container.scrollLeft;
            const targetWidth = targetRect.width;
            const containerWidth = containerRect.width;
            const optimalScrollLeft = targetLeft - (containerWidth - targetWidth) / 2;
            container.scrollTo({
                left: Math.max(0, optimalScrollLeft),
                behavior: 'smooth'
            });
        }
    }, []);
    useEffect(()=>{
        const lastHistory = historyForSelectedType[0];
        if (lastHistory && lastHistoryRef.current && lastHistory.timestamp === lastHistoryRef.current.timestamp) return;
        if (lastHistory) {
            form.setFieldsValue({
                type: lastHistory.type,
                prompt: lastHistory.prompt || '',
                params: lastHistory.params
            });
            setPromptValue(lastHistory.prompt || '');
            lastHistoryRef.current = lastHistory;
        } else {
            const defaultParams = getDefaultParams();
            form.setFieldsValue({
                prompt: '',
                params: defaultParams
            });
            setPromptValue('');
            lastHistoryRef.current = null;
        }
    }, [
        selectedType,
        historyForSelectedType,
        form,
        getDefaultParams
    ]);
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            scrollToSelectedItem();
        }, 100);
        return ()=>clearTimeout(timeoutId);
    }, [
        selectedType,
        scrollToSelectedItem
    ]);
    const formPromptValue = Form.useWatch('prompt', form);
    useEffect(()=>{
        if (formPromptValue !== promptValue) setPromptValue(formPromptValue || '');
    }, [
        formPromptValue,
        promptValue
    ]);
    const handleSelectHistory = useCallback((historyItem)=>{
        form.setFieldsValue({
            prompt: historyItem.prompt,
            type: historyItem.type,
            params: historyItem.params
        });
        setPromptValue(historyItem.prompt);
    }, [
        form
    ]);
    const handlePromptChange = useCallback((e)=>{
        const value = e.target.value;
        setPromptValue(value);
    }, []);
    const hasSingleStructuredParam = useMemo(()=>{
        if (!needsStructuredParams || !actionSpace) return false;
        const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
        if ((null == action ? void 0 : action.paramSchema) && isZodObjectSchema(action.paramSchema)) {
            const schema = action.paramSchema;
            const shape = schema.shape || {};
            return 1 === Object.keys(shape).length;
        }
        return false;
    }, [
        selectedType,
        needsStructuredParams,
        actionSpace
    ]);
    const isRunButtonEnabled = useMemo(()=>playground_utils_mjs_isRunButtonEnabled(runButtonEnabled, !!needsStructuredParams, params, actionSpace, selectedType, promptValue), [
        runButtonEnabled,
        needsStructuredParams,
        selectedType,
        actionSpace,
        promptValue,
        params
    ]);
    const handleRunWithHistory = useCallback(()=>{
        const values = form.getFieldsValue();
        let historyPrompt = '';
        if (needsStructuredParams && values.params && actionSpace) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if ((null == action ? void 0 : action.paramSchema) && isZodObjectSchema(action.paramSchema)) {
                let locateValue = '';
                const otherValues = [];
                const schema = action.paramSchema;
                const shape = schema.shape || {};
                Object.keys(shape).forEach((key)=>{
                    var _values_params;
                    const paramValue = null == (_values_params = values.params) ? void 0 : _values_params[key];
                    if (null != paramValue && '' !== paramValue) {
                        const field = shape[key];
                        const { actualField } = unwrapZodType(field);
                        if (isLocateField(actualField)) locateValue = String(paramValue);
                        else if ('distance' === key) otherValues.push(`${paramValue}`);
                        else otherValues.push(String(paramValue));
                    }
                });
                const mainPart = otherValues.join(' ');
                historyPrompt = locateValue ? `${locateValue} - ${mainPart}` : mainPart;
            } else historyPrompt = values.prompt || '';
        } else historyPrompt = values.prompt || '';
        const newHistoryItem = {
            type: values.type,
            prompt: historyPrompt,
            params: values.params,
            timestamp: Date.now()
        };
        addHistory(newHistoryItem);
        onRun();
        if (clearPromptAfterRun) {
            lastHistoryRef.current = newHistoryItem;
            setPromptValue('');
            if (needsStructuredParams) {
                const defaultParams = getDefaultParams();
                form.setFieldValue('params', defaultParams);
            } else form.setFieldValue('prompt', '');
        }
    }, [
        form,
        addHistory,
        onRun,
        needsStructuredParams,
        selectedType,
        clearPromptAfterRun,
        actionSpace,
        getDefaultParams
    ]);
    const handleKeyDown = useCallback((e)=>{
        if ('Enter' === e.key && e.metaKey && isRunButtonEnabled) {
            handleRunWithHistory();
            e.preventDefault();
            e.stopPropagation();
        } else if ('Enter' === e.key) setTimeout(()=>{
            if (textAreaRef.current) {
                var _textAreaRef_current_resizableTextArea;
                const textarea = null == (_textAreaRef_current_resizableTextArea = textAreaRef.current.resizableTextArea) ? void 0 : _textAreaRef_current_resizableTextArea.textArea;
                if (textarea) {
                    const selectionStart = textarea.selectionStart;
                    const value = textarea.value;
                    const lastNewlineIndex = value.lastIndexOf('\n');
                    const isAtLastLine = -1 === lastNewlineIndex || selectionStart > lastNewlineIndex;
                    if (isAtLastLine) textarea.scrollTop = textarea.scrollHeight;
                }
            }
        }, 0);
    }, [
        handleRunWithHistory,
        isRunButtonEnabled
    ]);
    const handleStructuredKeyDown = useCallback((e)=>{
        if ('Enter' === e.key && e.metaKey && isRunButtonEnabled) {
            handleRunWithHistory();
            e.preventDefault();
            e.stopPropagation();
        }
    }, [
        handleRunWithHistory,
        isRunButtonEnabled
    ]);
    const renderStructuredParams = useCallback(()=>{
        if (!needsStructuredParams) return null;
        if (actionSpace) {
            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
            if ((null == action ? void 0 : action.paramSchema) && isZodObjectSchema(action.paramSchema)) {
                const schema = action.paramSchema;
                const shape = schema.shape || {};
                const schemaKeys = Object.keys(shape);
                if (1 === schemaKeys.length) {
                    const key = schemaKeys[0];
                    const field = shape[key];
                    const { actualField } = unwrapZodType(field);
                    const isLocateFieldFlag = isLocateField(actualField);
                    const placeholderText = (()=>{
                        var _fieldWithRuntime__def;
                        const fieldWithRuntime = actualField;
                        if (null == (_fieldWithRuntime__def = fieldWithRuntime._def) ? void 0 : _fieldWithRuntime__def.description) return fieldWithRuntime._def.description;
                        if (fieldWithRuntime.description) return fieldWithRuntime.description;
                        if (actionSpace) {
                            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
                            if ((null == action ? void 0 : action.paramSchema) && 'object' == typeof action.paramSchema && 'shape' in action.paramSchema) {
                                var _fieldDef__def;
                                const shape = action.paramSchema.shape || {};
                                const fieldDef = shape[key];
                                if (null == fieldDef ? void 0 : null == (_fieldDef__def = fieldDef._def) ? void 0 : _fieldDef__def.description) return fieldDef._def.description;
                                if (null == fieldDef ? void 0 : fieldDef.description) return fieldDef.description;
                            }
                        }
                        if (isLocateFieldFlag) return 'Describe the element you want to interact with';
                        if ('keyName' === key) return 'Enter key name or text to type';
                        if ('value' === key) return 'Enter text to input';
                        return `Enter ${key}`;
                    })();
                    return /*#__PURE__*/ jsx(Form.Item, {
                        name: [
                            'params',
                            key
                        ],
                        style: {
                            margin: 0
                        },
                        children: /*#__PURE__*/ jsx(Input.TextArea, {
                            className: "main-side-console-input-textarea",
                            rows: 4,
                            placeholder: placeholderText,
                            autoFocus: true,
                            onKeyDown: handleStructuredKeyDown
                        })
                    });
                }
                const fields = [];
                const sortedKeys = schemaKeys.sort((keyA, keyB)=>{
                    const fieldSchemaA = shape[keyA];
                    const fieldSchemaB = shape[keyB];
                    const { isOptional: isOptionalA } = unwrapZodType(fieldSchemaA);
                    const { isOptional: isOptionalB } = unwrapZodType(fieldSchemaB);
                    if (!isOptionalA && isOptionalB) return -1;
                    if (isOptionalA && !isOptionalB) return 1;
                    return 0;
                });
                sortedKeys.forEach((key, index)=>{
                    var _actualField__def, _actualField__def1, _actualField__def2;
                    const fieldSchema = shape[key];
                    const { actualField, isOptional } = unwrapZodType(fieldSchema);
                    const isLocateFieldFlag = isLocateField(actualField);
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    const isRequired = !isOptional;
                    const marginBottom = index === sortedKeys.length - 1 ? 0 : 12;
                    const placeholder = (()=>{
                        var _fieldWithRuntime__def;
                        const fieldWithRuntime = actualField;
                        if (null == (_fieldWithRuntime__def = fieldWithRuntime._def) ? void 0 : _fieldWithRuntime__def.description) return fieldWithRuntime._def.description;
                        if (fieldWithRuntime.description) return fieldWithRuntime.description;
                        if (actionSpace) {
                            const action = actionSpace.find((a)=>a.interfaceAlias === selectedType || a.name === selectedType);
                            if ((null == action ? void 0 : action.paramSchema) && 'object' == typeof action.paramSchema && 'shape' in action.paramSchema) {
                                var _fieldDef__def;
                                const shape = action.paramSchema.shape || {};
                                const fieldDef = shape[key];
                                if (null == fieldDef ? void 0 : null == (_fieldDef__def = fieldDef._def) ? void 0 : _fieldDef__def.description) return fieldDef._def.description;
                                if (null == fieldDef ? void 0 : fieldDef.description) return fieldDef.description;
                            }
                        }
                        if (isLocateFieldFlag) return 'Describe the element you want to interact with';
                    })();
                    const fieldProps = {
                        name: key,
                        label,
                        fieldSchema: actualField,
                        isRequired,
                        marginBottom,
                        placeholder
                    };
                    if (isLocateFieldFlag) fields.push(/*#__PURE__*/ jsx(LocateField, {
                        ...fieldProps
                    }, key));
                    else if ((null == (_actualField__def = actualField._def) ? void 0 : _actualField__def.typeName) === 'ZodEnum') fields.push(/*#__PURE__*/ jsx(EnumField, {
                        ...fieldProps
                    }, key));
                    else if ((null == (_actualField__def1 = actualField._def) ? void 0 : _actualField__def1.typeName) === 'ZodNumber') fields.push(/*#__PURE__*/ jsx(NumberField, {
                        ...fieldProps
                    }, key));
                    else if ((null == (_actualField__def2 = actualField._def) ? void 0 : _actualField__def2.typeName) === 'ZodBoolean') fields.push(/*#__PURE__*/ jsx(BooleanField, {
                        ...fieldProps
                    }, key));
                    else fields.push(/*#__PURE__*/ jsx(TextField, {
                        ...fieldProps
                    }, key));
                });
                if ('aiScroll' === selectedType) {
                    const directionField = fields.find((field)=>/*#__PURE__*/ react.isValidElement(field) && 'direction' === field.props.name);
                    const distanceField = fields.find((field)=>/*#__PURE__*/ react.isValidElement(field) && 'distance' === field.props.name);
                    const otherFields = fields.filter((field)=>/*#__PURE__*/ react.isValidElement(field) && 'direction' !== field.props.name && 'distance' !== field.props.name);
                    if (directionField && distanceField) return /*#__PURE__*/ jsxs("div", {
                        className: "structured-params",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                style: {
                                    display: 'flex',
                                    gap: 12,
                                    marginBottom: 12
                                },
                                children: [
                                    directionField,
                                    distanceField
                                ]
                            }),
                            otherFields
                        ]
                    });
                }
                return /*#__PURE__*/ jsx("div", {
                    className: "structured-params",
                    children: fields
                });
            }
        }
        return null;
    }, [
        selectedType,
        needsStructuredParams,
        actionSpace,
        handleStructuredKeyDown
    ]);
    const handleMouseEnter = useCallback(()=>{
        setHoveringSettings(true);
    }, []);
    const handleMouseLeave = useCallback(()=>{
        setHoveringSettings(false);
    }, []);
    const renderActionButton = useCallback(()=>{
        const runButton = (text)=>/*#__PURE__*/ jsx(Button, {
                type: "primary",
                icon: /*#__PURE__*/ jsx(SendOutlined, {}),
                style: {
                    borderRadius: 20,
                    zIndex: 999
                },
                onClick: handleRunWithHistory,
                disabled: !isRunButtonEnabled,
                loading: loading,
                children: text
            });
        if (dryMode) return 'aiAction' === selectedType ? /*#__PURE__*/ jsx(Tooltip, {
            title: "Start executing until some interaction actions need to be performed. You can see the process of planning and locating.",
            children: runButton('Dry Run')
        }) : runButton('Run');
        if (stoppable) return /*#__PURE__*/ jsx(Button, {
            icon: /*#__PURE__*/ jsx(BorderOutlined, {}),
            onClick: onStop,
            style: {
                borderRadius: 20,
                zIndex: 999
            },
            children: "Stop"
        });
        return runButton('Run');
    }, [
        dryMode,
        loading,
        handleRunWithHistory,
        onStop,
        isRunButtonEnabled,
        selectedType,
        stoppable
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: "prompt-input-wrapper",
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "mode-radio-group-wrapper",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "mode-radio-group",
                        ref: modeRadioGroupRef,
                        children: [
                            /*#__PURE__*/ jsx(Form.Item, {
                                name: "type",
                                style: {
                                    margin: 0
                                },
                                children: /*#__PURE__*/ jsx(Radio.Group, {
                                    buttonStyle: "solid",
                                    disabled: !runButtonEnabled,
                                    children: defaultMainButtons.map((apiType)=>{
                                        var _apiMetadata_apiType;
                                        return /*#__PURE__*/ jsx(Tooltip, {
                                            title: (null == (_apiMetadata_apiType = apiMetadata[apiType]) ? void 0 : _apiMetadata_apiType.title) || '',
                                            children: /*#__PURE__*/ jsx(Radio.Button, {
                                                value: apiType,
                                                children: actionNameForType(apiType)
                                            })
                                        }, apiType);
                                    })
                                })
                            }),
                            /*#__PURE__*/ jsx(Dropdown, {
                                menu: (()=>{
                                    const hiddenAPIs = availableDropdownMethods.filter((api)=>!defaultMainButtons.includes(api));
                                    const groupedItems = [];
                                    const interactionAPIs = hiddenAPIs.filter((api)=>{
                                        var _apiMetadata_api;
                                        return (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.group) === 'interaction';
                                    });
                                    if (interactionAPIs.length > 0) groupedItems.push({
                                        key: 'interaction-group',
                                        type: 'group',
                                        label: 'Interaction APIs',
                                        children: interactionAPIs.map((api)=>{
                                            var _apiMetadata_api;
                                            return {
                                                key: api,
                                                label: actionNameForType(api),
                                                title: (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.title) || '',
                                                onClick: ()=>{
                                                    form.setFieldValue('type', api);
                                                }
                                            };
                                        })
                                    });
                                    const extractionAPIs = hiddenAPIs.filter((api)=>{
                                        var _apiMetadata_api;
                                        return (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.group) === 'extraction';
                                    });
                                    if (extractionAPIs.length > 0) groupedItems.push({
                                        key: 'extraction-group',
                                        type: 'group',
                                        label: 'Data Extraction APIs',
                                        children: extractionAPIs.map((api)=>{
                                            var _apiMetadata_api;
                                            return {
                                                key: api,
                                                label: actionNameForType(api),
                                                title: (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.title) || '',
                                                onClick: ()=>{
                                                    form.setFieldValue('type', api);
                                                }
                                            };
                                        })
                                    });
                                    const validationAPIs = hiddenAPIs.filter((api)=>{
                                        var _apiMetadata_api;
                                        return (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.group) === 'validation';
                                    });
                                    if (validationAPIs.length > 0) groupedItems.push({
                                        key: 'validation-group',
                                        type: 'group',
                                        label: 'Validation APIs',
                                        children: validationAPIs.map((api)=>{
                                            var _apiMetadata_api;
                                            return {
                                                key: api,
                                                label: actionNameForType(api),
                                                title: (null == (_apiMetadata_api = apiMetadata[api]) ? void 0 : _apiMetadata_api.title) || '',
                                                onClick: ()=>{
                                                    form.setFieldValue('type', api);
                                                }
                                            };
                                        })
                                    });
                                    const deviceSpecificAPIs = hiddenAPIs.filter((api)=>!apiMetadata[api]);
                                    if (deviceSpecificAPIs.length > 0) groupedItems.push({
                                        key: 'device-specific-group',
                                        type: 'group',
                                        label: 'Device-Specific APIs',
                                        children: deviceSpecificAPIs.map((api)=>({
                                                key: api,
                                                label: actionNameForType(api),
                                                title: '',
                                                onClick: ()=>{
                                                    form.setFieldValue('type', api);
                                                }
                                            }))
                                    });
                                    return {
                                        items: groupedItems
                                    };
                                })(),
                                placement: "bottomLeft",
                                trigger: [
                                    'click'
                                ],
                                disabled: !runButtonEnabled,
                                children: /*#__PURE__*/ jsxs(Button, {
                                    className: `more-apis-button ${!defaultMainButtons.includes(selectedType) ? 'selected-from-dropdown' : ''}`,
                                    children: [
                                        selectedType && !defaultMainButtons.includes(selectedType) ? actionNameForType(selectedType) : 'more',
                                        /*#__PURE__*/ jsx(DownOutlined, {
                                            style: {
                                                fontSize: '10px',
                                                marginLeft: '2px'
                                            }
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "action-icons",
                        children: [
                            hasConfigOptions && /*#__PURE__*/ jsx("div", {
                                className: hoveringSettings ? 'settings-wrapper settings-wrapper-hover' : 'settings-wrapper',
                                onMouseEnter: handleMouseEnter,
                                onMouseLeave: handleMouseLeave,
                                children: /*#__PURE__*/ jsx(ConfigSelector, {
                                    enableTracking: 'In-Browser-Extension' === serviceMode,
                                    showDeepThinkOption: showDeepThinkOption,
                                    showDataExtractionOptions: showDataExtractionOptions,
                                    hideDomAndScreenshotOptions: hideDomAndScreenshotOptions
                                })
                            }),
                            /*#__PURE__*/ jsx(HistorySelector, {
                                onSelect: handleSelectHistory,
                                history: historyForSelectedType,
                                currentType: selectedType
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsxs("div", {
                className: `main-side-console-input ${!runButtonEnabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`,
                children: [
                    needsAnyInput ? needsStructuredParams ? hasSingleStructuredParam ? renderStructuredParams() : /*#__PURE__*/ jsx("div", {
                        className: "structured-params-container",
                        children: renderStructuredParams()
                    }) : /*#__PURE__*/ jsx(Form.Item, {
                        name: "prompt",
                        style: {
                            margin: 0
                        },
                        children: /*#__PURE__*/ jsx(TextArea, {
                            className: "main-side-console-input-textarea",
                            disabled: !runButtonEnabled,
                            rows: 4,
                            placeholder: placeholder,
                            autoFocus: true,
                            onKeyDown: handleKeyDown,
                            onChange: handlePromptChange,
                            ref: textAreaRef
                        })
                    }) : /*#__PURE__*/ jsxs("div", {
                        className: "no-input-method",
                        style: {
                            padding: '20px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '14px'
                        },
                        children: [
                            'Click "Run" to execute ',
                            actionNameForType(selectedType)
                        ]
                    }),
                    /*#__PURE__*/ jsx("div", {
                        className: "form-controller-wrapper",
                        children: renderActionButton()
                    })
                ]
            })
        ]
    });
};
export { PromptInput };
