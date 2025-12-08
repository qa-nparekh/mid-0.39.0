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
    sectionLocatorInstruction: ()=>sectionLocatorInstruction,
    systemPromptToLocateSection: ()=>systemPromptToLocateSection
});
const external_common_js_namespaceObject = require("./common.js");
function systemPromptToLocateSection(vlMode) {
    return `
You goal is to find out one section containing the target element in the screenshot, put it in the \`bbox\` field. If the user describe the target element with some reference elements, you should also find the section containing the reference elements, put it in the \`references_bbox\` field.

Usually, it should be approximately an area not more than 300x300px. Changes of the size are allowed if there are many elements to cover.

return in this JSON format:
\`\`\`json
{
  "bbox": [number, number, number, number],
  "references_bbox"?: [
    [number, number, number, number],
    [number, number, number, number],
    ...
  ],
  "error"?: string
}
\`\`\`

In which, all the numbers in the \`bbox\` and \`references_bbox\` represent ${(0, external_common_js_namespaceObject.bboxDescription)(vlMode)}.

For example, if the user describe the target element as "the delete button on the second row with title 'Peter'", you should put the bounding box of the delete button in the \`bbox\` field, and the bounding box of the second row in the \`references_bbox\` field.

the return value should be like this:
\`\`\`json
{
  "bbox": [100, 100, 200, 200],
  "references_bbox": [[100, 100, 200, 200]]
}
\`\`\`
`;
}
const sectionLocatorInstruction = ({ sectionDescription })=>`Here is the target element user interested in:
<targetDescription>
${sectionDescription}
</targetDescription>
  `;
exports.sectionLocatorInstruction = __webpack_exports__.sectionLocatorInstruction;
exports.systemPromptToLocateSection = __webpack_exports__.systemPromptToLocateSection;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "sectionLocatorInstruction",
    "systemPromptToLocateSection"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=llm-section-locator.js.map