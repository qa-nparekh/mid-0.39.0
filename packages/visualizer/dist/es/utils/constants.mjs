const trackingTip = 'limit popup to current tab';
const deepThinkTip = 'deep think';
const screenshotIncludedTip = 'include screenshot in request';
const domIncludedTip = 'include DOM info in request';
const apiMetadata = {
    aiAction: {
        group: 'interaction',
        title: 'Auto Planning: plan the steps and execute'
    },
    aiTap: {
        group: 'interaction',
        title: 'Click an element'
    },
    aiDoubleClick: {
        group: 'interaction',
        title: 'Double-click an element'
    },
    aiHover: {
        group: 'interaction',
        title: 'Hover over an element'
    },
    aiInput: {
        group: 'interaction',
        title: 'Input text into an element'
    },
    aiRightClick: {
        group: 'interaction',
        title: 'Right-click an element'
    },
    aiKeyboardPress: {
        group: 'interaction',
        title: 'Press keyboard keys'
    },
    aiScroll: {
        group: 'interaction',
        title: 'Scroll the page or element'
    },
    aiLocate: {
        group: 'interaction',
        title: 'Locate an element on the page'
    },
    aiQuery: {
        group: 'extraction',
        title: 'Extract data directly from the UI'
    },
    aiBoolean: {
        group: 'extraction',
        title: 'Get true/false answer'
    },
    aiNumber: {
        group: 'extraction',
        title: 'Extract numeric value'
    },
    aiString: {
        group: 'extraction',
        title: 'Extract text value'
    },
    aiAsk: {
        group: 'extraction',
        title: 'Ask a question about the UI'
    },
    aiAssert: {
        group: 'validation',
        title: 'Assert a condition is true'
    },
    aiWaitFor: {
        group: 'validation',
        title: 'Wait for a condition to be met'
    }
};
const defaultMainButtons = [
    'aiAction',
    'aiTap',
    'aiQuery',
    'aiAssert'
];
const WELCOME_MESSAGE_TEMPLATE = {
    type: 'system',
    content: `
      Welcome to Midscene.js Playground!
      
      This is a panel for experimenting and testing Midscene.js features. You can use natural language instructions to operate the web page, such as clicking buttons, filling in forms, querying information, etc.
      
      Please enter your instructions in the input box below to start experiencing.
    `,
    loading: false,
    result: void 0,
    replayScriptsInfo: null,
    replayCounter: 0,
    loadingProgressText: '',
    verticalMode: false
};
const BLANK_RESULT = {
    result: void 0,
    dump: null,
    reportHTML: null,
    error: null
};
export { BLANK_RESULT, WELCOME_MESSAGE_TEMPLATE, apiMetadata, deepThinkTip, defaultMainButtons, domIncludedTip, screenshotIncludedTip, trackingTip };
