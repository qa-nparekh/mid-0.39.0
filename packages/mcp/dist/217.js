exports.ids = [
    "217"
];
exports.modules = {
    "../../node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js": function(module) {
        "use strict";
        var has = Object.prototype.hasOwnProperty, prefix = '~';
        function Events() {}
        if (Object.create) {
            Events.prototype = Object.create(null);
            if (!new Events().__proto__) prefix = false;
        }
        function EE(fn, context, once) {
            this.fn = fn;
            this.context = context;
            this.once = once || false;
        }
        function addListener(emitter, event, fn, context, once) {
            if ('function' != typeof fn) throw new TypeError('The listener must be a function');
            var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
            if (emitter._events[evt]) if (emitter._events[evt].fn) emitter._events[evt] = [
                emitter._events[evt],
                listener
            ];
            else emitter._events[evt].push(listener);
            else emitter._events[evt] = listener, emitter._eventsCount++;
            return emitter;
        }
        function clearEvent(emitter, evt) {
            if (0 === --emitter._eventsCount) emitter._events = new Events();
            else delete emitter._events[evt];
        }
        function EventEmitter() {
            this._events = new Events();
            this._eventsCount = 0;
        }
        EventEmitter.prototype.eventNames = function() {
            var names = [], events, name;
            if (0 === this._eventsCount) return names;
            for(name in events = this._events)if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
            if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
            return names;
        };
        EventEmitter.prototype.listeners = function(event) {
            var evt = prefix ? prefix + event : event, handlers = this._events[evt];
            if (!handlers) return [];
            if (handlers.fn) return [
                handlers.fn
            ];
            for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
            return ee;
        };
        EventEmitter.prototype.listenerCount = function(event) {
            var evt = prefix ? prefix + event : event, listeners = this._events[evt];
            if (!listeners) return 0;
            if (listeners.fn) return 1;
            return listeners.length;
        };
        EventEmitter.prototype.emit = function(event, a1, a2, a3, a4, a5) {
            var evt = prefix ? prefix + event : event;
            if (!this._events[evt]) return false;
            var listeners = this._events[evt], len = arguments.length, args, i;
            if (listeners.fn) {
                if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
                switch(len){
                    case 1:
                        return listeners.fn.call(listeners.context), true;
                    case 2:
                        return listeners.fn.call(listeners.context, a1), true;
                    case 3:
                        return listeners.fn.call(listeners.context, a1, a2), true;
                    case 4:
                        return listeners.fn.call(listeners.context, a1, a2, a3), true;
                    case 5:
                        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                    case 6:
                        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
                }
                for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
                listeners.fn.apply(listeners.context, args);
            } else {
                var length = listeners.length, j;
                for(i = 0; i < length; i++){
                    if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
                    switch(len){
                        case 1:
                            listeners[i].fn.call(listeners[i].context);
                            break;
                        case 2:
                            listeners[i].fn.call(listeners[i].context, a1);
                            break;
                        case 3:
                            listeners[i].fn.call(listeners[i].context, a1, a2);
                            break;
                        case 4:
                            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                            break;
                        default:
                            if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                            listeners[i].fn.apply(listeners[i].context, args);
                    }
                }
            }
            return true;
        };
        EventEmitter.prototype.on = function(event, fn, context) {
            return addListener(this, event, fn, context, false);
        };
        EventEmitter.prototype.once = function(event, fn, context) {
            return addListener(this, event, fn, context, true);
        };
        EventEmitter.prototype.removeListener = function(event, fn, context, once) {
            var evt = prefix ? prefix + event : event;
            if (!this._events[evt]) return this;
            if (!fn) {
                clearEvent(this, evt);
                return this;
            }
            var listeners = this._events[evt];
            if (listeners.fn) {
                if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
            } else {
                for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
                if (events.length) this._events[evt] = 1 === events.length ? events[0] : events;
                else clearEvent(this, evt);
            }
            return this;
        };
        EventEmitter.prototype.removeAllListeners = function(event) {
            var evt;
            if (event) {
                evt = prefix ? prefix + event : event;
                if (this._events[evt]) clearEvent(this, evt);
            } else {
                this._events = new Events();
                this._eventsCount = 0;
            }
            return this;
        };
        EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
        EventEmitter.prototype.addListener = EventEmitter.prototype.on;
        EventEmitter.prefixed = prefix;
        EventEmitter.EventEmitter = EventEmitter;
        module.exports = EventEmitter;
    },
    "../../node_modules/.pnpm/p-finally@1.0.0/node_modules/p-finally/index.js": function(module) {
        "use strict";
        module.exports = (promise, onFinally)=>{
            onFinally = onFinally || (()=>{});
            return promise.then((val)=>new Promise((resolve)=>{
                    resolve(onFinally());
                }).then(()=>val), (err)=>new Promise((resolve)=>{
                    resolve(onFinally());
                }).then(()=>{
                    throw err;
                }));
        };
    },
    "../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/index.js": function(__unused_webpack_module, exports1, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports1, "__esModule", {
            value: true
        });
        const EventEmitter = __webpack_require__("../../node_modules/.pnpm/eventemitter3@4.0.7/node_modules/eventemitter3/index.js");
        const p_timeout_1 = __webpack_require__("../../node_modules/.pnpm/p-timeout@3.2.0/node_modules/p-timeout/index.js");
        const priority_queue_1 = __webpack_require__("../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/priority-queue.js");
        const empty = ()=>{};
        const timeoutError = new p_timeout_1.TimeoutError();
        class PQueue extends EventEmitter {
            constructor(options){
                var _a, _b, _c, _d;
                super();
                this._intervalCount = 0;
                this._intervalEnd = 0;
                this._pendingCount = 0;
                this._resolveEmpty = empty;
                this._resolveIdle = empty;
                options = Object.assign({
                    carryoverConcurrencyCount: false,
                    intervalCap: 1 / 0,
                    interval: 0,
                    concurrency: 1 / 0,
                    autoStart: true,
                    queueClass: priority_queue_1.default
                }, options);
                if (!('number' == typeof options.intervalCap && options.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (_b = null == (_a = options.intervalCap) ? void 0 : _a.toString()) ? _b : ''}\` (${typeof options.intervalCap})`);
                if (void 0 === options.interval || !(Number.isFinite(options.interval) && options.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (_d = null == (_c = options.interval) ? void 0 : _c.toString()) ? _d : ''}\` (${typeof options.interval})`);
                this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
                this._isIntervalIgnored = options.intervalCap === 1 / 0 || 0 === options.interval;
                this._intervalCap = options.intervalCap;
                this._interval = options.interval;
                this._queue = new options.queueClass();
                this._queueClass = options.queueClass;
                this.concurrency = options.concurrency;
                this._timeout = options.timeout;
                this._throwOnTimeout = true === options.throwOnTimeout;
                this._isPaused = false === options.autoStart;
            }
            get _doesIntervalAllowAnother() {
                return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
                return this._pendingCount < this._concurrency;
            }
            _next() {
                this._pendingCount--;
                this._tryToStartAnother();
                this.emit('next');
            }
            _resolvePromises() {
                this._resolveEmpty();
                this._resolveEmpty = empty;
                if (0 === this._pendingCount) {
                    this._resolveIdle();
                    this._resolveIdle = empty;
                    this.emit('idle');
                }
            }
            _onResumeInterval() {
                this._onInterval();
                this._initializeIntervalIfNeeded();
                this._timeoutId = void 0;
            }
            _isIntervalPaused() {
                const now = Date.now();
                if (void 0 === this._intervalId) {
                    const delay = this._intervalEnd - now;
                    if (delay < 0) this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
                    else {
                        if (void 0 === this._timeoutId) this._timeoutId = setTimeout(()=>{
                            this._onResumeInterval();
                        }, delay);
                        return true;
                    }
                }
                return false;
            }
            _tryToStartAnother() {
                if (0 === this._queue.size) {
                    if (this._intervalId) clearInterval(this._intervalId);
                    this._intervalId = void 0;
                    this._resolvePromises();
                    return false;
                }
                if (!this._isPaused) {
                    const canInitializeInterval = !this._isIntervalPaused();
                    if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                        const job = this._queue.dequeue();
                        if (!job) return false;
                        this.emit('active');
                        job();
                        if (canInitializeInterval) this._initializeIntervalIfNeeded();
                        return true;
                    }
                }
                return false;
            }
            _initializeIntervalIfNeeded() {
                if (this._isIntervalIgnored || void 0 !== this._intervalId) return;
                this._intervalId = setInterval(()=>{
                    this._onInterval();
                }, this._interval);
                this._intervalEnd = Date.now() + this._interval;
            }
            _onInterval() {
                if (0 === this._intervalCount && 0 === this._pendingCount && this._intervalId) {
                    clearInterval(this._intervalId);
                    this._intervalId = void 0;
                }
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
                this._processQueue();
            }
            _processQueue() {
                while(this._tryToStartAnother());
            }
            get concurrency() {
                return this._concurrency;
            }
            set concurrency(newConcurrency) {
                if (!('number' == typeof newConcurrency && newConcurrency >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
                this._concurrency = newConcurrency;
                this._processQueue();
            }
            async add(fn, options = {}) {
                return new Promise((resolve, reject)=>{
                    const run = async ()=>{
                        this._pendingCount++;
                        this._intervalCount++;
                        try {
                            const operation = void 0 === this._timeout && void 0 === options.timeout ? fn() : p_timeout_1.default(Promise.resolve(fn()), void 0 === options.timeout ? this._timeout : options.timeout, ()=>{
                                if (void 0 === options.throwOnTimeout ? this._throwOnTimeout : options.throwOnTimeout) reject(timeoutError);
                            });
                            resolve(await operation);
                        } catch (error) {
                            reject(error);
                        }
                        this._next();
                    };
                    this._queue.enqueue(run, options);
                    this._tryToStartAnother();
                    this.emit('add');
                });
            }
            async addAll(functions, options) {
                return Promise.all(functions.map(async (function_)=>this.add(function_, options)));
            }
            start() {
                if (!this._isPaused) return this;
                this._isPaused = false;
                this._processQueue();
                return this;
            }
            pause() {
                this._isPaused = true;
            }
            clear() {
                this._queue = new this._queueClass();
            }
            async onEmpty() {
                if (0 === this._queue.size) return;
                return new Promise((resolve)=>{
                    const existingResolve = this._resolveEmpty;
                    this._resolveEmpty = ()=>{
                        existingResolve();
                        resolve();
                    };
                });
            }
            async onIdle() {
                if (0 === this._pendingCount && 0 === this._queue.size) return;
                return new Promise((resolve)=>{
                    const existingResolve = this._resolveIdle;
                    this._resolveIdle = ()=>{
                        existingResolve();
                        resolve();
                    };
                });
            }
            get size() {
                return this._queue.size;
            }
            sizeBy(options) {
                return this._queue.filter(options).length;
            }
            get pending() {
                return this._pendingCount;
            }
            get isPaused() {
                return this._isPaused;
            }
            get timeout() {
                return this._timeout;
            }
            set timeout(milliseconds) {
                this._timeout = milliseconds;
            }
        }
        exports1["default"] = PQueue;
    },
    "../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/lower-bound.js": function(__unused_webpack_module, exports1) {
        "use strict";
        Object.defineProperty(exports1, "__esModule", {
            value: true
        });
        function lowerBound(array, value, comparator) {
            let first = 0;
            let count = array.length;
            while(count > 0){
                const step = count / 2 | 0;
                let it = first + step;
                if (comparator(array[it], value) <= 0) {
                    first = ++it;
                    count -= step + 1;
                } else count = step;
            }
            return first;
        }
        exports1["default"] = lowerBound;
    },
    "../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/priority-queue.js": function(__unused_webpack_module, exports1, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports1, "__esModule", {
            value: true
        });
        const lower_bound_1 = __webpack_require__("../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/lower-bound.js");
        class PriorityQueue {
            constructor(){
                this._queue = [];
            }
            enqueue(run, options) {
                options = Object.assign({
                    priority: 0
                }, options);
                const element = {
                    priority: options.priority,
                    run
                };
                if (this.size && this._queue[this.size - 1].priority >= options.priority) return void this._queue.push(element);
                const index = lower_bound_1.default(this._queue, element, (a, b)=>b.priority - a.priority);
                this._queue.splice(index, 0, element);
            }
            dequeue() {
                const item = this._queue.shift();
                return null == item ? void 0 : item.run;
            }
            filter(options) {
                return this._queue.filter((element)=>element.priority === options.priority).map((element)=>element.run);
            }
            get size() {
                return this._queue.length;
            }
        }
        exports1["default"] = PriorityQueue;
    },
    "../../node_modules/.pnpm/p-retry@4.6.2/node_modules/p-retry/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const retry = __webpack_require__("../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/index.js");
        const networkErrorMsgs = [
            'Failed to fetch',
            'NetworkError when attempting to fetch resource.',
            'The Internet connection appears to be offline.',
            'Network request failed'
        ];
        class AbortError extends Error {
            constructor(message){
                super();
                if (message instanceof Error) {
                    this.originalError = message;
                    ({ message } = message);
                } else {
                    this.originalError = new Error(message);
                    this.originalError.stack = this.stack;
                }
                this.name = 'AbortError';
                this.message = message;
            }
        }
        const decorateErrorWithCounts = (error, attemptNumber, options)=>{
            const retriesLeft = options.retries - (attemptNumber - 1);
            error.attemptNumber = attemptNumber;
            error.retriesLeft = retriesLeft;
            return error;
        };
        const isNetworkError = (errorMessage)=>networkErrorMsgs.includes(errorMessage);
        const pRetry = (input, options)=>new Promise((resolve, reject)=>{
                options = {
                    onFailedAttempt: ()=>{},
                    retries: 10,
                    ...options
                };
                const operation = retry.operation(options);
                operation.attempt(async (attemptNumber)=>{
                    try {
                        resolve(await input(attemptNumber));
                    } catch (error) {
                        if (!(error instanceof Error)) return void reject(new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`));
                        if (error instanceof AbortError) {
                            operation.stop();
                            reject(error.originalError);
                        } else if (error instanceof TypeError && !isNetworkError(error.message)) {
                            operation.stop();
                            reject(error);
                        } else {
                            decorateErrorWithCounts(error, attemptNumber, options);
                            try {
                                await options.onFailedAttempt(error);
                            } catch (error) {
                                reject(error);
                                return;
                            }
                            if (!operation.retry(error)) reject(operation.mainError());
                        }
                    }
                });
            });
        module.exports = pRetry;
        module.exports["default"] = pRetry;
        module.exports.AbortError = AbortError;
    },
    "../../node_modules/.pnpm/p-timeout@3.2.0/node_modules/p-timeout/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        "use strict";
        const pFinally = __webpack_require__("../../node_modules/.pnpm/p-finally@1.0.0/node_modules/p-finally/index.js");
        class TimeoutError extends Error {
            constructor(message){
                super(message);
                this.name = 'TimeoutError';
            }
        }
        const pTimeout = (promise, milliseconds, fallback)=>new Promise((resolve, reject)=>{
                if ('number' != typeof milliseconds || milliseconds < 0) throw new TypeError('Expected `milliseconds` to be a positive number');
                if (milliseconds === 1 / 0) return void resolve(promise);
                const timer = setTimeout(()=>{
                    if ('function' == typeof fallback) {
                        try {
                            resolve(fallback());
                        } catch (error) {
                            reject(error);
                        }
                        return;
                    }
                    const message = 'string' == typeof fallback ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
                    const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
                    if ('function' == typeof promise.cancel) promise.cancel();
                    reject(timeoutError);
                }, milliseconds);
                pFinally(promise.then(resolve, reject), ()=>{
                    clearTimeout(timer);
                });
            });
        module.exports = pTimeout;
        module.exports["default"] = pTimeout;
        module.exports.TimeoutError = TimeoutError;
    },
    "../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = __webpack_require__("../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry.js");
    },
    "../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry.js": function(__unused_webpack_module, exports1, __webpack_require__) {
        var RetryOperation = __webpack_require__("../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry_operation.js");
        exports1.operation = function(options) {
            var timeouts = exports1.timeouts(options);
            return new RetryOperation(timeouts, {
                forever: options && (options.forever || options.retries === 1 / 0),
                unref: options && options.unref,
                maxRetryTime: options && options.maxRetryTime
            });
        };
        exports1.timeouts = function(options) {
            if (options instanceof Array) return [].concat(options);
            var opts = {
                retries: 10,
                factor: 2,
                minTimeout: 1000,
                maxTimeout: 1 / 0,
                randomize: false
            };
            for(var key in options)opts[key] = options[key];
            if (opts.minTimeout > opts.maxTimeout) throw new Error('minTimeout is greater than maxTimeout');
            var timeouts = [];
            for(var i = 0; i < opts.retries; i++)timeouts.push(this.createTimeout(i, opts));
            if (options && options.forever && !timeouts.length) timeouts.push(this.createTimeout(i, opts));
            timeouts.sort(function(a, b) {
                return a - b;
            });
            return timeouts;
        };
        exports1.createTimeout = function(attempt, opts) {
            var random = opts.randomize ? Math.random() + 1 : 1;
            var timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
            timeout = Math.min(timeout, opts.maxTimeout);
            return timeout;
        };
        exports1.wrap = function(obj, options, methods) {
            if (options instanceof Array) {
                methods = options;
                options = null;
            }
            if (!methods) {
                methods = [];
                for(var key in obj)if ('function' == typeof obj[key]) methods.push(key);
            }
            for(var i = 0; i < methods.length; i++){
                var method = methods[i];
                var original = obj[method];
                obj[method] = (function(original) {
                    var op = exports1.operation(options);
                    var args = Array.prototype.slice.call(arguments, 1);
                    var callback = args.pop();
                    args.push(function(err) {
                        if (op.retry(err)) return;
                        if (err) arguments[0] = op.mainError();
                        callback.apply(this, arguments);
                    });
                    op.attempt(function() {
                        original.apply(obj, args);
                    });
                }).bind(obj, original);
                obj[method].options = options;
            }
        };
    },
    "../../node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry_operation.js": function(module) {
        function RetryOperation(timeouts, options) {
            if ('boolean' == typeof options) options = {
                forever: options
            };
            this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
            this._timeouts = timeouts;
            this._options = options || {};
            this._maxRetryTime = options && options.maxRetryTime || 1 / 0;
            this._fn = null;
            this._errors = [];
            this._attempts = 1;
            this._operationTimeout = null;
            this._operationTimeoutCb = null;
            this._timeout = null;
            this._operationStart = null;
            this._timer = null;
            if (this._options.forever) this._cachedTimeouts = this._timeouts.slice(0);
        }
        module.exports = RetryOperation;
        RetryOperation.prototype.reset = function() {
            this._attempts = 1;
            this._timeouts = this._originalTimeouts.slice(0);
        };
        RetryOperation.prototype.stop = function() {
            if (this._timeout) clearTimeout(this._timeout);
            if (this._timer) clearTimeout(this._timer);
            this._timeouts = [];
            this._cachedTimeouts = null;
        };
        RetryOperation.prototype.retry = function(err) {
            if (this._timeout) clearTimeout(this._timeout);
            if (!err) return false;
            var currentTime = new Date().getTime();
            if (err && currentTime - this._operationStart >= this._maxRetryTime) {
                this._errors.push(err);
                this._errors.unshift(new Error('RetryOperation timeout occurred'));
                return false;
            }
            this._errors.push(err);
            var timeout = this._timeouts.shift();
            if (void 0 === timeout) if (!this._cachedTimeouts) return false;
            else {
                this._errors.splice(0, this._errors.length - 1);
                timeout = this._cachedTimeouts.slice(-1);
            }
            var self = this;
            this._timer = setTimeout(function() {
                self._attempts++;
                if (self._operationTimeoutCb) {
                    self._timeout = setTimeout(function() {
                        self._operationTimeoutCb(self._attempts);
                    }, self._operationTimeout);
                    if (self._options.unref) self._timeout.unref();
                }
                self._fn(self._attempts);
            }, timeout);
            if (this._options.unref) this._timer.unref();
            return true;
        };
        RetryOperation.prototype.attempt = function(fn, timeoutOps) {
            this._fn = fn;
            if (timeoutOps) {
                if (timeoutOps.timeout) this._operationTimeout = timeoutOps.timeout;
                if (timeoutOps.cb) this._operationTimeoutCb = timeoutOps.cb;
            }
            var self = this;
            if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
                self._operationTimeoutCb();
            }, self._operationTimeout);
            this._operationStart = new Date().getTime();
            this._fn(this._attempts);
        };
        RetryOperation.prototype.try = function(fn) {
            console.log('Using RetryOperation.try() is deprecated');
            this.attempt(fn);
        };
        RetryOperation.prototype.start = function(fn) {
            console.log('Using RetryOperation.start() is deprecated');
            this.attempt(fn);
        };
        RetryOperation.prototype.start = RetryOperation.prototype.try;
        RetryOperation.prototype.errors = function() {
            return this._errors;
        };
        RetryOperation.prototype.attempts = function() {
            return this._attempts;
        };
        RetryOperation.prototype.mainError = function() {
            if (0 === this._errors.length) return null;
            var counts = {};
            var mainError = null;
            var mainErrorCount = 0;
            for(var i = 0; i < this._errors.length; i++){
                var error = this._errors[i];
                var message = error.message;
                var count = (counts[message] || 0) + 1;
                counts[message] = count;
                if (count >= mainErrorCount) {
                    mainError = error;
                    mainErrorCount = count;
                }
            }
            return mainError;
        };
    },
    "../../node_modules/.pnpm/langsmith@0.3.7_openai@4.81.0_ws@8.18.3_zod@3.24.3_/node_modules/langsmith/wrappers.js": function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, {
            wrapOpenAI: ()=>wrapOpenAI
        });
        var external_node_async_hooks_ = __webpack_require__("node:async_hooks");
        var external_node_crypto_ = __webpack_require__("node:crypto");
        var external_node_crypto_default = /*#__PURE__*/ __webpack_require__.n(external_node_crypto_);
        const esm_node_native = {
            randomUUID: external_node_crypto_default().randomUUID
        };
        const rnds8Pool = new Uint8Array(256);
        let poolPtr = rnds8Pool.length;
        function rng() {
            if (poolPtr > rnds8Pool.length - 16) {
                external_node_crypto_default().randomFillSync(rnds8Pool);
                poolPtr = 0;
            }
            return rnds8Pool.slice(poolPtr, poolPtr += 16);
        }
        const byteToHex = [];
        for(let i = 0; i < 256; ++i)byteToHex.push((i + 0x100).toString(16).slice(1));
        function unsafeStringify(arr, offset = 0) {
            return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
        }
        function v4_v4(options, buf, offset) {
            if (esm_node_native.randomUUID && !buf && !options) return esm_node_native.randomUUID();
            options = options || {};
            const rnds = options.random || (options.rng || rng)();
            rnds[6] = 0x0f & rnds[6] | 0x40;
            rnds[8] = 0x3f & rnds[8] | 0x80;
            if (buf) {
                offset = offset || 0;
                for(let i = 0; i < 16; ++i)buf[offset + i] = rnds[i];
                return buf;
            }
            return unsafeStringify(rnds);
        }
        const v4 = v4_v4;
        var p_retry = __webpack_require__("../../node_modules/.pnpm/p-retry@4.6.2/node_modules/p-retry/index.js");
        var dist = __webpack_require__("../../node_modules/.pnpm/p-queue@6.6.2/node_modules/p-queue/dist/index.js");
        const DEFAULT_FETCH_IMPLEMENTATION = (...args)=>fetch(...args);
        const LANGSMITH_FETCH_IMPLEMENTATION_KEY = Symbol.for("ls:fetch_implementation");
        const _getFetchImplementation = ()=>globalThis[LANGSMITH_FETCH_IMPLEMENTATION_KEY] ?? DEFAULT_FETCH_IMPLEMENTATION;
        const STATUS_NO_RETRY = [
            400,
            401,
            403,
            404,
            405,
            406,
            407,
            408
        ];
        const STATUS_IGNORE = [
            409
        ];
        class AsyncCaller {
            constructor(params){
                Object.defineProperty(this, "maxConcurrency", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "maxRetries", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "queue", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "onFailedResponseHook", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.maxConcurrency = params.maxConcurrency ?? 1 / 0;
                this.maxRetries = params.maxRetries ?? 6;
                if ("default" in dist) this.queue = new dist["default"]({
                    concurrency: this.maxConcurrency
                });
                else this.queue = new dist({
                    concurrency: this.maxConcurrency
                });
                this.onFailedResponseHook = params?.onFailedResponseHook;
            }
            call(callable, ...args) {
                const onFailedResponseHook = this.onFailedResponseHook;
                return this.queue.add(()=>p_retry(()=>callable(...args).catch((error)=>{
                            if (error instanceof Error) throw error;
                            throw new Error(error);
                        }), {
                        async onFailedAttempt (error) {
                            if (error.message.startsWith("Cancel") || error.message.startsWith("TimeoutError") || error.message.startsWith("AbortError")) throw error;
                            if (error?.code === "ECONNABORTED") throw error;
                            const response = error?.response;
                            const status = response?.status;
                            if (status) {
                                if (STATUS_NO_RETRY.includes(+status)) throw error;
                                if (STATUS_IGNORE.includes(+status)) return;
                                if (onFailedResponseHook) await onFailedResponseHook(response);
                            }
                        },
                        retries: this.maxRetries,
                        randomize: true
                    }), {
                    throwOnTimeout: true
                });
            }
            callWithOptions(options, callable, ...args) {
                if (options.signal) return Promise.race([
                    this.call(callable, ...args),
                    new Promise((_, reject)=>{
                        options.signal?.addEventListener("abort", ()=>{
                            reject(new Error("AbortError"));
                        });
                    })
                ]);
                return this.call(callable, ...args);
            }
            fetch(...args) {
                return this.call(()=>_getFetchImplementation()(...args).then((res)=>res.ok ? res : Promise.reject(res)));
            }
        }
        function isLangChainMessage(message) {
            return "function" == typeof message?._getType;
        }
        function convertLangChainMessageToExample(message) {
            const converted = {
                type: message._getType(),
                data: {
                    content: message.content
                }
            };
            if (message?.additional_kwargs && Object.keys(message.additional_kwargs).length > 0) converted.data.additional_kwargs = {
                ...message.additional_kwargs
            };
            return converted;
        }
        const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
        function validate_validate(uuid) {
            return 'string' == typeof uuid && regex.test(uuid);
        }
        const esm_node_validate = validate_validate;
        function assertUuid(str, which) {
            if (!esm_node_validate(str)) {
                const msg = void 0 !== which ? `Invalid UUID for ${which}: ${str}` : `Invalid UUID: ${str}`;
                throw new Error(msg);
            }
            return str;
        }
        const warnedMessages = {};
        function warnOnce(message) {
            if (!warnedMessages[message]) {
                console.warn(message);
                warnedMessages[message] = true;
            }
        }
        __webpack_require__("../../node_modules/.pnpm/semver@7.7.2/node_modules/semver/index.js");
        function parsePromptIdentifier(identifier) {
            if (!identifier || identifier.split("/").length > 2 || identifier.startsWith("/") || identifier.endsWith("/") || identifier.split(":").length > 2) throw new Error(`Invalid identifier format: ${identifier}`);
            const [ownerNamePart, commitPart] = identifier.split(":");
            const commit = commitPart || "latest";
            if (ownerNamePart.includes("/")) {
                const [owner, name] = ownerNamePart.split("/", 2);
                if (!owner || !name) throw new Error(`Invalid identifier format: ${identifier}`);
                return [
                    owner,
                    name,
                    commit
                ];
            }
            if (!ownerNamePart) throw new Error(`Invalid identifier format: ${identifier}`);
            return [
                "-",
                ownerNamePart,
                commit
            ];
        }
        class LangSmithConflictError extends Error {
            constructor(message){
                super(message);
                this.name = "LangSmithConflictError";
            }
        }
        async function raiseForStatus(response, context, consume) {
            let errorBody;
            if (response.ok) {
                if (consume) errorBody = await response.text();
                return;
            }
            errorBody = await response.text();
            const fullMessage = `Failed to ${context}. Received status [${response.status}]: ${response.statusText}. Server response: ${errorBody}`;
            if (409 === response.status) throw new LangSmithConflictError(fullMessage);
            throw new Error(fullMessage);
        }
        var LIMIT_REPLACE_NODE = "[...]";
        var CIRCULAR_REPLACE_NODE = {
            result: "[Circular]"
        };
        var fast_safe_stringify_arr = [];
        var replacerStack = [];
        const encoder = new TextEncoder();
        function defaultOptions() {
            return {
                depthLimit: Number.MAX_SAFE_INTEGER,
                edgesLimit: Number.MAX_SAFE_INTEGER
            };
        }
        function encodeString(str) {
            return encoder.encode(str);
        }
        function serialize(obj, replacer, spacer, options) {
            try {
                const str = JSON.stringify(obj, replacer, spacer);
                return encodeString(str);
            } catch (e) {
                if (!e.message?.includes("Converting circular structure to JSON")) {
                    console.warn("[WARNING]: LangSmith received unserializable value.");
                    return encodeString("[Unserializable]");
                }
                console.warn("[WARNING]: LangSmith received circular JSON. This will decrease tracer performance.");
                if (void 0 === options) options = defaultOptions();
                decirc(obj, "", 0, [], void 0, 0, options);
                let res;
                try {
                    res = 0 === replacerStack.length ? JSON.stringify(obj, replacer, spacer) : JSON.stringify(obj, replaceGetterValues(replacer), spacer);
                } catch (_) {
                    return encodeString("[unable to serialize, circular reference is too complex to analyze]");
                } finally{
                    while(0 !== fast_safe_stringify_arr.length){
                        const part = fast_safe_stringify_arr.pop();
                        if (4 === part.length) Object.defineProperty(part[0], part[1], part[3]);
                        else part[0][part[1]] = part[2];
                    }
                }
                return encodeString(res);
            }
        }
        function setReplace(replace, val, k, parent) {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
            if (void 0 !== propertyDescriptor.get) if (propertyDescriptor.configurable) {
                Object.defineProperty(parent, k, {
                    value: replace
                });
                fast_safe_stringify_arr.push([
                    parent,
                    k,
                    val,
                    propertyDescriptor
                ]);
            } else replacerStack.push([
                val,
                k,
                replace
            ]);
            else {
                parent[k] = replace;
                fast_safe_stringify_arr.push([
                    parent,
                    k,
                    val
                ]);
            }
        }
        function decirc(val, k, edgeIndex, stack, parent, depth, options) {
            depth += 1;
            var i;
            if ("object" == typeof val && null !== val) {
                for(i = 0; i < stack.length; i++)if (stack[i] === val) return void setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
                if (void 0 !== options.depthLimit && depth > options.depthLimit) return void setReplace(LIMIT_REPLACE_NODE, val, k, parent);
                if (void 0 !== options.edgesLimit && edgeIndex + 1 > options.edgesLimit) return void setReplace(LIMIT_REPLACE_NODE, val, k, parent);
                stack.push(val);
                if (Array.isArray(val)) for(i = 0; i < val.length; i++)decirc(val[i], i, i, stack, val, depth, options);
                else {
                    var keys = Object.keys(val);
                    for(i = 0; i < keys.length; i++){
                        var key = keys[i];
                        decirc(val[key], key, i, stack, val, depth, options);
                    }
                }
                stack.pop();
            }
        }
        function replaceGetterValues(replacer) {
            replacer = void 0 !== replacer ? replacer : function(k, v) {
                return v;
            };
            return function(key, val) {
                if (replacerStack.length > 0) for(var i = 0; i < replacerStack.length; i++){
                    var part = replacerStack[i];
                    if (part[1] === key && part[0] === val) {
                        val = part[2];
                        replacerStack.splice(i, 1);
                        break;
                    }
                }
                return replacer.call(this, key, val);
            };
        }
        function mergeRuntimeEnvIntoRunCreate(run) {
            const runtimeEnv = getRuntimeEnvironment();
            const envVars = getLangChainEnvVarsMetadata();
            const extra = run.extra ?? {};
            const metadata = extra.metadata;
            run.extra = {
                ...extra,
                runtime: {
                    ...runtimeEnv,
                    ...extra?.runtime
                },
                metadata: {
                    ...envVars,
                    ...envVars.revision_id || run.revision_id ? {
                        revision_id: run.revision_id ?? envVars.revision_id
                    } : {},
                    ...metadata
                }
            };
            return run;
        }
        const getTracingSamplingRate = ()=>{
            const samplingRateStr = getLangSmithEnvironmentVariable("TRACING_SAMPLING_RATE");
            if (void 0 === samplingRateStr) return;
            const samplingRate = parseFloat(samplingRateStr);
            if (samplingRate < 0 || samplingRate > 1) throw new Error(`LANGSMITH_TRACING_SAMPLING_RATE must be between 0 and 1 if set. Got: ${samplingRate}`);
            return samplingRate;
        };
        const isLocalhost = (url)=>{
            const strippedUrl = url.replace("http://", "").replace("https://", "");
            const hostname = strippedUrl.split("/")[0].split(":")[0];
            return "localhost" === hostname || "127.0.0.1" === hostname || "::1" === hostname;
        };
        async function toArray(iterable) {
            const result = [];
            for await (const item of iterable)result.push(item);
            return result;
        }
        function trimQuotes(str) {
            if (void 0 === str) return;
            return str.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        }
        const handle429 = async (response)=>{
            if (response?.status === 429) {
                const retryAfter = 1000 * parseInt(response.headers.get("retry-after") ?? "30", 10);
                if (retryAfter > 0) {
                    await new Promise((resolve)=>setTimeout(resolve, retryAfter));
                    return true;
                }
            }
            return false;
        };
        class AutoBatchQueue {
            constructor(){
                Object.defineProperty(this, "items", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: []
                });
                Object.defineProperty(this, "sizeBytes", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 0
                });
            }
            peek() {
                return this.items[0];
            }
            push(item) {
                let itemPromiseResolve;
                const itemPromise = new Promise((resolve)=>{
                    itemPromiseResolve = resolve;
                });
                const size = serialize(item.item).length;
                this.items.push({
                    action: item.action,
                    payload: item.item,
                    itemPromiseResolve: itemPromiseResolve,
                    itemPromise,
                    size
                });
                this.sizeBytes += size;
                return itemPromise;
            }
            pop(upToSizeBytes) {
                if (upToSizeBytes < 1) throw new Error("Number of bytes to pop off may not be less than 1.");
                const popped = [];
                let poppedSizeBytes = 0;
                while(poppedSizeBytes + (this.peek()?.size ?? 0) < upToSizeBytes && this.items.length > 0){
                    const item = this.items.shift();
                    if (item) {
                        popped.push(item);
                        poppedSizeBytes += item.size;
                        this.sizeBytes -= item.size;
                    }
                }
                if (0 === popped.length && this.items.length > 0) {
                    const item = this.items.shift();
                    popped.push(item);
                    poppedSizeBytes += item.size;
                    this.sizeBytes -= item.size;
                }
                return [
                    popped.map((it)=>({
                            action: it.action,
                            item: it.payload
                        })),
                    ()=>popped.forEach((it)=>it.itemPromiseResolve())
                ];
            }
        }
        const DEFAULT_BATCH_SIZE_LIMIT_BYTES = 20971520;
        const SERVER_INFO_REQUEST_TIMEOUT = 2500;
        class Client {
            constructor(config = {}){
                Object.defineProperty(this, "apiKey", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "apiUrl", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "webUrl", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "caller", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "batchIngestCaller", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "timeout_ms", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "_tenantId", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: null
                });
                Object.defineProperty(this, "hideInputs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "hideOutputs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tracingSampleRate", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "filteredPostUuids", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Set()
                });
                Object.defineProperty(this, "autoBatchTracing", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: true
                });
                Object.defineProperty(this, "autoBatchQueue", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new AutoBatchQueue()
                });
                Object.defineProperty(this, "autoBatchTimeout", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "autoBatchAggregationDelayMs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 250
                });
                Object.defineProperty(this, "batchSizeBytesLimit", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "fetchOptions", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "settings", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "blockOnRootRunFinalization", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: "false" === getEnvironmentVariable("LANGSMITH_TRACING_BACKGROUND")
                });
                Object.defineProperty(this, "traceBatchConcurrency", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 5
                });
                Object.defineProperty(this, "_serverInfo", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "_getServerInfoPromise", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "manualFlushMode", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
                const defaultConfig = Client.getDefaultClientConfig();
                this.tracingSampleRate = getTracingSamplingRate();
                this.apiUrl = trimQuotes(config.apiUrl ?? defaultConfig.apiUrl) ?? "";
                if (this.apiUrl.endsWith("/")) this.apiUrl = this.apiUrl.slice(0, -1);
                this.apiKey = trimQuotes(config.apiKey ?? defaultConfig.apiKey);
                this.webUrl = trimQuotes(config.webUrl ?? defaultConfig.webUrl);
                if (this.webUrl?.endsWith("/")) this.webUrl = this.webUrl.slice(0, -1);
                this.timeout_ms = config.timeout_ms ?? 90000;
                this.caller = new AsyncCaller(config.callerOptions ?? {});
                this.traceBatchConcurrency = config.traceBatchConcurrency ?? this.traceBatchConcurrency;
                if (this.traceBatchConcurrency < 1) throw new Error("Trace batch concurrency must be positive.");
                this.batchIngestCaller = new AsyncCaller({
                    maxRetries: 2,
                    maxConcurrency: this.traceBatchConcurrency,
                    ...config.callerOptions ?? {},
                    onFailedResponseHook: handle429
                });
                this.hideInputs = config.hideInputs ?? config.anonymizer ?? defaultConfig.hideInputs;
                this.hideOutputs = config.hideOutputs ?? config.anonymizer ?? defaultConfig.hideOutputs;
                this.autoBatchTracing = config.autoBatchTracing ?? this.autoBatchTracing;
                this.blockOnRootRunFinalization = config.blockOnRootRunFinalization ?? this.blockOnRootRunFinalization;
                this.batchSizeBytesLimit = config.batchSizeBytesLimit;
                this.fetchOptions = config.fetchOptions || {};
                this.manualFlushMode = config.manualFlushMode ?? this.manualFlushMode;
            }
            static getDefaultClientConfig() {
                const apiKey = getLangSmithEnvironmentVariable("API_KEY");
                const apiUrl = getLangSmithEnvironmentVariable("ENDPOINT") ?? "https://api.smith.langchain.com";
                const hideInputs = "true" === getLangSmithEnvironmentVariable("HIDE_INPUTS");
                const hideOutputs = "true" === getLangSmithEnvironmentVariable("HIDE_OUTPUTS");
                return {
                    apiUrl: apiUrl,
                    apiKey: apiKey,
                    webUrl: void 0,
                    hideInputs: hideInputs,
                    hideOutputs: hideOutputs
                };
            }
            getHostUrl() {
                if (this.webUrl) return this.webUrl;
                if (isLocalhost(this.apiUrl)) {
                    this.webUrl = "http://localhost:3000";
                    return this.webUrl;
                }
                if (this.apiUrl.endsWith("/api/v1")) {
                    this.webUrl = this.apiUrl.replace("/api/v1", "");
                    return this.webUrl;
                }
                if (this.apiUrl.includes("/api") && !this.apiUrl.split(".", 1)[0].endsWith("api")) {
                    this.webUrl = this.apiUrl.replace("/api", "");
                    return this.webUrl;
                }
                if (this.apiUrl.split(".", 1)[0].includes("dev")) {
                    this.webUrl = "https://dev.smith.langchain.com";
                    return this.webUrl;
                } else if (this.apiUrl.split(".", 1)[0].includes("eu")) {
                    this.webUrl = "https://eu.smith.langchain.com";
                    return this.webUrl;
                } else if (this.apiUrl.split(".", 1)[0].includes("beta")) {
                    this.webUrl = "https://beta.smith.langchain.com";
                    return this.webUrl;
                } else {
                    this.webUrl = "https://smith.langchain.com";
                    return this.webUrl;
                }
            }
            get headers() {
                const headers = {
                    "User-Agent": `langsmith-js/${__version__}`
                };
                if (this.apiKey) headers["x-api-key"] = `${this.apiKey}`;
                return headers;
            }
            processInputs(inputs) {
                if (false === this.hideInputs) return inputs;
                if (true === this.hideInputs) return {};
                if ("function" == typeof this.hideInputs) return this.hideInputs(inputs);
                return inputs;
            }
            processOutputs(outputs) {
                if (false === this.hideOutputs) return outputs;
                if (true === this.hideOutputs) return {};
                if ("function" == typeof this.hideOutputs) return this.hideOutputs(outputs);
                return outputs;
            }
            prepareRunCreateOrUpdateInputs(run) {
                const runParams = {
                    ...run
                };
                if (void 0 !== runParams.inputs) runParams.inputs = this.processInputs(runParams.inputs);
                if (void 0 !== runParams.outputs) runParams.outputs = this.processOutputs(runParams.outputs);
                return runParams;
            }
            async _getResponse(path, queryParams) {
                const paramsString = queryParams?.toString() ?? "";
                const url = `${this.apiUrl}${path}?${paramsString}`;
                const response = await this.caller.call(_getFetchImplementation(), url, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `Failed to fetch ${path}`);
                return response;
            }
            async _get(path, queryParams) {
                const response = await this._getResponse(path, queryParams);
                return response.json();
            }
            async *_getPaginated(path, queryParams = new URLSearchParams(), transform) {
                let offset = Number(queryParams.get("offset")) || 0;
                const limit = Number(queryParams.get("limit")) || 100;
                while(true){
                    queryParams.set("offset", String(offset));
                    queryParams.set("limit", String(limit));
                    const url = `${this.apiUrl}${path}?${queryParams}`;
                    const response = await this.caller.call(_getFetchImplementation(), url, {
                        method: "GET",
                        headers: this.headers,
                        signal: AbortSignal.timeout(this.timeout_ms),
                        ...this.fetchOptions
                    });
                    await raiseForStatus(response, `Failed to fetch ${path}`);
                    const items = transform ? transform(await response.json()) : await response.json();
                    if (0 === items.length) break;
                    yield items;
                    if (items.length < limit) break;
                    offset += items.length;
                }
            }
            async *_getCursorPaginatedList(path, body = null, requestMethod = "POST", dataKey = "runs") {
                const bodyParams = body ? {
                    ...body
                } : {};
                while(true){
                    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}`, {
                        method: requestMethod,
                        headers: {
                            ...this.headers,
                            "Content-Type": "application/json"
                        },
                        signal: AbortSignal.timeout(this.timeout_ms),
                        ...this.fetchOptions,
                        body: JSON.stringify(bodyParams)
                    });
                    const responseBody = await response.json();
                    if (!responseBody) break;
                    if (!responseBody[dataKey]) break;
                    yield responseBody[dataKey];
                    const cursors = responseBody.cursors;
                    if (!cursors) break;
                    if (!cursors.next) break;
                    bodyParams.cursor = cursors.next;
                }
            }
            _filterForSampling(runs, patch = false) {
                if (void 0 === this.tracingSampleRate) return runs;
                if (patch) {
                    const sampled = [];
                    for (const run of runs)if (this.filteredPostUuids.has(run.id)) this.filteredPostUuids.delete(run.id);
                    else sampled.push(run);
                    return sampled;
                }
                {
                    const sampled = [];
                    for (const run of runs)if (run.id !== run.trace_id && !this.filteredPostUuids.has(run.trace_id) || Math.random() < this.tracingSampleRate) sampled.push(run);
                    else this.filteredPostUuids.add(run.id);
                    return sampled;
                }
            }
            async _getBatchSizeLimitBytes() {
                const serverInfo = await this._ensureServerInfo();
                return this.batchSizeBytesLimit ?? serverInfo.batch_ingest_config?.size_limit_bytes ?? DEFAULT_BATCH_SIZE_LIMIT_BYTES;
            }
            async _getMultiPartSupport() {
                const serverInfo = await this._ensureServerInfo();
                return serverInfo.instance_flags?.dataset_examples_multipart_enabled ?? false;
            }
            drainAutoBatchQueue(batchSizeLimit) {
                const promises = [];
                while(this.autoBatchQueue.items.length > 0){
                    const [batch, done] = this.autoBatchQueue.pop(batchSizeLimit);
                    if (!batch.length) {
                        done();
                        break;
                    }
                    const batchPromise = this._processBatch(batch, done).catch(console.error);
                    promises.push(batchPromise);
                }
                return Promise.all(promises);
            }
            async _processBatch(batch, done) {
                if (!batch.length) return void done();
                try {
                    const ingestParams = {
                        runCreates: batch.filter((item)=>"create" === item.action).map((item)=>item.item),
                        runUpdates: batch.filter((item)=>"update" === item.action).map((item)=>item.item)
                    };
                    const serverInfo = await this._ensureServerInfo();
                    if (serverInfo?.batch_ingest_config?.use_multipart_endpoint) await this.multipartIngestRuns(ingestParams);
                    else await this.batchIngestRuns(ingestParams);
                } finally{
                    done();
                }
            }
            async processRunOperation(item) {
                clearTimeout(this.autoBatchTimeout);
                this.autoBatchTimeout = void 0;
                if ("create" === item.action) item.item = mergeRuntimeEnvIntoRunCreate(item.item);
                const itemPromise = this.autoBatchQueue.push(item);
                if (this.manualFlushMode) return itemPromise;
                const sizeLimitBytes = await this._getBatchSizeLimitBytes();
                if (this.autoBatchQueue.sizeBytes > sizeLimitBytes) this.drainAutoBatchQueue(sizeLimitBytes);
                if (this.autoBatchQueue.items.length > 0) this.autoBatchTimeout = setTimeout(()=>{
                    this.autoBatchTimeout = void 0;
                    this.drainAutoBatchQueue(sizeLimitBytes);
                }, this.autoBatchAggregationDelayMs);
                return itemPromise;
            }
            async _getServerInfo() {
                const response = await _getFetchImplementation()(`${this.apiUrl}/info`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    },
                    signal: AbortSignal.timeout(SERVER_INFO_REQUEST_TIMEOUT),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "get server info");
                return response.json();
            }
            async _ensureServerInfo() {
                if (void 0 === this._getServerInfoPromise) this._getServerInfoPromise = (async ()=>{
                    if (void 0 === this._serverInfo) try {
                        this._serverInfo = await this._getServerInfo();
                    } catch (e) {
                        console.warn("[WARNING]: LangSmith failed to fetch info on supported operations. Falling back to batch operations and default limits.");
                    }
                    return this._serverInfo ?? {};
                })();
                return this._getServerInfoPromise.then((serverInfo)=>{
                    if (void 0 === this._serverInfo) this._getServerInfoPromise = void 0;
                    return serverInfo;
                });
            }
            async _getSettings() {
                if (!this.settings) this.settings = this._get("/settings");
                return await this.settings;
            }
            async flush() {
                const sizeLimitBytes = await this._getBatchSizeLimitBytes();
                await this.drainAutoBatchQueue(sizeLimitBytes);
            }
            async createRun(run) {
                if (!this._filterForSampling([
                    run
                ]).length) return;
                const headers = {
                    ...this.headers,
                    "Content-Type": "application/json"
                };
                const session_name = run.project_name;
                delete run.project_name;
                const runCreate = this.prepareRunCreateOrUpdateInputs({
                    session_name,
                    ...run,
                    start_time: run.start_time ?? Date.now()
                });
                if (this.autoBatchTracing && void 0 !== runCreate.trace_id && void 0 !== runCreate.dotted_order) return void this.processRunOperation({
                    action: "create",
                    item: runCreate
                }).catch(console.error);
                const mergedRunCreateParam = mergeRuntimeEnvIntoRunCreate(runCreate);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs`, {
                    method: "POST",
                    headers,
                    body: serialize(mergedRunCreateParam),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create run", true);
            }
            async batchIngestRuns({ runCreates, runUpdates }) {
                if (void 0 === runCreates && void 0 === runUpdates) return;
                let preparedCreateParams = runCreates?.map((create)=>this.prepareRunCreateOrUpdateInputs(create)) ?? [];
                let preparedUpdateParams = runUpdates?.map((update)=>this.prepareRunCreateOrUpdateInputs(update)) ?? [];
                if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
                    const createById = preparedCreateParams.reduce((params, run)=>{
                        if (!run.id) return params;
                        params[run.id] = run;
                        return params;
                    }, {});
                    const standaloneUpdates = [];
                    for (const updateParam of preparedUpdateParams)if (void 0 !== updateParam.id && createById[updateParam.id]) createById[updateParam.id] = {
                        ...createById[updateParam.id],
                        ...updateParam
                    };
                    else standaloneUpdates.push(updateParam);
                    preparedCreateParams = Object.values(createById);
                    preparedUpdateParams = standaloneUpdates;
                }
                const rawBatch = {
                    post: this._filterForSampling(preparedCreateParams),
                    patch: this._filterForSampling(preparedUpdateParams, true)
                };
                if (!rawBatch.post.length && !rawBatch.patch.length) return;
                const batchChunks = {
                    post: [],
                    patch: []
                };
                for (const k of [
                    "post",
                    "patch"
                ]){
                    const key = k;
                    const batchItems = rawBatch[key].reverse();
                    let batchItem = batchItems.pop();
                    while(void 0 !== batchItem){
                        batchChunks[key].push(batchItem);
                        batchItem = batchItems.pop();
                    }
                }
                if (batchChunks.post.length > 0 || batchChunks.patch.length > 0) await this._postBatchIngestRuns(serialize(batchChunks));
            }
            async _postBatchIngestRuns(body) {
                const headers = {
                    ...this.headers,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                };
                const response = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/batch`, {
                    method: "POST",
                    headers,
                    body: body,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "batch create run", true);
            }
            async multipartIngestRuns({ runCreates, runUpdates }) {
                if (void 0 === runCreates && void 0 === runUpdates) return;
                const allAttachments = {};
                let preparedCreateParams = [];
                for (const create of runCreates ?? []){
                    const preparedCreate = this.prepareRunCreateOrUpdateInputs(create);
                    if (void 0 !== preparedCreate.id && void 0 !== preparedCreate.attachments) allAttachments[preparedCreate.id] = preparedCreate.attachments;
                    delete preparedCreate.attachments;
                    preparedCreateParams.push(preparedCreate);
                }
                let preparedUpdateParams = [];
                for (const update of runUpdates ?? [])preparedUpdateParams.push(this.prepareRunCreateOrUpdateInputs(update));
                const invalidRunCreate = preparedCreateParams.find((runCreate)=>void 0 === runCreate.trace_id || void 0 === runCreate.dotted_order);
                if (void 0 !== invalidRunCreate) throw new Error('Multipart ingest requires "trace_id" and "dotted_order" to be set when creating a run');
                const invalidRunUpdate = preparedUpdateParams.find((runUpdate)=>void 0 === runUpdate.trace_id || void 0 === runUpdate.dotted_order);
                if (void 0 !== invalidRunUpdate) throw new Error('Multipart ingest requires "trace_id" and "dotted_order" to be set when updating a run');
                if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
                    const createById = preparedCreateParams.reduce((params, run)=>{
                        if (!run.id) return params;
                        params[run.id] = run;
                        return params;
                    }, {});
                    const standaloneUpdates = [];
                    for (const updateParam of preparedUpdateParams)if (void 0 !== updateParam.id && createById[updateParam.id]) createById[updateParam.id] = {
                        ...createById[updateParam.id],
                        ...updateParam
                    };
                    else standaloneUpdates.push(updateParam);
                    preparedCreateParams = Object.values(createById);
                    preparedUpdateParams = standaloneUpdates;
                }
                if (0 === preparedCreateParams.length && 0 === preparedUpdateParams.length) return;
                const accumulatedContext = [];
                const accumulatedParts = [];
                for (const [method, payloads] of [
                    [
                        "post",
                        preparedCreateParams
                    ],
                    [
                        "patch",
                        preparedUpdateParams
                    ]
                ])for (const originalPayload of payloads){
                    const { inputs, outputs, events, attachments, ...payload } = originalPayload;
                    const fields = {
                        inputs,
                        outputs,
                        events
                    };
                    const stringifiedPayload = serialize(payload);
                    accumulatedParts.push({
                        name: `${method}.${payload.id}`,
                        payload: new Blob([
                            stringifiedPayload
                        ], {
                            type: `application/json; length=${stringifiedPayload.length}`
                        })
                    });
                    for (const [key, value] of Object.entries(fields)){
                        if (void 0 === value) continue;
                        const stringifiedValue = serialize(value);
                        accumulatedParts.push({
                            name: `${method}.${payload.id}.${key}`,
                            payload: new Blob([
                                stringifiedValue
                            ], {
                                type: `application/json; length=${stringifiedValue.length}`
                            })
                        });
                    }
                    if (void 0 !== payload.id) {
                        const attachments = allAttachments[payload.id];
                        if (attachments) {
                            delete allAttachments[payload.id];
                            for (const [name, attachment] of Object.entries(attachments)){
                                let contentType;
                                let content;
                                if (Array.isArray(attachment)) [contentType, content] = attachment;
                                else {
                                    contentType = attachment.mimeType;
                                    content = attachment.data;
                                }
                                if (name.includes(".")) {
                                    console.warn(`Skipping attachment '${name}' for run ${payload.id}: Invalid attachment name. Attachment names must not contain periods ('.'). Please rename the attachment and try again.`);
                                    continue;
                                }
                                accumulatedParts.push({
                                    name: `attachment.${payload.id}.${name}`,
                                    payload: new Blob([
                                        content
                                    ], {
                                        type: `${contentType}; length=${content.byteLength}`
                                    })
                                });
                            }
                        }
                    }
                    accumulatedContext.push(`trace=${payload.trace_id},id=${payload.id}`);
                }
                await this._sendMultipartRequest(accumulatedParts, accumulatedContext.join("; "));
            }
            async _sendMultipartRequest(parts, context) {
                try {
                    const boundary = "----LangSmithFormBoundary" + Math.random().toString(36).slice(2);
                    const chunks = [];
                    for (const part of parts){
                        chunks.push(new Blob([
                            `--${boundary}\r\n`
                        ]));
                        chunks.push(new Blob([
                            `Content-Disposition: form-data; name="${part.name}"\r\n`,
                            `Content-Type: ${part.payload.type}\r\n\r\n`
                        ]));
                        chunks.push(part.payload);
                        chunks.push(new Blob([
                            "\r\n"
                        ]));
                    }
                    chunks.push(new Blob([
                        `--${boundary}--\r\n`
                    ]));
                    const body = new Blob(chunks);
                    const arrayBuffer = await body.arrayBuffer();
                    const res = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/multipart`, {
                        method: "POST",
                        headers: {
                            ...this.headers,
                            "Content-Type": `multipart/form-data; boundary=${boundary}`
                        },
                        body: arrayBuffer,
                        signal: AbortSignal.timeout(this.timeout_ms),
                        ...this.fetchOptions
                    });
                    await raiseForStatus(res, "ingest multipart runs", true);
                } catch (e) {
                    console.warn(`${e.message.trim()}\n\nContext: ${context}`);
                }
            }
            async updateRun(runId, run) {
                assertUuid(runId);
                if (run.inputs) run.inputs = this.processInputs(run.inputs);
                if (run.outputs) run.outputs = this.processOutputs(run.outputs);
                const data = {
                    ...run,
                    id: runId
                };
                if (!this._filterForSampling([
                    data
                ], true).length) return;
                if (this.autoBatchTracing && void 0 !== data.trace_id && void 0 !== data.dotted_order) {
                    if (void 0 !== run.end_time && void 0 === data.parent_run_id && this.blockOnRootRunFinalization && !this.manualFlushMode) return void await this.processRunOperation({
                        action: "update",
                        item: data
                    }).catch(console.error);
                    this.processRunOperation({
                        action: "update",
                        item: data
                    }).catch(console.error);
                    return;
                }
                const headers = {
                    ...this.headers,
                    "Content-Type": "application/json"
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}`, {
                    method: "PATCH",
                    headers,
                    body: serialize(run),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update run", true);
            }
            async readRun(runId, { loadChildRuns } = {
                loadChildRuns: false
            }) {
                assertUuid(runId);
                let run = await this._get(`/runs/${runId}`);
                if (loadChildRuns && run.child_run_ids) run = await this._loadChildRuns(run);
                return run;
            }
            async getRunUrl({ runId, run, projectOpts }) {
                if (void 0 !== run) {
                    let sessionId;
                    if (run.session_id) sessionId = run.session_id;
                    else if (projectOpts?.projectName) sessionId = (await this.readProject({
                        projectName: projectOpts?.projectName
                    })).id;
                    else if (projectOpts?.projectId) sessionId = projectOpts?.projectId;
                    else {
                        const project = await this.readProject({
                            projectName: getLangSmithEnvironmentVariable("PROJECT") || "default"
                        });
                        sessionId = project.id;
                    }
                    const tenantId = await this._getTenantId();
                    return `${this.getHostUrl()}/o/${tenantId}/projects/p/${sessionId}/r/${run.id}?poll=true`;
                }
                if (void 0 !== runId) {
                    const run_ = await this.readRun(runId);
                    if (!run_.app_path) throw new Error(`Run ${runId} has no app_path`);
                    const baseUrl = this.getHostUrl();
                    return `${baseUrl}${run_.app_path}`;
                }
                throw new Error("Must provide either runId or run");
            }
            async _loadChildRuns(run) {
                const childRuns = await toArray(this.listRuns({
                    id: run.child_run_ids
                }));
                const treemap = {};
                const runs = {};
                childRuns.sort((a, b)=>(a?.dotted_order ?? "").localeCompare(b?.dotted_order ?? ""));
                for (const childRun of childRuns){
                    if (null === childRun.parent_run_id || void 0 === childRun.parent_run_id) throw new Error(`Child run ${childRun.id} has no parent`);
                    if (!(childRun.parent_run_id in treemap)) treemap[childRun.parent_run_id] = [];
                    treemap[childRun.parent_run_id].push(childRun);
                    runs[childRun.id] = childRun;
                }
                run.child_runs = treemap[run.id] || [];
                for(const runId in treemap)if (runId !== run.id) runs[runId].child_runs = treemap[runId];
                return run;
            }
            async *listRuns(props) {
                const { projectId, projectName, parentRunId, traceId, referenceExampleId, startTime, executionOrder, isRoot, runType, error, id, query, filter, traceFilter, treeFilter, limit, select } = props;
                let projectIds = [];
                if (projectId) projectIds = Array.isArray(projectId) ? projectId : [
                    projectId
                ];
                if (projectName) {
                    const projectNames = Array.isArray(projectName) ? projectName : [
                        projectName
                    ];
                    const projectIds_ = await Promise.all(projectNames.map((name)=>this.readProject({
                            projectName: name
                        }).then((project)=>project.id)));
                    projectIds.push(...projectIds_);
                }
                const default_select = [
                    "app_path",
                    "child_run_ids",
                    "completion_cost",
                    "completion_tokens",
                    "dotted_order",
                    "end_time",
                    "error",
                    "events",
                    "extra",
                    "feedback_stats",
                    "first_token_time",
                    "id",
                    "inputs",
                    "name",
                    "outputs",
                    "parent_run_id",
                    "parent_run_ids",
                    "prompt_cost",
                    "prompt_tokens",
                    "reference_example_id",
                    "run_type",
                    "session_id",
                    "start_time",
                    "status",
                    "tags",
                    "total_cost",
                    "total_tokens",
                    "trace_id"
                ];
                const body = {
                    session: projectIds.length ? projectIds : null,
                    run_type: runType,
                    reference_example: referenceExampleId,
                    query,
                    filter,
                    trace_filter: traceFilter,
                    tree_filter: treeFilter,
                    execution_order: executionOrder,
                    parent_run: parentRunId,
                    start_time: startTime ? startTime.toISOString() : null,
                    error,
                    id,
                    limit,
                    trace: traceId,
                    select: select ? select : default_select,
                    is_root: isRoot
                };
                let runsYielded = 0;
                for await (const runs of this._getCursorPaginatedList("/runs/query", body))if (limit) {
                    if (runsYielded >= limit) break;
                    if (runs.length + runsYielded > limit) {
                        const newRuns = runs.slice(0, limit - runsYielded);
                        yield* newRuns;
                        break;
                    }
                    runsYielded += runs.length;
                    yield* runs;
                } else yield* runs;
            }
            async getRunStats({ id, trace, parentRun, runType, projectNames, projectIds, referenceExampleIds, startTime, endTime, error, query, filter, traceFilter, treeFilter, isRoot, dataSourceType }) {
                let projectIds_ = projectIds || [];
                if (projectNames) projectIds_ = [
                    ...projectIds || [],
                    ...await Promise.all(projectNames.map((name)=>this.readProject({
                            projectName: name
                        }).then((project)=>project.id)))
                ];
                const payload = {
                    id,
                    trace,
                    parent_run: parentRun,
                    run_type: runType,
                    session: projectIds_,
                    reference_example: referenceExampleIds,
                    start_time: startTime,
                    end_time: endTime,
                    error,
                    query,
                    filter,
                    trace_filter: traceFilter,
                    tree_filter: treeFilter,
                    is_root: isRoot,
                    data_source_type: dataSourceType
                };
                const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([_, value])=>void 0 !== value));
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/stats`, {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify(filteredPayload),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const result = await response.json();
                return result;
            }
            async shareRun(runId, { shareId } = {}) {
                const data = {
                    run_id: runId,
                    share_token: shareId || v4()
                };
                assertUuid(runId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
                    method: "PUT",
                    headers: this.headers,
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const result = await response.json();
                if (null === result || !("share_token" in result)) throw new Error("Invalid response from server");
                return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
            }
            async unshareRun(runId) {
                assertUuid(runId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "unshare run", true);
            }
            async readRunSharedLink(runId) {
                assertUuid(runId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const result = await response.json();
                if (null === result || !("share_token" in result)) return;
                return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
            }
            async listSharedRuns(shareToken, { runIds } = {}) {
                const queryParams = new URLSearchParams({
                    share_token: shareToken
                });
                if (void 0 !== runIds) for (const runId of runIds)queryParams.append("id", runId);
                assertUuid(shareToken);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/runs${queryParams}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const runs = await response.json();
                return runs;
            }
            async readDatasetSharedSchema(datasetId, datasetName) {
                if (!datasetId && !datasetName) throw new Error("Either datasetId or datasetName must be given");
                if (!datasetId) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId = dataset.id;
                }
                assertUuid(datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const shareSchema = await response.json();
                shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
                return shareSchema;
            }
            async shareDataset(datasetId, datasetName) {
                if (!datasetId && !datasetName) throw new Error("Either datasetId or datasetName must be given");
                if (!datasetId) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId = dataset.id;
                }
                const data = {
                    dataset_id: datasetId
                };
                assertUuid(datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
                    method: "PUT",
                    headers: this.headers,
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const shareSchema = await response.json();
                shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
                return shareSchema;
            }
            async unshareDataset(datasetId) {
                assertUuid(datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "unshare dataset", true);
            }
            async readSharedDataset(shareToken) {
                assertUuid(shareToken);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/datasets`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const dataset = await response.json();
                return dataset;
            }
            async listSharedExamples(shareToken, options) {
                const params = {};
                if (options?.exampleIds) params.id = options.exampleIds;
                const urlParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value])=>{
                    if (Array.isArray(value)) value.forEach((v)=>urlParams.append(key, v));
                    else urlParams.append(key, value);
                });
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/examples?${urlParams.toString()}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const result = await response.json();
                if (!response.ok) {
                    if ("detail" in result) throw new Error(`Failed to list shared examples.\nStatus: ${response.status}\nMessage: ${result.detail.join("\n")}`);
                    throw new Error(`Failed to list shared examples: ${response.status} ${response.statusText}`);
                }
                return result.map((example)=>({
                        ...example,
                        _hostUrl: this.getHostUrl()
                    }));
            }
            async createProject({ projectName, description = null, metadata = null, upsert = false, projectExtra = null, referenceDatasetId = null }) {
                const upsert_ = upsert ? "?upsert=true" : "";
                const endpoint = `${this.apiUrl}/sessions${upsert_}`;
                const extra = projectExtra || {};
                if (metadata) extra["metadata"] = metadata;
                const body = {
                    name: projectName,
                    extra,
                    description
                };
                if (null !== referenceDatasetId) body["reference_dataset_id"] = referenceDatasetId;
                const response = await this.caller.call(_getFetchImplementation(), endpoint, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create project");
                const result = await response.json();
                return result;
            }
            async updateProject(projectId, { name = null, description = null, metadata = null, projectExtra = null, endTime = null }) {
                const endpoint = `${this.apiUrl}/sessions/${projectId}`;
                let extra = projectExtra;
                if (metadata) extra = {
                    ...extra || {},
                    metadata
                };
                const body = {
                    name,
                    extra,
                    description,
                    end_time: endTime ? new Date(endTime).toISOString() : null
                };
                const response = await this.caller.call(_getFetchImplementation(), endpoint, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update project");
                const result = await response.json();
                return result;
            }
            async hasProject({ projectId, projectName }) {
                let path = "/sessions";
                const params = new URLSearchParams();
                if (void 0 !== projectId && void 0 !== projectName) throw new Error("Must provide either projectName or projectId, not both");
                if (void 0 !== projectId) {
                    assertUuid(projectId);
                    path += `/${projectId}`;
                } else if (void 0 !== projectName) params.append("name", projectName);
                else throw new Error("Must provide projectName or projectId");
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}?${params}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                try {
                    const result = await response.json();
                    if (!response.ok) return false;
                    if (Array.isArray(result)) return result.length > 0;
                    return true;
                } catch (e) {
                    return false;
                }
            }
            async readProject({ projectId, projectName, includeStats }) {
                let path = "/sessions";
                const params = new URLSearchParams();
                if (void 0 !== projectId && void 0 !== projectName) throw new Error("Must provide either projectName or projectId, not both");
                if (void 0 !== projectId) {
                    assertUuid(projectId);
                    path += `/${projectId}`;
                } else if (void 0 !== projectName) params.append("name", projectName);
                else throw new Error("Must provide projectName or projectId");
                if (void 0 !== includeStats) params.append("include_stats", includeStats.toString());
                const response = await this._get(path, params);
                let result;
                if (Array.isArray(response)) {
                    if (0 === response.length) throw new Error(`Project[id=${projectId}, name=${projectName}] not found`);
                    result = response[0];
                } else result = response;
                return result;
            }
            async getProjectUrl({ projectId, projectName }) {
                if (void 0 === projectId && void 0 === projectName) throw new Error("Must provide either projectName or projectId");
                const project = await this.readProject({
                    projectId,
                    projectName
                });
                const tenantId = await this._getTenantId();
                return `${this.getHostUrl()}/o/${tenantId}/projects/p/${project.id}`;
            }
            async getDatasetUrl({ datasetId, datasetName }) {
                if (void 0 === datasetId && void 0 === datasetName) throw new Error("Must provide either datasetName or datasetId");
                const dataset = await this.readDataset({
                    datasetId,
                    datasetName
                });
                const tenantId = await this._getTenantId();
                return `${this.getHostUrl()}/o/${tenantId}/datasets/${dataset.id}`;
            }
            async _getTenantId() {
                if (null !== this._tenantId) return this._tenantId;
                const queryParams = new URLSearchParams({
                    limit: "1"
                });
                for await (const projects of this._getPaginated("/sessions", queryParams)){
                    this._tenantId = projects[0].tenant_id;
                    return projects[0].tenant_id;
                }
                throw new Error("No projects found to resolve tenant.");
            }
            async *listProjects({ projectIds, name, nameContains, referenceDatasetId, referenceDatasetName, referenceFree, metadata } = {}) {
                const params = new URLSearchParams();
                if (void 0 !== projectIds) for (const projectId of projectIds)params.append("id", projectId);
                if (void 0 !== name) params.append("name", name);
                if (void 0 !== nameContains) params.append("name_contains", nameContains);
                if (void 0 !== referenceDatasetId) params.append("reference_dataset", referenceDatasetId);
                else if (void 0 !== referenceDatasetName) {
                    const dataset = await this.readDataset({
                        datasetName: referenceDatasetName
                    });
                    params.append("reference_dataset", dataset.id);
                }
                if (void 0 !== referenceFree) params.append("reference_free", referenceFree.toString());
                if (void 0 !== metadata) params.append("metadata", JSON.stringify(metadata));
                for await (const projects of this._getPaginated("/sessions", params))yield* projects;
            }
            async deleteProject({ projectId, projectName }) {
                let projectId_;
                if (void 0 === projectId && void 0 === projectName) throw new Error("Must provide projectName or projectId");
                if (void 0 !== projectId && void 0 !== projectName) throw new Error("Must provide either projectName or projectId, not both");
                projectId_ = void 0 === projectId ? (await this.readProject({
                    projectName
                })).id : projectId;
                assertUuid(projectId_);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/sessions/${projectId_}`, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `delete session ${projectId_} (${projectName})`, true);
            }
            async uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, dataType, name }) {
                const url = `${this.apiUrl}/datasets/upload`;
                const formData = new FormData();
                formData.append("file", csvFile, fileName);
                inputKeys.forEach((key)=>{
                    formData.append("input_keys", key);
                });
                outputKeys.forEach((key)=>{
                    formData.append("output_keys", key);
                });
                if (description) formData.append("description", description);
                if (dataType) formData.append("data_type", dataType);
                if (name) formData.append("name", name);
                const response = await this.caller.call(_getFetchImplementation(), url, {
                    method: "POST",
                    headers: this.headers,
                    body: formData,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "upload CSV");
                const result = await response.json();
                return result;
            }
            async createDataset(name, { description, dataType, inputsSchema, outputsSchema, metadata } = {}) {
                const body = {
                    name,
                    description,
                    extra: metadata ? {
                        metadata
                    } : void 0
                };
                if (dataType) body.data_type = dataType;
                if (inputsSchema) body.inputs_schema_definition = inputsSchema;
                if (outputsSchema) body.outputs_schema_definition = outputsSchema;
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create dataset");
                const result = await response.json();
                return result;
            }
            async readDataset({ datasetId, datasetName }) {
                let path = "/datasets";
                const params = new URLSearchParams({
                    limit: "1"
                });
                if (void 0 !== datasetId && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 !== datasetId) {
                    assertUuid(datasetId);
                    path += `/${datasetId}`;
                } else if (void 0 !== datasetName) params.append("name", datasetName);
                else throw new Error("Must provide datasetName or datasetId");
                const response = await this._get(path, params);
                let result;
                if (Array.isArray(response)) {
                    if (0 === response.length) throw new Error(`Dataset[id=${datasetId}, name=${datasetName}] not found`);
                    result = response[0];
                } else result = response;
                return result;
            }
            async hasDataset({ datasetId, datasetName }) {
                try {
                    await this.readDataset({
                        datasetId,
                        datasetName
                    });
                    return true;
                } catch (e) {
                    if (e instanceof Error && e.message.toLocaleLowerCase().includes("not found")) return false;
                    throw e;
                }
            }
            async diffDatasetVersions({ datasetId, datasetName, fromVersion, toVersion }) {
                let datasetId_ = datasetId;
                if (void 0 === datasetId_ && void 0 === datasetName) throw new Error("Must provide either datasetName or datasetId");
                if (void 0 !== datasetId_ && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 === datasetId_) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                }
                const urlParams = new URLSearchParams({
                    from_version: "string" == typeof fromVersion ? fromVersion : fromVersion.toISOString(),
                    to_version: "string" == typeof toVersion ? toVersion : toVersion.toISOString()
                });
                const response = await this._get(`/datasets/${datasetId_}/versions/diff`, urlParams);
                return response;
            }
            async readDatasetOpenaiFinetuning({ datasetId, datasetName }) {
                const path = "/datasets";
                if (void 0 !== datasetId) ;
                else if (void 0 !== datasetName) datasetId = (await this.readDataset({
                    datasetName
                })).id;
                else throw new Error("Must provide datasetName or datasetId");
                const response = await this._getResponse(`${path}/${datasetId}/openai_ft`);
                const datasetText = await response.text();
                const dataset = datasetText.trim().split("\n").map((line)=>JSON.parse(line));
                return dataset;
            }
            async *listDatasets({ limit = 100, offset = 0, datasetIds, datasetName, datasetNameContains, metadata } = {}) {
                const path = "/datasets";
                const params = new URLSearchParams({
                    limit: limit.toString(),
                    offset: offset.toString()
                });
                if (void 0 !== datasetIds) for (const id_ of datasetIds)params.append("id", id_);
                if (void 0 !== datasetName) params.append("name", datasetName);
                if (void 0 !== datasetNameContains) params.append("name_contains", datasetNameContains);
                if (void 0 !== metadata) params.append("metadata", JSON.stringify(metadata));
                for await (const datasets of this._getPaginated(path, params))yield* datasets;
            }
            async updateDataset(props) {
                const { datasetId, datasetName, ...update } = props;
                if (!datasetId && !datasetName) throw new Error("Must provide either datasetName or datasetId");
                const _datasetId = datasetId ?? (await this.readDataset({
                    datasetName
                })).id;
                assertUuid(_datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${_datasetId}`, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(update),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update dataset");
                return await response.json();
            }
            async updateDatasetTag(props) {
                const { datasetId, datasetName, asOf, tag } = props;
                if (!datasetId && !datasetName) throw new Error("Must provide either datasetName or datasetId");
                const _datasetId = datasetId ?? (await this.readDataset({
                    datasetName
                })).id;
                assertUuid(_datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${_datasetId}/tags`, {
                    method: "PUT",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        as_of: "string" == typeof asOf ? asOf : asOf.toISOString(),
                        tag
                    }),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update dataset tags");
            }
            async deleteDataset({ datasetId, datasetName }) {
                let path = "/datasets";
                let datasetId_ = datasetId;
                if (void 0 !== datasetId && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 !== datasetName) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                }
                if (void 0 !== datasetId_) {
                    assertUuid(datasetId_);
                    path += `/${datasetId_}`;
                } else throw new Error("Must provide datasetName or datasetId");
                const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `delete ${path}`);
                await response.json();
            }
            async indexDataset({ datasetId, datasetName, tag }) {
                let datasetId_ = datasetId;
                if (datasetId_ || datasetName) {
                    if (datasetId_ && datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                    else if (!datasetId_) {
                        const dataset = await this.readDataset({
                            datasetName
                        });
                        datasetId_ = dataset.id;
                    }
                } else throw new Error("Must provide either datasetName or datasetId");
                assertUuid(datasetId_);
                const data = {
                    tag: tag
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/index`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "index dataset");
                await response.json();
            }
            async similarExamples(inputs, datasetId, limit, { filter } = {}) {
                const data = {
                    limit: limit,
                    inputs: inputs
                };
                if (void 0 !== filter) data["filter"] = filter;
                assertUuid(datasetId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/search`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "fetch similar examples");
                const result = await response.json();
                return result["examples"];
            }
            async createExample(inputs, outputs, { datasetId, datasetName, createdAt, exampleId, metadata, split, sourceRunId }) {
                let datasetId_ = datasetId;
                if (void 0 === datasetId_ && void 0 === datasetName) throw new Error("Must provide either datasetName or datasetId");
                if (void 0 !== datasetId_ && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 === datasetId_) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                }
                const createdAt_ = createdAt || new Date();
                const data = {
                    dataset_id: datasetId_,
                    inputs,
                    outputs,
                    created_at: createdAt_?.toISOString(),
                    id: exampleId,
                    metadata,
                    split,
                    source_run_id: sourceRunId
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create example");
                const result = await response.json();
                return result;
            }
            async createExamples(props) {
                const { inputs, outputs, metadata, sourceRunIds, exampleIds, datasetId, datasetName } = props;
                let datasetId_ = datasetId;
                if (void 0 === datasetId_ && void 0 === datasetName) throw new Error("Must provide either datasetName or datasetId");
                if (void 0 !== datasetId_ && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 === datasetId_) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                }
                const formattedExamples = inputs.map((input, idx)=>({
                        dataset_id: datasetId_,
                        inputs: input,
                        outputs: outputs ? outputs[idx] : void 0,
                        metadata: metadata ? metadata[idx] : void 0,
                        split: props.splits ? props.splits[idx] : void 0,
                        id: exampleIds ? exampleIds[idx] : void 0,
                        source_run_id: sourceRunIds ? sourceRunIds[idx] : void 0
                    }));
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formattedExamples),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create examples");
                const result = await response.json();
                return result;
            }
            async createLLMExample(input, generation, options) {
                return this.createExample({
                    input
                }, {
                    output: generation
                }, options);
            }
            async createChatExample(input, generations, options) {
                const finalInput = input.map((message)=>{
                    if (isLangChainMessage(message)) return convertLangChainMessageToExample(message);
                    return message;
                });
                const finalOutput = isLangChainMessage(generations) ? convertLangChainMessageToExample(generations) : generations;
                return this.createExample({
                    input: finalInput
                }, {
                    output: finalOutput
                }, options);
            }
            async readExample(exampleId) {
                assertUuid(exampleId);
                const path = `/examples/${exampleId}`;
                const rawExample = await this._get(path);
                const { attachment_urls, ...rest } = rawExample;
                const example = rest;
                if (attachment_urls) example.attachments = Object.entries(attachment_urls).reduce((acc, [key, value])=>{
                    acc[key.slice(11)] = {
                        presigned_url: value.presigned_url,
                        mime_type: value.mime_type
                    };
                    return acc;
                }, {});
                return example;
            }
            async *listExamples({ datasetId, datasetName, exampleIds, asOf, splits, inlineS3Urls, metadata, limit, offset, filter, includeAttachments } = {}) {
                let datasetId_;
                if (void 0 !== datasetId && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 !== datasetId) datasetId_ = datasetId;
                else if (void 0 !== datasetName) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                } else throw new Error("Must provide a datasetName or datasetId");
                const params = new URLSearchParams({
                    dataset: datasetId_
                });
                const dataset_version = asOf ? "string" == typeof asOf ? asOf : asOf?.toISOString() : void 0;
                if (dataset_version) params.append("as_of", dataset_version);
                const inlineS3Urls_ = inlineS3Urls ?? true;
                params.append("inline_s3_urls", inlineS3Urls_.toString());
                if (void 0 !== exampleIds) for (const id_ of exampleIds)params.append("id", id_);
                if (void 0 !== splits) for (const split of splits)params.append("splits", split);
                if (void 0 !== metadata) {
                    const serializedMetadata = JSON.stringify(metadata);
                    params.append("metadata", serializedMetadata);
                }
                if (void 0 !== limit) params.append("limit", limit.toString());
                if (void 0 !== offset) params.append("offset", offset.toString());
                if (void 0 !== filter) params.append("filter", filter);
                if (true === includeAttachments) [
                    "attachment_urls",
                    "outputs",
                    "metadata"
                ].forEach((field)=>params.append("select", field));
                let i = 0;
                for await (const rawExamples of this._getPaginated("/examples", params)){
                    for (const rawExample of rawExamples){
                        const { attachment_urls, ...rest } = rawExample;
                        const example = rest;
                        if (attachment_urls) example.attachments = Object.entries(attachment_urls).reduce((acc, [key, value])=>{
                            acc[key.slice(11)] = {
                                presigned_url: value.presigned_url,
                                mime_type: value.mime_type || void 0
                            };
                            return acc;
                        }, {});
                        yield example;
                        i++;
                    }
                    if (void 0 !== limit && i >= limit) break;
                }
            }
            async deleteExample(exampleId) {
                assertUuid(exampleId);
                const path = `/examples/${exampleId}`;
                const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `delete ${path}`);
                await response.json();
            }
            async updateExample(exampleId, update) {
                assertUuid(exampleId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/${exampleId}`, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(update),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update example");
                const result = await response.json();
                return result;
            }
            async updateExamples(update) {
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(update),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update examples");
                const result = await response.json();
                return result;
            }
            async readDatasetVersion({ datasetId, datasetName, asOf, tag }) {
                let resolvedDatasetId;
                if (datasetId) resolvedDatasetId = datasetId;
                else {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    resolvedDatasetId = dataset.id;
                }
                assertUuid(resolvedDatasetId);
                if (asOf && tag || !asOf && !tag) throw new Error("Exactly one of asOf and tag must be specified.");
                const params = new URLSearchParams();
                if (void 0 !== asOf) params.append("as_of", "string" == typeof asOf ? asOf : asOf.toISOString());
                if (void 0 !== tag) params.append("tag", tag);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${resolvedDatasetId}/version?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        ...this.headers
                    },
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "read dataset version");
                return await response.json();
            }
            async listDatasetSplits({ datasetId, datasetName, asOf }) {
                let datasetId_;
                if (void 0 === datasetId && void 0 === datasetName) throw new Error("Must provide dataset name or ID");
                if (void 0 !== datasetId && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 === datasetId) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                } else datasetId_ = datasetId;
                assertUuid(datasetId_);
                const params = new URLSearchParams();
                const dataset_version = asOf ? "string" == typeof asOf ? asOf : asOf?.toISOString() : void 0;
                if (dataset_version) params.append("as_of", dataset_version);
                const response = await this._get(`/datasets/${datasetId_}/splits`, params);
                return response;
            }
            async updateDatasetSplits({ datasetId, datasetName, splitName, exampleIds, remove = false }) {
                let datasetId_;
                if (void 0 === datasetId && void 0 === datasetName) throw new Error("Must provide dataset name or ID");
                if (void 0 !== datasetId && void 0 !== datasetName) throw new Error("Must provide either datasetName or datasetId, not both");
                if (void 0 === datasetId) {
                    const dataset = await this.readDataset({
                        datasetName
                    });
                    datasetId_ = dataset.id;
                } else datasetId_ = datasetId;
                assertUuid(datasetId_);
                const data = {
                    split_name: splitName,
                    examples: exampleIds.map((id)=>{
                        assertUuid(id);
                        return id;
                    }),
                    remove
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/splits`, {
                    method: "PUT",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update dataset splits", true);
            }
            async evaluateRun(run, evaluator, { sourceInfo, loadChildRuns, referenceExample } = {
                loadChildRuns: false
            }) {
                warnOnce("This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.");
                let run_;
                if ("string" == typeof run) run_ = await this.readRun(run, {
                    loadChildRuns
                });
                else if ("object" == typeof run && "id" in run) run_ = run;
                else throw new Error(`Invalid run type: ${typeof run}`);
                if (null !== run_.reference_example_id && void 0 !== run_.reference_example_id) referenceExample = await this.readExample(run_.reference_example_id);
                const feedbackResult = await evaluator.evaluateRun(run_, referenceExample);
                const [_, feedbacks] = await this._logEvaluationFeedback(feedbackResult, run_, sourceInfo);
                return feedbacks[0];
            }
            async createFeedback(runId, key, { score, value, correction, comment, sourceInfo, feedbackSourceType = "api", sourceRunId, feedbackId, feedbackConfig, projectId, comparativeExperimentId }) {
                if (!runId && !projectId) throw new Error("One of runId or projectId must be provided");
                if (runId && projectId) throw new Error("Only one of runId or projectId can be provided");
                const feedback_source = {
                    type: feedbackSourceType ?? "api",
                    metadata: sourceInfo ?? {}
                };
                if (void 0 !== sourceRunId && feedback_source?.metadata !== void 0 && !feedback_source.metadata["__run"]) feedback_source.metadata["__run"] = {
                    run_id: sourceRunId
                };
                if (feedback_source?.metadata !== void 0 && feedback_source.metadata["__run"]?.run_id !== void 0) assertUuid(feedback_source.metadata["__run"].run_id);
                const feedback = {
                    id: feedbackId ?? v4(),
                    run_id: runId,
                    key,
                    score,
                    value,
                    correction,
                    comment,
                    feedback_source: feedback_source,
                    comparative_experiment_id: comparativeExperimentId,
                    feedbackConfig,
                    session_id: projectId
                };
                const url = `${this.apiUrl}/feedback`;
                const response = await this.caller.call(_getFetchImplementation(), url, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(feedback),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create feedback", true);
                return feedback;
            }
            async updateFeedback(feedbackId, { score, value, correction, comment }) {
                const feedbackUpdate = {};
                if (null != score) feedbackUpdate["score"] = score;
                if (null != value) feedbackUpdate["value"] = value;
                if (null != correction) feedbackUpdate["correction"] = correction;
                if (null != comment) feedbackUpdate["comment"] = comment;
                assertUuid(feedbackId);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/${feedbackId}`, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(feedbackUpdate),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update feedback", true);
            }
            async readFeedback(feedbackId) {
                assertUuid(feedbackId);
                const path = `/feedback/${feedbackId}`;
                const response = await this._get(path);
                return response;
            }
            async deleteFeedback(feedbackId) {
                assertUuid(feedbackId);
                const path = `/feedback/${feedbackId}`;
                const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `delete ${path}`);
                await response.json();
            }
            async *listFeedback({ runIds, feedbackKeys, feedbackSourceTypes } = {}) {
                const queryParams = new URLSearchParams();
                if (runIds) queryParams.append("run", runIds.join(","));
                if (feedbackKeys) for (const key of feedbackKeys)queryParams.append("key", key);
                if (feedbackSourceTypes) for (const type of feedbackSourceTypes)queryParams.append("source", type);
                for await (const feedbacks of this._getPaginated("/feedback", queryParams))yield* feedbacks;
            }
            async createPresignedFeedbackToken(runId, feedbackKey, { expiration, feedbackConfig } = {}) {
                const body = {
                    run_id: runId,
                    feedback_key: feedbackKey,
                    feedback_config: feedbackConfig
                };
                if (expiration) {
                    if ("string" == typeof expiration) body["expires_at"] = expiration;
                    else if (expiration?.hours || expiration?.minutes || expiration?.days) body["expires_in"] = expiration;
                } else body["expires_in"] = {
                    hours: 3
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/tokens`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const result = await response.json();
                return result;
            }
            async createComparativeExperiment({ name, experimentIds, referenceDatasetId, createdAt, description, metadata, id }) {
                if (0 === experimentIds.length) throw new Error("At least one experiment is required");
                if (!referenceDatasetId) referenceDatasetId = (await this.readProject({
                    projectId: experimentIds[0]
                })).reference_dataset_id;
                if (null == !referenceDatasetId) throw new Error("A reference dataset is required");
                const body = {
                    id,
                    name,
                    experiment_ids: experimentIds,
                    reference_dataset_id: referenceDatasetId,
                    description,
                    created_at: (createdAt ?? new Date())?.toISOString(),
                    extra: {}
                };
                if (metadata) body.extra["metadata"] = metadata;
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/comparative`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                return await response.json();
            }
            async *listPresignedFeedbackTokens(runId) {
                assertUuid(runId);
                const params = new URLSearchParams({
                    run_id: runId
                });
                for await (const tokens of this._getPaginated("/feedback/tokens", params))yield* tokens;
            }
            _selectEvalResults(results) {
                let results_;
                results_ = "results" in results ? results.results : [
                    results
                ];
                return results_;
            }
            async _logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
                const evalResults = this._selectEvalResults(evaluatorResponse);
                const feedbacks = [];
                for (const res of evalResults){
                    let sourceInfo_ = sourceInfo || {};
                    if (res.evaluatorInfo) sourceInfo_ = {
                        ...res.evaluatorInfo,
                        ...sourceInfo_
                    };
                    let runId_ = null;
                    if (res.targetRunId) runId_ = res.targetRunId;
                    else if (run) runId_ = run.id;
                    feedbacks.push(await this.createFeedback(runId_, res.key, {
                        score: res.score,
                        value: res.value,
                        comment: res.comment,
                        correction: res.correction,
                        sourceInfo: sourceInfo_,
                        sourceRunId: res.sourceRunId,
                        feedbackConfig: res.feedbackConfig,
                        feedbackSourceType: "model"
                    }));
                }
                return [
                    evalResults,
                    feedbacks
                ];
            }
            async logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
                const [results] = await this._logEvaluationFeedback(evaluatorResponse, run, sourceInfo);
                return results;
            }
            async *listAnnotationQueues(options = {}) {
                const { queueIds, name, nameContains, limit } = options;
                const params = new URLSearchParams();
                if (queueIds) queueIds.forEach((id, i)=>{
                    assertUuid(id, `queueIds[${i}]`);
                    params.append("ids", id);
                });
                if (name) params.append("name", name);
                if (nameContains) params.append("name_contains", nameContains);
                params.append("limit", (void 0 !== limit ? Math.min(limit, 100) : 100).toString());
                let count = 0;
                for await (const queues of this._getPaginated("/annotation-queues", params)){
                    yield* queues;
                    count++;
                    if (void 0 !== limit && count >= limit) break;
                }
            }
            async createAnnotationQueue(options) {
                const { name, description, queueId } = options;
                const body = {
                    name,
                    description,
                    id: queueId || v4()
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([_, v])=>void 0 !== v))),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create annotation queue");
                const data = await response.json();
                return data;
            }
            async readAnnotationQueue(queueId) {
                const queueIteratorResult = await this.listAnnotationQueues({
                    queueIds: [
                        queueId
                    ]
                }).next();
                if (queueIteratorResult.done) throw new Error(`Annotation queue with ID ${queueId} not found`);
                return queueIteratorResult.value;
            }
            async updateAnnotationQueue(queueId, options) {
                const { name, description } = options;
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
                    method: "PATCH",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        description
                    }),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update annotation queue");
            }
            async deleteAnnotationQueue(queueId) {
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
                    method: "DELETE",
                    headers: {
                        ...this.headers,
                        Accept: "application/json"
                    },
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "delete annotation queue");
            }
            async addRunsToAnnotationQueue(queueId, runIds) {
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(runIds.map((id, i)=>assertUuid(id, `runIds[${i}]`).toString())),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "add runs to annotation queue");
            }
            async getRunFromAnnotationQueue(queueId, index) {
                const baseUrl = `/annotation-queues/${assertUuid(queueId, "queueId")}/run`;
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${baseUrl}/${index}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "get run from annotation queue");
                return await response.json();
            }
            async deleteRunFromAnnotationQueue(queueId, queueRunId) {
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs/${assertUuid(queueRunId, "queueRunId")}`, {
                    method: "DELETE",
                    headers: {
                        ...this.headers,
                        Accept: "application/json"
                    },
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "delete run from annotation queue");
            }
            async getSizeFromAnnotationQueue(queueId) {
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/size`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "get size from annotation queue");
                return await response.json();
            }
            async _currentTenantIsOwner(owner) {
                const settings = await this._getSettings();
                return "-" == owner || settings.tenant_handle === owner;
            }
            async _ownerConflictError(action, owner) {
                const settings = await this._getSettings();
                return new Error(`Cannot ${action} for another tenant.\n
      Current tenant: ${settings.tenant_handle}\n
      Requested tenant: ${owner}`);
            }
            async _getLatestCommitHash(promptOwnerAndName) {
                const res = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${promptOwnerAndName}/?limit=1&offset=0`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                const json = await res.json();
                if (!res.ok) {
                    const detail = "string" == typeof json.detail ? json.detail : JSON.stringify(json.detail);
                    const error = new Error(`Error ${res.status}: ${res.statusText}\n${detail}`);
                    error.statusCode = res.status;
                    throw error;
                }
                if (0 === json.commits.length) return;
                return json.commits[0].commit_hash;
            }
            async _likeOrUnlikePrompt(promptIdentifier, like) {
                const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/likes/${owner}/${promptName}`, {
                    method: "POST",
                    body: JSON.stringify({
                        like: like
                    }),
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, `${like ? "like" : "unlike"} prompt`);
                return await response.json();
            }
            async _getPromptUrl(promptIdentifier) {
                const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
                if (await this._currentTenantIsOwner(owner)) {
                    const settings = await this._getSettings();
                    if ("latest" !== commitHash) return `${this.getHostUrl()}/prompts/${promptName}/${commitHash.substring(0, 8)}?organizationId=${settings.id}`;
                    return `${this.getHostUrl()}/prompts/${promptName}?organizationId=${settings.id}`;
                }
                if ("latest" !== commitHash) return `${this.getHostUrl()}/hub/${owner}/${promptName}/${commitHash.substring(0, 8)}`;
                return `${this.getHostUrl()}/hub/${owner}/${promptName}`;
            }
            async promptExists(promptIdentifier) {
                const prompt = await this.getPrompt(promptIdentifier);
                return !!prompt;
            }
            async likePrompt(promptIdentifier) {
                return this._likeOrUnlikePrompt(promptIdentifier, true);
            }
            async unlikePrompt(promptIdentifier) {
                return this._likeOrUnlikePrompt(promptIdentifier, false);
            }
            async *listCommits(promptOwnerAndName) {
                for await (const commits of this._getPaginated(`/commits/${promptOwnerAndName}/`, new URLSearchParams(), (res)=>res.commits))yield* commits;
            }
            async *listPrompts(options) {
                const params = new URLSearchParams();
                params.append("sort_field", options?.sortField ?? "updated_at");
                params.append("sort_direction", "desc");
                params.append("is_archived", (!!options?.isArchived).toString());
                if (options?.isPublic !== void 0) params.append("is_public", options.isPublic.toString());
                if (options?.query) params.append("query", options.query);
                for await (const prompts of this._getPaginated("/repos", params, (res)=>res.repos))yield* prompts;
            }
            async getPrompt(promptIdentifier) {
                const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                if (404 === response.status) return null;
                await raiseForStatus(response, "get prompt");
                const result = await response.json();
                if (result.repo) return result.repo;
                return null;
            }
            async createPrompt(promptIdentifier, options) {
                const settings = await this._getSettings();
                if (options?.isPublic && !settings.tenant_handle) throw new Error(`Cannot create a public prompt without first\n
        creating a LangChain Hub handle. 
        You can add a handle by creating a public prompt at:\n
        https://smith.langchain.com/prompts`);
                const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
                if (!await this._currentTenantIsOwner(owner)) throw await this._ownerConflictError("create a prompt", owner);
                const data = {
                    repo_handle: promptName,
                    ...options?.description && {
                        description: options.description
                    },
                    ...options?.readme && {
                        readme: options.readme
                    },
                    ...options?.tags && {
                        tags: options.tags
                    },
                    is_public: !!options?.isPublic
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create prompt");
                const { repo } = await response.json();
                return repo;
            }
            async createCommit(promptIdentifier, object, options) {
                if (!await this.promptExists(promptIdentifier)) throw new Error("Prompt does not exist, you must create it first.");
                const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
                const resolvedParentCommitHash = options?.parentCommitHash !== "latest" && options?.parentCommitHash ? options?.parentCommitHash : await this._getLatestCommitHash(`${owner}/${promptName}`);
                const payload = {
                    manifest: JSON.parse(JSON.stringify(object)),
                    parent_commit: resolvedParentCommitHash
                };
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}`, {
                    method: "POST",
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "create commit");
                const result = await response.json();
                return this._getPromptUrl(`${owner}/${promptName}${result.commit_hash ? `:${result.commit_hash}` : ""}`);
            }
            async updateExamplesMultipart(datasetId, updates = []) {
                if (!await this._getMultiPartSupport()) throw new Error("Your LangSmith version does not allow using the multipart examples endpoint, please update to the latest version.");
                const formData = new FormData();
                for (const example of updates){
                    const exampleId = example.id;
                    const exampleBody = {
                        ...example.metadata && {
                            metadata: example.metadata
                        },
                        ...example.split && {
                            split: example.split
                        }
                    };
                    const stringifiedExample = serialize(exampleBody);
                    const exampleBlob = new Blob([
                        stringifiedExample
                    ], {
                        type: "application/json"
                    });
                    formData.append(exampleId, exampleBlob);
                    if (example.inputs) {
                        const stringifiedInputs = serialize(example.inputs);
                        const inputsBlob = new Blob([
                            stringifiedInputs
                        ], {
                            type: "application/json"
                        });
                        formData.append(`${exampleId}.inputs`, inputsBlob);
                    }
                    if (example.outputs) {
                        const stringifiedOutputs = serialize(example.outputs);
                        const outputsBlob = new Blob([
                            stringifiedOutputs
                        ], {
                            type: "application/json"
                        });
                        formData.append(`${exampleId}.outputs`, outputsBlob);
                    }
                    if (example.attachments) for (const [name, attachment] of Object.entries(example.attachments)){
                        let mimeType;
                        let data;
                        if (Array.isArray(attachment)) [mimeType, data] = attachment;
                        else {
                            mimeType = attachment.mimeType;
                            data = attachment.data;
                        }
                        const attachmentBlob = new Blob([
                            data
                        ], {
                            type: `${mimeType}; length=${data.byteLength}`
                        });
                        formData.append(`${exampleId}.attachment.${name}`, attachmentBlob);
                    }
                    if (example.attachments_operations) {
                        const stringifiedAttachmentsOperations = serialize(example.attachments_operations);
                        const attachmentsOperationsBlob = new Blob([
                            stringifiedAttachmentsOperations
                        ], {
                            type: "application/json"
                        });
                        formData.append(`${exampleId}.attachments_operations`, attachmentsOperationsBlob);
                    }
                }
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/v1/platform/datasets/${datasetId}/examples`, {
                    method: "PATCH",
                    headers: this.headers,
                    body: formData
                });
                const result = await response.json();
                return result;
            }
            async uploadExamplesMultipart(datasetId, uploads = []) {
                if (!await this._getMultiPartSupport()) throw new Error("Your LangSmith version does not allow using the multipart examples endpoint, please update to the latest version.");
                const formData = new FormData();
                for (const example of uploads){
                    const exampleId = (example.id ?? v4()).toString();
                    const exampleBody = {
                        created_at: example.created_at,
                        ...example.metadata && {
                            metadata: example.metadata
                        },
                        ...example.split && {
                            split: example.split
                        }
                    };
                    const stringifiedExample = serialize(exampleBody);
                    const exampleBlob = new Blob([
                        stringifiedExample
                    ], {
                        type: "application/json"
                    });
                    formData.append(exampleId, exampleBlob);
                    const stringifiedInputs = serialize(example.inputs);
                    const inputsBlob = new Blob([
                        stringifiedInputs
                    ], {
                        type: "application/json"
                    });
                    formData.append(`${exampleId}.inputs`, inputsBlob);
                    if (example.outputs) {
                        const stringifiedOutputs = serialize(example.outputs);
                        const outputsBlob = new Blob([
                            stringifiedOutputs
                        ], {
                            type: "application/json"
                        });
                        formData.append(`${exampleId}.outputs`, outputsBlob);
                    }
                    if (example.attachments) for (const [name, attachment] of Object.entries(example.attachments)){
                        let mimeType;
                        let data;
                        if (Array.isArray(attachment)) [mimeType, data] = attachment;
                        else {
                            mimeType = attachment.mimeType;
                            data = attachment.data;
                        }
                        const attachmentBlob = new Blob([
                            data
                        ], {
                            type: `${mimeType}; length=${data.byteLength}`
                        });
                        formData.append(`${exampleId}.attachment.${name}`, attachmentBlob);
                    }
                }
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/v1/platform/datasets/${datasetId}/examples`, {
                    method: "POST",
                    headers: this.headers,
                    body: formData
                });
                const result = await response.json();
                return result;
            }
            async updatePrompt(promptIdentifier, options) {
                if (!await this.promptExists(promptIdentifier)) throw new Error("Prompt does not exist, you must create it first.");
                const [owner, promptName] = parsePromptIdentifier(promptIdentifier);
                if (!await this._currentTenantIsOwner(owner)) throw await this._ownerConflictError("update a prompt", owner);
                const payload = {};
                if (options?.description !== void 0) payload.description = options.description;
                if (options?.readme !== void 0) payload.readme = options.readme;
                if (options?.tags !== void 0) payload.tags = options.tags;
                if (options?.isPublic !== void 0) payload.is_public = options.isPublic;
                if (options?.isArchived !== void 0) payload.is_archived = options.isArchived;
                if (0 === Object.keys(payload).length) throw new Error("No valid update options provided");
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                    headers: {
                        ...this.headers,
                        "Content-Type": "application/json"
                    },
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "update prompt");
                return response.json();
            }
            async deletePrompt(promptIdentifier) {
                if (!await this.promptExists(promptIdentifier)) throw new Error("Prompt does not exist, you must create it first.");
                const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
                if (!await this._currentTenantIsOwner(owner)) throw await this._ownerConflictError("delete a prompt", owner);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
                    method: "DELETE",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                return await response.json();
            }
            async pullPromptCommit(promptIdentifier, options) {
                const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
                const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}/${commitHash}${options?.includeModel ? "?include_model=true" : ""}`, {
                    method: "GET",
                    headers: this.headers,
                    signal: AbortSignal.timeout(this.timeout_ms),
                    ...this.fetchOptions
                });
                await raiseForStatus(response, "pull prompt commit");
                const result = await response.json();
                return {
                    owner,
                    repo: promptName,
                    commit_hash: result.commit_hash,
                    manifest: result.manifest,
                    examples: result.examples
                };
            }
            async _pullPrompt(promptIdentifier, options) {
                const promptObject = await this.pullPromptCommit(promptIdentifier, {
                    includeModel: options?.includeModel
                });
                const prompt = JSON.stringify(promptObject.manifest);
                return prompt;
            }
            async pushPrompt(promptIdentifier, options) {
                if (await this.promptExists(promptIdentifier)) {
                    if (options && Object.keys(options).some((key)=>"object" !== key)) await this.updatePrompt(promptIdentifier, {
                        description: options?.description,
                        readme: options?.readme,
                        tags: options?.tags,
                        isPublic: options?.isPublic
                    });
                } else await this.createPrompt(promptIdentifier, {
                    description: options?.description,
                    readme: options?.readme,
                    tags: options?.tags,
                    isPublic: options?.isPublic
                });
                if (!options?.object) return await this._getPromptUrl(promptIdentifier);
                const url = await this.createCommit(promptIdentifier, options?.object, {
                    parentCommitHash: options?.parentCommitHash
                });
                return url;
            }
            async clonePublicDataset(tokenOrUrl, options = {}) {
                const { sourceApiUrl = this.apiUrl, datasetName } = options;
                const [parsedApiUrl, tokenUuid] = this.parseTokenOrUrl(tokenOrUrl, sourceApiUrl);
                const sourceClient = new Client({
                    apiUrl: parsedApiUrl,
                    apiKey: "placeholder"
                });
                const ds = await sourceClient.readSharedDataset(tokenUuid);
                const finalDatasetName = datasetName || ds.name;
                try {
                    if (await this.hasDataset({
                        datasetId: finalDatasetName
                    })) return void console.log(`Dataset ${finalDatasetName} already exists in your tenant. Skipping.`);
                } catch (_) {}
                const examples = await sourceClient.listSharedExamples(tokenUuid);
                const dataset = await this.createDataset(finalDatasetName, {
                    description: ds.description,
                    dataType: ds.data_type || "kv",
                    inputsSchema: ds.inputs_schema_definition ?? void 0,
                    outputsSchema: ds.outputs_schema_definition ?? void 0
                });
                try {
                    await this.createExamples({
                        inputs: examples.map((e)=>e.inputs),
                        outputs: examples.flatMap((e)=>e.outputs ? [
                                e.outputs
                            ] : []),
                        datasetId: dataset.id
                    });
                } catch (e) {
                    console.error(`An error occurred while creating dataset ${finalDatasetName}. You should delete it manually.`);
                    throw e;
                }
            }
            parseTokenOrUrl(urlOrToken, apiUrl, numParts = 2, kind = "dataset") {
                try {
                    assertUuid(urlOrToken);
                    return [
                        apiUrl,
                        urlOrToken
                    ];
                } catch (_) {}
                try {
                    const parsedUrl = new URL(urlOrToken);
                    const pathParts = parsedUrl.pathname.split("/").filter((part)=>"" !== part);
                    if (pathParts.length >= numParts) {
                        const tokenUuid = pathParts[pathParts.length - numParts];
                        return [
                            apiUrl,
                            tokenUuid
                        ];
                    }
                    throw new Error(`Invalid public ${kind} URL: ${urlOrToken}`);
                } catch (error) {
                    throw new Error(`Invalid public ${kind} URL or token: ${urlOrToken}`);
                }
            }
            awaitPendingTraceBatches() {
                if (this.manualFlushMode) {
                    console.warn("[WARNING]: When tracing in manual flush mode, you must call `await client.flush()` manually to submit trace batches.");
                    return Promise.resolve();
                }
                return Promise.all([
                    ...this.autoBatchQueue.items.map(({ itemPromise })=>itemPromise),
                    this.batchIngestCaller.queue.onIdle()
                ]);
            }
        }
        const __version__ = "0.3.7";
        let globalEnv;
        const isBrowser = ()=>"undefined" != typeof window && void 0 !== window.document;
        const isWebWorker = ()=>"object" == typeof globalThis && globalThis.constructor && "DedicatedWorkerGlobalScope" === globalThis.constructor.name;
        const isJsDom = ()=>"undefined" != typeof window && "nodejs" === window.name || "undefined" != typeof navigator && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
        const isDeno = ()=>"undefined" != typeof Deno;
        const isNode = ()=>"undefined" != typeof process && void 0 !== process.versions && void 0 !== process.versions.node && !isDeno();
        const getEnv = ()=>{
            if (globalEnv) return globalEnv;
            globalEnv = isBrowser() ? "browser" : isNode() ? "node" : isWebWorker() ? "webworker" : isJsDom() ? "jsdom" : isDeno() ? "deno" : "other";
            return globalEnv;
        };
        let runtimeEnvironment;
        function getRuntimeEnvironment() {
            if (void 0 === runtimeEnvironment) {
                const env = getEnv();
                const releaseEnv = getShas();
                runtimeEnvironment = {
                    library: "langsmith",
                    runtime: env,
                    sdk: "langsmith-js",
                    sdk_version: __version__,
                    ...releaseEnv
                };
            }
            return runtimeEnvironment;
        }
        function getLangChainEnvVarsMetadata() {
            const allEnvVars = getEnvironmentVariables() || {};
            const envVars = {};
            const excluded = [
                "LANGCHAIN_API_KEY",
                "LANGCHAIN_ENDPOINT",
                "LANGCHAIN_TRACING_V2",
                "LANGCHAIN_PROJECT",
                "LANGCHAIN_SESSION",
                "LANGSMITH_API_KEY",
                "LANGSMITH_ENDPOINT",
                "LANGSMITH_TRACING_V2",
                "LANGSMITH_PROJECT",
                "LANGSMITH_SESSION"
            ];
            for (const [key, value] of Object.entries(allEnvVars))if ((key.startsWith("LANGCHAIN_") || key.startsWith("LANGSMITH_")) && "string" == typeof value && !excluded.includes(key) && !key.toLowerCase().includes("key") && !key.toLowerCase().includes("secret") && !key.toLowerCase().includes("token")) if ("LANGCHAIN_REVISION_ID" === key) envVars["revision_id"] = value;
            else envVars[key] = value;
            return envVars;
        }
        function getEnvironmentVariables() {
            try {
                if ("undefined" != typeof process && process.env) return Object.entries(process.env).reduce((acc, [key, value])=>{
                    acc[key] = String(value);
                    return acc;
                }, {});
                return;
            } catch (e) {
                return;
            }
        }
        function getEnvironmentVariable(name) {
            try {
                return "undefined" != typeof process ? process.env?.[name] : void 0;
            } catch (e) {
                return;
            }
        }
        function getLangSmithEnvironmentVariable(name) {
            return getEnvironmentVariable(`LANGSMITH_${name}`) || getEnvironmentVariable(`LANGCHAIN_${name}`);
        }
        let cachedCommitSHAs;
        function getShas() {
            if (void 0 !== cachedCommitSHAs) return cachedCommitSHAs;
            const common_release_envs = [
                "VERCEL_GIT_COMMIT_SHA",
                "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",
                "COMMIT_REF",
                "RENDER_GIT_COMMIT",
                "CI_COMMIT_SHA",
                "CIRCLE_SHA1",
                "CF_PAGES_COMMIT_SHA",
                "REACT_APP_GIT_SHA",
                "SOURCE_VERSION",
                "GITHUB_SHA",
                "TRAVIS_COMMIT",
                "GIT_COMMIT",
                "BUILD_VCS_NUMBER",
                "bamboo_planRepository_revision",
                "Build.SourceVersion",
                "BITBUCKET_COMMIT",
                "DRONE_COMMIT_SHA",
                "SEMAPHORE_GIT_SHA",
                "BUILDKITE_COMMIT"
            ];
            const shas = {};
            for (const env of common_release_envs){
                const envVar = getEnvironmentVariable(env);
                if (void 0 !== envVar) shas[env] = envVar;
            }
            cachedCommitSHAs = shas;
            return shas;
        }
        const isTracingEnabled = (tracingEnabled)=>{
            if (void 0 !== tracingEnabled) return tracingEnabled;
            const envVars = [
                "TRACING_V2",
                "TRACING"
            ];
            return !!envVars.find((envVar)=>"true" === getLangSmithEnvironmentVariable(envVar));
        };
        const _LC_CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");
        function stripNonAlphanumeric(input) {
            return input.replace(/[-:.]/g, "");
        }
        function convertToDottedOrderFormat(epoch, runId, executionOrder = 1) {
            const paddedOrder = executionOrder.toFixed(0).slice(0, 3).padStart(3, "0");
            return stripNonAlphanumeric(`${new Date(epoch).toISOString().slice(0, -1)}${paddedOrder}Z`) + runId;
        }
        class Baggage {
            constructor(metadata, tags){
                Object.defineProperty(this, "metadata", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tags", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.metadata = metadata;
                this.tags = tags;
            }
            static fromHeader(value) {
                const items = value.split(",");
                let metadata = {};
                let tags = [];
                for (const item of items){
                    const [key, uriValue] = item.split("=");
                    const value = decodeURIComponent(uriValue);
                    if ("langsmith-metadata" === key) metadata = JSON.parse(value);
                    else if ("langsmith-tags" === key) tags = value.split(",");
                }
                return new Baggage(metadata, tags);
            }
            toHeader() {
                const items = [];
                if (this.metadata && Object.keys(this.metadata).length > 0) items.push(`langsmith-metadata=${encodeURIComponent(JSON.stringify(this.metadata))}`);
                if (this.tags && this.tags.length > 0) items.push(`langsmith-tags=${encodeURIComponent(this.tags.join(","))}`);
                return items.join(",");
            }
        }
        class RunTree {
            constructor(originalConfig){
                Object.defineProperty(this, "id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "run_type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "project_name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "parent_run", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "child_runs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "start_time", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "end_time", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "extra", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tags", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "error", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "serialized", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "inputs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "outputs", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "reference_example_id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "client", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "events", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "trace_id", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "dotted_order", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tracingEnabled", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "execution_order", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "child_execution_order", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "attachments", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                if (run_trees_isRunTree(originalConfig)) return void Object.assign(this, {
                    ...originalConfig
                });
                const defaultConfig = RunTree.getDefaultConfig();
                const { metadata, ...config } = originalConfig;
                const client = config.client ?? RunTree.getSharedClient();
                const dedupedMetadata = {
                    ...metadata,
                    ...config?.extra?.metadata
                };
                config.extra = {
                    ...config.extra,
                    metadata: dedupedMetadata
                };
                Object.assign(this, {
                    ...defaultConfig,
                    ...config,
                    client
                });
                if (!this.trace_id) if (this.parent_run) this.trace_id = this.parent_run.trace_id ?? this.id;
                else this.trace_id = this.id;
                this.execution_order ??= 1;
                this.child_execution_order ??= 1;
                if (!this.dotted_order) {
                    const currentDottedOrder = convertToDottedOrderFormat(this.start_time, this.id, this.execution_order);
                    if (this.parent_run) this.dotted_order = this.parent_run.dotted_order + "." + currentDottedOrder;
                    else this.dotted_order = currentDottedOrder;
                }
            }
            static getDefaultConfig() {
                return {
                    id: v4(),
                    run_type: "chain",
                    project_name: getLangSmithEnvironmentVariable("PROJECT") ?? getEnvironmentVariable("LANGCHAIN_SESSION") ?? "default",
                    child_runs: [],
                    api_url: getEnvironmentVariable("LANGCHAIN_ENDPOINT") ?? "http://localhost:1984",
                    api_key: getEnvironmentVariable("LANGCHAIN_API_KEY"),
                    caller_options: {},
                    start_time: Date.now(),
                    serialized: {},
                    inputs: {},
                    extra: {}
                };
            }
            static getSharedClient() {
                if (!RunTree.sharedClient) RunTree.sharedClient = new Client();
                return RunTree.sharedClient;
            }
            createChild(config) {
                const child_execution_order = this.child_execution_order + 1;
                const child = new RunTree({
                    ...config,
                    parent_run: this,
                    project_name: this.project_name,
                    client: this.client,
                    tracingEnabled: this.tracingEnabled,
                    execution_order: child_execution_order,
                    child_execution_order: child_execution_order
                });
                if (_LC_CONTEXT_VARIABLES_KEY in this) child[_LC_CONTEXT_VARIABLES_KEY] = this[_LC_CONTEXT_VARIABLES_KEY];
                const LC_CHILD = Symbol.for("lc:child_config");
                const presentConfig = config.extra?.[LC_CHILD] ?? this.extra[LC_CHILD];
                if (isRunnableConfigLike(presentConfig)) {
                    const newConfig = {
                        ...presentConfig
                    };
                    const callbacks = isCallbackManagerLike(newConfig.callbacks) ? newConfig.callbacks.copy?.() : void 0;
                    if (callbacks) {
                        Object.assign(callbacks, {
                            _parentRunId: child.id
                        });
                        callbacks.handlers?.find(isLangChainTracerLike)?.updateFromRunTree?.(child);
                        newConfig.callbacks = callbacks;
                    }
                    child.extra[LC_CHILD] = newConfig;
                }
                const visited = new Set();
                let current = this;
                while(null != current && !visited.has(current.id)){
                    visited.add(current.id);
                    current.child_execution_order = Math.max(current.child_execution_order, child_execution_order);
                    current = current.parent_run;
                }
                this.child_runs.push(child);
                return child;
            }
            async end(outputs, error, endTime = Date.now(), metadata) {
                this.outputs = this.outputs ?? outputs;
                this.error = this.error ?? error;
                this.end_time = this.end_time ?? endTime;
                if (metadata && Object.keys(metadata).length > 0) this.extra = this.extra ? {
                    ...this.extra,
                    metadata: {
                        ...this.extra.metadata,
                        ...metadata
                    }
                } : {
                    metadata
                };
            }
            _convertToCreate(run, runtimeEnv, excludeChildRuns = true) {
                const runExtra = run.extra ?? {};
                if (!runExtra.runtime) runExtra.runtime = {};
                if (runtimeEnv) {
                    for (const [k, v] of Object.entries(runtimeEnv))if (!runExtra.runtime[k]) runExtra.runtime[k] = v;
                }
                let child_runs;
                let parent_run_id;
                if (excludeChildRuns) {
                    parent_run_id = run.parent_run?.id;
                    child_runs = [];
                } else {
                    child_runs = run.child_runs.map((child_run)=>this._convertToCreate(child_run, runtimeEnv, excludeChildRuns));
                    parent_run_id = void 0;
                }
                const persistedRun = {
                    id: run.id,
                    name: run.name,
                    start_time: run.start_time,
                    end_time: run.end_time,
                    run_type: run.run_type,
                    reference_example_id: run.reference_example_id,
                    extra: runExtra,
                    serialized: run.serialized,
                    error: run.error,
                    inputs: run.inputs,
                    outputs: run.outputs,
                    session_name: run.project_name,
                    child_runs: child_runs,
                    parent_run_id: parent_run_id,
                    trace_id: run.trace_id,
                    dotted_order: run.dotted_order,
                    tags: run.tags,
                    attachments: run.attachments
                };
                return persistedRun;
            }
            async postRun(excludeChildRuns = true) {
                try {
                    const runtimeEnv = getRuntimeEnvironment();
                    const runCreate = await this._convertToCreate(this, runtimeEnv, true);
                    await this.client.createRun(runCreate);
                    if (!excludeChildRuns) {
                        warnOnce("Posting with excludeChildRuns=false is deprecated and will be removed in a future version.");
                        for (const childRun of this.child_runs)await childRun.postRun(false);
                    }
                } catch (error) {
                    console.error(`Error in postRun for run ${this.id}:`, error);
                }
            }
            async patchRun() {
                try {
                    const runUpdate = {
                        end_time: this.end_time,
                        error: this.error,
                        inputs: this.inputs,
                        outputs: this.outputs,
                        parent_run_id: this.parent_run?.id,
                        reference_example_id: this.reference_example_id,
                        extra: this.extra,
                        events: this.events,
                        dotted_order: this.dotted_order,
                        trace_id: this.trace_id,
                        tags: this.tags,
                        attachments: this.attachments
                    };
                    await this.client.updateRun(this.id, runUpdate);
                } catch (error) {
                    console.error(`Error in patchRun for run ${this.id}`, error);
                }
            }
            toJSON() {
                return this._convertToCreate(this, void 0, false);
            }
            static fromRunnableConfig(parentConfig, props) {
                const callbackManager = parentConfig?.callbacks;
                let parentRun;
                let projectName;
                let client;
                let tracingEnabled = isTracingEnabled();
                if (callbackManager) {
                    const parentRunId = callbackManager?.getParentRunId?.() ?? "";
                    const langChainTracer = callbackManager?.handlers?.find((handler)=>handler?.name == "langchain_tracer");
                    parentRun = langChainTracer?.getRun?.(parentRunId);
                    projectName = langChainTracer?.projectName;
                    client = langChainTracer?.client;
                    tracingEnabled = tracingEnabled || !!langChainTracer;
                }
                if (!parentRun) return new RunTree({
                    ...props,
                    client,
                    tracingEnabled,
                    project_name: projectName
                });
                const parentRunTree = new RunTree({
                    name: parentRun.name,
                    id: parentRun.id,
                    trace_id: parentRun.trace_id,
                    dotted_order: parentRun.dotted_order,
                    client,
                    tracingEnabled,
                    project_name: projectName,
                    tags: [
                        ...new Set((parentRun?.tags ?? []).concat(parentConfig?.tags ?? []))
                    ],
                    extra: {
                        metadata: {
                            ...parentRun?.extra?.metadata,
                            ...parentConfig?.metadata
                        }
                    }
                });
                return parentRunTree.createChild(props);
            }
            static fromDottedOrder(dottedOrder) {
                return this.fromHeaders({
                    "langsmith-trace": dottedOrder
                });
            }
            static fromHeaders(headers, inheritArgs) {
                const rawHeaders = "get" in headers && "function" == typeof headers.get ? {
                    "langsmith-trace": headers.get("langsmith-trace"),
                    baggage: headers.get("baggage")
                } : headers;
                const headerTrace = rawHeaders["langsmith-trace"];
                if (!headerTrace || "string" != typeof headerTrace) return;
                const parentDottedOrder = headerTrace.trim();
                const parsedDottedOrder = parentDottedOrder.split(".").map((part)=>{
                    const [strTime, uuid] = part.split("Z");
                    return {
                        strTime,
                        time: Date.parse(strTime + "Z"),
                        uuid
                    };
                });
                const traceId = parsedDottedOrder[0].uuid;
                const config = {
                    ...inheritArgs,
                    name: inheritArgs?.["name"] ?? "parent",
                    run_type: inheritArgs?.["run_type"] ?? "chain",
                    start_time: inheritArgs?.["start_time"] ?? Date.now(),
                    id: parsedDottedOrder.at(-1)?.uuid,
                    trace_id: traceId,
                    dotted_order: parentDottedOrder
                };
                if (rawHeaders["baggage"] && "string" == typeof rawHeaders["baggage"]) {
                    const baggage = Baggage.fromHeader(rawHeaders["baggage"]);
                    config.metadata = baggage.metadata;
                    config.tags = baggage.tags;
                }
                return new RunTree(config);
            }
            toHeaders(headers) {
                const result = {
                    "langsmith-trace": this.dotted_order,
                    baggage: new Baggage(this.extra?.metadata, this.tags).toHeader()
                };
                if (headers) for (const [key, value] of Object.entries(result))headers.set(key, value);
                return result;
            }
        }
        Object.defineProperty(RunTree, "sharedClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        function run_trees_isRunTree(x) {
            return void 0 !== x && "function" == typeof x.createChild && "function" == typeof x.postRun;
        }
        function isLangChainTracerLike(x) {
            return "object" == typeof x && null != x && "string" == typeof x.name && "langchain_tracer" === x.name;
        }
        function containsLangChainTracerLike(x) {
            return Array.isArray(x) && x.some((callback)=>isLangChainTracerLike(callback));
        }
        function isCallbackManagerLike(x) {
            return "object" == typeof x && null != x && Array.isArray(x.handlers);
        }
        function isRunnableConfigLike(x) {
            return void 0 !== x && "object" == typeof x.callbacks && (containsLangChainTracerLike(x.callbacks?.handlers) || containsLangChainTracerLike(x.callbacks));
        }
        class MockAsyncLocalStorage {
            getStore() {}
            run(_, callback) {
                return callback();
            }
        }
        const TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
        const mockAsyncLocalStorage = new MockAsyncLocalStorage();
        class AsyncLocalStorageProvider {
            getInstance() {
                return globalThis[TRACING_ALS_KEY] ?? mockAsyncLocalStorage;
            }
            initializeGlobalInstance(instance) {
                if (void 0 === globalThis[TRACING_ALS_KEY]) globalThis[TRACING_ALS_KEY] = instance;
            }
        }
        const AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider();
        const ROOT = Symbol.for("langsmith:traceable:root");
        function isTraceableFunction(x) {
            return "function" == typeof x && "langsmith:traceable" in x;
        }
        function isPromiseMethod(x) {
            if ("then" === x || "catch" === x || "finally" === x) return true;
            return false;
        }
        function isKVMap(x) {
            if ("object" != typeof x || null == x) return false;
            const prototype = Object.getPrototypeOf(x);
            return (null === prototype || prototype === Object.prototype || null === Object.getPrototypeOf(prototype)) && !(Symbol.toStringTag in x) && !(Symbol.iterator in x);
        }
        const isAsyncIterable = (x)=>null != x && "object" == typeof x && "function" == typeof x[Symbol.asyncIterator];
        const isIteratorLike = (x)=>null != x && "object" == typeof x && "next" in x && "function" == typeof x.next;
        const GeneratorFunction = (function*() {}).constructor;
        const isGenerator = (x)=>null != x && "function" == typeof x && x instanceof GeneratorFunction;
        const isThenable = (x)=>null != x && "object" == typeof x && "then" in x && "function" == typeof x.then;
        const isReadableStream = (x)=>null != x && "object" == typeof x && "getReader" in x && "function" == typeof x.getReader;
        AsyncLocalStorageProviderSingleton.initializeGlobalInstance(new external_node_async_hooks_.AsyncLocalStorage());
        const runInputsToMap = (rawInputs)=>{
            const firstInput = rawInputs[0];
            let inputs;
            inputs = null == firstInput ? {} : rawInputs.length > 1 ? {
                args: rawInputs
            } : isKVMap(firstInput) ? firstInput : {
                input: firstInput
            };
            return inputs;
        };
        const handleRunInputs = (inputs, processInputs)=>{
            try {
                return processInputs(inputs);
            } catch (e) {
                console.error("Error occurred during processInputs. Sending raw inputs:", e);
                return inputs;
            }
        };
        const handleRunOutputs = (rawOutputs, processOutputs)=>{
            let outputs;
            outputs = isKVMap(rawOutputs) ? rawOutputs : {
                outputs: rawOutputs
            };
            try {
                return processOutputs(outputs);
            } catch (e) {
                console.error("Error occurred during processOutputs. Sending raw outputs:", e);
                return outputs;
            }
        };
        const handleRunAttachments = (rawInputs, extractAttachments)=>{
            if (!extractAttachments) return [
                void 0,
                rawInputs
            ];
            try {
                const [attachments, remainingArgs] = extractAttachments(...rawInputs);
                return [
                    attachments,
                    remainingArgs
                ];
            } catch (e) {
                console.error("Error occurred during extractAttachments:", e);
                return [
                    void 0,
                    rawInputs
                ];
            }
        };
        const getTracingRunTree = (runTree, inputs, getInvocationParams, processInputs, extractAttachments)=>{
            if (!isTracingEnabled(runTree.tracingEnabled)) return;
            const [attached, args] = handleRunAttachments(inputs, extractAttachments);
            runTree.attachments = attached;
            runTree.inputs = handleRunInputs(args, processInputs);
            const invocationParams = getInvocationParams?.(...inputs);
            if (null != invocationParams) {
                runTree.extra ??= {};
                runTree.extra.metadata = {
                    ...invocationParams,
                    ...runTree.extra.metadata
                };
            }
            return runTree;
        };
        const getSerializablePromise = (arg)=>{
            const proxyState = {
                current: void 0
            };
            const promiseProxy = new Proxy(arg, {
                get (target, prop, receiver) {
                    if ("then" === prop) {
                        const boundThen = arg[prop].bind(arg);
                        return (resolve, reject = (x)=>{
                            throw x;
                        })=>boundThen((value)=>{
                                proxyState.current = [
                                    "resolve",
                                    value
                                ];
                                return resolve(value);
                            }, (error)=>{
                                proxyState.current = [
                                    "reject",
                                    error
                                ];
                                return reject(error);
                            });
                    }
                    if ("catch" === prop) {
                        const boundCatch = arg[prop].bind(arg);
                        return (reject)=>boundCatch((error)=>{
                                proxyState.current = [
                                    "reject",
                                    error
                                ];
                                return reject(error);
                            });
                    }
                    if ("toJSON" === prop) return ()=>{
                        if (!proxyState.current) return;
                        const [type, value] = proxyState.current ?? [];
                        if ("resolve" === type) return value;
                        return {
                            error: value
                        };
                    };
                    return Reflect.get(target, prop, receiver);
                }
            });
            return promiseProxy;
        };
        const convertSerializableArg = (arg)=>{
            if (isReadableStream(arg)) {
                const proxyState = [];
                const transform = new TransformStream({
                    start: ()=>void 0,
                    transform: (chunk, controller)=>{
                        proxyState.push(chunk);
                        controller.enqueue(chunk);
                    },
                    flush: ()=>void 0
                });
                const pipeThrough = arg.pipeThrough(transform);
                Object.assign(pipeThrough, {
                    toJSON: ()=>proxyState
                });
                return pipeThrough;
            }
            if (isAsyncIterable(arg)) {
                const proxyState = {
                    current: []
                };
                return new Proxy(arg, {
                    get (target, prop, receiver) {
                        if (prop === Symbol.asyncIterator) return ()=>{
                            const boundIterator = arg[Symbol.asyncIterator].bind(arg);
                            const iterator = boundIterator();
                            return new Proxy(iterator, {
                                get (target, prop, receiver) {
                                    if ("next" === prop || "return" === prop || "throw" === prop) {
                                        const bound = iterator.next.bind(iterator);
                                        return (...args)=>{
                                            const wrapped = getSerializablePromise(bound(...args));
                                            proxyState.current.push(wrapped);
                                            return wrapped;
                                        };
                                    }
                                    if ("return" === prop || "throw" === prop) return iterator.next.bind(iterator);
                                    return Reflect.get(target, prop, receiver);
                                }
                            });
                        };
                        if ("toJSON" === prop) return ()=>{
                            const onlyNexts = proxyState.current;
                            const serialized = onlyNexts.map((next)=>next.toJSON());
                            const chunks = serialized.reduce((memo, next)=>{
                                if (next?.value) memo.push(next.value);
                                return memo;
                            }, []);
                            return chunks;
                        };
                        return Reflect.get(target, prop, receiver);
                    }
                });
            }
            if (!Array.isArray(arg) && isIteratorLike(arg)) {
                const proxyState = [];
                return new Proxy(arg, {
                    get (target, prop, receiver) {
                        if ("next" === prop || "return" === prop || "throw" === prop) {
                            const bound = arg[prop]?.bind(arg);
                            return (...args)=>{
                                const next = bound?.(...args);
                                if (null != next) proxyState.push(next);
                                return next;
                            };
                        }
                        if ("toJSON" === prop) return ()=>{
                            const chunks = proxyState.reduce((memo, next)=>{
                                if (next.value) memo.push(next.value);
                                return memo;
                            }, []);
                            return chunks;
                        };
                        return Reflect.get(target, prop, receiver);
                    }
                });
            }
            if (isThenable(arg)) return getSerializablePromise(arg);
            return arg;
        };
        function traceable_traceable(wrappedFunc, config) {
            const { aggregator, argsConfigPath, __finalTracedIteratorKey, processInputs, processOutputs, extractAttachments, ...runTreeConfig } = config ?? {};
            const processInputsFn = processInputs ?? ((x)=>x);
            const processOutputsFn = processOutputs ?? ((x)=>x);
            const extractAttachmentsFn = extractAttachments ?? ((...x)=>[
                    void 0,
                    runInputsToMap(x)
                ]);
            const traceableFunc = (...args)=>{
                let ensuredConfig;
                try {
                    let runtimeConfig;
                    if (argsConfigPath) {
                        const [index, path] = argsConfigPath;
                        if (index !== args.length - 1 || path) {
                            if (index <= args.length && "object" == typeof args[index] && null !== args[index]) if (path) {
                                const { [path]: extracted, ...rest } = args[index];
                                runtimeConfig = extracted;
                                args[index] = rest;
                            } else {
                                runtimeConfig = args[index];
                                args.splice(index, 1);
                            }
                        } else runtimeConfig = args.pop();
                    }
                    ensuredConfig = {
                        name: wrappedFunc.name || "<lambda>",
                        ...runTreeConfig,
                        ...runtimeConfig,
                        tags: [
                            ...new Set([
                                ...runTreeConfig?.tags ?? [],
                                ...runtimeConfig?.tags ?? []
                            ])
                        ],
                        metadata: {
                            ...runTreeConfig?.metadata,
                            ...runtimeConfig?.metadata
                        }
                    };
                } catch (err) {
                    console.warn(`Failed to extract runtime config from args for ${runTreeConfig?.name ?? wrappedFunc.name}`, err);
                    ensuredConfig = {
                        name: wrappedFunc.name || "<lambda>",
                        ...runTreeConfig
                    };
                }
                const asyncLocalStorage = AsyncLocalStorageProviderSingleton.getInstance();
                const processedArgs = args;
                for(let i = 0; i < processedArgs.length; i++)processedArgs[i] = convertSerializableArg(processedArgs[i]);
                const [currentRunTree, rawInputs] = (()=>{
                    const [firstArg, ...restArgs] = processedArgs;
                    if (isRunnableConfigLike(firstArg)) return [
                        getTracingRunTree(RunTree.fromRunnableConfig(firstArg, ensuredConfig), restArgs, config?.getInvocationParams, processInputsFn, extractAttachmentsFn),
                        restArgs
                    ];
                    if (run_trees_isRunTree(firstArg) && "callbackManager" in firstArg && null != firstArg.callbackManager) return [
                        firstArg,
                        restArgs
                    ];
                    if (firstArg === ROOT || run_trees_isRunTree(firstArg)) {
                        const currentRunTree = getTracingRunTree(firstArg === ROOT ? new RunTree(ensuredConfig) : firstArg.createChild(ensuredConfig), restArgs, config?.getInvocationParams, processInputsFn, extractAttachmentsFn);
                        return [
                            currentRunTree,
                            [
                                currentRunTree,
                                ...restArgs
                            ]
                        ];
                    }
                    const prevRunFromStore = asyncLocalStorage.getStore();
                    if (run_trees_isRunTree(prevRunFromStore)) return [
                        getTracingRunTree(prevRunFromStore.createChild(ensuredConfig), processedArgs, config?.getInvocationParams, processInputsFn, extractAttachmentsFn),
                        processedArgs
                    ];
                    const currentRunTree = getTracingRunTree(new RunTree(ensuredConfig), processedArgs, config?.getInvocationParams, processInputsFn, extractAttachmentsFn);
                    if (void 0 !== prevRunFromStore && _LC_CONTEXT_VARIABLES_KEY in prevRunFromStore) currentRunTree[_LC_CONTEXT_VARIABLES_KEY] = prevRunFromStore[_LC_CONTEXT_VARIABLES_KEY];
                    return [
                        currentRunTree,
                        processedArgs
                    ];
                })();
                return asyncLocalStorage.run(currentRunTree, ()=>{
                    const postRunPromise = currentRunTree?.postRun();
                    async function handleChunks(chunks) {
                        if (void 0 !== aggregator) try {
                            return await aggregator(chunks);
                        } catch (e) {
                            console.error("[ERROR]: LangSmith aggregation failed: ", e);
                        }
                        return chunks;
                    }
                    function tapReadableStreamForTracing(stream, snapshot) {
                        const reader = stream.getReader();
                        let finished = false;
                        const chunks = [];
                        const tappedStream = new ReadableStream({
                            async start (controller) {
                                while(true){
                                    const result = await (snapshot ? snapshot(()=>reader.read()) : reader.read());
                                    if (result.done) {
                                        finished = true;
                                        await currentRunTree?.end(handleRunOutputs(await handleChunks(chunks), processOutputsFn));
                                        await handleEnd();
                                        controller.close();
                                        break;
                                    }
                                    chunks.push(result.value);
                                    controller.enqueue(result.value);
                                }
                            },
                            async cancel (reason) {
                                if (!finished) await currentRunTree?.end(void 0, "Cancelled");
                                await currentRunTree?.end(handleRunOutputs(await handleChunks(chunks), processOutputsFn));
                                await handleEnd();
                                return reader.cancel(reason);
                            }
                        });
                        return tappedStream;
                    }
                    async function* wrapAsyncIteratorForTracing(iterator, snapshot) {
                        let finished = false;
                        const chunks = [];
                        try {
                            while(true){
                                const { value, done } = await (snapshot ? snapshot(()=>iterator.next()) : iterator.next());
                                if (done) {
                                    finished = true;
                                    break;
                                }
                                chunks.push(value);
                                yield value;
                            }
                        } catch (e) {
                            await currentRunTree?.end(void 0, String(e));
                            throw e;
                        } finally{
                            if (!finished) await currentRunTree?.end(void 0, "Cancelled");
                            await currentRunTree?.end(handleRunOutputs(await handleChunks(chunks), processOutputsFn));
                            await handleEnd();
                        }
                    }
                    function wrapAsyncGeneratorForTracing(iterable, snapshot) {
                        if (isReadableStream(iterable)) return tapReadableStreamForTracing(iterable, snapshot);
                        const iterator = iterable[Symbol.asyncIterator]();
                        const wrappedIterator = wrapAsyncIteratorForTracing(iterator, snapshot);
                        iterable[Symbol.asyncIterator] = ()=>wrappedIterator;
                        return iterable;
                    }
                    async function handleEnd() {
                        const onEnd = config?.on_end;
                        if (onEnd) if (currentRunTree) onEnd(currentRunTree);
                        else console.warn("Can not call 'on_end' if currentRunTree is undefined");
                        await postRunPromise;
                        await currentRunTree?.patchRun();
                    }
                    function gatherAll(iterator) {
                        const chunks = [];
                        while(true){
                            const next = iterator.next();
                            chunks.push(next);
                            if (next.done) break;
                        }
                        return chunks;
                    }
                    let returnValue;
                    try {
                        returnValue = wrappedFunc(...rawInputs);
                    } catch (err) {
                        returnValue = Promise.reject(err);
                    }
                    if (isAsyncIterable(returnValue)) {
                        const snapshot = external_node_async_hooks_.AsyncLocalStorage.snapshot();
                        return wrapAsyncGeneratorForTracing(returnValue, snapshot);
                    }
                    if (!Array.isArray(returnValue) && "object" == typeof returnValue && null != returnValue && void 0 !== __finalTracedIteratorKey && isAsyncIterable(returnValue[__finalTracedIteratorKey])) {
                        const snapshot = external_node_async_hooks_.AsyncLocalStorage.snapshot();
                        return {
                            ...returnValue,
                            [__finalTracedIteratorKey]: wrapAsyncGeneratorForTracing(returnValue[__finalTracedIteratorKey], snapshot)
                        };
                    }
                    const tracedPromise = new Promise((resolve, reject)=>{
                        Promise.resolve(returnValue).then(async (rawOutput)=>{
                            if (isAsyncIterable(rawOutput)) {
                                const snapshot = external_node_async_hooks_.AsyncLocalStorage.snapshot();
                                return resolve(wrapAsyncGeneratorForTracing(rawOutput, snapshot));
                            }
                            if (!Array.isArray(rawOutput) && "object" == typeof rawOutput && null != rawOutput && void 0 !== __finalTracedIteratorKey && isAsyncIterable(rawOutput[__finalTracedIteratorKey])) {
                                const snapshot = external_node_async_hooks_.AsyncLocalStorage.snapshot();
                                return {
                                    ...rawOutput,
                                    [__finalTracedIteratorKey]: wrapAsyncGeneratorForTracing(rawOutput[__finalTracedIteratorKey], snapshot)
                                };
                            }
                            if (isGenerator(wrappedFunc) && isIteratorLike(rawOutput)) {
                                const chunks = gatherAll(rawOutput);
                                try {
                                    await currentRunTree?.end(handleRunOutputs(await handleChunks(chunks.reduce((memo, { value, done })=>{
                                        if (!done || void 0 !== value) memo.push(value);
                                        return memo;
                                    }, [])), processOutputsFn));
                                    await handleEnd();
                                } catch (e) {
                                    console.error("Error occurred during handleEnd:", e);
                                }
                                return function*() {
                                    for (const ret of chunks){
                                        if (ret.done) return ret.value;
                                        yield ret.value;
                                    }
                                }();
                            }
                            try {
                                await currentRunTree?.end(handleRunOutputs(rawOutput, processOutputsFn));
                                await handleEnd();
                            } finally{
                                return rawOutput;
                            }
                        }, async (error)=>{
                            await currentRunTree?.end(void 0, String(error));
                            await handleEnd();
                            throw error;
                        }).then(resolve, reject);
                    });
                    if ("object" != typeof returnValue || null === returnValue) return tracedPromise;
                    return new Proxy(returnValue, {
                        get (target, prop, receiver) {
                            if (isPromiseMethod(prop)) return tracedPromise[prop].bind(tracedPromise);
                            return Reflect.get(target, prop, receiver);
                        }
                    });
                });
            };
            Object.defineProperty(traceableFunc, "langsmith:traceable", {
                value: runTreeConfig
            });
            return traceableFunc;
        }
        function _combineChatCompletionChoices(choices) {
            const reversedChoices = choices.slice().reverse();
            const message = {
                role: "assistant",
                content: ""
            };
            for (const c of reversedChoices)if (c.delta.role) {
                message["role"] = c.delta.role;
                break;
            }
            const toolCalls = {};
            for (const c of choices){
                if (c.delta.content) message.content = message.content.concat(c.delta.content);
                if (c.delta.function_call) {
                    if (!message.function_call) message.function_call = {
                        name: "",
                        arguments: ""
                    };
                    if (c.delta.function_call.name) message.function_call.name += c.delta.function_call.name;
                    if (c.delta.function_call.arguments) message.function_call.arguments += c.delta.function_call.arguments;
                }
                if (c.delta.tool_calls) for (const tool_call of c.delta.tool_calls){
                    if (!toolCalls[c.index]) toolCalls[c.index] = [];
                    toolCalls[c.index].push(tool_call);
                }
            }
            if (Object.keys(toolCalls).length > 0) {
                message.tool_calls = [
                    ...Array(Object.keys(toolCalls).length)
                ];
                for (const [index, toolCallChunks] of Object.entries(toolCalls)){
                    const idx = parseInt(index);
                    message.tool_calls[idx] = {
                        index: idx,
                        id: toolCallChunks.find((c)=>c.id)?.id || null,
                        type: toolCallChunks.find((c)=>c.type)?.type || null
                    };
                    for (const chunk of toolCallChunks)if (chunk.function) {
                        if (!message.tool_calls[idx].function) message.tool_calls[idx].function = {
                            name: "",
                            arguments: ""
                        };
                        if (chunk.function.name) message.tool_calls[idx].function.name += chunk.function.name;
                        if (chunk.function.arguments) message.tool_calls[idx].function.arguments += chunk.function.arguments;
                    }
                }
            }
            return {
                index: choices[0].index,
                finish_reason: reversedChoices.find((c)=>c.finish_reason) || null,
                message: message
            };
        }
        const chatAggregator = (chunks)=>{
            if (!chunks || 0 === chunks.length) return {
                choices: [
                    {
                        message: {
                            role: "assistant",
                            content: ""
                        }
                    }
                ]
            };
            const choicesByIndex = {};
            for (const chunk of chunks)for (const choice of chunk.choices){
                if (void 0 === choicesByIndex[choice.index]) choicesByIndex[choice.index] = [];
                choicesByIndex[choice.index].push(choice);
            }
            const aggregatedOutput = chunks[chunks.length - 1];
            aggregatedOutput.choices = Object.values(choicesByIndex).map((choices)=>_combineChatCompletionChoices(choices));
            return aggregatedOutput;
        };
        const textAggregator = (allChunks)=>{
            if (0 === allChunks.length) return {
                choices: [
                    {
                        text: ""
                    }
                ]
            };
            const allContent = [];
            for (const chunk of allChunks){
                const content = chunk.choices[0].text;
                if (null != content) allContent.push(content);
            }
            const content = allContent.join("");
            const aggregatedOutput = allChunks[allChunks.length - 1];
            aggregatedOutput.choices = [
                {
                    ...aggregatedOutput.choices[0],
                    text: content
                }
            ];
            return aggregatedOutput;
        };
        function processChatCompletion(outputs) {
            const chatCompletion = outputs;
            const result = {
                ...chatCompletion
            };
            const usage = chatCompletion.usage;
            if (usage) {
                const inputTokenDetails = {
                    ...usage.prompt_tokens_details?.audio_tokens !== null && {
                        audio: usage.prompt_tokens_details?.audio_tokens
                    },
                    ...usage.prompt_tokens_details?.cached_tokens !== null && {
                        cache_read: usage.prompt_tokens_details?.cached_tokens
                    }
                };
                const outputTokenDetails = {
                    ...usage.completion_tokens_details?.audio_tokens !== null && {
                        audio: usage.completion_tokens_details?.audio_tokens
                    },
                    ...usage.completion_tokens_details?.reasoning_tokens !== null && {
                        reasoning: usage.completion_tokens_details?.reasoning_tokens
                    }
                };
                result.usage_metadata = {
                    input_tokens: usage.prompt_tokens ?? 0,
                    output_tokens: usage.completion_tokens ?? 0,
                    total_tokens: usage.total_tokens ?? 0,
                    ...Object.keys(inputTokenDetails).length > 0 && {
                        input_token_details: inputTokenDetails
                    },
                    ...Object.keys(outputTokenDetails).length > 0 && {
                        output_token_details: outputTokenDetails
                    }
                };
            }
            delete result.usage;
            return result;
        }
        const wrapOpenAI = (openai, options)=>{
            if (isTraceableFunction(openai.chat.completions.create) || isTraceableFunction(openai.completions.create)) throw new Error("This instance of OpenAI client has been already wrapped once.");
            const tracedOpenAIClient = {
                ...openai
            };
            if (openai.beta && openai.beta.chat && openai.beta.chat.completions && "function" == typeof openai.beta.chat.completions.parse) tracedOpenAIClient.beta = {
                ...openai.beta,
                chat: {
                    ...openai.beta.chat,
                    completions: {
                        ...openai.beta.chat.completions,
                        parse: traceable_traceable(openai.beta.chat.completions.parse.bind(openai.beta.chat.completions), {
                            name: "ChatOpenAI",
                            run_type: "llm",
                            aggregator: chatAggregator,
                            argsConfigPath: [
                                1,
                                "langsmithExtra"
                            ],
                            getInvocationParams: (payload)=>{
                                if ("object" != typeof payload || null == payload) return;
                                const params = payload;
                                const ls_stop = ("string" == typeof params.stop ? [
                                    params.stop
                                ] : params.stop) ?? void 0;
                                return {
                                    ls_provider: "openai",
                                    ls_model_type: "chat",
                                    ls_model_name: params.model,
                                    ls_max_tokens: params.max_tokens ?? void 0,
                                    ls_temperature: params.temperature ?? void 0,
                                    ls_stop
                                };
                            },
                            ...options
                        })
                    }
                }
            };
            tracedOpenAIClient.chat = {
                ...openai.chat,
                completions: {
                    ...openai.chat.completions,
                    create: traceable_traceable(openai.chat.completions.create.bind(openai.chat.completions), {
                        name: "ChatOpenAI",
                        run_type: "llm",
                        aggregator: chatAggregator,
                        argsConfigPath: [
                            1,
                            "langsmithExtra"
                        ],
                        getInvocationParams: (payload)=>{
                            if ("object" != typeof payload || null == payload) return;
                            const params = payload;
                            const ls_stop = ("string" == typeof params.stop ? [
                                params.stop
                            ] : params.stop) ?? void 0;
                            return {
                                ls_provider: "openai",
                                ls_model_type: "chat",
                                ls_model_name: params.model,
                                ls_max_tokens: params.max_tokens ?? void 0,
                                ls_temperature: params.temperature ?? void 0,
                                ls_stop
                            };
                        },
                        processOutputs: processChatCompletion,
                        ...options
                    })
                }
            };
            tracedOpenAIClient.completions = {
                ...openai.completions,
                create: traceable_traceable(openai.completions.create.bind(openai.completions), {
                    name: "OpenAI",
                    run_type: "llm",
                    aggregator: textAggregator,
                    argsConfigPath: [
                        1,
                        "langsmithExtra"
                    ],
                    getInvocationParams: (payload)=>{
                        if ("object" != typeof payload || null == payload) return;
                        const params = payload;
                        const ls_stop = ("string" == typeof params.stop ? [
                            params.stop
                        ] : params.stop) ?? void 0;
                        return {
                            ls_provider: "openai",
                            ls_model_type: "llm",
                            ls_model_name: params.model,
                            ls_max_tokens: params.max_tokens ?? void 0,
                            ls_temperature: params.temperature ?? void 0,
                            ls_stop
                        };
                    },
                    ...options
                })
            };
            return tracedOpenAIClient;
        };
    }
};
