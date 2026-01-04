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
    cameraStateForRect: ()=>cameraStateForRect,
    mergeTwoCameraState: ()=>mergeTwoCameraState,
    generateAnimationScripts: ()=>generateAnimationScripts,
    allScriptsFromDump: ()=>allScriptsFromDump
});
const external_index_js_namespaceObject = require("./index.js");
const agent_namespaceObject = require("@sqaitech/core/agent");
const extractor_namespaceObject = require("@sqaitech/shared/extractor");
const stillDuration = 900;
const actionSpinningPointerDuration = 300;
const stillAfterInsightDuration = 300;
const locateDuration = 800;
const actionDuration = 1000;
const clearInsightDuration = 200;
const cameraStateForRect = (rect, imageWidth, imageHeight)=>{
    const canvasRatio = imageWidth / imageHeight;
    const rectRatio = rect.width / rect.height;
    let rectWidthOnPage;
    rectWidthOnPage = rectRatio >= canvasRatio ? rect.width : rect.height / imageHeight * imageWidth;
    const cameraPaddingRatio = rectWidthOnPage > 400 ? 0.1 : rectWidthOnPage > 50 ? 0.2 : 0.3;
    const cameraWidth = Math.min(imageWidth, rectWidthOnPage + imageWidth * cameraPaddingRatio * 2);
    const cameraHeight = imageHeight / imageWidth * cameraWidth;
    let left = Math.min(rect.left - imageWidth * cameraPaddingRatio, imageWidth - cameraWidth);
    left = Math.max(left, 0);
    let top = Math.min(rect.top - imageHeight * cameraPaddingRatio, imageHeight - cameraHeight);
    top = Math.max(top, 0);
    return {
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(cameraWidth)
    };
};
const mergeTwoCameraState = (cameraState1, cameraState2)=>{
    const newLeft = Math.min(cameraState1.left, cameraState2.left);
    const newTop = Math.min(cameraState1.top, cameraState2.top);
    const newRight = Math.max(cameraState1.left + cameraState1.width, cameraState2.left + cameraState2.width);
    const newWidth = newRight - newLeft;
    return {
        left: newLeft,
        top: newTop,
        width: newWidth
    };
};
const capitalizeFirstLetter = (str)=>{
    if ('string' != typeof str || 0 === str.length) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const allScriptsFromDump = (dump)=>{
    const dimensionsSet = new Set();
    let firstWidth;
    let firstHeight;
    const sdkVersion = dump.sdkVersion;
    const modelBriefsSet = new Set();
    dump.executions.forEach((execution)=>{
        execution.tasks.forEach((task)=>{
            var _task_uiContext_size, _task_uiContext;
            if (null == (_task_uiContext = task.uiContext) ? void 0 : null == (_task_uiContext_size = _task_uiContext.size) ? void 0 : _task_uiContext_size.width) {
                const w = task.uiContext.size.width;
                const h = task.uiContext.size.height;
                if (!firstWidth) {
                    firstWidth = w;
                    firstHeight = h;
                }
                dimensionsSet.add(`${w}x${h}`);
            }
        });
    });
    if (!firstWidth || !firstHeight) {
        console.warn('width or height is missing in dump file');
        return {
            scripts: [],
            sdkVersion,
            modelBriefs: []
        };
    }
    const allScripts = [];
    dump.executions.forEach((execution)=>{
        const scripts = generateAnimationScripts(execution, -1, firstWidth, firstHeight);
        if (scripts) allScripts.push(...scripts);
        execution.tasks.forEach((task)=>{
            if (task.usage) {
                const { model_name, model_description, intent } = task.usage;
                if (intent && model_name) modelBriefsSet.add(model_description ? `${capitalizeFirstLetter(intent)}/${model_name}(${model_description})` : model_name);
            }
        });
    });
    const allScriptsWithoutIntermediateDoneFrame = allScripts.filter((script, index)=>{
        if (index !== allScripts.length - 1 && 'Done' === script.title) return false;
        return true;
    });
    const modelBriefs = (()=>{
        var _list_;
        const list = [
            ...modelBriefsSet
        ];
        if (!list.length) return list;
        const firstOneInfo = null == (_list_ = list[0]) ? void 0 : _list_.split('/', 2)[1];
        if (firstOneInfo && list.slice(1).every((item)=>(null == item ? void 0 : item.split('/', 2)[1]) === firstOneInfo)) return [
            firstOneInfo
        ];
        return list;
    })();
    return {
        scripts: allScriptsWithoutIntermediateDoneFrame,
        width: firstWidth,
        height: firstHeight,
        sdkVersion,
        modelBriefs
    };
};
const generateAnimationScripts = (execution, task, imageWidth, imageHeight)=>{
    if (!execution || !execution.tasks.length) return null;
    if (0 === imageWidth || 0 === imageHeight) return null;
    let tasksIncluded = [];
    if (-1 === task) tasksIncluded = execution.tasks;
    else {
        const startIndex = execution.tasks.findIndex((t)=>t === task);
        if (-1 === startIndex) {
            console.error("task not found, cannot generate animation scripts");
            return null;
        }
        if (startIndex === execution.tasks.length - 1) return null;
        for(let i = startIndex; i < execution.tasks.length; i++){
            if (i > startIndex && 'Planning' === execution.tasks[i].type) break;
            tasksIncluded.push(execution.tasks[i]);
        }
    }
    if (0 === tasksIncluded.length) return null;
    const fullPageCameraState = cameraStateForRect({
        left: 0,
        top: 0,
        width: imageWidth,
        height: imageHeight
    }, imageWidth, imageHeight);
    const pointerScript = (img, title, subTitle)=>({
            type: 'pointer',
            img,
            duration: 0,
            title,
            subTitle
        });
    const scripts = [];
    let insightCameraState;
    let currentCameraState = fullPageCameraState;
    let insightOnTop = false;
    const taskCount = tasksIncluded.length;
    let initSubTitle = '';
    let errorStateFlag = false;
    tasksIncluded.forEach((task, index)=>{
        if (errorStateFlag) return;
        if (0 === index) initSubTitle = (0, agent_namespaceObject.paramStr)(task);
        if ('Planning' === task.type) {
            const planningTask = task;
            if (planningTask.recorder && planningTask.recorder.length > 0) {
                var _planningTask_recorder_, _planningTask_recorder, _task_uiContext_size, _task_uiContext, _task_uiContext_size1, _task_uiContext1;
                scripts.push({
                    type: 'img',
                    img: null == (_planningTask_recorder = planningTask.recorder) ? void 0 : null == (_planningTask_recorder_ = _planningTask_recorder[0]) ? void 0 : _planningTask_recorder_.screenshot,
                    camera: 0 === index ? fullPageCameraState : void 0,
                    duration: stillDuration,
                    title: (0, agent_namespaceObject.typeStr)(task),
                    subTitle: (0, agent_namespaceObject.paramStr)(task),
                    imageWidth: (null == (_task_uiContext = task.uiContext) ? void 0 : null == (_task_uiContext_size = _task_uiContext.size) ? void 0 : _task_uiContext_size.width) || imageWidth,
                    imageHeight: (null == (_task_uiContext1 = task.uiContext) ? void 0 : null == (_task_uiContext_size1 = _task_uiContext1.size) ? void 0 : _task_uiContext_size1.height) || imageHeight
                });
            }
        } else if ('Insight' === task.type && 'Locate' === task.subType) {
            var _insightTask_output;
            const insightTask = task;
            const resultElement = null == (_insightTask_output = insightTask.output) ? void 0 : _insightTask_output.element;
            const title = (0, agent_namespaceObject.typeStr)(task);
            const subTitle = (0, agent_namespaceObject.paramStr)(task);
            if (null == resultElement ? void 0 : resultElement.rect) insightCameraState = {
                ...cameraStateForRect(resultElement.rect, imageWidth, imageHeight),
                pointerLeft: resultElement.center[0],
                pointerTop: resultElement.center[1]
            };
            const context = insightTask.uiContext;
            if (null == context ? void 0 : context.screenshotBase64) {
                var _insightTask_output1, _insightDump_taskInfo, _context_size, _context_size1;
                const insightDump = insightTask.log;
                const insightContentLength = context.tree ? (0, extractor_namespaceObject.treeToList)(context.tree).length : 0;
                if (context.screenshotBase64) {
                    var _context_size2, _context_size3;
                    scripts.push({
                        type: 'img',
                        img: context.screenshotBase64,
                        duration: stillAfterInsightDuration,
                        title,
                        subTitle,
                        imageWidth: (null == (_context_size2 = context.size) ? void 0 : _context_size2.width) || imageWidth,
                        imageHeight: (null == (_context_size3 = context.size) ? void 0 : _context_size3.height) || imageHeight
                    });
                }
                let cameraState;
                cameraState = currentCameraState === fullPageCameraState ? void 0 : insightCameraState ? mergeTwoCameraState(currentCameraState, insightCameraState) : void 0;
                scripts.push({
                    type: 'insight',
                    img: context.screenshotBase64,
                    context: context,
                    camera: cameraState,
                    highlightElement: (null == (_insightTask_output1 = insightTask.output) ? void 0 : _insightTask_output1.element) || void 0,
                    searchArea: null == insightDump ? void 0 : null == (_insightDump_taskInfo = insightDump.taskInfo) ? void 0 : _insightDump_taskInfo.searchArea,
                    duration: insightContentLength > 20 ? locateDuration : 0.5 * locateDuration,
                    insightCameraDuration: locateDuration,
                    title,
                    subTitle,
                    imageWidth: (null == (_context_size = context.size) ? void 0 : _context_size.width) || imageWidth,
                    imageHeight: (null == (_context_size1 = context.size) ? void 0 : _context_size1.height) || imageHeight
                });
                scripts.push({
                    type: 'sleep',
                    duration: stillAfterInsightDuration,
                    title,
                    subTitle
                });
                insightOnTop = true;
            }
        } else if ('Action' === task.type && 'FalsyConditionStatement' !== task.subType) {
            var _task_recorder_, _task_recorder, _task_uiContext_size2, _task_uiContext2, _task_uiContext_size3, _task_uiContext3, _task_recorder_1, _task_recorder1;
            const title = (0, agent_namespaceObject.typeStr)(task);
            const subTitle = (0, agent_namespaceObject.paramStr)(task);
            scripts.push(pointerScript(external_index_js_namespaceObject.mousePointer, title, subTitle));
            currentCameraState = null != insightCameraState ? insightCameraState : fullPageCameraState;
            scripts.push({
                type: 'img',
                img: null == (_task_recorder = task.recorder) ? void 0 : null == (_task_recorder_ = _task_recorder[0]) ? void 0 : _task_recorder_.screenshot,
                duration: actionDuration,
                camera: 'Sleep' === task.subType ? fullPageCameraState : insightCameraState,
                title,
                subTitle,
                imageWidth: (null == (_task_uiContext2 = task.uiContext) ? void 0 : null == (_task_uiContext_size2 = _task_uiContext2.size) ? void 0 : _task_uiContext_size2.width) || imageWidth,
                imageHeight: (null == (_task_uiContext3 = task.uiContext) ? void 0 : null == (_task_uiContext_size3 = _task_uiContext3.size) ? void 0 : _task_uiContext_size3.height) || imageHeight
            });
            if (insightOnTop) {
                scripts.push({
                    type: 'clear-insight',
                    duration: clearInsightDuration,
                    title,
                    subTitle
                });
                insightOnTop = false;
            }
            const imgStillDuration = index < taskCount - 1 ? stillDuration : 0;
            if (null == (_task_recorder1 = task.recorder) ? void 0 : null == (_task_recorder_1 = _task_recorder1[1]) ? void 0 : _task_recorder_1.screenshot) {
                var _task_recorder_2, _task_recorder2, _task_uiContext_size4, _task_uiContext4, _task_uiContext_size5, _task_uiContext5;
                scripts.push({
                    type: 'spinning-pointer',
                    duration: actionSpinningPointerDuration,
                    title,
                    subTitle
                });
                scripts.push(pointerScript(external_index_js_namespaceObject.mousePointer, title, subTitle));
                scripts.push({
                    type: 'img',
                    img: null == (_task_recorder2 = task.recorder) ? void 0 : null == (_task_recorder_2 = _task_recorder2[1]) ? void 0 : _task_recorder_2.screenshot,
                    duration: imgStillDuration,
                    title,
                    subTitle,
                    imageWidth: (null == (_task_uiContext4 = task.uiContext) ? void 0 : null == (_task_uiContext_size4 = _task_uiContext4.size) ? void 0 : _task_uiContext_size4.width) || imageWidth,
                    imageHeight: (null == (_task_uiContext5 = task.uiContext) ? void 0 : null == (_task_uiContext_size5 = _task_uiContext5.size) ? void 0 : _task_uiContext_size5.height) || imageHeight
                });
            } else scripts.push({
                type: 'sleep',
                duration: imgStillDuration,
                title,
                subTitle
            });
        } else {
            var _task_recorder_3, _task_recorder3;
            const title = (0, agent_namespaceObject.typeStr)(task);
            const subTitle = (0, agent_namespaceObject.paramStr)(task);
            const screenshot = null == (_task_recorder3 = task.recorder) ? void 0 : null == (_task_recorder_3 = _task_recorder3[task.recorder.length - 1]) ? void 0 : _task_recorder_3.screenshot;
            if (screenshot) {
                var _task_uiContext_size6, _task_uiContext6, _task_uiContext_size7, _task_uiContext7;
                scripts.push({
                    type: 'img',
                    img: screenshot,
                    duration: stillDuration,
                    camera: fullPageCameraState,
                    title,
                    subTitle,
                    imageWidth: (null == (_task_uiContext6 = task.uiContext) ? void 0 : null == (_task_uiContext_size6 = _task_uiContext6.size) ? void 0 : _task_uiContext_size6.width) || imageWidth,
                    imageHeight: (null == (_task_uiContext7 = task.uiContext) ? void 0 : null == (_task_uiContext_size7 = _task_uiContext7.size) ? void 0 : _task_uiContext_size7.height) || imageHeight
                });
            }
        }
        if ('finished' !== task.status) {
            var _task_uiContext_size8, _task_uiContext8, _task_uiContext_size9, _task_uiContext9;
            errorStateFlag = true;
            const errorTitle = (0, agent_namespaceObject.typeStr)(task);
            const errorMsg = task.errorMessage || 'unknown error';
            const errorSubTitle = errorMsg.indexOf('NOT_IMPLEMENTED_AS_DESIGNED') > 0 ? 'Further actions cannot be performed in the current environment' : errorMsg;
            scripts.push({
                type: 'img',
                img: task.recorder && task.recorder.length > 0 ? task.recorder[task.recorder.length - 1].screenshot : '',
                camera: fullPageCameraState,
                duration: stillDuration,
                title: errorTitle,
                subTitle: errorSubTitle,
                imageWidth: (null == (_task_uiContext8 = task.uiContext) ? void 0 : null == (_task_uiContext_size8 = _task_uiContext8.size) ? void 0 : _task_uiContext_size8.width) || imageWidth,
                imageHeight: (null == (_task_uiContext9 = task.uiContext) ? void 0 : null == (_task_uiContext_size9 = _task_uiContext9.size) ? void 0 : _task_uiContext_size9.height) || imageHeight
            });
            return;
        }
    });
    if (!errorStateFlag) scripts.push({
        title: 'Done',
        subTitle: initSubTitle,
        type: 'img',
        duration: stillDuration,
        camera: fullPageCameraState
    });
    return scripts;
};
exports.allScriptsFromDump = __webpack_exports__.allScriptsFromDump;
exports.cameraStateForRect = __webpack_exports__.cameraStateForRect;
exports.generateAnimationScripts = __webpack_exports__.generateAnimationScripts;
exports.mergeTwoCameraState = __webpack_exports__.mergeTwoCameraState;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "allScriptsFromDump",
    "cameraStateForRect",
    "generateAnimationScripts",
    "mergeTwoCameraState"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
