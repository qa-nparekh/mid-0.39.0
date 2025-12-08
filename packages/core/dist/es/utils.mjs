import { execSync } from "node:child_process";
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, statSync, truncateSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultRunDirName, getMidsceneRunSubDir } from "@sqai/shared/common";
import { SQAI_CACHE, SQAI_DEBUG_MODE, globalConfigManager } from "@sqai/shared/env";
import { getRunningPkgInfo } from "@sqai/shared/node";
import { assert, escapeScriptTag, ifInBrowser, ifInWorker, logMsg, uuid } from "@sqai/shared/utils";
let logEnvReady = false;
const groupedActionDumpFileExt = 'web-dump.json';
function processCacheConfig(cache, cacheId) {
    if (void 0 !== cache) {
        if (false === cache) return;
        if (true === cache) return {
            id: cacheId
        };
        if ('object' == typeof cache && null !== cache) {
            if (!cache.id) return {
                ...cache,
                id: cacheId
            };
            return cache;
        }
    }
    const envEnabled = globalConfigManager.getEnvConfigInBoolean(SQAI_CACHE);
    if (envEnabled && cacheId) return {
        id: cacheId
    };
}
const reportInitializedMap = new Map();
function getReportTpl() {
    const reportTpl = 'REPLACE_ME_WITH_REPORT_HTML';
    return reportTpl;
}
function insertScriptBeforeClosingHtml(filePath, scriptContent) {
    const htmlEndTag = '</html>';
    const stat = statSync(filePath);
    const readSize = Math.min(stat.size, 4096);
    const start = Math.max(0, stat.size - readSize);
    const buffer = Buffer.alloc(stat.size - start);
    const fd = openSync(filePath, 'r');
    readSync(fd, buffer, 0, buffer.length, start);
    closeSync(fd);
    const tailStr = buffer.toString('utf8');
    const htmlEndIdx = tailStr.lastIndexOf(htmlEndTag);
    if (-1 === htmlEndIdx) throw new Error(`No </html> found in file\u{FF1A}${filePath}`);
    const beforeHtmlInTail = tailStr.slice(0, htmlEndIdx);
    const htmlEndPos = start + Buffer.byteLength(beforeHtmlInTail, 'utf8');
    truncateSync(filePath, htmlEndPos);
    appendFileSync(filePath, `${scriptContent}\n${htmlEndTag}\n`);
}
function reportHTMLContent(dumpData, reportPath, appendReport, withTpl = true) {
    let tpl = '';
    if (withTpl) {
        tpl = getReportTpl();
        if (!tpl) {
            console.warn('reportTpl is not set, will not write report');
            return '';
        }
    }
    const writeToFile = reportPath && !ifInBrowser;
    let dumpContent = '';
    if ('string' == typeof dumpData) dumpContent = '<script type="SQAI_web_dump" type="application/json">\n' + escapeScriptTag(dumpData) + "\n<\/script>";
    else {
        const { dumpString, attributes } = dumpData;
        const attributesArr = Object.keys(attributes || {}).map((key)=>`${key}="${encodeURIComponent(attributes[key])}"`);
        dumpContent = '<script type="SQAI_web_dump" type="application/json" ' + attributesArr.join(' ') + '>\n' + escapeScriptTag(dumpString) + "\n<\/script>";
    }
    if (writeToFile) {
        if (!appendReport) {
            writeFileSync(reportPath, tpl + dumpContent, {
                flag: 'w'
            });
            return reportPath;
        }
        if (!reportInitializedMap.get(reportPath)) {
            writeFileSync(reportPath, tpl, {
                flag: 'w'
            });
            reportInitializedMap.set(reportPath, true);
        }
        insertScriptBeforeClosingHtml(reportPath, dumpContent);
        return reportPath;
    }
    return tpl + dumpContent;
}
function writeDumpReport(fileName, dumpData, appendReport) {
    if (ifInBrowser || ifInWorker) {
        console.log('will not write report in browser');
        return null;
    }
    const reportPath = join(getMidsceneRunSubDir('report'), `${fileName}.html`);
    reportHTMLContent(dumpData, reportPath, appendReport);
    if (process.env.SQAI_DEBUG_LOG_JSON) {
        const jsonPath = `${reportPath}.json`;
        let data;
        data = 'string' == typeof dumpData ? JSON.parse(dumpData) : dumpData;
        writeFileSync(jsonPath, JSON.stringify(data, null, 2), {
            flag: appendReport ? 'a' : 'w'
        });
        logMsg(`Midscene - dump file written: ${jsonPath}`);
    }
    return reportPath;
}
function writeLogFile(opts) {
    if (ifInBrowser || ifInWorker) return '/mock/report.html';
    const { fileName, fileExt, fileContent, type = 'dump' } = opts;
    const targetDir = getMidsceneRunSubDir(type);
    if (!logEnvReady) {
        assert(targetDir, 'logDir should be set before writing dump file');
        const gitIgnorePath = join(targetDir, '../../.gitignore');
        const gitPath = join(targetDir, '../../.git');
        let gitIgnoreContent = '';
        if (existsSync(gitPath)) {
            if (existsSync(gitIgnorePath)) gitIgnoreContent = readFileSync(gitIgnorePath, 'utf-8');
            if (!gitIgnoreContent.includes(`${defaultRunDirName}/`)) writeFileSync(gitIgnorePath, `${gitIgnoreContent}\n# Midscene.js dump files\n${defaultRunDirName}/dump\n${defaultRunDirName}/report\n${defaultRunDirName}/tmp\n${defaultRunDirName}/log\n`, 'utf-8');
        }
        logEnvReady = true;
    }
    const filePath = join(targetDir, `${fileName}.${fileExt}`);
    if ('dump' !== type) writeFileSync(filePath, JSON.stringify(fileContent));
    if (null == opts ? void 0 : opts.generateReport) return writeDumpReport(fileName, fileContent, opts.appendReport);
    return filePath;
}
function getTmpDir() {
    try {
        const runningPkgInfo = getRunningPkgInfo();
        if (!runningPkgInfo) return null;
        const { name } = runningPkgInfo;
        const tmpPath = join(tmpdir(), name);
        mkdirSync(tmpPath, {
            recursive: true
        });
        return tmpPath;
    } catch (e) {
        return null;
    }
}
function getTmpFile(fileExtWithoutDot) {
    if (ifInBrowser || ifInWorker) return null;
    const tmpDir = getTmpDir();
    const filename = `${uuid()}.${fileExtWithoutDot}`;
    return join(tmpDir, filename);
}
function overlapped(container, target) {
    return container.left < target.left + target.width && container.left + container.width > target.left && container.top < target.top + target.height && container.top + container.height > target.top;
}
async function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function replacerForPageObject(_key, value) {
    var _value_constructor, _value_constructor1;
    if (value && (null == (_value_constructor = value.constructor) ? void 0 : _value_constructor.name) === 'Page') return '[Page object]';
    if (value && (null == (_value_constructor1 = value.constructor) ? void 0 : _value_constructor1.name) === 'Browser') return '[Browser object]';
    return value;
}
function stringifyDumpData(data, indents) {
    return JSON.stringify(data, replacerForPageObject, indents);
}
function getVersion() {
    return "0.30.9";
}
function debugLog(...message) {
    const debugMode = process.env[SQAI_DEBUG_MODE];
    if (debugMode) console.log('[Midscene]', ...message);
}
let lastReportedRepoUrl = '';
function uploadTestInfoToServer({ testUrl, serverUrl }) {
    let repoUrl = '';
    let userEmail = '';
    try {
        repoUrl = execSync('git config --get remote.origin.url').toString().trim();
        userEmail = execSync('git config --get user.email').toString().trim();
    } catch (error) {
        debugLog('Failed to get git info:', error);
    }
    if (serverUrl && (repoUrl && repoUrl !== lastReportedRepoUrl || !repoUrl && testUrl)) {
        debugLog('Uploading test info to server', {
            serverUrl,
            repoUrl,
            testUrl,
            userEmail
        });
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repo_url: repoUrl,
                test_url: testUrl,
                user_email: userEmail
            })
        }).then((response)=>response.json()).then((data)=>{
            debugLog('Successfully uploaded test info to server:', data);
        }).catch((error)=>debugLog('Failed to upload test info to server:', error));
        lastReportedRepoUrl = repoUrl;
    }
}
export { appendFileSync, getReportTpl, getTmpDir, getTmpFile, getVersion, groupedActionDumpFileExt, insertScriptBeforeClosingHtml, overlapped, processCacheConfig, replacerForPageObject, reportHTMLContent, sleep, stringifyDumpData, uploadTestInfoToServer, writeDumpReport, writeLogFile };

//# sourceMappingURL=utils.mjs.map