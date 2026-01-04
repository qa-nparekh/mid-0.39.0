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
    ReportMergingTool: ()=>ReportMergingTool
});
const external_node_fs_namespaceObject = require("node:fs");
const external_node_path_namespaceObject = require("node:path");
const common_namespaceObject = require("@sqaitech/shared/common");
const index_js_namespaceObject = require("./agent/index.js");
const external_utils_js_namespaceObject = require("./utils.js");
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
class ReportMergingTool {
    append(reportInfo) {
        this.reportInfos.push(reportInfo);
    }
    clear() {
        this.reportInfos = [];
    }
    extractScriptContent(filePath) {
        const scriptRegex = /\n<script type="SQAI_web_dump" type="application\/json"[^>]*>([\s\S]*?)\n<\/script>/;
        const fileContent = external_node_fs_namespaceObject.readFileSync(filePath, 'utf-8');
        const match = scriptRegex.exec(fileContent);
        return match ? match[1].trim() : '';
    }
    mergeReports(reportFileName = 'AUTO', opts) {
        if (this.reportInfos.length <= 1) {
            console.log('Not enough report to merge');
            return null;
        }
        opts = Object.assign({
            rmOriginalReports: false,
            overwrite: false
        }, opts || {});
        const { rmOriginalReports, overwrite } = opts;
        let outputFilePath;
        const targetDir = `${(0, common_namespaceObject.getMidsceneRunSubDir)('report')}`;
        if ('AUTO' === reportFileName) outputFilePath = external_node_path_namespaceObject.resolve(targetDir, `${(0, index_js_namespaceObject.getReportFileName)('merged-report')}.html`);
        else {
            outputFilePath = external_node_path_namespaceObject.resolve(targetDir, `${reportFileName}.html`);
            if (external_node_fs_namespaceObject.existsSync(outputFilePath) && !overwrite) throw Error(`report file already existed: ${outputFilePath}\nset override to true to overwrite this file.`);
            if (external_node_fs_namespaceObject.existsSync(outputFilePath) && overwrite) external_node_fs_namespaceObject.unlinkSync(outputFilePath);
        }
        console.log(`Start merging ${this.reportInfos.length} reports...\nCreating template file...`);
        try {
            external_node_fs_namespaceObject.appendFileSync(outputFilePath, (0, external_utils_js_namespaceObject.getReportTpl)());
            for(let i = 0; i < this.reportInfos.length; i++){
                const reportInfo = this.reportInfos[i];
                console.log(`Processing report ${i + 1}/${this.reportInfos.length}`);
                const dumpString = this.extractScriptContent(reportInfo.reportFilePath);
                const reportAttributes = reportInfo.reportAttributes;
                const reportHtmlStr = `${(0, external_utils_js_namespaceObject.reportHTMLContent)({
                    dumpString,
                    attributes: {
                        playwright_test_duration: reportAttributes.testDuration,
                        playwright_test_status: reportAttributes.testStatus,
                        playwright_test_title: reportAttributes.testTitle,
                        playwright_test_id: reportAttributes.testId,
                        playwright_test_description: reportAttributes.testDescription
                    }
                }, void 0, void 0, false)}\n`;
                external_node_fs_namespaceObject.appendFileSync(outputFilePath, reportHtmlStr);
            }
            console.log(`Successfully merged new report: ${outputFilePath}`);
            if (rmOriginalReports) {
                for (const info of this.reportInfos)try {
                    external_node_fs_namespaceObject.unlinkSync(info.reportFilePath);
                } catch (error) {
                    console.error(`Error deleting report ${info.reportFilePath}:`, error);
                }
                console.log(`Removed ${this.reportInfos.length} original reports`);
            }
            return outputFilePath;
        } catch (error) {
            console.error('Error in mergeReports:', error);
            throw error;
        }
    }
    constructor(){
        _define_property(this, "reportInfos", []);
    }
}
exports.ReportMergingTool = __webpack_exports__.ReportMergingTool;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "ReportMergingTool"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=report.js.map