"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[1370],{

/***/ 31370:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MobXProviderContext: function() { return /* binding */ MobXProviderContext; },
/* harmony export */   Observer: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.Observer; },
/* harmony export */   PropTypes: function() { return /* binding */ PropTypes; },
/* harmony export */   Provider: function() { return /* binding */ Provider; },
/* harmony export */   disposeOnUnmount: function() { return /* binding */ disposeOnUnmount; },
/* harmony export */   inject: function() { return /* binding */ inject; },
/* harmony export */   isUsingStaticRendering: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.isUsingStaticRendering; },
/* harmony export */   observer: function() { return /* binding */ observer; },
/* harmony export */   observerBatching: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.observerBatching; },
/* harmony export */   useAsObservableSource: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.useAsObservableSource; },
/* harmony export */   useLocalStore: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.useLocalStore; },
/* harmony export */   useObserver: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.useObserver; },
/* harmony export */   useStaticRendering: function() { return /* reexport safe */ mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.useStaticRendering; }
/* harmony export */ });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22451);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(96540);
/* harmony import */ var mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(68082);





var symbolId = 0;

function createSymbol(name) {
  if (typeof Symbol === "function") {
    return Symbol(name);
  }

  var symbol = "__$mobx-react " + name + " (" + symbolId + ")";
  symbolId++;
  return symbol;
}

var createdSymbols = {};
function newSymbol(name) {
  if (!createdSymbols[name]) {
    createdSymbols[name] = createSymbol(name);
  }

  return createdSymbols[name];
}
function shallowEqual(objA, objB) {
  //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (is(objA, objB)) return true;

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!Object.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function is(x, y) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
} // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js


var hoistBlackList = {
  $$typeof: 1,
  render: 1,
  compare: 1,
  type: 1,
  childContextTypes: 1,
  contextType: 1,
  contextTypes: 1,
  defaultProps: 1,
  getDefaultProps: 1,
  getDerivedStateFromError: 1,
  getDerivedStateFromProps: 1,
  mixins: 1,
  propTypes: 1
};
function copyStaticProperties(base, target) {
  var protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base));
  Object.getOwnPropertyNames(base).forEach(function (key) {
    if (!hoistBlackList[key] && protoProps.indexOf(key) === -1) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
    }
  });
}
/**
 * Helper to set `prop` to `this` as non-enumerable (hidden prop)
 * @param target
 * @param prop
 * @param value
 */

function setHiddenProp(target, prop, value) {
  if (!Object.hasOwnProperty.call(target, prop)) {
    Object.defineProperty(target, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value
    });
  } else {
    target[prop] = value;
  }
}
/**
 * Utilities for patching componentWillUnmount, to make sure @disposeOnUnmount works correctly icm with user defined hooks
 * and the handler provided by mobx-react
 */

var mobxMixins =
/*#__PURE__*/
newSymbol("patchMixins");
var mobxPatchedDefinition =
/*#__PURE__*/
newSymbol("patchedDefinition");

function getMixins(target, methodName) {
  var mixins = target[mobxMixins] = target[mobxMixins] || {};
  var methodMixins = mixins[methodName] = mixins[methodName] || {};
  methodMixins.locks = methodMixins.locks || 0;
  methodMixins.methods = methodMixins.methods || [];
  return methodMixins;
}

function wrapper(realMethod, mixins) {
  var _this = this;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  // locks are used to ensure that mixins are invoked only once per invocation, even on recursive calls
  mixins.locks++;

  try {
    var retVal;

    if (realMethod !== undefined && realMethod !== null) {
      retVal = realMethod.apply(this, args);
    }

    return retVal;
  } finally {
    mixins.locks--;

    if (mixins.locks === 0) {
      mixins.methods.forEach(function (mx) {
        mx.apply(_this, args);
      });
    }
  }
}

function wrapFunction(realMethod, mixins) {
  var fn = function fn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    wrapper.call.apply(wrapper, [this, realMethod, mixins].concat(args));
  };

  return fn;
}

function patch(target, methodName, mixinMethod) {
  var mixins = getMixins(target, methodName);

  if (mixins.methods.indexOf(mixinMethod) < 0) {
    mixins.methods.push(mixinMethod);
  }

  var oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);

  if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
    // already patched definition, do not repatch
    return;
  }

  var originalMethod = target[methodName];
  var newDefinition = createDefinition(target, methodName, oldDefinition ? oldDefinition.enumerable : undefined, mixins, originalMethod);
  Object.defineProperty(target, methodName, newDefinition);
}

function createDefinition(target, methodName, enumerable, mixins, originalMethod) {
  var _ref;

  var wrappedFunc = wrapFunction(originalMethod, mixins);
  return _ref = {}, _ref[mobxPatchedDefinition] = true, _ref.get = function get() {
    return wrappedFunc;
  }, _ref.set = function set(value) {
    if (this === target) {
      wrappedFunc = wrapFunction(value, mixins);
    } else {
      // when it is an instance of the prototype/a child prototype patch that particular case again separately
      // since we need to store separate values depending on wether it is the actual instance, the prototype, etc
      // e.g. the method for super might not be the same as the method for the prototype which might be not the same
      // as the method for the instance
      var newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
      Object.defineProperty(this, methodName, newDefinition);
    }
  }, _ref.configurable = true, _ref.enumerable = enumerable, _ref;
}

var mobxAdminProperty = mobx__WEBPACK_IMPORTED_MODULE_0__.$mobx || "$mobx";
var mobxObserverProperty =
/*#__PURE__*/
newSymbol("isMobXReactObserver");
var mobxIsUnmounted =
/*#__PURE__*/
newSymbol("isUnmounted");
var skipRenderKey =
/*#__PURE__*/
newSymbol("skipRender");
var isForcingUpdateKey =
/*#__PURE__*/
newSymbol("isForcingUpdate");
function makeClassComponentObserver(componentClass) {
  var target = componentClass.prototype;

  if (componentClass[mobxObserverProperty]) {
    var displayName = getDisplayName(target);
    console.warn("The provided component class (" + displayName + ") \n                has already been declared as an observer component.");
  } else {
    componentClass[mobxObserverProperty] = true;
  }

  if (target.componentWillReact) throw new Error("The componentWillReact life-cycle event is no longer supported");

  if (componentClass["__proto__"] !== react__WEBPACK_IMPORTED_MODULE_1__.PureComponent) {
    if (!target.shouldComponentUpdate) target.shouldComponentUpdate = observerSCU;else if (target.shouldComponentUpdate !== observerSCU) // n.b. unequal check, instead of existence check, as @observer might be on superclass as well
      throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
  } // this.props and this.state are made observable, just to make sure @computed fields that
  // are defined inside the component, and which rely on state or props, re-compute if state or props change
  // (otherwise the computed wouldn't update and become stale on props change, since props are not observable)
  // However, this solution is not without it's own problems: https://github.com/mobxjs/mobx-react/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aobservable-props-or-not+


  makeObservableProp(target, "props");
  makeObservableProp(target, "state");
  var baseRender = target.render;

  target.render = function () {
    return makeComponentReactive.call(this, baseRender);
  };

  patch(target, "componentWillUnmount", function () {
    var _this$render$mobxAdmi;

    if ((0,mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.isUsingStaticRendering)() === true) return;
    (_this$render$mobxAdmi = this.render[mobxAdminProperty]) === null || _this$render$mobxAdmi === void 0 ? void 0 : _this$render$mobxAdmi.dispose();
    this[mobxIsUnmounted] = true;

    if (!this.render[mobxAdminProperty]) {
      // Render may have been hot-swapped and/or overriden by a subclass.
      var _displayName = getDisplayName(this);

      console.warn("The reactive render of an observer class component (" + _displayName + ") \n                was overriden after MobX attached. This may result in a memory leak if the \n                overriden reactive render was not properly disposed.");
    }
  });
  return componentClass;
} // Generates a friendly name for debugging

function getDisplayName(comp) {
  return comp.displayName || comp.name || comp.constructor && (comp.constructor.displayName || comp.constructor.name) || "<component>";
}

function makeComponentReactive(render) {
  var _this = this;

  if ((0,mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.isUsingStaticRendering)() === true) return render.call(this);
  /**
   * If props are shallowly modified, react will render anyway,
   * so atom.reportChanged() should not result in yet another re-render
   */

  setHiddenProp(this, skipRenderKey, false);
  /**
   * forceUpdate will re-assign this.props. We don't want that to cause a loop,
   * so detect these changes
   */

  setHiddenProp(this, isForcingUpdateKey, false);
  var initialName = getDisplayName(this);
  var baseRender = render.bind(this);
  var isRenderingPending = false;
  var reaction = new mobx__WEBPACK_IMPORTED_MODULE_0__.Reaction(initialName + ".render()", function () {
    if (!isRenderingPending) {
      // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
      // This unidiomatic React usage but React will correctly warn about this so we continue as usual
      // See #85 / Pull #44
      isRenderingPending = true;

      if (_this[mobxIsUnmounted] !== true) {
        var hasError = true;

        try {
          setHiddenProp(_this, isForcingUpdateKey, true);
          if (!_this[skipRenderKey]) react__WEBPACK_IMPORTED_MODULE_1__.Component.prototype.forceUpdate.call(_this);
          hasError = false;
        } finally {
          setHiddenProp(_this, isForcingUpdateKey, false);
          if (hasError) reaction.dispose();
        }
      }
    }
  });
  reaction["reactComponent"] = this;
  reactiveRender[mobxAdminProperty] = reaction;
  this.render = reactiveRender;

  function reactiveRender() {
    isRenderingPending = false;
    var exception = undefined;
    var rendering = undefined;
    reaction.track(function () {
      try {
        rendering = (0,mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateChanges)(false, baseRender);
      } catch (e) {
        exception = e;
      }
    });

    if (exception) {
      throw exception;
    }

    return rendering;
  }

  return reactiveRender.call(this);
}

function observerSCU(nextProps, nextState) {
  if ((0,mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.isUsingStaticRendering)()) {
    console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
  } // update on any state changes (as is the default)


  if (this.state !== nextState) {
    return true;
  } // update if props are shallowly not equal, inspired by PureRenderMixin
  // we could return just 'false' here, and avoid the `skipRender` checks etc
  // however, it is nicer if lifecycle events are triggered like usually,
  // so we return true here if props are shallowly modified.


  return !shallowEqual(this.props, nextProps);
}

function makeObservableProp(target, propName) {
  var valueHolderKey = newSymbol("reactProp_" + propName + "_valueHolder");
  var atomHolderKey = newSymbol("reactProp_" + propName + "_atomHolder");

  function getAtom() {
    if (!this[atomHolderKey]) {
      setHiddenProp(this, atomHolderKey, (0,mobx__WEBPACK_IMPORTED_MODULE_0__.createAtom)("reactive " + propName));
    }

    return this[atomHolderKey];
  }

  Object.defineProperty(target, propName, {
    configurable: true,
    enumerable: true,
    get: function get() {
      var prevReadState = false;

      if (mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsStart && mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsEnd) {
        prevReadState = (0,mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsStart)(true);
      }

      getAtom.call(this).reportObserved();

      if (mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsStart && mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsEnd) {
        (0,mobx__WEBPACK_IMPORTED_MODULE_0__._allowStateReadsEnd)(prevReadState);
      }

      return this[valueHolderKey];
    },
    set: function set(v) {
      if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
        setHiddenProp(this, valueHolderKey, v);
        setHiddenProp(this, skipRenderKey, true);
        getAtom.call(this).reportChanged();
        setHiddenProp(this, skipRenderKey, false);
      } else {
        setHiddenProp(this, valueHolderKey, v);
      }
    }
  });
}

var hasSymbol = typeof Symbol === "function" && Symbol.for; // Using react-is had some issues (and operates on elements, not on types), see #608 / #609

var ReactForwardRefSymbol = hasSymbol ?
/*#__PURE__*/
Symbol.for("react.forward_ref") : typeof react__WEBPACK_IMPORTED_MODULE_1__.forwardRef === "function" &&
/*#__PURE__*/
(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function (props) {
  return null;
})["$$typeof"];
var ReactMemoSymbol = hasSymbol ?
/*#__PURE__*/
Symbol.for("react.memo") : typeof react__WEBPACK_IMPORTED_MODULE_1__.memo === "function" &&
/*#__PURE__*/
(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(function (props) {
  return null;
})["$$typeof"];
/**
 * Observer function / decorator
 */

function observer(component) {
  if (component["isMobxInjector"] === true) {
    console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
  }

  if (ReactMemoSymbol && component["$$typeof"] === ReactMemoSymbol) {
    throw new Error("Mobx observer: You are trying to use 'observer' on a function component wrapped in either another observer or 'React.memo'. The observer already applies 'React.memo' for you.");
  } // Unwrap forward refs into `<Observer>` component
  // we need to unwrap the render, because it is the inner render that needs to be tracked,
  // not the ForwardRef HoC


  if (ReactForwardRefSymbol && component["$$typeof"] === ReactForwardRefSymbol) {
    var baseRender = component["render"];
    if (typeof baseRender !== "function") throw new Error("render property of ForwardRef was not a function");
    return (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function ObserverForwardRef() {
      var args = arguments;
      return (0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.Observer, null, function () {
        return baseRender.apply(undefined, args);
      });
    });
  } // Function component


  if (typeof component === "function" && (!component.prototype || !component.prototype.render) && !component["isReactClass"] && !Object.prototype.isPrototypeOf.call(react__WEBPACK_IMPORTED_MODULE_1__.Component, component)) {
    return (0,mobx_react_lite__WEBPACK_IMPORTED_MODULE_2__.observer)(component);
  }

  return makeClassComponentObserver(component);
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var MobXProviderContext =
/*#__PURE__*/
react__WEBPACK_IMPORTED_MODULE_1__.createContext({});
function Provider(props) {
  var children = props.children,
      stores = _objectWithoutPropertiesLoose(props, ["children"]);

  var parentValue = react__WEBPACK_IMPORTED_MODULE_1__.useContext(MobXProviderContext);
  var mutableProviderRef = react__WEBPACK_IMPORTED_MODULE_1__.useRef(_extends({}, parentValue, stores));
  var value = mutableProviderRef.current;

  if (false) { var newValue; }

  return react__WEBPACK_IMPORTED_MODULE_1__.createElement(MobXProviderContext.Provider, {
    value: value
  }, children);
}
Provider.displayName = "MobXProvider";

/**
 * Store Injection
 */

function createStoreInjector(grabStoresFn, component, injectNames, makeReactive) {
  // Support forward refs
  var Injector = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(function (props, ref) {
    var newProps = _extends({}, props);

    var context = react__WEBPACK_IMPORTED_MODULE_1__.useContext(MobXProviderContext);
    Object.assign(newProps, grabStoresFn(context || {}, newProps) || {});

    if (ref) {
      newProps.ref = ref;
    }

    return react__WEBPACK_IMPORTED_MODULE_1__.createElement(component, newProps);
  });
  if (makeReactive) Injector = observer(Injector);
  Injector["isMobxInjector"] = true; // assigned late to suppress observer warning
  // Static fields from component should be visible on the generated Injector

  copyStaticProperties(component, Injector);
  Injector["wrappedComponent"] = component;
  Injector.displayName = getInjectName(component, injectNames);
  return Injector;
}

function getInjectName(component, injectNames) {
  var displayName;
  var componentName = component.displayName || component.name || component.constructor && component.constructor.name || "Component";
  if (injectNames) displayName = "inject-with-" + injectNames + "(" + componentName + ")";else displayName = "inject(" + componentName + ")";
  return displayName;
}

function grabStoresByName(storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (storeName in nextProps // prefer props over stores
      ) return;
      if (!(storeName in baseStores)) throw new Error("MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
      nextProps[storeName] = baseStores[storeName];
    });
    return nextProps;
  };
}
/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */


function inject() {
  for (var _len = arguments.length, storeNames = new Array(_len), _key = 0; _key < _len; _key++) {
    storeNames[_key] = arguments[_key];
  }

  if (typeof arguments[0] === "function") {
    var grabStoresFn = arguments[0];
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass, grabStoresFn.name, true);
    };
  } else {
    return function (componentClass) {
      return createStoreInjector(grabStoresByName(storeNames), componentClass, storeNames.join("-"), false);
    };
  }
}

var protoStoreKey =
/*#__PURE__*/
newSymbol("disposeOnUnmountProto");
var instStoreKey =
/*#__PURE__*/
newSymbol("disposeOnUnmountInst");

function runDisposersOnWillUnmount() {
  var _this = this;
  [].concat(this[protoStoreKey] || [], this[instStoreKey] || []).forEach(function (propKeyOrFunction) {
    var prop = typeof propKeyOrFunction === "string" ? _this[propKeyOrFunction] : propKeyOrFunction;

    if (prop !== undefined && prop !== null) {
      if (Array.isArray(prop)) prop.map(function (f) {
        return f();
      });else prop();
    }
  });
}

function disposeOnUnmount(target, propertyKeyOrFunction) {
  if (Array.isArray(propertyKeyOrFunction)) {
    return propertyKeyOrFunction.map(function (fn) {
      return disposeOnUnmount(target, fn);
    });
  }

  var c = Object.getPrototypeOf(target).constructor;
  var c2 = Object.getPrototypeOf(target.constructor); // Special case for react-hot-loader

  var c3 = Object.getPrototypeOf(Object.getPrototypeOf(target));

  if (!(c === react__WEBPACK_IMPORTED_MODULE_1__.Component || c === react__WEBPACK_IMPORTED_MODULE_1__.PureComponent || c2 === react__WEBPACK_IMPORTED_MODULE_1__.Component || c2 === react__WEBPACK_IMPORTED_MODULE_1__.PureComponent || c3 === react__WEBPACK_IMPORTED_MODULE_1__.Component || c3 === react__WEBPACK_IMPORTED_MODULE_1__.PureComponent)) {
    throw new Error("[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent.");
  }

  if (typeof propertyKeyOrFunction !== "string" && typeof propertyKeyOrFunction !== "function" && !Array.isArray(propertyKeyOrFunction)) {
    throw new Error("[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function.");
  } // decorator's target is the prototype, so it doesn't have any instance properties like props


  var isDecorator = typeof propertyKeyOrFunction === "string"; // add property key / function we want run (disposed) to the store

  var componentWasAlreadyModified = !!target[protoStoreKey] || !!target[instStoreKey];
  var store = isDecorator ? // decorators are added to the prototype store
  target[protoStoreKey] || (target[protoStoreKey] = []) : // functions are added to the instance store
  target[instStoreKey] || (target[instStoreKey] = []);
  store.push(propertyKeyOrFunction); // tweak the component class componentWillUnmount if not done already

  if (!componentWasAlreadyModified) {
    patch(target, "componentWillUnmount", runDisposersOnWillUnmount);
  } // return the disposer as is if invoked as a non decorator


  if (typeof propertyKeyOrFunction !== "string") {
    return propertyKeyOrFunction;
  }
}

function createChainableTypeChecker(validator) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      rest[_key - 6] = arguments[_key];
    }

    return (0,mobx__WEBPACK_IMPORTED_MODULE_0__.untracked)(function () {
      componentName = componentName || "<<anonymous>>";
      propFullName = propFullName || propName;

      if (props[propName] == null) {
        if (isRequired) {
          var actual = props[propName] === null ? "null" : "undefined";
          return new Error("The " + location + " `" + propFullName + "` is marked as required " + "in `" + componentName + "`, but its value is `" + actual + "`.");
        }

        return null;
      } else {
        // @ts-ignore rest arg is necessary for some React internals - fails tests otherwise
        return validator.apply(void 0, [props, propName, componentName, location, propFullName].concat(rest));
      }
    });
  }

  var chainedCheckType = checkType.bind(null, false); // Add isRequired to satisfy Requirable

  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
} // Copied from React.PropTypes


function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === "symbol") {
    return true;
  } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


  if (propValue["@@toStringTag"] === "Symbol") {
    return true;
  } // Fallback for non-spec compliant Symbols which are polyfilled.


  if (typeof Symbol === "function" && propValue instanceof Symbol) {
    return true;
  }

  return false;
} // Copied from React.PropTypes


function getPropType(propValue) {
  var propType = typeof propValue;

  if (Array.isArray(propValue)) {
    return "array";
  }

  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return "object";
  }

  if (isSymbol(propType, propValue)) {
    return "symbol";
  }

  return propType;
} // This handles more types than `getPropType`. Only used for error messages.
// Copied from React.PropTypes


function getPreciseType(propValue) {
  var propType = getPropType(propValue);

  if (propType === "object") {
    if (propValue instanceof Date) {
      return "date";
    } else if (propValue instanceof RegExp) {
      return "regexp";
    }
  }

  return propType;
}

function createObservableTypeCheckerCreator(allowNativeType, mobxType) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    return (0,mobx__WEBPACK_IMPORTED_MODULE_0__.untracked)(function () {
      if (allowNativeType) {
        if (getPropType(props[propName]) === mobxType.toLowerCase()) return null;
      }

      var mobxChecker;

      switch (mobxType) {
        case "Array":
          mobxChecker = mobx__WEBPACK_IMPORTED_MODULE_0__.isObservableArray;
          break;

        case "Object":
          mobxChecker = mobx__WEBPACK_IMPORTED_MODULE_0__.isObservableObject;
          break;

        case "Map":
          mobxChecker = mobx__WEBPACK_IMPORTED_MODULE_0__.isObservableMap;
          break;

        default:
          throw new Error("Unexpected mobxType: " + mobxType);
      }

      var propValue = props[propName];

      if (!mobxChecker(propValue)) {
        var preciseType = getPreciseType(propValue);
        var nativeTypeExpectationMessage = allowNativeType ? " or javascript `" + mobxType.toLowerCase() + "`" : "";
        return new Error("Invalid prop `" + propFullName + "` of type `" + preciseType + "` supplied to" + " `" + componentName + "`, expected `mobx.Observable" + mobxType + "`" + nativeTypeExpectationMessage + ".");
      }

      return null;
    });
  });
}

function createObservableArrayOfTypeChecker(allowNativeType, typeChecker) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
      rest[_key2 - 5] = arguments[_key2];
    }

    return (0,mobx__WEBPACK_IMPORTED_MODULE_0__.untracked)(function () {
      if (typeof typeChecker !== "function") {
        return new Error("Property `" + propFullName + "` of component `" + componentName + "` has " + "invalid PropType notation.");
      } else {
        var error = createObservableTypeCheckerCreator(allowNativeType, "Array")(props, propName, componentName, location, propFullName);
        if (error instanceof Error) return error;
        var propValue = props[propName];

        for (var i = 0; i < propValue.length; i++) {
          error = typeChecker.apply(void 0, [propValue, i, componentName, location, propFullName + "[" + i + "]"].concat(rest));
          if (error instanceof Error) return error;
        }

        return null;
      }
    });
  });
}

var observableArray =
/*#__PURE__*/
createObservableTypeCheckerCreator(false, "Array");
var observableArrayOf =
/*#__PURE__*/
createObservableArrayOfTypeChecker.bind(null, false);
var observableMap =
/*#__PURE__*/
createObservableTypeCheckerCreator(false, "Map");
var observableObject =
/*#__PURE__*/
createObservableTypeCheckerCreator(false, "Object");
var arrayOrObservableArray =
/*#__PURE__*/
createObservableTypeCheckerCreator(true, "Array");
var arrayOrObservableArrayOf =
/*#__PURE__*/
createObservableArrayOfTypeChecker.bind(null, true);
var objectOrObservableObject =
/*#__PURE__*/
createObservableTypeCheckerCreator(true, "Object");
var PropTypes = {
  observableArray: observableArray,
  observableArrayOf: observableArrayOf,
  observableMap: observableMap,
  observableObject: observableObject,
  arrayOrObservableArray: arrayOrObservableArray,
  arrayOrObservableArrayOf: arrayOrObservableArrayOf,
  objectOrObservableObject: objectOrObservableObject
};

if (!react__WEBPACK_IMPORTED_MODULE_1__.Component) throw new Error("mobx-react requires React to be available");
if (!mobx__WEBPACK_IMPORTED_MODULE_0__.observable) throw new Error("mobx-react requires mobx to be available");


//# sourceMappingURL=mobxreact.esm.js.map


/***/ }),

/***/ 68082:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Observer: function() { return /* reexport */ ObserverComponent; },
  isObserverBatched: function() { return /* reexport */ isObserverBatched; },
  isUsingStaticRendering: function() { return /* reexport */ isUsingStaticRendering; },
  observer: function() { return /* reexport */ observer; },
  observerBatching: function() { return /* reexport */ observerBatching; },
  useAsObservableSource: function() { return /* reexport */ useAsObservableSource; },
  useForceUpdate: function() { return /* reexport */ useForceUpdate; },
  useLocalStore: function() { return /* reexport */ useLocalStore; },
  useObserver: function() { return /* reexport */ useObserver; },
  useQueuedForceUpdate: function() { return /* reexport */ useQueuedForceUpdate; },
  useQueuedForceUpdateBlock: function() { return /* reexport */ useQueuedForceUpdateBlock; },
  useStaticRendering: function() { return /* reexport */ useStaticRendering; }
});

// EXTERNAL MODULE: ./node_modules/mobx/lib/mobx.module.js
var mobx_module = __webpack_require__(22451);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
;// ./node_modules/mobx-react-lite/es/assertEnvironment.js


if (!react.useState) {
    throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!mobx_module.spy) {
    throw new Error("mobx-react-lite requires mobx at least version 4 to be available");
}

// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(40961);
;// ./node_modules/mobx-react-lite/es/utils/reactBatchedUpdates.js


;// ./node_modules/mobx-react-lite/es/utils.js
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};

var EMPTY_ARRAY = [];
function useUnmount(fn) {
    (0,react.useEffect)(function () { return fn; }, EMPTY_ARRAY);
}
function useForceUpdate() {
    var _a = __read((0,react.useState)(0), 2), setTick = _a[1];
    var update = (0,react.useCallback)(function () {
        setTick(function (tick) { return tick + 1; });
    }, []);
    return update;
}
function isPlainObject(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var proto = Object.getPrototypeOf(value);
    return !proto || proto === Object.prototype;
}
function getSymbol(name) {
    if (typeof Symbol === "function") {
        return Symbol.for(name);
    }
    return "__$mobx-react " + name + "__";
}
var mockGlobal = {};
function getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return mockGlobal;
}

;// ./node_modules/mobx-react-lite/es/observerBatching.js


var observerBatchingConfiguredSymbol = getSymbol("observerBatching");
function defaultNoopBatch(callback) {
    callback();
}
function observerBatching(reactionScheduler) {
    if (!reactionScheduler) {
        reactionScheduler = defaultNoopBatch;
        if (false) {}
    }
    (0,mobx_module.configure)({ reactionScheduler: reactionScheduler });
    getGlobal()[observerBatchingConfiguredSymbol] = true;
}
var isObserverBatched = function () { return !!getGlobal()[observerBatchingConfiguredSymbol]; };

;// ./node_modules/mobx-react-lite/es/staticRendering.js
var globalIsUsingStaticRendering = false;
function useStaticRendering(enable) {
    globalIsUsingStaticRendering = enable;
}
function isUsingStaticRendering() {
    return globalIsUsingStaticRendering;
}

;// ./node_modules/mobx-react-lite/es/printDebugValue.js

function printDebugValue(v) {
    return (0,mobx_module.getDependencyTree)(v);
}

;// ./node_modules/mobx-react-lite/es/reactionCleanupTracking.js
function createTrackingData(reaction) {
    var trackingData = {
        cleanAt: Date.now() + CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS,
        reaction: reaction
    };
    return trackingData;
}
/**
 * The minimum time before we'll clean up a Reaction created in a render
 * for a component that hasn't managed to run its effects. This needs to
 * be big enough to ensure that a component won't turn up and have its
 * effects run without being re-rendered.
 */
var CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10000;
/**
 * The frequency with which we'll check for leaked reactions.
 */
var CLEANUP_TIMER_LOOP_MILLIS = 10000;
/**
 * Reactions created by components that have yet to be fully mounted.
 */
var uncommittedReactionRefs = new Set();
/**
 * Latest 'uncommitted reactions' cleanup timer handle.
 */
var reactionCleanupHandle;
function ensureCleanupTimerRunning() {
    if (reactionCleanupHandle === undefined) {
        reactionCleanupHandle = setTimeout(cleanUncommittedReactions, CLEANUP_TIMER_LOOP_MILLIS);
    }
}
function scheduleCleanupOfReactionIfLeaked(ref) {
    uncommittedReactionRefs.add(ref);
    ensureCleanupTimerRunning();
}
function recordReactionAsCommitted(reactionRef) {
    uncommittedReactionRefs.delete(reactionRef);
}
/**
 * Run by the cleanup timer to dispose any outstanding reactions
 */
function cleanUncommittedReactions() {
    reactionCleanupHandle = undefined;
    // Loop through all the candidate leaked reactions; those older
    // than CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS get tidied.
    var now = Date.now();
    uncommittedReactionRefs.forEach(function (ref) {
        var tracking = ref.current;
        if (tracking) {
            if (now >= tracking.cleanAt) {
                // It's time to tidy up this leaked reaction.
                tracking.reaction.dispose();
                ref.current = null;
                uncommittedReactionRefs.delete(ref);
            }
        }
    });
    if (uncommittedReactionRefs.size > 0) {
        // We've just finished a round of cleanups but there are still
        // some leak candidates outstanding.
        ensureCleanupTimerRunning();
    }
}
/* istanbul ignore next */
/**
 * Only to be used by test functions; do not export outside of mobx-react-lite
 */
function forceCleanupTimerToRunNowForTests() {
    // This allows us to control the execution of the cleanup timer
    // to force it to run at awkward times in unit tests.
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        cleanUncommittedReactions();
    }
}
/* istanbul ignore next */
function resetCleanupScheduleForTests() {
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        reactionCleanupHandle = undefined;
    }
    uncommittedReactionRefs.clear();
}

;// ./node_modules/mobx-react-lite/es/useQueuedForceUpdate.js

var insideRender = false;
var forceUpdateQueue = [];
function useQueuedForceUpdate(forceUpdate) {
    return function () {
        if (insideRender) {
            forceUpdateQueue.push(forceUpdate);
        }
        else {
            forceUpdate();
        }
    };
}
function useQueuedForceUpdateBlock(callback) {
    // start intercepting force-update calls
    insideRender = true;
    forceUpdateQueue = [];
    try {
        var result = callback();
        // stop intercepting force-update
        insideRender = false;
        // store queue or nothing if it was empty to execute useLayoutEffect only when necessary
        var queue_1 = forceUpdateQueue.length > 0 ? forceUpdateQueue : undefined;
        // run force-update queue in useLayoutEffect
        react.useLayoutEffect(function () {
            if (queue_1) {
                queue_1.forEach(function (x) { return x(); });
            }
        }, [queue_1]);
        return result;
    }
    finally {
        insideRender = false;
    }
}

;// ./node_modules/mobx-react-lite/es/useObserver.js







var EMPTY_OBJECT = {};
function observerComponentNameFor(baseComponentName) {
    return "observer" + baseComponentName;
}
function useObserver(fn, baseComponentName, options) {
    if (baseComponentName === void 0) { baseComponentName = "observed"; }
    if (options === void 0) { options = EMPTY_OBJECT; }
    if (isUsingStaticRendering()) {
        return fn();
    }
    var wantedForceUpdateHook = options.useForceUpdate || useForceUpdate;
    var forceUpdate = wantedForceUpdateHook();
    var queuedForceUpdate = useQueuedForceUpdate(forceUpdate);
    // StrictMode/ConcurrentMode/Suspense may mean that our component is
    // rendered and abandoned multiple times, so we need to track leaked
    // Reactions.
    var reactionTrackingRef = react.useRef(null);
    if (!reactionTrackingRef.current) {
        // First render for this component (or first time since a previous
        // reaction from an abandoned render was disposed).
        var newReaction_1 = new mobx_module.Reaction(observerComponentNameFor(baseComponentName), function () {
            // Observable has changed, meaning we want to re-render
            // BUT if we're a component that hasn't yet got to the useEffect()
            // stage, we might be a component that _started_ to render, but
            // got dropped, and we don't want to make state changes then.
            // (It triggers warnings in StrictMode, for a start.)
            if (trackingData_1.mounted) {
                // We have reached useEffect(), so we're mounted, and can trigger an update
                queuedForceUpdate();
            }
            else {
                // We haven't yet reached useEffect(), so we'll need to trigger a re-render
                // when (and if) useEffect() arrives.  The easiest way to do that is just to
                // drop our current reaction and allow useEffect() to recreate it.
                newReaction_1.dispose();
                reactionTrackingRef.current = null;
            }
        });
        var trackingData_1 = createTrackingData(newReaction_1);
        reactionTrackingRef.current = trackingData_1;
        scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
    }
    var reaction = reactionTrackingRef.current.reaction;
    react.useDebugValue(reaction, printDebugValue);
    react.useEffect(function () {
        // Called on first mount only
        recordReactionAsCommitted(reactionTrackingRef);
        if (reactionTrackingRef.current) {
            // Great. We've already got our reaction from our render;
            // all we need to do is to record that it's now mounted,
            // to allow future observable changes to trigger re-renders
            reactionTrackingRef.current.mounted = true;
        }
        else {
            // The reaction we set up in our render has been disposed.
            // This is either due to bad timings of renderings, e.g. our
            // component was paused for a _very_ long time, and our
            // reaction got cleaned up, or we got a observable change
            // between render and useEffect
            // Re-create the reaction
            reactionTrackingRef.current = {
                reaction: new mobx_module.Reaction(observerComponentNameFor(baseComponentName), function () {
                    // We've definitely already been mounted at this point
                    queuedForceUpdate();
                }),
                cleanAt: Infinity
            };
            queuedForceUpdate();
        }
        return function () {
            reactionTrackingRef.current.reaction.dispose();
            reactionTrackingRef.current = null;
        };
    }, []);
    // delay all force-update calls after rendering of this component
    return useQueuedForceUpdateBlock(function () {
        // render the original component, but have the
        // reaction track the observables, so that rendering
        // can be invalidated (see above) once a dependency changes
        var rendering;
        var exception;
        reaction.track(function () {
            try {
                rendering = fn();
            }
            catch (e) {
                exception = e;
            }
        });
        if (exception) {
            throw exception; // re-throw any exceptions caught during rendering
        }
        return rendering;
    });
}

;// ./node_modules/mobx-react-lite/es/observer.js
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};



// n.b. base case is not used for actual typings or exported in the typing files
function observer(baseComponent, options) {
    // The working of observer is explained step by step in this talk: https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307
    if (isUsingStaticRendering()) {
        return baseComponent;
    }
    var realOptions = __assign({ forwardRef: false }, options);
    var baseComponentName = baseComponent.displayName || baseComponent.name;
    var wrappedComponent = function (props, ref) {
        return useObserver(function () { return baseComponent(props, ref); }, baseComponentName);
    };
    wrappedComponent.displayName = baseComponentName;
    // memo; we are not interested in deep updates
    // in props; we assume that if deep objects are changed,
    // this is in observables, which would have been tracked anyway
    var memoComponent;
    if (realOptions.forwardRef) {
        // we have to use forwardRef here because:
        // 1. it cannot go before memo, only after it
        // 2. forwardRef converts the function into an actual component, so we can't let the baseComponent do it
        //    since it wouldn't be a callable function anymore
        memoComponent = (0,react.memo)((0,react.forwardRef)(wrappedComponent));
    }
    else {
        memoComponent = (0,react.memo)(wrappedComponent);
    }
    copyStaticProperties(baseComponent, memoComponent);
    memoComponent.displayName = baseComponentName;
    return memoComponent;
}
// based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
var hoistBlackList = {
    $$typeof: true,
    render: true,
    compare: true,
    type: true
};
function copyStaticProperties(base, target) {
    Object.keys(base).forEach(function (key) {
        if (!hoistBlackList[key]) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}

;// ./node_modules/mobx-react-lite/es/ObserverComponent.js

function ObserverComponent(_a) {
    var children = _a.children, render = _a.render;
    var component = children || render;
    if (typeof component !== "function") {
        return null;
    }
    return useObserver(component);
}
ObserverComponent.propTypes = {
    children: ObserverPropsCheck,
    render: ObserverPropsCheck
};
ObserverComponent.displayName = "Observer";

function ObserverPropsCheck(props, key, componentName, location, propFullName) {
    var extraKey = key === "children" ? "render" : "children";
    var hasProp = typeof props[key] === "function";
    var hasExtraProp = typeof props[extraKey] === "function";
    if (hasProp && hasExtraProp) {
        return new Error("MobX Observer: Do not use children and render in the same time in`" + componentName);
    }
    if (hasProp || hasExtraProp) {
        return null;
    }
    return new Error("Invalid prop `" +
        propFullName +
        "` of type `" +
        typeof props[key] +
        "` supplied to" +
        " `" +
        componentName +
        "`, expected `function`.");
}

;// ./node_modules/mobx-react-lite/es/useAsObservableSource.js
var useAsObservableSource_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};



function useAsObservableSourceInternal(current, usedByLocalStore) {
    var culprit = usedByLocalStore ? "useLocalStore" : "useAsObservableSource";
    if (false) { var _a, initialSource; }
    if (usedByLocalStore && current === undefined) {
        return undefined;
    }
    if (false) {}
    var _b = useAsObservableSource_read(react.useState(function () { return (0,mobx_module.observable)(current, {}, { deep: false }); }), 1), res = _b[0];
    if (false) {}
    (0,mobx_module.runInAction)(function () {
        Object.assign(res, current);
    });
    return res;
}
function useAsObservableSource(current) {
    return useAsObservableSourceInternal(current, false);
}

;// ./node_modules/mobx-react-lite/es/useLocalStore.js




function useLocalStore(initializer, current) {
    var source = useAsObservableSourceInternal(current, true);
    return react.useState(function () {
        var local = (0,mobx_module.observable)(initializer(source));
        if (isPlainObject(local)) {
            (0,mobx_module.runInAction)(function () {
                Object.keys(local).forEach(function (key) {
                    var value = local[key];
                    if (typeof value === "function") {
                        // @ts-ignore No idea why ts2536 is popping out here
                        local[key] = wrapInTransaction(value, local);
                    }
                });
            });
        }
        return local;
    })[0];
}
// tslint:disable-next-line: ban-types
function wrapInTransaction(fn, context) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0,mobx_module.transaction)(function () { return fn.apply(context, args); });
    };
}

;// ./node_modules/mobx-react-lite/es/index.js



observerBatching(react_dom.unstable_batchedUpdates);











/***/ })

}]);