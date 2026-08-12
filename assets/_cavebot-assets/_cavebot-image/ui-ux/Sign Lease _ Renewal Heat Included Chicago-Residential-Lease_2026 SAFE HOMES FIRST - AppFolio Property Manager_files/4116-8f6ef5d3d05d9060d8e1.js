"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[4116],{

/***/ 816:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32485);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(96540);
/* harmony import */ var _util_uniqueId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3401);
/* harmony import */ var _Button_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(47618);
/* harmony import */ var _Tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(85952);
var _excluded = ["tooltip", "disabled", "tooltipPlacement", "children", "gearsBtnContainerClass"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }





var TooltipButton = _ref => {
  var tooltip = _ref.tooltip,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$tooltipPlacement = _ref.tooltipPlacement,
    tooltipPlacement = _ref$tooltipPlacement === void 0 ? 'top' : _ref$tooltipPlacement,
    children = _ref.children,
    gearsBtnContainerClass = _ref.gearsBtnContainerClass,
    props = _objectWithoutProperties(_ref, _excluded);
  var buttonId = (0,_util_uniqueId__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)('tooltip-button-');
  var tooltipId = `tooltip-for-${buttonId}`;
  var className = classnames__WEBPACK_IMPORTED_MODULE_0___default()('d-inline-block', gearsBtnContainerClass);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, tooltip && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_Tooltip__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: tooltipId,
    placement: tooltipPlacement,
    target: buttonId
  }, tooltip), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    tabIndex: disabled && tooltip ? 0 : -1,
    id: buttonId,
    className: className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_Button_Button__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({
    "aria-describedby": tooltipId,
    disabled: disabled,
    style: _objectSpread({
      pointerEvents: disabled ? 'none' : 'auto'
    }, props.style)
  }, props), children)));
};
TooltipButton.displayName = 'TooltipButton';
/* harmony default export */ __webpack_exports__["default"] = (TooltipButton);

/***/ }),

/***/ 3066:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(8550);
var react_1 = __webpack_require__(96540);
var useEffectOnce_1 = tslib_1.__importDefault(__webpack_require__(71912));
var useUnmount = function (fn) {
    var fnRef = react_1.useRef(fn);
    // update the ref each render so if it change the newest callback will be invoked
    fnRef.current = fn;
    useEffectOnce_1.default(function () { return function () { return fnRef.current(); }; });
};
exports["default"] = useUnmount;


/***/ }),

/***/ 7261:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ ScrollContainer_ScrollContainer; }
});

// EXTERNAL MODULE: ./node_modules/styled-jsx/style.js
var style = __webpack_require__(98111);
var style_default = /*#__PURE__*/__webpack_require__.n(style);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(40961);
// EXTERNAL MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
var ResizeObserver_es = __webpack_require__(43591);
// EXTERNAL MODULE: ./node_modules/raf-schd/dist/raf-schd.esm.js
var raf_schd_esm = __webpack_require__(10629);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
// EXTERNAL MODULE: ./node_modules/lodash-es/debounce.js + 5 modules
var debounce = __webpack_require__(17139);
// EXTERNAL MODULE: ./node_modules/lodash-es/throttle.js
var throttle = __webpack_require__(74022);
;// ./node_modules/react-resize-detector/lib/esm/lib/utils.js


var listHandle = {
  debounce: debounce["default"],
  throttle: throttle["default"]
};
var getHandle = function getHandle(type) {
  return listHandle[type];
};
var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};
var isSSR = function isSSR() {
  return typeof window === 'undefined';
};
var isDOMElement = function isDOMElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
};
;// ./node_modules/react-resize-detector/lib/esm/components/ChildWrapper.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var ChildWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(ChildWrapper, _PureComponent);

  var _super = _createSuper(ChildWrapper);

  function ChildWrapper() {
    _classCallCheck(this, ChildWrapper);

    return _super.apply(this, arguments);
  }

  _createClass(ChildWrapper, [{
    key: "render",
    value: function render() {
      // eslint-disable-next-line react/prop-types
      return this.props.children;
    }
  }]);

  return ChildWrapper;
}(react.PureComponent);

/* harmony default export */ var components_ChildWrapper = (ChildWrapper);
;// ./node_modules/react-resize-detector/lib/esm/components/ResizeDetector.js
function ResizeDetector_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ResizeDetector_typeof = function _typeof(obj) { return typeof obj; }; } else { ResizeDetector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ResizeDetector_typeof(obj); }

function ResizeDetector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ResizeDetector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ResizeDetector_createClass(Constructor, protoProps, staticProps) { if (protoProps) ResizeDetector_defineProperties(Constructor.prototype, protoProps); if (staticProps) ResizeDetector_defineProperties(Constructor, staticProps); return Constructor; }

function ResizeDetector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ResizeDetector_setPrototypeOf(subClass, superClass); }

function ResizeDetector_setPrototypeOf(o, p) { ResizeDetector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ResizeDetector_setPrototypeOf(o, p); }

function ResizeDetector_createSuper(Derived) { return function () { var Super = ResizeDetector_getPrototypeOf(Derived), result; if (ResizeDetector_isNativeReflectConstruct()) { var NewTarget = ResizeDetector_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return ResizeDetector_possibleConstructorReturn(this, result); }; }

function ResizeDetector_possibleConstructorReturn(self, call) { if (call && (ResizeDetector_typeof(call) === "object" || typeof call === "function")) { return call; } return ResizeDetector_assertThisInitialized(self); }

function ResizeDetector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ResizeDetector_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function ResizeDetector_getPrototypeOf(o) { ResizeDetector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ResizeDetector_getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var ResizeDetector = /*#__PURE__*/function (_PureComponent) {
  ResizeDetector_inherits(ResizeDetector, _PureComponent);

  var _super = ResizeDetector_createSuper(ResizeDetector);

  function ResizeDetector(props) {
    var _this;

    ResizeDetector_classCallCheck(this, ResizeDetector);

    _this = _super.call(this, props);

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "cancelHandler", function () {
      if (_this.resizeHandler && _this.resizeHandler.cancel) {
        // cancel debounced handler
        _this.resizeHandler.cancel();

        _this.resizeHandler = null;
      }
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "rafClean", function () {
      if (_this.raf && _this.raf.cancel) {
        _this.raf.cancel();

        _this.raf = null;
      }
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "toggleObserver", function (type) {
      var element = _this.getElement();

      if (!element || !_this.resizeObserver[type]) return;

      _this.resizeObserver[type](element);
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "getElement", function () {
      var _this$props = _this.props,
          querySelector = _this$props.querySelector,
          targetDomEl = _this$props.targetDomEl;
      if (isSSR()) return undefined;
      if (querySelector) return document.querySelector(querySelector);
      if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl; // eslint-disable-next-line react/no-find-dom-node

      var currentElement = _this.element && (0,react_dom.findDOMNode)(_this.element);
      if (!currentElement) return undefined;
      return currentElement.parentElement;
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "createUpdater", function () {
      _this.rafClean();

      _this.raf = (0,raf_schd_esm["default"])(function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        var onResize = _this.props.onResize;

        if (isFunction(onResize)) {
          onResize(width, height);
        }

        _this.setState({
          width: width,
          height: height
        });
      });
      return _this.raf;
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "createResizeHandler", function (entries) {
      var _this$state = _this.state,
          widthCurrent = _this$state.width,
          heightCurrent = _this$state.height;
      var _this$props2 = _this.props,
          handleWidth = _this$props2.handleWidth,
          handleHeight = _this$props2.handleHeight;
      if (!handleWidth && !handleHeight) return;

      var updater = _this.createUpdater();

      entries.forEach(function (entry) {
        var _ref2 = entry && entry.contentRect || {},
            width = _ref2.width,
            height = _ref2.height;

        var isWidthChanged = handleWidth && widthCurrent !== width;
        var isHeightChanged = handleHeight && heightCurrent !== height;
        var isSizeChanged = isWidthChanged || isHeightChanged;
        var shouldSetSize = !_this.skipOnMount && isSizeChanged && !isSSR();

        if (shouldSetSize) {
          updater({
            width: width,
            height: height
          });
        }

        _this.skipOnMount = false;
      });
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "onRef", function (el) {
      _this.element = el;
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "getRenderType", function () {
      var _this$props3 = _this.props,
          render = _this$props3.render,
          children = _this$props3.children;

      if (isFunction(render)) {
        return 'renderProp';
      }

      if (isFunction(children)) {
        return 'childFunction';
      }

      if ((0,react.isValidElement)(children)) {
        return 'child';
      }

      if (Array.isArray(children)) {
        return 'childArray';
      }

      return 'parent';
    });

    _defineProperty(ResizeDetector_assertThisInitialized(_this), "getTargetComponent", function () {
      var _this$props4 = _this.props,
          render = _this$props4.render,
          children = _this$props4.children,
          nodeType = _this$props4.nodeType;
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var childProps = {
        width: width,
        height: height
      };

      var renderType = _this.getRenderType();

      switch (renderType) {
        case 'renderProp':
          return (0,react.cloneElement)(render(childProps), {
            key: 'resize-detector'
          });

        case 'childFunction':
          return (0,react.cloneElement)(children(childProps));

        case 'child':
          return (0,react.cloneElement)(children, childProps);

        case 'childArray':
          return children.map(function (el) {
            return !!el && (0,react.cloneElement)(el, childProps);
          });

        default:
          return (0,react.createElement)(nodeType);
      }
    });

    var skipOnMount = props.skipOnMount,
        refreshMode = props.refreshMode,
        refreshRate = props.refreshRate,
        refreshOptions = props.refreshOptions;
    _this.state = {
      width: undefined,
      height: undefined
    };
    _this.skipOnMount = skipOnMount;
    _this.raf = null;
    _this.element = null;
    _this.unmounted = false;
    var handle = getHandle(refreshMode);
    _this.resizeHandler = handle ? handle(_this.createResizeHandler, refreshRate, refreshOptions) : _this.createResizeHandler;
    _this.resizeObserver = new ResizeObserver_es["default"](_this.resizeHandler);
    return _this;
  }

  ResizeDetector_createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.toggleObserver('observe');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.toggleObserver('unobserve');
      this.rafClean();
      this.cancelHandler();
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(components_ChildWrapper, {
        ref: this.onRef
      }, this.getTargetComponent());
    }
  }]);

  return ResizeDetector;
}(react.PureComponent);

ResizeDetector.propTypes = {
  handleWidth: prop_types.bool,
  handleHeight: prop_types.bool,
  skipOnMount: prop_types.bool,
  refreshRate: prop_types.number,
  refreshMode: prop_types.string,
  refreshOptions: (0,prop_types.shape)({
    leading: prop_types.bool,
    trailing: prop_types.bool
  }),
  querySelector: prop_types.string,
  targetDomEl: prop_types.any,
  // eslint-disable-line react/forbid-prop-types
  onResize: prop_types.func,
  render: prop_types.func,
  children: prop_types.any,
  // eslint-disable-line react/forbid-prop-types
  nodeType: prop_types.node
};
ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  targetDomEl: null,
  onResize: null,
  render: undefined,
  children: null,
  nodeType: 'div'
};
/* harmony default export */ var components_ResizeDetector = (ResizeDetector);
;// ./node_modules/react-resize-detector/lib/esm/hoc/withResizeDetector.js
function withResizeDetector_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { withResizeDetector_typeof = function _typeof(obj) { return typeof obj; }; } else { withResizeDetector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return withResizeDetector_typeof(obj); }

function withResizeDetector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function withResizeDetector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function withResizeDetector_createClass(Constructor, protoProps, staticProps) { if (protoProps) withResizeDetector_defineProperties(Constructor.prototype, protoProps); if (staticProps) withResizeDetector_defineProperties(Constructor, staticProps); return Constructor; }

function withResizeDetector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) withResizeDetector_setPrototypeOf(subClass, superClass); }

function withResizeDetector_setPrototypeOf(o, p) { withResizeDetector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return withResizeDetector_setPrototypeOf(o, p); }

function withResizeDetector_createSuper(Derived) { return function () { var Super = withResizeDetector_getPrototypeOf(Derived), result; if (withResizeDetector_isNativeReflectConstruct()) { var NewTarget = withResizeDetector_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return withResizeDetector_possibleConstructorReturn(this, result); }; }

function withResizeDetector_possibleConstructorReturn(self, call) { if (call && (withResizeDetector_typeof(call) === "object" || typeof call === "function")) { return call; } return withResizeDetector_assertThisInitialized(self); }

function withResizeDetector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function withResizeDetector_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function withResizeDetector_getPrototypeOf(o) { withResizeDetector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return withResizeDetector_getPrototypeOf(o); }




var withResizeDetector = function withResizeDetector(WrappedComponent) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    handleWidth: true,
    handleHeight: true
  };
  return (
    /*#__PURE__*/
    // eslint-disable-next-line
    function (_Component) {
      withResizeDetector_inherits(ResizeDetectorHOC, _Component);

      var _super = withResizeDetector_createSuper(ResizeDetectorHOC);

      function ResizeDetectorHOC() {
        withResizeDetector_classCallCheck(this, ResizeDetectorHOC);

        return _super.apply(this, arguments);
      }

      withResizeDetector_createClass(ResizeDetectorHOC, [{
        key: "render",
        value: function render() {
          return /*#__PURE__*/react.createElement(components_ResizeDetector, props, /*#__PURE__*/react.createElement(WrappedComponent, this.props));
        }
      }]);

      return ResizeDetectorHOC;
    }(react.Component)
  );
};

/* harmony default export */ var hoc_withResizeDetector = (withResizeDetector);
;// ./node_modules/react-resize-detector/lib/esm/index.js



/* harmony default export */ var esm = (components_ResizeDetector);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/react-use/lib/useScroll.js
var useScroll = __webpack_require__(18565);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/react-use/lib/useSessionStorage.js
var useSessionStorage = __webpack_require__(41745);
// EXTERNAL MODULE: ./node_modules/uuid/dist/esm-browser/v4.js + 5 modules
var v4 = __webpack_require__(86251);
;// ./node_modules/@appfolio/react-gears/esm/hooks/useSavedScroll.js
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




function useSavedScroll(container, key) {
  var _useSessionStorage = (0,useSessionStorage["default"])(key || (0,v4["default"])()),
    _useSessionStorage2 = _slicedToArray(_useSessionStorage, 2),
    position = _useSessionStorage2[0],
    setPosition = _useSessionStorage2[1];
  var scrollPosition = (0,useScroll["default"])(container);
  (0,react.useEffect)(() => {
    if (key) {
      setPosition(scrollPosition);
    }
  }, [key, scrollPosition, setPosition]);
  (0,react.useLayoutEffect)(() => {
    if (container.current && position && key) {
      container.current.scrollTo(position.x, position.y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- There is a test dependent on this
  }, [container, key]);
}
/* harmony default export */ var hooks_useSavedScroll = (useSavedScroll);
;// ./node_modules/@appfolio/react-gears/esm/components/ScrollContainer/ScrollContainer.js
var _excluded = ["children", "className", "height", "scrollPositionKey", "theme"];

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ScrollContainer_slicedToArray(r, e) { return ScrollContainer_arrayWithHoles(r) || ScrollContainer_iterableToArrayLimit(r, e) || ScrollContainer_unsupportedIterableToArray(r, e) || ScrollContainer_nonIterableRest(); }
function ScrollContainer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function ScrollContainer_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return ScrollContainer_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? ScrollContainer_arrayLikeToArray(r, a) : void 0; } }
function ScrollContainer_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ScrollContainer_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function ScrollContainer_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }




var defaultTheme = {
  overflowTop: 'overflow-top',
  overflowBottom: 'overflow-bottom',
  overflowLeft: 'overflow-left',
  overflowRight: 'overflow-right'
};
var ScrollContainer = _ref => {
  var children = _ref.children,
    className = _ref.className,
    height = _ref.height,
    scrollPositionKey = _ref.scrollPositionKey,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? defaultTheme : _ref$theme,
    props = _objectWithoutProperties(_ref, _excluded);
  var _useState = (0,react.useState)({
      overflowTop: false,
      overflowBottom: false,
      overflowLeft: false,
      overflowRight: false
    }),
    _useState2 = ScrollContainer_slicedToArray(_useState, 2),
    overflow = _useState2[0],
    setOverflow = _useState2[1];
  var container = (0,react.useRef)(null);
  hooks_useSavedScroll(container, scrollPositionKey);
  function detectOverflow() {
    if (container.current) {
      var _container$current = container.current,
        clientHeight = _container$current.clientHeight,
        clientWidth = _container$current.clientWidth,
        scrollHeight = _container$current.scrollHeight,
        scrollLeft = _container$current.scrollLeft,
        scrollTop = _container$current.scrollTop,
        scrollWidth = _container$current.scrollWidth;
      setOverflow({
        overflowTop: scrollTop > 0,
        overflowBottom: scrollHeight - scrollTop > clientHeight,
        overflowLeft: scrollLeft > 0,
        overflowRight: scrollWidth - scrollLeft > clientWidth
      });
    }
  }
  var overflowTop = overflow.overflowTop,
    overflowBottom = overflow.overflowBottom,
    overflowLeft = overflow.overflowLeft,
    overflowRight = overflow.overflowRight;
  var classNames = classnames_default()(className, 'scroll-container', 'position-relative', {
    [theme.overflowTop]: overflowTop,
    [theme.overflowBottom]: overflowBottom,
    [theme.overflowLeft]: overflowLeft,
    [theme.overflowRight]: overflowRight
  });
  return /*#__PURE__*/react.createElement("div", _extends({}, props, {
    className: "jsx-201526664" + " " + (props && props.className != null && props.className || classNames || "")
  }), /*#__PURE__*/react.createElement("div", {
    ref: container,
    style: {
      maxHeight: height,
      overflow: 'auto'
    },
    onScroll: () => detectOverflow(),
    className: "jsx-201526664"
  }, children), /*#__PURE__*/react.createElement(esm, {
    handleWidth: true,
    handleHeight: true,
    onResize: () => detectOverflow()
  }), /*#__PURE__*/react.createElement("div", {
    className: "jsx-201526664" + " " + "container-shadow"
  }), /*#__PURE__*/react.createElement((style_default()), {
    id: "201526664"
  }, ".scroll-container.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:none;content:'';display:block;top:0px;left:0px;bottom:0px;right:0px;pointer-events:none;position:absolute;z-index:990;}.scroll-container.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:-8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-left.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-left.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:8px 0 8px -8px rgba(0,0,0,0.25) inset, -8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-bottom.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 -8px 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-bottom.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 -8px 8px -8px rgba(0,0,0,0.25) inset, -8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-bottom.overflow-left.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 -8px 8px -8px rgba(0,0,0,0.25) inset, 8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-bottom.overflow-left.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 -8px 8px -8px rgba(0,0,0,0.25) inset, 8px 0 8px -8px rgba(0,0,0,0.25) inset,-8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, -8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-left.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, 8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-left.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, 8px 0 8px -8px rgba(0,0,0,0.25) inset,-8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-bottom.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, 0 -8px 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-bottom.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, -8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-bottom.overflow-left.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, 0 -8px 8px -8px rgba(0,0,0,0.25) inset,8px 0 8px -8px rgba(0,0,0,0.25) inset;}.scroll-container.overflow-top.overflow-bottom.overflow-left.overflow-right.jsx-201526664 .container-shadow.jsx-201526664{box-shadow:0 8px 8px -8px rgba(0,0,0,0.25) inset, 8px 0 8px -8px rgba(0,0,0,0.25) inset,-8px 0 8px -8px rgba(0,0,0,0.25) inset, 0 -8px 8px -8px rgba(0,0,0,0.25) inset;}"));
};
ScrollContainer.displayName = "ScrollContainer";
ScrollContainer.displayName = 'ScrollContainer';
/* harmony default export */ var ScrollContainer_ScrollContainer = (ScrollContainer);

/***/ }),

/***/ 8550:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: function() { return /* binding */ __assign; },
/* harmony export */   __asyncDelegator: function() { return /* binding */ __asyncDelegator; },
/* harmony export */   __asyncGenerator: function() { return /* binding */ __asyncGenerator; },
/* harmony export */   __asyncValues: function() { return /* binding */ __asyncValues; },
/* harmony export */   __await: function() { return /* binding */ __await; },
/* harmony export */   __awaiter: function() { return /* binding */ __awaiter; },
/* harmony export */   __classPrivateFieldGet: function() { return /* binding */ __classPrivateFieldGet; },
/* harmony export */   __classPrivateFieldIn: function() { return /* binding */ __classPrivateFieldIn; },
/* harmony export */   __classPrivateFieldSet: function() { return /* binding */ __classPrivateFieldSet; },
/* harmony export */   __createBinding: function() { return /* binding */ __createBinding; },
/* harmony export */   __decorate: function() { return /* binding */ __decorate; },
/* harmony export */   __exportStar: function() { return /* binding */ __exportStar; },
/* harmony export */   __extends: function() { return /* binding */ __extends; },
/* harmony export */   __generator: function() { return /* binding */ __generator; },
/* harmony export */   __importDefault: function() { return /* binding */ __importDefault; },
/* harmony export */   __importStar: function() { return /* binding */ __importStar; },
/* harmony export */   __makeTemplateObject: function() { return /* binding */ __makeTemplateObject; },
/* harmony export */   __metadata: function() { return /* binding */ __metadata; },
/* harmony export */   __param: function() { return /* binding */ __param; },
/* harmony export */   __read: function() { return /* binding */ __read; },
/* harmony export */   __rest: function() { return /* binding */ __rest; },
/* harmony export */   __spread: function() { return /* binding */ __spread; },
/* harmony export */   __spreadArray: function() { return /* binding */ __spreadArray; },
/* harmony export */   __spreadArrays: function() { return /* binding */ __spreadArrays; },
/* harmony export */   __values: function() { return /* binding */ __values; }
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
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
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ }),

/***/ 9594:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNavigator = exports.isBrowser = exports.off = exports.on = exports.noop = void 0;
var noop = function () { };
exports.noop = noop;
function on(obj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (obj && obj.addEventListener) {
        obj.addEventListener.apply(obj, args);
    }
}
exports.on = on;
function off(obj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (obj && obj.removeEventListener) {
        obj.removeEventListener.apply(obj, args);
    }
}
exports.off = off;
exports.isBrowser = typeof window !== 'undefined';
exports.isNavigator = typeof navigator !== 'undefined';


/***/ }),

/***/ 18565:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(8550);
var react_1 = __webpack_require__(96540);
var useRafState_1 = tslib_1.__importDefault(__webpack_require__(55686));
var util_1 = __webpack_require__(9594);
var useScroll = function (ref) {
    if (false) {}
    var _a = useRafState_1.default({
        x: 0,
        y: 0,
    }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var handler = function () {
            if (ref.current) {
                setState({
                    x: ref.current.scrollLeft,
                    y: ref.current.scrollTop,
                });
            }
        };
        if (ref.current) {
            util_1.on(ref.current, 'scroll', handler, {
                capture: false,
                passive: true,
            });
        }
        return function () {
            if (ref.current) {
                util_1.off(ref.current, 'scroll', handler);
            }
        };
    }, [ref]);
    return state;
};
exports["default"] = useScroll;


/***/ }),

/***/ 41745:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(96540);
var util_1 = __webpack_require__(9594);
var useSessionStorage = function (key, initialValue, raw) {
    if (!util_1.isBrowser) {
        return [initialValue, function () { }];
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _a = react_1.useState(function () {
        try {
            var sessionStorageValue = sessionStorage.getItem(key);
            if (typeof sessionStorageValue !== 'string') {
                sessionStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue));
                return initialValue;
            }
            else {
                return raw ? sessionStorageValue : JSON.parse(sessionStorageValue || 'null');
            }
        }
        catch (_a) {
            // If user is in private mode or has storage restriction
            // sessionStorage can throw. JSON.parse and JSON.stringify
            // can throw, too.
            return initialValue;
        }
    }), state = _a[0], setState = _a[1];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react_1.useEffect(function () {
        try {
            var serializedState = raw ? String(state) : JSON.stringify(state);
            sessionStorage.setItem(key, serializedState);
        }
        catch (_a) {
            // If user is in private mode or has storage restriction
            // sessionStorage can throw. Also JSON.stringify can throw.
        }
    });
    return [state, setState];
};
exports["default"] = useSessionStorage;


/***/ }),

/***/ 55686:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(8550);
var react_1 = __webpack_require__(96540);
var useUnmount_1 = tslib_1.__importDefault(__webpack_require__(3066));
var useRafState = function (initialState) {
    var frame = react_1.useRef(0);
    var _a = react_1.useState(initialState), state = _a[0], setState = _a[1];
    var setRafState = react_1.useCallback(function (value) {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(function () {
            setState(value);
        });
    }, []);
    useUnmount_1.default(function () {
        cancelAnimationFrame(frame.current);
    });
    return [state, setRafState];
};
exports["default"] = useRafState;


/***/ }),

/***/ 71912:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(96540);
var useEffectOnce = function (effect) {
    react_1.useEffect(effect, []);
};
exports["default"] = useEffectOnce;


/***/ })

}]);