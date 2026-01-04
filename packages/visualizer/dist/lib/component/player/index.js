'use client';
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
    Player: ()=>Player
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("pixi.js/unsafe-eval");
const external_pixi_js_namespaceObject = require("pixi.js");
const external_react_namespaceObject = require("react");
require("./index.css");
const index_js_namespaceObject = require("../../utils/index.js");
const icons_namespaceObject = require("@ant-design/icons");
const extractor_namespaceObject = require("@sqaitech/shared/extractor");
const external_antd_namespaceObject = require("antd");
const global_perspective_js_namespaceObject = require("../../icons/global-perspective.js");
var global_perspective_js_default = /*#__PURE__*/ __webpack_require__.n(global_perspective_js_namespaceObject);
const player_setting_js_namespaceObject = require("../../icons/player-setting.js");
var player_setting_js_default = /*#__PURE__*/ __webpack_require__.n(player_setting_js_namespaceObject);
const show_marker_js_namespaceObject = require("../../icons/show-marker.js");
var show_marker_js_default = /*#__PURE__*/ __webpack_require__.n(show_marker_js_namespaceObject);
const store_js_namespaceObject = require("../../store/store.js");
const pixi_loader_js_namespaceObject = require("../../utils/pixi-loader.js");
const external_blackboard_index_js_namespaceObject = require("../blackboard/index.js");
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
const canvasPaddingLeft = 0;
const canvasPaddingTop = 0;
const cubicBezier = (t, p0, p1, p2, p3)=>{
    const t2 = 1 - t;
    return p0 * t2 * t2 * t2 + 3 * p1 * t * t2 * t2 + 3 * p2 * t * t * t2 + p3 * t * t * t;
};
const cubicImage = (t)=>linear(t);
const cubicInsightElement = (t)=>cubicBezier(t, 0, 0.5, 0.5, 1);
const cubicMouse = (t)=>linear(t);
const linear = (t)=>t;
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
const ERROR_FRAME_CANCEL = 'frame cancel (this is an error on purpose)';
const frameKit = ()=>{
    let cancelFlag = false;
    return {
        frame: (callback)=>{
            if (cancelFlag) throw new Error(ERROR_FRAME_CANCEL);
            requestAnimationFrame(()=>{
                if (cancelFlag) throw new Error(ERROR_FRAME_CANCEL);
                callback(performance.now());
            });
        },
        timeout: (callback, ms)=>{
            if (cancelFlag) throw new Error(ERROR_FRAME_CANCEL);
            setTimeout(()=>{
                if (cancelFlag) throw new Error(ERROR_FRAME_CANCEL);
                callback();
            }, ms);
        },
        cancel: ()=>{
            cancelFlag = true;
        }
    };
};
const singleElementFadeInDuration = 80;
const LAYER_ORDER_IMG = 0;
const LAYER_ORDER_INSIGHT = 1;
const LAYER_ORDER_POINTER = 2;
const LAYER_ORDER_SPINNING_POINTER = 3;
const downloadReport = (content)=>{
    const blob = new Blob([
        content
    ], {
        type: 'text/html'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'midscene_report.html';
    a.click();
};
class RecordingSession {
    start() {
        const stream = this.canvas.captureStream(60);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm'
        });
        mediaRecorder.ondataavailable = (event)=>{
            if (event.data.size > 0) this.chunks.push(event.data);
        };
        this.mediaRecorder = mediaRecorder;
        this.recording = true;
        return this.mediaRecorder.start();
    }
    stop() {
        var _this_mediaRecorder;
        if (!this.recording || !this.mediaRecorder) return void console.warn('not recording');
        this.mediaRecorder.onstop = ()=>{
            const blob = new Blob(this.chunks, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'midscene_replay.webm';
            a.click();
            URL.revokeObjectURL(url);
        };
        null == (_this_mediaRecorder = this.mediaRecorder) || _this_mediaRecorder.stop();
        this.recording = false;
        this.mediaRecorder = null;
    }
    constructor(canvas){
        _define_property(this, "canvas", void 0);
        _define_property(this, "mediaRecorder", null);
        _define_property(this, "chunks", void 0);
        _define_property(this, "recording", false);
        this.canvas = canvas;
        this.chunks = [];
    }
}
function Player(props) {
    var _scripts_;
    const [titleText, setTitleText] = (0, external_react_namespaceObject.useState)('');
    const [subTitleText, setSubTitleText] = (0, external_react_namespaceObject.useState)('');
    const { autoZoom, setAutoZoom, elementsVisible, setElementsVisible } = (0, store_js_namespaceObject.useBlackboardPreference)();
    (0, external_react_namespaceObject.useEffect)(()=>{
        if ((null == props ? void 0 : props.autoZoom) !== void 0) setAutoZoom(props.autoZoom);
    }, [
        null == props ? void 0 : props.autoZoom,
        setAutoZoom
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if ((null == props ? void 0 : props.elementsVisible) !== void 0) setElementsVisible(props.elementsVisible);
    }, [
        null == props ? void 0 : props.elementsVisible,
        setElementsVisible
    ]);
    const scripts = null == props ? void 0 : props.replayScripts;
    const imageWidth = (null == props ? void 0 : props.imageWidth) || 1920;
    const imageHeight = (null == props ? void 0 : props.imageHeight) || 1080;
    const fitMode = (null == props ? void 0 : props.fitMode) || 'height';
    const currentImg = (0, external_react_namespaceObject.useRef)((null == scripts ? void 0 : null == (_scripts_ = scripts[0]) ? void 0 : _scripts_.img) || null);
    const divContainerRef = (0, external_react_namespaceObject.useRef)(null);
    const app = (0, external_react_namespaceObject.useMemo)(()=>new external_pixi_js_namespaceObject.Application(), []);
    const pointerSprite = (0, external_react_namespaceObject.useRef)(null);
    const spinningPointerSprite = (0, external_react_namespaceObject.useRef)(null);
    const [replayMark, setReplayMark] = (0, external_react_namespaceObject.useState)(0);
    const triggerReplay = ()=>{
        setReplayMark(Date.now());
    };
    const windowContentContainer = (0, external_react_namespaceObject.useMemo)(()=>{
        const container = new external_pixi_js_namespaceObject.Container();
        return container;
    }, []);
    const insightMarkContainer = (0, external_react_namespaceObject.useMemo)(()=>{
        const container = new external_pixi_js_namespaceObject.Container();
        container.zIndex = LAYER_ORDER_INSIGHT;
        return container;
    }, []);
    (0, external_react_namespaceObject.useEffect)(()=>{
        insightMarkContainer.visible = elementsVisible;
    }, [
        elementsVisible,
        insightMarkContainer
    ]);
    const basicCameraState = {
        left: 0,
        top: 0,
        width: imageWidth,
        pointerLeft: Math.round(imageWidth / 2),
        pointerTop: Math.round(imageHeight / 2)
    };
    const [animationProgress, setAnimationProgress] = (0, external_react_namespaceObject.useState)(-1);
    const cancelFlag = (0, external_react_namespaceObject.useRef)(false);
    (0, external_react_namespaceObject.useEffect)(()=>{
        cancelFlag.current = false;
        return ()=>{
            cancelFlag.current = true;
        };
    }, []);
    const cameraState = (0, external_react_namespaceObject.useRef)({
        ...basicCameraState
    });
    const resizeCanvasIfNeeded = async (newWidth, newHeight)=>{
        if (app.screen.width !== newWidth || app.screen.height !== newHeight) {
            app.renderer.resize(newWidth, newHeight);
            if (divContainerRef.current) {
                const aspectRatio = newWidth / newHeight;
                divContainerRef.current.style.setProperty('--canvas-aspect-ratio', aspectRatio.toString());
            }
            const newBasicCameraState = {
                left: 0,
                top: 0,
                width: newWidth,
                pointerLeft: Math.round(newWidth / 2),
                pointerTop: Math.round(newHeight / 2)
            };
            cameraState.current = newBasicCameraState;
        }
    };
    const repaintImage = async (scriptWidth, scriptHeight)=>{
        const imgToUpdate = currentImg.current;
        if (!imgToUpdate) return void console.warn('no image to update');
        const targetWidth = scriptWidth || imageWidth;
        const targetHeight = scriptHeight || imageHeight;
        await resizeCanvasIfNeeded(targetWidth, targetHeight);
        if (!(0, pixi_loader_js_namespaceObject.getTextureFromCache)(imgToUpdate)) {
            console.warn('image not loaded', imgToUpdate);
            await (0, pixi_loader_js_namespaceObject.loadTexture)(imgToUpdate);
        }
        const texture = (0, pixi_loader_js_namespaceObject.getTextureFromCache)(imgToUpdate);
        if (!texture) throw new Error('texture not found');
        const sprite = external_pixi_js_namespaceObject.Sprite.from(texture);
        if (!sprite) throw new Error('sprite not found');
        const mainImgLabel = 'main-img';
        const child = windowContentContainer.getChildByLabel(mainImgLabel);
        if (child) windowContentContainer.removeChild(child);
        sprite.label = mainImgLabel;
        sprite.zIndex = LAYER_ORDER_IMG;
        sprite.width = targetWidth;
        sprite.height = targetHeight;
        windowContentContainer.addChild(sprite);
    };
    const spinningPointer = (frame)=>{
        var _pointerSprite_current, _pointerSprite_current1;
        if (!spinningPointerSprite.current) {
            spinningPointerSprite.current = external_pixi_js_namespaceObject.Sprite.from(index_js_namespaceObject.mouseLoading);
            spinningPointerSprite.current.zIndex = LAYER_ORDER_SPINNING_POINTER;
            spinningPointerSprite.current.anchor.set(0.5, 0.5);
            spinningPointerSprite.current.scale.set(0.5);
            spinningPointerSprite.current.label = 'spinning-pointer';
        }
        spinningPointerSprite.current.x = (null == (_pointerSprite_current = pointerSprite.current) ? void 0 : _pointerSprite_current.x) || 0;
        spinningPointerSprite.current.y = (null == (_pointerSprite_current1 = pointerSprite.current) ? void 0 : _pointerSprite_current1.y) || 0;
        windowContentContainer.addChild(spinningPointerSprite.current);
        let startTime;
        let isCancelled = false;
        const animate = (currentTime)=>{
            if (isCancelled) return;
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = (Math.sin(elapsedTime / 500 - Math.PI / 2) + 1) / 2;
            const rotation = progress * Math.PI * 2;
            if (spinningPointerSprite.current) spinningPointerSprite.current.rotation = rotation;
            frame(animate);
        };
        frame(animate);
        const stopFn = ()=>{
            if (spinningPointerSprite.current) windowContentContainer.removeChild(spinningPointerSprite.current);
            isCancelled = true;
        };
        return stopFn;
    };
    const updatePointer = async (img, x, y)=>{
        var _pointerSprite_current, _pointerSprite_current1;
        if (!(0, pixi_loader_js_namespaceObject.getTextureFromCache)(img)) {
            console.warn('image not loaded', img);
            await (0, pixi_loader_js_namespaceObject.loadTexture)(img);
        }
        const texture = (0, pixi_loader_js_namespaceObject.getTextureFromCache)(img);
        if (!texture) throw new Error('texture not found');
        const sprite = external_pixi_js_namespaceObject.Sprite.from(texture);
        let targetX = null == (_pointerSprite_current = pointerSprite.current) ? void 0 : _pointerSprite_current.x;
        let targetY = null == (_pointerSprite_current1 = pointerSprite.current) ? void 0 : _pointerSprite_current1.y;
        if ('number' == typeof x) targetX = x;
        if ('number' == typeof y) targetY = y;
        if (void 0 === targetX || void 0 === targetY) return void console.warn('invalid pointer position', x, y);
        if (pointerSprite.current) {
            const pointer = windowContentContainer.getChildByLabel('pointer');
            if (pointer) windowContentContainer.removeChild(pointer);
        }
        pointerSprite.current = sprite;
        pointerSprite.current.x = targetX;
        pointerSprite.current.y = targetY;
        pointerSprite.current.label = 'pointer';
        pointerSprite.current.zIndex = LAYER_ORDER_POINTER;
        windowContentContainer.addChild(pointerSprite.current);
    };
    const updateCamera = (state, currentWidth)=>{
        cameraState.current = state;
        const effectiveWidth = currentWidth || app.screen.width || imageWidth;
        const newScale = autoZoom ? Math.max(1, effectiveWidth / state.width) : 1;
        windowContentContainer.scale.set(newScale);
        windowContentContainer.x = autoZoom ? Math.round(canvasPaddingLeft - state.left * newScale) : canvasPaddingLeft;
        windowContentContainer.y = autoZoom ? Math.round(canvasPaddingTop - state.top * newScale) : canvasPaddingTop;
        const pointer = windowContentContainer.getChildByLabel('pointer');
        if (pointer) {
            pointer.scale.set(1 / newScale);
            if ('number' == typeof state.pointerLeft && 'number' == typeof state.pointerTop) {
                pointer.x = state.pointerLeft;
                pointer.y = state.pointerTop;
            }
        }
    };
    const cameraAnimation = async (targetState, duration, frame)=>{
        const currentCanvasWidth = app.screen.width || imageWidth;
        const currentCanvasHeight = app.screen.height || imageHeight;
        if (!autoZoom) {
            const currentState = {
                ...cameraState.current
            };
            const startPointerLeft = currentState.pointerLeft;
            const startPointerTop = currentState.pointerTop;
            const startTime = performance.now();
            const shouldMovePointer = 'number' == typeof targetState.pointerLeft && 'number' == typeof targetState.pointerTop && (targetState.pointerLeft !== startPointerLeft || targetState.pointerTop !== startPointerTop);
            if (!shouldMovePointer) return;
            await new Promise((resolve)=>{
                const animate = (currentTime)=>{
                    const elapsedTime = currentTime - startTime;
                    const rawProgress = Math.min(elapsedTime / duration, 1);
                    const progress = cubicMouse(rawProgress);
                    const nextState = {
                        ...currentState,
                        pointerLeft: startPointerLeft + (targetState.pointerLeft - startPointerLeft) * progress,
                        pointerTop: startPointerTop + (targetState.pointerTop - startPointerTop) * progress
                    };
                    updateCamera(nextState, currentCanvasWidth);
                    if (elapsedTime < duration) frame(animate);
                    else resolve();
                };
                frame(animate);
            });
            return;
        }
        const currentState = {
            ...cameraState.current
        };
        const startLeft = currentState.left;
        const startTop = currentState.top;
        const startPointerLeft = currentState.pointerLeft;
        const startPointerTop = currentState.pointerTop;
        const startScale = currentState.width / currentCanvasWidth;
        const startTime = performance.now();
        const shouldMovePointer = 'number' == typeof targetState.pointerLeft && 'number' == typeof targetState.pointerTop && (targetState.pointerLeft !== startPointerLeft || targetState.pointerTop !== startPointerTop);
        const pointerMoveDuration = shouldMovePointer ? 0.375 * duration : 0;
        const cameraMoveStart = pointerMoveDuration;
        const cameraMoveDuration = duration - pointerMoveDuration;
        await new Promise((resolve)=>{
            const animate = (currentTime)=>{
                const nextState = {
                    ...cameraState.current
                };
                const elapsedTime = currentTime - startTime;
                if (shouldMovePointer) if (elapsedTime <= pointerMoveDuration) {
                    const rawMouseProgress = Math.min(elapsedTime / pointerMoveDuration, 1);
                    const mouseProgress = cubicMouse(rawMouseProgress);
                    nextState.pointerLeft = startPointerLeft + (targetState.pointerLeft - startPointerLeft) * mouseProgress;
                    nextState.pointerTop = startPointerTop + (targetState.pointerTop - startPointerTop) * mouseProgress;
                } else {
                    nextState.pointerLeft = targetState.pointerLeft;
                    nextState.pointerTop = targetState.pointerTop;
                }
                if (elapsedTime > cameraMoveStart) {
                    const cameraElapsedTime = elapsedTime - cameraMoveStart;
                    const rawCameraProgress = Math.min(cameraElapsedTime / cameraMoveDuration, 1);
                    const cameraProgress = cubicImage(rawCameraProgress);
                    const targetScale = targetState.width / currentCanvasWidth;
                    const progressScale = startScale + (targetScale - startScale) * cameraProgress;
                    const progressWidth = currentCanvasWidth * progressScale;
                    const progressHeight = currentCanvasHeight * progressScale;
                    nextState.width = progressWidth;
                    const progressLeft = startLeft + (targetState.left - startLeft) * cameraProgress;
                    const progressTop = startTop + (targetState.top - startTop) * cameraProgress;
                    const horizontalExceed = progressLeft + progressWidth - currentCanvasWidth;
                    const verticalExceed = progressTop + progressHeight - currentCanvasHeight;
                    nextState.left = horizontalExceed > 0 ? progressLeft + horizontalExceed : progressLeft;
                    nextState.top = verticalExceed > 0 ? progressTop + verticalExceed : progressTop;
                }
                updateCamera(nextState, currentCanvasWidth);
                if (elapsedTime < duration) frame(animate);
                else resolve();
            };
            frame(animate);
        });
    };
    const fadeInGraphics = function(graphics, duration, frame) {
        let targetAlpha = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
        return new Promise((resolve)=>{
            const startTime = performance.now();
            const animate = (currentTime)=>{
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                graphics.alpha = 0 === targetAlpha ? 1 - linear(progress) : linear(progress);
                if (elapsedTime < duration) frame(animate);
                else resolve();
            };
            frame(animate);
        });
    };
    const fadeOutItem = async (graphics, duration, frame)=>fadeInGraphics(graphics, duration, frame, 0);
    const insightElementsAnimation = async (elements, highlightElements, searchArea, duration, frame)=>{
        insightMarkContainer.removeChildren();
        const elementsToAdd = [
            ...elements
        ];
        const totalLength = elementsToAdd.length;
        let childrenCount = 0;
        await new Promise((resolve)=>{
            const startTime = performance.now();
            const animate = (currentTime)=>{
                const elapsedTime = currentTime - startTime;
                const progress = cubicInsightElement(Math.min(elapsedTime / duration, 1));
                const elementsToAddNow = Math.floor(progress * totalLength);
                while(childrenCount < elementsToAddNow){
                    const randomIndex = Math.floor(Math.random() * elementsToAdd.length);
                    const element = elementsToAdd.splice(randomIndex, 1)[0];
                    if (element) {
                        const [insightMarkGraphic] = (0, external_blackboard_index_js_namespaceObject.rectMarkForItem)(element.rect, element.content, 'element');
                        insightMarkGraphic.alpha = 0;
                        insightMarkContainer.addChild(insightMarkGraphic);
                        childrenCount++;
                        fadeInGraphics(insightMarkGraphic, singleElementFadeInDuration, frame);
                    }
                }
                if (elapsedTime < duration) frame(animate);
                else {
                    while(elementsToAdd.length > 0){
                        const randomIndex = Math.floor(Math.random() * elementsToAdd.length);
                        const element = elementsToAdd.splice(randomIndex, 1)[0];
                        const [insightMarkGraphic] = (0, external_blackboard_index_js_namespaceObject.rectMarkForItem)(element.rect, element.content, 'element');
                        insightMarkGraphic.alpha = 1;
                        insightMarkContainer.addChild(insightMarkGraphic);
                    }
                    if (searchArea) {
                        const [searchAreaGraphic] = (0, external_blackboard_index_js_namespaceObject.rectMarkForItem)(searchArea, 'Search Area', 'searchArea');
                        searchAreaGraphic.alpha = 1;
                        insightMarkContainer.addChild(searchAreaGraphic);
                    }
                    highlightElements.map((element)=>{
                        const [insightMarkGraphic] = (0, external_blackboard_index_js_namespaceObject.rectMarkForItem)(element.rect, element.content || '', 'highlight');
                        insightMarkGraphic.alpha = 1;
                        insightMarkContainer.addChild(insightMarkGraphic);
                    });
                    resolve();
                }
            };
            frame(animate);
        });
    };
    const init = async ()=>{
        if (!divContainerRef.current || !scripts) return;
        await app.init({
            width: imageWidth,
            height: imageHeight,
            background: 0xf4f4f4,
            autoDensity: true,
            antialias: true
        });
        if (!divContainerRef.current) return;
        divContainerRef.current.appendChild(app.canvas);
        windowContentContainer.x = 0;
        windowContentContainer.y = 0;
        app.stage.addChild(windowContentContainer);
        insightMarkContainer.x = 0;
        insightMarkContainer.y = 0;
        windowContentContainer.addChild(insightMarkContainer);
    };
    const [isRecording, setIsRecording] = (0, external_react_namespaceObject.useState)(false);
    const recorderSessionRef = (0, external_react_namespaceObject.useRef)(null);
    const handleExport = ()=>{
        if (recorderSessionRef.current) return void console.warn('recorderSession exists');
        if (!app.canvas) return void console.warn('canvas is not initialized');
        recorderSessionRef.current = new RecordingSession(app.canvas);
        setIsRecording(true);
        triggerReplay();
    };
    const play = ()=>{
        let cancelFn;
        Promise.resolve((async ()=>{
            if (!app) throw new Error('app is not initialized');
            if (!scripts) throw new Error("scripts is required");
            const { frame, cancel, timeout } = frameKit();
            cancelFn = cancel;
            const allImages = scripts.filter((item)=>!!item.img).map((item)=>item.img);
            await Promise.all([
                ...allImages,
                index_js_namespaceObject.mouseLoading,
                index_js_namespaceObject.mousePointer
            ].map(pixi_loader_js_namespaceObject.loadTexture));
            insightMarkContainer.removeChildren();
            await updatePointer(index_js_namespaceObject.mousePointer, imageWidth / 2, imageHeight / 2);
            await repaintImage();
            await updateCamera({
                ...basicCameraState
            });
            const totalDuration = scripts.reduce((acc, item)=>acc + item.duration + (item.camera && item.insightCameraDuration ? item.insightCameraDuration : 0), 0);
            const progressUpdateInterval = 200;
            const startTime = performance.now();
            setAnimationProgress(0);
            const updateProgress = ()=>{
                const progress = Math.min((performance.now() - startTime) / totalDuration, 1);
                setAnimationProgress(progress);
                if (progress < 1) return timeout(updateProgress, progressUpdateInterval);
            };
            frame(updateProgress);
            if (recorderSessionRef.current) recorderSessionRef.current.start();
            for(const index in scripts){
                const item = scripts[index];
                setTitleText(item.title || '');
                setSubTitleText(item.subTitle || '');
                if ('sleep' === item.type) await sleep(item.duration);
                else if ('insight' === item.type) {
                    var _item_context;
                    if (!item.img) throw new Error('img is required');
                    currentImg.current = item.img;
                    await repaintImage(item.imageWidth, item.imageHeight);
                    const elements = (null == (_item_context = item.context) ? void 0 : _item_context.tree) ? (0, extractor_namespaceObject.treeToList)(item.context.tree) : [];
                    const highlightElements = item.highlightElement ? [
                        item.highlightElement
                    ] : [];
                    await insightElementsAnimation(elements, highlightElements, item.searchArea, item.duration, frame);
                    if (item.camera) {
                        if (!item.insightCameraDuration) throw new Error('insightCameraDuration is required');
                        await cameraAnimation(item.camera, item.insightCameraDuration, frame);
                    }
                } else if ('clear-insight' === item.type) {
                    await fadeOutItem(insightMarkContainer, item.duration, frame);
                    insightMarkContainer.removeChildren();
                    insightMarkContainer.alpha = 1;
                } else if ('img' === item.type) {
                    if (item.img && item.img !== currentImg.current) {
                        currentImg.current = item.img;
                        await repaintImage(item.imageWidth, item.imageHeight);
                    }
                    if (item.camera) await cameraAnimation(item.camera, item.duration, frame);
                    else await sleep(item.duration);
                } else if ('pointer' === item.type) {
                    if (!item.img) throw new Error('pointer img is required');
                    await updatePointer(item.img);
                } else if ('spinning-pointer' === item.type) {
                    const stop = spinningPointer(frame);
                    await sleep(item.duration);
                    stop();
                }
            }
            if (recorderSessionRef.current) {
                await sleep(1200);
                recorderSessionRef.current.stop();
                recorderSessionRef.current = null;
                setIsRecording(false);
            }
        })().catch((e)=>{
            console.error('player error', e);
        }));
        return ()=>{
            null == cancelFn || cancelFn();
        };
    };
    (0, external_react_namespaceObject.useEffect)(()=>{
        Promise.resolve((async ()=>{
            await init();
            if (divContainerRef.current && imageWidth && imageHeight) {
                const aspectRatio = imageWidth / imageHeight;
                divContainerRef.current.style.setProperty('--canvas-aspect-ratio', aspectRatio.toString());
                divContainerRef.current.setAttribute('data-fit-mode', fitMode);
                const playerContainer = divContainerRef.current.closest('.player-container');
                if (playerContainer) playerContainer.setAttribute('data-fit-mode', fitMode);
            }
            triggerReplay();
        })());
        return ()=>{
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
        imageWidth,
        imageHeight,
        fitMode
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (replayMark) return play();
    }, [
        replayMark
    ]);
    const [mouseOverStatusIcon, setMouseOverStatusIcon] = (0, external_react_namespaceObject.useState)(false);
    const [mouseOverSettingsIcon, setMouseOverSettingsIcon] = (0, external_react_namespaceObject.useState)(false);
    const progressString = Math.round(100 * animationProgress);
    const transitionStyle = 0 === animationProgress ? 'none' : '0.3s';
    const canReplayNow = 1 === animationProgress;
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (canReplayNow) {
            const listener = (event)=>{
                if (' ' === event.key) triggerReplay();
            };
            window.addEventListener('keydown', listener);
            return ()=>{
                window.removeEventListener('keydown', listener);
            };
        }
    }, [
        canReplayNow
    ]);
    let statusIconElement;
    let statusOnClick = ()=>{};
    if (animationProgress < 1) statusIconElement = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Spin, {
        indicator: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.LoadingOutlined, {
            spin: true,
            color: "#333"
        }),
        size: "default"
    });
    else if (mouseOverStatusIcon) {
        statusIconElement = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Spin, {
            indicator: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.CaretRightOutlined, {
                color: "#333"
            }),
            size: "default"
        });
        statusOnClick = ()=>triggerReplay();
    } else statusIconElement = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Spin, {
        indicator: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.CaretRightOutlined, {
            color: "#333"
        }),
        size: "default"
    });
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
        className: "player-container",
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "canvas-container",
                ref: divContainerRef
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "player-timeline-wrapper",
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "player-timeline",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                        className: "player-timeline-progress",
                        style: {
                            width: `${progressString}%`,
                            transition: transitionStyle
                        }
                    })
                })
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                className: "player-tools-wrapper",
                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "player-tools",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                        className: "player-control",
                        children: [
                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                className: "status-text",
                                children: [
                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                        className: "title",
                                        children: titleText
                                    }),
                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Tooltip, {
                                        title: subTitleText,
                                        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                            className: "subtitle",
                                            children: subTitleText
                                        })
                                    })
                                ]
                            }),
                            isRecording ? null : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                className: "status-icon",
                                onMouseEnter: ()=>setMouseOverStatusIcon(true),
                                onMouseLeave: ()=>setMouseOverStatusIcon(false),
                                onClick: statusOnClick,
                                children: statusIconElement
                            }),
                            (null == props ? void 0 : props.reportFileContent) ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Tooltip, {
                                title: "Download Report",
                                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                    className: "status-icon",
                                    onMouseEnter: ()=>setMouseOverStatusIcon(true),
                                    onMouseLeave: ()=>setMouseOverStatusIcon(false),
                                    onClick: ()=>downloadReport(props.reportFileContent),
                                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.DownloadOutlined, {
                                        color: "#333"
                                    })
                                })
                            }) : null,
                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Tooltip, {
                                title: isRecording ? 'Generating...' : 'Export Video',
                                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                    className: "status-icon",
                                    onClick: isRecording ? void 0 : handleExport,
                                    style: {
                                        opacity: isRecording ? 0.5 : 1,
                                        cursor: isRecording ? 'not-allowed' : 'pointer'
                                    },
                                    children: isRecording ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Spin, {
                                        size: "default",
                                        percent: progressString
                                    }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.ExportOutlined, {})
                                })
                            }),
                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Dropdown, {
                                trigger: [
                                    'hover',
                                    'click'
                                ],
                                placement: "bottomRight",
                                overlayStyle: {
                                    minWidth: '148px'
                                },
                                dropdownRender: (menu)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                        style: {
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.08)',
                                            backgroundColor: '#fff',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                            overflow: 'hidden'
                                        },
                                        children: menu
                                    }),
                                menu: {
                                    style: {
                                        borderRadius: '8px',
                                        padding: 0
                                    },
                                    items: [
                                        {
                                            key: 'autoZoom',
                                            style: {
                                                height: '39px',
                                                margin: 0,
                                                padding: '0 12px'
                                            },
                                            label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    height: '39px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(global_perspective_js_default(), {
                                                                style: {
                                                                    width: '16px',
                                                                    height: '16px'
                                                                }
                                                            }),
                                                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                                style: {
                                                                    fontSize: '12px',
                                                                    marginRight: '16px'
                                                                },
                                                                children: "Focus on cursor"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Switch, {
                                                        size: "small",
                                                        checked: autoZoom,
                                                        onChange: (checked)=>{
                                                            setAutoZoom(checked);
                                                            triggerReplay();
                                                        },
                                                        onClick: (_, e)=>{
                                                            var _e_stopPropagation;
                                                            return null == e ? void 0 : null == (_e_stopPropagation = e.stopPropagation) ? void 0 : _e_stopPropagation.call(e);
                                                        }
                                                    })
                                                ]
                                            })
                                        },
                                        {
                                            key: 'elementsVisible',
                                            style: {
                                                height: '39px',
                                                margin: 0,
                                                padding: '0 12px'
                                            },
                                            label: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    height: '39px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(show_marker_js_default(), {
                                                                style: {
                                                                    width: '16px',
                                                                    height: '16px'
                                                                }
                                                            }),
                                                            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                                style: {
                                                                    fontSize: '12px',
                                                                    marginRight: '16px'
                                                                },
                                                                children: "Show element markers"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Switch, {
                                                        size: "small",
                                                        checked: elementsVisible,
                                                        onChange: (checked)=>{
                                                            setElementsVisible(checked);
                                                            triggerReplay();
                                                        },
                                                        onClick: (_, e)=>{
                                                            var _e_stopPropagation;
                                                            return null == e ? void 0 : null == (_e_stopPropagation = e.stopPropagation) ? void 0 : _e_stopPropagation.call(e);
                                                        }
                                                    })
                                                ]
                                            })
                                        }
                                    ]
                                },
                                children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                    className: "status-icon",
                                    onMouseEnter: ()=>setMouseOverSettingsIcon(true),
                                    onMouseLeave: ()=>setMouseOverSettingsIcon(false),
                                    style: {
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: mouseOverSettingsIcon ? 1 : 0.7,
                                        transition: 'opacity 0.2s'
                                    },
                                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(player_setting_js_default(), {
                                        style: {
                                            width: '16px',
                                            height: '16px'
                                        }
                                    })
                                })
                            })
                        ]
                    })
                })
            })
        ]
    });
}
exports.Player = __webpack_exports__.Player;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "Player"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
