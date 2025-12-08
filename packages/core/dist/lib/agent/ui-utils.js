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
    locateParamStr: ()=>locateParamStr,
    paramStr: ()=>paramStr,
    pullParamStr: ()=>pullParamStr,
    scrollParamStr: ()=>scrollParamStr,
    taskTitleStr: ()=>taskTitleStr,
    typeStr: ()=>typeStr
});
function typeStr(task) {
    return task.subType && 'Plan' !== task.subType ? `${task.type} / ${task.subType || ''}` : task.type;
}
function locateParamStr(locate) {
    if (!locate) return '';
    if ('string' == typeof locate) return locate;
    if ('object' == typeof locate) {
        if ('string' == typeof locate.prompt) return locate.prompt;
        if ('object' == typeof locate.prompt && locate.prompt.prompt) {
            const prompt = locate.prompt.prompt;
            const images = locate.prompt.images || [];
            if (0 === images.length) return prompt;
            const imagesStr = images.map((image)=>{
                let url = image.url;
                if (url.startsWith('data:image/') || url.startsWith('data:') && url.includes('base64')) url = `${url.substring(0, 15)}...`;
                return `[${image.name}](${url})`;
            }).join(', ');
            return `${prompt}, ${imagesStr}`;
        }
    }
    return '';
}
function scrollParamStr(scrollParam) {
    if (!scrollParam) return '';
    return `${scrollParam.direction || 'down'}, ${scrollParam.scrollType || 'once'}, ${scrollParam.distance || 'distance-not-set'}`;
}
function pullParamStr(pullParam) {
    if (!pullParam) return '';
    const parts = [];
    parts.push(`direction: ${pullParam.direction || 'down'}`);
    if (pullParam.distance) parts.push(`distance: ${pullParam.distance}`);
    if (pullParam.duration) parts.push(`duration: ${pullParam.duration}ms`);
    return parts.join(', ');
}
function taskTitleStr(type, prompt) {
    if (prompt) return `${type} - ${prompt}`;
    return type;
}
function paramStr(task) {
    let value;
    if ('Planning' === task.type) {
        var _task_param;
        value = null == task ? void 0 : null == (_task_param = task.param) ? void 0 : _task_param.userInstruction;
    }
    if ('Insight' === task.type) {
        var _task_param1, _task_param2, _task_param3;
        value = locateParamStr(null == task ? void 0 : task.param) || (null == task ? void 0 : null == (_task_param1 = task.param) ? void 0 : _task_param1.id) || (null == task ? void 0 : null == (_task_param2 = task.param) ? void 0 : _task_param2.dataDemand) || (null == task ? void 0 : null == (_task_param3 = task.param) ? void 0 : _task_param3.assertion);
    }
    if ('Action' === task.type) {
        var _task_param4, _task_param5, _task_param6, _task_param7;
        const locate = null == task ? void 0 : task.locate;
        const locateStr = locate ? locateParamStr(locate) : '';
        value = task.thought || '';
        if ('number' == typeof (null == task ? void 0 : null == (_task_param4 = task.param) ? void 0 : _task_param4.timeMs)) {
            var _task_param8;
            value = `${null == task ? void 0 : null == (_task_param8 = task.param) ? void 0 : _task_param8.timeMs}ms`;
        } else if ('string' == typeof (null == task ? void 0 : null == (_task_param5 = task.param) ? void 0 : _task_param5.scrollType)) value = scrollParamStr(null == task ? void 0 : task.param);
        else if ('string' == typeof (null == task ? void 0 : null == (_task_param6 = task.param) ? void 0 : _task_param6.direction) && (null == task ? void 0 : task.subType) === 'AndroidPull') value = pullParamStr(null == task ? void 0 : task.param);
        else if (void 0 !== (null == task ? void 0 : null == (_task_param7 = task.param) ? void 0 : _task_param7.value)) {
            var _task_param9;
            value = null == task ? void 0 : null == (_task_param9 = task.param) ? void 0 : _task_param9.value;
        }
        if (locateStr) value = value ? `${locateStr} - ${value}` : locateStr;
    }
    if (void 0 === value) return '';
    if ('string' == typeof value) return value;
    if ('object' == typeof value && locateParamStr(value)) return locateParamStr(value);
    return JSON.stringify(value, void 0, 2);
}
exports.locateParamStr = __webpack_exports__.locateParamStr;
exports.paramStr = __webpack_exports__.paramStr;
exports.pullParamStr = __webpack_exports__.pullParamStr;
exports.scrollParamStr = __webpack_exports__.scrollParamStr;
exports.taskTitleStr = __webpack_exports__.taskTitleStr;
exports.typeStr = __webpack_exports__.typeStr;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "locateParamStr",
    "paramStr",
    "pullParamStr",
    "scrollParamStr",
    "taskTitleStr",
    "typeStr"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=ui-utils.js.map