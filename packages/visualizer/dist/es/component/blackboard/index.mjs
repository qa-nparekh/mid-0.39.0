'use client';
import { jsx, jsxs } from "react/jsx-runtime";
import "pixi.js/unsafe-eval";
import { Checkbox } from "antd";
import { Application, Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { colorForName, highlightColorForType } from "../../utils/color.mjs";
import "./index.css";
import { treeToList } from "@sqaitech/shared/extractor";
import { DropShadowFilter } from "pixi-filters";
import { useBlackboardPreference } from "../../store/store.mjs";
const itemFillAlpha = 0.4;
const highlightAlpha = 0.4;
const pointRadius = 10;
const pointMarkForItem = (point, type)=>{
    const [x, y] = point;
    const themeColor = highlightColorForType('element');
    const graphics = new Graphics();
    graphics.beginFill(themeColor, itemFillAlpha);
    graphics.drawCircle(x, y, pointRadius);
    graphics.endFill();
    return graphics;
};
const rectMarkForItem = (rect, name, type)=>{
    const { left, top, width, height } = rect;
    let themeColor;
    themeColor = 'element' === type ? colorForName(name) : 'searchArea' === type ? highlightColorForType('searchArea') : highlightColorForType('element');
    const alpha = 'highlight' === type ? highlightAlpha : itemFillAlpha;
    const graphics = new Graphics();
    graphics.beginFill(themeColor, alpha);
    graphics.lineStyle(1, themeColor, 1);
    graphics.drawRect(left, top, width, height);
    graphics.endFill();
    const dropShadowFilter = new DropShadowFilter({
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
    const texts = new Text(name, {
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
    const domRef = useRef(null);
    const app = useMemo(()=>new Application(), []);
    const [appInitialed, setAppInitialed] = useState(false);
    const highlightContainer = useMemo(()=>new Container(), []);
    const elementMarkContainer = useMemo(()=>new Container(), []);
    const [hoverElement, setHoverElement] = useState(null);
    const pixiBgRef = useRef(void 0);
    const { backgroundVisible, setBackgroundVisible, elementsVisible, setElementsVisible } = useBlackboardPreference();
    useEffect(()=>{
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
    useEffect(()=>{
        if (!appInitialed) return;
        app.stage.eventMode = 'static';
        app.stage.hitArea = new Rectangle(0, 0, screenWidth, screenHeight);
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
    useEffect(()=>{
        if (!appInitialed) return;
        const img = new Image();
        img.onload = ()=>{
            if (!app.stage) return;
            const screenshotTexture = Texture.from(img);
            const backgroundSprite = new Sprite(screenshotTexture);
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
    const { highlightElementRects } = useMemo(()=>{
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
        const elements = treeToList(context.tree);
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
    if (1 === highlightElementRects.length) bottomTipA = /*#__PURE__*/ jsx("div", {
        className: "bottom-tip",
        children: /*#__PURE__*/ jsxs("div", {
            className: "bottom-tip-item",
            children: [
                "Element: ",
                JSON.stringify(highlightElementRects[0])
            ]
        })
    });
    else if (highlightElementRects.length > 1) bottomTipA = /*#__PURE__*/ jsx("div", {
        className: "bottom-tip",
        children: /*#__PURE__*/ jsxs("div", {
            className: "bottom-tip-item",
            children: [
                "Element: ",
                JSON.stringify(highlightElementRects)
            ]
        })
    });
    return /*#__PURE__*/ jsxs("div", {
        className: "blackboard",
        children: [
            /*#__PURE__*/ jsx("div", {
                className: "blackboard-main-content",
                style: {
                    width: '100%'
                },
                ref: domRef
            }),
            /*#__PURE__*/ jsx("div", {
                className: "blackboard-filter",
                style: {
                    display: props.hideController ? 'none' : 'block'
                },
                children: /*#__PURE__*/ jsxs("div", {
                    className: "overlay-control",
                    children: [
                        /*#__PURE__*/ jsx(Checkbox, {
                            checked: backgroundVisible,
                            onChange: onSetBackgroundVisible,
                            children: "Background"
                        }),
                        /*#__PURE__*/ jsx(Checkbox, {
                            checked: elementsVisible,
                            onChange: onSetElementsVisible,
                            children: "Elements"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx("div", {
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
export { Blackboard, blackboard as default, pointMarkForItem, rectMarkForItem };
