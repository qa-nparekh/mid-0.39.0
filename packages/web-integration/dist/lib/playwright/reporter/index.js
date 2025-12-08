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
    default: ()=>reporter
});
const external_node_fs_namespaceObject = require("node:fs");
const agent_namespaceObject = require("@sqai/core/agent");
const utils_namespaceObject = require("@sqai/core/utils");
const shared_utils_namespaceObject = require("@sqai/shared/utils");
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
class MidsceneReporter {
    static getMode(reporterType) {
        if (!reporterType) return 'merged';
        if ('merged' !== reporterType && 'separate' !== reporterType) throw new Error(`Unknown reporter type in playwright config: ${reporterType}, only support 'merged' or 'separate'`);
        return reporterType;
    }
    getSeparatedFilename(testTitle) {
        if (!this.testTitleToFilename.has(testTitle)) {
            const baseTag = `playwright-${(0, shared_utils_namespaceObject.replaceIllegalPathCharsAndSpace)(testTitle)}`;
            const generatedFilename = (0, agent_namespaceObject.getReportFileName)(baseTag);
            this.testTitleToFilename.set(testTitle, generatedFilename);
        }
        return this.testTitleToFilename.get(testTitle);
    }
    getReportFilename(testTitle) {
        if ('merged' === this.mode) {
            if (!this.mergedFilename) this.mergedFilename = (0, agent_namespaceObject.getReportFileName)('playwright-merged');
            return this.mergedFilename;
        }
        if ('separate' === this.mode) {
            if (!testTitle) throw new Error('testTitle is required in separate mode');
            return this.getSeparatedFilename(testTitle);
        }
        throw new Error(`Unknown mode: ${this.mode}`);
    }
    updateReport(testData) {
        var _testData_attributes;
        if (!testData || !this.mode) return;
        const fileName = this.getReportFilename(null == (_testData_attributes = testData.attributes) ? void 0 : _testData_attributes.playwright_test_title);
        const reportPath = (0, utils_namespaceObject.writeDumpReport)(fileName, testData, 'merged' === this.mode);
        reportPath && (0, agent_namespaceObject.printReportMsg)(reportPath);
    }
    async onBegin(config, suite) {}
    onTestBegin(_test, _result) {}
    onTestEnd(test, result) {
        const dumpAnnotation = test.annotations.find((annotation)=>'MIDSCENE_DUMP_ANNOTATION' === annotation.type);
        if (!(null == dumpAnnotation ? void 0 : dumpAnnotation.description)) return;
        const tempFilePath = dumpAnnotation.description;
        let dumpString;
        try {
            dumpString = (0, external_node_fs_namespaceObject.readFileSync)(tempFilePath, 'utf-8');
        } catch (error) {
            console.error(`Failed to read Midscene dump file: ${tempFilePath}`, error);
            return;
        }
        const retry = result.retry ? `(retry #${result.retry})` : '';
        const testId = `${test.id}${retry}`;
        const testData = {
            dumpString,
            attributes: {
                playwright_test_id: testId,
                playwright_test_title: `${test.title}${retry}`,
                playwright_test_status: result.status,
                playwright_test_duration: result.duration
            }
        };
        this.updateReport(testData);
        try {
            (0, external_node_fs_namespaceObject.rmSync)(tempFilePath, {
                force: true
            });
        } catch (error) {
            console.warn(`Failed to delete Midscene temp file: ${tempFilePath}`, error);
        }
    }
    constructor(options = {}){
        _define_property(this, "mergedFilename", void 0);
        _define_property(this, "testTitleToFilename", new Map());
        _define_property(this, "mode", void 0);
        this.mode = MidsceneReporter.getMode(options.type ?? 'merged');
    }
}
const reporter = MidsceneReporter;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=index.js.map