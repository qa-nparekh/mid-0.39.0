import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PlaywrightAgent } from "./index.mjs";
import { processCacheConfig } from "@sqai/core/utils";
import { DEFAULT_WAIT_FOR_NAVIGATION_TIMEOUT, DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT } from "@sqai/shared/constants";
import { getDebug } from "@sqai/shared/logger";
import { replaceIllegalPathCharsAndSpace, uuid } from "@sqai/shared/utils";
import { test as test_test } from "@playwright/test";
const debugPage = getDebug('web:playwright:ai-fixture');
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
        id: replaceIllegalPathCharsAndSpace(`${taskFile}(${taskTitle})`),
        title: replaceIllegalPathCharsAndSpace(taskTitleWithRetry)
    };
};
const midsceneAgentKeyId = '_midsceneAgentId';
const midsceneDumpAnnotationId = 'MIDSCENE_DUMP_ANNOTATION';
const PlaywrightAiFixture = (options)=>{
    const { forceSameTabNavigation = true, waitForNetworkIdleTimeout = DEFAULT_WAIT_FOR_NETWORK_IDLE_TIMEOUT, waitForNavigationTimeout = DEFAULT_WAIT_FOR_NAVIGATION_TIMEOUT, cache } = options ?? {};
    const processTestCacheConfig = (testInfo)=>{
        const { id } = groupAndCaseForTest(testInfo);
        return processCacheConfig(cache, id);
    };
    const pageAgentMap = {};
    const createOrReuseAgentForPage = (page, testInfo, opts)=>{
        let idForPage = page[midsceneAgentKeyId];
        if (!idForPage) {
            idForPage = uuid();
            page[midsceneAgentKeyId] = idForPage;
            const { testId } = testInfo;
            const { file, title } = groupAndCaseForTest(testInfo);
            const cacheConfig = processTestCacheConfig(testInfo);
            pageAgentMap[idForPage] = new PlaywrightAgent(page, {
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
                test_test.step(`ai-${aiActionType} - ${JSON.stringify(taskPrompt)}`, async ()=>{
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
        const tempFileName = `midscene-dump-${test.testId || uuid()}-${Date.now()}.json`;
        const tempFilePath = join(tmpdir(), tempFileName);
        writeFileSync(tempFilePath, dump, 'utf-8');
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
export { PlaywrightAiFixture, midsceneDumpAnnotationId };

//# sourceMappingURL=ai-fixture.mjs.map