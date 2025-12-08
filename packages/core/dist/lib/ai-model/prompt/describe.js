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
    elementDescriberInstruction: ()=>elementDescriberInstruction
});
const env_namespaceObject = require("@sqai/shared/env");
const elementDescriberInstruction = ()=>`
Describe the element in the red rectangle for precise identification. Use ${(0, env_namespaceObject.getPreferredLanguage)()}.

CRITICAL REQUIREMENTS:
1. UNIQUENESS: The description must uniquely identify this element on the current page
2. UNIVERSALITY: Use generic, reusable selectors that work across different contexts
3. PRECISION: Be specific enough to distinguish from similar elements

DESCRIPTION STRUCTURE:
1. Element type (button, input, link, div, etc.)
2. Primary identifier (in order of preference):
   - Unique text content: "with text 'Login'"
   - Unique attribute: "with aria-label 'Search'"
   - Unique class/ID: "with class 'primary-button'"
   - Unique position: "in header navigation"
3. Secondary identifiers (if needed for uniqueness):
   - Visual features: "blue background", "with icon"
   - Relative position: "below search bar", "in sidebar"
   - Parent context: "in login form", "in main menu"

GUIDELINES:
- Keep description under 25 words
- Prioritize semantic identifiers over visual ones
- Use consistent terminology across similar elements
- Avoid page-specific or temporary content
- Don't mention the red rectangle or selection box
- Focus on stable, reusable characteristics

EXAMPLES:
- "Login button with text 'Sign In'"
- "Search input with placeholder 'Enter keywords'"
- "Navigation link with text 'Home' in header"
- "Submit button in contact form"
- "Menu icon with aria-label 'Open menu'"

Return JSON:
{
  "description": "unique element identifier",
  "error"?: "error message if any"
}`;
exports.elementDescriberInstruction = __webpack_exports__.elementDescriberInstruction;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "elementDescriberInstruction"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=describe.js.map