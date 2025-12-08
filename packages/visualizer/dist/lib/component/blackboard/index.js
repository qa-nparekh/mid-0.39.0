'use client';
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
    pointMarkForItem: ()=>pointMarkForItem,
    default: ()=>blackboard,
    Blackboard: ()=>Blackboard,
    rectMarkForItem: ()=>rectMarkForItem
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("pixi.js/unsafe-eval");
const external_antd_namespaceObject = require("antd");
const external_pixi_js_namespaceObject = require("pixi.js");
const external_react_namespaceObject = require("react");
const color_js_namespaceObject = require("../../utils/color.js");
require("./index.css");
const extractor_namespaceObject = require("@sqai/shared/extractor");
const external_pixi_filters_namespaceObject = require("pixi-filters");
const store_js_namespaceObject = require("../../store/store.js");
const itemFillAlpha = 0.4;
const highlightAlpha = 0.4;
const pointRadius = 10;
const pointMarkForItem = (point, type)=>{
    const [x, y] = point;
    const themeColor = (0, color_js_namespaceObject.highlightColorForType)('element');
    const graphics = new external_pixi_js_namespaceObject.Graphics();
    graphics.beginFill(themeColor, itemFillAlpha);
    graphics.drawCircle(x, y, pointRadius);
    graphics.endFill();
    return graphics;
};
const rectMarkForItem = (rect, name, type)=>{
    const { left, top, width, height } = rect;
    let themeColor;
    themeColor = 'element' === type ? (0, color_js_namespaceObject.colorForName)(name) : 'searchArea' === type ? (0, color_js_namespaceObject.highlightColorForType)('searchArea') : (0, color_js_namespaceObject.highlightColorForType)('element');
    const alpha = 'highlight' === type ? highlightAlpha : itemFillAlpha;
    const graphics = new external_pixi_js_namespaceObject.Graphics();
    graphics.beginFill(themeColor, alpha);
    graphics.lineStyle(1, themeColor, 1);
    graphics.drawRect(left, top, width, height);
    graphics.endFill();
    const dropShadowFilter = new external_pixi_filters_namespaceObject.DropShadowFilter({
        blur: 2,
        quality: 3,
        alpha: 0.4,
        offset: {
            x: 4,
            y: 4
        },
        color: 0x333333
    });
    graphics.filters = [
        dropShadowFilter
    ];
    const nameFontSize = 18;
    if (!name) return [
        graphics
    ];
    const texts = new external_pixi_js_namespaceObject.Text(name, {
        fontSize: nameFontSize,
        fill: 0x0
    });
    texts.x = left;
    texts.y = Math.max(top - (nameFontSize + 4), 0);
    return [
        graphics,
        texts
    ];
};
const Blackboard = (props)=>{
    const highlightElements = props.highlightElements || [];
    const highlightIds = highlightElements.map((e)=>e.id);
    const highlightRect = props.highlightRect;
    const highlightPoints = props.highlightPoints;
    const context = props.uiContext;
    const { size, screenshotBase64 } = context;
    const screenWidth = size.width;
    const screenHeight = size.height;
    const domRef = (0, external_react_namespaceObject.useRef)(null);
    const app = (0, external_react_namespaceObject.useMemo)(()=>new external_pixi_js_namespaceObject.Application(), []);
    const [appInitialed, setAppInitialed] = (0, external_react_namespaceObject.useState)(false);
    const highlightContainer = (0, external_react_namespaceObject.useMemo)(()=>new external_pixi_js_namespaceObject.Container(), []);
    const elementMarkContainer = (0, external_react_namespaceObject.useMemo)(()=>new external_pixi_js_namespaceObject.Container(), []);
    const [hoverElement, setHoverElement] = (0, external_react_namespaceObject.useState)(null);
    const pixiBgRef = (0, external_react_namespaceObject.useRef)(void 0);
    const { backgroundVisible, setBackgroundVisible, elementsVisible, setElementsVisible } = (0, store_js_namespaceObject.useBlackboardPreference)();
    (0, external_react_namespaceObject.useEffect)(()=>{
        Promise.resolve((async ()=>{
            if (!domRef.current || !screenWidth) return;
            await app.init({
                width: screenWidth,
                height: screenHeight,
                background: 0xffffff
            });
            const canvasEl = domRef.current;
            domRef.current.appendChild(app.canvas);
            const { clientWidth } = domRef.current.parentElement;
            const targetHeight = 0.6 * window.innerHeight;
            const viewportRatio = clientWidth / targetHeight;
            if (screenWidth / screenHeight <= viewportRatio) {
                const ratio = targetHeight / screenHeight;
                canvasEl.style.width = `${Math.floor(screenWidth * ratio)}px`;
                canvasEl.style.height = `${Math.floor(screenHeight * ratio)}px`;
            }
            app.stage.addChild(highlightContainer);
            app.stage.addChild(elementMarkContainer);
            setAppInitialed(true);
        })());
        return ()=>{
            console.log('will destroy');
            try {
                app.destroy(true, {
                    children: true,
                    texture: true
                });
            } catch (e) {
                console.warn('destroy failed', e);
            }
        };
    }, [
        app,
        screenWidth,
        screenHeight
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (!appInitialed) return;
        app.stage.eventMode = 'static';
        app.stage.hitArea = new external_pixi_js_namespaceObject.Rectangle(0, 0, screenWidth, screenHeight);
        const clickHandler = (event)=>{
            var _props_onCanvasClick;
            console.log('pixi click', event);
            const { x, y } = event.data.global;
            null == (_props_onCanvasClick = props.onCanvasClick) || _props_onCanvasClick.call(props, [
                Math.round(x),
                Math.round(y)
            ]);
        };
        app.stage.on('click', clickHandler);
        return ()=>{
            var _app_stage;
            null == app || null == (_app_stage = app.stage) || _app_stage.off('click');
        };
    }, [
        appInitialed,
        props.onCanvasClick,
        screenWidth,
        screenHeight
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (!appInitialed) return;
        const img = new Image();
        img.onload = ()=>{
            if (!app.stage) return;
            const screenshotTexture = external_pixi_js_namespaceObject.Texture.from(img);
            const backgroundSprite = new external_pixi_js_namespaceObject.Sprite(screenshotTexture);
            backgroundSprite.x = 0;
            backgroundSprite.y = 0;
            backgroundSprite.width = screenWidth;
            backgroundSprite.height = screenHeight;
            backgroundSprite.eventMode = 'passive';
            app.stage.addChildAt(backgroundSprite, 0);
            pixiBgRef.current = backgroundSprite;
            backgroundSprite.visible = backgroundVisible;
        };
        img.onerror = (e)=>{
            console.error('load screenshot failed', e);
        };
        img.src = screenshotBase64;
    }, [
        app.stage,
        appInitialed,
        screenWidth,
        screenHeight
    ]);
    const { highlightElementRects } = (0, external_react_namespaceObject.useMemo)(()=>{
        const highlightElementRects = [];
        highlightContainer.removeChildren();
        elementMarkContainer.removeChildren();
        highlightContainer.eventMode = 'passive';
        elementMarkContainer.eventMode = 'passive';
        if (highlightRect) {
            const [graphics] = rectMarkForItem(highlightRect, 'Search Area', 'searchArea');
            highlightContainer.addChild(graphics);
        }
        if (highlightElements.length) highlightElements.forEach((element)=>{
            const { rect, content, id } = element;
            const [graphics] = rectMarkForItem(rect, content, 'highlight');
            highlightContainer.addChild(graphics);
        });
        if (null == highlightPoints ? void 0 : highlightPoints.length) highlightPoints.forEach((point)=>{
            const graphics = pointMarkForItem(point, 'highlightPoint');
            highlightContainer.addChild(graphics);
        });
        const elements = (0, extractor_namespaceObject.treeToList)(context.tree);
        elements.forEach((element)=>{
            const { rect, content, id } = element;
            const ifHighlight = highlightIds.includes(id) || (null == hoverElement ? void 0 : hoverElement.id) === id;
            if (ifHighlight) return;
            const [graphics] = rectMarkForItem(rect, content, 'element');
            elementMarkContainer.addChild(graphics);
        });
        elementMarkContainer.visible = elementsVisible;
        return {
            highlightElementRects
        };
    }, [
        app,
        appInitialed,
        highlightElements,
        context.tree,
        hoverElement,
        highlightRect,
        highlightPoints
    ]);
    const onSetBackgroundVisible = (e)=>{
        setBackgroundVisible(e.target.checked);
        if (pixiBgRef.current) pixiBgRef.current.visible = e.target.checked;
    };
    const onSetElementsVisible = (e)=>{
        setElementsVisible(e.target.checked);
        elementMarkContainer.visible = e.target.checked;
    };
    let bottomTipA = null;
    if (1 === highlightElementRects.length) bottomTipA = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: "bottom-tip",
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
            className: "bottom-tip-item",
            children: [
                "Element: ",
                JSON.stringify(highlightElementRects[0])
            ]
        })
    });
    else if (highlightElementRects.length > 1) bottomTipA = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: "bottom-tip",
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
            className: "bottom-tip-item",
            children: [
                "Element: ",
                JSON.stringify(highlightElementRects)
            ]
        })
    });
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
        className: "blackboard",
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "blackboard-main-content",
                style: {
                    width: '100%'
                },
                ref: domRef
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "blackboard-filter",
                style: {
                    display: props.hideController ? 'none' : 'block'
                },
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                    className: "overlay-control",
                    children: [
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Checkbox, {
                            checked: backgroundVisible,
                            onChange: onSetBackgroundVisible,
                            children: "Background"
                        }),
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Checkbox, {
                            checked: elementsVisible,
                            onChange: onSetElementsVisible,
                            children: "Elements"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "bottom-tip",
                style: {
                    display: props.hideController ? 'none' : 'block'
                },
                children: bottomTipA
            })
        ]
    });
};
const blackboard = Blackboard;
exports.Blackboard = __webpack_exports__.Blackboard;
exports["default"] = __webpack_exports__["default"];
exports.pointMarkForItem = __webpack_exports__.pointMarkForItem;
exports.rectMarkForItem = __webpack_exports__.rectMarkForItem;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "Blackboard",
    "default",
    "pointMarkForItem",
    "rectMarkForItem"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
