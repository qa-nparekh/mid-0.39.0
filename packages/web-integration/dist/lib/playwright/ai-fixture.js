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
    midsceneDumpAnnotationId: ()=>midsceneDumpAnnotationId,
    PlaywrightAiFixture: ()=>PlaywrightAiFixture
});
const external_node_fs_namespaceObject = require("node:fs");
const external_node_os_namespaceObject = require("node:os");
const external_node_path_namespaceObject = require("node:path");
const external_index_js_namespaceObject = require("./index.js");
const utils_namespaceObject = require("@sqai/core/utils");
const constants_namespaceObject = require("@sqai/shared/constants");
const logger_namespaceObject = require("@sqai/shared/logger");
const shared_utils_namespaceObject = require("@sqai/shared/utils");
const test_namespaceObject = require("@playwright/test");
const debugPage = (0, logger_namespaceObject.getDebug)('web:playwright:ai-fixture');
const groupAndCaseForTest = (testInfo)=>{
    let taskFile;
    let taskTitle;
    const titlePath = [
        ...testInfo.titlePath
    ];
    if (titlePath.length > 1) {
        taskFile = titlePath.shift() || 'unnamed';
        taskTitle = titlePath.join('__');
    } else if (1 === titlePath.length) {
        taskTitle = titlePath[0];
        taskFile = `${taskTitle}`;
    } else {
        taskTitle = 'unnamed';
        taskFile = 'unnamed';
    }
    const taskTitleWithRetry = `${taskTitle}${testInfo.retry ? `(retry #${testInfo.retry})` : ''}`;
    return {
        file: taskFile,
        id: (0, shared_utils_namespaceObject.replaceIllegalPathCharsAndSpace)(`${taskFile}(${taskTitle})`),
        title: (0, shared_utils_namespaceObject.replaceIllegalPathCharsAndSpace)(taskTitleWithRetry)
    };
};
const midsceneAgentKeyId = '_midsceneAgentId';
const midsceneDumpAnnotationId = 'MIDSCENE_DUMP_ANNOTATION';
const PlaywrightAiFixture = (options)=>{
    const { forceSameTabNavigation = true, waitForNetworkIdleTimeout = constants_namespaceObject.DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT, waitForNavigationTimeout = constants_namespaceObject.DEFAULT_WAIT_FOR_NAVIGATION_TIMEOUT, cache } = options ?? {};
    const processTestCacheConfig = (testInfo)=>{
        const { id } = groupAndCaseForTest(testInfo);
        return (0, utils_namespaceObject.processCacheConfig)(cache, id);
    };
    const pageAgentMap = {};
    const createOrReuseAgentForPage = (page, testInfo, opts)=>{
        let idForPage = page[midsceneAgentKeyId];
        if (!idForPage) {
            idForPage = (0, shared_utils_namespaceObject.uuid)();
            page[midsceneAgentKeyId] = idForPage;
            const { testId } = testInfo;
            const { file, title } = groupAndCaseForTest(testInfo);
            const cacheConfig = processTestCacheConfig(testInfo);
            pageAgentMap[idForPage] = new external_index_js_namespaceObject.PlaywrightAgent(page, {
                testId: `playwright-${testId}-${idForPage}`,
                forceSameTabNavigation,
                cache: cacheConfig,
                groupName: title,
                groupDescription: file,
                generateReport: false,
                ...opts
            });
            pageAgentMap[idForPage].onDumpUpdate = (dump)=>{
                updateDumpAnnotation(testInfo, dump);
            };
            page.on('close', ()=>{
                debugPage('page closed');
                pageAgentMap[idForPage].destroy();
                delete pageAgentMap[idForPage];
            });
        }
        return pageAgentMap[idForPage];
    };
    async function generateAiFunction(options) {
        const { page, testInfo, use, aiActionType } = options;
        const agent = createOrReuseAgentForPage(page, testInfo, {
            waitForNavigationTimeout,
            waitForNetworkIdleTimeout
        });
        await use(async (taskPrompt, ...args)=>new Promise((resolve, reject)=>{
                test_namespaceObject.test.step(`ai-${aiActionType} - ${JSON.stringify(taskPrompt)}`, async ()=>{
                    try {
                        debugPage(`waitForNetworkIdle timeout: ${waitForNetworkIdleTimeout}`);
                        await agent.waitForNetworkIdle(waitForNetworkIdleTimeout);
                    } catch (error) {
                        console.warn('[midscene:warning] Waiting for network idle has timed out, but Midscene will continue execution. Please check https://midscenejs.com/faq.html#customize-the-network-timeout for more information on customizing the network timeout');
                    }
                    try {
                        const result = await agent[aiActionType](taskPrompt, ...args || []);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            }));
    }
    const updateDumpAnnotation = (test, dump)=>{
        const tempFileName = `midscene-dump-${test.testId || (0, shared_utils_namespaceObject.uuid)()}-${Date.now()}.json`;
        const tempFilePath = (0, external_node_path_namespaceObject.join)((0, external_node_os_namespaceObject.tmpdir)(), tempFileName);
        (0, external_node_fs_namespaceObject.writeFileSync)(tempFilePath, dump, 'utf-8');
        debugPage(`Dump written to temp file: ${tempFilePath}`);
        const currentAnnotation = test.annotations.find((item)=>item.type === midsceneDumpAnnotationId);
        if (currentAnnotation) currentAnnotation.description = tempFilePath;
        else test.annotations.push({
            type: midsceneDumpAnnotationId,
            description: tempFilePath
        });
    };
    return {
        agentForPage: async ({ page }, use, testInfo)=>{
            await use(async (propsPage, opts)=>{
                const cacheConfig = processTestCacheConfig(testInfo);
                let finalCacheConfig = cacheConfig;
                if ((null == opts ? void 0 : opts.cache) !== void 0) {
                    const userCache = opts.cache;
                    if (false === userCache) finalCacheConfig = false;
                    else if (true === userCache) {
                        const { id } = groupAndCaseForTest(testInfo);
                        finalCacheConfig = {
                            id
                        };
                    } else if ('object' == typeof userCache) if (userCache.id) finalCacheConfig = userCache;
                    else {
                        const { id } = groupAndCaseForTest(testInfo);
                        finalCacheConfig = {
                            ...userCache,
                            id
                        };
                    }
                }
                const agent = createOrReuseAgentForPage(propsPage || page, testInfo, {
                    waitForNavigationTimeout,
                    waitForNetworkIdleTimeout,
                    cache: finalCacheConfig,
                    ...opts
                });
                return agent;
            });
        },
        ai: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'ai'
            });
        },
        aiAction: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiAction'
            });
        },
        aiTap: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiTap'
            });
        },
        aiRightClick: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiRightClick'
            });
        },
        aiDoubleClick: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiDoubleClick'
            });
        },
        aiHover: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiHover'
            });
        },
        aiInput: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiInput'
            });
        },
        aiKeyboardPress: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiKeyboardPress'
            });
        },
        aiScroll: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiScroll'
            });
        },
        aiQuery: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiQuery'
            });
        },
        aiAssert: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiAssert'
            });
        },
        aiWaitFor: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiWaitFor'
            });
        },
        aiLocate: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiLocate'
            });
        },
        aiNumber: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiNumber'
            });
        },
        aiString: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiString'
            });
        },
        aiBoolean: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiBoolean'
            });
        },
        aiAsk: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'aiAsk'
            });
        },
        runYaml: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'runYaml'
            });
        },
        setAIActionContext: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'setAIActionContext'
            });
        },
        evaluateJavaScript: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'evaluateJavaScript'
            });
        },
        logScreenshot: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'logScreenshot'
            });
        },
        freezePageContext: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'freezePageContext'
            });
        },
        unfreezePageContext: async ({ page }, use, testInfo)=>{
            await generateAiFunction({
                page,
                testInfo,
                use,
                aiActionType: 'unfreezePageContext'
            });
        }
    };
};
exports.PlaywrightAiFixture = __webpack_exports__.PlaywrightAiFixture;
exports.midsceneDumpAnnotationId = __webpack_exports__.midsceneDumpAnnotationId;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "PlaywrightAiFixture",
    "midsceneDumpAnnotationId"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});

//# sourceMappingURL=ai-fixture.js.map