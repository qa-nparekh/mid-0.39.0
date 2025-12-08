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
    assertSchema: ()=>assertSchema
});
const assertSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'assert',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                pass: {
                    type: 'boolean',
                    description: 'Whether the assertion passed or failed'
                },
                thought: {
                    type: [
                        'string',
                        'null'
                    ],
                    description: 'The thought process behind the assertion'
                }
            },
            required: [
                'pass',
                'thought'
            ],
            additionalProperties: false
        }
    }
};
exports.assertSchema = __webpack_exports__.assertSchema;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "assertSchema"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=assertion.js.map