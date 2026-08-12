"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[3076],{

/***/ 5744:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Modal_ModalBody; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/utils.js
var utils = __webpack_require__(77804);
;// ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/ModalBody.js
var _excluded = ["className", "cssModule", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




var propTypes = {
  /** Add custom class */
  className: (prop_types_default()).string,
  /** Change underlying component's CSS base class name */
  cssModule: (prop_types_default()).object,
  /** Set a custom element for this component */
  tag: utils.tagPropType
};
function ModalBody(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = (0,utils.mapToCssModules)(classnames_default()(className, 'modal-body'), cssModule);
  return /*#__PURE__*/react.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
ModalBody.propTypes = propTypes;
/* harmony default export */ var esm_ModalBody = (ModalBody);
;// ./node_modules/@appfolio/react-gears/esm/components/Modal/ModalBody.js

/* harmony default export */ var Modal_ModalBody = (esm_ModalBody);

/***/ }),

/***/ 27311:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40961);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5556);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(77804);
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
  children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().node).isRequired,
  node: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().any)
};
var Portal = /*#__PURE__*/function (_React$Component) {
  _inherits(Portal, _React$Component);
  var _super = _createSuper(Portal);
  function Portal() {
    _classCallCheck(this, Portal);
    return _super.apply(this, arguments);
  }
  _createClass(Portal, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.defaultNode) {
        document.body.removeChild(this.defaultNode);
      }
      this.defaultNode = null;
    }
  }, {
    key: "render",
    value: function render() {
      if (!_utils__WEBPACK_IMPORTED_MODULE_3__.canUseDOM) {
        return null;
      }
      if (!this.props.node && !this.defaultNode) {
        this.defaultNode = document.createElement('div');
        document.body.appendChild(this.defaultNode);
      }
      return /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal(this.props.children, this.props.node || this.defaultNode);
    }
  }]);
  return Portal;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
Portal.propTypes = propTypes;
/* harmony default export */ __webpack_exports__["default"] = (Portal);

/***/ }),

/***/ 44589:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ components_Modal_Modal; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/Portal.js
var Portal = __webpack_require__(27311);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/Fade.js
var Fade = __webpack_require__(25523);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/utils.js
var utils = __webpack_require__(77804);
;// ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/Modal.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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






function noop() {}
var FadePropTypes = prop_types_default().shape(Fade["default"].propTypes);
var propTypes = {
  /** */
  autoFocus: (prop_types_default()).bool,
  /** Add backdrop to modal */
  backdrop: prop_types_default().oneOfType([(prop_types_default()).bool, prop_types_default().oneOf(['static'])]),
  /** add custom classname to backdrop */
  backdropClassName: (prop_types_default()).string,
  backdropTransition: FadePropTypes,
  /** Vertically center the modal */
  centered: (prop_types_default()).bool,
  /** Add children for the modal to wrap */
  children: (prop_types_default()).node,
  /** Add custom className for modal content */
  contentClassName: (prop_types_default()).string,
  className: (prop_types_default()).string,
  container: utils.targetPropType,
  cssModule: (prop_types_default()).object,
  external: (prop_types_default()).node,
  /** Enable/Disable animation */
  fade: (prop_types_default()).bool,
  /** Make the modal fullscreen */
  fullscreen: prop_types_default().oneOfType([(prop_types_default()).bool, prop_types_default().oneOf(['sm', 'md', 'lg', 'xl'])]),
  innerRef: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string, (prop_types_default()).func]),
  /** The status of the modal, either open or close */
  isOpen: (prop_types_default()).bool,
  /** Allow modal to be closed with escape key. */
  keyboard: (prop_types_default()).bool,
  /** Identifies the element (or elements) that labels the current element. */
  labelledBy: (prop_types_default()).string,
  modalClassName: (prop_types_default()).string,
  modalTransition: FadePropTypes,
  /** Function to be triggered on close */
  onClosed: (prop_types_default()).func,
  /** Function to be triggered on enter */
  onEnter: (prop_types_default()).func,
  /** Function to be triggered on exit */
  onExit: (prop_types_default()).func,
  /** Function to be triggered on open */
  onOpened: (prop_types_default()).func,
  /** Returns focus to the element that triggered opening of the modal */
  returnFocusAfterClose: (prop_types_default()).bool,
  /** Accessibility role */
  role: (prop_types_default()).string,
  /** Make the modal scrollable */
  scrollable: (prop_types_default()).bool,
  /** Two optional sizes `lg` and `sm` */
  size: (prop_types_default()).string,
  /** Function to toggle modal visibility */
  toggle: (prop_types_default()).func,
  trapFocus: (prop_types_default()).bool,
  /** Unmounts the modal when modal is closed */
  unmountOnClose: (prop_types_default()).bool,
  wrapClassName: (prop_types_default()).string,
  zIndex: prop_types_default().oneOfType([(prop_types_default()).number, (prop_types_default()).string])
};
var propsToOmit = Object.keys(propTypes);
var defaultProps = {
  isOpen: false,
  autoFocus: true,
  centered: false,
  scrollable: false,
  role: 'dialog',
  backdrop: true,
  keyboard: true,
  zIndex: 1050,
  fade: true,
  onOpened: noop,
  onClosed: noop,
  modalTransition: {
    timeout: utils.TransitionTimeouts.Modal
  },
  backdropTransition: {
    mountOnEnter: true,
    timeout: utils.TransitionTimeouts.Fade // uses standard fade transition
  },

  unmountOnClose: true,
  returnFocusAfterClose: true,
  container: 'body',
  trapFocus: false
};
var Modal = /*#__PURE__*/function (_React$Component) {
  _inherits(Modal, _React$Component);
  var _super = _createSuper(Modal);
  function Modal(props) {
    var _this;
    _classCallCheck(this, Modal);
    _this = _super.call(this, props);
    _this._element = null;
    _this._originalBodyPadding = null;
    _this.getFocusableChildren = _this.getFocusableChildren.bind(_assertThisInitialized(_this));
    _this.handleBackdropClick = _this.handleBackdropClick.bind(_assertThisInitialized(_this));
    _this.handleBackdropMouseDown = _this.handleBackdropMouseDown.bind(_assertThisInitialized(_this));
    _this.handleEscape = _this.handleEscape.bind(_assertThisInitialized(_this));
    _this.handleStaticBackdropAnimation = _this.handleStaticBackdropAnimation.bind(_assertThisInitialized(_this));
    _this.handleTab = _this.handleTab.bind(_assertThisInitialized(_this));
    _this.onOpened = _this.onOpened.bind(_assertThisInitialized(_this));
    _this.onClosed = _this.onClosed.bind(_assertThisInitialized(_this));
    _this.manageFocusAfterClose = _this.manageFocusAfterClose.bind(_assertThisInitialized(_this));
    _this.clearBackdropAnimationTimeout = _this.clearBackdropAnimationTimeout.bind(_assertThisInitialized(_this));
    _this.trapFocus = _this.trapFocus.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: false,
      showStaticBackdropAnimation: false
    };
    return _this;
  }
  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
        isOpen = _this$props.isOpen,
        autoFocus = _this$props.autoFocus,
        onEnter = _this$props.onEnter;
      if (isOpen) {
        this.init();
        this.setState({
          isOpen: true
        });
        if (autoFocus) {
          this.setFocus();
        }
      }
      if (onEnter) {
        onEnter();
      }

      // traps focus inside the Modal, even if the browser address bar is focused
      document.addEventListener('focus', this.trapFocus, true);
      this._isMounted = true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.isOpen && !prevProps.isOpen) {
        this.init();
        this.setState({
          isOpen: true
        });
        // let render() renders Modal Dialog first
        return;
      }

      // now Modal Dialog is rendered and we can refer this._element and this._dialog
      if (this.props.autoFocus && this.state.isOpen && !prevState.isOpen) {
        this.setFocus();
      }
      if (this._element && prevProps.zIndex !== this.props.zIndex) {
        this._element.style.zIndex = this.props.zIndex;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearBackdropAnimationTimeout();
      if (this.props.onExit) {
        this.props.onExit();
      }
      if (this._element) {
        this.destroy();
        if (this.props.isOpen || this.state.isOpen) {
          this.close();
        }
      }
      document.removeEventListener('focus', this.trapFocus, true);
      this._isMounted = false;
    }

    // not mouseUp because scrollbar fires it, shouldn't close when user scrolls
  }, {
    key: "handleBackdropClick",
    value: function handleBackdropClick(e) {
      if (e.target === this._mouseDownElement) {
        e.stopPropagation();
        var backdrop = this._dialog ? this._dialog.parentNode : null;
        if (backdrop && e.target === backdrop && this.props.backdrop === 'static') {
          this.handleStaticBackdropAnimation();
        }
        if (!this.props.isOpen || this.props.backdrop !== true) return;
        if (backdrop && e.target === backdrop && this.props.toggle) {
          this.props.toggle(e);
        }
      }
    }
  }, {
    key: "handleTab",
    value: function handleTab(e) {
      if (e.which !== 9) return;
      if (this.modalIndex < Modal.openCount - 1) return; // last opened modal

      var focusableChildren = this.getFocusableChildren();
      var totalFocusable = focusableChildren.length;
      if (totalFocusable === 0) return;
      var currentFocus = this.getFocusedChild();
      var focusedIndex = 0;
      for (var i = 0; i < totalFocusable; i += 1) {
        if (focusableChildren[i] === currentFocus) {
          focusedIndex = i;
          break;
        }
      }
      if (e.shiftKey && focusedIndex === 0) {
        e.preventDefault();
        focusableChildren[totalFocusable - 1].focus();
      } else if (!e.shiftKey && focusedIndex === totalFocusable - 1) {
        e.preventDefault();
        focusableChildren[0].focus();
      }
    }
  }, {
    key: "handleBackdropMouseDown",
    value: function handleBackdropMouseDown(e) {
      this._mouseDownElement = e.target;
    }
  }, {
    key: "handleEscape",
    value: function handleEscape(e) {
      if (this.props.isOpen && e.keyCode === utils.keyCodes.esc && this.props.toggle) {
        if (this.props.keyboard) {
          e.preventDefault();
          e.stopPropagation();
          this.props.toggle(e);
        } else if (this.props.backdrop === 'static') {
          e.preventDefault();
          e.stopPropagation();
          this.handleStaticBackdropAnimation();
        }
      }
    }
  }, {
    key: "handleStaticBackdropAnimation",
    value: function handleStaticBackdropAnimation() {
      var _this2 = this;
      this.clearBackdropAnimationTimeout();
      this.setState({
        showStaticBackdropAnimation: true
      });
      this._backdropAnimationTimeout = setTimeout(function () {
        _this2.setState({
          showStaticBackdropAnimation: false
        });
      }, 100);
    }
  }, {
    key: "onOpened",
    value: function onOpened(node, isAppearing) {
      this.props.onOpened();
      (this.props.modalTransition.onEntered || noop)(node, isAppearing);
    }
  }, {
    key: "onClosed",
    value: function onClosed(node) {
      var unmountOnClose = this.props.unmountOnClose;
      // so all methods get called before it is unmounted
      this.props.onClosed();
      (this.props.modalTransition.onExited || noop)(node);
      if (unmountOnClose) {
        this.destroy();
      }
      this.close();
      if (this._isMounted) {
        this.setState({
          isOpen: false
        });
      }
    }
  }, {
    key: "setFocus",
    value: function setFocus() {
      if (this._dialog && this._dialog.parentNode && typeof this._dialog.parentNode.focus === 'function') {
        this._dialog.parentNode.focus();
      }
    }
  }, {
    key: "getFocusableChildren",
    value: function getFocusableChildren() {
      return this._element.querySelectorAll(utils.focusableElements.join(', '));
    }
  }, {
    key: "getFocusedChild",
    value: function getFocusedChild() {
      var currentFocus;
      var focusableChildren = this.getFocusableChildren();
      try {
        currentFocus = document.activeElement;
      } catch (err) {
        currentFocus = focusableChildren[0];
      }
      return currentFocus;
    }
  }, {
    key: "trapFocus",
    value: function trapFocus(ev) {
      if (!this.props.trapFocus) {
        return;
      }
      if (!this._element) {
        // element is not attached
        return;
      }
      if (this._dialog && this._dialog.parentNode === ev.target) {
        // initial focus when the Modal is opened
        return;
      }
      if (this.modalIndex < Modal.openCount - 1) {
        // last opened modal
        return;
      }
      var children = this.getFocusableChildren();
      for (var i = 0; i < children.length; i += 1) {
        // focus is already inside the Modal
        if (children[i] === ev.target) return;
      }
      if (children.length > 0) {
        // otherwise focus the first focusable element in the Modal
        ev.preventDefault();
        ev.stopPropagation();
        children[0].focus();
      }
    }
  }, {
    key: "init",
    value: function init() {
      try {
        this._triggeringElement = document.activeElement;
      } catch (err) {
        this._triggeringElement = null;
      }
      if (!this._element) {
        this._element = document.createElement('div');
        this._element.setAttribute('tabindex', '-1');
        this._element.style.position = 'relative';
        this._element.style.zIndex = this.props.zIndex;
        this._mountContainer = (0,utils.getTarget)(this.props.container);
        this._mountContainer.appendChild(this._element);
      }
      this._originalBodyPadding = (0,utils.getOriginalBodyPadding)();
      if (Modal.openCount < 1) {
        Modal.originalBodyOverflow = window.getComputedStyle(document.body).overflow;
      }
      (0,utils.conditionallyUpdateScrollbar)();
      if (Modal.openCount === 0) {
        document.body.className = classnames_default()(document.body.className, (0,utils.mapToCssModules)('modal-open', this.props.cssModule));
        document.body.style.overflow = 'hidden';
      }
      this.modalIndex = Modal.openCount;
      Modal.openCount += 1;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this._element) {
        this._mountContainer.removeChild(this._element);
        this._element = null;
      }
      this.manageFocusAfterClose();
    }
  }, {
    key: "manageFocusAfterClose",
    value: function manageFocusAfterClose() {
      if (this._triggeringElement) {
        var returnFocusAfterClose = this.props.returnFocusAfterClose;
        if (this._triggeringElement.focus && returnFocusAfterClose) this._triggeringElement.focus();
        this._triggeringElement = null;
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (Modal.openCount <= 1) {
        var modalOpenClassName = (0,utils.mapToCssModules)('modal-open', this.props.cssModule);
        // Use regex to prevent matching `modal-open` as part of a different class, e.g. `my-modal-opened`
        var modalOpenClassNameRegex = new RegExp("(^| )".concat(modalOpenClassName, "( |$)"));
        document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
        document.body.style.overflow = Modal.originalBodyOverflow;
      }
      this.manageFocusAfterClose();
      Modal.openCount = Math.max(0, Modal.openCount - 1);
      (0,utils.setScrollbarWidth)(this._originalBodyPadding);
    }
  }, {
    key: "clearBackdropAnimationTimeout",
    value: function clearBackdropAnimationTimeout() {
      if (this._backdropAnimationTimeout) {
        clearTimeout(this._backdropAnimationTimeout);
        this._backdropAnimationTimeout = undefined;
      }
    }
  }, {
    key: "renderModalDialog",
    value: function renderModalDialog() {
      var _classNames,
        _this3 = this;
      var attributes = (0,utils.omit)(this.props, propsToOmit);
      var dialogBaseClass = 'modal-dialog';
      return /*#__PURE__*/react.createElement("div", _extends({}, attributes, {
        className: (0,utils.mapToCssModules)(classnames_default()(dialogBaseClass, this.props.className, (_classNames = {}, _defineProperty(_classNames, "modal-".concat(this.props.size), this.props.size), _defineProperty(_classNames, "".concat(dialogBaseClass, "-centered"), this.props.centered), _defineProperty(_classNames, "".concat(dialogBaseClass, "-scrollable"), this.props.scrollable), _defineProperty(_classNames, 'modal-fullscreen', this.props.fullscreen === true), _defineProperty(_classNames, "modal-fullscreen-".concat(this.props.fullscreen, "-down"), typeof this.props.fullscreen === 'string'), _classNames)), this.props.cssModule),
        role: "document",
        ref: function ref(c) {
          _this3._dialog = c;
        }
      }), /*#__PURE__*/react.createElement("div", {
        className: (0,utils.mapToCssModules)(classnames_default()('modal-content', this.props.contentClassName), this.props.cssModule)
      }, this.props.children));
    }
  }, {
    key: "render",
    value: function render() {
      var unmountOnClose = this.props.unmountOnClose;
      if (!!this._element && (this.state.isOpen || !unmountOnClose)) {
        var isModalHidden = !!this._element && !this.state.isOpen && !unmountOnClose;
        this._element.style.display = isModalHidden ? 'none' : 'block';
        var _this$props2 = this.props,
          wrapClassName = _this$props2.wrapClassName,
          modalClassName = _this$props2.modalClassName,
          backdropClassName = _this$props2.backdropClassName,
          cssModule = _this$props2.cssModule,
          isOpen = _this$props2.isOpen,
          backdrop = _this$props2.backdrop,
          role = _this$props2.role,
          labelledBy = _this$props2.labelledBy,
          external = _this$props2.external,
          innerRef = _this$props2.innerRef;
        var modalAttributes = {
          onClick: this.handleBackdropClick,
          onMouseDown: this.handleBackdropMouseDown,
          onKeyUp: this.handleEscape,
          onKeyDown: this.handleTab,
          style: {
            display: 'block'
          },
          'aria-labelledby': labelledBy,
          'aria-modal': true,
          role: role,
          tabIndex: '-1'
        };
        var hasTransition = this.props.fade;
        var modalTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade["default"].defaultProps), this.props.modalTransition), {}, {
          baseClass: hasTransition ? this.props.modalTransition.baseClass : '',
          timeout: hasTransition ? this.props.modalTransition.timeout : 0
        });
        var backdropTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade["default"].defaultProps), this.props.backdropTransition), {}, {
          baseClass: hasTransition ? this.props.backdropTransition.baseClass : '',
          timeout: hasTransition ? this.props.backdropTransition.timeout : 0
        });
        var Backdrop = backdrop && (hasTransition ? /*#__PURE__*/react.createElement(Fade["default"], _extends({}, backdropTransition, {
          "in": isOpen && !!backdrop,
          cssModule: cssModule,
          className: (0,utils.mapToCssModules)(classnames_default()('modal-backdrop', backdropClassName), cssModule)
        })) : /*#__PURE__*/react.createElement("div", {
          className: (0,utils.mapToCssModules)(classnames_default()('modal-backdrop', 'show', backdropClassName), cssModule)
        }));
        return /*#__PURE__*/react.createElement(Portal["default"], {
          node: this._element
        }, /*#__PURE__*/react.createElement("div", {
          className: (0,utils.mapToCssModules)(wrapClassName)
        }, /*#__PURE__*/react.createElement(Fade["default"], _extends({}, modalAttributes, modalTransition, {
          "in": isOpen,
          onEntered: this.onOpened,
          onExited: this.onClosed,
          cssModule: cssModule,
          className: (0,utils.mapToCssModules)(classnames_default()('modal', modalClassName, this.state.showStaticBackdropAnimation && 'modal-static'), cssModule),
          innerRef: innerRef
        }), external, this.renderModalDialog()), Backdrop));
      }
      return null;
    }
  }]);
  return Modal;
}(react.Component);
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
Modal.openCount = 0;
Modal.originalBodyOverflow = null;
/* harmony default export */ var esm_Modal = (Modal);
;// ./node_modules/@appfolio/react-gears/esm/components/Modal/Modal.js
var _excluded = ["backdrop", "fade", "zIndex"];
function Modal_extends() { return Modal_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, Modal_extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }


var Modal_Modal = _ref => {
  var _ref$backdrop = _ref.backdrop,
    backdrop = _ref$backdrop === void 0 ? false : _ref$backdrop,
    _ref$fade = _ref.fade,
    fade = _ref$fade === void 0 ? false : _ref$fade,
    _ref$zIndex = _ref.zIndex,
    zIndex = _ref$zIndex === void 0 ? 10050 : _ref$zIndex,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/react.createElement(esm_Modal, Modal_extends({}, props, {
    backdrop: backdrop,
    fade: fade,
    zIndex: zIndex
  }));
};
Modal_Modal.displayName = "Modal";
/* harmony default export */ var components_Modal_Modal = (Modal_Modal);

/***/ })

}]);