"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[3559],{

/***/ 13316:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromEntries: function() { return /* binding */ fromEntries; },
/* harmony export */   safeInvoke: function() { return /* binding */ safeInvoke; },
/* harmony export */   setRef: function() { return /* binding */ setRef; },
/* harmony export */   unwrapArray: function() { return /* binding */ unwrapArray; },
/* harmony export */   useIsomorphicLayoutEffect: function() { return /* binding */ useIsomorphicLayoutEffect; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);


/**
 * Takes an argument and if it's an array, returns the first item in the array,
 * otherwise returns the argument. Used for Preact compatibility.
 */
var unwrapArray = function unwrapArray(arg) {
  return Array.isArray(arg) ? arg[0] : arg;
};
/**
 * Takes a maybe-undefined function and arbitrary args and invokes the function
 * only if it is defined.
 */

var safeInvoke = function safeInvoke(fn) {
  if (typeof fn === 'function') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return fn.apply(void 0, args);
  }
};
/**
 * Sets a ref using either a ref callback or a ref object
 */

var setRef = function setRef(ref, node) {
  // if its a function call it
  if (typeof ref === 'function') {
    return safeInvoke(ref, node);
  } // otherwise we should treat it as a ref object
  else if (ref != null) {
      ref.current = node;
    }
};
/**
 * Simple ponyfill for Object.fromEntries
 */

var fromEntries = function fromEntries(entries) {
  return entries.reduce(function (acc, _ref) {
    var key = _ref[0],
        value = _ref[1];
    acc[key] = value;
    return acc;
  }, {});
};
/**
 * Small wrapper around `useLayoutEffect` to get rid of the warning on SSR envs
 */

var useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

/***/ }),

/***/ 16802:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Manager: function() { return /* binding */ Manager; },
/* harmony export */   ManagerReferenceNodeContext: function() { return /* binding */ ManagerReferenceNodeContext; },
/* harmony export */   ManagerReferenceNodeSetterContext: function() { return /* binding */ ManagerReferenceNodeSetterContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);

var ManagerReferenceNodeContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext();
var ManagerReferenceNodeSetterContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext();
function Manager(_ref) {
  var children = _ref.children;

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0__.useState(null),
      referenceNode = _React$useState[0],
      setReferenceNode = _React$useState[1];

  var hasUnmounted = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
    return function () {
      hasUnmounted.current = true;
    };
  }, []);
  var handleSetReferenceNode = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (node) {
    if (!hasUnmounted.current) {
      setReferenceNode(node);
    }
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ManagerReferenceNodeContext.Provider, {
    value: referenceNode
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ManagerReferenceNodeSetterContext.Provider, {
    value: handleSetReferenceNode
  }, children));
}

/***/ }),

/***/ 64410:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   propTypes: function() { return /* binding */ propTypes; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5556);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PopperContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(72974);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77804);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_1___default().node), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)]),
  placement: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOf(_utils__WEBPACK_IMPORTED_MODULE_2__.PopperPlacements),
  target: _utils__WEBPACK_IMPORTED_MODULE_2__.targetPropType.isRequired,
  container: _utils__WEBPACK_IMPORTED_MODULE_2__.targetPropType,
  isOpen: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
  hideArrow: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
  boundariesElement: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_1___default().string), _utils__WEBPACK_IMPORTED_MODULE_2__.DOMElement]),
  className: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  innerClassName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  arrowClassName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  popperClassName: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  cssModule: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
  toggle: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
  autohide: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
  placementPrefix: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  delay: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default().shape({
    show: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    hide: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number)
  }), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number)]),
  modifiers: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().array),
  strategy: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  offset: prop_types__WEBPACK_IMPORTED_MODULE_1___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_1___default().number)),
  innerRef: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_1___default().func), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)]),
  trigger: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
  fade: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
  flip: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool)
};
var DEFAULT_DELAYS = {
  show: 0,
  hide: 50
};
var defaultProps = {
  isOpen: false,
  hideArrow: false,
  autohide: false,
  delay: DEFAULT_DELAYS,
  toggle: function toggle() {},
  trigger: 'click',
  fade: true
};
function isInDOMSubtree(element, subtreeRoot) {
  return subtreeRoot && (element === subtreeRoot || subtreeRoot.contains(element));
}
function isInDOMSubtrees(element) {
  var subtreeRoots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return subtreeRoots && subtreeRoots.length && subtreeRoots.filter(function (subTreeRoot) {
    return isInDOMSubtree(element, subTreeRoot);
  })[0];
}
var TooltipPopoverWrapper = /*#__PURE__*/function (_React$Component) {
  _inherits(TooltipPopoverWrapper, _React$Component);
  var _super = _createSuper(TooltipPopoverWrapper);
  function TooltipPopoverWrapper(props) {
    var _this;
    _classCallCheck(this, TooltipPopoverWrapper);
    _this = _super.call(this, props);
    _this._targets = [];
    _this.currentTargetElement = null;
    _this.addTargetEvents = _this.addTargetEvents.bind(_assertThisInitialized(_this));
    _this.handleDocumentClick = _this.handleDocumentClick.bind(_assertThisInitialized(_this));
    _this.removeTargetEvents = _this.removeTargetEvents.bind(_assertThisInitialized(_this));
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    _this.showWithDelay = _this.showWithDelay.bind(_assertThisInitialized(_this));
    _this.hideWithDelay = _this.hideWithDelay.bind(_assertThisInitialized(_this));
    _this.onMouseOverTooltipContent = _this.onMouseOverTooltipContent.bind(_assertThisInitialized(_this));
    _this.onMouseLeaveTooltipContent = _this.onMouseLeaveTooltipContent.bind(_assertThisInitialized(_this));
    _this.show = _this.show.bind(_assertThisInitialized(_this));
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    _this.onEscKeyDown = _this.onEscKeyDown.bind(_assertThisInitialized(_this));
    _this.getRef = _this.getRef.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: props.isOpen
    };
    _this._isMounted = false;
    return _this;
  }
  _createClass(TooltipPopoverWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
      this.updateTarget();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      this.removeTargetEvents();
      this._targets = null;
      this.clearShowTimeout();
      this.clearHideTimeout();
    }
  }, {
    key: "handleDocumentClick",
    value: function handleDocumentClick(e) {
      var triggers = this.props.trigger.split(' ');
      if (triggers.indexOf('legacy') > -1 && (this.props.isOpen || isInDOMSubtrees(e.target, this._targets))) {
        if (this._hideTimeout) {
          this.clearHideTimeout();
        }
        if (this.props.isOpen && !isInDOMSubtree(e.target, this._popover)) {
          this.hideWithDelay(e);
        } else if (!this.props.isOpen) {
          this.showWithDelay(e);
        }
      } else if (triggers.indexOf('click') > -1 && isInDOMSubtrees(e.target, this._targets)) {
        if (this._hideTimeout) {
          this.clearHideTimeout();
        }
        if (!this.props.isOpen) {
          this.showWithDelay(e);
        } else {
          this.hideWithDelay(e);
        }
      }
    }
  }, {
    key: "onMouseOverTooltipContent",
    value: function onMouseOverTooltipContent() {
      if (this.props.trigger.indexOf('hover') > -1 && !this.props.autohide) {
        if (this._hideTimeout) {
          this.clearHideTimeout();
        }
        if (this.state.isOpen && !this.props.isOpen) {
          this.toggle();
        }
      }
    }
  }, {
    key: "onMouseLeaveTooltipContent",
    value: function onMouseLeaveTooltipContent(e) {
      if (this.props.trigger.indexOf('hover') > -1 && !this.props.autohide) {
        if (this._showTimeout) {
          this.clearShowTimeout();
        }
        e.persist();
        this._hideTimeout = setTimeout(this.hide.bind(this, e), this.getDelay('hide'));
      }
    }
  }, {
    key: "onEscKeyDown",
    value: function onEscKeyDown(e) {
      if (e.key === 'Escape') {
        this.hide(e);
      }
    }
  }, {
    key: "getRef",
    value: function getRef(ref) {
      var innerRef = this.props.innerRef;
      if (innerRef) {
        if (typeof innerRef === 'function') {
          innerRef(ref);
        } else if (_typeof(innerRef) === 'object') {
          innerRef.current = ref;
        }
      }
      this._popover = ref;
    }
  }, {
    key: "getDelay",
    value: function getDelay(key) {
      var delay = this.props.delay;
      if (_typeof(delay) === 'object') {
        return isNaN(delay[key]) ? DEFAULT_DELAYS[key] : delay[key];
      }
      return delay;
    }
  }, {
    key: "getCurrentTarget",
    value: function getCurrentTarget(target) {
      if (!target) return null;
      var index = this._targets.indexOf(target);
      if (index >= 0) return this._targets[index];
      return this.getCurrentTarget(target.parentElement);
    }
  }, {
    key: "show",
    value: function show(e) {
      if (!this.props.isOpen) {
        this.clearShowTimeout();
        this.currentTargetElement = e ? e.currentTarget || this.getCurrentTarget(e.target) : null;
        if (e && e.composedPath && typeof e.composedPath === 'function') {
          var path = e.composedPath();
          this.currentTargetElement = path && path[0] || this.currentTargetElement;
        }
        this.toggle(e);
      }
    }
  }, {
    key: "showWithDelay",
    value: function showWithDelay(e) {
      if (this._hideTimeout) {
        this.clearHideTimeout();
      }
      this._showTimeout = setTimeout(this.show.bind(this, e), this.getDelay('show'));
    }
  }, {
    key: "hide",
    value: function hide(e) {
      if (this.props.isOpen) {
        this.clearHideTimeout();
        this.currentTargetElement = null;
        this.toggle(e);
      }
    }
  }, {
    key: "hideWithDelay",
    value: function hideWithDelay(e) {
      if (this._showTimeout) {
        this.clearShowTimeout();
      }
      this._hideTimeout = setTimeout(this.hide.bind(this, e), this.getDelay('hide'));
    }
  }, {
    key: "clearShowTimeout",
    value: function clearShowTimeout() {
      clearTimeout(this._showTimeout);
      this._showTimeout = undefined;
    }
  }, {
    key: "clearHideTimeout",
    value: function clearHideTimeout() {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = undefined;
    }
  }, {
    key: "addEventOnTargets",
    value: function addEventOnTargets(type, handler, isBubble) {
      this._targets.forEach(function (target) {
        target.addEventListener(type, handler, isBubble);
      });
    }
  }, {
    key: "removeEventOnTargets",
    value: function removeEventOnTargets(type, handler, isBubble) {
      this._targets.forEach(function (target) {
        target.removeEventListener(type, handler, isBubble);
      });
    }
  }, {
    key: "addTargetEvents",
    value: function addTargetEvents() {
      if (this.props.trigger) {
        var triggers = this.props.trigger.split(' ');
        if (triggers.indexOf('manual') === -1) {
          if (triggers.indexOf('click') > -1 || triggers.indexOf('legacy') > -1) {
            document.addEventListener('click', this.handleDocumentClick, true);
          }
          if (this._targets && this._targets.length) {
            if (triggers.indexOf('hover') > -1) {
              this.addEventOnTargets('mouseover', this.showWithDelay, true);
              this.addEventOnTargets('mouseout', this.hideWithDelay, true);
            }
            if (triggers.indexOf('focus') > -1) {
              this.addEventOnTargets('focusin', this.show, true);
              this.addEventOnTargets('focusout', this.hide, true);
            }
            this.addEventOnTargets('keydown', this.onEscKeyDown, true);
          }
        }
      }
    }
  }, {
    key: "removeTargetEvents",
    value: function removeTargetEvents() {
      if (this._targets) {
        this.removeEventOnTargets('mouseover', this.showWithDelay, true);
        this.removeEventOnTargets('mouseout', this.hideWithDelay, true);
        this.removeEventOnTargets('keydown', this.onEscKeyDown, true);
        this.removeEventOnTargets('focusin', this.show, true);
        this.removeEventOnTargets('focusout', this.hide, true);
      }
      document.removeEventListener('click', this.handleDocumentClick, true);
    }
  }, {
    key: "updateTarget",
    value: function updateTarget() {
      var newTarget = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getTarget)(this.props.target, true);
      if (newTarget !== this._targets) {
        this.removeTargetEvents();
        this._targets = newTarget ? Array.from(newTarget) : [];
        this.currentTargetElement = this.currentTargetElement || this._targets[0];
        this.addTargetEvents();
      }
    }
  }, {
    key: "toggle",
    value: function toggle(e) {
      if (this.props.disabled || !this._isMounted) {
        return e && e.preventDefault();
      }
      return this.props.toggle(e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      if (this.props.isOpen) {
        this.updateTarget();
      }
      var target = this.currentTargetElement || this._targets[0];
      if (!target) {
        return null;
      }
      var _this$props = this.props,
        className = _this$props.className,
        cssModule = _this$props.cssModule,
        innerClassName = _this$props.innerClassName,
        isOpen = _this$props.isOpen,
        hideArrow = _this$props.hideArrow,
        boundariesElement = _this$props.boundariesElement,
        placement = _this$props.placement,
        placementPrefix = _this$props.placementPrefix,
        arrowClassName = _this$props.arrowClassName,
        popperClassName = _this$props.popperClassName,
        container = _this$props.container,
        modifiers = _this$props.modifiers,
        strategy = _this$props.strategy,
        offset = _this$props.offset,
        fade = _this$props.fade,
        flip = _this$props.flip,
        children = _this$props.children;
      var attributes = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.omit)(this.props, Object.keys(propTypes));
      var popperClasses = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.mapToCssModules)(popperClassName, cssModule);
      var classes = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.mapToCssModules)(innerClassName, cssModule);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PopperContent__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: className,
        target: target,
        isOpen: isOpen,
        hideArrow: hideArrow,
        boundariesElement: boundariesElement,
        placement: placement,
        placementPrefix: placementPrefix,
        arrowClassName: arrowClassName,
        popperClassName: popperClasses,
        container: container,
        modifiers: modifiers,
        strategy: strategy,
        offset: offset,
        cssModule: cssModule,
        fade: fade,
        flip: flip
      }, function (_ref) {
        var update = _ref.update;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", _extends({}, attributes, {
          ref: _this2.getRef,
          className: classes,
          role: "tooltip",
          onMouseOver: _this2.onMouseOverTooltipContent,
          onMouseLeave: _this2.onMouseLeaveTooltipContent,
          onKeyDown: _this2.onEscKeyDown
        }), typeof children === 'function' ? children({
          update: update
        }) : children);
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.isOpen && !state.isOpen) {
        return {
          isOpen: props.isOpen
        };
      }
      return null;
    }
  }]);
  return TooltipPopoverWrapper;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
TooltipPopoverWrapper.propTypes = propTypes;
TooltipPopoverWrapper.defaultProps = defaultProps;
/* harmony default export */ __webpack_exports__["default"] = (TooltipPopoverWrapper);

/***/ }),

/***/ 69703:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Popper: function() { return /* binding */ Popper; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var _Manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16802);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13316);
/* harmony import */ var _usePopper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(89556);





var NOOP = function NOOP() {
  return void 0;
};

var NOOP_PROMISE = function NOOP_PROMISE() {
  return Promise.resolve(null);
};

var EMPTY_MODIFIERS = [];
function Popper(_ref) {
  var _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? 'bottom' : _ref$placement,
      _ref$strategy = _ref.strategy,
      strategy = _ref$strategy === void 0 ? 'absolute' : _ref$strategy,
      _ref$modifiers = _ref.modifiers,
      modifiers = _ref$modifiers === void 0 ? EMPTY_MODIFIERS : _ref$modifiers,
      referenceElement = _ref.referenceElement,
      onFirstUpdate = _ref.onFirstUpdate,
      innerRef = _ref.innerRef,
      children = _ref.children;
  var referenceNode = react__WEBPACK_IMPORTED_MODULE_0__.useContext(_Manager__WEBPACK_IMPORTED_MODULE_1__.ManagerReferenceNodeContext);

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0__.useState(null),
      popperElement = _React$useState[0],
      setPopperElement = _React$useState[1];

  var _React$useState2 = react__WEBPACK_IMPORTED_MODULE_0__.useState(null),
      arrowElement = _React$useState2[0],
      setArrowElement = _React$useState2[1];

  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.setRef)(innerRef, popperElement);
  }, [innerRef, popperElement]);
  var options = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    return {
      placement: placement,
      strategy: strategy,
      onFirstUpdate: onFirstUpdate,
      modifiers: [].concat(modifiers, [{
        name: 'arrow',
        enabled: arrowElement != null,
        options: {
          element: arrowElement
        }
      }])
    };
  }, [placement, strategy, onFirstUpdate, modifiers, arrowElement]);

  var _usePopper = (0,_usePopper__WEBPACK_IMPORTED_MODULE_3__.usePopper)(referenceElement || referenceNode, popperElement, options),
      state = _usePopper.state,
      styles = _usePopper.styles,
      forceUpdate = _usePopper.forceUpdate,
      update = _usePopper.update;

  var childrenProps = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    return {
      ref: setPopperElement,
      style: styles.popper,
      placement: state ? state.placement : placement,
      hasPopperEscaped: state && state.modifiersData.hide ? state.modifiersData.hide.hasPopperEscaped : null,
      isReferenceHidden: state && state.modifiersData.hide ? state.modifiersData.hide.isReferenceHidden : null,
      arrowProps: {
        style: styles.arrow,
        ref: setArrowElement
      },
      forceUpdate: forceUpdate || NOOP,
      update: update || NOOP_PROMISE
    };
  }, [setPopperElement, setArrowElement, placement, state, styles, update, forceUpdate]);
  return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.unwrapArray)(children)(childrenProps);
}

/***/ }),

/***/ 72974:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5556);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40961);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32485);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_popper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(69703);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(77804);
/* harmony import */ var _Fade__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(25523);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["cssModule", "children", "isOpen", "flip", "target", "offset", "fallbackPlacements", "placementPrefix", "arrowClassName", "hideArrow", "popperClassName", "tag", "container", "modifiers", "strategy", "boundariesElement", "onClosed", "fade", "transition", "placement"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







function noop() {}
var propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_3___default().node), (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func)]).isRequired,
  popperClassName: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  placement: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  placementPrefix: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  arrowClassName: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  hideArrow: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  tag: _utils__WEBPACK_IMPORTED_MODULE_4__.tagPropType,
  isOpen: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  cssModule: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object),
  offset: prop_types__WEBPACK_IMPORTED_MODULE_3___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_3___default().number)),
  fallbackPlacements: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().array),
  flip: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  container: _utils__WEBPACK_IMPORTED_MODULE_4__.targetPropType,
  target: _utils__WEBPACK_IMPORTED_MODULE_4__.targetPropType.isRequired,
  modifiers: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().array),
  strategy: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  boundariesElement: prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_3___default().string), _utils__WEBPACK_IMPORTED_MODULE_4__.DOMElement]),
  onClosed: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
  fade: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  transition: prop_types__WEBPACK_IMPORTED_MODULE_3___default().shape(_Fade__WEBPACK_IMPORTED_MODULE_5__["default"].propTypes)
};
var defaultProps = {
  boundariesElement: 'scrollParent',
  placement: 'auto',
  hideArrow: false,
  isOpen: false,
  offset: [0, 0],
  flip: true,
  container: 'body',
  modifiers: [],
  onClosed: noop,
  fade: true,
  transition: _objectSpread({}, _Fade__WEBPACK_IMPORTED_MODULE_5__["default"].defaultProps)
};
var PopperContent = /*#__PURE__*/function (_React$Component) {
  _inherits(PopperContent, _React$Component);
  var _super = _createSuper(PopperContent);
  function PopperContent(props) {
    var _this;
    _classCallCheck(this, PopperContent);
    _this = _super.call(this, props);
    _this.setTargetNode = _this.setTargetNode.bind(_assertThisInitialized(_this));
    _this.getTargetNode = _this.getTargetNode.bind(_assertThisInitialized(_this));
    _this.getRef = _this.getRef.bind(_assertThisInitialized(_this));
    _this.onClosed = _this.onClosed.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: props.isOpen
    };
    return _this;
  }
  _createClass(PopperContent, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this._element && this._element.childNodes && this._element.childNodes[0] && this._element.childNodes[0].focus) {
        this._element.childNodes[0].focus();
      }
    }
  }, {
    key: "onClosed",
    value: function onClosed() {
      this.props.onClosed();
      this.setState({
        isOpen: false
      });
    }
  }, {
    key: "getTargetNode",
    value: function getTargetNode() {
      return this.targetNode;
    }
  }, {
    key: "getContainerNode",
    value: function getContainerNode() {
      return (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getTarget)(this.props.container);
    }
  }, {
    key: "getRef",
    value: function getRef(ref) {
      this._element = ref;
    }
  }, {
    key: "setTargetNode",
    value: function setTargetNode(node) {
      this.targetNode = typeof node === 'string' ? (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getTarget)(node) : node;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this$props = this.props,
        cssModule = _this$props.cssModule,
        children = _this$props.children,
        isOpen = _this$props.isOpen,
        flip = _this$props.flip,
        target = _this$props.target,
        offset = _this$props.offset,
        fallbackPlacements = _this$props.fallbackPlacements,
        placementPrefix = _this$props.placementPrefix,
        _arrowClassName = _this$props.arrowClassName,
        hideArrow = _this$props.hideArrow,
        _popperClassName = _this$props.popperClassName,
        tag = _this$props.tag,
        container = _this$props.container,
        modifiers = _this$props.modifiers,
        strategy = _this$props.strategy,
        boundariesElement = _this$props.boundariesElement,
        onClosed = _this$props.onClosed,
        fade = _this$props.fade,
        transition = _this$props.transition,
        placement = _this$props.placement,
        attrs = _objectWithoutProperties(_this$props, _excluded);
      var arrowClassName = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.mapToCssModules)(classnames__WEBPACK_IMPORTED_MODULE_2___default()('arrow', _arrowClassName), cssModule);
      var popperClassName = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.mapToCssModules)(classnames__WEBPACK_IMPORTED_MODULE_2___default()(_popperClassName, placementPrefix ? "".concat(placementPrefix, "-auto") : ''), this.props.cssModule);
      var modifierNames = modifiers.map(function (m) {
        return m.name;
      });
      var baseModifiers = [{
        name: 'offset',
        options: {
          offset: offset
        }
      }, {
        name: 'flip',
        enabled: flip,
        options: {
          fallbackPlacements: fallbackPlacements
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: boundariesElement
        }
      }].filter(function (m) {
        return !modifierNames.includes(m.name);
      });
      var extendedModifiers = [].concat(_toConsumableArray(baseModifiers), _toConsumableArray(modifiers));
      var popperTransition = _objectSpread(_objectSpread(_objectSpread({}, _Fade__WEBPACK_IMPORTED_MODULE_5__["default"].defaultProps), transition), {}, {
        baseClass: fade ? transition.baseClass : '',
        timeout: fade ? transition.timeout : 0
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Fade__WEBPACK_IMPORTED_MODULE_5__["default"], _extends({}, popperTransition, attrs, {
        "in": isOpen,
        onExited: this.onClosed,
        tag: tag
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_popper__WEBPACK_IMPORTED_MODULE_6__.Popper, {
        referenceElement: this.targetNode,
        modifiers: extendedModifiers,
        placement: placement,
        strategy: strategy
      }, function (_ref) {
        var ref = _ref.ref,
          style = _ref.style,
          popperPlacement = _ref.placement,
          isReferenceHidden = _ref.isReferenceHidden,
          arrowProps = _ref.arrowProps,
          update = _ref.update;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
          ref: ref,
          style: style,
          className: popperClassName,
          "data-popper-placement": popperPlacement,
          "data-popper-reference-hidden": isReferenceHidden ? 'true' : undefined
        }, typeof children === 'function' ? children({
          update: update
        }) : children, !hideArrow && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
          ref: arrowProps.ref,
          className: arrowClassName,
          style: arrowProps.style
        }));
      }));
    }
  }, {
    key: "render",
    value: function render() {
      this.setTargetNode(this.props.target);
      if (this.state.isOpen) {
        return this.props.container === 'inline' ? this.renderChildren() : /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
          ref: this.getRef
        }, this.renderChildren()), this.getContainerNode());
      }
      return null;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.isOpen && !state.isOpen) {
        return {
          isOpen: props.isOpen
        };
      }
      return null;
    }
  }]);
  return PopperContent;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
PopperContent.propTypes = propTypes;
PopperContent.defaultProps = defaultProps;
/* harmony default export */ __webpack_exports__["default"] = (PopperContent);

/***/ }),

/***/ 89556:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePopper: function() { return /* binding */ usePopper; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40961);
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(77353);
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30115);
/* harmony import */ var react_fast_compare__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_fast_compare__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13316);





var EMPTY_MODIFIERS = [];
var usePopper = function usePopper(referenceElement, popperElement, options) {
  if (options === void 0) {
    options = {};
  }

  var prevOptions = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  var optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS
  };

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: '0',
        top: '0'
      },
      arrow: {
        position: 'absolute'
      }
    },
    attributes: {}
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  var updateStateModifier = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    return {
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: function fn(_ref) {
        var state = _ref.state;
        var elements = Object.keys(state.elements);
        react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(function () {
          setState({
            styles: (0,_utils__WEBPACK_IMPORTED_MODULE_3__.fromEntries)(elements.map(function (element) {
              return [element, state.styles[element] || {}];
            })),
            attributes: (0,_utils__WEBPACK_IMPORTED_MODULE_3__.fromEntries)(elements.map(function (element) {
              return [element, state.attributes[element]];
            }))
          });
        });
      },
      requires: ['computeStyles']
    };
  }, []);
  var popperOptions = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
    var newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [].concat(optionsWithDefaults.modifiers, [updateStateModifier, {
        name: 'applyStyles',
        enabled: false
      }])
    };

    if (react_fast_compare__WEBPACK_IMPORTED_MODULE_2___default()(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    } else {
      prevOptions.current = newOptions;
      return newOptions;
    }
  }, [optionsWithDefaults.onFirstUpdate, optionsWithDefaults.placement, optionsWithDefaults.strategy, optionsWithDefaults.modifiers, updateStateModifier]);
  var popperInstanceRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  (0,_utils__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(function () {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);
  (0,_utils__WEBPACK_IMPORTED_MODULE_3__.useIsomorphicLayoutEffect)(function () {
    if (referenceElement == null || popperElement == null) {
      return;
    }

    var createPopper = options.createPopper || _popperjs_core__WEBPACK_IMPORTED_MODULE_4__.createPopper;
    var popperInstance = createPopper(referenceElement, popperElement, popperOptions);
    popperInstanceRef.current = popperInstance;
    return function () {
      popperInstance.destroy();
      popperInstanceRef.current = null;
    };
  }, [referenceElement, popperElement, options.createPopper]);
  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
  };
};

/***/ }),

/***/ 92368:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   srOnlyStyle: function() { return /* binding */ srOnlyStyle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
var _excluded = ["border", "cssModule", "className", "fixedWidth", "flip", "inverse", "name", "pulse", "rotate", "size", "spin", "stack", "tag", "iconStyle", "ariaLabel"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
/* eslint-disable no-unused-expressions */


var srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0px',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0px, 0px, 0px, 0px)',
  border: '0px'
};
/**
 * A React component for the fontawesome icon library.
 *
 *
 * @param {String} [ariaLabel] An extra accessibility label to put on the icon
 * @param {Boolean} [border=false] Whether or not to show a border radius
 * @param {String} [className] An extra set of CSS classes to add to the component
 * @param {Object} [cssModule] Option to pass FontAwesome CSS as a module
 * @param {Boolean} [fixedWidth=false] Make buttons fixed width
 * @param {String} [flip=false] Flip the icon's orientation.
 * @param {Boolean} [inverse=false] Inverse the icon's color
 * @param {String} name Name of the icon to use
 * @param {Boolean} [pulse=false] Rotate icon with 8 steps (rather than smoothly)
 * @param {Number} [rotate] The degress to rotate the icon by
 * @param {String} [size] The icon scaling size
 * @param {Boolean} [spin=false] Spin the icon
 * @param {String} [stack] Stack an icon on top of another
 * @param {String} [tag=span] The HTML tag to use as a string (eg 'i' or 'em')
 * @param {String} [iconStyle] Font Awesome classic family with multiple icon styles to choose from
 * @param {Boolean} [isSolid] FontAwesome 5 to use solid icons if true
 * @module FontAwesome
 * @type {ReactClass}
 */
var Icon = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((props, ref) => {
  var border = props.border,
    cssModule = props.cssModule,
    className = props.className,
    fixedWidth = props.fixedWidth,
    flip = props.flip,
    inverse = props.inverse,
    name = props.name,
    pulse = props.pulse,
    rotate = props.rotate,
    size = props.size,
    spin = props.spin,
    stack = props.stack,
    _props$tag = props.tag,
    tag = _props$tag === void 0 ? 'i' : _props$tag,
    iconStyle = props.iconStyle,
    ariaLabel = props.ariaLabel,
    restProps = _objectWithoutProperties(props, _excluded);
  var Tag = tag;
  var classNames = [];
  if (cssModule) {
    classNames.push(cssModule.fa);
    classNames.push(cssModule[`fa-${name}`]);
    size && classNames.push(cssModule[`fa-${size}`]);
    spin && classNames.push(cssModule['fa-spin']);
    pulse && classNames.push(cssModule['fa-pulse']);
    border && classNames.push(cssModule['fa-border']);
    fixedWidth && classNames.push(cssModule['fa-fw']);
    flip && classNames.push(cssModule[`fa-flip-${flip}`]);
    rotate && classNames.push(cssModule[`fa-rotate-${rotate}`]);
    stack && classNames.push(cssModule[`fa-stack-${stack}`]);
    inverse && classNames.push(cssModule['fa-inverse']);
  } else {
    classNames.push(name);
    size && classNames.push(size);
    spin && classNames.push('spin');
    pulse && classNames.push('pulse');
    border && classNames.push('border');
    fixedWidth && classNames.push('fw');
    flip && classNames.push(`flip-${flip}`);
    rotate && classNames.push(`rotate-${rotate}`);
    stack && classNames.push(`stack-${stack}`);
    inverse && classNames.push('inverse');
    var fa = classNames.map(iconName => `fa-${iconName}`);
    iconStyle ? fa.unshift(`fa-${iconStyle}`) : fa.unshift(`fa-solid`);
    classNames = fa;
  }

  // Add any custom class names at the end.
  className && classNames.push(className);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Tag, _extends({}, restProps, {
    ref: ref,
    "aria-hidden": true,
    className: classNames.join(' ')
  }), ariaLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    style: srOnlyStyle
  }, ariaLabel));
});
Icon.displayName = 'Icon';
/* harmony default export */ __webpack_exports__["default"] = (Icon);

/***/ })

}]);