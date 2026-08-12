(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[2084],{

/***/ 63079:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ConsoleAdapter: function() { return /* reexport */ ConsoleAdapter; },
  DEFAULT_FINGERPRINT_CONFIG: function() { return /* reexport */ fingerprint.DEFAULT_FINGERPRINT_CONFIG; },
  FINGERPRINT_VERSION: function() { return /* reexport */ fingerprint.FINGERPRINT_VERSION; },
  Reporter: function() { return /* reexport */ Reporter; },
  canonicalRaiseSite: function() { return /* reexport */ fingerprint.canonicalRaiseSite; },
  computeFrontendFingerprint: function() { return /* reexport */ fingerprint.computeFrontendFingerprint; },
  critical: function() { return /* binding */ critical; },
  debug: function() { return /* binding */ debug; },
  error: function() { return /* binding */ error; },
  info: function() { return /* binding */ info; },
  init: function() { return /* binding */ init; },
  log: function() { return /* binding */ log; },
  normalizeRoute: function() { return /* reexport */ fingerprint.normalizeRoute; },
  onError: function() { return /* reexport */ onError; },
  packageName: function() { return /* binding */ packageName; },
  warn: function() { return /* binding */ warn; },
  warning: function() { return /* binding */ warning; },
  withContext: function() { return /* binding */ withContext; }
});

;// ./node_modules/@appfolio/browser-reporter/dist/esm/adapters/console.js
/**
 * Zero-config adapter wrapping the browser/Node console.
 * Used automatically as the fallback when no adapters are configured.
 * Can also be used explicitly in development or test environments.
 */
class ConsoleAdapter {
    _context;
    constructor(context = {}) {
        this._context = context;
    }
    _args(...args) {
        if (Object.keys(this._context).length > 0) {
            return [JSON.stringify(this._context), ...args];
        }
        return args;
    }
    log(...args) {
        console.log(...this._args(...args));
    }
    debug(...args) {
        console.debug(...this._args(...args));
    }
    info(...args) {
        console.info(...this._args(...args));
    }
    warn(...args) {
        console.warn(...this._args(...args));
    }
    warning(...args) {
        console.warn(...this._args(...args));
    }
    error(...args) {
        console.error(...this._args(...args));
    }
    critical(...args) {
        console.error(...this._args(...args));
    }
    withContext(context) {
        return new ConsoleAdapter(Object.assign({}, this._context, context));
    }
}
//# sourceMappingURL=console.js.map
;// ./node_modules/@appfolio/browser-reporter/dist/esm/reporter.js

/**
 * Fans error reports out to all registered adapters simultaneously.
 * A failure in one adapter is caught and logged, but does not prevent
 * delivery to the remaining adapters.
 */
class Reporter {
    adapters;
    constructor(adapters) {
        this.adapters = adapters.length > 0 ? adapters : [new ConsoleAdapter()];
    }
    _fanOut(method, ...args) {
        for (const adapter of this.adapters) {
            try {
                adapter[method](...args);
            }
            catch (e) {
                console.error(`[@appfolio/browser-reporter] Adapter "${adapter.constructor.name}" threw during "${method}":`, e);
            }
        }
    }
    log(...args) {
        this._fanOut('log', ...args);
    }
    debug(...args) {
        this._fanOut('debug', ...args);
    }
    info(...args) {
        this._fanOut('info', ...args);
    }
    warn(...args) {
        this._fanOut('warn', ...args);
    }
    warning(...args) {
        this._fanOut('warning', ...args);
    }
    error(...args) {
        this._fanOut('error', ...args);
    }
    critical(...args) {
        this._fanOut('critical', ...args);
    }
    withContext(context) {
        return new Reporter(this.adapters.map((a) => a.withContext(context)));
    }
}
//# sourceMappingURL=reporter.js.map
;// ./node_modules/@appfolio/browser-reporter/dist/esm/singleton.js
/**
 * Holds the mutable module-level Reporter reference.
 * Extracted into its own module to avoid circular imports between
 * src/index.ts and src/decorators/on-error.ts.
 */


let _reporter = new Reporter([new ConsoleAdapter()]);
function getReporter() {
    return _reporter;
}
function setReporter(reporter) {
    _reporter = reporter;
}
//# sourceMappingURL=singleton.js.map
;// ./node_modules/@appfolio/browser-reporter/dist/esm/decorators/on-error.js

/**
 * Method decorator that wraps an async class method to automatically
 * report unhandled exceptions to all configured adapters, then re-throw.
 *
 * @param description - Human-readable name for the method (e.g. "PaymentService.charge")
 * @param opts - Optional reporting options
 */
function onError(description, opts = {}) {
    return function (target, _context) {
        return async function (...args) {
            try {
                return await target.apply(this, args);
            }
            catch (err) {
                const errObj = err;
                const shouldSuppress = opts.suppressOnStatus != null &&
                    errObj.status != null &&
                    opts.suppressOnStatus.includes(errObj.status);
                if (!shouldSuppress) {
                    getReporter().error(`Error: ${description}`, errObj.data ?? err);
                }
                throw err;
            }
        };
    };
}
//# sourceMappingURL=on-error.js.map
// EXTERNAL MODULE: ./node_modules/@appfolio/browser-reporter/dist/esm/fingerprint.js
var fingerprint = __webpack_require__(98000);
;// ./node_modules/@appfolio/browser-reporter/dist/esm/index.js







// Adapters that rely on optional peer deps are not re-exported here to avoid
// requiring those peers for all consumers. Import them via subpath exports:
//   import { RollbarAdapter } from '@appfolio/browser-reporter/adapters/rollbar'
//   import { DatadogAdapter } from '@appfolio/browser-reporter/adapters/datadog'
/**
 * Configure the module-level reporter with the given adapters.
 * Call once at application startup before any reporting.
 * Calling init() a second time replaces the adapter list.
 * If adapters is empty (or init is never called), falls back to ConsoleAdapter.
 */
function init(adapters) {
    const reporter = adapters.length > 0 ? new Reporter(adapters) : new Reporter([new ConsoleAdapter()]);
    setReporter(reporter);
}
function log(...args) {
    getReporter().log(...args);
}
function debug(...args) {
    getReporter().debug(...args);
}
function info(...args) {
    getReporter().info(...args);
}
function warn(...args) {
    getReporter().warn(...args);
}
function warning(...args) {
    getReporter().warning(...args);
}
function error(...args) {
    getReporter().error(...args);
}
function critical(...args) {
    getReporter().critical(...args);
}
function withContext(context) {
    return getReporter().withContext(context);
}
/** Package identifier constant — useful for debugging at runtime. */
const packageName = '@appfolio/browser-reporter';
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 65606:
/***/ (function(module) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 98000:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_FINGERPRINT_CONFIG: function() { return /* binding */ DEFAULT_FINGERPRINT_CONFIG; },
/* harmony export */   FINGERPRINT_VERSION: function() { return /* binding */ FINGERPRINT_VERSION; },
/* harmony export */   canonicalRaiseSite: function() { return /* binding */ canonicalRaiseSite; },
/* harmony export */   computeFrontendFingerprint: function() { return /* binding */ computeFrontendFingerprint; },
/* harmony export */   normalizeRoute: function() { return /* binding */ normalizeRoute; }
/* harmony export */ });
/**
 * Custom error-fingerprint computation for frontend (browser) errors.
 *
 * Datadog groups Error Tracking issues by `service` + `error.fingerprint`. When no
 * custom fingerprint is set, Datadog derives one from `service` + error type + message +
 * top stack frame; with one shared `service` across many teams/pages, unrelated errors
 * collapse into a single issue. This module produces a deterministic custom fingerprint
 * that additionally discriminates by normalized route, mirroring the backend
 * `af_observability` recipe (`path|type|raise`, message deliberately excluded).
 *
 * The value is a readable, pipe-delimited recipe string:
 *
 *     route:<normalized-route>|type:<error.type>|raise:<canonical-frame>
 *
 * Datadog imposes no format requirement on the fingerprint (it standardizes the value
 * server-side to `v1.<md5>`), so a human-readable recipe is used for debuggability.
 *
 * This module is PURE — it computes strings only. Attaching the value to a Datadog event
 * (RUM `error.fingerprint` / `Error.dd_fingerprint`, or a log's `error.fingerprint`) is the
 * caller's responsibility. `computeFrontendFingerprint` never throws (it fails open,
 * returning `undefined`) so it is safe to call from a RUM `beforeSend` callback, where a
 * thrown exception would break error delivery.
 */
const FINGERPRINT_VERSION = '1';
const DEFAULT_FINGERPRINT_CONFIG = {
    enabled: false,
    shadow: true,
    version: FINGERPRINT_VERSION,
};
// Per-part and total caps — identical to the backend recipe caps.
const ROUTE_MAX = 200;
const TYPE_MAX = 100;
const RAISE_MAX = 200;
const TOTAL_MAX = 1024;
const UNKNOWN = 'unknown';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LONG_HEX_RE = /^[0-9a-f]{12,}$/i;
const NUMERIC_RE = /^\d+$/;
function cap(value, max) {
    return value.length > max ? value.slice(0, max) : value;
}
// Segment made up solely of digits and phone/id punctuation (parens, dashes, dots,
// spaces, plus), carrying enough digits to be an identifier rather than a version like
// `v1.2`. Catches phone-number route keys such as `(831) 740-7086` and `831-740-7086`.
const PUNCTUATED_ID_RE = /^[\d()\-.\s+]+$/;
/**
 * True for path segments that are volatile identifiers and must collapse to `:id`:
 * numeric ids, UUIDs, long hex tokens, '@' (an email), percent-encoding (never a static
 * route segment), and punctuated numeric identifiers such as phone numbers.
 *
 * KNOWN LIMITATION: non-numeric identifier slugs (account/tenant slugs, usernames) are NOT
 * collapsed, because they are structurally indistinguishable from static page names and
 * collapsing them would merge unrelated pages into one fingerprint. Such routes can fragment
 * groups or carry slug PII. For precise routes, supply an app-provided view/route name.
 */
function isDynamicSegment(segment) {
    return (NUMERIC_RE.test(segment) ||
        UUID_RE.test(segment) ||
        LONG_HEX_RE.test(segment) ||
        segment.includes('@') ||
        // Percent-encoding (e.g. an encoded phone number `%28831%29%20740-7086`) is never a
        // legitimate static route segment.
        segment.includes('%') ||
        ((segment.match(/\d/g) || []).length >= 7 && PUNCTUATED_ID_RE.test(segment)));
}
/**
 * Normalize a raw route/URL into a stable route pattern:
 * strips the origin, query string, and fragment; collapses numeric / UUID / long-hex
 * path segments to `:id`. Returns `unknown` when the route cannot be derived.
 */
function normalizeRoute(route) {
    if (!route)
        return UNKNOWN;
    let path = route;
    // If it's a full URL, keep only the pathname (drops origin so QA/prod/CDN hosts don't fragment).
    const schemeIndex = path.indexOf('://');
    if (schemeIndex !== -1) {
        const afterScheme = path.slice(schemeIndex + 3);
        const slashIndex = afterScheme.indexOf('/');
        path = slashIndex === -1 ? '/' : afterScheme.slice(slashIndex);
    }
    // Strip query and fragment.
    path = path.split('?')[0].split('#')[0];
    if (!path)
        return UNKNOWN;
    const normalized = path
        .split('/')
        .map((segment) => (isDynamicSegment(segment) ? ':id' : segment))
        .join('/');
    return normalized || UNKNOWN;
}
const SKIP_FRAME_MARKERS = ['browser-reporter', 'datadog-rum', 'datadog-logs', '@datadog/browser'];
/** Hash-like token: 2+ chars and not a plain lowercase word (i.e. contains a digit or capital). */
function isHashToken(token) {
    return token.length >= 2 && !/^[a-z_]+$/.test(token);
}
/**
 * Collapse a hashed bundle filename so deploys don't fragment groups. Two passes:
 *   1. webpack/Metro: a `.`- or `-`-delimited hex hash before the extension
 *      (`main.d136698469c8149c03f0.js` → `main.js`, `9696-ed94aa01…js` → `9696.js`).
 *   2. Vite/Rolldown: base64url hashes (non-hex letters, hash may itself contain `-`),
 *      stripped by dropping trailing hash-like `-`-tokens while keeping the first token
 *      (`useHover-6awRc1Lt.js` → `useHover.js`, `react-dom-BJ-ye8av.js` → `react-dom.js`).
 * Genuine names survive because plain lowercase words (`analytics`, `fingerprint`) aren't
 * hash-like.
 */
function collapseHashedFilename(location) {
    const out = location.replace(/[.-][0-9a-f]{8,}(?=\.[a-z0-9]+$)/i, '');
    const match = out.match(/^(.*\/)?([^/]+)(\.[a-z0-9]+)$/i);
    if (!match)
        return out;
    const [, dir = '', stem, ext] = match;
    const parts = stem.split('-');
    while (parts.length > 1 && isHashToken(parts[parts.length - 1]))
        parts.pop();
    return `${dir}${parts.join('-')}${ext}`;
}
/**
 * Derive the canonical top stack frame: the first meaningful frame (skipping SDK/reporter
 * frames), reduced to its file path with line/column numbers stripped and any hashed bundle
 * filename collapsed. Returns `unknown` when no usable frame is found.
 */
function canonicalRaiseSite(stack) {
    if (!stack)
        return UNKNOWN;
    const lines = stack.split('\n');
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (SKIP_FRAME_MARKERS.some((marker) => line.includes(marker)))
            continue;
        // Extract a candidate location ONLY from real frame syntax, so the leading
        // message line — which may contain '@' or 'at ' as ordinary text (e.g. an email
        // address) — is never mistaken for a frame:
        //   V8:              "at fn (LOCATION)"  or  "at LOCATION"
        //   Firefox/Safari:  "fn@LOCATION"       or  "@LOCATION"
        let location;
        const v8Paren = line.match(/^at\s+.*\(([^)]+)\)$/);
        if (v8Paren) {
            location = v8Paren[1];
        }
        else if (/^at\s+/.test(line)) {
            location = line.replace(/^at\s+/, '');
        }
        else if (line.includes('@')) {
            location = line.slice(line.lastIndexOf('@') + 1);
        }
        if (!location)
            continue;
        // A real frame location ends with ":<line>" or ":<line>:<col>"; requiring it
        // rejects any message text that slipped through (an email has no such suffix).
        if (!/:\d+(?::\d+)?$/.test(location))
            continue;
        // Reduce a URL to its pathname (drop origin), then strip query and trailing :line:col.
        const schemeIndex = location.indexOf('://');
        if (schemeIndex !== -1) {
            const afterScheme = location.slice(schemeIndex + 3);
            const slashIndex = afterScheme.indexOf('/');
            location = slashIndex === -1 ? afterScheme : afterScheme.slice(slashIndex);
        }
        location = location.split('?')[0];
        location = location.replace(/:\d+(:\d+)?$/, '');
        location = collapseHashedFilename(location);
        location = location.trim();
        if (location)
            return location;
    }
    return UNKNOWN;
}
/**
 * Compute a custom frontend error fingerprint. Pure and never-throwing.
 *
 * Returns `undefined` when disabled or on any internal error (fail open). When an
 * `overrideFingerprint` is supplied it is used verbatim (capped), skipping composition.
 */
function computeFrontendFingerprint(input, config = DEFAULT_FINGERPRINT_CONFIG) {
    if (!config.enabled)
        return undefined;
    try {
        const live = !config.shadow;
        if (input.overrideFingerprint) {
            return { value: cap(input.overrideFingerprint, TOTAL_MAX), version: config.version, live };
        }
        const route = cap(normalizeRoute(input.route), ROUTE_MAX);
        const type = cap(input.errorType || UNKNOWN, TYPE_MAX);
        const raise = cap(canonicalRaiseSite(input.stack), RAISE_MAX);
        const value = cap(`route:${route}|type:${type}|raise:${raise}`, TOTAL_MAX);
        return { value, version: config.version, live };
    }
    catch {
        // Fail open — a fingerprint is never worth breaking error delivery.
        return undefined;
    }
}
//# sourceMappingURL=fingerprint.js.map

/***/ })

}]);