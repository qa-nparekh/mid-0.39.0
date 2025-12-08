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
    extractDataQueryPrompt: ()=>extractDataQueryPrompt,
    extractDataSchema: ()=>extractDataSchema,
    systemPromptToExtract: ()=>systemPromptToExtract
});
function systemPromptToExtract() {
    return `
You are a versatile professional in software UI design and testing. Your outstanding contributions will impact the user experience of billions of users.

The user will give you a screenshot, the contents of it (optional), and some data requirements in <DATA_DEMAND>. You need to understand the user's requirements and extract the data satisfying the <DATA_DEMAND>.

If a key specifies a JSON data type (such as Number, String, Boolean, Object, Array), ensure the returned value strictly matches that data type.

If the user provides multiple reference images, please carefully review the reference images with the screenshot and provide the correct answer for <DATA_DEMAND>.


Return in the following JSON format:
{
  thought: string, // the thinking process of the extraction, less then 300 words
  data: any, // the extracted data. Make sure both the value and scheme meet the DATA_DEMAND. If you want to write some description in this field, use the same language as the DATA_DEMAND.
  errors: [], // string[], error message if any
}

# Example 1
For example, if the DATA_DEMAND is:

<DATA_DEMAND>
{
  "name": "name shows on the left panel, string",
  "age": "age shows on the right panel, number",
  "isAdmin": "if the user is admin, boolean"
}
</DATA_DEMAND>

By viewing the screenshot and page contents, you can extract the following data:

{
  thought: "According to the screenshot, i can see ...",
  data: {
    name: "John",
    age: 30,
    isAdmin: true
  },
}

# Example 2
If the DATA_DEMAND is:

<DATA_DEMAND>
the todo items list, string[]
</DATA_DEMAND>

By viewing the screenshot and page contents, you can extract the following data:

{
  thought: "According to the screenshot, i can see ...",
  data: ["todo 1", "todo 2", "todo 3"],
}

# Example 3
If the DATA_DEMAND is:

<DATA_DEMAND>
the page title, string
</DATA_DEMAND>

By viewing the screenshot and page contents, you can extract the following data:

{
  thought: "According to the screenshot, i can see ...",
  data: "todo list",
}

# Example 4
If the DATA_DEMAND is:

<DATA_DEMAND>
{
  "result": "Boolean, is it currently the SMS page?"
}
</DATA_DEMAND>

By viewing the screenshot and page contents, you can extract the following data:

{
  thought: "According to the screenshot, i can see ...",
  data: { result: true },
}
`;
}
const extractDataQueryPrompt = (pageDescription, dataQuery)=>{
    let dataQueryText = '';
    dataQueryText = 'string' == typeof dataQuery ? dataQuery : JSON.stringify(dataQuery, null, 2);
    return `
<PageDescription>
${pageDescription}
</PageDescription>

<DATA_DEMAND>
${dataQueryText}
</DATA_DEMAND>
  `;
};
const extractDataSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'extract_data',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    description: 'The extracted data'
                },
                errors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Error messages, if any'
                }
            },
            required: [
                'data',
                'errors'
            ],
            additionalProperties: false
        }
    }
};
exports.extractDataQueryPrompt = __webpack_exports__.extractDataQueryPrompt;
exports.extractDataSchema = __webpack_exports__.extractDataSchema;
exports.systemPromptToExtract = __webpack_exports__.systemPromptToExtract;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "extractDataQueryPrompt",
    "extractDataSchema",
    "systemPromptToExtract"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=extraction.js.map