(()=>{
    "use strict";
    function isFormElement(node) {
        return node instanceof HTMLElement && ('input' === node.tagName.toLowerCase() || 'textarea' === node.tagName.toLowerCase() || 'select' === node.tagName.toLowerCase() || 'option' === node.tagName.toLowerCase());
    }
    function isButtonElement(node) {
        return node instanceof HTMLElement && 'button' === node.tagName.toLowerCase();
    }
    function isAElement(node) {
        return node instanceof HTMLElement && 'a' === node.tagName.toLowerCase();
    }
    function isSvgElement(node) {
        return node instanceof SVGElement;
    }
    function isImgElement(node) {
        if (!includeBaseElement(node) && node instanceof Element) {
            const computedStyle = window.getComputedStyle(node);
            const backgroundImage = computedStyle.getPropertyValue('background-image');
            if ('none' !== backgroundImage) return true;
        }
        if (isIconfont(node)) return true;
        return node instanceof HTMLElement && 'img' === node.tagName.toLowerCase() || node instanceof SVGElement && 'svg' === node.tagName.toLowerCase();
    }
    function isIconfont(node) {
        if (node instanceof Element) {
            const computedStyle = window.getComputedStyle(node);
            const fontFamilyValue = computedStyle.fontFamily || '';
            return fontFamilyValue.toLowerCase().indexOf('iconfont') >= 0;
        }
        return false;
    }
    function isNotContainerElement(node) {
        return isTextElement(node) || isIconfont(node) || isImgElement(node) || isButtonElement(node) || isAElement(node) || isFormElement(node);
    }
    function isTextElement(node) {
        var _node_nodeName_toLowerCase, _node_nodeName;
        if (node instanceof Element) {
            var _node_childNodes;
            if ((null == node ? void 0 : null == (_node_childNodes = node.childNodes) ? void 0 : _node_childNodes.length) === 1 && (null == node ? void 0 : node.childNodes[0]) instanceof Text) return true;
        }
        return (null == (_node_nodeName = node.nodeName) ? void 0 : null == (_node_nodeName_toLowerCase = _node_nodeName.toLowerCase) ? void 0 : _node_nodeName_toLowerCase.call(_node_nodeName)) === '#text' && !isIconfont(node);
    }
    function includeBaseElement(node) {
        if (!(node instanceof HTMLElement)) return false;
        if (node.innerText) return true;
        const includeList = [
            'svg',
            'button',
            'input',
            'textarea',
            'select',
            'option',
            'img',
            'a'
        ];
        for (const tagName of includeList){
            const element = node.querySelectorAll(tagName);
            if (element.length > 0) return true;
        }
        return false;
    }
    const getElementXpathIndex = (element)=>{
        let index = 1;
        let prev = element.previousElementSibling;
        while(prev){
            if (prev.nodeName.toLowerCase() === element.nodeName.toLowerCase()) index++;
            prev = prev.previousElementSibling;
        }
        return index;
    };
    const normalizeXpathText = (text)=>{
        if ('string' != typeof text) return '';
        return text.replace(/\s+/g, ' ').trim();
    };
    const buildCurrentElementXpath = (element, isOrderSensitive, isLeafElement)=>{
        var _element_textContent;
        const parentPath = element.parentNode ? getElementXpath(element.parentNode, isOrderSensitive) : '';
        const prefix = parentPath ? `${parentPath}/` : '/';
        const tagName = element.nodeName.toLowerCase();
        const textContent = null == (_element_textContent = element.textContent) ? void 0 : _element_textContent.trim();
        if (isOrderSensitive) {
            const index = getElementXpathIndex(element);
            return `${prefix}${tagName}[${index}]`;
        }
        if (isLeafElement && textContent) return `${prefix}${tagName}[normalize-space()="${normalizeXpathText(textContent)}"]`;
        const index = getElementXpathIndex(element);
        return `${prefix}${tagName}[${index}]`;
    };
    const getElementXpath = (element, isOrderSensitive = false, isLeafElement = false)=>{
        if (element.nodeType === Node.TEXT_NODE) {
            const parentNode = element.parentNode;
            if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
                var _element_textContent;
                const parentXPath = getElementXpath(parentNode, isOrderSensitive, true);
                const textContent = null == (_element_textContent = element.textContent) ? void 0 : _element_textContent.trim();
                if (textContent) return `${parentXPath}/text()[normalize-space()="${normalizeXpathText(textContent)}"]`;
                return `${parentXPath}/text()`;
            }
            return '';
        }
        if (element.nodeType !== Node.ELEMENT_NODE) return '';
        const el = element;
        if (el === document.documentElement) return '/html';
        if (el === document.body) return '/html/body';
        if (isSvgElement(el)) {
            let parent = el.parentNode;
            while(parent && parent.nodeType === Node.ELEMENT_NODE){
                if (!isSvgElement(parent)) return getElementXpath(parent, isOrderSensitive, isLeafElement);
                parent = parent.parentNode;
            }
            return getElementXpath(el.parentNode, isOrderSensitive, isLeafElement);
        }
        return buildCurrentElementXpath(el, isOrderSensitive, isLeafElement);
    };
    const DEBUG = 'true' === localStorage.getItem('DEBUG');
    function debugLog(...args) {
        if (DEBUG) console.log('[EventRecorder]', ...args);
    }
    function recorder_generateHashId(type, elementRect) {
        const rectStr = elementRect ? `${elementRect.left}_${elementRect.top}_${elementRect.width}_${elementRect.height}${void 0 !== elementRect.x ? `_${elementRect.x}` : ''}${void 0 !== elementRect.y ? `_${elementRect.y}` : ''}` : 'no_rect';
        const combined = `${type}_${rectStr}`;
        let hash = 0;
        for(let i = 0; i < combined.length; i++){
            const char = combined.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash &= hash;
        }
        return Math.abs(hash).toString(36);
    }
    const isSameInputTarget = (event1, event2)=>event1.element === event2.element;
    const isSameScrollTarget = (event1, event2)=>event1.element === event2.element;
    const getLastLabelClick = (events)=>{
        for(let i = events.length - 1; i >= 0; i--){
            const event = events[i];
            if ('click' === event.type && event.isLabelClick) return event;
        }
    };
    function getAllScrollableElements() {
        const elements = [];
        const all = document.querySelectorAll('body *');
        all.forEach((el)=>{
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            const overflowX = style.overflowX;
            const isScrollableY = ('auto' === overflowY || 'scroll' === overflowY) && el.scrollHeight > el.clientHeight;
            const isScrollableX = ('auto' === overflowX || 'scroll' === overflowX) && el.scrollWidth > el.clientWidth;
            if (isScrollableY || isScrollableX) elements.push(el);
        });
        return elements;
    }
    class EventRecorder {
        isRecording = false;
        eventCallback;
        scrollThrottleTimer = null;
        scrollThrottleDelay = 200;
        inputThrottleTimer = null;
        inputThrottleDelay = 300;
        lastViewportScroll = null;
        scrollTargets = [];
        sessionId;
        constructor(eventCallback, sessionId){
            this.eventCallback = eventCallback;
            this.sessionId = sessionId;
        }
        createNavigationEvent(url, title) {
            return {
                type: 'navigation',
                url,
                title,
                pageInfo: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                timestamp: Date.now(),
                hashId: `navigation_${Date.now()}`
            };
        }
        start() {
            if (this.isRecording) return void debugLog('Recording already active, ignoring start request');
            this.isRecording = true;
            debugLog('Starting event recording');
            this.scrollTargets = [];
            if (0 === this.scrollTargets.length) {
                this.scrollTargets = getAllScrollableElements();
                this.scrollTargets.push(document.body);
            }
            debugLog('Added event listeners for', this.scrollTargets.length, 'scroll targets');
            setTimeout(()=>{
                const navigationEvent = this.createNavigationEvent(window.location.href, document.title);
                this.eventCallback(navigationEvent);
                debugLog('Added final navigation event', navigationEvent);
            }, 0);
            document.addEventListener('click', this.handleClick, true);
            document.addEventListener('input', this.handleInput);
            document.addEventListener('scroll', this.handleScroll, {
                passive: true
            });
            this.scrollTargets.forEach((target)=>{
                target.addEventListener('scroll', this.handleScroll, {
                    passive: true
                });
            });
        }
        stop() {
            if (!this.isRecording) return void debugLog('Recording not active, ignoring stop request');
            this.isRecording = false;
            debugLog('Stopping event recording');
            if (this.scrollThrottleTimer) {
                clearTimeout(this.scrollThrottleTimer);
                this.scrollThrottleTimer = null;
            }
            if (this.inputThrottleTimer) {
                clearTimeout(this.inputThrottleTimer);
                this.inputThrottleTimer = null;
            }
            document.removeEventListener('click', this.handleClick);
            document.removeEventListener('input', this.handleInput);
            this.scrollTargets.forEach((target)=>{
                target.removeEventListener('scroll', this.handleScroll);
            });
            debugLog('Removed all event listeners');
        }
        handleClick = (event)=>{
            if (!this.isRecording) return;
            const target = event.target;
            const { isLabelClick, labelInfo } = this.checkLabelClick(target);
            const rect = target.getBoundingClientRect();
            const elementRect = {
                x: Number(event.clientX.toFixed(2)),
                y: Number(event.clientY.toFixed(2))
            };
            console.log('isNotContainerElement', isNotContainerElement(target));
            if (isNotContainerElement(target)) {
                elementRect.left = Number(rect.left.toFixed(2));
                elementRect.top = Number(rect.top.toFixed(2));
                elementRect.width = Number(rect.width.toFixed(2));
                elementRect.height = Number(rect.height.toFixed(2));
            }
            const clickEvent = {
                type: 'click',
                elementRect,
                pageInfo: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                value: '',
                timestamp: Date.now(),
                hashId: recorder_generateHashId('click', {
                    ...elementRect
                }),
                element: target,
                isLabelClick,
                labelInfo,
                isTrusted: event.isTrusted,
                detail: event.detail
            };
            this.eventCallback(clickEvent);
        };
        handleScroll = (event)=>{
            if (!this.isRecording) return;
            function isDocument(target) {
                return target instanceof Document;
            }
            const target = event.target;
            const scrollXTarget = isDocument(target) ? window.scrollX : target.scrollLeft;
            const scrollYTarget = isDocument(target) ? window.scrollY : target.scrollTop;
            const rect = isDocument(target) ? {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight
            } : target.getBoundingClientRect();
            if (this.scrollThrottleTimer) clearTimeout(this.scrollThrottleTimer);
            this.scrollThrottleTimer = window.setTimeout(()=>{
                if (this.isRecording) {
                    const elementRect = {
                        left: isDocument(target) ? 0 : Number(rect.left.toFixed(2)),
                        top: isDocument(target) ? 0 : Number(rect.top.toFixed(2)),
                        width: isDocument(target) ? window.innerWidth : Number(rect.width.toFixed(2)),
                        height: isDocument(target) ? window.innerHeight : Number(rect.height.toFixed(2))
                    };
                    const scrollEvent = {
                        type: 'scroll',
                        elementRect,
                        pageInfo: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        },
                        value: `${scrollXTarget.toFixed(2)},${scrollYTarget.toFixed(2)}`,
                        timestamp: Date.now(),
                        hashId: recorder_generateHashId('scroll', {
                            ...elementRect
                        }),
                        element: target
                    };
                    this.eventCallback(scrollEvent);
                }
                this.scrollThrottleTimer = null;
            }, this.scrollThrottleDelay);
        };
        handleInput = (event)=>{
            if (!this.isRecording) return;
            const target = event.target;
            if ('checkbox' === target.type) return;
            const rect = target.getBoundingClientRect();
            const elementRect = {
                left: Number(rect.left.toFixed(2)),
                top: Number(rect.top.toFixed(2)),
                width: Number(rect.width.toFixed(2)),
                height: Number(rect.height.toFixed(2))
            };
            if (this.inputThrottleTimer) clearTimeout(this.inputThrottleTimer);
            this.inputThrottleTimer = window.setTimeout(()=>{
                if (this.isRecording) {
                    const inputEvent = {
                        type: 'input',
                        value: 'password' !== target.type ? target.value : '*****',
                        timestamp: Date.now(),
                        hashId: recorder_generateHashId('input', {
                            ...elementRect
                        }),
                        element: target,
                        inputType: target.type || 'text',
                        elementRect,
                        pageInfo: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    };
                    debugLog('Throttled input event:', {
                        value: inputEvent.value,
                        timestamp: inputEvent.timestamp,
                        target: target.tagName,
                        inputType: target.type
                    });
                    this.eventCallback(inputEvent);
                }
                this.inputThrottleTimer = null;
            }, this.inputThrottleDelay);
        };
        checkLabelClick(target) {
            let isLabelClick = false;
            let labelInfo;
            if (target) if ('LABEL' === target.tagName) {
                isLabelClick = true;
                labelInfo = {
                    htmlFor: target.htmlFor,
                    textContent: target.textContent?.trim(),
                    xpath: getElementXpath(target)
                };
            } else {
                let parent = target.parentElement;
                while(parent){
                    if ('LABEL' === parent.tagName) {
                        isLabelClick = true;
                        labelInfo = {
                            htmlFor: parent.htmlFor,
                            textContent: parent.textContent?.trim(),
                            xpath: getElementXpath(parent)
                        };
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            return {
                isLabelClick,
                labelInfo
            };
        }
        isActive() {
            return this.isRecording;
        }
        optimizeEvent(event, events) {
            const lastEvent = events[events.length - 1];
            if ('click' === event.type) {
                const lastEvent = getLastLabelClick(events);
                if (event.element) {
                    const { isLabelClick, labelInfo } = this.checkLabelClick(event.element);
                    if (lastEvent && isLabelClick && 'click' === lastEvent.type && lastEvent.isLabelClick && (lastEvent.labelInfo?.htmlFor && event.element.id && lastEvent.labelInfo?.htmlFor === event.element.id || labelInfo?.xpath && lastEvent.labelInfo?.xpath && lastEvent.labelInfo?.xpath === labelInfo?.xpath)) {
                        debugLog('Skip input event triggered by label click:', event.element);
                        return events;
                    }
                    return [
                        ...events,
                        event
                    ];
                }
            }
            if ('input' === event.type) {
                if (lastEvent && 'click' === lastEvent.type && lastEvent.isLabelClick && lastEvent.labelInfo?.htmlFor === event.targetId) {
                    debugLog('Skipping input event - triggered by label click:', {
                        labelHtmlFor: getLastLabelClick(events)?.labelInfo?.htmlFor,
                        inputId: event.targetId,
                        element: event.element
                    });
                    return events;
                }
                if (lastEvent && 'input' === lastEvent.type && isSameInputTarget(lastEvent, event)) {
                    const oldInputEvent = events[events.length - 1];
                    const newEvents = [
                        ...events
                    ];
                    newEvents[events.length - 1] = {
                        value: event.element?.value,
                        ...event
                    };
                    debugLog('Merging input event:', {
                        oldValue: oldInputEvent.value,
                        newValue: event.value,
                        oldTimestamp: oldInputEvent.timestamp,
                        newTimestamp: event.timestamp,
                        target: event.targetTagName
                    });
                    return newEvents;
                }
            }
            if ('scroll' === event.type) {
                if (lastEvent && 'scroll' === lastEvent.type && isSameScrollTarget(lastEvent, event)) {
                    const oldScrollEvent = events[events.length - 1];
                    const newEvents = [
                        ...events
                    ];
                    newEvents[events.length - 1] = event;
                    debugLog('Replacing last scroll event with new scroll event:', {
                        oldPosition: `${oldScrollEvent.elementRect?.left},${oldScrollEvent.elementRect?.top}`,
                        newPosition: `${event.elementRect?.left},${event.elementRect?.top}`,
                        oldTimestamp: oldScrollEvent.timestamp,
                        newTimestamp: event.timestamp,
                        target: event.targetTagName
                    });
                    return newEvents;
                }
            }
            return [
                ...events,
                event
            ];
        }
    }
    window.EventRecorder = EventRecorder;
})();
